ALTER TABLE questions ADD COLUMN code VARCHAR(60);
ALTER TABLE questions ADD COLUMN display_order INTEGER;
ALTER TABLE questions ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;

-- Backfill da questao que ja existia desde a V2.
UPDATE questions
   SET code = 'Q01_PROBLEMA_TRAVADO',
       display_order = 1
 WHERE text = 'Quando alguma coisa não funciona, o que você sente mais vontade de fazer?';

-- Rede de seguranca para qualquer linha inserida a mao antes desta migration.
UPDATE questions SET code = 'QUESTAO_' || id WHERE code IS NULL;
UPDATE questions SET display_order = id WHERE display_order IS NULL;

ALTER TABLE questions ALTER COLUMN code SET NOT NULL;
ALTER TABLE questions ALTER COLUMN display_order SET NOT NULL;

ALTER TABLE questions ADD CONSTRAINT uq_questions_code UNIQUE (code);

CREATE INDEX idx_questions_active_order ON questions (active, display_order);
