-- Deploy backend_service:2022.10.07_15.40.29-base_tables_migrate to pg

BEGIN;

CREATE TABLE example_contact
(
    id          UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    first_name        varchar(64) NOT NULL,
    last_name        varchar(64) NOT NULL,
    email       varchar(64) NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT NOW(),
    updated_at  timestamptz NOT NULL DEFAULT NOW()
);

COMMIT;
