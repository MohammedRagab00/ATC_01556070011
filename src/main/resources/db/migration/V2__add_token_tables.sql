create table token
(
    id           BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id      BIGINT      NOT NULL
        CONSTRAINT user_foreign_key
            REFERENCES users
            ON DELETE CASCADE,
    created_at   TIMESTAMP,
    expires_at   TIMESTAMP,
    validated_at TIMESTAMP,
    token        VARCHAR(40) NOT NULL,
    type         SMALLINT    NOT NULL
);

CREATE TABLE refresh_token
(
    id                 BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    revoked            BOOLEAN      NOT NULL,
    user_id            BIGINT       NOT NULL
        CONSTRAINT user_foreign_key
            REFERENCES users
            ON DELETE CASCADE,
    created_date       TIMESTAMP    NOT NULL,
    last_modified_date TIMESTAMP,
    token              VARCHAR(255) NOT NULL UNIQUE
);
