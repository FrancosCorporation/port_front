import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const buildDirectory = resolve('dist');
const port = Number.parseInt(process.argv[2] ?? process.env.PORT ?? '3000', 10);
const bodyLimit = 16 * 1024;
const rateWindow = 15 * 60 * 1000;
const rateLimit = 5;
const maxTrackedAddresses = 10_000;
const recentMessages = new Map();
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/manifest+json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
]);

class RequestError extends Error {
  constructor(status, message, retryAfter) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

function setSecurityHeaders(response) {
  response.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self'",
  );
  response.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
}

function sendJson(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function isSameOrigin(request) {
  const origin = request.headers.origin;

  if (typeof origin !== 'string' || !request.headers.host) return false;

  try {
    const suppliedOrigin = new URL(origin).origin;
    const configuredOrigin = process.env.PUBLIC_ORIGIN?.trim();

    if (configuredOrigin) return suppliedOrigin === new URL(configuredOrigin).origin;

    return new URL(suppliedOrigin).host.toLowerCase() === request.headers.host.toLowerCase();
  } catch {
    return false;
  }
}

function getClientAddress(request) {
  if (process.env.TRUST_PROXY === 'true') {
    const forwardedAddress = request.headers['x-forwarded-for']?.split(',')[0]?.trim();
    if (forwardedAddress) return forwardedAddress.slice(0, 100);
  }

  return request.socket.remoteAddress ?? 'unknown';
}

function enforceRateLimit(request) {
  const now = Date.now();
  const address = getClientAddress(request);
  const previous = recentMessages.get(address);

  if (!previous && recentMessages.size >= maxTrackedAddresses) {
    for (const [key, entry] of recentMessages) {
      if (now - entry.startedAt >= rateWindow) recentMessages.delete(key);
    }
  }

  if (!previous || now - previous.startedAt >= rateWindow) {
    if (!previous && recentMessages.size >= maxTrackedAddresses) {
      throw new RequestError(503, 'O canal está temporariamente ocupado. Tente novamente em alguns minutos.');
    }
    recentMessages.set(address, { count: 1, startedAt: now });
    return;
  }

  if (previous.count >= rateLimit) {
    const retryAfter = Math.max(1, Math.ceil((rateWindow - (now - previous.startedAt)) / 1000));
    throw new RequestError(429, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.', retryAfter);
  }

  previous.count += 1;

}

async function readJson(request) {
  const contentType = request.headers['content-type']?.split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    throw new RequestError(415, 'Formato de solicitação inválido.');
  }

  const declaredLength = Number.parseInt(request.headers['content-length'] ?? '0', 10);
  if (declaredLength > bodyLimit) throw new RequestError(413, 'Mensagem muito grande.');

  const chunks = [];
  let receivedLength = 0;

  for await (const chunk of request) {
    receivedLength += chunk.length;
    if (receivedLength > bodyLimit) throw new RequestError(413, 'Mensagem muito grande.');
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new RequestError(400, 'Não foi possível ler os dados enviados.');
  }
}

function validateContact(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new RequestError(400, 'Preencha os campos do formulário.');
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  const website = typeof data.website === 'string' ? data.website.trim() : '';

  if (website) return null;
  if (name.length < 2 || name.length > 100) throw new RequestError(400, 'Informe seu nome (até 100 caracteres).');
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new RequestError(400, 'Informe um e-mail válido.');
  }
  if (message.length < 10 || message.length > 3000) {
    throw new RequestError(400, 'A mensagem deve ter entre 10 e 3.000 caracteres.');
  }

  return { name, email, message };
}

async function sendTelegramMessage(contact) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    throw new RequestError(503, 'O canal de mensagens está sendo configurado. Tente pelo LinkedIn.');
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `Novo contato pelo portfólio\nNome: ${contact.name}\nE-mail: ${contact.email}\nMensagem:\n${contact.message}`,
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const result = await telegramResponse.json().catch(() => null);

  if (!telegramResponse.ok || result?.ok !== true) {
    console.error(`Falha no provedor de mensagens (HTTP ${telegramResponse.status}).`);
    throw new RequestError(502, 'Não foi possível enviar agora. Tente novamente ou fale pelo LinkedIn.');
  }
}

async function handleContact(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { message: 'Método não permitido.' }, { Allow: 'POST' });
    return;
  }

  if (!isSameOrigin(request)) {
    sendJson(response, 403, { message: 'Origem da solicitação não autorizada.' });
    return;
  }

  try {
    enforceRateLimit(request);
    const contact = validateContact(await readJson(request));

    // Bots que preenchem o campo invisível não chegam ao provedor externo.
    if (!contact) {
      sendJson(response, 202, { message: 'Mensagem recebida.' });
      return;
    }

    await sendTelegramMessage(contact);
    sendJson(response, 202, { message: 'Mensagem enviada.' });
  } catch (error) {
    if (error instanceof RequestError) {
      const headers = error.retryAfter ? { 'Retry-After': String(error.retryAfter) } : {};
      sendJson(response, error.status, { message: error.message }, headers);
      return;
    }

    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      sendJson(response, 504, { message: 'O envio demorou mais que o esperado. Tente novamente.' });
      return;
    }

    console.error('Falha inesperada ao processar uma mensagem de contato.');
    sendJson(response, 502, { message: 'Não foi possível enviar agora. Tente novamente ou fale pelo LinkedIn.' });
  }
}

async function resolveStaticFile(pathname, acceptsHtml) {
  const decodedPath = decodeURIComponent(pathname);
  const requestedPath = resolve(buildDirectory, `.${decodedPath}`);

  if (requestedPath !== buildDirectory && !requestedPath.startsWith(`${buildDirectory}${sep}`)) {
    return null;
  }

  try {
    const details = await stat(requestedPath);
    const filePath = details.isDirectory() ? resolve(requestedPath, 'index.html') : requestedPath;
    const fileDetails = details.isDirectory() ? await stat(filePath) : details;
    return fileDetails.isFile() ? filePath : null;
  } catch {
    if (!acceptsHtml || extname(decodedPath) !== '') return null;

    try {
      const indexPath = resolve(buildDirectory, 'index.html');
      return (await stat(indexPath)).isFile() ? indexPath : null;
    } catch {
      return null;
    }
  }
}

const server = createServer(async (request, response) => {
  setSecurityHeaders(response);

  let requestUrl;
  try {
    requestUrl = new URL(request.url ?? '/', 'http://localhost');
  } catch {
    sendJson(response, 400, { message: 'URL inválida.' });
    return;
  }

  if (requestUrl.pathname === '/healthz' && (request.method === 'GET' || request.method === 'HEAD')) {
    response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : 'ok');
    return;
  }

  if (requestUrl.pathname === '/api/contact') {
    await handleContact(request, response);
    return;
  }

  if (requestUrl.pathname.startsWith('/api/')) {
    sendJson(response, 404, { message: 'Rota não encontrada.' });
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  let filePath;
  try {
    filePath = await resolveStaticFile(requestUrl.pathname, request.headers.accept?.includes('text/html') ?? false);
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }

  if (!filePath) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const cacheControl = requestUrl.pathname.startsWith('/assets/')
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate';
  response.writeHead(200, {
    'Cache-Control': cacheControl,
    'Content-Type': mimeTypes.get(extname(filePath)) ?? 'application/octet-stream',
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Portfólio disponível na porta ${port}`);
});
