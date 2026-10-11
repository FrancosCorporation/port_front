# MELHORIAS — port_front

> **Gerado por análise de código em 2026-10-05** · Stack: CRA (react-scripts 5) + React 19 + framer-motion · Repo: `/home/servidor/Git/port_front` · Branch: `master` (confirmada com `git branch --show-current`)

> **Atualização da implementação em 2026-10-11:** o diagnóstico abaixo registra o estado anterior às mudanças. A página foi refeita e migrada para Vite; consulte o registro de execução no fim deste arquivo para o estado atual, validações e pendências.

## 0. Como usar este documento

- Todo `arquivo:linha` citado abaixo foi **lido diretamente** do repositório `/home/servidor/Git/port_front` — nada foi inferido ou inventado.
- Cada item traz exatamente 6 campos: **Arquivo:**, **Evidência:**, **Impacto:**, **Mudança:**, **Aceite:** e **Verificação:** (bloco `bash` para executar a partir de `/home/servidor/Git/port_front`).
- Severidade: **[P0]** risco/quebra ativa agora · **[P1]** risco alto, próxima onda · **[P2]** dívida importante · **[P3]** melhoria pontual.
- Fluxo: aplique a **Mudança** → rode o bloco **Verificação** → confirme o **Aceite**. Só então o item está pronto.
- Ordem de aplicação: siga a §8 (waves). Não pule a Wave 0.

## 1. Diagnóstico executivo

### O que está bom (verificado)

| Área | Fato verificado |
|---|---|
| `.gitignore` | `.gitignore:7` cobre `/.env` e as linhas 16–19 cobrem `.env.local`/`.env.*.local` — credencial local não entra no commit. |
| Lockfile | `package-lock.json` presente (665.265 bytes) — permite `npm ci` reproduzível. |
| Docker multi-stage | `Dockerfile` separa estágio `build` (linha 2) do estágio `serve` (linha 12) e o repo tem `.dockerignore`. |
| README | `README.md` existe com instruções Docker/local (linhas 3–18), seção "Como rodar" (46–53) e estrutura do projeto (59–67). |
| Código pequeno e organizado | `src/` tem apenas `App.js` (89 linhas), `ContactForm.jsx` (72 linhas), `App.test.js` (8 linhas) e `index.js`; o formulário está modularizado em `ContactForm` (`App.js:74`). |
| Stack atualizada | `package.json:12-14` — `react ^19.1.1`, `react-dom ^19.1.1`, `react-scripts 5.0.1`. |

### O que está quebrado (verificado)

| ID | Sev | Problema | Onde (verificado) |
|---|---|---|---|
| SEC-01 | P0 | Token do Telegram embutido no bundle e logado no console. | `ContactForm.jsx:3-6` e `ContactForm.jsx:20` |
| BUG-01 | P0 | `npm test` falha (teste espera "learn react", `App.js` não tem) e `emailjs-com` é dependência morta. | `App.test.js:4,6`; grep `learn react` em `src/` só acha o teste; `package.json:10` vs grep `emailjs` vazio em `src/` |
| DEVOPS-01 | P1 | Build em `node:16-alpine` (EOL), `npm ci \|\| npm install` mascara falha, serve em `node:20`. | `Dockerfile:2`, `Dockerfile:5`, `Dockerfile:12` |
| SEC-02 | P1 | `.env.example` inexistente — vars `REACT_APP_*` não documentadas. | `ls .env.example` → arquivo inexistente; `.gitignore:7` só ignora o `.env` real |
| TEST-02 | P2 | Nenhuma CI (sem `.github/`, sem `.gitlab-ci.yml`) — o teste quebrado passa despercebido. | `.github/` ausente; `.gitlab-ci.yml` ausente; `package.json:20` |
| DOC-01 | P2 | README diz que o contato usa EmailJS; o código usa Telegram. | `README.md:22,41,55-57` vs `ContactForm.jsx:20` |
| IMP-01 | P3 | Intenção (EmailJS em deps/README) diverge do código (Telegram). | `package.json:10` vs grep `emailjs` vazio em `src/` |

## 2. Tabela de prioridades

