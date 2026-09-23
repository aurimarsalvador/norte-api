CREATE TABLE profession_traits (
    id BIGSERIAL PRIMARY KEY,

    profession_id BIGINT NOT NULL,

    trait_id BIGINT NOT NULL,

    weight INTEGER NOT NULL,

    CONSTRAINT fk_profession_traits_profession
        FOREIGN KEY (profession_id)
        REFERENCES professions (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profession_traits_trait
        FOREIGN KEY (trait_id)
        REFERENCES traits (id),

    CONSTRAINT ck_profession_traits_weight
        CHECK (weight BETWEEN 1 AND 5),

    CONSTRAINT uq_profession_traits_profession_trait
        UNIQUE (profession_id, trait_id)
);

CREATE INDEX idx_profession_traits_profession ON profession_traits (profession_id);
CREATE INDEX idx_profession_traits_trait ON profession_traits (trait_id);
