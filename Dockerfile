FROM oven/bun:1-alpine

WORKDIR /app

COPY backend/package.json backend/tsconfig.json ./

RUN bun install

COPY backend/src ./src
COPY backend/.env.example ./

RUN bun build src/server.ts --outdir dist --target node

EXPOSE 3000

CMD ["bun", "run", "dist/server.js"]
