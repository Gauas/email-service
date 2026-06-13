FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

FROM node:22-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

RUN apk add --no-cache tini && \
    addgroup -S app && adduser -S -G app app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY main.ts ./main.ts
COPY config ./config
COPY consumer ./consumer
COPY controller ./controller
COPY dto ./dto
COPY infra ./infra
COPY kernel ./kernel
COPY mailer ./mailer
COPY middlewares ./middlewares
COPY packages ./packages
COPY route ./route
COPY service ./service
COPY template ./template
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh && \
    chown -R app:app /app

USER app

EXPOSE 8083

ENTRYPOINT ["/sbin/tini", "--", "./entrypoint.sh"]
