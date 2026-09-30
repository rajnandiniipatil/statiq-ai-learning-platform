package org.statiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.statiq.entity.UploadedMaterial;
import org.statiq.entity.User;
import java.util.List;

@Repository
public interface UploadedMaterialRepository extends JpaRepository<UploadedMaterial, Long> {
    List<UploadedMaterial> findByUploaderOrderByUploadedAtDesc(User uploader);
    List<UploadedMaterial> findAllByOrderByUploadedAtDesc();
}
