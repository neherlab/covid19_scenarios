FROM node:12.16.1-alpine3.11

ENV DOCKERIZE_VERSION v0.6.1
ENV DOCKERIZE_URL "https://github.com/jwilder/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-alpine-linux-amd64-${DOCKERIZE_VERSION}.tar.gz"

RUN apk add --update --no-cache \
  curl \
  git \
> /dev/null

RUN curl -fsSL "${DOCKERIZE_URL}" | tar xfz - -C "/usr/local/bin/"

ENTRYPOINT ["docker-entrypoint.sh"]

CMD [ "node" ]
