// src/components/ProductCard.jsx
import { Edit, Trash2, Image, Package } from "lucide-react";
import "./ProductCard.css";
// IMPORTANTE: Importar a função
import { formatCurrency } from '../utils/currencyFormatter'; 

export default function ProductCard({ 
  item, 
  onEdit, 
  onDelete, 
  onSelect, 
  isSelected, 
  onOpenView 
}) {
  
  // ... (funções handleEditClick, handleDeleteClick, handleSelectClick permanecem iguais) ...
  const handleEditClick = (e) => {
    e.stopPropagation(); // Impede que o modal de visualização abra
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
  
  // Variável formatada para o preço
  const formattedPrice = formatCurrency(item.preco);

  return (
    <li 
      className={`product-card ${isSelected ? "selected" : ""}`}
      onClick={() => onOpenView(item)}
    >
      
      {/* ... (Controles e Imagem permanecem iguais) ... */}
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
          {/* APLICANDO A FORMATAÇÃO DE MOEDA AQUI */}
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