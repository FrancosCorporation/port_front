import { useState } from 'react';
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const [itens, setItens] = useState([]);

  const adicionarItem = () => {
    setItens([...itens, { id: Date.now(), nome: `Item ${itens.length + 1}` }]);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Settings</h2>
      <button onClick={adicionarItem} style={{ marginBottom: "1rem" }}>
        <Settings size={20} /> Adicionar Item
      </button>
      <ul>
        {itens.map((item) => (
          <li key={item.id}>{item.nome}</li>
        ))}
      </ul>
    </div>
  );
}
