
import { useState, type FormEvent } from 'react'
import './App.css'

type Screen =
  | 'login'
  | 'register'
  | 'registration-success'
  | 'account-opening'
  | 'account-opened'
  | 'dashboard'
  | 'receive-money'
  | 'make-payment'

type Transaction = {
  id: number
  date: string
  description: string
  amountCents: number
  type: 'transfer-in' | 'purchase'
}

type SavedAccount = {
  name: string
  phone: string
  password: string
  clabe: string
  balanceCents: number
  opened: boolean
  transactions?: Transaction[]
}

const STORAGE_KEY = 'kampus_demo_accounts'

function getAccounts(): SavedAccount[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as SavedAccount[] : []
  } catch {
    return []
  }
}

function saveAccounts(accounts: SavedAccount[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
}

function App() {
  const [accounts, setAccounts] = useState<SavedAccount[]>(getAccounts)

  const [screen, setScreen] = useState<Screen>('login')
  const [activeAccount, setActiveAccount] = useState<SavedAccount | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [kycApproved, setKycApproved] = useState(false)

  const [loginPhone, setLoginPhone] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [receiveAmount, setReceiveAmount] = useState('')
  const [receiveSender, setReceiveSender] = useState('')

  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [purchaseMerchant, setPurchaseMerchant] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const formatMoney = (cents: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(cents / 100)

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    const nameParts = name.trim().split(/\s+/)

    if (nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
      setError('Ingresa tu nombre y al menos un apellido.')
      return
    }

    if (!/^\d{10}$/.test(phone)) {
      setError('Ingresa un celular válido de 10 dígitos.')
      return
    }

    if (password.length < 6) {
      setError('Tu contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (accounts.some(account => account.phone === phone)) {
      setError('Este celular ya tiene una cuenta. Inicia sesión.')
      return
    }

    if (!kycApproved) {
      setError('Activa la verificación simulada para continuar.')
      return
    }

    setError('')
    setLoading(true)

    window.setTimeout(() => {
      setLoading(false)
      setScreen('registration-success')
    }, 700)
  }

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    if (!/^\d{10}$/.test(loginPhone)) {
      setError('Ingresa tu celular de 10 dígitos.')
      return
    }

    const account = accounts.find(
      item =>
        item.phone === loginPhone &&
        item.password === loginPassword &&
        item.opened
    )

    if (!account) {
      setError('No encontramos una cuenta con esos datos. Revisa tu celular y contraseña.')
      return
    }

    setError('')
    setLoading(true)

    window.setTimeout(() => {
      setActiveAccount(account)
      setLoading(false)
      setScreen('dashboard')
    }, 500)
  }

  const handleOpenAccount = () => {
    if (loading) return

    setLoading(true)

    window.setTimeout(() => {
      const newAccount: SavedAccount = {
        name: name.trim(),
        phone,
        password,
        clabe: '000000000000000000',
        balanceCents: 0,
        opened: true,
        transactions: [],
      }

      const updatedAccounts = [...accounts, newAccount]

      saveAccounts(updatedAccounts)
      setAccounts(updatedAccounts)
      setActiveAccount(newAccount)
      setLoading(false)
      setScreen('account-opened')
    }, 1000)
  }

  const handleReceiveMoney = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!activeAccount) return

    const validAmount = /^\d+(\.\d{1,2})?$/

    if (!validAmount.test(receiveAmount.trim())) {
      setError('Ingresa un monto válido con máximo dos decimales.')
      return
    }

    const amountCents = Math.round(Number(receiveAmount) * 100)

    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
      setError('El monto debe ser mayor a cero.')
      return
    }

    const transaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      description: receiveSender.trim() || 'Transferencia recibida',
      amountCents,
      type: 'transfer-in',
    }

    const updatedAccount: SavedAccount = {
      ...activeAccount,
      balanceCents: activeAccount.balanceCents + amountCents,
      transactions: [
        transaction,
        ...(activeAccount.transactions || []),
      ],
    }

    const updatedAccounts = accounts.map(account =>
      account.phone === activeAccount.phone ? updatedAccount : account
    )

    saveAccounts(updatedAccounts)
    setAccounts(updatedAccounts)
    setActiveAccount(updatedAccount)

    setReceiveAmount('')
    setReceiveSender('')
    setError('')
    setScreen('dashboard')
  }

  const handlePayment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!activeAccount) return

    const validAmount = /^\d+(\.\d{1,2})?$/

    if (!purchaseMerchant.trim()) {
      setError('Ingresa el nombre del comercio.')
      return
    }

    if (!validAmount.test(purchaseAmount.trim())) {
      setError('Ingresa un monto válido con máximo dos decimales.')
      return
    }

    const amountCents = Math.round(Number(purchaseAmount) * 100)

    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
      setError('El monto debe ser mayor a cero.')
      return
    }

    if (amountCents > activeAccount.balanceCents) {
      setError('Pago rechazado: no tienes saldo suficiente.')
      return
    }

    const transaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      description: `Compra en ${purchaseMerchant.trim()}`,
      amountCents,
      type: 'purchase',
    }

    const updatedAccount: SavedAccount = {
      ...activeAccount,
      balanceCents: activeAccount.balanceCents - amountCents,
      transactions: [
        transaction,
        ...(activeAccount.transactions || []),
      ],
    }

    const updatedAccounts = accounts.map(account =>
      account.phone === activeAccount.phone ? updatedAccount : account
    )

    saveAccounts(updatedAccounts)
    setAccounts(updatedAccounts)
    setActiveAccount(updatedAccount)

    setPurchaseAmount('')
    setPurchaseMerchant('')
    setError('')
    setScreen('dashboard')
  }

  const handleLogout = () => {
    setActiveAccount(null)
    setLoginPhone('')
    setLoginPassword('')
    setError('')
    setScreen('login')
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

        {screen === 'login' && (
          <>
            <div className="welcome-icon">K</div>
            <p className="eyebrow">BIENVENIDA DE NUEVO</p>
            <h1>Entra a tu cuenta Kampus.</h1>
            <p className="subtitle">
              Ingresa tus datos para consultar tu cuenta.
            </p>

            <form onSubmit={handleLogin} noValidate>
              <label htmlFor="loginPhone">Número de celular</label>
              <div className="phone-input">
                <span>+52</span>
                <input
                  id="loginPhone"
                  type="tel"
                  placeholder="10 dígitos"
                  maxLength={10}
                  inputMode="numeric"
                  value={loginPhone}
                  onChange={e => {
                    setLoginPhone(e.target.value.replace(/\D/g, ''))
                    setError('')
                  }}
                  disabled={loading}
                />
              </div>

              <label htmlFor="loginPassword">Contraseña</label>
              <input
                id="loginPassword"
                type="password"
                placeholder="Tu contraseña"
                value={loginPassword}
                onChange={e => {
                  setLoginPassword(e.target.value)
                  setError('')
                }}
                disabled={loading}
              />

              {error && <p className="error" role="alert">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión →'}
              </button>
            </form>

            <p className="security">
              ¿Todavía no tienes cuenta?
            </p>
            <button
              className="secondary-button"
              onClick={() => {
                setError('')
                setScreen('register')
              }}
            >
              Crear una cuenta Kampus
            </button>
          </>
        )}

        {screen === 'register' && (
          <>
            <div className="welcome-icon">K</div>
            <p className="eyebrow">TU DINERO, TU FUTURO</p>
            <h1>Comienza tu vida financiera.</h1>
            <p className="subtitle">
              Regístrate para crear tu cuenta Kampus.
            </p>

            <form onSubmit={handleRegister} noValidate>
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                placeholder="Ej. Mariana Torres"
                autoComplete="name"
                value={name}
                onChange={e => {
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
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value.replace(/\D/g, ''))
                    setError('')
                  }}
                  disabled={loading}
                />
              </div>

              <label htmlFor="password">Crear contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setError('')
                }}
                disabled={loading}
              />

              <div className="verification">
                <div>
                  <strong>Verificación de identidad</strong>
                  <p>Simulación de validación KYC</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={kycApproved}
                    onChange={e => {
                      setKycApproved(e.target.checked)
                      setError('')
                    }}
                    disabled={loading}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {error && <p className="error" role="alert">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Procesando registro...' : 'Crear mi cuenta →'}
              </button>
            </form>

            <button
              className="secondary-button"
              onClick={() => {
                setError('')
                setScreen('login')
              }}
            >
              Ya tengo una cuenta
            </button>
          </>
        )}

        {screen === 'registration-success' && (
          <div className="success" role="status">
            <div className="success-icon">✓</div>
            <p className="eyebrow">PASO 1 COMPLETADO</p>
            <h1>¡Bienvenida a Kampus, {name.split(/\s+/)[0]}!</h1>
            <p className="subtitle">
              Tu registro de demostración se completó.
              La verificación KYC fue simulada.
            </p>
            <button onClick={() => setScreen('account-opening')}>
              Continuar a apertura de cuenta →
            </button>
          </div>
        )}

        {screen === 'account-opening' && (
          <div className="success">
            <div className="welcome-icon">K</div>
            <p className="eyebrow">PASO 2 · APERTURA DE CUENTA</p>
            <h1>Tu cuenta Kampus está a un paso.</h1>
            <p className="subtitle">
              En una operación real, el partner financiero revisaría
              y autorizaría la apertura. Aquí simularemos ese proceso.
            </p>

            <div className="verification">
              <div>
                <strong>Institución financiera</strong>
                <p>Partner licenciado · Simulación</p>
              </div>
              <span>DEMO</span>
            </div>

            <button onClick={handleOpenAccount} disabled={loading}>
              {loading ? 'Abriendo cuenta...' : 'Abrir cuenta de demostración →'}
            </button>

            <button
              className="secondary-button"
              onClick={() => setScreen('registration-success')}
              disabled={loading}
            >
              Regresar
            </button>
          </div>
        )}

        {screen === 'account-opened' && activeAccount && (
          <div className="success" role="status">
            <div className="success-icon">✓</div>
            <p className="eyebrow">PASO 2 COMPLETADO</p>
            <h1>¡Tu cuenta Kampus está lista!</h1>
            <p className="subtitle">
              Hola, {activeAccount.name}. Tu cuenta quedó guardada.
            </p>

            <div className="verification">
              <div>
                <strong>CLABE de demostración</strong>
                <p>{activeAccount.clabe}</p>
              </div>
            </div>

            <p className="security">
              CLABE ficticia. No permite recibir transferencias reales.
            </p>

            <button onClick={() => setScreen('dashboard')}>
              Ir a mi cuenta →
            </button>
          </div>
        )}

        {screen === 'receive-money' && activeAccount && (
          <div className="dashboard">
            <p className="eyebrow">PASO 3 · RECEPCIÓN DE DINERO</p>
            <h1>Recibe dinero en Kampus.</h1>

            <p className="subtitle">
              Simula una transferencia recibida en tu cuenta.
            </p>

            <div className="verification">
              <div>
                <strong>CLABE de demostración</strong>
                <p>{activeAccount.clabe}</p>
                <p>Esta CLABE no recibe transferencias reales.</p>
              </div>
            </div>

            <form onSubmit={handleReceiveMoney} noValidate>
              <label htmlFor="receiveAmount">Monto a recibir (MXN)</label>
              <input
                id="receiveAmount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ej. 500.00"
                value={receiveAmount}
                onChange={e => {
                  setReceiveAmount(e.target.value)
                  setError('')
                }}
              />

              <label htmlFor="receiveSender">¿De quién recibes el dinero?</label>
              <input
                id="receiveSender"
                type="text"
                placeholder="Ej. Transferencia de mamá"
                value={receiveSender}
                onChange={e => {
                  setReceiveSender(e.target.value)
                  setError('')
                }}
              />

              {error && <p className="error" role="alert">{error}</p>}

              <button type="submit">
                Confirmar transferencia de prueba →
              </button>
            </form>

            <p className="security">
              Operación simulada. No se mueve dinero real.
            </p>

            <button
              className="secondary-button"
              onClick={() => {
                setError('')
                setScreen('dashboard')
              }}
            >
              Regresar a mi cuenta
            </button>
          </div>
        )}

        {screen === 'make-payment' && activeAccount && (
          <div className="dashboard">
            <p className="eyebrow">PASO 4 · PAGO CON TARJETA</p>
            <h1>Paga con tu tarjeta Kampus.</h1>

            <p className="subtitle">
              Simula una compra en un establecimiento.
            </p>

            <div
              style={{
                background: '#153B70',
                color: '#FFFFFF',
                padding: '24px',
                borderRadius: '18px',
                margin: '20px 0',
                textAlign: 'left',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <strong style={{ fontSize: '22px' }}>Kampus</strong>
                <span>◉</span>
              </div>

              <p style={{
                fontSize: '21px',
                letterSpacing: '3px',
                margin: '32px 0',
              }}>
                •••• •••• •••• 4821
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
              }}>
                <span>{activeAccount.name.toUpperCase()}</span>
                <strong style={{ fontSize: '18px' }}>VISA</strong>
              </div>
            </div>

            <div className="verification">
              <div>
                <strong>Saldo disponible</strong>
                <h2>{formatMoney(activeAccount.balanceCents)}</h2>
              </div>
            </div>

            <form onSubmit={handlePayment} noValidate>
              <label htmlFor="purchaseMerchant">Nombre del comercio</label>
              <input
                id="purchaseMerchant"
                type="text"
                placeholder="Ej. Cafetería UP"
                value={purchaseMerchant}
                onChange={e => {
                  setPurchaseMerchant(e.target.value)
                  setError('')
                }}
              />

              <label htmlFor="purchaseAmount">Monto de la compra (MXN)</label>
              <input
                id="purchaseAmount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ej. 150.00"
                value={purchaseAmount}
                onChange={e => {
                  setPurchaseAmount(e.target.value)
                  setError('')
                }}
              />

              {error && <p className="error" role="alert">{error}</p>}

              <button type="submit">
                Confirmar pago de prueba →
              </button>
            </form>

            <p className="security">
              Tarjeta ficticia. No permite realizar compras reales.
            </p>

            <button
              className="secondary-button"
              onClick={() => {
                setError('')
                setScreen('dashboard')
              }}
            >
              Regresar a mi cuenta
            </button>
          </div>
        )}

        {screen === 'dashboard' && activeAccount && (
          <div className="dashboard">
            <p className="eyebrow">TU CUENTA KAMPUS</p>
            <h1>¡Hola, {activeAccount.name.split(/\s+/)[0]}!</h1>
            <p className="subtitle">
              Este es el resumen de tu cuenta.
            </p>

            <div className="verification">
              <div>
                <strong>Saldo disponible</strong>
                <h1>{formatMoney(activeAccount.balanceCents)}</h1>
                <p>Pesos mexicanos · Saldo de demostración</p>
              </div>
            </div>

            <div className="verification">
              <div>
                <strong>CLABE de demostración</strong>
                <p>{activeAccount.clabe}</p>
                <p>No permite recibir transferencias reales.</p>
              </div>
            </div>

            <h2>Movimientos recientes</h2>

            {(activeAccount.transactions || []).length === 0 ? (
              <p className="security">
                Todavía no tienes movimientos. Cuando recibas dinero,
                aparecerá aquí.
              </p>
            ) : (
              (activeAccount.transactions || []).map(transaction => (
                <div className="verification" key={transaction.id}>
                  <div>
                    <strong>{transaction.description}</strong>
                    <p>
                      {new Date(transaction.date).toLocaleDateString('es-MX')}
                    </p>
                  </div>

                  <strong
                    style={{
                      color: transaction.type === 'transfer-in'
                        ? '#128A5D'
                        : '#C8272E',
                    }}
                  >
                    {transaction.type === 'transfer-in' ? '+' : '-'}
                    {formatMoney(transaction.amountCents)}
                  </strong>
                </div>
              ))
            )}

            <h2>Tu cuenta</h2>
            <p className="security">
              Apertura simulada · Partner financiero ficticio.
            </p>

            <button onClick={() => setScreen('account-opened')}>
              Ver información de mi cuenta
            </button>

            <button onClick={() => setScreen('receive-money')}>
              + Recibir dinero
            </button>

            <button onClick={() => setScreen('make-payment')}>
              Pagar con tarjeta →
            </button>

            <button className="secondary-button" onClick={handleLogout}>
              Cerrar sesión
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
