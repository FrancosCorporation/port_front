// src/components/HomeAdd.jsx
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { 
  ProductCard, 
  ProductModal, 
  ProductViewModal 
} from './ProductComponents';
import { getProducts, deleteProduct } from '../../components/services/productService';
import "./HomeAdd.css";

export default function HomeAdd() {
  const [itens, setItens] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Modal de Edição/Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Modal de Visualização
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);

  // Buscar produtos do backend ao carregar
  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
        // Filtra apenas produtos válidos com _id
        setItens(products.filter(p => p._id));
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    }
    fetchProducts();
  }, []);

  // ---------- Funções de Modal ----------
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  const handleSaveItem = (savedProduct) => {
    if (!savedProduct?._id) return; // garante que só salva itens válidos do backend

    const exists = itens.find(item => item._id === savedProduct._id);
    if (exists) {
      setItens(itens.map(item => item._id === savedProduct._id ? savedProduct : item));
    } else {
      setItens([savedProduct, ...itens]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleOpenViewModal = (item) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setViewingItem(null);
    setIsViewModalOpen(false);
  };

  // ---------- Funções de Delete ----------
  const handleDelete = async (_id) => {
    if (!window.confirm("Deseja realmente deletar este item?")) return;
    try {
      await deleteProduct(_id);
      setItens(itens.filter(item => item._id !== _id));
      setSelectedItems(selectedItems.filter(id => id !== _id));
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
    }
  };
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!window.confirm(`Deseja deletar ${selectedItems.length} itens selecionados?`)) return;
    try {
      for (const id of selectedItems) {
        await deleteProduct(id);
      }
      setItens(itens.filter(item => !selectedItems.includes(item._id)));
      setSelectedItems([]);
    } catch (err) {
      console.error("Erro ao deletar produtos em massa:", err);
    }
  };

  // ---------- Funções de Seleção ----------
  const handleSelectItem = (_id) => {
    setSelectedItems(prev =>
      prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]
    );
  };
  const handleSelectAll = () => {
    if (selectedItems.length === itens.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(itens.map(item => item._id));
    }
  };

  return (
    <div className="home-add-container">
      <div className="add-section">
        <h3>Gerenciador de Itens</h3>
        <button className="add-button" onClick={handleOpenAddModal} title="Adicionar novo item">
          <Plus size={18} /> Adicionar Item
        </button>
      </div>

      {itens.length > 0 && (
        <div className="bulk-actions">
          <button onClick={handleSelectAll}>
            {selectedItems.length === itens.length ? "Deselecionar todos" : "Selecionar todos"}
          </button>
          <button onClick={handleBulkDelete} disabled={selectedItems.length === 0} className="delete-button">
            <Trash2 size={16} /> Deletar ({selectedItems.length})
          </button>
        </div>
      )}

      <ul className="itens-list">
        {itens.map(item => (
          <ProductCard
            key={item._id}
            item={item}
            isSelected={selectedItems.includes(item._id)}
            onSelect={handleSelectItem}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
            onOpenView={handleOpenViewModal}
          />
        ))}
      </ul>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={editingItem}
      />

      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        item={viewingItem}
      />
    </div>
  );
}
