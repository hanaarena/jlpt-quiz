FROM node:18.19.0-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm@9.1.0

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM node:18.19.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV QUIZ_ENDPOINT=http://localhost:8787

RUN npm install -g pnpm@9.1.0
RUN pnpm run docker:build

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/out .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]