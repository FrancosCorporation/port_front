import { Settings, CircleUser, House, Activity } from "lucide-react";
import React from "react";
import HomeAdd from "../pages/utils/HomeAdd";
import MonitoramentoPage from "../pages/utils/MonitoramentoPage";
import PerfilPage from "../pages/utils/PerfilPage";
import SettingsPage from "../pages/utils/SettingsPage";

export const menuConfig = [
  { nome: "Home", icone: House, conteudo: <HomeAdd /> },
  { nome: "Monitoramento", icone: Activity, conteudo: <MonitoramentoPage /> },
  { nome: "Perfil", icone: CircleUser, conteudo: <PerfilPage /> },
  { nome: "Settings", icone: Settings, conteudo: <SettingsPage /> },
];
