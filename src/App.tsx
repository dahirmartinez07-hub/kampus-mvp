
import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [kycApproved, setKycApproved] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (name.trim().length < 3) {
      setError('Ingresa tu nombre completo.')
      return
    }

    if (!/^\d{10}$/.test(phone)) {
      setError('Ingresa un teléfono válido de 10 dígitos.')
      return
    }

    if (!kycApproved) {
      setError('Activa la verificación de identidad para continuar.')
      return
    }

    setError('')
    setSuccess(true)
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">K</span>
          <span>Kampus</span>
        </div>
        <span className="demo">DEMO MODE</span>
      </header>

      <section className="register-card">
        {!success ? (
          <>
            <div className="welcome-icon">K</div>
            <p className="eyebrow">TU DINERO, TU FUTURO</p>
            <h1>Tu vida financiera empieza aquí.</h1>
            <p className="subtitle">
              Crea tu cuenta Kampus y comienza a administrar
              tu dinero de forma sencilla.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                placeholder="Ej. Mariana Torres"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="phone">Número de celular</label>
              <div className="phone-input">
                <span>+52</span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="10 dígitos"
                  maxLength={10}
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ''))
                  }
                />
              </div>

              <div className="verification">
                <div>
                  <strong>Verificación de identidad</strong>
                  <p>Simulación de validación KYC</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={kycApproved}
                    onChange={(e) => setKycApproved(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {error && <p className="error">{error}</p>}

              <button type="submit">Crear mi cuenta →</button>
            </form>

            <p className="security">
              🔒 Tus datos son ficticios. Esta es una demostración académica.
            </p>
          </>
        ) : (
          <div className="success">
            <div className="success-icon">✓</div>
            <p className="eyebrow">REGISTRO COMPLETADO</p>
            <h1>¡Bienvenida a Kampus, {name.split(' ')[0]}!</h1>
            <p className="subtitle">
              Tu registro de demostración se completó correctamente.
              La verificación KYC fue simulada.
            </p>
            <button onClick={() => setSuccess(false)}>
              Volver al registro
            </button>
          </div>
        )}
      </section>

      <footer>
        Kampus © 2026 · Banca digital para estudiantes
        <p>Prototipo académico · No procesa dinero real</p>
      </footer>
    </main>
  )
}

export default App
