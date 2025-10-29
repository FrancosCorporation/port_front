// functionsReUsed.js
export async function sendForm({ url, method = 'POST', body }) {
  const urlWord = process.env.REACT_APP_URL;
  try {
    console.log(body)
    const response = await fetch(`${urlWord}${url}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro na requisição');
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