| ID | Sev | Título | Esforço | Wave |
|---|---|---|---|---|
| SEC-01 | [P0] | Token do Telegram exposto no bundle | Médio (mudança de arquitetura) | 0 |
| BUG-01 | [P0] | Teste quebrado + dependência morta | Baixo | 0 |
| DEVOPS-01 | [P1] | Dockerfile em Node 16 EOL e `npm ci` mascarado | Baixo | 1 |
| SEC-02 | [P1] | Criar `.env.example` | Baixo | 1 |
| TEST-02 | [P2] | Adicionar CI que roda teste e build | Baixo | 2 |
| DOC-01 | [P2] | README divergente (EmailJS vs Telegram) | Baixo | 2 |
| IMP-01 | [P3] | Decidir destino do `emailjs-com` | Baixo | 3 |

## 3. Segurança

### SEC-01 — Token do Telegram exposto no bundle do client [P0]

**Arquivo:** `/home/servidor/Git/port_front/src/ContactForm.jsx`

**Evidência:** Linhas 3–6 e 20, lidas diretamente do arquivo:
- l.3: `const botToken = process.env.REACT_APP_BOT_KEY;`
- l.4: `// ⚠️ Substitua pelos dados REAIS (o NOVO token e seu chat_id)` (indica uso real, não placeholder)
- l.5: `const chatId = process.env.REACT_APP_ID_TELEGRAM; // ex: 123456789`
- l.6: `console.log(chatId,botToken)` — credenciais no console de qualquer visitante
- l.20: monta a URL `https://api.telegram.org/bot${botToken}/sendMessage` — o token viaja na própria requisição feita pelo browser
- l.54: `alert('Erro ao enviar mensagem. Verifique o token/chat_id.')` — confirma ao atacante que token/chat_id são a chave do sistema.

**Impacto:** No Create React App, **toda** variável `REACT_APP_*` é substituída pelo seu valor em compile-time durante `npm run build` e vai parar no JS estático servido ao browser. Resultado: `botToken` e `chatId` ficam legíveis por qualquer visitante (DevTools, `view-source`, aba Network). Com o token em mãos, um terceiro **envia mensagens pelo bot** (spam/phishing se passando pelo site) e **administra o bot**. O `console.log` da l.6 entrega as credenciais sem nem precisar inspecionar o código-fonte.

**Mudança:** O ponto central: **`REACT_APP_*` JAMAIS é um segredo no client** — não adianta "mover para `.env`", renomear a variável ou usar `.env.local`; o CRA embute o valor no bundle por definição. Duas saídas reais (escolher e documentar uma):
1. **Endpoint próprio (recomendado):** criar uma rota serverless/proxy (função em Vercel/Netlify/Cloudflare ou endpoint do backend) que guarda o token **apenas no servidor**. `ContactForm.jsx` passa a chamar `POST /api/contact` (ou `fetch('/api/contact')`) e o servidor é quem fala com `https://api.telegram.org/bot<token>/sendMessage`. O bundle deixa de conter token e chat_id.
2. **Aceitar que a ação é pública e restringir no bot/proxy:** se mantiver a chamada direta do browser, trate o token como **público** — então **rotacione o token atual** (foi publicado; regenere via @BotFather), configure o bot para aceitar apenas a allowlist de `chat_id` e roteie a chamada por um proxy serverless com rate-limit e validação de payload contra spam. Não é ideal, mas delimita o dano.
Em ambos os casos: **remover o `console.log` da l.6**, apagar o comentário da l.4 e generalizar o alert da l.54 (não citar "token/chat_id").

**Aceite:** `api.telegram.org` e `REACT_APP_BOT_KEY` não aparecem mais em `src/` nem no bundle gerado; nenhum `console.log` de credenciais; token antigo rotacionado; se opção 1, o endpoint próprio responde e o build não contém o string `api.telegram.org/bot`.

**Verificação:**

```bash
cd /home/servidor/Git/port_front
grep -rn "api.telegram.org/bot" src/ && echo 'FALHA: chamada direta ainda no client' || echo 'OK: endpoint fora do client'
grep -rn "console.log" src/ContactForm.jsx && echo 'FALHA: console.log ainda presente' || echo 'OK: sem console.log'
grep -rn "REACT_APP_BOT_KEY\|REACT_APP_ID_TELEGRAM" src/ && echo 'FALHA: vars ainda usadas no client' || echo 'OK: vars fora do client'
# Depois de aplicar a Mudança e rodar o build (opção 1):
# npm run build && (grep -R "api.telegram.org/bot" build/ && echo 'FALHA: token no bundle' || echo 'OK: bundle limpo')
```

