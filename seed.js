/**
 * ARQUIVO: seed.js
 * * Este script importa dados do carData.json e insere produtos na API via JSON.
 * * 🛑 EXECUÇÃO: Lembre-se de rodar com a flag de segurança desativada no Node.js:
 * * $env:NODE_TLS_REJECT_UNAUTHORIZED='0'; node seed.js
 */

const fs = require('fs'); // Módulo nativo do Node.js para ler arquivos

// ----------------------------------------------------------------------
// 🛑 1. CONFIGURAÇÃO 
// ----------------------------------------------------------------------

const BASE_URL = "https://192.168.1.163:5000/api/products";
// Seu token JWT (PREENCHIDO)
const AUTH_TOKEN_VALUE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjExMDMyNjU3NWJlNjg5YTA2NTg4ZCIsImVtYWlsIjoicm9kb2xmbzExQGdtYWlsLmNvbSIsImlhdCI6MTc2Mzc4NzA4MiwiZXhwIjoxNzYzNzkwNjgyfQ.R9JfgMkL2GNyCo93MCcm8Cf4cjZT87oWPlueEMeI4wc"; 
const COOKIE_NAME = 'jwt'; 
const DATA_FILE = 'carData.json'; // Nome do arquivo a ser importado

if (!AUTH_TOKEN_VALUE || AUTH_TOKEN_VALUE === "YOUR_AUTH_TOKEN_HERE") {
    console.error("❌ ERRO: Por favor, substitua 'YOUR_AUTH_TOKEN_HERE' pelo seu token JWT.");
    process.exit(1); 
}
const AUTH_TOKEN = AUTH_TOKEN_VALUE;

// ----------------------------------------------------------------------
// 🛑 2. FUNÇÃO DE INSERÇÃO
// ----------------------------------------------------------------------

/**
 * Insere um único produto na API usando formato JSON.
 */
async function insertProduct(productData) {
    try {
        console.log(`⏳ Tentando inserir: ${productData.name}`);
        
        // Não é mais necessário o Number() se o JSON já tiver o valor como número
        const response = await fetch(BASE_URL, {
            method: 'POST',
            // Envia como JSON
            body: JSON.stringify(productData), 
            headers: {
                // Define Content-Type como JSON
                'Content-Type': 'application/json', 
                'Cookie': `${COOKIE_NAME}=${AUTH_TOKEN}`, 
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`✅ SUCESSO: ${productData.name} inserido! ID: ${data.product._id}`);
            return data.product;
        } else {
            console.error(`❌ FALHA: ${productData.name}. Status: ${response.status}. Mensagem: ${data.message}`);
            return null;
        }

    } catch (error) {
        console.error(`❌ ERRO de rede/fetch para ${productData.name}:`, error);
        return null;
    }
}

// ----------------------------------------------------------------------
// 🛑 3. EXECUÇÃO
// ----------------------------------------------------------------------

function loadCarData() {
    try {
        console.log(`Buscando dados em ${DATA_FILE}...`);
        const jsonString = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(`\n🛑 ERRO FATAL: Falha ao carregar ou analisar o arquivo ${DATA_FILE}.`);
        console.error("Certifique-se de que o arquivo existe e está no formato JSON válido.");
        process.exit(1);
    }
}

async function runSeeding() {
    const carData = loadCarData();

    console.log(`\n--- INICIANDO INSERÇÃO DE ${carData.length} PRODUTOS ---`);
    console.log(`URL Base: ${BASE_URL}`);

    const results = [];
    for (const car of carData) {
        await new Promise(resolve => setTimeout(resolve, 50)); 
        const result = await insertProduct(car);
        if (result) {
            results.push(result);
        }
    }

    console.log(`\n--- INSERÇÃO CONCLUÍDA ---`);
    console.log(`Total de Produtos Tentados: ${carData.length}`);
    console.log(`Total de Produtos INSERIDOS COM SUCESSO: ${results.length}`);
    
    if (results.length < carData.length) {
        console.warn("⚠️ ATENÇÃO: Nem todos os produtos foram inseridos. Verifique os logs do servidor.");
    }
}

// Inicia o processo de seeding
runSeeding();