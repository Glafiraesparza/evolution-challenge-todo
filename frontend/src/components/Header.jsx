
function Header({ status }) {
  const connected = status === "Conectado";

  return (
    <header className="bg-white border-bottom shadow-sm">
      <div className="container py-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="h3 fw-bold mb-1">
              ✓ To-Do List
            </h1>
            <p className="text-muted small mb-0">
              The Evolution Challenge · Team 1: Build It
            </p>
          </div>

          <span
            className={`badge rounded-pill ${
              connected ? "bg-success" : "bg-secondary"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
