package org.statiq.dto;

import org.statiq.enums.CompetencyCategory;

public class CompetencyDto {

    private Integer id;
    private String code;
    private String name;
    private CompetencyCategory category;
    private String categoryLabel;
    private String description;

    public CompetencyDto() {}

    public CompetencyDto(Integer id, String code, String name, CompetencyCategory category, String description) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.category = category;
        this.categoryLabel = category != null ? category.name().replace("_", " ") : "";
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CompetencyCategory getCategory() {
        return category;
    }

    public void setCategory(CompetencyCategory category) {
        this.category = category;
        this.categoryLabel = category != null ? category.name().replace("_", " ") : "";
    }

    public String getCategoryLabel() {
        return categoryLabel;
    }

    public void setCategoryLabel(String categoryLabel) {
        this.categoryLabel = categoryLabel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
