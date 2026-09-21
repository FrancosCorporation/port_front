# port_front

Front-end de portfólio pessoal em **React 19**: página única com animações,
seções de apresentação e formulário de contato integrado ao **EmailJS**.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-projeto%20pessoal-blue?style=flat-square)

## Sobre

Aplicação React (Create React App) criada como portfólio online: apresenta o
autor, seus projetos e um canal de contato direto por e-mail, com animações
de entrada/saída via Framer Motion.

## Funcionalidades

Comprovadas pelo código em `src/`:

- **Single page** com seções institucionais (`App.js`).
- **Formulário de contato** (`ContactForm.jsx`) com envio via `emailjs-com`.
- **Animações** com `framer-motion`.
- **Testes** com Testing Library (`App.test.js`).
- Assets próprios em `public/` (logos, favicon, manifest).

## Como rodar

```bash
npm install
npm start        # http://localhost:3000
npm test         # testes
npm run build    # build de produção
```

> O formulário de contato depende de credenciais do EmailJS (service ID,
> template e public key) — configure-as no componente antes de usar em
> produção.

## Estrutura do projeto

```
public/          # index.html, logos, manifest
src/
├── App.js       # composição da página
├── ContactForm.jsx
└── index.js
```

## Licença

MIT — veja [LICENSE](LICENSE).
