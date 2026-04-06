export type LangCode = 'EN' | 'FR' | 'DE' | 'ES' | 'ZH' | 'AR' | 'JA' | 'PT';

export interface Translations {
  // Navbar
  nav_chatHub: string;
  nav_marketplace: string;
  nav_discoverNew: string;
  nav_agents: string;
  nav_signIn: string;
  nav_tryFree: string;

  // Auth modal / pages
  auth_signInTab: string;
  auth_createAccountTab: string;
  auth_welcomeBack: string;
  auth_signInSubtitle: string;
  auth_createAccount: string;
  auth_createSubtitle: string;
  auth_emailLabel: string;
  auth_emailPlaceholder: string;
  auth_passwordLabel: string;
  auth_passwordPlaceholder: string;
  auth_confirmPasswordLabel: string;
  auth_confirmPasswordPlaceholder: string;
  auth_fullNameLabel: string;
  auth_fullNamePlaceholder: string;
  auth_forgotPassword: string;
  auth_signInBtn: string;
  auth_signingIn: string;
  auth_createBtn: string;
  auth_creating: string;
  auth_orContinueWith: string;
  auth_noAccount: string;
  auth_createOne: string;
  auth_haveAccount: string;
  auth_signInLink: string;

  // Left panel
  auth_panelTitle: string;
  auth_panelSubtitle: string;
  auth_feature1: string;
  auth_feature2: string;
  auth_feature3: string;
  auth_feature4: string;

  // Language selector label
  lang_selectLabel: string;
}

