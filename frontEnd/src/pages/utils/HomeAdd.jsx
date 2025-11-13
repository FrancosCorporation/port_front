// src/components/HomeAdd.jsx
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import ProductModal from "./ProductModal";
import ProductCard from "./ProductCard";
import ProductViewModal from "./ProductViewModal"; // 1. Importar o ViewModal
import "./HomeAdd.css";

export default function HomeAdd() {
  const [itens, setItens] = useState(() => JSON.parse(localStorage.getItem("itens")) || []);
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Modal de Edição/Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 2. Estado para o Modal de Visualização
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);

  useEffect(() => {
    localStorage.setItem("itens", JSON.stringify(itens));
  }, [itens]);

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      setItens(
        itens.map((item) => (item.id === itemData.id ? itemData : item))
      );
    } else {
      setItens([...itens, itemData]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Funções de Abertura/Fechamento (Edição)
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // 3. Funções de Abertura/Fechamento (Visualização)
  const handleOpenViewModal = (item) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingItem(null);
  };

  // ... (funções de delete e seleção permanecem iguais) ...
  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente deletar este item?")) {
      setItens(itens.filter((item) => item.id !== id));
      setSelectedItems(selectedItems.filter((i) => i !== id));
    }
  };
  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (selectedItems.length === itens.length) setSelectedItems([]);
    else setSelectedItems(itens.map((i) => i.id));
  };
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (window.confirm(`Deletar ${selectedItems.length} itens selecionados?`)) {
      setItens(itens.filter((i) => !selectedItems.includes(i.id)));
      setSelectedItems([]);
    }
  };

  return (
    <div className="home-add-container">
      {/* ... (seção .add-section e .bulk-actions sem mudanças) ... */}
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
        {itens.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onSelect={handleSelectItem}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
            onOpenView={handleOpenViewModal} // 4. Passar a função para o card
          />
        ))}
      </ul>

      {/* Modal de Edição/Criação */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={editingItem}
      />

      {/* 5. Renderizar o Modal de Visualização */}
      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        item={viewingItem}
      />
    </div>
  );
}