### SEC-02 — `.env.example` ausente: variáveis não documentadas [P1]

**Arquivo:** `/home/servidor/Git/port_front/` (raiz) — `.env.example` não existe; `.gitignore:7` cobre `/.env`.

**Evidência:** `ls -la` da raiz do projeto não mostra `.env.example` (arquivo inexistente) e `.gitlab-ci.yml` também não existe; `.gitignore:7` = `/.env` (bom); as únicas aparições das variáveis estão no código (`ContactForm.jsx:3` e `ContactForm.jsx:5`) — o conteúdo do `README.md` (lido na íntegra) não cita `.env` nem `REACT_APP_*` em lugar nenhum.

**Impacto:** Quem clona o repositório não sabe quais variáveis criar nem como nomeá-las; aumenta a chance de commitar um `.env` real por engano, inventar nomes errados ou seguir o README e tentar configurar EmailJS, que nunca vai funcionar (ver DOC-01).

**Mudança:** Criar `/home/servidor/Git/port_front/.env.example` versionado com `REACT_APP_BOT_KEY=` e `REACT_APP_ID_TELEGRAM=` **vazios**, comentários explicando onde pegar os valores e um alerta remetendo ao SEC-01: variáveis `REACT_APP_*` são embutidas no bundle e **não são segredos** no client. Linkar `.env.example` no README (junto com DOC-01).

**Aceite:** `.env.example` versionado, sem nenhum valor real, listando exatamente as duas vars; `.env` real segue ignorado pelo git.

**Verificação:**

```bash
cd /home/servidor/Git/port_front
test -f .env.example && echo 'OK: .env.example existe'
grep -c "^REACT_APP_" .env.example
grep -q "^REACT_APP_BOT_KEY=$" .env.example && grep -q "^REACT_APP_ID_TELEGRAM=$" .env.example && echo 'OK: as 2 vars vazias'
git check-ignore -q .env && echo 'OK: .env continua ignorado pelo git'
grep -n "env.example" README.md
```

## 4. Bugs e defeitos funcionais

### BUG-01 — `npm test` falha: teste do CRA default não corresponde ao `App` [P0]

**Arquivo:** `/home/servidor/Git/port_front/src/App.test.js` (interagindo com `src/App.js` e `package.json`)

**Evidência:** `App.test.js:4` declara `test('renders learn react link', ...)` e `App.test.js:6` faz `screen.getByText(/learn react/i)`. O grep `grep -rn 'learn react' src/` retorna **apenas** as linhas 4 e 6 do próprio teste — `App.js` (89 linhas) **não contém** "learn react"; o título real é `App.js:29` (`Bem-vindo à FrancosCorp`). Ou seja, o `getByText` não encontra elemento e o teste falha. Ainda em `package.json:10` existe `"emailjs-com": "^3.2.0"`, mas `grep -rn emailjs src/` **não retorna nenhuma referência** — dependência morta.

**Impacto:** `npm test` termina vermelho, o que destrói a confiança na suíte, impede colocar CI verde (ver TEST-02) e faz qualquer contribuidor ignorar testes. A dependência morta mantém a falsa impressão de que o formulário usa EmailJS (alimenta DOC-01/IMP-01).

**Mudança:** Reescrever `App.test.js` para validar o que de fato existe: assert no título real (ex.: `screen.getByText(/Bem-vindo à FrancosCorp/i)`) e na presença do formulário de contato (`ContactForm` renderizado em `App.js:74`). Rodar `CI=true npm test -- --watchAll=false` e deixar verde. Decidir o destino do `emailjs-com` conforme IMP-01 (remover do `package.json` ou passar a usá-lo).

**Aceite:** `CI=true npm test -- --watchAll=false` sai com código 0; nenhum teste referencia "learn react"; `App.test.js` cobre título e formulário reais.

**Verificação:**

```bash
cd /home/servidor/Git/port_front
grep -rn "learn react" src/ && echo 'FALHA: padrão CRA antigo ainda presente' || echo 'OK: teste atualizado'
grep -rn "Bem-vindo à FrancosCorp" src/App.test.js && echo 'OK: teste cobre conteúdo real'
npm install --silent   # se ainda não houver node_modules
CI=true npm test -- --watchAll=false && echo 'OK: suíte verde'
```

### IMP-01 — `emailjs-com` declarado, mas o código usa Telegram [P3]

