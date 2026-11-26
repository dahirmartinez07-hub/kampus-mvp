
import { useState, type FormEvent } from 'react'
import { supabase } from './lib/supabase'
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
  id: string
  date: string
  description: string
  amountCents: number
  category?: ExpenseCategory
  type: 'transfer-in' | 'purchase' | 'savings-deposit' | 'savings-withdrawal'
}

type SavedAccount = {
  id: string
  name: string
  phone: string
  clabe: string
  balanceCents: number
  savingsCents: number
  opened: boolean
  transactions: Transaction[]
}

type AccountRow = {
  id: string
  clabe: string
  balance_cents: number | string
  savings_cents: number | string
}

type TransactionRow = {
  id: string
  created_at: string
  description: string
  amount_cents: number | string
  type: Transaction['type']
  category: ExpenseCategory | null
}

const ANNUAL_RATE = 0.05
const TERMS_VERSION = 'KAMPUS-DEMO-1.0'
const PRIVACY_VERSION = 'KAMPUS-PRIVACY-DEMO-1.0'

function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [activeAccount, setActiveAccount] = useState<SavedAccount | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [identityDocumentVerified, setIdentityDocumentVerified] = useState(false)
  const [identityFaceVerified, setIdentityFaceVerified] = useState(false)
  const [otpRequired, setOtpRequired] = useState(false)
  const [demoOtp, setDemoOtp] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

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

  const parseAmount = (value: string): number | null => {
    if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null

    const cents = Math.round(Number(value) * 100)

    if (!Number.isSafeInteger(cents) || cents <= 0) return null

    return cents
  }

  const loadAccount = async (userId: string): Promise<SavedAccount> => {
    const [
      { data: profile, error: profileError },
      { data: account, error: accountError },
      { data: rows, error: transactionsError },
    ] = await Promise.all([
      supabase.from('profiles').select('full_name, phone').eq('id', userId).single(),
      supabase.from('kampus_accounts').select('id, clabe, balance_cents, savings_cents').eq('user_id', userId).single(),
      supabase.from('transactions').select('id, created_at, description, amount_cents, type, category').eq('user_id', userId).order('created_at', { ascending: false }),
    ])

    if (profileError) throw profileError
    if (accountError) throw accountError
    if (transactionsError) throw transactionsError
    if (!profile || !account) throw new Error('No encontramos la cuenta de Kampus.')

    const accountRow = account as AccountRow
    const transactionRows = (rows || []) as TransactionRow[]

    return {
      id: accountRow.id,
      name: profile.full_name,
      phone: profile.phone,
      clabe: accountRow.clabe,
      balanceCents: Number(accountRow.balance_cents),
      savingsCents: Number(accountRow.savings_cents),
      opened: true,
      transactions: transactionRows.map(transaction => ({
        id: transaction.id,
        date: transaction.created_at,
        description: transaction.description,
        amountCents: Number(transaction.amount_cents),
        type: transaction.type,
        ...(transaction.category ? { category: transaction.category } : {}),
      })),
    }
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    const normalizedName = name.trim().replace(/\s+/g, ' ')
    const nameParts = normalizedName.split(' ')
    const validName = /^[\p{L}][\p{L} .'-]*$/u.test(normalizedName)

    if (!validName || nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
      setError('Ingresa tu nombre y al menos un apellido, sin números ni caracteres inválidos.')
      return
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Ingresa un celular válido de 10 dígitos.')
      return
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.')
      return
    }
    if (!adultConfirmed) {
      setError('Debes confirmar que tienes 18 años o más para continuar.')
      return
    }
    if (!termsAccepted || !privacyAccepted) {
      setError('Debes aceptar los términos y condiciones y confirmar que leíste el aviso de privacidad.')
      return
    }
    if (!identityDocumentVerified || !identityFaceVerified) {
      setError('Completa las dos verificaciones simuladas para continuar.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const internalEmail = `52${phone}@kampus-demo.invalid`
      const { data, error: authError } = await supabase.auth.signUp({
        email: internalEmail,
        password,
        options: { data: { full_name: normalizedName, phone } },
      })
      if (authError) {
        if (authError.message.toLowerCase().includes('already registered') ||
            authError.message.toLowerCase().includes('already exists')) {
          throw new Error('Este número ya está registrado. Inicia sesión con tu cuenta.')
        }
        throw authError
      }
      if (!data.user) throw new Error('No se pudo crear el usuario de demostración.')

      if (!data.session) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({ email: internalEmail, password })
        if (signInError || !signInData.user) {
          throw new Error('El usuario se creó, pero no se pudo iniciar sesión. Revisa la configuración de confirmación de correo en Supabase.')
        }
      }

      const { error: accountError } = await supabase.rpc('create_kampus_account', {
        p_full_name: normalizedName,
        p_phone: phone,
      })
      if (accountError) throw accountError

      const { error: consentError } = await supabase.rpc('record_kampus_consents', {
        p_terms_version: TERMS_VERSION,
        p_privacy_version: PRIVACY_VERSION,
        p_adult_confirmed: true,
      })
      if (consentError) {
        throw new Error('Tu usuario y cuenta se crearon, pero no pudimos guardar las aceptaciones. No vuelvas a registrarte; revisaremos la configuración de consentimientos.')
      }

      setPassword('')
      setIdentityDocumentVerified(false)
      setIdentityFaceVerified(false)
      setScreen('registration-success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos completar tu registro.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    if (!/^\d{10}$/.test(loginPhone)) {
      setError('Ingresa tu celular de 10 dígitos.')
      return
    }
    if (!loginPassword) {
      setError('Ingresa tu contraseña.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const email = `52${loginPhone}@kampus-demo.invalid`
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      })
      if (authError) throw new Error('No encontramos una cuenta con esos datos. Revisa tu celular y contraseña.')
      if (!data.user) throw new Error('No se pudo iniciar sesión.')

      // Segundo factor exclusivamente simulado: no se envía ningún SMS.
      const randomBytes = new Uint32Array(1)
      window.crypto.getRandomValues(randomBytes)
      const generatedCode = String(randomBytes[0] % 1000000).padStart(6, '0')
      setPendingUserId(data.user.id)
      setDemoOtp(generatedCode)
      setOtpInput('')
      setOtpRequired(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos iniciar sesión.')
      await supabase.auth.signOut()
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    if (!/^\d{6}$/.test(otpInput) || otpInput !== demoOtp) {
      setError('El código no coincide. Revisa el código de demostración e inténtalo de nuevo.')
      return
    }
    if (!pendingUserId) {
      setError('La sesión de verificación expiró. Inicia sesión nuevamente.')
      setOtpRequired(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const account = await loadAccount(pendingUserId)
      setActiveAccount(account)
      setOtpRequired(false)
      setDemoOtp('')
      setOtpInput('')
      setPendingUserId(null)
      setLoginPassword('')
      setScreen('dashboard')
    } catch (err) {
      await supabase.auth.signOut()
      setError(err instanceof Error ? err.message : 'No pudimos verificar tu cuenta.')
      setOtpRequired(false)
      setDemoOtp('')
      setPendingUserId(null)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAccount = async () => {
    if (loading) return
    setError('')
    setLoading(true)
    try {
      const { data, error: userError } = await supabase.auth.getUser()
      if (userError || !data.user) throw new Error('Tu sesión expiró. Inicia sesión nuevamente.')
      const account = await loadAccount(data.user.id)
      setActiveAccount(account)
      setScreen('account-opened')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos mostrar tu cuenta.')
    } finally {
      setLoading(false)
    }
  }

  const applyTransaction = async (
    description: string,
    amountCents: number,
    type: Transaction['type'],
    category: ExpenseCategory | null = null
  ) => {
    const { data, error: rpcError } = await supabase.rpc('register_kampus_transaction', {
      p_description: description,
      p_amount_cents: amountCents,
      p_type: type,
      p_category: category,
    })
    if (rpcError) throw rpcError

    const result = data as { account: AccountRow; transaction: TransactionRow }
    if (!result?.account || !result?.transaction) {
      throw new Error('No recibimos la confirmación del movimiento.')
    }

    const updatedAccount: SavedAccount = {
      ...(activeAccount as SavedAccount),
      id: result.account.id,
      clabe: result.account.clabe,
      balanceCents: Number(result.account.balance_cents),
      savingsCents: Number(result.account.savings_cents),
      transactions: [{
        id: result.transaction.id,
        date: result.transaction.created_at,
        description: result.transaction.description,
        amountCents: Number(result.transaction.amount_cents),
        type: result.transaction.type,
        ...(result.transaction.category ? { category: result.transaction.category } : {}),
      }, ...(activeAccount?.transactions || [])],
    }
    setActiveAccount(updatedAccount)
  }

  const handleReceiveMoney = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!activeAccount || loading) return
    const amountCents = parseAmount(receiveAmount)
    if (amountCents === null) {
      setError('Ingresa un monto válido con máximo dos decimales.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await applyTransaction(receiveSender.trim() || 'Transferencia recibida', amountCents, 'transfer-in')
      setReceiveAmount('')
      setReceiveSender('')
      setScreen('dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar la transferencia simulada.')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!activeAccount || loading) return
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

    setLoading(true)
    setError('')
    try {
      await applyTransaction(`Compra en ${purchaseMerchant.trim()}`, amountCents, 'purchase', categorizeExpense(purchaseMerchant))
      setPurchaseAmount('')
      setPurchaseMerchant('')
      setScreen('dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el pago simulado.')
    } finally {
      setLoading(false)
    }
  }

  const handleSavingsMovement = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!activeAccount || loading) return
    const amountCents = parseAmount(savingsAmount)
    if (amountCents === null) {
      setError('Ingresa un monto válido con máximo dos decimales.')
      return
    }
    const currentSavings = activeAccount.savingsCents
    if (savingsAction === 'deposit' && amountCents > activeAccount.balanceCents) {
      setError('No tienes suficiente saldo disponible para ahorrar.')
      return
    }
    if (savingsAction === 'withdraw' && amountCents > currentSavings) {
      setError('No tienes suficiente dinero en tu apartado de ahorro.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const isDeposit = savingsAction === 'deposit'
      await applyTransaction(
        isDeposit ? 'Dinero apartado en ahorro' : 'Retiro de ahorro',
        amountCents,
        isDeposit ? 'savings-deposit' : 'savings-withdrawal'
      )
      setSavingsAmount('')
      setScreen('dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el movimiento de ahorro.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      setActiveAccount(null)
      setName('')
      setPhone('')
      setPassword('')
      setIdentityDocumentVerified(false)
      setIdentityFaceVerified(false)
      setAdultConfirmed(false)
      setTermsAccepted(false)
      setPrivacyAccepted(false)
      setLoginPhone('')
      setLoginPassword('')
      setOtpRequired(false)
      setDemoOtp('')
      setOtpInput('')
      setPendingUserId(null)
      setReceiveAmount('')
      setReceiveSender('')
      setPurchaseAmount('')
      setPurchaseMerchant('')
      setSavingsAmount('')
      setSavingsAction('deposit')
      setShowTransactions(false)
      setError('')
      setScreen('login')
    }
  }

  const currentSavings = activeAccount?.savingsCents || 0
  const estimatedMonthlyInterest = Math.round(
  currentSavings * ANNUAL_RATE / 12
)

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

  const totalCategorizedCents = categoryExpenses.reduce(
    (total, item) => total + item.amountCents,
    0
  )

  const savingsTransactions = (activeAccount?.transactions || []).filter(
    transaction =>
      transaction.type === 'savings-deposit' ||
      transaction.type === 'savings-withdrawal'
  )

  const netSavingsMovements = savingsTransactions.reduce(
    (total, transaction) =>
      total +
      (transaction.type === 'savings-withdrawal'
        ? -transaction.amountCents
        : transaction.amountCents),
    0
  )

  const openingSavingsCents = currentSavings - netSavingsMovements
  const savingsHistory = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date()
    monthDate.setDate(1)
    monthDate.setMonth(monthDate.getMonth() - (5 - index))
    const endOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )

    const movementsUntilMonthEnd = savingsTransactions
      .filter(transaction => new Date(transaction.date) <= endOfMonth)
      .reduce(
        (total, transaction) =>
          total +
          (transaction.type === 'savings-withdrawal'
            ? -transaction.amountCents
            : transaction.amountCents),
        0
      )

    return {
      label: monthDate.toLocaleDateString('es-MX', { month: 'short' }),
      balanceCents: Math.max(0, openingSavingsCents + movementsUntilMonthEnd),
    }
  })

  if (savingsHistory.length) {
    savingsHistory[savingsHistory.length - 1].balanceCents = currentSavings
  }

  const maxSavingsHistory = Math.max(
    1,
    ...savingsHistory.map(point => point.balanceCents)
  )
  const savingsChartPoints = savingsHistory.map((point, index) => ({
    ...point,
    x: 36 + index * 58,
    y: 132 - (point.balanceCents / maxSavingsHistory) * 108,
  }))
  const savingsPolyline = savingsChartPoints.map(point => `${point.x},${point.y}`).join(' ')

  const categoryColors: Record<ExpenseCategory, string> = {
    Comida: '#1D4E8F',
    Transporte: '#128A5D',
    Educación: '#D69E36',
    Entretenimiento: '#8257B5',
    Otros: '#8793A5',
  }

  const categoryGradientStops = categoryExpenses
    .filter(item => item.amountCents > 0)
    .reduce((result, item, index, items) => {
      const previous = items
        .slice(0, index)
        .reduce((total, previousItem) => total + previousItem.amountCents, 0)
      const start = totalCategorizedCents
        ? (previous / totalCategorizedCents) * 100
        : 0
      const end = totalCategorizedCents
        ? ((previous + item.amountCents) / totalCategorizedCents) * 100
        : 0
      return [...result, `${categoryColors[item.category]} ${start}% ${end}%`]
    }, [] as string[])
    .join(', ')

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

            {otpRequired ? (
              <form onSubmit={handleVerifyOtp} noValidate>
                <h2>Verificación adicional</h2>
                <p className="subtitle">Ingresa el código de seis dígitos para continuar.</p>
                <div className="verification" role="status">
                  <strong>Código de demostración: {demoOtp}</strong>
                  <p>Este código se muestra aquí porque no enviamos SMS reales.</p>
                </div>
                <label htmlFor="otpInput">Código de verificación</label>
                <input
                  id="otpInput"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={otpInput}
                  onChange={e => { setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
                  disabled={loading}
                />
                {error && <p className="error" role="alert">{error}</p>}
                <button type="submit" disabled={loading}>{loading ? 'Verificando...' : 'Verificar código →'}</button>
                <button type="button" className="secondary-button" disabled={loading} onClick={handleLogout}>Cancelar</button>
              </form>
            ) : (
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
                  autoComplete="off"
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
                autoComplete="current-password"
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
            )}

            {!otpRequired && <p className="security">¿Todavía no tienes cuenta?</p>}
            {!otpRequired && <button
              className="secondary-button"
              onClick={() => {
                setError('')
                setIdentityDocumentVerified(false)
                setIdentityFaceVerified(false)
                setScreen('register')
              }}
            >
              Crear una cuenta Kampus
            </button>}
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
                  autoComplete="tel-national"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                    setError('')
                  }}
                  disabled={loading}
                />
              </div>

              <label htmlFor="password">Crear contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="8 caracteres, mayúscula, minúscula y número"
                autoComplete="new-password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setError('')
                }}
                disabled={loading}
              />

              <div className="verification" style={{ display: 'block', textAlign: 'left' }}>
  <strong>Verificación de identidad</strong>
  <p>Completa las siguientes verificaciones para continuar con tu registro.</p>

  <div style={{ marginTop: '16px' }}>
    <strong>1. Verificación de identificación</strong>
    <p>Simula la revisión de tu INE o credencial escolar.</p>
    <button
      type="button"
      className="secondary-button"
      onClick={() => {
        setIdentityDocumentVerified(true)
        setError('')
      }}
      disabled={loading || identityDocumentVerified}
    >
      {identityDocumentVerified ? '✓ Identificación verificada' : 'Simular verificación de identificación'}
    </button>
  </div>

  <div style={{ marginTop: '16px' }}>
    <strong>2. Verificación facial</strong>
    <p>Simula la comparación de identidad y rostro.</p>
    <button
      type="button"
      className="secondary-button"
      onClick={() => {
        setIdentityFaceVerified(true)
        setError('')
      }}
      disabled={loading || identityFaceVerified}
    >
      {identityFaceVerified ? '✓ Verificación facial completada' : 'Simular verificación facial'}
    </button>
  </div>

  <p className="security">
    Ambas verificaciones son demostrativas. No se utiliza la cámara, no se solicitan imágenes y no se realiza una validación biométrica real.
  </p>
