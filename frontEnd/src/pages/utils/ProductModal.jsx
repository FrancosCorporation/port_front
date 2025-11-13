import { useState, useEffect } from 'react';
import { X, Image, Package, Save } from "lucide-react";
import "./ProductModal.css";
import { formatCurrency, formatCurrencyInput } from "../utils/currencyFormatter";

export default function ProductModal({ isOpen, onClose, onSave, itemToEdit }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState(0);
  const [fotoUrl, setFotoUrl] = useState("");

  const modalTitle = itemToEdit ? "Editar Item" : "Adicionar Novo Item";

  useEffect(() => {
    if (itemToEdit) {
      setNome(itemToEdit.nome || "");
      setDescricao(itemToEdit.descricao || "");
      const priceToFormat = itemToEdit.preco || 0;
      setPreco(formatCurrency(priceToFormat).replace("R$", "").trim());
      setEstoque(itemToEdit.estoque || 0);
      setFotoUrl(itemToEdit.fotoUrl || "");
    } else {
      setNome("");
      setDescricao("");
      setPreco("");
      setEstoque(0);
      setFotoUrl("");
    }
  }, [itemToEdit, isOpen]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPreco(formatCurrencyInput(value)); // formata em tempo real
  };

  const handleSave = () => {
    const rawPrice = preco.replace(/\./g, "").replace(/,/g, ".");
    const itemData = {
      id: itemToEdit ? itemToEdit.id : Date.now(),
      nome,
      descricao,
      preco: Number(rawPrice) || 0,
      estoque,
      fotoUrl,
    };
    onSave(itemData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <X size={18} />
        </button>

        <h3>{modalTitle}</h3>

        <div className="form-group form-image-preview">
          {fotoUrl ? (
            <img src={fotoUrl} alt={nome} />
          ) : (
            <div className="image-placeholder">
              <Image size={48} color="#ccc" />
              <span>Sem Imagem</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>URL da Imagem</label>
          <input
            type="text"
            placeholder="https://..."
            value={fotoUrl}
            onChange={(e) => setFotoUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Nome do Item</label>
          <input
            type="text"
            className="input-nome"
            placeholder="Supercarro Elétrico"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            className="input-descricao"
            placeholder="Desempenho impactante. Design futurista."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Valor (R$)</label>
            <div className="input-with-icon">
              <span className="currency-symbol">R$</span>
              <input
                type="text"
                placeholder="899.000,00"
                value={preco}
                onChange={handlePriceChange}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Estoque (Qtd)</label>
            <div className="input-with-icon">
              <Package size={16} />
              <input
                type="number"
                placeholder="0"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button className="modal-save-button" onClick={handleSave}>
          <Save size={18} />
          {modalTitle === "Editar Item" ? "Atualizar Item" : "Salvar Item"}
        </button>
      </div>
    </div>
  );
}
