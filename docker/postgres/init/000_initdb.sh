#!/bin/bash -e

# This file needs to be in the docker-entrypoint-initdb.d directory of the postgres docker container.
# It will be executed upon initialization of the container (only the first time - if you want to re-run this you need to remove the volume).

# This configuration is needed to use the pg_cron extension.
echo "Configuring cron extension"
echo "Configuring cron.database_name = '$POSTGRES_DB'"
echo "cron.database_name = '$POSTGRES_DB'" >> $PGDATA/postgresql.conf
echo "shared_preload_libraries='pg_cron'" >> $PGDATA/postgresql.conf

# Restart so config changes will take effect
pg_ctl restart
