CREATE TABLE micro_experiences (
    id BIGSERIAL PRIMARY KEY,

    profession_id BIGINT NOT NULL,

    title VARCHAR(160) NOT NULL,

    instructions TEXT NOT NULL,

    estimated_minutes INTEGER NOT NULL,

    CONSTRAINT fk_micro_experiences_profession
        FOREIGN KEY (profession_id)
        REFERENCES professions (id)
        ON DELETE CASCADE,

    CONSTRAINT ck_micro_experiences_estimated_minutes
        CHECK (estimated_minutes > 0)
);

CREATE INDEX idx_micro_experiences_profession ON micro_experiences (profession_id);

CREATE TABLE micro_experience_responses (
    id BIGSERIAL PRIMARY KEY,

    micro_experience_id BIGINT NOT NULL,

    student_id BIGINT NOT NULL,

    enjoyment_rating INTEGER NOT NULL,

    difficulty_rating INTEGER NOT NULL,

    notes VARCHAR(1000),

    responded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_micro_experience_responses_experience
        FOREIGN KEY (micro_experience_id)
        REFERENCES micro_experiences (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_micro_experience_responses_student
        FOREIGN KEY (student_id)
        REFERENCES students (id)
        ON DELETE CASCADE,

    CONSTRAINT ck_micro_experience_responses_enjoyment
        CHECK (enjoyment_rating BETWEEN 1 AND 5),

    CONSTRAINT ck_micro_experience_responses_difficulty
        CHECK (difficulty_rating BETWEEN 1 AND 5),

    CONSTRAINT uq_micro_experience_responses_student_experience
        UNIQUE (micro_experience_id, student_id)
);

CREATE INDEX idx_micro_experience_responses_student ON micro_experience_responses (student_id);
