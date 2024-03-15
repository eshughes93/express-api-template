FROM postgres:13.6-alpine
# Based on https://gist.github.com/jgould22/3280fc0f531485f4fe19a2ef1ef67361

ENV PG_PARTMAN_VERSION v4.6.0
ENV PG_CRON_VERSION v1.4.2

# Install build tools
RUN set -ex \
    \
    && apk add --no-cache --virtual .fetch-deps \
    ca-certificates \
    openssl \
    tar \
    && apk add --no-cache --virtual .build-deps \
    autoconf \
    automake \
    g++ \
    clang \
    llvm \
    libtool \
    libxml2-dev \
    make \
    perl

# Install pg_partman
RUN set -ex \
    && wget -O pg_partman.tar.gz "https://github.com/pgpartman/pg_partman/archive/$PG_PARTMAN_VERSION.tar.gz" \
    && mkdir -p /usr/src/pg_partman \
    && tar \
    --extract \
    --file pg_partman.tar.gz \
    --directory /usr/src/pg_partman \
    --strip-components 1 \
    && rm pg_partman.tar.gz \
    && cd /usr/src/pg_partman \
    && make \
    && make install \
    && cd / \
    && rm -rf /usr/src/pg_partman

# Install pg_cron
RUN set -ex \
    && wget -O pg_cron.tar.gz https://github.com/citusdata/pg_cron/archive/$PG_CRON_VERSION.tar.gz \
    && mkdir -p /usr/src/pg_cron \
    && tar \
    --extract \
    --file pg_cron.tar.gz \
    --directory /usr/src/pg_cron \
    --strip-components 1 \
    && rm pg_cron.tar.gz \
    && cd /usr/src/pg_cron \
    && make \
    && make install \
    && cd / \
    && rm -rf /usr/src/pg_cron


# Cleanup
RUN set -ex \
    && apk del .fetch-deps .build-deps