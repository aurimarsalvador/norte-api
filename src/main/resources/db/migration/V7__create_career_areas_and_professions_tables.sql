CREATE TABLE career_areas (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(60) NOT NULL,

    name VARCHAR(120) NOT NULL,

    description VARCHAR(500) NOT NULL,

    CONSTRAINT uq_career_areas_code UNIQUE (code)
);

CREATE TABLE professions (
    id BIGSERIAL PRIMARY KEY,

    career_area_id BIGINT NOT NULL,

    code VARCHAR(60) NOT NULL,

    name VARCHAR(120) NOT NULL,

    summary VARCHAR(300) NOT NULL,

    description TEXT NOT NULL,

    typical_activities TEXT NOT NULL,

    education_path TEXT NOT NULL,

    CONSTRAINT uq_professions_code UNIQUE (code),

    CONSTRAINT fk_professions_career_area
        FOREIGN KEY (career_area_id)
        REFERENCES career_areas (id)
);

CREATE INDEX idx_professions_career_area ON professions (career_area_id);
