 
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
  | 'savings'

type ExpenseCategory =
  | 'Comida'
  | 'Transporte'
  | 'Educación'
  | 'Entretenimiento'
  | 'Otros'

type Transaction = {
  id: number
  date: string
  description: string
  amountCents: number
  category?: ExpenseCategory
  type:
    | 'transfer-in'
    | 'purchase'
    | 'savings-deposit'
    | 'savings-withdrawal'
    | 'savings-interest'
}

type SavedAccount = {
  name: string
  phone: string
  password: string
  clabe: string
  balanceCents: number
  savingsCents?: number
  opened: boolean
  transactions?: Transaction[]
}

const STORAGE_KEY = 'kampus_demo_accounts'
const ANNUAL_RATE = 0.05

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

  const [savingsAmount, setSavingsAmount] = useState('')
  const [savingsAction, setSavingsAction] = useState<'deposit' | 'withdraw'>('deposit')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)

  const formatMoney = (cents: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(cents / 100)

  const updateAccount = (updatedAccount: SavedAccount) => {
    const updatedAccounts = accounts.map(account =>
      account.phone === updatedAccount.phone ? updatedAccount : account
    )

    saveAccounts(updatedAccounts)
    setAccounts(updatedAccounts)
    setActiveAccount(updatedAccount)
  }

  const categorizeExpense = (merchant: string): ExpenseCategory => {
    const name = merchant.toLowerCase()

    const matches = (keywords: string[]) =>
      keywords.some(keyword => name.includes(keyword))

    if (matches([
      'starbucks', 'cafe', 'café', 'restaurante', 'restaurant',
      'comida', 'tacos', 'pizza', 'burger', 'mcdonald', 'subway',
      'sushi', 'superama', 'walmart', 'oxxo', '7-eleven',
    ])) return 'Comida'

    if (matches([
      'uber', 'didi', 'taxi', 'metro', 'camion', 'autobus',
      'autobús', 'gasolina', 'pemex', 'estacionamiento',
    ])) return 'Transporte'

    if (matches([
      'libreria', 'librería', 'gandhi', 'libro', 'papeleria',
      'papelería', 'universidad', 'colegiatura', 'curso',
      'udemy', 'material escolar',
    ])) return 'Educación'

    if (matches([
      'cinepolis', 'cinépolis', 'cinemark', 'netflix', 'spotify',
      'concierto', 'teatro', 'videojuego', 'steam', 'disney',
    ])) return 'Entretenimiento'

    return 'Otros'
  }

  const createTransaction = (
    description: string,
    amountCents: number,
    type: Transaction['type'],
    category?: ExpenseCategory
  ): Transaction => ({
    id: Date.now(),
    date: new Date().toISOString(),
    description,
    amountCents,
    type,
    ...(category ? { category } : {}),
  })

  const parseAmount = (value: string): number | null => {
    if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null

    const cents = Math.round(Number(value) * 100)

    if (!Number.isSafeInteger(cents) || cents <= 0) return null

    return cents
  }

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
        savingsCents: 0,
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

    const amountCents = parseAmount(receiveAmount)

    if (amountCents === null) {
      setError('Ingresa un monto válido con máximo dos decimales.')
      return
    }

    const transaction = createTransaction(
      receiveSender.trim() || 'Transferencia recibida',
      amountCents,
      'transfer-in'
    )

    const updatedAccount: SavedAccount = {
      ...activeAccount,
      balanceCents: activeAccount.balanceCents + amountCents,
      transactions: [
        transaction,
        ...(activeAccount.transactions || []),
      ],
    }

    updateAccount(updatedAccount)
    setReceiveAmount('')
    setReceiveSender('')
    setError('')
    setScreen('dashboard')
  }

  const handlePayment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!activeAccount) return

    const amountCents = parseAmount(purchaseAmount)

    if (!purchaseMerchant.trim()) {
      setError('Ingresa el nombre del comercio.')
      return
    }

    if (amountCents === null) {
      setError('Ingresa un monto válido con máximo dos decimales.')
      return
    }

    if (amountCents > activeAccount.balanceCents) {
      setError('Pago rechazado: no tienes saldo suficiente.')
      return
    }

    const category = categorizeExpense(purchaseMerchant)

    const transaction = createTransaction(
      `Compra en ${purchaseMerchant.trim()}`,
      amountCents,
      'purchase',
      category
    )

    const updatedAccount: SavedAccount = {
      ...activeAccount,
      balanceCents: activeAccount.balanceCents - amountCents,
      transactions: [
        transaction,
        ...(activeAccount.transactions || []),
      ],
    }

    updateAccount(updatedAccount)
    setPurchaseAmount('')
    setPurchaseMerchant('')
    setError('')
    setScreen('dashboard')
  }

  const handleSavingsMovement = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!activeAccount) return

    const amountCents = parseAmount(savingsAmount)

    if (amountCents === null) {
      setError('Ingresa un monto válido con máximo dos decimales.')
      return
    }

    const currentSavings = activeAccount.savingsCents || 0

    if (savingsAction === 'deposit' && amountCents > activeAccount.balanceCents) {
      setError('No tienes suficiente saldo disponible para ahorrar.')
      return
    }

    if (savingsAction === 'withdraw' && amountCents > currentSavings) {
      setError('No tienes suficiente dinero en tu apartado de ahorro.')
      return
    }

    const isDeposit = savingsAction === 'deposit'

    const transaction = createTransaction(
      isDeposit ? 'Dinero apartado en ahorro' : 'Retiro de ahorro',
      amountCents,
      isDeposit ? 'savings-deposit' : 'savings-withdrawal'
    )

    const updatedAccount: SavedAccount = {
      ...activeAccount,
      balanceCents: isDeposit
        ? activeAccount.balanceCents - amountCents
        : activeAccount.balanceCents + amountCents,
      savingsCents: isDeposit
        ? currentSavings + amountCents
        : currentSavings - amountCents,
      transactions: [
        transaction,
        ...(activeAccount.transactions || []),
      ],
    }

    updateAccount(updatedAccount)
    setSavingsAmount('')
    setError('')
    setScreen('dashboard')
  }

  const handleSimulateInterest = () => {
    if (!activeAccount) return

    const currentSavings = activeAccount.savingsCents || 0

    if (currentSavings <= 0) {
      setError('Primero necesitas tener dinero en tu apartado de ahorro.')
      return
    }

    const monthlyInterest = Math.round(
      currentSavings * ANNUAL_RATE / 12
    )

    if (monthlyInterest <= 0) {
      setError('El rendimiento simulado es menor a un centavo.')
      return
    }

    const transaction = createTransaction(
      'Rendimiento simulado de un mes',
      monthlyInterest,
      'savings-interest'
    )

    const updatedAccount: SavedAccount = {
      ...activeAccount,
      savingsCents: currentSavings + monthlyInterest,
      transactions: [
        transaction,
        ...(activeAccount.transactions || []),
      ],
    }

    updateAccount(updatedAccount)
    setError('')
  }

  const handleLogout = () => {
    setActiveAccount(null)
    setLoginPhone('')
    setLoginPassword('')
    setError('')
    setScreen('login')
  }

  const currentSavings = activeAccount?.savingsCents || 0

  const currentMonthPurchases = (activeAccount?.transactions || []).filter(transaction => {
    const transactionDate = new Date(transaction.date)
    const now = new Date()

    return (
      transaction.type === 'purchase' &&
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear()
    )
  })

  const monthlyExpenseCents = currentMonthPurchases.reduce(
    (total, transaction) => total + transaction.amountCents,
    0
  )

  const expenseCategories: ExpenseCategory[] = [
    'Comida',
    'Transporte',
    'Educación',
    'Entretenimiento',
    'Otros',
  ]

  const categoryExpenses = expenseCategories.map(category => ({
    category,
    amountCents: currentMonthPurchases
      .filter(transaction => transaction.category === category)
      .reduce((total, transaction) => total + transaction.amountCents, 0),
  }))

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

            <p className="security">¿Todavía no tienes cuenta?</p>
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

            <div style={{
              background: '#153B70',
              color: '#FFFFFF',
              padding: '24px',
              borderRadius: '18px',
              margin: '20px 0',
              textAlign: 'left',
            }}>
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

        {screen === 'savings' && activeAccount && (
          <div className="dashboard">
            <p className="eyebrow">PASO 5 · AHORRO</p>
            <h1>Haz crecer tu ahorro.</h1>
            <p className="subtitle">
              Separa dinero y consulta tu rendimiento simulado.
            </p>

            <div className="verification">
              <div>
                <strong>Dinero en ahorro</strong>
                <h1>{formatMoney(currentSavings)}</h1>
                <p>Saldo de ahorro de demostración</p>
              </div>
            </div>

            <div className="verification">
              <div>
                <strong>Rendimiento anual ilustrativo</strong>
                <h2>5% anual</h2>
                <p>Tasa hipotética para esta demostración.</p>
              </div>
            </div>

            <div className="verification">
              <div>
                <strong>Saldo disponible para gastar</strong>
                <h2>{formatMoney(activeAccount.balanceCents)}</h2>
              </div>
            </div>

            <h2>Administrar mi ahorro</h2>

            <div style={{
              display: 'flex',
              gap: '8px',
              margin: '16px 0',
            }}>
              <button
                type="button"
                onClick={() => {
                  setSavingsAction('deposit')
                  setError('')
                }}
                style={{
                  flex: 1,
                  background: savingsAction === 'deposit' ? '#1D4E8F' : '#E8EDF4',
                  color: savingsAction === 'deposit' ? '#FFFFFF' : '#172B49',
                }}
              >
                Ahorrar
              </button>

              <button
                type="button"
                onClick={() => {
                  setSavingsAction('withdraw')
                  setError('')
                }}
                style={{
                  flex: 1,
                  background: savingsAction === 'withdraw' ? '#1D4E8F' : '#E8EDF4',
                  color: savingsAction === 'withdraw' ? '#FFFFFF' : '#172B49',
                }}
              >
                Retirar
              </button>
            </div>

            <form onSubmit={handleSavingsMovement} noValidate>
              <label htmlFor="savingsAmount">
                {savingsAction === 'deposit'
                  ? 'Monto que quieres ahorrar (MXN)'
                  : 'Monto que quieres retirar (MXN)'}
              </label>

              <input
                id="savingsAmount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ej. 200.00"
                value={savingsAmount}
                onChange={e => {
                  setSavingsAmount(e.target.value)
                  setError('')
                }}
              />

              {error && <p className="error" role="alert">{error}</p>}

              <button type="submit">
                {savingsAction === 'deposit'
                  ? 'Apartar dinero en ahorro →'
                  : 'Retirar dinero de ahorro →'}
              </button>
            </form>

            <div className="verification">
              <div>
                <strong>Simulación de rendimiento</strong>
                <p>
                  Calcula un mes de rendimiento sobre tu ahorro actual.
                </p>
                <p>
                  El cálculo utiliza la tasa anual ilustrativa del 5% dividida entre 12.
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulateInterest}
              disabled={currentSavings <= 0}
            >
              Simular rendimiento de un mes
            </button>

            <p className="security">
              Rendimiento ficticio. No representa una tasa ofrecida ni garantizada.
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
                <strong>Dinero en ahorro</strong>
                <h2>{formatMoney(currentSavings)}</h2>
                <p>Rendimiento ilustrativo del 5% anual.</p>
              </div>
            </div>

            <div className="verification">
              <div>
                <strong>CLABE de demostración</strong>
                <p>{activeAccount.clabe}</p>
                <p>No permite recibir transferencias reales.</p>
              </div>
            </div>

            <p className="eyebrow">PASO 6 · CONTROL DE GASTOS</p>
            <h2>Resumen de gastos del mes</h2>

            <div className="verification expense-summary">
              <div>
                <strong>Total gastado este mes</strong>
                <h1>{formatMoney(monthlyExpenseCents)}</h1>
                <p>Compras registradas durante el mes actual.</p>
              </div>
            </div>

            <h2>Gastos por categoría</h2>

            {categoryExpenses.map(item => (
              <div className="verification expense-category" key={item.category}>
                <div>
                  <strong>{item.category}</strong>
                  <p>
                    {currentMonthPurchases.filter(
                      transaction => transaction.category === item.category
                    ).length} compras
                  </p>
                </div>
                <strong>{formatMoney(item.amountCents)}</strong>
              </div>
            ))}

            <button
              type="button"
              className="secondary-button"
              aria-expanded={showTransactions}
              onClick={() => setShowTransactions(current => !current)}
            >
              {showTransactions ? 'Ocultar movimientos recientes ↑' : 'Ver movimientos recientes ↓'}
            </button>

            {showTransactions && (
              <div className="transactions-panel">
                {(activeAccount.transactions || []).length === 0 ? (
                  <p className="security">
                    Todavía no tienes movimientos. Cuando recibas dinero,
                    aparecerá aquí.
                  </p>
                ) : (
                  (activeAccount.transactions || []).map(transaction => {
                    const isIncome =
                      transaction.type === 'transfer-in' ||
                      transaction.type === 'savings-withdrawal' ||
                      transaction.type === 'savings-interest'

                    return (
                      <div className="verification" key={transaction.id}>
                        <div>
                          <strong>{transaction.description}</strong>
                          <p>
                            {new Date(transaction.date).toLocaleDateString('es-MX')}
                          </p>
                          {transaction.type === 'purchase' && (
                            <p className="transaction-category">
                              Categoría: {transaction.category || 'Sin categoría (movimiento anterior)'}
                            </p>
                          )}
                        </div>

                        <strong style={{
                          color: isIncome ? '#128A5D' : '#C8272E',
                        }}>
                          {isIncome ? '+' : '-'}
                          {formatMoney(transaction.amountCents)}
                        </strong>
                      </div>
                    )
                  })
                )}
              </div>
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

            <button onClick={() => {
              setSavingsAction('deposit')
              setError('')
              setScreen('savings')
            }}>
              Mi ahorro →
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
