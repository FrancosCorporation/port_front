# Francos Corporation

Portfólio responsivo da Francos Corporation, feito com React 19 e Vite. A
página apresenta as frentes de trabalho, projetos públicos e um formulário de
contato que envia mensagens por um endpoint Node.js no mesmo domínio.

## Requisitos

- Node.js 22.12 ou superior (ou use Docker Compose).
- Para enviar mensagens: token do bot e ID do chat configurados somente no
  servidor. O formulário continua disponível sem essas credenciais, e oferece
  o LinkedIn como alternativa.

## Rodar localmente

```bash
npm ci
cp .env.example .env
```

Preencha `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID` no arquivo `.env` local. Não
adicione esse arquivo ao Git. O token já foi usado em builds públicos antigos;
revogue-o no BotFather e configure um token novo antes de ativar o envio.
Variáveis expostas ao Vite com o prefixo `VITE_` entram no JavaScript público;
credenciais devem permanecer no servidor.

Em um terminal, inicie a API:

```bash
npm run api
```

Em outro, inicie a interface:

```bash
npm run dev
```

Abra <http://127.0.0.1:5173>. O servidor Vite encaminha `/api` para a API local
na porta 3001. A API local escuta apenas em `127.0.0.1`; a imagem Docker define
o bind interno necessário para receber conexões pela rede do container.

## Docker Compose

Copie `.env.example` para `.env`, configure as credenciais do servidor e rode:

```bash
docker compose up --build
```

O site fica em <http://127.0.0.1:3000>. O Compose publica a porta apenas no
loopback, executa o processo como usuário sem privilégios e usa filesystem
somente leitura. Se houver proxy reverso, configure `PUBLIC_ORIGIN` com a
origem pública exata. Ative `TRUST_PROXY=true` somente quando um proxy confiável
substituir `X-Forwarded-For`.

## Comandos

```bash
npm run lint
npm run build
npm run test
```

O projeto usa Biome para lint, Vite para gerar `dist/` e Vitest com Testing
Library para a suíte existente.

## Estrutura

```text
src/                 Interface React e formulário
server.mjs           API de contato e servidor de produção
index.html           Entrada Vite e metadados
public/              Manifesto e identidade visual
Dockerfile           Build Vite e runtime Node não-root
compose.yaml         Execução local protegida
.env.example         Nomes das variáveis server-side, sem valores reais
```

## Licença

MIT — veja [LICENSE](LICENSE).
