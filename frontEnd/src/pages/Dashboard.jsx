import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // CSS polido para beleza

// --- SIMULAÇÃO DE API ---
// Função que simula buscar o perfil no backend, assumindo que o JWT no cookie é válido.
// Em um app real, aqui você faria um 'fetch' para '/api/profile'
const fetchUserProfile = async () => {
  // SIMULAÇÃO: Se o fetch for bem-sucedido (o token no cookie validou), ele retorna os dados.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'Usuário Autenticado',
        email: 'autenticado@api.com',
      });
    }, 500); // Simula um delay de rede
  });
};
// -------------------------

function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [profile, setProfile] = useState({
    name: localStorage.getItem('profileName') || '', // Inicializa vazio para forçar busca/redirecionamento
    email: localStorage.getItem('profileEmail') || '',
  });
  const [loading, setLoading] = useState(true); // Novo estado de loading
  // ... (outros estados como showProfileModal, items, etc.)

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('items')) || []);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', status: 'pendente' });
  const [profileEdit, setProfileEdit] = useState({ ...profile });
  const [errors, setErrors] = useState({});

  // Efeito principal: Verificação de Autenticação e Busca de Perfil
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      // 1. Verificar se o perfil JÁ está no localStorage (login recente)
      if (profile.name && profile.email) {
        setLoading(false);
        return;
      }
      
      // 2. Tentar buscar o perfil (Assume-se que o JWT Cookie está lá e o backend o lerá)
      try {
        setLoading(true);
        const user = await fetchUserProfile(); // Esta função usa o Cookie implicitamente
        
        // Se a busca for bem-sucedida, atualiza o estado e o localStorage
        setProfile(user);
        setProfileEdit(user);
        localStorage.setItem('profileName', user.name);
        localStorage.setItem('profileEmail', user.email);
        
      } catch (error) {
        // Se a busca falhar (o backend retorna 401 Unauthorized porque o Cookie expirou/não existe)
        console.error('Falha na autenticação/busca de perfil:', error);
        localStorage.clear(); // Limpa qualquer dado local antigo
        navigate('/login', { replace: true }); // Redireciona para login e impede o retorno
        return; 
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [navigate, profile.name, profile.email]); // Dependências: profile.name/email para evitar loop, navigate é estável.


  // Aplicar tema
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persistir dados
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
    // Perfil só é salvo no localStorage após o fetch para evitar dados "antigos"
  }, [items]);

  // --- Funções Auxiliares (mantidas as originais) ---
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleProfileEditChange = (e) => {
    const { name, value } = e.target;
    setProfileEdit({ ...profileEdit, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!profileEdit.name || profileEdit.name.length < 2) newErrors.name = 'Nome deve ter pelo menos 2 caracteres.';
    if (!profileEdit.email || !validateEmail(profileEdit.email)) newErrors.email = 'Email inválido.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setProfile(profileEdit);
    // Persiste as alterações do perfil no localStorage imediatamente
    localStorage.setItem('profileName', profileEdit.name);
    localStorage.setItem('profileEmail', profileEdit.email);

    setShowProfileModal(false);
  };
  
  // Funções de CRUD (AddItem, EditItem, DeleteItem) mantidas...
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.description.trim()) {
      alert('Nome e descrição são obrigatórios.');
      return;
    }
    const item = { id: Date.now(), ...newItem, createdAt: new Date().toLocaleDateString() };
    setItems([...items, item]);
    setNewItem({ name: '', description: '', status: 'pendente' });
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
    setShowEditItemModal(true);
  };

  const handleEditItemChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleUpdateItem = () => {
    setItems(items.map((item) => (item.id === editingItem.id ? editingItem : item)));
    setShowEditItemModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Deletar este item?')) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return alert('Selecione itens para deletar.');
    if (window.confirm(`Deletar ${selectedItems.length} itens selecionados?`)) {
      setItems(items.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusIcon = (status) => {
    if (status === 'concluido') return <i className="fas fa-check-circle status-icon completed"></i>;
    return <i className="fas fa-clock status-icon pending"></i>;
  };
  // Fim das Funções de CRUD

  // Exibe tela de carregamento enquanto verifica a autenticação
  if (loading || !profile.name) {
    return (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Verificando autenticação e carregando perfil...</p>
        </div>
    );
  }

  // O JSX original começa aqui
  return (
    <div className={`dashboard ${theme}`}>
      {/* O resto do JSX (Header, Main, Modals) permanece o mesmo */}
      {/* Certifique-se de que a tela de loading/spinner está definida no CSS */}

      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-left">
            <h1 className="dashboard-title">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </h1>
            <span className="item-count">Itens: {items.length}</span>
          </div>
          <div className="header-right">
            <div className="theme-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={handleThemeToggle}
                />
                <span className="slider">
                  <i className="fas fa-sun slider-icon sun"></i>
                  <i className="fas fa-moon slider-icon moon"></i>
                </span>
              </label>
              <span className="theme-label">{theme === 'light' ? 'Claro' : 'Escuro'}</span>
            </div>

            <div className="profile-section">
              <div className="avatar-wrapper">
                <img src={`https://ui-avatars.com/api/?name=${profile.name.split(' ').join('+')}&background=049cfc&color=fff`} alt="Avatar" className="avatar" />
                <div className="avatar-glow"></div>
              </div>
              <div className="profile-info">
                <span className="profile-name">{profile.name}</span>
                <span className="profile-email">{profile.email}</span>
              </div>
              <button className="edit-profile-btn" onClick={() => { setProfileEdit({ ...profile }); setShowProfileModal(true); }}>
                <i className="fas fa-cog"></i>
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <section className="add-item-section">
            <h2 className="section-title">
              <i className="fas fa-plus-circle"></i> Adicionar Novo Item
            </h2>
            <form className="add-item-form" onSubmit={handleAddItem}>
              <div className="input-field-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={newItem.name}
                  onChange={handleNewItemChange}
                  required
                />
                <label>Nome do Item</label>
                <i className="fas fa-tag input-icon"></i>
              </div>
              <div className="input-field-wrapper">
                <textarea
                  name="description"
                  placeholder=" "
                  value={newItem.description}
                  onChange={handleNewItemChange}
                  required
                  rows="4"
                ></textarea>
                <label>Descrição</label>
                <i className="fas fa-align-left input-icon"></i>
              </div>
              <div className="input-field-wrapper select-wrapper">
                <select name="status" value={newItem.status} onChange={handleNewItemChange}>
                  <option value="pendente">Pendente</option>
                  <option value="concluido">Concluído</option>
                </select>
                <i className="fas fa-info-circle input-icon"></i>
              </div>
              <button type="submit" className="add-btn">
                <i className="fas fa-plus"></i> Adicionar Item
              </button>
            </form>
          </section>

          <section className="items-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-list-ul"></i> Meus Itens
              </h2>
              <div className="section-actions">
                <button className="select-all-btn" onClick={handleSelectAll}>
                  <i className="fas fa-check-square"></i> {selectedItems.length === items.length ? 'Desselecionar' : 'Selecionar'} Todos
                </button>
                <button className={`bulk-delete-btn ${selectedItems.length === 0 ? 'disabled' : ''}`} onClick={handleBulkDelete}>
                  <i className="fas fa-trash-alt"></i> Deletar Selecionados <span className="badge">{selectedItems.length}</span>
                </button>
              </div>
            </div>
            {items.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox empty-icon"></i>
                <h3>Nenhum item ainda</h3>
                <p>Adicione seu primeiro item acima para começar!</p>
              </div>
            ) : (
              <div className="items-grid">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`item-card ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="item-checkbox"
                    />
                    <div className="item-content">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="item-meta">
                        <span className="status-badge">
                          {getStatusIcon(item.status)} {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                        <span className="created-date">Criado em: {item.createdAt}</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEditItem(item)} className="edit-item-btn" title="Editar">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="delete-item-btn" title="Deletar">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal Editar Perfil */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-user-cog"></i> Editar Perfil</h2>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleProfileSubmit}>
              <div className="input-field-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={profileEdit.name}
                  onChange={handleProfileEditChange}
                  className={errors.name ? 'error' : ''}
                  required
                />
                <label>Nome</label>
                <i className="fas fa-user input-icon"></i>
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              <div className="input-field-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={profileEdit.email}
                  onChange={handleProfileEditChange}
                  className={errors.email ? 'error' : ''}
                  required
                />
                <label>Email</label>
                <i className="fas fa-envelope input-icon"></i>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Salvar Alterações</button>
                <button type="button" className="cancel-btn" onClick={() => setShowProfileModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Item */}
      {showEditItemModal && editingItem && (
        <div className="modal-overlay" onClick={() => setShowEditItemModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-edit"></i> Editar Item</h2>
              <button className="close-btn" onClick={() => setShowEditItemModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form>
              <div className="input-field-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={editingItem.name}
                  onChange={handleEditItemChange}
                  required
                />
                <label>Nome</label>
                <i className="fas fa-tag input-icon"></i>
              </div>
              <div className="input-field-wrapper">
                <textarea
                  name="description"
                  placeholder=" "
                  value={editingItem.description}
                  onChange={handleEditItemChange}
                  required
                  rows="4"
                ></textarea>
                <label>Descrição</label>
                <i className="fas fa-align-left input-icon"></i>
              </div>
              <div className="input-field-wrapper select-wrapper">
                <select name="status" value={editingItem.status} onChange={handleEditItemChange}>
                  <option value="pendente">Pendente</option>
                  <option value="concluido">Concluído</option>
                </select>
                <i className="fas fa-info-circle input-icon"></i>
              </div>
              <div className="modal-actions">
                <button type="button" className="save-btn" onClick={handleUpdateItem}>Atualizar Item</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditItemModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
