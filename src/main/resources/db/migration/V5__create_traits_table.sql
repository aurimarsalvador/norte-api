CREATE TABLE traits (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(60) NOT NULL,

    name VARCHAR(120) NOT NULL,

    description VARCHAR(500) NOT NULL,

    CONSTRAINT uq_traits_code UNIQUE (code)
);
