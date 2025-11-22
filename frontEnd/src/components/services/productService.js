import { sendForm } from '../../utils/functionsReUsed';

/**
 * Converte os dados do frontend para o formato do backend
 * Garantindo que price e stock sejam números válidos
 */
function mapFrontendToBackend(formData) {
  const precoStr = formData.price ? formData.price.toString() : "0"; // usa price
  const rawPrice = precoStr.replace(/\./g, "").replace(/,/g, ".");
  
  return {
    name: formData.name || "Sem nome",
    description: formData.description || "Sem descrição",
    price: Number(rawPrice) || 0,
    stock: Number(formData.stock) || 0,
    image: formData.image ,
  };
}

/** Cria um produto */
export async function createProduct(formData) {
  const productData = mapFrontendToBackend(formData);
  const result = await sendForm({ url: 'api/products', method: 'POST', body: productData });
  return result.product;
}

/** Atualiza um produto */
export async function updateProduct(id, formData) {
  const productData = mapFrontendToBackend(formData);
  const result = await sendForm({ url: `api/products/${id}`, method: 'PUT', body: productData });
  return result.product;
}

/** Deleta um produto */
export async function deleteProduct(id) {
  const result = await sendForm({ url: `api/products/${id}`, method: 'DELETE' });
  return result;
}

/** Busca todos os produtos */
export async function getProducts() {
   const result = await sendForm({ url: 'api/products', method: 'GET' });
  // Se o backend retornar { products: [...] } use result.products, caso contrário result
  return result.products || result;
}
