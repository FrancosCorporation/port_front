import { sendForm } from '../../utils/functionsReUsed';

/**
 * Mapeia os dados do frontend (nome em português) para o backend (nome em inglês/Mongoose).
 * @param {object} formData - Dados do modal (nome, preco, fotoUrl, etc.)
 * @returns {object} Dados prontos para a API.
 */
function mapFrontendToBackend(formData) {
    const rawPrice = formData.preco.replace(/\./g, "").replace(/,/g, ".");
    
    return {
        name: formData.nome,
        description: formData.descricao,
        price: Number(rawPrice) || 0,
        stock: Number(formData.estoque) || 0,
        image: formData.fotoUrl,
        // O user: userId é injetado automaticamente pelo middleware no servidor.
    };
}

/**
 * Chama a API para criar um novo produto.
 * @param {object} formData - Dados do formulário do produto.
 * @returns {Promise<object>} O novo produto retornado pelo servidor.
 */
export async function createProduct(formData) {
    try {
        const productData = mapFrontendToBackend(formData);
        
        const result = await sendForm({ 
            url: 'api/products', 
            method: 'POST', 
            body: productData 
        });
        
        return result.product;
    } catch (error) {
        // A função sendForm já lança o erro com a mensagem da API
        throw error;
    }
}

// [Opcional: Adicione aqui as funções updateProduct, fetchProducts, deleteProduct]