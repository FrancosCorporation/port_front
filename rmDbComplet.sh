#!/bin/bash
set -e

echo "🧹 Iniciando remoção completa do Docker e MongoDB..."

# -----------------------------
# 1️⃣ Para todos os containers
# -----------------------------
if [ "$(docker ps -aq)" ]; then
    echo "⏹ Parando todos os containers..."
    docker stop $(docker ps -aq) || true

    echo "🗑 Removendo todos os containers..."
    docker rm $(docker ps -aq) || true
else
    echo "ℹ️ Nenhum container encontrado."
fi

# -----------------------------
# 2️⃣ Remove todos os volumes
# -----------------------------
if [ "$(docker volume ls -q)" ]; then
    echo "🗑 Removendo todos os volumes Docker..."
    docker volume rm $(docker volume ls -q) || true
else
    echo "ℹ️ Nenhum volume encontrado."
fi

# -----------------------------
# 3️⃣ Remove imagem MongoDB
# -----------------------------
if [ "$(docker images -q mongo:latest)" ]; then
    echo "🖼 Removendo imagem mongo:latest..."
    docker rmi mongo:latest || true
else
    echo "ℹ️ Imagem mongo:latest não encontrada."
fi

# -----------------------------
# 4️⃣ Desinstala MongoDB do sistema
# -----------------------------
if command -v mongod &> /dev/null; then
    echo "🚫 Desinstalando MongoDB do sistema..."
    apt-get purge -y mongodb-org* mongodb* || true
    apt-get autoremove -y
    rm -rf /var/lib/mongodb /etc/mongod.conf /var/log/mongodb || true
    echo "✅ MongoDB desinstalado do sistema."
else
    echo "ℹ️ MongoDB não encontrado no sistema."
fi

# -----------------------------
# 5️⃣ Desinstala Docker do sistema
# -----------------------------
if command -v docker &> /dev/null; then
    echo "🚫 Desinstalando Docker do sistema..."
    apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker.io || true
    apt-get autoremove -y
    rm -rf /var/lib/docker /etc/docker /var/run/docker.sock || true
    echo "✅ Docker desinstalado do sistema."
else
    echo "ℹ️ Docker não encontrado no sistema."
fi

# -----------------------------
# 6️⃣ Limpeza final
# -----------------------------
echo "✅ Remoção completa concluída!"
