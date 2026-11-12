
import { useState, type FormEvent } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [kycApproved, setKycApproved] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (loading) return

    const nameParts = name.trim().split(/\s+/)

    if (
      nameParts.length < 2 ||
      nameParts.some(part => part.length < 2)
    ) {
      setError('Ingresa tu nombre y al menos un apellido.')
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
    setLoading(true)

    // Simulación de procesamiento. No realiza KYC real.
    window.setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 700)
  }

  const handleReset = () => {
    setSuccess(false)
    setLoading(false)
    setError('')
    setName('')
    setPhone('')
    setKycApproved(false)
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

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                placeholder="Ej. Mariana Torres"
                value={name}
                autoComplete="name"
                aria-invalid={Boolean(error)}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                disabled={loading}
              />

              <label htmlFor="phone">Número de celular</label>
              <div className="phone-input">
                <span>+52</span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="10 dígitos"
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ''))
                    setError('')
                  }}
                  disabled={loading}
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
                    aria-label="Activar verificación simulada"
                    checked={kycApproved}
                    onChange={(e) => {
                      setKycApproved(e.target.checked)
                      setError('')
                    }}
                    disabled={loading}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}>
                {loading ? 'Procesando registro...' : 'Crear mi cuenta →'}
              </button>
            </form>

            <p className="security">
              🔒 Tus datos son ficticios. Esta es una demostración académica.
            </p>
          </>
        ) : (
          <div className="success" role="status">
            <div className="success-icon">✓</div>
            <p className="eyebrow">REGISTRO COMPLETADO</p>
            <h1>¡Bienvenida a Kampus, {name.trim().split(/\s+/)[0]}!</h1>
            <p className="subtitle">
              Tu registro de demostración se completó correctamente.
              La verificación KYC fue simulada.
            </p>
            <button onClick={handleReset}>
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