</div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', lineHeight: 1.5, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    style={{ width: '16px', height: '16px', marginTop: '3px', flexShrink: 0 }}
                    checked={adultConfirmed}
                    onChange={e => {
                      setAdultConfirmed(e.target.checked)
                      setError('')
                    }}
                    disabled={loading}
                  />
                  <span>Declaro que tengo 18 años o más.</span>
                </label>

                <details style={{ background: '#F5F7FB', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', lineHeight: 1.55, color: '#526176' }}>
                  <summary style={{ cursor: 'pointer', color: '#1D4E8F', fontWeight: 600 }}>Leer términos y condiciones de la demostración</summary>
                  <p><strong>Versión {TERMS_VERSION}</strong></p>
                  <p>Kampus es un prototipo académico. La cuenta, la CLABE, la tarjeta, los saldos, los depósitos, los pagos y los rendimientos son ficticios. Esta plataforma no es una institución financiera, no custodia fondos y no procesa transferencias ni pagos reales.</p>
                  <p>El usuario se compromete a utilizar datos ficticios durante las pruebas, mantener la confidencialidad de su contraseña y no intentar utilizar el prototipo para operaciones reales. Las funciones pueden cambiar o dejar de estar disponibles durante el desarrollo.</p>
                </details>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', lineHeight: 1.5, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    style={{ width: '16px', height: '16px', marginTop: '3px', flexShrink: 0 }}
                    checked={termsAccepted}
                    onChange={e => {
                      setTermsAccepted(e.target.checked)
                      setError('')
                    }}
                    disabled={loading}
                  />
                  <span>He leído y acepto los términos y condiciones.</span>
                </label>

                <details style={{ background: '#F5F7FB', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', lineHeight: 1.55, color: '#526176' }}>
                  <summary style={{ cursor: 'pointer', color: '#1D4E8F', fontWeight: 600 }}>Leer aviso de privacidad de la demostración</summary>
                  <p><strong>Versión {PRIVACY_VERSION}</strong></p>
                  <p>Para este prototipo se utilizan datos de prueba como nombre, teléfono ficticio, identificador de usuario y registros de movimientos simulados. La información se almacena en la base de datos de demostración de Kampus para permitir el funcionamiento de la cuenta y las pruebas del proyecto.</p>
                  <p>No ingreses información personal real, documentos oficiales, datos bancarios reales ni contraseñas que utilices en otros servicios. Los datos de prueba podrán eliminarse como parte del mantenimiento del prototipo.</p>
                </details>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', lineHeight: 1.5, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    style={{ width: '16px', height: '16px', marginTop: '3px', flexShrink: 0 }}
                    checked={privacyAccepted}
                    onChange={e => {
                      setPrivacyAccepted(e.target.checked)
                      setError('')
                    }}
                    disabled={loading}
                  />
                  <span>Confirmo que leí el aviso de privacidad.</span>
                </label>

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
              disabled={loading}
            >
              Ya tengo una cuenta
            </button>
          </>
        )}

        {screen === 'registration-success' && (
          <div className="success" role="status">
            <div className="success-icon">✓</div>
            <p className="eyebrow">REGISTRO COMPLETADO</p>
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
            <p className="eyebrow">APERTURA DE CUENTA</p>
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

            {error && <p className="error-message" role="alert">{error}</p>}

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
            <p className="eyebrow">CUENTA ACTIVADA</p>
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
            <p className="eyebrow">RECEPCIÓN DE DINERO</p>
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

            <div className="security">Comisión de esta operación en la demostración: $0.00 MXN.</div>
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

              <button type="submit" disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar transferencia de prueba →'}
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
            <p className="eyebrow">PAGO CON TARJETA</p>
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

            <div className="security">Comisión de esta operación en la demostración: $0.00 MXN.</div>
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

              <button type="submit" disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar pago de prueba →'}
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
            <p className="eyebrow">AHORRO</p>
            <h1>Haz crecer tu ahorro.</h1>
            <p className="subtitle">
              Separa dinero y consulta tu rendimiento estimado.
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

            <div className="security">Comisión de esta operación en la demostración: $0.00 MXN.</div>
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

              <button type="submit" disabled={loading}>
                {loading ? 'Procesando...' : savingsAction === 'deposit'
                  ? 'Apartar dinero en ahorro →'
                  : 'Retirar dinero de ahorro →'}
              </button>
            </form>
            <div className="verification">
  <div>
    <strong>Rendimiento mensual estimado</strong>
    <h2>{formatMoney(estimatedMonthlyInterest)}</h2>
    <p>Estimación ilustrativa si mantienes el saldo actual durante un mes.</p>
  </div>
</div>

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
            <p className="security">
              Plan gratuito de demostración. El plan Premium de $49 MXN al mes es una proyección del modelo financiero; no está habilitado ni se cobra en esta versión.
            </p>

            <div className="verification">
              <div>
                <strong>Saldo disponible</strong>
                <h1>{formatMoney(activeAccount.balanceCents)}</h1>
                <p>Pesos mexicanos · Saldo de demostración</p>
              </div>
            </div>
                        <div className="dashboard-actions">
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
            </div>

            <div className="verification">
              <div>
                <strong>Dinero en ahorro</strong>
                <h2>{formatMoney(currentSavings)}</h2>
                <p>5% anual hipotético para esta demostración; no es una tasa ofrecida.</p>
              </div>
            </div>

            <div className="verification">
              <div>
                <strong>CLABE de demostración</strong>
                <p>{activeAccount.clabe}</p>
                <p>No permite recibir transferencias reales.</p>
              </div>
            </div>

            <p className="eyebrow">CONTROL DE GASTOS</p>
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
                    ).length}{' '}
                    {currentMonthPurchases.filter(
                        transaction => transaction.category === item.category
                    ).length === 1 ? 'compra' : 'compras'}
                  </p>
                  <div
                    style={{
                      height: '7px',
                      width: 'min(52vw, 260px)',
                      maxWidth: '100%',
                      background: '#E5EAF1',
                      borderRadius: '99px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${monthlyExpenseCents ? (item.amountCents / monthlyExpenseCents) * 100 : 0}%`,
                        background: categoryColors[item.category],
                        borderRadius: '99px',
                      }}
                    />
                  </div>
                </div>
                <strong>{formatMoney(item.amountCents)}</strong>
              </div>
            ))}

            <div className="verification" style={{ marginTop: '18px' }}>
              <div style={{ width: '100%' }}>
                <strong>Distribución de gastos</strong>
                <p>Participación de cada categoría en tus compras de este mes.</p>
                {totalCategorizedCents > 0 ? (
                  <>
                    <div
                      role="img"
                      aria-label="Gráfica circular de gastos por categoría"
                      style={{
                        width: '190px',
                        height: '190px',
                        borderRadius: '50%',
                        margin: '20px auto',
                        background: `conic-gradient(${categoryGradientStops})`,
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: '28%',
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                        }}
                      >
                        <strong style={{ fontSize: '13px' }}>Total</strong>
                        <strong style={{ fontSize: '15px' }}>{formatMoney(totalCategorizedCents)}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))', gap: '10px' }}>
                      {categoryExpenses.filter(item => item.amountCents > 0).map(item => (
                        <div key={item.category} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: categoryColors[item.category], flexShrink: 0 }} />
                          <span>{item.category} · {Math.round((item.amountCents / totalCategorizedCents) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="security">Cuando registres compras, aquí aparecerá la distribución de tus gastos.</p>
                )}
              </div>
            </div>

            <div className="verification" style={{ marginTop: '18px' }}>
              <div style={{ width: '100%' }}>
                <strong>Evolución de tu ahorro</strong>
                <p>Saldo de ahorro registrado durante los últimos seis meses.</p>
                <svg
                  viewBox="0 0 360 160"
                  role="img"
                  aria-label="Gráfica de evolución del saldo de ahorro"
                  style={{ width: '100%', height: 'auto', marginTop: '14px', overflow: 'visible' }}
                >
                  {[24, 78, 132].map(y => (
                    <line key={y} x1="30" y1={y} x2="330" y2={y} stroke="#DCE3EC" strokeDasharray="4 4" />
                  ))}
                  <polyline
                    points={savingsPolyline}
                    fill="none"
                    stroke="#128A5D"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {savingsChartPoints.map(point => (
                    <g key={point.label}>
                      <circle cx={point.x} cy={point.y} r="4.5" fill="#128A5D" />
                      <text x={point.x} y="153" textAnchor="middle" fontSize="10" fill="#526176">
                        {point.label}
                      </text>
                    </g>
                  ))}
                </svg>
                <strong>{formatMoney(currentSavings)}</strong>
                <p>Saldo actual en ahorro. Los valores se calculan a partir de tus movimientos registrados.</p>
              </div>
            </div>

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
                      transaction.type === 'savings-withdrawal'

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
