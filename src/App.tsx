import { useState } from "react";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import PrediccionConsumo from "./components/PrediccionConsumo"; // Importamos tu parte de IA

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <div style={{ padding: "20px" }}>
        <h1>Panel de Gestión Energética - QueryCore</h1>
        <hr />
        {/* Aquí se renderiza tu Módulo de Predicción e IA */}
        <PrediccionConsumo />
      </div>
    </Layout>
  );
}