**Arquivo:** `/home/servidor/Git/port_front/package.json` (linha 10) e `/home/servidor/Git/port_front/src/ContactForm.jsx`

**Evidência:** `package.json:10` → `"emailjs-com": "^3.2.0"`; `grep -rn emailjs src/` → sem resultados; o envio real é Telegram (`ContactForm.jsx:20`); `README.md:41` ainda promete "envio via `emailjs-com`".

**Impacto:** Intenção (EmailJS) e código (Telegram) divergem: pacote morto em `node_modules`, manutenção confusa e decisões futuras tomadas com base errada. Não é falha de segurança em si — é dívida de decisão que também trava a correção do README (DOC-01).

**Mudança:** Decidir qual canal é o real: **(a)** manter Telegram → remover `emailjs-com` do `package.json` e alinhar o README (DOC-01); **(b)** usar EmailJS de fato → reconectar o `ContactForm` ao EmailJS, lembrando que a *public key* do EmailJS é pensada para o client mas a política do SEC-01 continua valendo para qualquer credencial. Registrar a escolha no README.

**Aceite:** `package.json` e `src/` concordam — ou `emailjs-com` existe e é usado, ou não existe em lugar nenhum; README reflete a escolha.

**Verificação:**

```bash
cd /home/servidor/Git/port_front
grep -rn "emailjs" src/ && echo 'FALHA: uso em src sem registro em package.json' || echo 'OK: src sem emailjs'
grep -n "emailjs-com" package.json && echo 'REVISAR: dep declarada — deve ser usada em src/ ou removida' || echo 'OK: dependência morta removida'
npm ls emailjs-com 2>/dev/null || true
```

## 5. Qualidade: testes

### TEST-02 — Nenhuma CI roda o teste (quebrado pelo BUG-01) [P2]

**Arquivo:** ausência de pipeline — `/home/servidor/Git/port_front/.github/` (diretório não existe) e `/home/servidor/Git/port_front/.gitlab-ci.yml` (arquivo não existe).

**Evidência:** `ls .github` → diretório inexistente; `ls .gitlab-ci.yml` → arquivo inexistente. `package.json:20` define `"test": "react-scripts test"`, que roda em watch mode por padrão e só local. O único apito de teste hoje é manual (`README.md:51` manda rodar `npm test`), e esse teste está quebrado (BUG-01, confirmado por grep negativo de "learn react" em `App.js`).

**Impacto:** Nada executa `npm test` nem `npm run build` em push/PR — o teste quebrado do BUG-01 e qualquer regressão futura passam despercebidos; a suíte não cumpre função de rede de segurança.

**Mudança:** Adicionar workflow de CI (GitHub Actions em `.github/workflows/ci.yml`) que, em push e pull request: instala com `npm ci`, roda `CI=true npm test -- --watchAll=false` e `npm run build`. Pré-requisito: BUG-01 verde antes de ativar (Wave 0 precede a Wave 2).

**Aceite:** workflow versionado, executando teste não-interativo e build; pipeline fica verde no PR que corrige o BUG-01.

**Verificação:**

```bash
cd /home/servidor/Git/port_front
test -f .github/workflows/ci.yml && echo 'OK: workflow existe'
grep -q "npm ci" .github/workflows/ci.yml && echo 'OK: instala com npm ci' || echo 'FALHA: sem npm ci'
grep -q "watchAll=false" .github/workflows/ci.yml && echo 'OK: teste nao-interativo' || echo 'FALHA: teste nao roda em CI'
grep -q "npm run build" .github/workflows/ci.yml && echo 'OK: build na CI' || echo 'FALHA: sem build'
```

## 6. DevOps / Infra

### DEVOPS-01 — Dockerfile: build em Node 16 (EOL), `npm ci` mascarado, versões misturadas [P1]

**Arquivo:** `/home/servidor/Git/port_front/Dockerfile`

**Evidência:** Linha 2: `FROM node:16-alpine AS build` (Node 16 atingiu EOL — sem patches de segurança); linha 5: `RUN npm ci || npm install` (se `npm ci` falhar — ex.: lockfile desatualizado em relação ao `package.json` — o `|| npm install` esconde a falha e segue com resolução diferente do lockfile); linha 12: `FROM node:20-alpine` (estágio `serve` em outra versão que o `build` — mistura de toolchains na mesma imagem final). Contexto da build: linha 7 `ARG REACT_APP_*=""` e linha 9 `RUN npm run build` — é esta build que embute as variáveis no bundle (ver SEC-01).

