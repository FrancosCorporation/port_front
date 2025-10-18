#!/bin/bash
set -e

echo "🚀 Configurando ambiente NoSQL completo (Debian 13 + Docker + MongoDB)..."

# -----------------------------
# 1️⃣ Verifica root
# -----------------------------
if [ "$EUID" -ne 0 ]; then
    echo "⚠️ Este script precisa ser root. Use: su -c ./setup_nosql_robusto.sh"
    exit 1
fi

# -----------------------------
# 2️⃣ Variáveis
# -----------------------------
DOCKER_REPO="https://download.docker.com/linux/debian"
DOCKER_KEY="/etc/apt/keyrings/docker.gpg"
DOCKER_LIST="/etc/apt/sources.list.d/docker.list"
# Carrega variáveis válidas do .env de forma segura
if [ -f .env ]; then
    export $(grep -v '^#' .env | grep -E '^[A-Za-z_][A-Za-z0-9_]*=.*' | xargs)
    echo "✅ Variáveis carregadas do .env"
else
    echo "ℹ️ Arquivo .env não encontrado, usando valores padrão."
fi
# -----------------------------
# 3️⃣ Função: limpar instalações Docker quebradas
# -----------------------------
cleanup_docker() {
    echo "🧹 Limpando instalações Docker antigas ou quebradas..."
    apt-get remove -y docker docker.io docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin || true
    rm -rf /var/lib/docker /etc/docker || true
    rm -f $DOCKER_LIST || true
}

# -----------------------------
# 4️⃣ Função: instalar Docker
# -----------------------------
install_docker() {
    if ! command -v docker &> /dev/null || ! command -v dockerd &> /dev/null; then
        echo "🐋 Instalando Docker completo..."
        apt-get update -y
        apt-get install -y ca-certificates curl gnupg lsb-release

        mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o $DOCKER_KEY
        chmod a+r $DOCKER_KEY

        echo "deb [arch=$(dpkg --print-architecture) signed-by=$DOCKER_KEY] $DOCKER_REPO $(lsb_release -cs) stable" > $DOCKER_LIST

        apt-get update -y
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        echo "✅ Docker instalado!"
    else
        echo "✅ Docker já instalado."
    fi
}

# -----------------------------
# 5️⃣ Função: iniciar daemon Docker
# -----------------------------
start_docker() {
    if systemctl list-unit-files | grep -q '^docker.service'; then
        echo "⚙️ Iniciando Docker daemon via systemd..."
        systemctl enable docker
        systemctl start docker
    else
        if ! docker info &> /dev/null; then
            echo "⚙️ Iniciando Docker daemon manualmente..."
            nohup dockerd >/dev/null 2>&1 &
            sleep 5
        fi
    fi

    # Verifica conexão com Docker
    if ! docker info &> /dev/null; then
        echo "❌ Não foi possível conectar ao Docker daemon. Abortando."
        exit 1
    fi
    echo "✅ Docker daemon ativo."
}

# -----------------------------
# 6️⃣ Função: adicionar usuário ao grupo docker
# -----------------------------
add_user_to_group() {
    if [ -n "$SUDO_USER" ]; then
        if ! getent group docker | grep -q "$SUDO_USER"; then
            echo "🔧 Adicionando usuário '$SUDO_USER' ao grupo docker..."
            usermod -aG docker "$SUDO_USER" || true
            echo "✅ Usuário adicionado ao grupo docker. Faça logout/login."
        fi
    fi
}

# -----------------------------
# 7️⃣ Função: criar container MongoDB
# -----------------------------
create_mongo() {
    if docker ps -a --format '{{.Names}}' | grep -q "^$MONGO_CONTAINER\$"; then
        echo "ℹ️ Container '$MONGO_CONTAINER' já existe. Iniciando..."
        docker start $MONGO_CONTAINER || true
    else
        echo "📦 Criando container MongoDB..."
        docker run -d \
            --name $MONGO_CONTAINER \
            -p 27017:27017 \
            -e MONGO_INITDB_ROOT_USERNAME=$MONGO_ROOT_USER \
            -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_ROOT_PASS \
            -v mongo_data:/data/db \
            mongo:latest
        echo "✅ MongoDB container criado e rodando!"
    fi
}

# -----------------------------
# 8️⃣ Função: criar arquivo .env
# -----------------------------
create_env() {
    if [ ! -f .env ]; then
        echo "📝 Criando arquivo .env..."
        cat <<EOF > .env
PORT=5000
MONGO_URI=mongodb://$MONGO_ROOT_USER:$MONGO_ROOT_PASS@localhost:27017
EOF
        echo "✅ Arquivo .env criado!"
    else
        echo "ℹ️ Arquivo .env já existe."
    fi
}

# -----------------------------
# EXECUÇÃO
# -----------------------------
cleanup_docker
install_docker
start_docker
add_user_to_group
create_mongo
create_env

# -----------------------------
# STATUS FINAL
# -----------------------------
echo
echo "---------------------------------------------"
echo "🎉 Ambiente NoSQL configurado com sucesso!"
echo "🗄️  Containers ativos:"
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
echo "✅ MongoDB rodando em: mongodb://$MONGO_ROOT_USER:$MONGO_ROOT_PASS@localhost:27017"
echo "✅ Variáveis de conexão salvas em .env"
echo "⚠️ Lembre-se de logout/login se foi adicionado ao grupo docker."
echo "---------------------------------------------"
