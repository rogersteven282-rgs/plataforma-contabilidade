FROM node:22-slim

WORKDIR /app

# python3/make/g++ ficam só como rede de segurança: o better-sqlite3 normalmente
# baixa um binário pré-compilado para Linux, mas se não houver um disponível
# para esta combinação de arquitetura/versão do Node, compila aqui sem drama
# (ao contrário do Windows, aqui não há problema de "find VS").
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p /app/data

EXPOSE 4000

# Corre o seed sempre (é idempotente: se já houver dados, sai sem fazer nada)
# e depois arranca o servidor.
CMD ["sh", "-c", "node src/seed.js && node src/server.js"]
