FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
  ffmpeg \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=8080
CMD ["npx", "functions-framework", "--target=helloHttp", "--port=8080"]
