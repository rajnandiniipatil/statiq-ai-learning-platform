package org.statiq.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.statiq.dto.*;
import org.statiq.entity.*;
import org.statiq.enums.RoleName;
import org.statiq.exception.BadRequestException;
import org.statiq.exception.ResourceNotFoundException;
import org.statiq.repository.*;
import org.statiq.security.JwtTokenProvider;
import org.statiq.security.UserPrincipal;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final LearnerProfileRepository learnerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            DepartmentRepository departmentRepository,
            LearnerProfileRepository learnerProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.learnerProfileRepository = learnerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail().trim().toLowerCase(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        AuthResponse response = new AuthResponse(
                jwt,
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getFullName(),
                roles
        );

        learnerProfileRepository.findByUserId(userPrincipal.getId()).ifPresent(profile -> {
            response.setProfileId(profile.getId());
            response.setEmployeeId(profile.getEmployeeId());
            response.setDesignation(profile.getDesignation());
            response.setJobRole(profile.getJobRole());
            if (profile.getDepartment() != null) {
                response.setDepartmentName(profile.getDepartment().getName());
            }
        });

        return response;
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        String email = registerRequest.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered: " + email);
        }

        User user = new User(
                email,
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFullName()
        );

        RoleName roleName = RoleName.ROLE_LEARNER;
        if (registerRequest.getRole() != null) {
            String requested = registerRequest.getRole().toUpperCase();
            if (requested.contains("ADMIN")) {
                roleName = RoleName.ROLE_ADMIN;
            } else if (requested.contains("TRAINER")) {
                roleName = RoleName.ROLE_TRAINER;
            }
        }

        final RoleName targetRoleName = roleName;
        Role userRole = roleRepository.findByName(targetRoleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + targetRoleName));
        user.setRoles(new HashSet<>(Collections.singletonList(userRole)));

        User savedUser = userRepository.save(user);

        // If registered as learner or trainer, create a profile
        LearnerProfile profile = new LearnerProfile();
        profile.setUser(savedUser);
        profile.setEmployeeId(registerRequest.getEmployeeId() != null && !registerRequest.getEmployeeId().isBlank() 
                ? registerRequest.getEmployeeId() 
                : "EMP-" + System.currentTimeMillis() % 1000000);
        profile.setDesignation(registerRequest.getDesignation() != null ? registerRequest.getDesignation() : "Statistical Officer");
        profile.setJobRole(registerRequest.getJobRole() != null ? registerRequest.getJobRole() : "Statistical Analyst");
        profile.setEducationalQualification(registerRequest.getEducationalQualification());
        profile.setYearsOfExperience(registerRequest.getYearsOfExperience() != null ? registerRequest.getYearsOfExperience() : 2);
        profile.setCurrentAssignment(registerRequest.getCurrentAssignment());
        profile.setCareerInterests(registerRequest.getCareerInterests());

        if (registerRequest.getDepartmentId() != null) {
            departmentRepository.findById(registerRequest.getDepartmentId()).ifPresent(profile::setDepartment);
        } else {
            departmentRepository.findByCode("NSSO-SED").ifPresent(profile::setDepartment);
        }

        LearnerProfile savedProfile = learnerProfileRepository.save(profile);

        // Auto authenticate after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, registerRequest.getPassword())
        );
        String jwt = tokenProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                List.of(roleName.name())
        );
        response.setProfileId(savedProfile.getId());
        response.setEmployeeId(savedProfile.getEmployeeId());
        response.setDesignation(savedProfile.getDesignation());
        response.setJobRole(savedProfile.getJobRole());
        if (savedProfile.getDepartment() != null) {
            response.setDepartmentName(savedProfile.getDepartment().getName());
        }

        return response;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUserProfile(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfileDto dto = new UserProfileDto();
        dto.setUserId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRoles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList()));

        learnerProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
            dto.setProfileId(profile.getId());
            dto.setEmployeeId(profile.getEmployeeId());
            dto.setDesignation(profile.getDesignation());
            dto.setJobRole(profile.getJobRole());
            dto.setEducationalQualification(profile.getEducationalQualification());
            dto.setYearsOfExperience(profile.getYearsOfExperience());
            dto.setCurrentAssignment(profile.getCurrentAssignment());
            dto.setPreviousTraining(profile.getPreviousTraining());
            dto.setCareerInterests(profile.getCareerInterests());
            if (profile.getDepartment() != null) {
                dto.setDepartmentId(profile.getDepartment().getId());
                dto.setDepartmentName(profile.getDepartment().getName());
                dto.setDepartmentCode(profile.getDepartment().getCode());
            }
        });

        return dto;
    }
}