export const TRANSLATIONS: Record<LangCode, Translations> = {
  EN: {
    nav_chatHub:        'Chat Hub',
    nav_marketplace:    'Marketplace',
    nav_discoverNew:    'Discover New',
    nav_agents:         'Agents',
    nav_signIn:         'Sign in',
    nav_tryFree:        'Try free →',

    auth_signInTab:               'Sign In',
    auth_createAccountTab:        'Create Account',
    auth_welcomeBack:             'Welcome back',
    auth_signInSubtitle:          'Sign in to your NexusAI account to continue.',
    auth_createAccount:           'Create your account',
    auth_createSubtitle:          "Get started with NexusAI — it's free.",
    auth_emailLabel:              'Email address',
    auth_emailPlaceholder:        'you@company.com',
    auth_passwordLabel:           'Password',
    auth_passwordPlaceholder:     'Enter your password',
    auth_confirmPasswordLabel:    'Confirm password',
    auth_confirmPasswordPlaceholder: 'Confirm your password',
    auth_fullNameLabel:           'Full name',
    auth_fullNamePlaceholder:     'John Doe',
    auth_forgotPassword:          'Forgot password?',
    auth_signInBtn:               'Sign in',
    auth_signingIn:               'Signing in…',
    auth_createBtn:               'Create account',
    auth_creating:                'Creating account…',
    auth_orContinueWith:          'Or continue with',
    auth_noAccount:               "Don't have an account?",
    auth_createOne:               'Create one →',
    auth_haveAccount:             'Already have an account?',
    auth_signInLink:              'Sign in',

    auth_panelTitle:    'Build Smarter with AI Agents',
    auth_panelSubtitle: 'Access 525+ models, create custom agents, and automate your workflow — all in one platform.',
    auth_feature1:      '525+ AI models from 30+ labs',
    auth_feature2:      'Custom agent builder with any model',
    auth_feature3:      'Connect tools, memory & APIs',
    auth_feature4:      'Real-time analytics & monitoring',

    lang_selectLabel: 'Language',
  },

  FR: {
    nav_chatHub:        'Hub de Chat',
    nav_marketplace:    'Marché',
    nav_discoverNew:    'Découvrir',
    nav_agents:         'Agents',
    nav_signIn:         'Connexion',
    nav_tryFree:        'Essai gratuit →',

    auth_signInTab:               'Connexion',
    auth_createAccountTab:        'Créer un compte',
    auth_welcomeBack:             'Bon retour',
    auth_signInSubtitle:          'Connectez-vous à votre compte NexusAI pour continuer.',
    auth_createAccount:           'Créer votre compte',
    auth_createSubtitle:          'Commencez avec NexusAI — c\'est gratuit.',
    auth_emailLabel:              'Adresse e-mail',
    auth_emailPlaceholder:        'vous@entreprise.com',
    auth_passwordLabel:           'Mot de passe',
    auth_passwordPlaceholder:     'Entrez votre mot de passe',
    auth_confirmPasswordLabel:    'Confirmer le mot de passe',
    auth_confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
    auth_fullNameLabel:           'Nom complet',
    auth_fullNamePlaceholder:     'Jean Dupont',
    auth_forgotPassword:          'Mot de passe oublié ?',
    auth_signInBtn:               'Se connecter',
    auth_signingIn:               'Connexion en cours…',
    auth_createBtn:               'Créer un compte',
    auth_creating:                'Création du compte…',
    auth_orContinueWith:          'Ou continuer avec',
    auth_noAccount:               'Vous n\'avez pas de compte ?',
    auth_createOne:               'En créer un →',
    auth_haveAccount:             'Vous avez déjà un compte ?',
    auth_signInLink:              'Se connecter',

    auth_panelTitle:    'Construisez plus intelligemment avec les agents IA',
    auth_panelSubtitle: 'Accédez à 525+ modèles, créez des agents personnalisés et automatisez vos workflows.',
    auth_feature1:      '525+ modèles IA de 30+ labos',
    auth_feature2:      'Constructeur d\'agents personnalisé',
    auth_feature3:      'Connectez outils, mémoire et API',
    auth_feature4:      'Analyses en temps réel',

    lang_selectLabel: 'Langue',
  },

  DE: {
    nav_chatHub:        'Chat-Hub',
    nav_marketplace:    'Marktplatz',
    nav_discoverNew:    'Entdecken',
    nav_agents:         'Agenten',
    nav_signIn:         'Anmelden',
    nav_tryFree:        'Kostenlos testen →',

    auth_signInTab:               'Anmelden',
    auth_createAccountTab:        'Konto erstellen',
    auth_welcomeBack:             'Willkommen zurück',
    auth_signInSubtitle:          'Melden Sie sich bei Ihrem NexusAI-Konto an.',
    auth_createAccount:           'Konto erstellen',
    auth_createSubtitle:          'Starten Sie mit NexusAI — kostenlos.',
    auth_emailLabel:              'E-Mail-Adresse',
    auth_emailPlaceholder:        'sie@unternehmen.com',
    auth_passwordLabel:           'Passwort',
    auth_passwordPlaceholder:     'Passwort eingeben',
    auth_confirmPasswordLabel:    'Passwort bestätigen',
    auth_confirmPasswordPlaceholder: 'Passwort bestätigen',
    auth_fullNameLabel:           'Vollständiger Name',
    auth_fullNamePlaceholder:     'Max Mustermann',
    auth_forgotPassword:          'Passwort vergessen?',
    auth_signInBtn:               'Anmelden',
    auth_signingIn:               'Anmeldung läuft…',
    auth_createBtn:               'Konto erstellen',
    auth_creating:                'Konto wird erstellt…',
    auth_orContinueWith:          'Oder fortfahren mit',
    auth_noAccount:               'Noch kein Konto?',
    auth_createOne:               'Erstellen →',
    auth_haveAccount:             'Bereits ein Konto?',
    auth_signInLink:              'Anmelden',

    auth_panelTitle:    'Intelligenter bauen mit KI-Agenten',
    auth_panelSubtitle: 'Zugriff auf 525+ Modelle, individuelle Agenten erstellen und Workflows automatisieren.',
    auth_feature1:      '525+ KI-Modelle aus 30+ Labs',
    auth_feature2:      'Benutzerdefinierter Agenten-Builder',
    auth_feature3:      'Tools, Speicher & APIs verbinden',
    auth_feature4:      'Echtzeit-Analysen & Monitoring',

    lang_selectLabel: 'Sprache',
  },

  ES: {
    nav_chatHub:        'Centro de Chat',
    nav_marketplace:    'Mercado',
    nav_discoverNew:    'Descubrir',
    nav_agents:         'Agentes',
    nav_signIn:         'Iniciar sesión',
    nav_tryFree:        'Prueba gratis →',

    auth_signInTab:               'Iniciar sesión',
    auth_createAccountTab:        'Crear cuenta',
    auth_welcomeBack:             'Bienvenido de nuevo',
    auth_signInSubtitle:          'Inicia sesión en tu cuenta de NexusAI para continuar.',
    auth_createAccount:           'Crea tu cuenta',
    auth_createSubtitle:          'Comienza con NexusAI — es gratis.',
    auth_emailLabel:              'Correo electrónico',
    auth_emailPlaceholder:        'tu@empresa.com',
    auth_passwordLabel:           'Contraseña',
    auth_passwordPlaceholder:     'Ingresa tu contraseña',
    auth_confirmPasswordLabel:    'Confirmar contraseña',
    auth_confirmPasswordPlaceholder: 'Confirma tu contraseña',
    auth_fullNameLabel:           'Nombre completo',
    auth_fullNamePlaceholder:     'Juan García',
    auth_forgotPassword:          '¿Olvidaste tu contraseña?',
    auth_signInBtn:               'Iniciar sesión',
    auth_signingIn:               'Iniciando sesión…',
    auth_createBtn:               'Crear cuenta',
    auth_creating:                'Creando cuenta…',
    auth_orContinueWith:          'O continuar con',
    auth_noAccount:               '¿No tienes cuenta?',
    auth_createOne:               'Crear una →',
    auth_haveAccount:             '¿Ya tienes cuenta?',
    auth_signInLink:              'Iniciar sesión',

    auth_panelTitle:    'Construye más inteligente con Agentes de IA',
    auth_panelSubtitle: 'Accede a 525+ modelos, crea agentes personalizados y automatiza tu flujo de trabajo.',
    auth_feature1:      '525+ modelos de IA de 30+ labs',
    auth_feature2:      'Constructor de agentes personalizado',
    auth_feature3:      'Conecta herramientas, memoria y APIs',
    auth_feature4:      'Análisis y monitoreo en tiempo real',

    lang_selectLabel: 'Idioma',
  },

  ZH: {
    nav_chatHub:        '聊天中心',
    nav_marketplace:    '市场',
    nav_discoverNew:    '发现新品',
    nav_agents:         '智能体',
    nav_signIn:         '登录',
    nav_tryFree:        '免费试用 →',

    auth_signInTab:               '登录',
    auth_createAccountTab:        '创建账户',
    auth_welcomeBack:             '欢迎回来',
    auth_signInSubtitle:          '登录您的 NexusAI 账户以继续。',
    auth_createAccount:           '创建您的账户',
    auth_createSubtitle:          '开始使用 NexusAI — 完全免费。',
    auth_emailLabel:              '电子邮件',
    auth_emailPlaceholder:        'you@company.com',
    auth_passwordLabel:           '密码',
    auth_passwordPlaceholder:     '输入您的密码',
    auth_confirmPasswordLabel:    '确认密码',
    auth_confirmPasswordPlaceholder: '再次输入密码',
    auth_fullNameLabel:           '全名',
    auth_fullNamePlaceholder:     '张三',
    auth_forgotPassword:          '忘记密码？',
    auth_signInBtn:               '登录',
    auth_signingIn:               '登录中…',
    auth_createBtn:               '创建账户',
    auth_creating:                '创建中…',
    auth_orContinueWith:          '或通过以下方式继续',
    auth_noAccount:               '还没有账户？',
    auth_createOne:               '立即创建 →',
    auth_haveAccount:             '已有账户？',
    auth_signInLink:              '登录',

    auth_panelTitle:    '借助 AI 智能体更智能地构建',
    auth_panelSubtitle: '访问 525+ 个模型，创建自定义智能体，自动化您的工作流程。',
    auth_feature1:      '来自 30+ 实验室的 525+ AI 模型',
    auth_feature2:      '自定义智能体构建器',
    auth_feature3:      '连接工具、记忆和 API',
    auth_feature4:      '实时分析与监控',

    lang_selectLabel: '语言',
  },

  AR: {
    nav_chatHub:        'مركز الدردشة',
    nav_marketplace:    'السوق',
    nav_discoverNew:    'اكتشف الجديد',
    nav_agents:         'الوكلاء',
    nav_signIn:         'تسجيل الدخول',
    nav_tryFree:        'جرّب مجاناً →',

    auth_signInTab:               'تسجيل الدخول',
    auth_createAccountTab:        'إنشاء حساب',
    auth_welcomeBack:             'مرحباً بعودتك',
    auth_signInSubtitle:          'سجّل الدخول إلى حساب NexusAI الخاص بك للمتابعة.',
    auth_createAccount:           'أنشئ حسابك',
    auth_createSubtitle:          'ابدأ مع NexusAI — مجاناً تماماً.',
    auth_emailLabel:              'البريد الإلكتروني',
    auth_emailPlaceholder:        'you@company.com',
    auth_passwordLabel:           'كلمة المرور',
    auth_passwordPlaceholder:     'أدخل كلمة مرورك',
    auth_confirmPasswordLabel:    'تأكيد كلمة المرور',
    auth_confirmPasswordPlaceholder: 'أكّد كلمة مرورك',
    auth_fullNameLabel:           'الاسم الكامل',
    auth_fullNamePlaceholder:     'محمد أحمد',
    auth_forgotPassword:          'نسيت كلمة المرور؟',
    auth_signInBtn:               'تسجيل الدخول',
    auth_signingIn:               'جارٍ تسجيل الدخول…',
    auth_createBtn:               'إنشاء حساب',
    auth_creating:                'جارٍ الإنشاء…',
    auth_orContinueWith:          'أو تابع باستخدام',
    auth_noAccount:               'ليس لديك حساب؟',
    auth_createOne:               'أنشئ حساباً →',
    auth_haveAccount:             'لديك حساب بالفعل؟',
    auth_signInLink:              'تسجيل الدخول',

    auth_panelTitle:    'ابنِ بشكل أذكى مع وكلاء الذكاء الاصطناعي',
    auth_panelSubtitle: 'وصل إلى 525+ نموذجاً، وأنشئ وكلاء مخصصين، وأتمت سير عملك.',
    auth_feature1:      '525+ نموذج ذكاء اصطناعي من 30+ مختبراً',
    auth_feature2:      'منشئ وكلاء مخصص',
    auth_feature3:      'ربط الأدوات والذاكرة وواجهات API',
    auth_feature4:      'تحليلات ومراقبة فورية',

    lang_selectLabel: 'اللغة',
  },

  JA: {
    nav_chatHub:        'チャットハブ',
    nav_marketplace:    'マーケット',
    nav_discoverNew:    '新規発見',
    nav_agents:         'エージェント',
    nav_signIn:         'ログイン',
    nav_tryFree:        '無料で試す →',

    auth_signInTab:               'ログイン',
    auth_createAccountTab:        'アカウント作成',
    auth_welcomeBack:             'おかえりなさい',
    auth_signInSubtitle:          'NexusAI アカウントにログインして続行してください。',
    auth_createAccount:           'アカウントを作成',
    auth_createSubtitle:          'NexusAI を始めましょう — 無料です。',
    auth_emailLabel:              'メールアドレス',
    auth_emailPlaceholder:        'you@company.com',
    auth_passwordLabel:           'パスワード',
    auth_passwordPlaceholder:     'パスワードを入力',
    auth_confirmPasswordLabel:    'パスワードの確認',
    auth_confirmPasswordPlaceholder: 'パスワードを再入力',
    auth_fullNameLabel:           'フルネーム',
    auth_fullNamePlaceholder:     '山田 太郎',
    auth_forgotPassword:          'パスワードをお忘れですか？',
    auth_signInBtn:               'ログイン',
    auth_signingIn:               'ログイン中…',
    auth_createBtn:               'アカウントを作成',
    auth_creating:                '作成中…',
    auth_orContinueWith:          'または以下で続行',
    auth_noAccount:               'アカウントをお持ちでないですか？',
    auth_createOne:               '作成する →',
    auth_haveAccount:             'すでにアカウントをお持ちですか？',
    auth_signInLink:              'ログイン',

    auth_panelTitle:    'AIエージェントでよりスマートに',
    auth_panelSubtitle: '525以上のモデルにアクセスし、カスタムエージェントを作成してワークフローを自動化。',
    auth_feature1:      '30以上のラボの525以上のAIモデル',
    auth_feature2:      'カスタムエージェントビルダー',
    auth_feature3:      'ツール・メモリ・APIを接続',
    auth_feature4:      'リアルタイム分析・監視',

    lang_selectLabel: '言語',
  },

  PT: {
    nav_chatHub:        'Hub de Chat',
    nav_marketplace:    'Mercado',
    nav_discoverNew:    'Descobrir',
    nav_agents:         'Agentes',
    nav_signIn:         'Entrar',
    nav_tryFree:        'Teste grátis →',

    auth_signInTab:               'Entrar',
    auth_createAccountTab:        'Criar conta',
    auth_welcomeBack:             'Bem-vindo de volta',
    auth_signInSubtitle:          'Entre na sua conta NexusAI para continuar.',
    auth_createAccount:           'Crie sua conta',
    auth_createSubtitle:          'Comece com o NexusAI — é gratuito.',
    auth_emailLabel:              'Endereço de e-mail',
    auth_emailPlaceholder:        'voce@empresa.com',
    auth_passwordLabel:           'Senha',
    auth_passwordPlaceholder:     'Digite sua senha',
    auth_confirmPasswordLabel:    'Confirmar senha',
    auth_confirmPasswordPlaceholder: 'Confirme sua senha',
    auth_fullNameLabel:           'Nome completo',
    auth_fullNamePlaceholder:     'João Silva',
    auth_forgotPassword:          'Esqueceu a senha?',
    auth_signInBtn:               'Entrar',
    auth_signingIn:               'Entrando…',
    auth_createBtn:               'Criar conta',
    auth_creating:                'Criando conta…',
    auth_orContinueWith:          'Ou continue com',
    auth_noAccount:               'Não tem uma conta?',
    auth_createOne:               'Criar uma →',
    auth_haveAccount:             'Já tem uma conta?',
    auth_signInLink:              'Entrar',

    auth_panelTitle:    'Construa com mais inteligência com Agentes de IA',
    auth_panelSubtitle: 'Acesse 525+ modelos, crie agentes personalizados e automatize seu fluxo de trabalho.',
    auth_feature1:      '525+ modelos de IA de 30+ labs',
    auth_feature2:      'Construtor de agentes personalizado',
    auth_feature3:      'Conecte ferramentas, memória e APIs',
    auth_feature4:      'Análises e monitoramento em tempo real',

    lang_selectLabel: 'Idioma',
  },
};

export const LANGUAGE_OPTIONS: { code: LangCode; label: string; flag: string }[] = [
  { code: 'EN', label: 'English',    flag: '🇺🇸' },
  { code: 'FR', label: 'Français',   flag: '🇫🇷' },
  { code: 'DE', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'ES', label: 'Español',    flag: '🇪🇸' },
  { code: 'ZH', label: '中文',        flag: '🇨🇳' },
  { code: 'AR', label: 'العربية',    flag: '🇸🇦' },
  { code: 'JA', label: '日本語',      flag: '🇯🇵' },
  { code: 'PT', label: 'Português',  flag: '🇧🇷' },
];
