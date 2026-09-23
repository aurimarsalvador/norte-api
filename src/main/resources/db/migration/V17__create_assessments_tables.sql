CREATE TABLE assessments (
    id BIGSERIAL PRIMARY KEY,

    student_id BIGINT NOT NULL,

    status VARCHAR(20) NOT NULL,

    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    completed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_assessments_student
        FOREIGN KEY (student_id)
        REFERENCES students (id)
        ON DELETE CASCADE,

    CONSTRAINT ck_assessments_status
        CHECK (status IN ('IN_PROGRESS', 'COMPLETED')),

    CONSTRAINT ck_assessments_completed_at
        CHECK ((status = 'COMPLETED') = (completed_at IS NOT NULL))
);

CREATE INDEX idx_assessments_student_status ON assessments (student_id, status);

CREATE TABLE assessment_answers (
    id BIGSERIAL PRIMARY KEY,

    assessment_id BIGINT NOT NULL,

    question_id BIGINT NOT NULL,

    answer_option_id BIGINT NOT NULL,

    answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_assessment_answers_assessment
        FOREIGN KEY (assessment_id)
        REFERENCES assessments (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assessment_answers_question
        FOREIGN KEY (question_id)
        REFERENCES questions (id),

    CONSTRAINT fk_assessment_answers_option
        FOREIGN KEY (answer_option_id)
        REFERENCES answer_options (id),

    -- Re-responder a mesma questao atualiza a linha em vez de acumular respostas.
    CONSTRAINT uq_assessment_answers_assessment_question
        UNIQUE (assessment_id, question_id)
);

CREATE INDEX idx_assessment_answers_assessment ON assessment_answers (assessment_id);