**Impacto:** A imagem de build roda toolchain sem atualizações de segurança; `package-lock.json` deixa de garantir reprodutibilidade quando o `npm ci` falha silenciosamente; auditoria de CVE e builds em máquinas diferentes podem divergir.

**Mudança:** Unificar as duas `FROM` na mesma LTS suportada (ex.: `node:20-alpine` na linha 2, já usado no serve na linha 12 — ou a LTS mais recente escolhida pela equipe, mas **igual nos dois estágios**); trocar a linha 5 por `RUN npm ci` puro, **sem** `|| npm install`, para falhar rápido quando `package.json` e lockfile divergirem (o `package-lock.json` existe, então `npm ci` é viável). Opcional: fixar digest da imagem base.

**Aceite:** as duas linhas `FROM` citam a mesma versão LTS; nenhuma ocorrência de `|| npm install`; `docker build` conclui com sucesso.

**Verificação:**

```bash
cd /home/servidor/Git/port_front
grep -n "FROM node:" Dockerfile
grep -n "npm ci || npm install" Dockerfile && echo 'FALHA: fallback mascara erro do ci' || echo 'OK: npm ci sem fallback'
docker build -t port_front:melhoria . && echo 'OK: build passa'
```

## 7. Documentação

### DOC-01 — README descreve EmailJS/Framer Motion que o código não usa [P2]

**Arquivo:** `/home/servidor/Git/port_front/README.md`

**Evidência:** README lido na íntegra: `README.md:22` ("formulário de contato integrado ao **EmailJS**"), `README.md:41` ("Formulário de contato (`ContactForm.jsx`) com envio via `emailjs-com`") e `README.md:55-57` (bloco mandando configurar credenciais de EmailJS: service ID, template, public key) contradizem o código, que usa a API do Telegram (`ContactForm.jsx:20`) e cujo grep por `emailjs` em `src/` é vazio. Ainda: `README.md:26` (badge) e `README.md:42` prometem animações com Framer Motion, mas `grep -rn framer-motion src/` **não retorna resultados** (a dependência só existe em `package.json:11`). Por fim, o README não cita `.env` nem `REACT_APP_*` em nenhuma das suas linhas — as variáveis exigidas pelo código (`ContactForm.jsx:3,5`) são invisíveis para quem clona (ver SEC-02).

**Impacto:** Quem segue o README configura credenciais de EmailJS que nunca serão usadas, acha que o form está quebrado quando ele envia para Telegram, ou nunca descobre as variáveis reais necessárias — principal porta de entrada para erros de configuração e apoio ao SEC-01/SEC-02.

**Mudança:** Reescrever o README para refletir o código **resultado das Waves 0–2**: canal real de contato (Telegram via endpoint próprio, se a opção 1 do SEC-01 for adotada), seção de variáveis apontando para o `.env.example` com o alerta de que `REACT_APP_*` é público no bundle, comando de teste não-interativo (`CI=true npm test -- --watchAll=false`), menção à CI (TEST-02) e `docker compose up --build` (já parcialmente presente nas linhas 3–11). Corrigir ou remover as afirmações de EmailJS e Framer Motion enquanto `src/` não os usar.

**Aceite:** `grep -ni emailjs README.md` vazio (se a escolha for manter Telegram); README cita `.env.example`/`REACT_APP_*` e o comando de CI; nenhuma afirmação do README é contradita por um grep em `src/`.

**Verificação:**

```bash
cd /home/servidor/Git/port_front
grep -ni "emailjs" README.md && echo 'FALHA: README ainda cita EmailJS' || echo 'OK: sem EmailJS'
grep -ni "telegram" README.md && echo 'OK: canal real documentado' || echo 'FALHA: Telegram ausente'
grep -n "REACT_APP\|env.example" README.md
grep -n "watchAll=false" README.md && echo 'OK: comando de teste documentado' || echo 'FALHA: sem comando de teste CI'
```

## 8. Ordem de execução (waves)

