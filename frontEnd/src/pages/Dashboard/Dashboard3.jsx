import { useState } from "react";
import { menuConfig as initialMenuConfig } from "../../lib/menuConfig";
import { CircleUser } from "lucide-react";
import "./Dashboard3.css";

export default function Dashboard() {
  const [menuConfig, setMenuConfig] = useState(initialMenuConfig);
  const [ativoIndex, setAtivoIndex] = useState(0);

  // Adicionar novo item dinamicamente
  const adicionarItem = () => {
    const novoIndex = menuConfig.length + 1;
    setMenuConfig([
      ...menuConfig,
      {
        nome: `Item ${novoIndex}`,
        icone: menuConfig[0].icone,
        conteudo: (
          <div style={{ padding: "1rem" }}>
            Conteúdo dinâmico do item {novoIndex}
          </div>
        ),
      },
    ]);
  };

  return (
    <div className="dashboard-page">
      {/* MENU LATERAL */}
      <div className="menu_side">
        {menuConfig.map((btn, index) => {
          const Icone = btn.icone;
          const ativo = index === ativoIndex;

          return (
            <button
              key={index}
              className="settings-button"
              onClick={() => setAtivoIndex(index)}
              aria-label={btn.nome}
            >
              <Icone
                className={`settings-icon ${ativo ? "ativo" : ""}`}
                size={28}
              />
            </button>
          );
        })}

        {/* Botão de adicionar novo ícone */}
        <button className="settings-button" onClick={adicionarItem}>
        </button>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="menu_side2">
        {/* BARRA SUPERIOR */}
        <div className="profile-bar">
          <CircleUser className="profile-icon" size={30} />
        </div>

        {/* ÁREA PRINCIPAL */}
        <div className="lading_page">{menuConfig[ativoIndex].conteudo}</div>
      </div>
    </div>
  );
}
