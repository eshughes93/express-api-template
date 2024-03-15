-- Revert backend_service:2022.10.07_15.40.29-base_tables_migrate from pg

BEGIN;

DROP TABLE IF EXISTS example_contact;

COMMIT;
