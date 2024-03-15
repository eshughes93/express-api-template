DO
$do$
BEGIN
   IF EXISTS (SELECT FROM pg_database WHERE datname = 'backend_service') THEN
      RAISE NOTICE 'Database already exists';  -- optional
   ELSE
    CREATE DATABASE backend_service;
   END IF;
END
$do$;