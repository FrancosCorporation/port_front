// src/components/ProductViewModal.jsx
import { X, Package, Image } from "lucide-react";
import "./ProductViewModal.css"; 
// 1. IMPORTAR a função de formatação de moeda
import { formatCurrency } from '../utils/currencyFormatter'; 

export default function ProductViewModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) {
    return null;
  }
  
  // 2. FORMATAR o preço logo no início do componente
  const formattedPrice = formatCurrency(item.preco);

  return (
    <div className="view-modal-overlay" onClick={onClose}>
      <div className="view-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="view-modal-close-button" onClick={onClose}>
          <X size={18} />
        </button>

        {/* 1. Imagem (Grande) */}
        <div className="view-modal-image">
          {item.fotoUrl ? (
            <img src={item.fotoUrl} alt={item.nome} />
          ) : (
            <div className="view-image-placeholder">
              <Image size={64} color="#ccc" />
              <span>Sem Imagem</span>
            </div>
          )}
        </div>

        {/* 2. Conteúdo */}
        <div className="view-modal-content">
          <h3>{item.nome}</h3>

          <div className="view-modal-row">
            <span className="view-price">
              {/* 3. USAR o preço formatado */}
              {formattedPrice} 
            </span>
            <span className="view-stock">
              <Package size={16} />
              {item.estoque || 0} em estoque
            </span>
          </div>

          <div className="view-modal-description">
            <label>Descrição Completa</label>
            <p>{item.descricao || "Nenhuma descrição fornecida."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}