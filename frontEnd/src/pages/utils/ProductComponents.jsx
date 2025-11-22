// src/components/ProductComponents.jsx
import { useState, useEffect } from 'react';
import { 
  Edit, Trash2, Image, Package, X, Save, Plus
} from "lucide-react";
import { 
  formatCurrency, 
  formatCurrencyInput 
} from '../utils/currencyFormatter';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProducts 
} from '../../components/services/productService';
import "./ProductComponents.css";

// --------- COMPONENTE ProductCard ---------
export function ProductCard({ item, onEdit, onDelete, onSelect, isSelected, onOpenView }) {
  const handleEditClick = (e) => { e.stopPropagation(); onEdit(item); };
  const handleDeleteClick = (e) => { e.stopPropagation(); onDelete(item._id); };
  const handleSelectClick = (e) => { e.stopPropagation(); onSelect(item._id); };

  const formattedPrice = formatCurrency(item.price);

  return (
    <li className={`product-card ${isSelected ? "selected" : ""}`} onClick={() => onOpenView(item)}>
      <div className="product-card-controls" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={isSelected} onChange={handleSelectClick} title="Selecionar item" />
        <button onClick={handleEditClick} title="Editar"><Edit size={16} /></button>
        <button onClick={handleDeleteClick} title="Deletar" className="delete-btn"><Trash2 size={16} /></button>
      </div>

      <div className="product-card-image">
        {item.image ? <img src={item.image} alt={item.name} /> :
        <div className="image-placeholder"><Image size={48} color="#ccc" /></div>}
      </div>

      <div className="product-card-info">
        <h4>{item.name}</h4>
        <p>{item.description || "Sem descrição."}</p>
        <div className="product-card-footer">
          <span className="price">{formattedPrice}</span>
          <span className="stock"><Package size={14} />{item.stock || 0} em estoque</span>
        </div>
      </div>
    </li>
  );
}

// --------- COMPONENTE ProductModal (Create/Edit) ---------
export function ProductModal({ isOpen, onClose, onSave, itemToEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const modalTitle = itemToEdit ? "Editar Item" : "Adicionar Novo Item";

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name || "");
      setDescription(itemToEdit.description || "");
      setPrice(formatCurrency(itemToEdit.price || 0).replace("R$", "").trim());
      setStock(itemToEdit.stock || 0);
      setImage(itemToEdit.image || "");
    } else {
      setName(""); setDescription(""); setPrice(""); setStock(0); setImage("");
    }
  }, [itemToEdit, isOpen]);

  const handlePriceChange = (e) => setPrice(formatCurrencyInput(e.target.value));

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const itemData = { name, description, price, stock, image };

    try {
      let savedProduct;
      if (itemToEdit) {
        savedProduct = await updateProduct(itemToEdit._id, itemData);
      } else {
        savedProduct = await createProduct(itemData);
      }
      onSave(savedProduct);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError(err.message || "Erro desconhecido ao salvar.");
    } finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}><X size={18} /></button>
        <h3>{modalTitle}</h3>

        <div className="form-group form-image-preview">
          {image ? <img src={image} alt={name} /> :
          <div className="image-placeholder"><Image size={48} color="#ccc" /><span>Sem Imagem</span></div>}
        </div>

        <div className="form-group">
          <label>URL da Imagem</label>
          <input type="text" placeholder="https://..." value={image} onChange={(e) => setImage(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Nome do Item</label>
          <input type="text" placeholder="Título do Produto" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea placeholder="Descrição detalhada do produto" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Valor (R$)</label>
            <div className="input-with-icon">
              <span className="currency-symbol">R$</span>
              <input type="text" placeholder="150,00" value={price} onChange={handlePriceChange} inputMode="numeric" />
            </div>
          </div>

          <div className="form-group">
            <label>Estoque (Qtd)</label>
            <div className="input-with-icon">
              <Package size={16} />
              <input type="number" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="modal-save-button" onClick={handleSave} disabled={isLoading}>
          <Save size={18} />
          {modalTitle === "Editar Item" ? "Atualizar Item" : "Salvar Item"}
        </button>
      </div>
    </div>
  );
}

// --------- COMPONENTE ProductViewModal ---------
export function ProductViewModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;
  const formattedPrice = formatCurrency(item.price);

  return (
    <div className="view-modal-overlay" onClick={onClose}>
      <div className="view-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="view-modal-close-button" onClick={onClose}><X size={18} /></button>
        <div className="view-modal-image">
          {item.image ? <img src={item.image} alt={item.name} /> :
          <div className="view-image-placeholder"><Image size={64} color="#ccc" /><span>Sem Imagem</span></div>}
        </div>

        <div className="view-modal-content">
          <h3>{item.name}</h3>
          <div className="view-modal-row">
            <span className="view-price">{formattedPrice}</span>
            <span className="view-stock"><Package size={16} />{item.stock || 0} em estoque</span>
          </div>
          <div className="view-modal-description">
            <label>Descrição Completa</label>
            <p>{item.description || "Nenhuma descrição fornecida."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------- COMPONENTE PRINCIPAL ProductDashboard ---------
export function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const allProducts = await getProducts();
      setProducts(allProducts);
    }
    fetchData();
  }, []);

  const handleOpenModal = () => { setItemToEdit(null); setIsModalOpen(true); };
  const handleEdit = (item) => { setItemToEdit(item); setIsModalOpen(true); };
  const handleSave = (savedProduct) => {
    const exists = products.find(p => p._id === savedProduct._id);
    if (exists) {
      setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
    } else {
      setProducts([savedProduct, ...products]);
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Deseja realmente deletar este produto?")) return;
    await deleteProduct(_id);
    setProducts(products.filter(p => p._id !== _id));
  };

  const handleSelect = (_id) => {
    setSelectedItem(selectedItem === _id ? null : _id);
  };

  const handleOpenView = (item) => { setViewItem(item); };
  const handleCloseView = () => { setViewItem(null); };

  return (
    <div className="product-dashboard">
      <button className="add-product-btn" onClick={handleOpenModal}><Plus size={18} /> Adicionar Produto</button>

      <ul className="product-list">
        {products.map(item => (
          <ProductCard 
            key={item._id} 
            item={item} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onSelect={handleSelect} 
            isSelected={selectedItem === item._id}
            onOpenView={handleOpenView}
          />
        ))}
      </ul>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        itemToEdit={itemToEdit}
      />

      <ProductViewModal 
        isOpen={!!viewItem} 
        onClose={handleCloseView} 
        item={viewItem}
      />
    </div>
  );
}
