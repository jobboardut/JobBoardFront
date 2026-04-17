function DashboardHeader() {
  return (
    <header className="hero-panel">
      <div>
        <p className="eyebrow">Panel de control</p>
        <h1>Hola, buenos días Daniel. Esto es lo que está sucediendo en tu feed hoy.</h1>
        <p className="hero-copy">
          Vista general para operar el sistema de forma clara, con la información clave concentrada en un solo lugar.
        </p>
      </div>

      <div className="hero-badge">
        <span>Actualizado hoy</span>
        <strong>08:30</strong>
      </div>
    </header>
  )
}

export default DashboardHeader