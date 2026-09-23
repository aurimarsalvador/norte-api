CREATE TABLE option_trait_weights (
    id BIGSERIAL PRIMARY KEY,

    answer_option_id BIGINT NOT NULL,

    trait_id BIGINT NOT NULL,

    weight INTEGER NOT NULL,

    CONSTRAINT fk_option_trait_weights_option
        FOREIGN KEY (answer_option_id)
        REFERENCES answer_options (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_option_trait_weights_trait
        FOREIGN KEY (trait_id)
        REFERENCES traits (id),

    CONSTRAINT ck_option_trait_weights_weight
        CHECK (weight BETWEEN 1 AND 5),

    CONSTRAINT uq_option_trait_weights_option_trait
        UNIQUE (answer_option_id, trait_id)
);

CREATE INDEX idx_option_trait_weights_option ON option_trait_weights (answer_option_id);
CREATE INDEX idx_option_trait_weights_trait ON option_trait_weights (trait_id);
