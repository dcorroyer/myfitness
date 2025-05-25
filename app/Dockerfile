#syntax=docker/dockerfile:1.4

FROM dunglas/frankenphp:1.5.0-php8.4-bookworm AS builder

ENV DOCKER_STAGE=builder

USER root

RUN set -eux; \
    install-php-extensions \
        apcu \
        intl \
        opcache \
        zip \
        pdo_mysql \
        redis \
    ;

RUN rm -rf /usr/local/bin/phpdbg /usr/local/bin/php-cgi

FROM builder AS builder-dev

ENV DOCKER_STAGE=builder-dev

RUN set -eux; \
    install-php-extensions \
        xdebug \
    ;

FROM debian:bookworm-20250203-slim AS base

ARG UID=1000
ARG GID=1000
ARG BUILD_TIME
ENV BUILD_TIME=$BUILD_TIME
ARG VERSION="N/A"
ENV VERSION=$VERSION
ENV USER=appuser
ENV HOME=/home/${USER}
ENV DOCKER_STAGE=base
ENV DEBIAN_FRONTEND=noninteractive \
    SERVER_NAME=":80" \
    XDG_CONFIG_HOME=${HOME}/.config \
    XDG_DATA_HOME=${HOME}/.local/share \
    XDG_RUNTIME_DIR=${HOME}/.local/run \
    XDG_CACHE_HOME=${HOME}/.cache

WORKDIR /app

COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /usr/local/etc /usr/local/etc
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=composer:2.8.5 /usr/bin/composer /usr/local/bin/composer

# Install Node.js and npm for Laravel Vite
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get update && \
    apt-get install -yqq --no-install-recommends  \
    libcap2-bin \
    curl \
    libbrotli1 \
    libxml2 \
    libsqlite3-0 \
    libcurl4 \
    libonig5 \
    libargon2-1 \
    libsodium23 \
    libzip4 \
    unzip \
    httping \
    libreadline8 \
    nodejs \
    npm && \
    apt-get install --reinstall ca-certificates && \
    apt autoremove -qy && \
    apt clean && \
    apt autoclean && \
    rm -rf /var/lib/apt/lists/*

# Remove default user and group
RUN deluser ${USER} || true \
    && delgroup ${USER} || true

# Create new user and group with the specified IDs, if they don't already exist
RUN if ! getent group ${GID} ; then groupadd -g ${GID} ${USER} ; else groupadd -g 9999 ${USER} ; fi \
    && if ! id -u ${UID} > /dev/null 2>&1 ; then useradd -u ${UID} -ms /bin/bash -g ${USER} ${USER} ; fi

# Run frankenphp as non-root user and add permissions
RUN mkdir -p ${XDG_CONFIG_HOME} ${XDG_DATA_HOME} ${XDG_RUNTIME_DIR} ${XDG_CACHE_HOME} && \
    mkdir -p /data/caddy /config/caddy && \
    chown -R ${USER}:${USER} /app /data/caddy /config/caddy \
        ${XDG_CONFIG_HOME} ${XDG_DATA_HOME} ${XDG_RUNTIME_DIR} ${XDG_CACHE_HOME} && \
    chmod -R 700 /app /data/caddy /config/caddy && \
    # Allow frankenphp to bind to privileged ports
    setcap -r /usr/local/bin/frankenphp;

ENV PHP_INI_DIR=/usr/local/etc/php
ENV PHP_INI_SCAN_DIR=":$PHP_INI_DIR/app.conf.d"
ENV COMPOSER_ALLOW_SUPERUSER=1 COMPOSER_MEMORY_LIMIT=-1

COPY --link --chown=${UID}:${GID} ./.docker/conf.d/common $PHP_INI_DIR/app.conf.d/
COPY --link --chown=${UID}:${GID} ./.docker/caddy/Caddyfile /etc/caddy/Caddyfile

RUN mkdir -p /docker-scripts/build /docker-scripts/runtime
COPY --link --chown=${UID}:${GID} .docker/scripts/build/run.sh /docker-scripts/build/run.sh
COPY --link --chown=${UID}:${GID} .docker/entrypoint.sh /usr/local/bin/entrypoint

RUN chmod +x /usr/local/bin/entrypoint

ENTRYPOINT [ "entrypoint" ]

HEALTHCHECK --start-period=60s CMD curl -f http://localhost:2019/metrics || exit 1
CMD [ "frankenphp", "run", "--config", "/etc/caddy/Caddyfile" ]

FROM base AS dev

ENV DOCKER_STAGE=dev FRANKENPHP_WORKER_CONFIG=watch

USER root

COPY --link --chown=${UID}:${GID} .docker/conf.d/dev $PHP_INI_DIR/app.conf.d/

COPY --from=builder-dev /usr/local/bin /usr/local/bin
COPY --from=builder-dev /usr/local/etc /usr/local/etc
COPY --from=builder-dev /usr/local/lib /usr/local/lib

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    bash \
    fish \
    acl \
    file \
    gettext \
    git

COPY --link --chown=${UID}:${GID} ./.docker/scripts/build/${DOCKER_STAGE} /docker-scripts/build
COPY --link --chown=${UID}:${GID} ./.docker/scripts/runtime/${DOCKER_STAGE} /docker-scripts/runtime

RUN for file in /docker-scripts/build/*.sh; do \
        chmod +x $file; \
    done; \
    for file in /docker-scripts/runtime/*.sh; do \
        chmod +x $file; \
    done

RUN /docker-scripts/build/run.sh

USER ${USER}

CMD [ "frankenphp", "run", "--config", "/etc/caddy/Caddyfile", "--watch" ]

FROM dev AS ci

USER root

FROM base AS prod

ENV DOCKER_STAGE=prod
ENV APP_ENV=prod

USER root

COPY --link --chown=${UID}:${GID} ./.docker/conf.d/prod $PHP_INI_DIR/app.conf.d/

# prevent the reinstallation of vendors at every changes in the source code
COPY --link composer.* ./
COPY --link package*.json ./
RUN set -eux; \
	composer install --no-cache --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress && \
	npm ci --only=production

# copy sources
COPY --link . ./

COPY --link --chown=${UID}:${GID} ./.docker/scripts/build/${DOCKER_STAGE} /docker-scripts/build
COPY --link --chown=${UID}:${GID} ./.docker/scripts/runtime/${DOCKER_STAGE} /docker-scripts/runtime

RUN for file in /docker-scripts/build/*.sh; do \
        chmod +x $file; \
    done; \
    for file in /docker-scripts/runtime/*.sh; do \
        chmod +x $file; \
    done

RUN /docker-scripts/build/run.sh

USER ${USER}