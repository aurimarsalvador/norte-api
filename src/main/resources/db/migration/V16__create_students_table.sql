-- Coleta minima exigida pela LGPD: so o necessario para identificar o aluno e
-- contextualizar a jornada. Nada clinico, nada sensivel.
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    email VARCHAR(180) NOT NULL,

    password_hash VARCHAR(100) NOT NULL,

    school_year INTEGER NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_students_email UNIQUE (email),

    CONSTRAINT ck_students_school_year CHECK (school_year BETWEEN 1 AND 3)
);
