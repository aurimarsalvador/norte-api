CREATE TABLE profession_feedbacks (
    id BIGSERIAL PRIMARY KEY,

    student_id BIGINT NOT NULL,

    profession_id BIGINT NOT NULL,

    interest_level VARCHAR(20) NOT NULL,

    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_profession_feedbacks_student
        FOREIGN KEY (student_id)
        REFERENCES students (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profession_feedbacks_profession
        FOREIGN KEY (profession_id)
        REFERENCES professions (id)
        ON DELETE CASCADE,

    CONSTRAINT ck_profession_feedbacks_interest_level
        CHECK (interest_level IN ('FAVORITE', 'NEUTRAL', 'NOT_INTERESTED')),

    -- Um feedback por aluno por profissao: novo envio faz upsert.
    CONSTRAINT uq_profession_feedbacks_student_profession
        UNIQUE (student_id, profession_id)
);

CREATE INDEX idx_profession_feedbacks_student ON profession_feedbacks (student_id);
