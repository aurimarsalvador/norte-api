package br.com.norte.norte_api.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "professions")
public class Profession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "career_area_id", nullable = false)
    private CareerArea careerArea;

    @Column(nullable = false, length = 60)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 300)
    private String summary;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(name = "typical_activities", nullable = false, columnDefinition = "text")
    private String typicalActivities;

    @Column(name = "education_path", nullable = false, columnDefinition = "text")
    private String educationPath;

    protected Profession() {
    }

    public Profession(CareerArea careerArea, String code, String name, String summary,
                      String description, String typicalActivities, String educationPath) {
        this.careerArea = careerArea;
        this.code = code;
        this.name = name;
        this.summary = summary;
        this.description = description;
        this.typicalActivities = typicalActivities;
        this.educationPath = educationPath;
    }

    public Long getId() {
        return id;
    }

    public CareerArea getCareerArea() {
        return careerArea;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getSummary() {
        return summary;
    }

    public String getDescription() {
        return description;
    }

    public String getTypicalActivities() {
        return typicalActivities;
    }

    public String getEducationPath() {
        return educationPath;
    }
}