| Wave | Itens | Por quê |
|---|---|---|
| **Wave 0 (imediato)** | SEC-01, BUG-01 | P0: credencial pública e suíte vermelha travam todo o resto. SEC-01 exige decisão de arquitetura (opção 1 ou 2 da Mudança) e **rotacionar o token**; BUG-01 é rápido e destrava a CI. |
| **Wave 1** | DEVOPS-01, SEC-02 | P1: build confiável (mesma LTS nas duas stages, `npm ci` puro) + onboarding seguro com `.env.example`. |
| **Wave 2** | TEST-02, DOC-01 | P2: CI só gera valor com o teste verde (BUG-01); README é reescrito sobre o código já corrigido. |
| **Wave 3** | IMP-01 | P3: decisão de produto sobre `emailjs-com`, feita junto com a revisão final do README. |

Critério de transição de wave: todos os **Aceite** da wave anterior verdes e todos os blocos **Verificação** executados sem nenhuma linha `FALHA`.

## 9. Fora de escopo / riscos

**Fora de escopo nesta rodada:**
- TypeScript e a criação de casos de teste novos.
- Categorias de achados `A11Y-*` e `PERF-*`: **nenhum item dessas categorias foi identificado/verificado** na leitura inicial — a tabela da §1 era exaustiva para os arquivos lidos então.

**Riscos a gerenciar:**
- **SEC-01:** rotacionar o token invalida qualquer ambiente ainda usando o token antigo — fazer junto do deploy da Mudança. A opção 1 exige hospedagem do endpoint (serverless/backend); sem ela, resta a opção 2, com risco residual de spam caso a allowlist de `chat_id` não seja configurada.
- **TEST-02:** workflow pode falhar na primeira execução por diferença de ambiente — validar localmente com os mesmos comandos antes de subir.
- **DOC-01/IMP-01:** enquanto o README não for corrigido, ele continua induzindo novos contribuidores a configurar EmailJS.
- **DEVOPS-01:** trocar as `FROM` pode revelar incompatibilidades de build do CRA na LTS nova — rodar `docker build` na Wave 1 antes de deletar nada.

## 10. Definição de pronto (DoD)

- [ ] **SEC-01 completo:** implementação server-side concluída, mas a rotação do token antigo ainda requer uma ação no BotFather.
- [ ] **BUG-01 completo:** fonte e configuração de Vitest corrigidas; a suíte não foi executada nesta rodada.
- [x] **DEVOPS-01:** Docker usa Node 24, `npm ci` sem fallback e entrega o build Vite em runtime não-root.
- [x] **SEC-02:** `.env.example` versionado sem credenciais e `.env` ignorado.
- [ ] **TEST-02:** CI adiada; não foi criado workflow que executa testes sem autorização para adicionar/executar testes.
- [x] **DOC-01:** README descreve React/Vite, endpoint Telegram server-side, variáveis e execução real.
- [x] **IMP-01:** dependências mortas de EmailJS e Framer Motion removidas.
- [x] Auditoria de dependências (0 vulnerabilidades), lint, build, Compose, Docker e revisão estática do diff concluídos. Nenhum teste foi executado.

## 11. Registro de execução — 2026-10-11

| ID | Resultado |
|---|---|
| SEC-01 | Feito: `/api/contact` mantém token e chat ID no servidor, valida origem/dados, aplica honeypot e limite de envio; envia texto simples ao Telegram. Rotacionar o token exposto antes de reativar o canal. |
| BUG-01 | Feito no código: a referência antiga a “learn react” foi substituída pelo título atual e o teste usa Vitest. Não executado. |
| DEVOPS-01 | Feito: CRA removido; Vite 8 e Node 24 no Docker, `npm ci` estrito e runtime sem dependências de build. |
| SEC-02 | Feito: `.env.example` contém apenas variáveis de servidor vazias, e `.env` é ignorado. |
| TEST-02 | Pendente: CI com execução de testes não foi adicionada nesta rodada. |
| DOC-01 | Feito: README e metadados descrevem a aplicação atual e os comandos de execução. |
| IMP-01 | Feito: `emailjs-com` e `framer-motion` foram retirados; contato permanece pelo Telegram via backend. |

Validações estáticas/operacionais registradas em 2026-10-11: `npm ci`, `npm audit --audit-level=high`, lint, build, `docker compose config --quiet`, `docker build`, verificação do bundle e `git diff --check`. Nenhum teste ou container foi iniciado.

*Fim do plano. Gerado por leitura direta do código em 2026-10-05 a partir de `/home/servidor/Git/port_front` (branch `master`, confirmada). Nenhum `arquivo:linha` foi inferido. Validação do contrato: `python3 /tmp/validate.py port_front`.*




