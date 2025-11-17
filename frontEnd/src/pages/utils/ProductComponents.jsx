// src/components/ProductComponents.jsx
import { useState, useEffect } from 'react';
// ... (Mantenha todos os imports do ProductCard e ProductViewModal) ...
import { createProduct } from '../../components/services/productService'; // <-- NOVO IMPORT

// 1. IMPORTS COMBINADOS
import { 
  Edit, 
  Trash2, 
  Image, 
  Package, 
  X, 
  Save 
} from "lucide-react";
import { 
  formatCurrency, 
  formatCurrencyInput 
} from '../utils/currencyFormatter';

// 2. CSS COMBINADO
import "./ProductComponents.css";

// 3. COMPONENTES (usando "export function" em vez de "export default")

// --------- COMPONENTE ProductCard ---------
export function ProductCard({ 
  item, 
  onEdit, 
  onDelete, 
  onSelect, 
  isSelected, 
  onOpenView 
}) {
  
  const handleEditClick = (e) => {
    e.stopPropagation(); 
    onEdit(item);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  const handleSelectClick = (e) => {
    e.stopPropagation();
    onSelect(item.id);
  };
  
  const formattedPrice = formatCurrency(item.preco);

  return (
    <li 
      className={`product-card ${isSelected ? "selected" : ""}`}
      onClick={() => onOpenView(item)}
    >
      
      <div className="product-card-controls" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelectClick}
          title="Selecionar item"
        />
        <button onClick={handleEditClick} title="Editar">
          <Edit size={16} />
        </button>
        <button onClick={handleDeleteClick} title="Deletar" className="delete-btn">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="product-card-image">
        {item.fotoUrl ? (
          <img src={item.fotoUrl} alt={item.nome} />
        ) : (
          <div className="image-placeholder">
            <Image size={48} color="#ccc" />
          </div>
        )}
      </div>

      <div className="product-card-info">
        <h4>{item.nome}</h4>
        <p>{item.descricao || "Sem descrição."}</p>
        
        <div className="product-card-footer">
          <span className="price">{formattedPrice}</span> 
          
          <span className="stock">
            <Package size={14} />
            {item.estoque || 0} em estoque
          </span>
        </div>
      </div>
    </li>
  );
}


// --------- COMPONENTE ProductModal (Edit/Create) ---------
export function ProductModal({ isOpen, onClose, onSave, itemToEdit }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState(0);
  const [fotoUrl, setFotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // 🛑 NOVO: handleSave agora usa o serviço
  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // 1. Prepara os dados brutos (usando nomes do frontend)
    const itemData = {
      nome,
      descricao,
      preco, // String formatada
      estoque,
      fotoUrl,
    };
    
    try {
      if (itemToEdit) {
        throw new Error("A Edição de Produto não está implementada (PUT).");
      } else {
        // 2. Chama o serviço para criar o produto no backend
        const newProduct = await createProduct(itemData);
        
        // 3. Informa o componente pai com o produto do servidor
        onSave(newProduct); 
        onClose();
      }
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError(err.message || "Erro desconhecido ao salvar.");
    } finally {
      setIsLoading(false);
    }
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
            placeholder="Titulo do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            className="input-descricao"
            placeholder="Descrição detalhada do produto"
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
                placeholder="150,00"
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


// --------- COMPONENTE ProductViewModal ---------
export function ProductViewModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) {
    return null;
  }
  
  const formattedPrice = formatCurrency(item.preco);

  return (
    <div className="view-modal-overlay" onClick={onClose}>
      <div className="view-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="view-modal-close-button" onClick={onClose}>
          <X size={18} />
        </button>

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

        <div className="view-modal-content">
          <h3>{item.nome}</h3>

          <div className="view-modal-row">
            <span className="view-price">
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