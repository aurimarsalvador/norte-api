-- Indices das FKs mais consultadas pelos endpoints de leitura (perfil, recomendacoes,
-- meu caminho). O Postgres nao cria indice de FK automaticamente.
CREATE INDEX idx_assessment_answers_option ON assessment_answers (answer_option_id);
CREATE INDEX idx_assessment_answers_question ON assessment_answers (question_id);
CREATE INDEX idx_profession_feedbacks_profession ON profession_feedbacks (profession_id);
CREATE INDEX idx_micro_experience_responses_experience ON micro_experience_responses (micro_experience_id);
