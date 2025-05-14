CREATE TABLE users
(
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email               VARCHAR(50) UNIQUE NOT NULL,
    password_hash       TEXT               NOT NULL,
    firstname           VARCHAR(20)        NOT NULL,
    lastname            VARCHAR(20)        NOT NULL,
    date_of_birth       DATE               NOT NULL
        CONSTRAINT chk_minimum_age
            CHECK (date_of_birth <= (CURRENT_DATE - '13 years'::INTERVAL)),
    gender              SMALLINT
        CONSTRAINT chk_gender_values
            CHECK ((gender >= 0) AND (gender <= 2)),
    enabled             BOOLEAN            NOT NULL DEFAULT FALSE,
    profile_picture_url TEXT,
    is_admin            BOOLEAN            NOT NULL DEFAULT FALSE,
    created_date        TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date  TIMESTAMP
);

CREATE TABLE categories
(
    id                 BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name               VARCHAR(20) UNIQUE NOT NULL,
    created_date       TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,
    created_by         BIGINT             NOT NULL,
    last_modified_by   BIGINT
);

CREATE TABLE events
(
    id                 BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name               VARCHAR(50)    NOT NULL,
    description        TEXT,
    category_id        BIGINT         REFERENCES categories (id) ON DELETE SET NULL,
    date               TIMESTAMP      NOT NULL,
    venue              TEXT           NOT NULL,
    price              NUMERIC(10, 2) NOT NULL,
    image_url          TEXT,
    created_date       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,
    created_by         BIGINT         NOT NULL,
    last_modified_by   BIGINT
);

CREATE TABLE bookings
(
    id                 BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id            BIGINT REFERENCES users (id) ON DELETE CASCADE,
    event_id           BIGINT REFERENCES events (id) ON DELETE CASCADE,
    booked_at          TIMESTAMP          DEFAULT CURRENT_TIMESTAMP,
    created_date       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,
    created_by         BIGINT    NOT NULL,
    last_modified_by   BIGINT
);

CREATE TABLE tags
(
    id                 BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name               TEXT UNIQUE NOT NULL,
    created_date       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,
    created_by         BIGINT      NOT NULL,
    last_modified_by   BIGINT
);

CREATE TABLE event_tags
(
    id                 BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id           BIGINT REFERENCES events (id) ON DELETE CASCADE,
    tag_id             BIGINT REFERENCES tags (id) ON DELETE CASCADE,
    created_date       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP,
    created_by         BIGINT    NOT NULL,
    last_modified_by   BIGINT
);
