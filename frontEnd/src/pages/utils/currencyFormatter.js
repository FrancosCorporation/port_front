/**
 * Formata um valor numérico ou string em formato de moeda brasileira (R$ X.XXX,XX).
 * Também garante que o valor não quebre a linha (white-space: nowrap).
 * @param {string | number} value O valor a ser formatado.
 * @returns {string} O valor formatado como moeda.
 */
export function formatCurrency(value) {
  const numberValue = Number(value);
  if (isNaN(numberValue)) return "R$ 0,00";

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  return formatter.format(numberValue).replace(/\s/g, "\u00A0");
}

/**
 * Formata em tempo real um valor digitado para o formato BRL.
 * Exemplo: digita 1234 → mostra "12,34".
 */
export function formatCurrencyInput(input) {
  let value = input.replace(/\D/g, ""); // remove tudo que não é dígito
  if (!value) return "";

  const numericValue = (Number(value) / 100).toFixed(2);
  return numericValue.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
