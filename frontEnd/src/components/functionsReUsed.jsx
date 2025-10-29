export async function sendForm({ url, method = 'POST', body }) {
  const urlWord = process.env.REACT_APP_URL;

  try {
    const response = await fetch(`${urlWord}${url}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include', // 🔥 envia e recebe cookies
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erro na requisição');

    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}
