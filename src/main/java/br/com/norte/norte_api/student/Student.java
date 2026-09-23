package br.com.norte.norte_api.student;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Estudante cadastrado.
 *
 * <p>Coleta minima por decisao de projeto (LGPD): nome, e-mail, senha e ano escolar. Nada de
 * dado clinico, sensivel ou de terceiros. O hash da senha nunca sai daqui: nenhum DTO o expoe
 * e {@link #toString()} nao o imprime.
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(name = "school_year", nullable = false)
    private Integer schoolYear;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Student() {
    }

    public Student(String name, String email, String passwordHash, Integer schoolYear) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.schoolYear = schoolYear;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Integer getSchoolYear() {
        return schoolYear;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    @Override
    public String toString() {
        return "Student{id=" + id + ", email=" + email + "}";
    }
}
