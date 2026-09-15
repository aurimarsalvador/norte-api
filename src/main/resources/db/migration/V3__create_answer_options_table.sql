CREATE TABLE answer_options (
    id BIGSERIAL PRIMARY KEY,

    question_id BIGINT NOT NULL,

    text VARCHAR(300) NOT NULL,

    display_order INTEGER NOT NULL,

    CONSTRAINT fk_answer_options_question
      FOREIGN KEY (question_id)
      REFERENCES questions(id)
      ON DELETE CASCADE,

   CONSTRAINT uq_answer_options_question_order
     UNIQUE (question_id, display_order)
);