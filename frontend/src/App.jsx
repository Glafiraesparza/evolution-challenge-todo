
import { useEffect, useState } from "react";
import { checkHealth } from "./services/api";

function App() {
  const [status, setStatus] = useState("Conectando...");

  useEffect(() => {
    checkHealth()
      .then((data) => {
        setStatus(data.status === "ok" ? "Conectado" : "Error");
      })
      .catch(() => {
        setStatus("Sin conexión");
      });
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">To-Do List</h1>

      <p className="text-center text-muted">
        The Evolution Challenge - Team 1: Build It
      </p>

      <div className="card shadow-sm p-4 mt-4">
        <h4>Proyecto inicializado</h4>

        <p>
          Estado del backend:{" "}
          <span
            className={`badge ${
              status === "Conectado"
                ? "bg-success"
                : "bg-secondary"
            }`}
          >
            {status}
          </span>
        </p>

        <p className="text-muted">
          Base de desarrollo lista para implementar
          las funcionalidades de la aplicación.
        </p>

        <button className="btn btn-primary">
          Comenzar
        </button>
      </div>
    </div>
  );
}

export default App;
