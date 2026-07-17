const STORAGE_KEY = "drive-astral-state";
const ACCOUNT_KEY = "drive-astral-account";
const SESSION_KEY = "drive-astral-session";
const PROTOCOL_PROGRESS_KEY = "drive-astral-protocol-progress";
const JOURNEY_PROGRESS_KEY = "drive-astral-journey-progress";
const STORAGE_SCHEMA_VERSION = 2;
const BACKUP_FORMAT_VERSION = "drive-astral-backup-v2";
const LEGACY_BACKUP_FORMAT_VERSION = "drive-astral-backup-v1";
const WEB_PLATFORM_VERSION = "web-platform-v1";
const PRIVACY_POLICY_VERSION = "2026-06-13";
const TERMS_VERSION = "2026-06-13";
const ADMIN_SETTING_KEYS = Object.freeze({
  general: "platform.general",
  plans: "plans.display",
  checkout: "checkout.external",
  methodology: "methodology.lunar",
});
const ADMIN_DEFAULT_SETTINGS = Object.freeze({
  general: {
    platformName: "Drive Mental",
    supportEmail: "contato@driveastral.com",
    environmentStatus: "producao",
    maintenanceMode: false,
    globalNotice: "",
  },
  plans: {
    premiumBadge: "PREMIUM",
    premiumPrice: "29,90",
    mentorBadge: "MENTOR",
    mentorPrice: "97,00",
    ctaText: "INICIAR A MINHA JORNADA",
    premiumVisible: true,
    mentorVisible: true,
  },
  checkout: {
    provider: "hotmart",
    premiumCheckoutUrl: "",
    mentorCheckoutUrl: "",
    accessInstruction: "Enviar usuario e senha por e-mail apos confirmacao do pagamento.",
  },
  methodology: {
    activeVersion: "2026.06",
    draftVersion: "",
    leapDayPolicy: "blocked",
    dailyPhraseEnabled: true,
    mantraEnabled: true,
  },
});

function runtimeConfig() {
  return window.DriveAstralRuntimeConfig || {
    environment: "local-beta",
    authMode: "local-preview",
    billingMode: "disabled",
  };
}

function supabaseService() {
  return window.DriveAstralSupabase || null;
}

function isSupabaseMode() {
  const service = supabaseService();
  return runtimeConfig().authMode === "supabase"
    && service
    && service.isEnabled();
}

function isAdminRoute(route) {
  return ["admin-dashboard", "admin-users", "admin-plans", "admin-settings"].includes(route);
}

function defaultAdminSettings() {
  return JSON.parse(JSON.stringify(ADMIN_DEFAULT_SETTINGS));
}

const chakras = Object.freeze([
  {
    id: "crown",
    number: 7,
    name: "Coron&aacute;rio",
    traditional: "Sahasrara",
    color: "#C53EDB",
    symbol: "crown",
    phrase: "Prop&oacute;sito, consci&ecirc;ncia e conex&atilde;o com sentido maior.",
    essence: "O Chakra Coron&aacute;rio representa simbolicamente a rela&ccedil;&atilde;o com f&eacute;, significado, prop&oacute;sito e abertura para perceber a vida al&eacute;m das urg&ecirc;ncias imediatas.",
    lifeAreas: ["Prop&oacute;sito", "Espiritualidade", "Significado", "F&eacute;", "Consci&ecirc;ncia", "Conex&atilde;o"],
    balancedExpressions: [
      "Pode favorecer uma percep&ccedil;&atilde;o mais ampla das escolhas.",
      "Pode se manifestar como confian&ccedil;a serena e senso de dire&ccedil;&atilde;o.",
      "Pode apoiar decis&otilde;es conectadas a valores e significado.",
    ],
    observationSignals: [
      "dificuldade para enxergar sentido no que faz",
      "sensibilidade a excesso de informa&ccedil;&atilde;o",
      "necessidade de reconectar escolhas com valores pessoais",
      "tend&ecirc;ncia a agir no autom&aacute;tico sem pausa interior",
    ],
    reflectionQuestions: [
      "Que valor maior est&aacute; orientando minhas escolhas atuais?",
      "Onde posso agir com mais presen&ccedil;a e menos pressa?",
      "O que me ajuda a lembrar do sentido por tr&aacute;s da minha rotina?",
      "Que decis&atilde;o pede mais sil&ecirc;ncio antes da a&ccedil;&atilde;o?",
    ],
    practices: ["ora&ccedil;&atilde;o ou pausa contemplativa", "escrita sobre prop&oacute;sito", "pr&aacute;tica de gratid&atilde;o", "revis&atilde;o de valores da semana"],
  },
  {
    id: "thirdEye",
    number: 6,
    name: "Terceiro Olho",
    traditional: "Ajna",
    color: "#5145C6",
    symbol: "compass",
    phrase: "Clareza, discernimento e vis&atilde;o para escolher melhor.",
    essence: "O Terceiro Olho simboliza clareza mental, intui&ccedil;&atilde;o, discernimento e capacidade de observar padr&otilde;es antes de tomar decis&otilde;es.",
    lifeAreas: ["Clareza", "Intui&ccedil;&atilde;o", "Discernimento", "Vis&atilde;o", "Planejamento", "Decis&otilde;es"],
    balancedExpressions: [
      "Pode favorecer leitura mais clara das situa&ccedil;&otilde;es.",
      "Pode se manifestar como planejamento simples e decis&otilde;es conscientes.",
      "Pode apoiar a percep&ccedil;&atilde;o de padr&otilde;es repetidos na rotina.",
    ],
    observationSignals: [
      "dificuldade para priorizar entre muitas op&ccedil;&otilde;es",
      "excesso de an&aacute;lise antes de agir",
      "confus&atilde;o entre intui&ccedil;&atilde;o e impulso",
      "necessidade de organizar ideias em uma dire&ccedil;&atilde;o concreta",
    ],
    reflectionQuestions: [
      "O que estou vendo com clareza e ainda n&atilde;o assumi?",
      "Que informa&ccedil;&atilde;o falta para decidir com serenidade?",
      "Qual padr&atilde;o se repete nas minhas escolhas recentes?",
      "Que prioridade simplificaria meu pr&oacute;ximo passo?",
    ],
    practices: ["mapa de prioridades", "pausa consciente antes de decidir", "anota&ccedil;&atilde;o de padr&otilde;es percebidos", "revis&atilde;o semanal de escolhas"],
  },
  {
    id: "throat",
    number: 5,
    name: "Lar&iacute;ngeo",
    traditional: "Vishuddha",
    color: "#27A9DF",
    symbol: "book",
    phrase: "Express&atilde;o, escuta e verdade comunicada com presen&ccedil;a.",
    essence: "O Chakra Lar&iacute;ngeo representa simbolicamente comunica&ccedil;&atilde;o, escuta, express&atilde;o de ideias e capacidade de posicionar a pr&oacute;pria verdade com respeito.",
    lifeAreas: ["Comunica&ccedil;&atilde;o", "Express&atilde;o", "Verdade", "Escuta", "Posicionamento", "Negocia&ccedil;&atilde;o"],
    balancedExpressions: [
      "Pode favorecer conversas mais claras e respeitosas.",
      "Pode se manifestar como coragem para expressar ideias com medida.",
      "Pode apoiar escuta ativa antes de responder.",
    ],
    observationSignals: [
      "evitar conversas importantes por desconforto",
      "falar demais quando seria melhor escutar",
      "dificuldade para pedir o que precisa com clareza",
      "necessidade de alinhar fala, a&ccedil;&atilde;o e verdade pessoal",
    ],
    reflectionQuestions: [
      "Que conversa importante estou adiando?",
      "Minha fala est&aacute; servindo &agrave; clareza ou &agrave; defesa?",
      "Onde preciso escutar antes de responder?",
      "Que ideia pede express&atilde;o mais simples e direta?",
    ],
    practices: ["escrita antes de conversas", "escuta ativa", "conversa honesta", "organiza&ccedil;&atilde;o de ideias em t&oacute;picos"],
  },
  {
    id: "heart",
    number: 4,
    name: "Card&iacute;aco",
    traditional: "Anahata",
    color: "#54B85A",
    symbol: "heart",
    phrase: "Amor, confian&ccedil;a e equil&iacute;brio nas trocas.",
    essence: "O Chakra Card&iacute;aco simboliza amor, compaix&atilde;o, confian&ccedil;a, perd&atilde;o e a capacidade de equilibrar cuidado com limites saud&aacute;veis.",
    lifeAreas: ["Amor", "Confian&ccedil;a", "Compaix&atilde;o", "Perd&atilde;o", "V&iacute;nculos", "Equil&iacute;brio emocional"],
    balancedExpressions: [
      "Pode favorecer rela&ccedil;&otilde;es mais presentes e cuidadosas.",
      "Pode se manifestar como generosidade com limites claros.",
      "Pode apoiar reconcilia&ccedil;&atilde;o interior sem negar necessidades pessoais.",
    ],
    observationSignals: [
      "dificuldade para receber apoio",
      "tend&ecirc;ncia a cuidar dos outros e esquecer de si",
      "necessidade de perdoar sem ignorar limites",
      "oscila&ccedil;&atilde;o entre fechamento e entrega excessiva",
    ],
    reflectionQuestions: [
      "Onde posso cuidar sem me abandonar?",
      "Que limite protegeria melhor meu cora&ccedil;&atilde;o?",
      "Que rela&ccedil;&atilde;o pede mais presen&ccedil;a e menos expectativa?",
      "O que preciso reconhecer antes de perdoar?",
    ],
    practices: ["pr&aacute;tica de gratid&atilde;o", "pausa com m&atilde;os no peito", "registro de limites saud&aacute;veis", "gesto simples de cuidado"],
  },
  {
    id: "solarPlexus",
    number: 3,
    name: "Plexo Solar",
    traditional: "Manipura",
    color: "#F5B51B",
    symbol: "target",
    phrase: "Autoconfian&ccedil;a, a&ccedil;&atilde;o e dire&ccedil;&atilde;o pr&aacute;tica.",
    essence: "O Plexo Solar representa simbolicamente iniciativa, disciplina, autoestima, limites e capacidade de transformar inten&ccedil;&atilde;o em a&ccedil;&atilde;o concreta.",
    lifeAreas: ["Autoconfian&ccedil;a", "A&ccedil;&atilde;o", "Disciplina", "Limites", "Carreira", "Realiza&ccedil;&atilde;o"],
    balancedExpressions: [
      "Pode favorecer iniciativa com const&acirc;ncia.",
      "Pode se manifestar como clareza de limites e foco no essencial.",
      "Pode apoiar a execu&ccedil;&atilde;o de tarefas importantes sem dispers&atilde;o.",
    ],
    observationSignals: [
      "adiamento frequente de decis&otilde;es simples",
      "dificuldade para manter uma a&ccedil;&atilde;o principal",
      "necessidade de fortalecer limites na rotina",
      "excesso de cobran&ccedil;a sem plano pr&aacute;tico",
    ],
    reflectionQuestions: [
      "Qual a&ccedil;&atilde;o simples gera mais movimento hoje?",
      "Onde preciso trocar pressa por disciplina?",
      "Que limite protegeria meu foco?",
      "O que posso concluir antes de buscar algo novo?",
    ],
    practices: ["defini&ccedil;&atilde;o de uma tarefa principal", "revis&atilde;o de limites", "organiza&ccedil;&atilde;o da rotina", "pausa consciente antes da a&ccedil;&atilde;o"],
  },
  {
    id: "sacral",
    number: 2,
    name: "Sacral",
    traditional: "Svadhisthana",
    color: "#F57C19",
    symbol: "leaf",
    phrase: "Criatividade, emo&ccedil;&otilde;es e fluidez nos v&iacute;nculos.",
    essence: "O Chakra Sacral simboliza emo&ccedil;&otilde;es, criatividade, prazer, intimidade, flexibilidade e capacidade de se adaptar sem perder autenticidade.",
    lifeAreas: ["Emo&ccedil;&otilde;es", "Criatividade", "Prazer", "Intimidade", "V&iacute;nculos", "Flexibilidade"],
    balancedExpressions: [
      "Pode favorecer criatividade e abertura para novas solu&ccedil;&otilde;es.",
      "Pode se manifestar como maior flexibilidade emocional.",
      "Pode apoiar rela&ccedil;&otilde;es com mais espontaneidade e presen&ccedil;a.",
    ],
    observationSignals: [
      "dificuldade para reconhecer o que sente",
      "rigidez diante de mudan&ccedil;as pequenas",
      "necessidade de espa&ccedil;o para criar sem julgamento",
      "oscila&ccedil;&atilde;o entre controle e impulsividade",
    ],
    reflectionQuestions: [
      "Que emo&ccedil;&atilde;o precisa ser reconhecida com honestidade?",
      "Onde posso criar uma resposta mais flex&iacute;vel?",
      "O que me traz prazer simples e saud&aacute;vel?",
      "Que v&iacute;nculo pede mais leveza?",
    ],
    practices: ["atividade criativa", "escrita emocional", "organiza&ccedil;&atilde;o de um momento de descanso", "movimento corporal leve e confort&aacute;vel"],
  },
  {
    id: "root",
    number: 1,
    name: "Raiz",
    traditional: "Muladhara",
    color: "#EF3B2D",
    symbol: "home",
    phrase: "Seguran&ccedil;a, presen&ccedil;a e sustenta&ccedil;&atilde;o para construir.",
    essence: "O Chakra Raiz representa simbolicamente base, seguran&ccedil;a, pertencimento, rotina e rela&ccedil;&atilde;o com a vida material.",
    lifeAreas: ["Seguran&ccedil;a", "Estabilidade", "Rotina", "Casa", "Pertencimento", "Vida material"],
    balancedExpressions: [
      "Pode favorecer maior sensa&ccedil;&atilde;o de estabilidade e presen&ccedil;a.",
      "Pode se manifestar como rotina mais simples e sustent&aacute;vel.",
      "Pode apoiar escolhas materiais feitas com clareza e const&acirc;ncia.",
    ],
    observationSignals: [
      "dificuldade frequente para manter uma rotina",
      "preocupa&ccedil;&atilde;o constante com estabilidade",
      "sensa&ccedil;&atilde;o de n&atilde;o pertencimento",
      "dificuldade para descansar e sentir seguran&ccedil;a",
    ],
    reflectionQuestions: [
      "Minha rotina atual oferece estabilidade ou apenas ocupa meu tempo?",
      "Quais bases preciso organizar antes de buscar crescimento?",
      "Minhas decis&otilde;es materiais est&atilde;o sendo guiadas por clareza ou medo?",
      "O que me ajudaria a sentir maior seguran&ccedil;a sem impedir mudan&ccedil;as?",
    ],
    practices: ["organiza&ccedil;&atilde;o da rotina", "revis&atilde;o de prioridades materiais", "contato com a natureza", "respira&ccedil;&atilde;o confort&aacute;vel e consciente"],
  },
]);

const chakraPlasmaNames = Object.freeze({
  crown: "Dali",
  root: "Seli",
  thirdEye: "Gama",
  sacral: "Kali",
  throat: "Alfa",
  solarPlexus: "Limi",
  heart: "Silio",
});

const icons = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.8 12 3l9 7.8"/><path d="M5.2 9.6v10h5.1v-5.7h3.4v5.7h5.1v-10"/></svg>',
  protocol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8l2 2v14H6V6l2-2Z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>',
  history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.34-5.66"/><path d="M4 5v5h5"/><path d="M12 8v4l3 2"/></svg>',
  profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m14 6 4 4"/></svg>',
  camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h4l2-3h4l2 3h4v12H4V8Z"/><path d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4l1 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 1v4a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11V8a5 5 0 0 1 10 0v3"/><path d="M5 11h14v10H5z"/><path d="M12 15v2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z"/><path d="m9 12 2 2 4-5"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5L6 17Z"/><path d="M10 20h4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 20 4l-4-4L0 16l4 4Z" transform="translate(2 2) scale(.85)"/><path d="M8 16l-2-2"/><path d="M11 13l-2-2"/><path d="M14 10l-2-2"/></svg>',
  logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5v14h5"/><path d="M14 17l5-5-5-5"/><path d="M19 12H9"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v4"/><path d="M17 3v4"/><path d="M4 8h16"/><path d="M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"/><path d="M8 12h2"/><path d="M14 12h2"/><path d="M8 16h2"/><path d="M14 16h2"/></svg>',
  spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>',
  dollar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><path d="M16.5 7.5C15.5 6.5 14 6 12.3 6 9.9 6 8 7.2 8 9s1.8 2.7 4.1 3.2c2.4.5 4 1.4 4 3.2 0 1.9-1.8 3.1-4.2 3.1-1.9 0-3.6-.6-4.8-1.8"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 5.7a5 5 0 0 0-7.1 0L12 7.4l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.2a5 5 0 0 0 0-7.1Z"/></svg>',
  compass: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="m16 8-2.2 5.8L8 16l2.2-5.8L16 8Z"/></svg>',
  "trending-up": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16"/><path d="m6 15 5-5 3 3 6-7"/><path d="M16 6h4v4"/></svg>',
  unlock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11V7a5 5 0 0 1 9.3-2.5"/><path d="M6 11h12v10H6z"/><path d="M12 15v3"/></svg>',
  cycle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M12 10v7"/><path d="M12 7h.01"/></svg>',
  lotus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20c-5 0-8-2.8-9-7 3.8.2 6.8 2.3 9 7Z"/><path d="M12 20c5 0 8-2.8 9-7-3.8.2-6.8 2.3-9 7Z"/><path d="M12 20c-3.1-3.2-3.1-7.4 0-12 3.1 4.6 3.1 8.8 0 12Z"/><path d="M12 8c-1.4-1.8-1.4-3.6 0-5 1.4 1.4 1.4 3.2 0 5Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  target: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M12 6v6l4 2"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 5.5A2.5 2.5 0 0 1 6.5 8H20"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c-7.5.3-12.4 4-14 11 6.9 1.2 11.7-2.7 14-11Z"/><path d="M6 15c3.5-2 6.7-4.2 10-7"/><path d="M5 21c.6-2.3 1.4-4.2 2.5-5.8"/></svg>',
  crown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z"/><path d="M5 19h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 18h10l1-18"/><path d="M10 11v7"/><path d="M14 11v7"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-7"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 21h14"/></svg>',
  device: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></svg>',
  meditate: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M9.5 9.5 12 13l2.5-3.5"/><path d="M12 13v4"/><path d="M6 12c1.8 1.5 3.8 2.2 6 2.2S16.2 13.5 18 12"/><path d="M4 21c2.7-2.5 5.3-3.8 8-3.8s5.3 1.3 8 3.8"/><path d="M8 21c1.3-1 2.7-1.5 4-1.5s2.7.5 4 1.5"/></svg>',
};

const consultationAreas = Object.freeze([
  {
    id: "general",
    title: "Visão Geral",
    shortTitle: "Visão Geral",
    icon: "sparkles",
    description: "Uma leitura ampla do seu momento atual",
    focusArea: "general",
    contentStatus: "base_validada_inicial",
  },
  {
    id: "purpose",
    title: "Propósito e Direção",
    shortTitle: "Propósito",
    icon: "compass",
    description: "Missão, talentos e caminhos possíveis",
    focusArea: "purpose",
    contentStatus: "base_validada_inicial",
  },
  {
    id: "work-prosperity",
    title: "Trabalho e Prosperidade",
    shortTitle: "Prosperidade",
    icon: "trending-up",
    description: "Carreira, projetos, dinheiro e realização",
    focusArea: "work-prosperity",
    contentStatus: "base_validada_inicial",
  },
  {
    id: "love-relationships",
    title: "Amor e Relacionamentos",
    shortTitle: "Relacionamentos",
    icon: "heart",
    description: "Conexões, padrões afetivos e convivência",
    focusArea: "love-relationships",
    contentStatus: "base_validada_inicial",
  },
  {
    id: "challenges-blocks",
    title: "Desafios e Bloqueios",
    shortTitle: "Bloqueios",
    icon: "unlock",
    description: "Padrões repetitivos e pontos de transformação",
    focusArea: "challenges-blocks",
    contentStatus: "base_validada_inicial",
  },
  {
    id: "energy-spirituality",
    title: "Energia e Espiritualidade",
    shortTitle: "Energia",
    icon: "lotus",
    description: "Equilíbrio, consciência e conexão interior",
    focusArea: "energy-spirituality",
    contentStatus: "base_validada_inicial",
  },
  {
    id: "decisions-cycles",
    title: "Decisões e Ciclos",
    shortTitle: "Ciclos",
    icon: "cycle",
    description: "Momento atual, escolhas e próximos movimentos",
    focusArea: "decisions-cycles",
    contentStatus: "base_validada_inicial",
  },
]);

const timelineCategories = Object.freeze([
  "Trabalho e Prosperidade",
  "Amor e Relacionamentos",
  "Fam&iacute;lia",
  "Mudan&ccedil;a de Vida",
  "Espiritualidade",
  "Estudos",
  "Sa&uacute;de e Bem-estar",
  "Outro",
]);

const areaChakraInterpretations = Object.freeze({
  general: {
    root: "Na Vis&atilde;o Geral, o Chakra Raiz aponta para bases, rotina e senso de seguran&ccedil;a que sustentam o momento atual.",
    sacral: "Na Vis&atilde;o Geral, o Chakra Sacral destaca emo&ccedil;&otilde;es, criatividade e flexibilidade diante do que est&aacute; em movimento.",
    solarPlexus: "Na Vis&atilde;o Geral, o Plexo Solar se relaciona &agrave; iniciativa, disciplina e capacidade de transformar percep&ccedil;&atilde;o em a&ccedil;&atilde;o.",
    heart: "Na Vis&atilde;o Geral, o Card&iacute;aco representa cuidado, confian&ccedil;a e equil&iacute;brio entre entrega e limites.",
    throat: "Na Vis&atilde;o Geral, o Lar&iacute;ngeo se relaciona &agrave; clareza da comunica&ccedil;&atilde;o e &agrave; coer&ecirc;ncia entre fala e escolha.",
    thirdEye: "Na Vis&atilde;o Geral, o Terceiro Olho favorece observar padr&otilde;es, priorizar com clareza e decidir com discernimento.",
    crown: "Na Vis&atilde;o Geral, o Coron&aacute;rio conecta a leitura a prop&oacute;sito, f&eacute;, significado e vis&atilde;o mais ampla.",
  },
  purpose: {
    root: "Em Prop&oacute;sito e Dire&ccedil;&atilde;o, o Chakra Raiz lembra que uma miss&atilde;o precisa de base, rotina e sustenta&ccedil;&atilde;o concreta.",
    sacral: "Em Prop&oacute;sito e Dire&ccedil;&atilde;o, o Sacral se relaciona &agrave; criatividade que ajuda talentos a ganharem forma viva.",
    solarPlexus: "Em Prop&oacute;sito e Dire&ccedil;&atilde;o, o Plexo Solar representa coragem pr&aacute;tica, foco e a&ccedil;&atilde;o consistente.",
    heart: "Em Prop&oacute;sito e Dire&ccedil;&atilde;o, o Card&iacute;aco aproxima escolhas de valores, cuidado e servi&ccedil;o com limites.",
    throat: "Em Prop&oacute;sito e Dire&ccedil;&atilde;o, o Lar&iacute;ngeo apoia expressar ideias, nomear talentos e comunicar caminhos.",
    thirdEye: "Em Prop&oacute;sito e Dire&ccedil;&atilde;o, o Terceiro Olho ajuda a perceber padr&otilde;es, vis&atilde;o de futuro e prioridades.",
    crown: "Em Prop&oacute;sito e Dire&ccedil;&atilde;o, o Coron&aacute;rio destaca sentido maior, f&eacute; e conex&atilde;o com uma dire&ccedil;&atilde;o interior.",
  },
  "work-prosperity": {
    root: "Dentro de Trabalho e Prosperidade, o Chakra Raiz representa seguran&ccedil;a material, estabilidade profissional, organiza&ccedil;&atilde;o e bases sustent&aacute;veis.",
    sacral: "Dentro de Trabalho e Prosperidade, o Sacral se relaciona &agrave; criatividade, adapta&ccedil;&atilde;o e capacidade de encontrar solu&ccedil;&otilde;es com fluidez.",
    solarPlexus: "Dentro de Trabalho e Prosperidade, o Plexo Solar est&aacute; ligado &agrave; iniciativa, autoconfian&ccedil;a, disciplina e transforma&ccedil;&atilde;o de inten&ccedil;&atilde;o em a&ccedil;&atilde;o.",
    heart: "Dentro de Trabalho e Prosperidade, o Card&iacute;aco pode apoiar rela&ccedil;&otilde;es profissionais com confian&ccedil;a, coopera&ccedil;&atilde;o e limites claros.",
    throat: "Dentro de Trabalho e Prosperidade, o Lar&iacute;ngeo se relaciona &agrave; comunica&ccedil;&atilde;o profissional, negocia&ccedil;&atilde;o, posicionamento e express&atilde;o de ideias.",
    thirdEye: "Dentro de Trabalho e Prosperidade, o Terceiro Olho apoia planejamento, leitura de oportunidades e decis&otilde;es menos impulsivas.",
    crown: "Dentro de Trabalho e Prosperidade, o Coron&aacute;rio conecta realiza&ccedil;&atilde;o material a prop&oacute;sito, significado e valores.",
  },
  "love-relationships": {
    root: "Em Amor e Relacionamentos, o Chakra Raiz representa seguran&ccedil;a afetiva, presen&ccedil;a e bases de confian&ccedil;a nos v&iacute;nculos.",
    sacral: "Em Amor e Relacionamentos, o Sacral se relaciona &agrave; intimidade, emo&ccedil;&otilde;es, prazer, criatividade e flexibilidade nas trocas.",
    solarPlexus: "Em Amor e Relacionamentos, o Plexo Solar apoia limites, autoestima e escolhas afetivas com mais autonomia.",
    heart: "Em Amor e Relacionamentos, o Card&iacute;aco simboliza amor, compaix&atilde;o, perd&atilde;o e equil&iacute;brio entre entrega e autocuidado.",
    throat: "Em Amor e Relacionamentos, o Lar&iacute;ngeo favorece conversas honestas, pedidos claros, escuta e express&atilde;o emocional respeitosa.",
    thirdEye: "Em Amor e Relacionamentos, o Terceiro Olho ajuda a observar padr&otilde;es afetivos e decidir com mais clareza.",
    crown: "Em Amor e Relacionamentos, o Coron&aacute;rio conecta os v&iacute;nculos a sentido, f&eacute;, aprendizado e amadurecimento interior.",
  },
  "challenges-blocks": {
    root: "Em Desafios e Bloqueios, o Chakra Raiz convida a observar bases, rotina e medos ligados &agrave; seguran&ccedil;a sem transformar isso em diagn&oacute;stico.",
    sacral: "Em Desafios e Bloqueios, o Sacral ajuda a refletir sobre rigidez emocional, criatividade contida e necessidade de flexibilidade.",
    solarPlexus: "Em Desafios e Bloqueios, o Plexo Solar destaca rela&ccedil;&atilde;o com a&ccedil;&atilde;o, limites, autoconfian&ccedil;a e const&acirc;ncia.",
    heart: "Em Desafios e Bloqueios, o Card&iacute;aco aponta para cuidado, limites, perd&atilde;o e rela&ccedil;&otilde;es que pedem mais consci&ecirc;ncia.",
    throat: "Em Desafios e Bloqueios, o Lar&iacute;ngeo se relaciona a conversas evitadas, express&atilde;o de verdade e escuta mais madura.",
    thirdEye: "Em Desafios e Bloqueios, o Terceiro Olho favorece perceber padr&otilde;es repetidos e escolhas que pedem discernimento.",
    crown: "Em Desafios e Bloqueios, o Coron&aacute;rio convida a reconectar dificuldade com aprendizado, f&eacute; e sentido.",
  },
  "energy-spirituality": {
    root: "Em Energia e Espiritualidade, o Chakra Raiz lembra que presen&ccedil;a espiritual tamb&eacute;m precisa de corpo, rotina e aterramento.",
    sacral: "Em Energia e Espiritualidade, o Sacral destaca sensibilidade, emo&ccedil;&otilde;es e criatividade como pontes de percep&ccedil;&atilde;o interior.",
    solarPlexus: "Em Energia e Espiritualidade, o Plexo Solar apoia disciplina, foco e pr&aacute;ticas sustent&aacute;veis sem exageros.",
    heart: "Em Energia e Espiritualidade, o Card&iacute;aco conecta compaix&atilde;o, gratid&atilde;o, cuidado e abertura amorosa.",
    throat: "Em Energia e Espiritualidade, o Lar&iacute;ngeo se relaciona &agrave; palavra consciente, ora&ccedil;&atilde;o, escuta e verdade interior.",
    thirdEye: "Em Energia e Espiritualidade, o Terceiro Olho favorece discernimento para separar intui&ccedil;&atilde;o, medo e impulso.",
    crown: "Em Energia e Espiritualidade, o Coron&aacute;rio representa conex&atilde;o com f&eacute;, prop&oacute;sito, sil&ecirc;ncio e significado.",
  },
  "decisions-cycles": {
    root: "Em Decis&otilde;es e Ciclos, o Chakra Raiz ajuda a avaliar se a escolha possui base, seguran&ccedil;a e sustenta&ccedil;&atilde;o pr&aacute;tica.",
    sacral: "Em Decis&otilde;es e Ciclos, o Sacral aponta para flexibilidade, emo&ccedil;&otilde;es envolvidas e abertura a novas respostas.",
    solarPlexus: "Em Decis&otilde;es e Ciclos, o Plexo Solar representa iniciativa, foco e coragem de executar o pr&oacute;ximo passo.",
    heart: "Em Decis&otilde;es e Ciclos, o Card&iacute;aco ajuda a equilibrar escolhas com cuidado, valores e limites afetivos.",
    throat: "Em Decis&otilde;es e Ciclos, o Lar&iacute;ngeo favorece nomear o que precisa ser dito antes de fechar ou iniciar um ciclo.",
    thirdEye: "Em Decis&otilde;es e Ciclos, o Terceiro Olho apoia clareza, leitura de padr&otilde;es e vis&atilde;o de consequ&ecirc;ncias.",
    crown: "Em Decis&otilde;es e Ciclos, o Coron&aacute;rio conecta a escolha a prop&oacute;sito, confian&ccedil;a e sentido de caminho.",
  },
});

const RELATIONSHIP_EXPLANATIONS = Object.freeze({
  same_kin: {
    math: "O Kin do dia &eacute; igual ao Kin pessoal calculado pela mesma contagem de 260 Kins.",
    symbolic: "A rela&ccedil;&atilde;o pode ser lida como um espelho direto do pr&oacute;prio mapa, sem indicar previs&atilde;o ou diagn&oacute;stico.",
  },
  oracle_destiny: {
    math: "O Kin do dia coincide com o ponto de Destino do or&aacute;culo pessoal calculado.",
    symbolic: "A interpreta&ccedil;&atilde;o simb&oacute;lica destaca o centro do or&aacute;culo como foco de observa&ccedil;&atilde;o.",
  },
  oracle_guide: {
    math: "O Kin do dia coincide com o ponto Guia do or&aacute;culo pessoal calculado.",
    symbolic: "A leitura simb&oacute;lica sugere observar crit&eacute;rios internos de dire&ccedil;&atilde;o.",
  },
  oracle_analog: {
    math: "O Kin do dia coincide com o ponto An&aacute;logo do or&aacute;culo pessoal calculado.",
    symbolic: "A leitura simb&oacute;lica pode destacar apoio, complemento e coopera&ccedil;&atilde;o.",
  },
  oracle_antipode: {
    math: "O Kin do dia coincide com o ponto Ant&iacute;poda do or&aacute;culo pessoal calculado.",
    symbolic: "A leitura simb&oacute;lica pode destacar contraste, tens&atilde;o criativa e necessidade de clareza.",
  },
  oracle_occult: {
    math: "O Kin do dia coincide com o ponto Oculto do or&aacute;culo pessoal calculado.",
    symbolic: "A leitura simb&oacute;lica pode apontar recursos discretos e percep&ccedil;&otilde;es menos evidentes.",
  },
  same_seal: {
    math: "O Kin pessoal e o Kin do dia compartilham o mesmo selo solar.",
    symbolic: "A interpreta&ccedil;&atilde;o simb&oacute;lica observa a repeti&ccedil;&atilde;o da mesma qualidade de selo.",
  },
  same_tone: {
    math: "O Kin pessoal e o Kin do dia compartilham o mesmo tom gal&aacute;ctico.",
    symbolic: "A interpreta&ccedil;&atilde;o simb&oacute;lica observa a repeti&ccedil;&atilde;o do mesmo ritmo de tom.",
  },
  same_color: {
    math: "O Kin pessoal e o Kin do dia compartilham a mesma cor dentro da sequ&ecirc;ncia dos selos.",
    symbolic: "A leitura registra uma repeti&ccedil;&atilde;o de cor no ciclo e usa esse dado apenas como ponto de observa&ccedil;&atilde;o simb&oacute;lica revisada.",
  },
  same_earth_family: {
    math: "O Kin pessoal e o Kin do dia pertencem &agrave; mesma Fam&iacute;lia Terrestre derivada dos selos.",
    symbolic: "A interpreta&ccedil;&atilde;o simb&oacute;lica observa padr&otilde;es de movimento recorrentes dentro da mesma fam&iacute;lia.",
  },
  cycle_distance: {
    math: "Esta &eacute; uma dist&acirc;ncia matem&aacute;tica entre os dois Kins.",
    symbolic: "A interpreta&ccedil;&atilde;o simb&oacute;lica dessa rela&ccedil;&atilde;o ainda n&atilde;o est&aacute; dispon&iacute;vel.",
  },
});

function normalizeAreaId(value) {
  const raw = String(value || "").trim().toLowerCase();
  const legacyIds = {
    geral: "general",
    general: "general",
    financas: "work-prosperity",
    finances: "work-prosperity",
    relationships: "love-relationships",
    relacionamentos: "love-relationships",
  };
  const candidate = legacyIds[raw] || raw;

  return consultationAreas.some((area) => area.id === candidate) ? candidate : "";
}

function selectedConsultationArea() {
  return consultationAreas.find((area) => area.id === state.selectedAreaId) || null;
}

function normalizeChakraId(value) {
  const raw = String(value || "").trim();
  const legacyIds = {
    "1": "root",
    "2": "sacral",
    "3": "solarPlexus",
    "4": "heart",
    "5": "throat",
    "6": "thirdEye",
    "7": "crown",
    raiz: "root",
    root: "root",
    sacral: "sacral",
    plexo: "solarPlexus",
    solar: "solarPlexus",
    solarPlexus: "solarPlexus",
    heart: "heart",
    cardiaco: "heart",
    throat: "throat",
    laringeo: "throat",
    thirdEye: "thirdEye",
    "third-eye": "thirdEye",
    crown: "crown",
    coronario: "crown",
  };
  const candidate = legacyIds[raw] || legacyIds[raw.toLowerCase()] || raw;

  return chakras.some((chakra) => chakra.id === candidate) ? candidate : "root";
}

function selectedChakra() {
  return chakras.find((chakra) => chakra.id === state.selectedChakraId) || chakras[chakras.length - 1];
}

function normalizeTextKey(value) {
  return decodeStoredText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function chakraIdFromLabel(value) {
  const text = normalizeTextKey(value);
  if (text.includes("coroa")) return "crown";
  if (text.includes("raiz")) return "root";
  if (text.includes("terceiro olho")) return "thirdEye";
  if (text.includes("sacral") || text.includes("sexual")) return "sacral";
  if (text.includes("laringeo") || text.includes("garganta")) return "throat";
  if (text.includes("plexo solar")) return "solarPlexus";
  if (text.includes("cardiaco") || text.includes("coracao")) return "heart";
  return "";
}

function chakraIdFromCoordinate(chakraCoordinate) {
  if (!chakraCoordinate) {
    return "";
  }
  return chakraIdFromLabel(chakraCoordinate.label || chakraCoordinate.name || "");
}

function chakraMethodologyPlasma(chakraId) {
  const plasmaName = chakraPlasmaNames[chakraId] || "";
  const constants = window.DriveAstralThirteenMoons
    && window.DriveAstralThirteenMoons.constants
    ? window.DriveAstralThirteenMoons.constants
    : {};
  const plasma = Array.isArray(constants.PLASMAS)
    ? constants.PLASMAS.find((item) => item.name === plasmaName)
    : null;

  return plasma || {
    name: plasmaName,
    number: "",
    observation_guidance: "",
  };
}

function chakraAreaApplication(areaId) {
  const areaKnowledge = window.DriveAstralAreaKnowledge;
  const applications = areaKnowledge && areaKnowledge.areaApplications
    ? areaKnowledge.areaApplications
    : {};
  return applications[areaId] || applications.general || null;
}

function coordinateChakraSummary(calendar) {
  const chakra = calendar && calendar.chakra ? calendar.chakra : {};
  const plasma = calendar && calendar.plasma ? calendar.plasma : {};
  return {
    chakraId: chakraIdFromCoordinate(chakra),
    chakraLabel: chakra.label || chakra.name || "",
    plasmaName: plasma.name || "",
    date: calendar && calendar.reference_date ? calendar.reference_date : "",
  };
}

function chakraConsultationSummary(chakra, areaId, areaTitle) {
  const guidance = readingGuidance(state.reading);
  const interpretation = guidance && guidance.interpretation ? guidance.interpretation : {};
  const coordinates = readingCoordinates(state.reading) || {};
  const birthCalendar = coordinates.birth && coordinates.birth.thirteen_moons
    ? coordinates.birth.thirteen_moons
    : {};
  const dayCalendar = coordinates.day && coordinates.day.thirteen_moons
    ? coordinates.day.thirteen_moons
    : {};
  const birth = coordinateChakraSummary(birthCalendar);
  const day = coordinateChakraSummary(dayCalendar);
  const plasma = chakraMethodologyPlasma(chakra.id);
  const application = chakraAreaApplication(areaId);
  const plasmaTranslation = application
    && application.plasmaTranslations
    && application.plasmaTranslations[plasma.name]
      ? application.plasmaTranslations[plasma.name]
      : plasma.observation_guidance || chakra.phrase;
  const birthMatch = birth.chakraId === chakra.id;
  const dayMatch = day.chakraId === chakra.id;
  const currentPractice = interpretation.dailyPractice || interpretation.suggestedPractice || "";
  const observationItems = [
    plasmaTranslation,
    birthMatch
      ? `No nascimento, este chakra aparece pela coordenada ${birth.plasmaName} / ${birth.chakraLabel}.`
      : "",
    dayMatch
      ? `Na data da leitura, este chakra aparece pela coordenada ${day.plasmaName} / ${day.chakraLabel}.`
      : "",
    !birthMatch && !dayMatch
      ? "Nesta consulta, ele aparece como refer&ecirc;ncia do ciclo dos sete plasmas, sem indicar estado individual."
      : "",
  ].filter(Boolean);
  const practiceItems = [
    currentPractice
      ? `Pr&aacute;tica validada da leitura: ${currentPractice}`
      : "Nenhuma pr&aacute;tica espec&iacute;fica foi calculada para esta leitura.",
    "A pr&aacute;tica vem da &aacute;rea escolhida e da semana crom&aacute;tica, n&atilde;o de um diagn&oacute;stico do chakra.",
  ];
  const matchLabels = [
    birthMatch ? "nascimento" : "",
    dayMatch ? "dia atual" : "",
  ].filter(Boolean);
  const status = matchLabels.length
    ? `Coordenada calculada: ${matchLabels.join(" e ")}`
    : "Refer&ecirc;ncia do ciclo";
  const statusDescription = matchLabels.length
    ? `Este chakra aparece nas coordenadas calculadas da sua consulta em ${decodeStoredText(areaTitle)}.`
    : "A metodologia atual n&atilde;o marcou este chakra como coordenada de nascimento ou do dia nesta consulta.";

  return {
    theme: `Plasma ${plasma.name || "n&atilde;o dispon&iacute;vel"} &bull; ${plasma.observation_guidance || chakra.phrase}`,
    status,
    statusDescription,
    stateTone: chakra.color,
    observationItems,
    practiceItems,
  };
}

function routeStateFromLocation() {
  if (!window.location || !window.location.pathname) {
    return {};
  }

  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  const readingResultMatch = pathname.match(/^\/app\/consulta\/resultado\/([^/]+)$/);
  if (readingResultMatch) {
    return {
      route: "chakras",
      requestedReadingId: decodeURIComponent(readingResultMatch[1]),
    };
  }
  const match = pathname.match(/^\/(?:app\/)?chakras\/([^/]+)$/);
  if (match) {
    let areaId = "";
    if (window.URLSearchParams) {
      areaId = normalizeAreaId(new window.URLSearchParams(window.location.search || "").get("area"));
    }

    return {
      route: "chakra-detail",
      selectedChakraId: normalizeChakraId(match[1]),
      selectedAreaId: areaId,
    };
  }

  const routes = {
    "/": "landing",
    "/login": "login",
    "/cadastro": "signup",
    "/onboarding": "onboarding",
    "/app": "dashboard",
    "/app/meu-dia": "my-day",
    "/app/consulta": "home",
    "/app/protocolo": "protocol",
    "/app/jornada": "journey",
    "/app/ciclo-energetico": "energy-cycle",
    "/app/historico": "history",
    "/app/perfil": "profile",
    "/admin": "admin-dashboard",
    "/admin/usuarios": "admin-users",
    "/admin/planos": "admin-plans",
    "/admin/configuracoes": "admin-settings",
  };

  return routes[pathname] ? { route: routes[pathname] } : {};
}

function chakraDetailUrl(chakraId, areaId) {
  const normalizedChakraId = normalizeChakraId(chakraId);
  const normalizedAreaId = normalizeAreaId(areaId);
  return `/chakras/${normalizedChakraId}${normalizedAreaId ? `?area=${encodeURIComponent(normalizedAreaId)}` : ""}`;
}

function updateLocationForState(nextState, replace = false) {
  if (!window.history || !window.location) {
    return;
  }

  const routeUrls = {
    landing: "/",
    login: "/login",
    signup: "/cadastro",
    onboarding: "/onboarding",
    dashboard: "/app",
    "my-day": "/app/meu-dia",
    home: "/app/consulta",
    chakras: "/app/consulta/resultado",
    "energy-cycle": "/app/ciclo-energetico",
    protocol: "/app/protocolo",
    journey: "/app/jornada",
    history: "/app/historico",
    "timeline-event": "/app/historico/evento",
    profile: "/app/perfil",
    "legacy-history": "/app/historico/leitura",
    "admin-dashboard": "/admin",
    "admin-users": "/admin/usuarios",
    "admin-plans": "/admin/planos",
    "admin-settings": "/admin/configuracoes",
  };
  let nextUrl = routeUrls[nextState.route] || "/";
  if (nextState.route === "chakra-detail") {
    nextUrl = `/app${chakraDetailUrl(nextState.selectedChakraId, nextState.selectedAreaId)}`;
  } else if (nextState.route === "chakras" && nextState.activeHistoryId) {
    nextUrl = `/app/consulta/resultado/${encodeURIComponent(nextState.activeHistoryId)}`;
  }

  if (`${window.location.pathname}${window.location.search || ""}` === nextUrl) {
    return;
  }

  const method = replace ? "replaceState" : "pushState";
  window.history[method]({ route: nextState.route }, "", nextUrl);
}

const defaultState = {
  route: "landing",
  account: loadLocalAccount(),
  authenticated: loadLocalSession(),
  authLoading: isSupabaseMode(),
  onboardingStep: 1,
  authNotice: "",
  authNoticeKind: "",
  name: "",
  birth: "",
  selectedAreaId: "",
  selectedChakraId: "root",
  activeHistoryId: "",
  requestedReadingId: "",
  firstReadingStatus: "pending",
  firstReadingStep: 0,
  firstReadingError: "",
  areaCarouselTouched: false,
  reading: null,
  history: [],
  historySection: "readings",
  timelineEvents: [],
  activeTimelineEventId: "",
  timelineFormOpen: false,
  timelineNotice: "",
  timelineNoticeKind: "",
  adminAccessChecked: false,
  adminLoading: false,
  adminRole: "",
  adminSettings: defaultAdminSettings(),
  adminSettingsLoaded: false,
  adminSettingsLoading: false,
  adminNotice: "",
  adminNoticeKind: "",
  adminUsers: [],
  adminUserAccessPlans: [],
  adminUsersLoaded: false,
  adminUsersLoading: false,
  adminPlans: [],
  adminPlansLoaded: false,
  adminPlansLoading: false,
  adminSaving: false,
  upgradeModalOpen: false,
  upgradeAreaId: "",
  timelineDraft: {
    title: "",
    eventDate: "",
    category: "",
    note: "",
  },
  journeySelectedDay: 0,
  notice: "",
  noticeKind: "",
};

let state = loadState();

function loadLocalAccount() {
  if (runtimeConfig().authMode === "supabase") {
    return null;
  }
  try {
    const account = JSON.parse(localStorage.getItem(ACCOUNT_KEY));
    return account && typeof account === "object" && !Array.isArray(account) ? account : null;
  } catch {
    return null;
  }
}

function loadLocalSession() {
  if (runtimeConfig().authMode === "supabase") {
    return false;
  }
  return localStorage.getItem(SESSION_KEY) === "active";
}

function saveLocalAccount(account) {
  if (runtimeConfig().authMode === "supabase") {
    return;
  }
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  localStorage.setItem(SESSION_KEY, "active");
}

function finishSignOut() {
  localStorage.removeItem(SESSION_KEY);
  state = {
    ...state,
    route: "landing",
    authenticated: false,
    authNotice: "",
    notice: "",
  };
  updateLocationForState(state);
  render();
}

function signOut() {
  if (isSupabaseMode()) {
    supabaseService().signOut().finally(finishSignOut);
    return;
  }
  finishSignOut();
}

function migratePersistedState(saved) {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
    return null;
  }

  return {
    ...saved,
    storageSchemaVersion: STORAGE_SCHEMA_VERSION,
  };
}

function normalizePersistedState(saved) {
  const migrated = migratePersistedState(saved);
  if (!migrated) {
    return null;
  }

  return {
    storageSchemaVersion: STORAGE_SCHEMA_VERSION,
    name: migrated.name || "",
    birth: migrated.birth || "",
    selectedAreaId: normalizeAreaId(
      migrated.selectedAreaId || migrated.areaId || migrated.theme,
    ),
    reading: migrated.reading || null,
    history: normalizedHistoryList(migrated.history),
    timelineEvents: normalizedTimelineEvents(migrated.timelineEvents),
  };
}

function persistedStateSnapshot(source = state) {
  return {
    storageSchemaVersion: STORAGE_SCHEMA_VERSION,
    name: source.name || "",
    birth: source.birth || "",
    selectedAreaId: normalizeAreaId(source.selectedAreaId),
    reading: source.reading || null,
    history: normalizedHistoryList(source.history),
    timelineEvents: normalizedTimelineEvents(source.timelineEvents),
  };
}

function createBackupPayload() {
  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    appVersion: WEB_PLATFORM_VERSION,
    exportedAt: new Date().toISOString(),
    data: persistedStateSnapshot(),
    account: state.account ? { ...state.account } : null,
    protocolProgress: loadProtocolProgress(),
    journeyProgress: loadJourneyProgress(),
  };
}

function parseBackupPayload(value) {
  const payload = typeof value === "string" ? JSON.parse(value) : value;
  if (
    !payload
    || typeof payload !== "object"
    || ![BACKUP_FORMAT_VERSION, LEGACY_BACKUP_FORMAT_VERSION].includes(payload.formatVersion)
  ) {
    throw new Error("BACKUP_FORMAT_INVALID");
  }

  const restored = normalizePersistedState(payload.data);
  if (!restored) {
    throw new Error("BACKUP_DATA_INVALID");
  }

  return {
    state: restored,
    account: payload.account && typeof payload.account === "object" ? payload.account : null,
    protocolProgress: payload.protocolProgress && typeof payload.protocolProgress === "object"
      ? payload.protocolProgress
      : null,
    journeyProgress: payload.journeyProgress && typeof payload.journeyProgress === "object"
      ? payload.journeyProgress
      : null,
  };
}

function downloadLocalBackup() {
  if (!window.Blob || !window.URL || !window.URL.createObjectURL) {
    setState({
      route: "profile",
      notice: "Este navegador n&atilde;o oferece suporte ao download do backup.",
    });
    return;
  }

  const payload = createBackupPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `drive-astral-backup-${todayForEngine()}.json`;
  anchor.click();
  window.URL.revokeObjectURL(url);

  setState({
    route: "profile",
    notice: "Backup criado. Guarde o arquivo em um local seguro.",
  });
}

async function restoreLocalBackup(file) {
  try {
    const restored = parseBackupPayload(await file.text());
    const confirmed = typeof window.confirm !== "function"
      || window.confirm("Importar este backup substituirá os dados locais atuais. Continuar?");
    if (!confirmed) {
      return;
    }

    state = {
      ...defaultState,
      ...restored.state,
      route: "profile",
      account: restored.account || state.account || null,
      authenticated: Boolean(restored.account || state.account),
      notice: "Backup restaurado com sucesso.",
      noticeKind: "",
    };
    saveState();
    if (restored.account) {
      saveLocalAccount(restored.account);
    }
    if (restored.protocolProgress) {
      localStorage.setItem(PROTOCOL_PROGRESS_KEY, JSON.stringify(restored.protocolProgress));
    }
    if (restored.journeyProgress) {
      localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(restored.journeyProgress));
    }
    render();
  } catch {
    setState({
      route: "profile",
      notice: "N&atilde;o foi poss&iacute;vel importar este backup.",
      noticeKind: "invalid_backup",
    });
  }
}

function loadState() {
  const routeState = routeStateFromLocation();

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const persisted = normalizePersistedState(saved);
    if (!persisted) {
      return { ...defaultState, ...routeState };
    }

    return {
      ...defaultState,
      ...persisted,
      route: "home",
      notice: "",
      noticeKind: "",
      ...routeState,
    };
  } catch {
    return { ...defaultState, ...routeState };
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(persistedStateSnapshot()),
  );
}

function setState(next, options = {}) {
  state = { ...state, ...next };
  if (options.updateUrl) {
    updateLocationForState(state, options.replaceUrl);
  }
  if (options.persist) {
    saveState();
  }
  render();
}

function icon(name) {
  if (name === "sparkles") {
    return icons.spark;
  }

  return icons[name] || "";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function decodeStoredText(value) {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " ",
    aacute: "\u00e1",
    Aacute: "\u00c1",
    eacute: "\u00e9",
    Eacute: "\u00c9",
    iacute: "\u00ed",
    Iacute: "\u00cd",
    oacute: "\u00f3",
    Oacute: "\u00d3",
    uacute: "\u00fa",
    Uacute: "\u00da",
    agrave: "\u00e0",
    Agrave: "\u00c0",
    acirc: "\u00e2",
    Acirc: "\u00c2",
    ecirc: "\u00ea",
    Ecirc: "\u00ca",
    ocirc: "\u00f4",
    Ocirc: "\u00d4",
    atilde: "\u00e3",
    Atilde: "\u00c3",
    otilde: "\u00f5",
    Otilde: "\u00d5",
    ccedil: "\u00e7",
    Ccedil: "\u00c7",
    ordm: "\u00ba",
  };
  let decoded = String(value || "");

  for (let step = 0; step < 3; step += 1) {
    const next = decoded.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]+);/gi, (match, entity) => {
      if (entity[0] === "#") {
        const base = entity[1] && entity[1].toLowerCase() === "x" ? 16 : 10;
        const rawCode = base === 16 ? entity.slice(2) : entity.slice(1);
        const codePoint = Number.parseInt(rawCode, base);
        return Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
          ? String.fromCodePoint(codePoint)
          : match;
      }

      return Object.prototype.hasOwnProperty.call(entities, entity) ? entities[entity] : match;
    });

    if (next === decoded) {
      break;
    }
    decoded = next;
  }

  return decoded;
}

function readableText(value) {
  return escapeHtml(decodeStoredText(value));
}

function todayForEngine() {
  if (window.DriveAstralSincronario && window.DriveAstralSincronario.formatDateOnly) {
    return window.DriveAstralSincronario.formatDateOnly(new Date());
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function validateBirthDateForProduct(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) {
    return { status: "invalid" };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const leapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    return { status: "invalid" };
  }

  if (month === 2 && day === 29) {
    return { status: "pending_method_decision" };
  }

  return { status: "valid" };
}

function calculateReading(birthDate, focusArea) {
  if (
    !window.DriveAstralSincronario
    || validateBirthDateForProduct(birthDate).status !== "valid"
  ) {
    return null;
  }

  let reading = window.DriveAstralSincronario.calculate({
    birthDate,
    currentDate: todayForEngine(),
    timezone: "date-only",
  });

  if (window.DriveAstralCoordinates && window.DriveAstralCoordinates.enrichReading) {
    reading = window.DriveAstralCoordinates.enrichReading(reading);
  }

  if (window.DriveAstralKnowledge && window.DriveAstralKnowledge.enrichReading) {
    return window.DriveAstralKnowledge.enrichReading(reading, { focusArea });
  }

  return reading;
}

function personalSignature(reading) {
  return reading && reading.personal_map && reading.personal_map.signature
    ? reading.personal_map.signature.value
    : null;
}

function personalKin(reading) {
  return reading && reading.personal_map && reading.personal_map.kin
    ? reading.personal_map.kin.value
    : null;
}

function oracleItems(reading) {
  const oracle = reading && reading.personal_map ? reading.personal_map.oracle : null;
  if (!oracle || oracle.status !== "calculado") {
    return [];
  }

  return [
    ["Destino", oracle.destiny],
    ["Guia", oracle.guide],
    ["An&aacute;logo", oracle.analog],
    ["Ant&iacute;poda", oracle.antipode],
    ["Oculto", oracle.occult],
  ].filter((item) => item[1]);
}

function readingGuidance(reading) {
  const guidance = reading && reading.guidance;
  if (!guidance || guidance.status !== "derivado") {
    return null;
  }

  if (guidance.interpretation) {
    return guidance;
  }

  const legacySynthesis = [
    guidance.personal && guidance.personal.potential,
    guidance.daily && guidance.daily.focus,
    guidance.daily && guidance.daily.relationship && guidance.daily.relationship.summary,
  ].filter(Boolean).join("\n\n");

  if (!legacySynthesis) {
    return null;
  }

  return {
    ...guidance,
    interpretation: {
      areaId: guidance.focus_area && (guidance.focus_area.id || guidance.focus_area.key)
        ? guidance.focus_area.id || guidance.focus_area.key
        : "general",
      areaTitle: guidance.focus_area && (guidance.focus_area.title || guidance.focus_area.label)
        ? guidance.focus_area.title || guidance.focus_area.label
        : "Visão Geral",
      contentVersion: reading && reading.knowledge_base && reading.knowledge_base.version
        ? reading.knowledge_base.version
        : "anterior",
      synthesis: legacySynthesis,
      reflectionQuestion:
        guidance.daily && guidance.daily.relationship && guidance.daily.relationship.question
          ? guidance.daily.relationship.question
          : guidance.daily && guidance.daily.question
            ? guidance.daily.question
            : guidance.personal && guidance.personal.question
              ? guidance.personal.question
              : "",
      suggestedPractice: guidance.daily && guidance.daily.practice
        ? guidance.daily.practice
        : guidance.personal && guidance.personal.practice
          ? guidance.personal.practice
          : "",
      contentFallbackUsed: false,
    },
  };
}

function dailyMap(reading) {
  return reading && reading.daily ? reading.daily : null;
}

function readingCoordinates(reading) {
  if (reading && reading.coordinates) {
    return reading.coordinates;
  }

  if (!reading || !window.DriveAstralCoordinates || !window.DriveAstralCoordinates.calculateCoordinates) {
    return null;
  }

  const birthDate = reading.input && reading.input.birth_date
    ? reading.input.birth_date.value
    : null;
  const currentDate = reading.input && reading.input.current_date
    ? reading.input.current_date.value
    : null;
  const personalMap = reading.personal_map || {};
  const daily = reading.daily || {};

  return window.DriveAstralCoordinates.calculateCoordinates({
    birthDate,
    currentDate,
    personalKin: personalMap.kin ? personalMap.kin.value : null,
    dayKin: daily.kin_of_day ? daily.kin_of_day.value : null,
  });
}

function createReadingId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `reading-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneSnapshot(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function parseDateOnly(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function formatDatePtBr(value) {
  const parsed = parseDateOnly(value);
  if (!parsed) {
    return String(value || "");
  }

  return `${String(parsed.day).padStart(2, "0")}/${String(parsed.month).padStart(2, "0")}/${parsed.year}`;
}

function formatDateTimePtBr(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return formatDatePtBr(value);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatReadingCreatedAtLong(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return "Data da consulta indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function shortHistorySummary(text) {
  const clean = decodeStoredText(text).replace(/\s+/g, " ").trim();
  if (clean.length <= 124) {
    return clean;
  }

  return `${clean.slice(0, 121).trim()}...`;
}

function completePresentationText(text, maximumLength) {
  const clean = decodeStoredText(text).replace(/\s+/g, " ").trim();
  if (!clean || /(?:\.\.\.|…)/.test(clean)) {
    return "";
  }

  const sentences = clean.match(/[^.!?]+(?:[.!?]+|$)/g) || [];
  let selected = "";
  for (const sentence of sentences) {
    const normalized = sentence.trim();
    if (!normalized) continue;
    const candidate = selected ? `${selected} ${normalized}` : normalized;
    if (candidate.length > maximumLength) break;
    selected = candidate;
  }
  return selected;
}

function relationshipExplanation(relationship) {
  if (!relationship || !relationship.value) {
    return RELATIONSHIP_EXPLANATIONS.cycle_distance;
  }

  return RELATIONSHIP_EXPLANATIONS[relationship.value] || RELATIONSHIP_EXPLANATIONS.cycle_distance;
}

function relationshipTitle(relationship) {
  if (!relationship || !relationship.value) {
    return "Rela&ccedil;&atilde;o derivada";
  }

  if (relationship.value === "same_color") {
    return "Mesma cor";
  }

  return relationship.label || "Rela&ccedil;&atilde;o derivada";
}

function relationshipMeaningBlocks(reading) {
  const daily = dailyMap(reading);
  const relationship = daily && daily.relationship_to_personal_kin ? daily.relationship_to_personal_kin : null;
  const distance = relationship && relationship.deltas ? relationship.deltas.kin_forward : null;
  const blocks = [];

  if (relationship && relationship.value === "same_color") {
    blocks.push({
      title: "Mesma cor",
      math: "Seu Kin pessoal e o Kin do dia compartilham a mesma cor dentro da sequ&ecirc;ncia crom&aacute;tica do Sincron&aacute;rio.",
      symbolic: "A leitura registra uma repeti&ccedil;&atilde;o de cor no ciclo e usa esse dado apenas como ponto de observa&ccedil;&atilde;o simb&oacute;lica revisada.",
    });
  } else if (relationship && relationship.value) {
    const explanation = relationshipExplanation(relationship);
    blocks.push({
      title: relationshipTitle(relationship),
      math: explanation.math,
      symbolic: explanation.symbolic,
    });
  }

  if (distance !== null && distance !== undefined) {
    blocks.push({
      title: "Dist&acirc;ncia entre os Kins",
      math: `Existe um intervalo de ${Number(distance)} posi&ccedil;&otilde;es entre seu Kin pessoal e o Kin do dia dentro da sequ&ecirc;ncia de 260 Kins.`,
      symbolic: "Esta dist&acirc;ncia &eacute; atualmente exibida apenas como uma rela&ccedil;&atilde;o matem&aacute;tica. O Drive Mental ainda n&atilde;o atribui um significado simb&oacute;lico validado a esse intervalo.",
    });
  }

  return blocks.length
    ? blocks
    : [{
        title: "Rela&ccedil;&atilde;o derivada",
        math: RELATIONSHIP_EXPLANATIONS.cycle_distance.math,
        symbolic: RELATIONSHIP_EXPLANATIONS.cycle_distance.symbolic,
      }];
}

function createReadingHistoryEntry({ name, birth, area, reading, readingId, readingType = "consultation" }) {
  const guidance = readingGuidance(reading);
  const interpretation = guidance && guidance.interpretation ? guidance.interpretation : null;
  const personalMap = reading && reading.personal_map ? reading.personal_map : {};
  const daily = dailyMap(reading) || {};
  const relationship = daily.relationship_to_personal_kin || {};
  const createdAt = new Date().toISOString();
  const summary = shortHistorySummary(
    interpretation ? interpretation.synthesis : personalSignature(reading),
  );

  return {
    readingId: readingId || createReadingId(),
    readingType,
    readingStatus: "completed",
    schemaVersion: "history-snapshot-v2",
    createdAt,
    date: formatDateTimePtBr(createdAt),
    areaId: area.id,
    areaTitle: area.title,
    summary,
    kin: personalKin(reading),
    signature: personalSignature(reading),
    inputSnapshot: {
      name,
      birthDate: birth,
      selectedAreaId: area.id,
      selectedAreaTitle: area.title,
    },
    calculationSnapshot: {
      personalKin: personalMap.kin || null,
      personalSignature: personalMap.signature || null,
      personalSeal: personalMap.seal || null,
      personalTone: personalMap.tone || null,
      earthFamily: personalMap.earth_family || null,
      dayKin: {
        date: reading && reading.input && reading.input.current_date ? reading.input.current_date.value : "",
        kin: daily.kin_of_day || null,
        signature: daily.signature || null,
        seal: daily.seal || null,
        tone: daily.tone || null,
      },
      derivedRelations: relationship,
      coordinates: readingCoordinates(reading),
    },
    engineVersion: reading && reading.engine ? reading.engine.version : "",
    contentVersion: interpretation ? interpretation.contentVersion : "",
    interpretationSnapshot: interpretation
      ? {
          areaId: interpretation.areaId,
          areaTitle: interpretation.areaTitle,
          contentVersion: interpretation.contentVersion,
          synthesis: interpretation.synthesis,
          reflectionQuestion: interpretation.reflectionQuestion,
          suggestedPractice: interpretation.suggestedPractice,
          applicationSummary: interpretation.applicationSummary || interpretation.synthesis,
          dailyPractice: interpretation.dailyPractice || interpretation.suggestedPractice,
          coordinatesUsed: interpretation.coordinatesUsed || null,
          contentFallbackUsed: interpretation.contentFallbackUsed,
        }
      : null,
    readingSnapshot: cloneSnapshot(reading),
  };
}

function normalizeHistoryEntry(entry, index = 0) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  if (
    entry.readingId
    && ["history-snapshot-v1", "history-snapshot-v2"].includes(entry.schemaVersion)
  ) {
    return entry;
  }

  const legacyReading = entry.readingSnapshot || entry.reading || null;
  const legacyKin = entry.kin || personalKin(legacyReading);
  const legacySignature = entry.signature || personalSignature(legacyReading);
  const legacyCreatedAt = entry.createdAt || "";

  return {
    ...entry,
    readingId: entry.readingId || `legacy-${legacyCreatedAt || entry.date || "sem-data"}-${index}`,
    schemaVersion: entry.schemaVersion || "legacy",
    legacy: true,
    createdAt: legacyCreatedAt,
    date: entry.date || (legacyCreatedAt ? formatDateTimePtBr(legacyCreatedAt) : "Data anterior"),
    areaId: normalizeAreaId(entry.areaId || entry.selectedAreaId) || "",
    areaTitle: entry.areaTitle || entry.theme || "Leitura Astral",
    summary: entry.summary || "Leitura criada em vers&atilde;o anterior.",
    kin: legacyKin || "",
    signature: legacySignature || "",
    readingSnapshot: legacyReading,
    contentVersion: entry.contentVersion || "anterior",
  };
}

function normalizedHistoryList(history) {
  return Array.isArray(history)
    ? history.map(normalizeHistoryEntry).filter(Boolean)
    : [];
}

function historyEntryById(readingId) {
  return state.history.find((item) => item.readingId === readingId) || null;
}

function normalizePlanId(value) {
  return String(value || "").trim().toLowerCase();
}

function paidPlanIds() {
  return ["premium", "mentor", "monthly", "guided", "drive", "drive-astral", "jornada-guiada"];
}

function isPaidPlanId(planId) {
  return paidPlanIds().includes(normalizePlanId(planId));
}

function isActiveAccessPlan(access) {
  if (!access || !isPaidPlanId(access.plan_id || access.planId)) {
    return false;
  }
  const status = String(access.status || "active").toLowerCase();
  if (!["active", "courtesy"].includes(status)) {
    return false;
  }
  if (!access.expires_at && !access.expiresAt) {
    return true;
  }
  const expiresAt = Date.parse(access.expires_at || access.expiresAt);
  return Number.isNaN(expiresAt) || expiresAt > Date.now();
}

function hasPremiumAccess() {
  if (isAdminProfile()) {
    return true;
  }
  const account = state.account || {};
  if (account.accessMode === "local-demo") {
    return true;
  }
  if (isPaidPlanId(account.planId)) {
    return true;
  }
  return Array.isArray(account.accessPlans)
    && account.accessPlans.some(isActiveAccessPlan);
}

function currentPlanId() {
  if (isAdminProfile()) {
    return "admin";
  }
  const account = state.account || {};
  if (account.accessMode === "local-demo") {
    return "mentor";
  }
  if (isPaidPlanId(account.planId)) {
    return normalizePlanId(account.planId);
  }
  if (Array.isArray(account.accessPlans)) {
    const activePlan = account.accessPlans.find(isActiveAccessPlan);
    if (activePlan) {
      return normalizePlanId(activePlan.plan_id || activePlan.planId);
    }
  }
  return "free";
}

function currentPlanBadge() {
  const planId = currentPlanId();
  const labels = {
    admin: "ADMIN",
    mentor: "MENTOR",
    guided: "MENTOR",
    "jornada-guiada": "MENTOR",
    premium: "PREMIUM",
    monthly: "PREMIUM",
    drive: "PREMIUM",
    "drive-astral": "PREMIUM",
    free: "FREE",
  };
  return labels[planId] || planId.toUpperCase();
}

function firstConsultedAreaId() {
  const history = normalizedHistoryList(state.history);
  const firstEntry = history[history.length - 1] || history[0] || null;
  const historyArea = firstEntry ? normalizeAreaId(firstEntry.areaId) : "";
  if (historyArea) {
    return historyArea;
  }

  return "";
}

function freeAllowedConsultationAreaId() {
  const firstHistoryArea = firstConsultedAreaId();
  if (firstHistoryArea) {
    return firstHistoryArea;
  }

  const accountArea = normalizeAreaId(state.account && state.account.primaryAreaId);
  if (accountArea) {
    return accountArea;
  }

  const guidance = readingGuidance(state.reading);
  const interpretationArea = guidance && guidance.interpretation
    ? normalizeAreaId(guidance.interpretation.areaId)
    : "";
  return interpretationArea || "";
}

function freeConsultationUsed() {
  return !hasPremiumAccess() && normalizedHistoryList(state.history).length > 0;
}

function canStartConsultationForArea(areaId) {
  if (hasPremiumAccess()) {
    return true;
  }
  const normalizedAreaId = normalizeAreaId(areaId);
  const allowedAreaId = freeAllowedConsultationAreaId();
  if (allowedAreaId) {
    return normalizedAreaId === allowedAreaId;
  }
  return normalizedHistoryList(state.history).length === 0 && Boolean(normalizedAreaId);
}

function normalizedTimelineEvents(events) {
  if (!window.DriveAstralCosmicTimeline) {
    return [];
  }

  return window.DriveAstralCosmicTimeline.normalizeEvents(events);
}

function timelineEventById(eventId) {
  return normalizedTimelineEvents(state.timelineEvents)
    .find((event) => event.eventId === eventId) || null;
}

function currentPersonalKin() {
  if (
    state.birth
    && validateBirthDateForProduct(state.birth).status === "valid"
    && window.DriveAstralSincronario
  ) {
    const result = window.DriveAstralSincronario.calculateKinForDate(state.birth);
    const birthKin = result && result.kin ? result.kin.value : null;
    if (birthKin) {
      return birthKin;
    }
  }

  return personalKin(state.reading);
}

function submitTimelineEvent({ title, eventDate, category, note }) {
  const draft = {
    title: String(title || "").trim(),
    eventDate: String(eventDate || "").trim(),
    category: String(category || "").trim(),
    note: String(note || "").trim(),
  };

  if (!draft.title || !draft.eventDate || !draft.category) {
    setState({
      historySection: "timeline",
      timelineFormOpen: true,
      timelineDraft: draft,
      timelineNotice: "Preencha nome, data e categoria do evento.",
      timelineNoticeKind: "missing_input",
    });
    return null;
  }

  const validation = window.DriveAstralCosmicTimeline.validateEventDate(draft.eventDate);
  if (validation.status === "invalid") {
    setState({
      historySection: "timeline",
      timelineFormOpen: true,
      timelineDraft: draft,
      timelineNotice: "Informe uma data v&aacute;lida.",
      timelineNoticeKind: "invalid_date",
    });
    return null;
  }

  if (validation.status === "pending_method_decision") {
    setState({
      historySection: "timeline",
      timelineFormOpen: true,
      timelineDraft: draft,
      timelineNotice: "29 de fevereiro possui regra especial e ainda n&atilde;o est&aacute; dispon&iacute;vel nesta vers&atilde;o.",
      timelineNoticeKind: "pending_method_decision",
    });
    return null;
  }

  const result = window.DriveAstralCosmicTimeline.createEvent({
    ...draft,
    personalKin: currentPersonalKin(),
  });

  if (!result || result.status !== "created" || !result.event) {
    setState({
      historySection: "timeline",
      timelineFormOpen: true,
      timelineDraft: draft,
      timelineNotice: "Informe uma data v&aacute;lida.",
      timelineNoticeKind: "invalid_date",
    });
    return null;
  }

  const nextEvents = normalizedTimelineEvents([result.event, ...state.timelineEvents]);
  setState({
    historySection: "timeline",
    timelineEvents: nextEvents,
    activeTimelineEventId: result.event.eventId,
    timelineFormOpen: false,
    timelineDraft: {
      title: "",
      eventDate: "",
      category: "",
      note: "",
    },
    timelineNotice: "",
    timelineNoticeKind: "",
  }, { persist: true });

  if (isSupabaseMode()) {
    supabaseService().saveTimelineEvent(result.event).catch(() => {
      // Keep the local event and retry cloud synchronization later.
    });
  }

  return result.event;
}

function readingForHistoryEntry(entry) {
  const reading = cloneSnapshot(entry && entry.readingSnapshot);
  const interpretation = entry && entry.interpretationSnapshot;

  if (!reading || !interpretation || !interpretation.synthesis) {
    return reading;
  }

  reading.guidance = {
    ...(reading.guidance || {}),
    status: "derivado",
    interpretation: cloneSnapshot(interpretation),
    focus_area: {
      key: interpretation.areaId,
      id: interpretation.areaId,
      label: interpretation.areaTitle,
      title: interpretation.areaTitle,
      contentFallbackUsed: interpretation.contentFallbackUsed,
    },
  };

  if (reading.knowledge_base) {
    reading.knowledge_base.content_version = interpretation.contentVersion;
  }

  return reading;
}

function ReadingSummaryCard(reading) {
  const kin = personalKin(reading);
  const signature = personalSignature(reading);
  const personalMap = reading && reading.personal_map ? reading.personal_map : null;
  const seal = personalMap && personalMap.seal ? personalMap.seal : null;
  const tone = personalMap && personalMap.tone ? personalMap.tone : null;
  const earthFamily = personalMap && personalMap.earth_family ? personalMap.earth_family : null;
  const birthDate = reading && reading.input && reading.input.birth_date ? reading.input.birth_date.value : "";

  if (!kin) {
    return GoldenCard(`
      <h2 class="settings-title">Resultado Calculado</h2>
      <p class="transparency-note">Esta data n&atilde;o gerou um Kin regular. Verifique a data ou use uma data fora de 29/02.</p>
    `, "result-card");
  }

  return GoldenCard(`
    <h2 class="settings-title">Resultado Calculado</h2>
    <div class="result-hero">
      <span>Kin pessoal</span>
      <strong>${kin}</strong>
      <p>${escapeHtml(signature)}</p>
    </div>
    <p class="date-context">Calculado a partir de: ${escapeHtml(formatDatePtBr(birthDate))}</p>
    <div class="reading-grid reading-grid-expanded">
      <div><span>Selo</span><strong>${seal ? escapeHtml(seal.name) : "N&atilde;o dispon&iacute;vel"}</strong></div>
      <div><span>Tom</span><strong>${tone ? escapeHtml(tone.name) : "N&atilde;o dispon&iacute;vel"}</strong></div>
      <div><span>Fam&iacute;lia</span><strong>${earthFamily && earthFamily.value ? escapeHtml(earthFamily.value) : "N&atilde;o dispon&iacute;vel"}</strong></div>
    </div>
    <p class="transparency-note">Fam&iacute;lia Terrestre possui valida&ccedil;&atilde;o externa separada e n&atilde;o integra a aprova&ccedil;&atilde;o parcial dos campos b&aacute;sicos.</p>
  `, "result-card");
}

function DerivedRelationsCard(reading) {
  const daily = dailyMap(reading);
  const dailyKin = daily && daily.kin_of_day ? daily.kin_of_day.value : null;
  const dailySignature = daily && daily.signature ? daily.signature.value : null;
  const relationship = daily && daily.relationship_to_personal_kin ? daily.relationship_to_personal_kin : null;
  const relationshipLabel = relationship && relationship.label ? relationship.label : "N&atilde;o dispon&iacute;vel";
  const relationshipDistance = relationship && relationship.deltas ? relationship.deltas.kin_forward : null;
  const dayDate = reading && reading.input && reading.input.current_date ? reading.input.current_date.value : "";

  return GoldenCard(`
    <h2 class="settings-title">Rela&ccedil;&otilde;es Derivadas</h2>
    <p class="date-context">Energia do dia referente a: ${escapeHtml(formatDatePtBr(dayDate))}</p>
    <div class="reading-grid reading-grid-expanded">
      <div><span>Kin do dia</span><strong>${dailyKin || "N&atilde;o dispon&iacute;vel"}</strong></div>
      <div><span>Assinatura do dia</span><strong>${dailySignature ? escapeHtml(dailySignature) : "N&atilde;o dispon&iacute;vel"}</strong></div>
      <div><span>Rela&ccedil;&atilde;o</span><strong>${escapeHtml(relationshipLabel)}</strong></div>
      <div><span>Dist&acirc;ncia</span><strong>${relationshipDistance !== null ? `${relationshipDistance} Kin` : "N&atilde;o dispon&iacute;vel"}</strong></div>
    </div>
    <p class="reading-signature">Rela&ccedil;&otilde;es derivadas a partir do Kin pessoal e do Kin do dia. N&atilde;o s&atilde;o diagn&oacute;stico nem interpreta&ccedil;&atilde;o psicol&oacute;gica.</p>
  `, "derived-card");
}

function RelationshipMeaningCard(reading) {
  const blocks = relationshipMeaningBlocks(reading);

  return GoldenCard(`
    <h2 class="settings-title">O que esta rela&ccedil;&atilde;o representa</h2>
    <div class="relationship-meaning relationship-blocks">
      ${blocks
        .map(
          (block) => `
            <section class="relationship-topic">
              <h3>${escapeHtml(decodeStoredText(block.title))}</h3>
              <div>
                <span>Significado matem&aacute;tico</span>
                <p>${block.math}</p>
              </div>
              <div>
                <span>Interpreta&ccedil;&atilde;o</span>
                <p>${block.symbolic}</p>
              </div>
            </section>
          `,
        )
        .join("")}
      <p class="transparency-note">Esta interpreta&ccedil;&atilde;o n&atilde;o &eacute; diagn&oacute;stico psicol&oacute;gico nem previs&atilde;o.</p>
    </div>
  `, "relationship-card");
}

function InterpretiveSynthesisCard(guidance) {
  const interpretation = guidance.interpretation;

  return GoldenCard(`
    <h2 class="settings-title">S&iacute;ntese Interpretativa</h2>
    <p class="guidance-context">${escapeHtml(interpretation.areaTitle)}</p>
    <div class="synthesis-copy">
      ${interpretation.synthesis
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join("")}
    </div>
  `, "guidance-card synthesis-card");
}

function ReflectionQuestionCard(guidance) {
  return GoldenCard(`
    <h2 class="settings-title">Pergunta para reflex&atilde;o</h2>
    <p class="reflection-question">${escapeHtml(guidance.interpretation.reflectionQuestion)}</p>
  `, "reflection-card");
}

function SuggestedPracticeCard(guidance) {
  return GoldenCard(`
    <h2 class="settings-title">Pr&aacute;tica sugerida</h2>
    <p class="reflection-question">${escapeHtml(guidance.interpretation.suggestedPractice)}</p>
  `, "practice-card");
}

function CoordinateGrid(items) {
  return `
    <div class="coordinate-grid">
      ${items
        .map(
          ([label, value, accent = "", help = ""]) => `
            <div class="coordinate-item ${accent}">
              <span class="coordinate-label">
                ${label}
                ${help ? `<small>${help}</small>` : ""}
              </span>
              <strong>${escapeHtml(String(value || "Não disponível"))}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function ExpandableCoordinateCard({
  number,
  title,
  subtitle,
  content,
  className = "",
}) {
  return GoldenCard(`
    <details class="coordinate-details">
      <summary>
        <span class="coordinate-step">${number}</span>
        <span class="coordinate-summary-copy">
          <strong>${title}</strong>
          <small>${subtitle}</small>
        </span>
        <span class="coordinate-summary-toggle" aria-hidden="true">${icon("arrow")}</span>
      </summary>
      <div class="coordinate-details-content">
        ${content}
      </div>
    </details>
  `, `coordinate-card expandable-coordinate-card ${className}`);
}

const essentialDirectionCopy = Object.freeze({
  general: {
    headline: "Observe o momento antes de tentar resolver tudo.",
    direction: "Escolha o ponto que mais pede aten&ccedil;&atilde;o e avance com um passo simples.",
    mantra: "Eu acolho o presente e escolho um passo de cada vez.",
  },
  purpose: {
    headline: "Escolha o que tem sentido para voc&ecirc;.",
    direction: "Aproxime sua energia do que expressa seus valores, talentos e verdade pessoal.",
    mantra: "Eu avan&ccedil;o na dire&ccedil;&atilde;o do que tem verdade e prop&oacute;sito para mim.",
  },
  "work-prosperity": {
    headline: "Organize antes de expandir.",
    direction: "Coloque ordem no que j&aacute; existe e escolha uma prioridade antes de buscar crescimento.",
    mantra: "Eu transformo clareza em a&ccedil;&atilde;o e const&acirc;ncia em resultado.",
  },
  "love-relationships": {
    headline: "Escute antes de reagir.",
    direction: "Traga verdade, presen&ccedil;a e limites claros para a rela&ccedil;&atilde;o que pede aten&ccedil;&atilde;o.",
    mantra: "Eu me relaciono com verdade, presen&ccedil;a e respeito pelos meus limites.",
  },
  "challenges-blocks": {
    headline: "Interrompa o padr&atilde;o com um gesto novo.",
    direction: "Reconhe&ccedil;a o que se repete e escolha uma resposta diferente, mesmo que pequena.",
    mantra: "Eu reconhe&ccedil;o o que se repete e escolho responder de outra forma.",
  },
  "energy-spirituality": {
    headline: "Reduza o ru&iacute;do e volte ao centro.",
    direction: "Crie alguns minutos de sil&ecirc;ncio para perceber o que merece ser sustentado hoje.",
    mantra: "Eu respiro, silencio a pressa e sustento o que tem sentido.",
  },
  "decisions-cycles": {
    headline: "Clareza antes do pr&oacute;ximo movimento.",
    direction: "Considere os impactos, escute o que ainda falta e decida sem agir pela pressa.",
    mantra: "Eu escuto, avalio e escolho com clareza.",
  },
});

function firstReadingPresentation(interpretation) {
  const source = interpretation || {};
  const editorial = essentialDirectionCopy[source.areaId] || essentialDirectionCopy.general;
  const editorialTitle = decodeStoredText(editorial.headline);
  const editorialSummary = decodeStoredText(editorial.direction);
  const editorialAlignment = decodeStoredText(editorial.mantra);
  const heroTitle = completePresentationText(source.synthesis, 90) || editorialTitle;
  const savedSummary = completePresentationText(source.applicationSummary || source.synthesis, 240);
  const savedAlignment = completePresentationText(source.synthesis, 120);

  return {
    heroTitle,
    heroSummary: savedSummary && savedSummary !== heroTitle ? savedSummary : editorialSummary,
    alignmentPhraseShort: savedAlignment && savedAlignment !== heroTitle
      ? savedAlignment
      : editorialAlignment,
    actionShort: completePresentationText(source.dailyPractice || source.suggestedPractice, 145)
      || "Escolha uma ação simples e possível para hoje.",
    questionShort: completePresentationText(source.reflectionQuestion, 140)
      || "O que merece sua atenção agora?",
  };
}

function EssentialDirectionCard(reading, guidance) {
  const interpretation = guidance && guidance.interpretation;
  if (!interpretation) {
    return GpsTodaySummaryCard(reading, guidance);
  }

  const coordinates = readingCoordinates(reading);
  const synchronization = coordinates ? coordinates.synchronization : {};
  const copy = essentialDirectionCopy[interpretation.areaId] || essentialDirectionCopy.general;
  const action = interpretation.dailyPractice || interpretation.suggestedPractice;

  return GoldenCard(`
    <div class="essential-direction-heading">
      <span class="essential-direction-icon">${icon("compass")}</span>
      <div>
        <span class="essential-eyebrow">Sua resposta essencial</span>
        <h2>${copy.headline}</h2>
        <p>${copy.direction}</p>
      </div>
    </div>

    <div class="essential-guidance-grid">
      <article class="essential-guidance-item is-mantra">
        <span>${icon("spark")} Frase de alinhamento</span>
        <strong>&ldquo;${copy.mantra}&rdquo;</strong>
      </article>
      <article class="essential-guidance-item is-action">
        <span>${icon("target")} A&ccedil;&atilde;o de hoje</span>
        <strong>${escapeHtml(action || "Escolha uma a&ccedil;&atilde;o simples e conclua antes de iniciar outra.")}</strong>
      </article>
      <article class="essential-guidance-item is-question">
        <span>${icon("compass")} Pergunta para confirmar</span>
        <strong>${escapeHtml(interpretation.reflectionQuestion)}</strong>
      </article>
    </div>

    <div class="essential-direction-footer">
      <div>
        <span>&Aacute;rea escolhida</span>
        <strong>${escapeHtml(interpretation.areaTitle)}</strong>
      </div>
      ${synchronization && synchronization.synchronizedKin
        ? `<div><span>Coordenada de hoje</span><strong>Kin ${synchronization.synchronizedKin}</strong></div>`
        : ""}
      <button class="button-primary" data-route="protocol" type="button">${icon("protocol")} Abrir protocolo di&aacute;rio</button>
    </div>
  `, "essential-direction-card");
}

function GpsTodaySummaryCard(reading, guidance) {
  const personal = reading && reading.personal_map ? reading.personal_map : {};
  const daily = dailyMap(reading) || {};
  const coordinates = readingCoordinates(reading);
  const birth = coordinates && coordinates.birth ? coordinates.birth : {};
  const day = coordinates && coordinates.day ? coordinates.day : {};
  const synchronization = coordinates ? coordinates.synchronization : {};
  const birthCalendar = birth.thirteen_moons || {};
  const dayCalendar = day.thirteen_moons || {};
  const birthMoon = birthCalendar.moon || {};
  const birthPlasma = birthCalendar.plasma || {};
  const birthChakra = birthCalendar.chakra || {};
  const dayPlasma = dayCalendar.plasma || {};
  const dayChakra = dayCalendar.chakra || {};
  const personalKinValue = personal.kin ? personal.kin.value : "—";
  const dayKinValue = daily.kin_of_day ? daily.kin_of_day.value : "—";
  const personalSignatureValue = personal.signature ? personal.signature.value : "Assinatura não disponível";
  const dailySignatureValue = daily.signature ? daily.signature.value : "Assinatura do dia não disponível";
  const areaTitle = guidance && guidance.interpretation
    ? guidance.interpretation.areaTitle
    : "Visão Geral";

  return GoldenCard(`
    <div class="gps-summary-heading">
      <span>${icon("compass")}</span>
      <div>
        <h2>Resumo do GPS de Hoje</h2>
        <p>Quem voc&ecirc; &eacute; no ciclo, onde est&aacute; hoje e qual coordenada orienta sua navega&ccedil;&atilde;o.</p>
      </div>
    </div>
    <div class="gps-summary-grid">
      <section class="gps-summary-panel">
        <span>Voc&ecirc; no Sincron&aacute;rio</span>
        <div class="gps-kin-line">
          <strong>Kin ${personalKinValue}</strong>
          <p>${escapeHtml(personalSignatureValue)}</p>
        </div>
        <small>${escapeHtml(birthMoon.name || "Lua não disponível")}, Dia ${birthCalendar.moon_day || "—"}</small>
        <small>${escapeHtml(birthPlasma.name || "Plasma não disponível")} / ${escapeHtml(birthChakra.label || birthChakra.name || "Chakra não disponível")}</small>
      </section>
      <section class="gps-summary-panel today">
        <span>Seu ponto de hoje</span>
        <div class="gps-kin-line">
          <strong>Kin ${dayKinValue}</strong>
          <p>${escapeHtml(dailySignatureValue)}</p>
        </div>
        <small>${escapeHtml(dayPlasma.name || "Plasma não disponível")} / ${escapeHtml(dayChakra.label || dayChakra.name || "Chakra não disponível")}</small>
      </section>
    </div>
    <div class="gps-navigation-highlight">
      <span>Kin de navega&ccedil;&atilde;o de hoje</span>
      <strong>${synchronization.synchronizedKin || "—"}</strong>
      <small>Resultado da sincroniza&ccedil;&atilde;o entre seu Kin pessoal e o Kin do dia.</small>
    </div>
    <div class="gps-area-chip">
      <span>Aplica&ccedil;&atilde;o</span>
      <strong>${escapeHtml(areaTitle)}</strong>
    </div>
  `, "coordinate-card gps-summary-card");
}

function BirthCoordinatesCard(reading) {
  const personal = reading && reading.personal_map ? reading.personal_map : {};
  const coordinates = readingCoordinates(reading);
  const birth = coordinates && coordinates.birth ? coordinates.birth : {};
  const calendar = birth.thirteen_moons || {};
  const wave = birth.wavespell || {};
  const moon = calendar.moon || {};
  const week = calendar.chromatic_week || {};
  const plasma = calendar.plasma || {};
  const chakra = calendar.chakra || {};
  const seal = personal.seal || {};
  const tone = personal.tone || {};
  const signature = personal.signature ? personal.signature.value : "";
  const kin = personal.kin ? personal.kin.value : null;

  return ExpandableCoordinateCard({
    number: "3",
    title: "Suas Coordenadas de Nascimento",
    subtitle: `${formatDatePtBr(birth.date)} · toque para ver os detalhes`,
    className: "birth-coordinate-card",
    content: `
    <div class="coordinate-hero">
      <span>Kin pessoal</span>
      <strong>${kin || "—"}</strong>
      <p>${escapeHtml(signature || "Assinatura n&atilde;o dispon&iacute;vel")}</p>
    </div>
    ${CoordinateGrid([
      ["Selo", seal.name],
      ["Tom", tone.name],
      ["Cor", seal.color],
      ["Lua de nascimento", moon.name, "", "Posição da sua data dentro do ciclo anual de 13 luas."],
      ["Dia da Lua", calendar.moon_day],
      ["Semana crom&aacute;tica", week.name, "week-accent", "Fase de 7 dias dentro da Lua de nascimento."],
      ["Plasma", plasma.name, "", "Coordenada diária ligada ao ciclo de sete plasmas."],
      ["Chakra do plasma", chakra.label || chakra.name],
      ["Onda Encantada", wave.wave_number ? `Onda ${wave.wave_number}` : ""],
      ["Posi&ccedil;&atilde;o na onda", wave.position ? `${wave.position} de 13` : ""],
    ])}
    <p class="coordinate-note">${escapeHtml(moon.short_description || "")}</p>
    `,
  });
}

function DayCoordinatesCard(reading) {
  const daily = dailyMap(reading) || {};
  const coordinates = readingCoordinates(reading);
  const day = coordinates && coordinates.day ? coordinates.day : {};
  const calendar = day.thirteen_moons || {};
  const wave = day.wavespell || {};
  const moon = calendar.moon || {};
  const week = calendar.chromatic_week || {};
  const plasma = calendar.plasma || {};
  const chakra = calendar.chakra || {};
  const dayKin = daily.kin_of_day ? daily.kin_of_day.value : null;
  const signature = daily.signature ? daily.signature.value : "";

  return ExpandableCoordinateCard({
    number: "4",
    title: "Coordenadas do Dia",
    subtitle: `${formatDatePtBr(day.date)} · toque para ver os detalhes`,
    className: "day-coordinate-card",
    content: `
    <div class="day-coordinate-banner">
      <div>
        <span>Kin do dia</span>
        <strong>${dayKin || "—"}</strong>
      </div>
      <p>${escapeHtml(signature || "Assinatura do dia n&atilde;o dispon&iacute;vel")}</p>
    </div>
    ${CoordinateGrid([
      ["Lua atual", moon.name],
      ["Dia da Lua", calendar.moon_day],
      ["Semana crom&aacute;tica", week.name, "week-accent", "Fase de 7 dias dentro da Lua atual."],
      ["Orienta&ccedil;&atilde;o da semana", week.practical_guidance],
      ["Plasma do dia", plasma.name, "", "Coordenada diária ligada ao ciclo de sete plasmas."],
      ["Chakra do dia", chakra.label || chakra.name],
      ["Onda atual", wave.wave_number ? `Onda ${wave.wave_number}` : ""],
      ["Posi&ccedil;&atilde;o na onda", wave.position ? `${wave.position} de 13` : ""],
    ])}
    <p class="coordinate-note">A associa&ccedil;&atilde;o com o chakra &eacute; uma coordenada do ciclo natural e n&atilde;o um diagn&oacute;stico do seu estado individual.</p>
    `,
  });
}

function DailySynchronizationCard(reading) {
  const coordinates = readingCoordinates(reading);
  const synchronization = coordinates ? coordinates.synchronization : null;

  if (!synchronization || synchronization.status !== "calculado") {
    return "";
  }

  const reductionText = synchronization.reductionApplied
    ? `${synchronization.rawSum} - ${synchronization.reductions * 260} = ${synchronization.synchronizedKin}`
    : `${synchronization.personalKin} + ${synchronization.dayKin} = ${synchronization.rawSum}`;

  return ExpandableCoordinateCard({
    number: "5",
    title: "Sua Sincroniza&ccedil;&atilde;o com Hoje",
    subtitle: `Kin de navegação ${synchronization.synchronizedKin} · toque para ver o cálculo`,
    className: "synchronization-card",
    content: `
    <div class="synchronization-equation" aria-label="C&aacute;lculo do Kin de navega&ccedil;&atilde;o">
      <div><span>Kin pessoal</span><strong>${synchronization.personalKin}</strong></div>
      <b>+</b>
      <div><span>Kin do dia</span><strong>${synchronization.dayKin}</strong></div>
      <b>=</b>
      <div class="synchronization-result"><span>Kin de navega&ccedil;&atilde;o</span><strong>${synchronization.synchronizedKin}</strong></div>
    </div>
    <p class="calculation-line">${escapeHtml(reductionText)}</p>
    <p class="term-explanation"><strong>Kin de navega&ccedil;&atilde;o:</strong> resultado da sincroniza&ccedil;&atilde;o entre seu Kin pessoal e o Kin do dia.</p>
    <p class="coordinate-note">Este ponto oferece uma coordenada simb&oacute;lica para observa&ccedil;&atilde;o e n&atilde;o determina o que vai acontecer.</p>
    `,
  });
}

function AreaApplicationCard(guidance) {
  const interpretation = guidance && guidance.interpretation;
  if (!interpretation) {
    return "";
  }

  return GoldenCard(`
    <div class="coordinate-heading">
      <span>2</span>
      <div>
        <h2>Aplica&ccedil;&atilde;o na &Aacute;rea Escolhida</h2>
        <p>${escapeHtml(interpretation.areaTitle)}</p>
      </div>
    </div>
    <p class="application-question">Como aplicar minhas coordenadas de hoje em ${escapeHtml(interpretation.areaTitle)}?</p>
    <div class="application-copy">
      <p>${escapeHtml(interpretation.synthesis)}</p>
      ${interpretation.applicationSummary && interpretation.applicationSummary !== interpretation.synthesis
        ? `<p>${escapeHtml(interpretation.applicationSummary)}</p>`
        : ""}
    </div>
    <div class="reflection-prompt">
      <span>Pergunta para observar</span>
      <strong>${escapeHtml(interpretation.reflectionQuestion)}</strong>
    </div>
  `, "coordinate-card application-card");
}

function DailyPracticeCard(guidance) {
  const interpretation = guidance && guidance.interpretation;
  if (!interpretation) {
    return "";
  }

  return GoldenCard(`
    <div class="coordinate-heading">
      <span>6</span>
      <div>
        <h2>Pr&aacute;tica de Sincroniza&ccedil;&atilde;o do Dia</h2>
        <p>Uma a&ccedil;&atilde;o curta para o momento atual</p>
      </div>
    </div>
    <p class="daily-practice-copy">${escapeHtml(interpretation.dailyPractice || interpretation.suggestedPractice)}</p>
  `, "coordinate-card daily-practice-card");
}

function EnergyCycleContent() {
  return `
    <p class="chakra-cycle-note">Esta se&ccedil;&atilde;o mostra a sequ&ecirc;ncia simb&oacute;lica dos plasmas e chakras no ciclo natural do Sincron&aacute;rio. N&atilde;o representa diagn&oacute;stico individual nem avalia o estado energ&eacute;tico dos seus chakras.</p>
    <div class="chakra-layout">
      ${ChakraBodyMap()}
      <div class="chakra-list">
        ${chakras.map(ChakraCard).join("")}
      </div>
    </div>
  `;
}

function EnergyCycleShortcutCard(className = "") {
  const resultCopy = className.includes("is-result");
  return `
    <section class="energy-cycle-shortcut ${className}">
      <span class="energy-cycle-shortcut-icon">${icon("lotus")}</span>
      <div>
        <span>${resultCopy ? "APROFUNDE O CICLO SIMB&Oacute;LICO" : "Ciclo Energ&eacute;tico"}</span>
        <h2>${resultCopy ? "Plasmas e chakras como coordenadas do ciclo." : "Veja a sequ&ecirc;ncia dos plasmas e chakras com mais clareza."}</h2>
        <p>${resultCopy ? "Veja como plasmas e chakras estruturais aparecem no ciclo, sem trat&aacute;-los como diagn&oacute;stico individual." : "Uma p&aacute;gina dedicada para entender o ciclo simb&oacute;lico natural sem misturar com o resultado principal."}</p>
      </div>
      <button class="button-primary" data-route="energy-cycle" type="button">${resultCopy ? "Ver Ciclo Energ&eacute;tico" : "VER CICLO ENERG&Eacute;TICO"} ${icon("arrow")}</button>
    </section>
  `;
}

function ReadingDetailsSection(reading, guidance) {
  return `
    <section id="reading-details" class="reading-details-section">
      <details class="reading-details-disclosure">
        <summary>
          <span class="reading-details-icon">${icon("info")}</span>
          <span class="reading-details-summary">
            <strong>Entenda sua leitura</strong>
            <small>Veja Kins, coordenadas e aplica&ccedil;&otilde;es da leitura.</small>
          </span>
          <span class="reading-details-toggle" aria-hidden="true">${icon("arrow")}</span>
        </summary>
        <div class="reading-details-content">
          ${GpsTodaySummaryCard(reading, guidance)}
          ${guidance ? AreaApplicationCard(guidance) : ""}
          ${BirthCoordinatesCard(reading)}
          ${DayCoordinatesCard(reading)}
          ${DailySynchronizationCard(reading)}
          ${guidance ? DailyPracticeCard(guidance) : ""}
        </div>
      </details>
    </section>
  `;
}

function activeReadingHistoryEntry() {
  return historyEntryById(state.activeHistoryId || state.requestedReadingId);
}

function FirstReadingFormation(reading, guidance) {
  const personal = reading && reading.personal_map ? reading.personal_map : {};
  const daily = dailyMap(reading) || {};
  const coordinates = reading && reading.coordinates ? reading.coordinates : {};
  const dayCalendar = coordinates.day && coordinates.day.thirteen_moons
    ? coordinates.day.thirteen_moons
    : {};
  const interpretation = guidance && guidance.interpretation ? guidance.interpretation : {};
  const moon = dayCalendar.moon || {};
  const week = dayCalendar.chromatic_week || {};
  const plasma = dayCalendar.plasma || {};
  const chakra = dayCalendar.chakra || {};
  return `
    <section class="first-reading-formation" aria-labelledby="first-reading-formation-title">
      <div class="first-reading-section-heading">
        <span>TRANSPAR&Ecirc;NCIA</span>
        <h2 id="first-reading-formation-title">COMO CHEGAMOS A ESTA LEITURA</h2>
      </div>
      <div class="first-reading-layers">
        <article>
          <span class="first-reading-layer-number">01</span>
          <div><small>SUA BASE PESSOAL</small><h3>Kin ${personal.kin ? personal.kin.value : "—"}</h3></div>
          <dl>
            <div><dt>Assinatura</dt><dd>${escapeHtml(personal.signature ? personal.signature.value : "N&atilde;o dispon&iacute;vel")}</dd></div>
            <div><dt>Selo</dt><dd>${escapeHtml(personal.seal ? personal.seal.name : "N&atilde;o dispon&iacute;vel")}</dd></div>
            <div><dt>Tom</dt><dd>${escapeHtml(personal.tone ? personal.tone.name : "N&atilde;o dispon&iacute;vel")}</dd></div>
          </dl>
          <p>Coordenadas derivadas da sua data de nascimento.</p>
        </article>
        <article>
          <span class="first-reading-layer-number">02</span>
          <div><small>O CICLO DO DIA</small><h3>Kin ${daily.kin_of_day ? daily.kin_of_day.value : "—"}</h3></div>
          <dl>
            <div><dt>Lua</dt><dd>${escapeHtml(moon.name || "N&atilde;o dispon&iacute;vel")}</dd></div>
            <div><dt>Semana</dt><dd>${escapeHtml(week.name || "N&atilde;o dispon&iacute;vel")}</dd></div>
            <div><dt>Plasma</dt><dd>${escapeHtml(plasma.name || "N&atilde;o dispon&iacute;vel")}</dd></div>
            <div><dt>Chakra estrutural</dt><dd>${escapeHtml(chakra.label || chakra.name || "N&atilde;o dispon&iacute;vel")}</dd></div>
          </dl>
          <p>Coordenadas simb&oacute;licas relacionadas &agrave; data da consulta.</p>
        </article>
        <article>
          <span class="first-reading-layer-number">03</span>
          <div><small>A APLICA&Ccedil;&Atilde;O</small><h3>${escapeHtml(interpretation.areaTitle || "Vis&atilde;o Geral")}</h3></div>
          <dl>
            <div><dt>Tema principal</dt><dd>${escapeHtml(interpretation.areaTitle || "Vis&atilde;o Geral")}</dd></div>
            <div><dt>Pergunta</dt><dd>${escapeHtml(interpretation.reflectionQuestion || "Não disponível")}</dd></div>
            <div><dt>Pr&aacute;tica</dt><dd>${escapeHtml(interpretation.dailyPractice || interpretation.suggestedPractice || "Não disponível")}</dd></div>
          </dl>
          <p>A &aacute;rea escolhida contextualiza a interpreta&ccedil;&atilde;o, sem alterar os c&aacute;lculos.</p>
        </article>
      </div>
    </section>
  `;
}

function FirstReadingResult(reading, guidance, historyEntry) {
  const interpretation = guidance && guidance.interpretation ? guidance.interpretation : {};
  const presentation = firstReadingPresentation(interpretation);
  const areaTitle = historyEntry && historyEntry.interpretationSnapshot
    ? historyEntry.interpretationSnapshot.areaTitle
    : historyEntry && historyEntry.inputSnapshot
      ? historyEntry.inputSnapshot.selectedAreaTitle
      : interpretation.areaTitle;
  const createdAt = historyEntry ? historyEntry.createdAt : "";
  return `
    <section class="first-reading-result">
      <section class="first-reading-hero">
        <div class="first-reading-status-line">
          <span class="first-reading-complete-badge">${icon("check")} LEITURA CONCLU&Iacute;DA</span>
          <span class="first-reading-metadata">${escapeHtml(areaTitle || "Vis&atilde;o Geral")} &middot; Consulta de ${escapeHtml(formatReadingCreatedAtLong(createdAt))}</span>
        </div>
        <span class="first-reading-eyebrow">SUA DIRE&Ccedil;&Atilde;O INICIAL</span>
        <h2>${escapeHtml(presentation.heroTitle)}</h2>
        <p>${escapeHtml(presentation.heroSummary)}</p>
        <small>Esta leitura combina sua base pessoal, a coordenada do dia e a aplica&ccedil;&atilde;o no tema escolhido.</small>
      </section>

      ${FirstReadingFormation(reading, guidance)}

      <section class="first-reading-guidance" aria-labelledby="first-reading-guidance-title">
        <div class="first-reading-section-heading">
          <span>PR&Oacute;XIMO PASSO</span>
          <h2 id="first-reading-guidance-title">SEU PRIMEIRO DIRECIONAMENTO</h2>
        </div>
        <div class="first-reading-guidance-grid">
          <article><span>${icon("spark")} Frase de alinhamento</span><strong>&ldquo;${escapeHtml(presentation.alignmentPhraseShort)}&rdquo;</strong></article>
          <article><span>${icon("target")} A&ccedil;&atilde;o inicial</span><strong>${escapeHtml(presentation.actionShort)}</strong></article>
          <article><span>${icon("compass")} Pergunta de reflex&atilde;o</span><strong>${escapeHtml(presentation.questionShort)}</strong></article>
        </div>
        <p>Na A&ccedil;&atilde;o do Dia voc&ecirc; encontrar&aacute; a orienta&ccedil;&atilde;o pr&aacute;tica atualizada para aplicar este direcionamento.</p>
      </section>

      <nav class="first-reading-actions" aria-label="Pr&oacute;ximos passos da primeira leitura">
        <button class="button-primary button-large" data-route="my-day" type="button">Ver minha A&ccedil;&atilde;o do Dia ${icon("arrow")}</button>
        <button class="button-ghost button-large" data-route="protocol" type="button">Abrir Protocolo Di&aacute;rio</button>
        <button class="button-text" data-route="journey" type="button">Conhecer minha Jornada ${icon("arrow")}</button>
      </nav>

      ${EnergyCycleShortcutCard("is-result")}
      ${ReadingDetailsSection(reading, guidance)}
    </section>
  `;
}

function BrandMark(compact = false) {
  return `
    <span class="brand-mark ${compact ? "is-compact" : ""}" aria-hidden="true">
      ${icon("spark")}
    </span>
  `;
}

function PublicHeader() {
  return `
    <header class="public-header">
      <button class="public-brand" data-route="landing" type="button" aria-label="Drive Mental - in&iacute;cio">
        ${BrandMark(true)}
        <span>Drive Mental</span>
      </button>
      <nav class="public-nav" aria-label="Navega&ccedil;&atilde;o do site">
        <a href="#como-funciona">Como funciona</a>
        <a href="#o-que-recebe">O que voc&ecirc; recebe</a>
        <a href="#exemplo">Exemplo do mapa</a>
        <a href="#recursos">Recursos</a>
        <a href="#premium">Premium</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div class="public-actions">
        <button class="button-ghost" data-route="login" type="button">Entrar</button>
        <button class="button-primary" data-route="signup" type="button">Come&ccedil;ar agora</button>
      </div>
    </header>
  `;
}

function CommercialPlanAction(planId) {
  const config = runtimeConfig();
  const checkoutUrl = config.checkoutUrls && config.checkoutUrls[planId];
  if (
    config.billingMode === "external-checkout"
    && typeof checkoutUrl === "string"
    && /^https:\/\//.test(checkoutUrl)
  ) {
    return `<a class="button-primary button-large" href="${escapeHtml(checkoutUrl)}" target="_blank" rel="noopener">INICIAR A MINHA JORNADA ${icon("arrow")}</a>`;
  }
  return '<button class="button-primary button-large" type="button" disabled>INICIAR A MINHA JORNADA</button>';
}

function upgradeCheckoutUrl() {
  const urls = runtimeConfig().checkoutUrls || {};
  return urls.premium || urls.monthly || urls.drive || urls.mentor || urls.guided || "";
}

function UpgradeCta(className = "button-primary button-large") {
  const checkoutUrl = upgradeCheckoutUrl();
  const label = `QUERO INICIAR MINHA JORNADA ${icon("arrow")}`;
  if (typeof checkoutUrl === "string" && /^https:\/\//.test(checkoutUrl)) {
    return `<a class="${className}" href="${escapeHtml(checkoutUrl)}" target="_blank" rel="noopener">${label}</a>`;
  }
  return `<a class="${className}" href="/?qa=plans#premium">${label}</a>`;
}

function UpgradeModal() {
  if (!state.upgradeModalOpen) {
    return "";
  }
  const area = consultationAreas.find((item) => item.id === normalizeAreaId(state.upgradeAreaId));
  const areaCopy = area
    ? ` para acompanhar ${escapeHtml(area.shortTitle || area.title)}`
    : "";

  return `
    <div class="upgrade-modal-backdrop" data-close-upgrade-modal aria-hidden="false">
      <section class="upgrade-modal" role="dialog" aria-modal="true" aria-labelledby="upgrade-modal-title">
        <button class="upgrade-modal-close" data-close-upgrade-modal type="button" aria-label="Fechar aviso">${icon("back")}</button>
        <span class="upgrade-modal-icon">${icon("unlock")}</span>
        <span class="upgrade-modal-eyebrow">Desbloquear evolu&ccedil;&atilde;o</span>
        <h2 id="upgrade-modal-title">Sua consulta gratuita j&aacute; abriu uma dire&ccedil;&atilde;o.</h2>
        <p>Para acompanhar todas as &aacute;reas, comparar avan&ccedil;os${areaCopy} e liberar novas consultas, voc&ecirc; precisa ativar um plano Drive Mental.</p>
        <div class="upgrade-modal-benefits">
          <span>${icon("check")} Todas as &aacute;reas no dashboard</span>
          <span>${icon("check")} Hist&oacute;rico por tema de vida</span>
          <span>${icon("check")} Clareza sobre onde melhorar</span>
        </div>
        ${UpgradeCta("button-primary button-large upgrade-modal-cta")}
      </section>
    </div>
  `;
}

function LandingScreen() {
  const productFoundations = [
    ["compass", "Compreenda seus ciclos", "Reconhe&ccedil;a padr&otilde;es pessoais e encontre uma dire&ccedil;&atilde;o mais consciente para o dia."],
    ["lotus", "Observe sua energia", "Perceba onde sua aten&ccedil;&atilde;o est&aacute; sendo direcionada, sem diagn&oacute;sticos ou conclus&otilde;es absolutas."],
    ["target", "Transforme clareza em a&ccedil;&atilde;o", "Converta cada leitura em uma pergunta &uacute;til e uma pr&aacute;tica poss&iacute;vel para a rotina."],
  ];
  const deliverables = [
    ["compass", "Dire&ccedil;&atilde;o do dia", "Entenda o contexto do seu momento e escolha onde colocar aten&ccedil;&atilde;o.", "Dispon&iacute;vel"],
    ["lotus", "Leitura de energia", "Observe temas pessoais com mais clareza, sem r&oacute;tulos ou diagn&oacute;sticos.", "Dispon&iacute;vel"],
    ["protocol", "Drive Di&aacute;rio", "Crie ritmo entre manh&atilde;, dia e noite para sustentar presen&ccedil;a e foco.", "Dispon&iacute;vel"],
    ["chart", "Linha do Tempo", "Registre acontecimentos para reconhecer mudan&ccedil;as, escolhas e aprendizados.", "Dispon&iacute;vel"],
    ["history", "Hist&oacute;rico Pessoal", "Relembre leituras e perceba como sua jornada evolui ao longo do tempo.", "Dispon&iacute;vel"],
    ["home", "Painel da Jornada", "Encontre prioridades, registros e pr&oacute;ximos passos em um &uacute;nico lugar.", "Dispon&iacute;vel"],
    ["calendar", "Acompanhamento Guiado", "Uma jornada premium de 90 dias, extens&iacute;vel a 180, adaptada aos resultados e relatos do usu&aacute;rio.", "Plano Premium"],
  ];
  const benefits = [
    ["heart", "Clareza emocional", "Organize o que est&aacute; percebendo e reconhe&ccedil;a temas que merecem mais aten&ccedil;&atilde;o."],
    ["target", "Foco no essencial", "Transforme excesso de informa&ccedil;&atilde;o em uma pergunta e um pr&oacute;ximo passo poss&iacute;vel."],
    ["calendar", "Rotina com inten&ccedil;&atilde;o", "Use pequenas pr&aacute;ticas de reflex&atilde;o, escrita e organiza&ccedil;&atilde;o ao longo do dia."],
    ["cycle", "Autoconhecimento cont&iacute;nuo", "Acompanhe leituras e marcos preservados para observar sua jornada ao longo do tempo."],
  ];
  const trustCards = [
    ["compass", "Sem previs&otilde;es absolutas", "A plataforma n&atilde;o promete acontecimentos futuros nem resultados garantidos."],
    ["device", "Dados sob seu controle", "Nesta fase, seus registros ficam no navegador e podem ser exportados por backup."],
    ["book", "Metodologia transparente", "A leitura separa c&aacute;lculo, interpreta&ccedil;&atilde;o simb&oacute;lica e limites de uso."],
    ["heart", "Uso consciente", "O conte&uacute;do apoia reflex&atilde;o e n&atilde;o substitui orienta&ccedil;&atilde;o profissional."],
  ];
  const faqItems = [
    ["O Drive Mental faz previs&otilde;es sobre o futuro?", "N&atilde;o. A plataforma organiza uma jornada de observa&ccedil;&atilde;o, escolhas e possibilidades de a&ccedil;&atilde;o. Ela n&atilde;o promete acontecimentos futuros."],
    ["Preciso entender de chakras ou do Sincron&aacute;rio das 13 Luas?", "N&atilde;o. A experi&ecirc;ncia apresenta as coordenadas em linguagem explicada, com contexto e transpar&ecirc;ncia sobre a origem de cada informa&ccedil;&atilde;o."],
    ["O mapa &eacute; um diagn&oacute;stico energ&eacute;tico individual?", "N&atilde;o. O mapa dos chakras &eacute; uma navega&ccedil;&atilde;o simb&oacute;lica para reflex&atilde;o. A vers&atilde;o atual n&atilde;o calcula bloqueio, estado, hiperatividade ou prioridade individual dos chakras."],
    ["O Drive Mental substitui terapia ou aconselhamento profissional?", "N&atilde;o. O conte&uacute;do n&atilde;o substitui acompanhamento m&eacute;dico, psicol&oacute;gico, jur&iacute;dico, financeiro ou qualquer orienta&ccedil;&atilde;o profissional especializada."],
    ["Quais dados preciso informar?", "Para preparar o mapa inicial, a plataforma utiliza seu nome, data de nascimento e a &aacute;rea em que deseja contextualizar a leitura. A p&aacute;gina de privacidade explica como esses dados s&atilde;o armazenados nesta fase."],
    ["Posso come&ccedil;ar gratuitamente?", "Sim. Voc&ecirc; poder&aacute; fazer uma consulta inicial gratuita para conhecer seu mapa e entender como a plataforma organiza a leitura."],
    ["Qual &eacute; a diferen&ccedil;a entre a assinatura e o acompanhamento premium?", "A assinatura mensal amplia o acesso a consultas em outras &aacute;reas da vida, hist&oacute;rico e recursos recorrentes. O acompanhamento premium acrescenta uma jornada guiada de 90 dias, renov&aacute;vel at&eacute; 180, com metas, check-ins, di&aacute;rio de dificuldades, a&ccedil;&otilde;es adaptadas e painel de evolu&ccedil;&atilde;o."],
    ["Como o acompanhamento se adapta ao meu momento?", "A jornada parte dos resultados das suas consultas e dos check-ins registrados por voc&ecirc;. Dificuldades, percep&ccedil;&otilde;es e avan&ccedil;os alimentam a organiza&ccedil;&atilde;o das pr&oacute;ximas a&ccedil;&otilde;es e alertas do plano."],
    ["O acompanhamento premium substitui um profissional?", "N&atilde;o. Mesmo no plano guiado, o Drive Mental continua sendo uma ferramenta de autoconhecimento e organiza&ccedil;&atilde;o pessoal. Ele n&atilde;o substitui acompanhamento m&eacute;dico, psicol&oacute;gico, financeiro ou profissional especializado."],
  ];

  return `
    <div class="public-site">
      ${PublicHeader()}
      <main>
        <section class="sales-hero">
          <div class="sales-hero-copy">
            <span class="eyebrow">Clareza &middot; Dire&ccedil;&atilde;o &middot; Presen&ccedil;a &middot; Disciplina</span>
            <h1>Clareza para escolher. <em>Dire&ccedil;&atilde;o para agir.</em></h1>
            <p>Organize sua jornada pessoal com mais presen&ccedil;a e disciplina. O Drive Mental utiliza o Sincron&aacute;rio das 13 Luas apenas como m&eacute;todo para estruturar ciclos, reflex&otilde;es e pr&oacute;ximos passos.</p>
            <div class="hero-actions">
              <button class="button-primary button-large" data-route="signup" type="button">Come&ccedil;ar minha jornada ${icon("arrow")}</button>
              <a class="button-ghost button-large" href="#exemplo">Conhecer a experi&ecirc;ncia</a>
            </div>
            <div class="hero-trust">
              <span>${icon("check")} Sem previs&otilde;es absolutas</span>
              <span>${icon("check")} Dados sob seu controle</span>
              <span>${icon("check")} M&eacute;todo de organiza&ccedil;&atilde;o pessoal</span>
            </div>
          </div>
          <div class="platform-preview" aria-label="Pr&eacute;via do dashboard Drive Mental">
            <div class="preview-window">
              <div class="preview-sidebar">
                ${BrandMark(true)}
                <i></i><i></i><i></i><i></i>
              </div>
              <div class="preview-content">
                <div class="preview-topline"><span></span><b></b></div>
                <div class="preview-welcome">
                  <small>SEU DRIVE DE HOJE</small>
                  <strong>Clareza para priorizar o que importa agora</strong>
                  <span></span>
                </div>
                <div class="preview-grid">
                  <article class="preview-kin"><small>ENERGIA DO DIA</small><strong>178</strong><span>Presen&ccedil;a e discernimento</span></article>
                  <article><small>PRIORIDADE</small><strong>Base</strong><span>Estabilidade antes da pressa</span></article>
                  <article><small>DRIVE DI&Aacute;RIO</small><strong>Clareza</strong><span>Uma a&ccedil;&atilde;o essencial</span></article>
                </div>
                <div class="preview-chart"><span></span><span></span><span></span><span></span><span></span></div>
                <button class="preview-action" data-route="signup" type="button">Abrir jornada ${icon("arrow")}</button>
              </div>
            </div>
            <div class="preview-orbit orbit-one"></div>
            <div class="preview-orbit orbit-two"></div>
          </div>
        </section>

        <section class="proof-strip" aria-label="Bases da plataforma">
          <div><strong>260</strong><span>Kins no ciclo</span></div>
          <div><strong>13</strong><span>Luas para navegar o ano</span></div>
          <div><strong>7</strong><span>&Aacute;reas de aplica&ccedil;&atilde;o</span></div>
          <div><strong>90</strong><span>Dias de acompanhamento premium</span></div>
        </section>

        <section id="produto" class="sales-section product-intro-section">
          <div class="section-heading">
            <span class="eyebrow">O que &eacute; o Drive Mental?</span>
            <h2>Um m&eacute;todo para transformar percep&ccedil;&atilde;o em movimento consciente.</h2>
            <p>O Drive Mental utiliza o Sincron&aacute;rio das 13 Luas como uma estrutura de organiza&ccedil;&atilde;o da jornada pessoal. Voc&ecirc; recebe contexto para refletir, priorizar e agir com mais consist&ecirc;ncia.</p>
          </div>
          <div class="foundation-grid">
            ${productFoundations.map(([iconName, title, text]) => `
              <article><span>${icon(iconName)}</span><h3>${title}</h3><p>${text}</p></article>
            `).join("")}
          </div>
        </section>

        <section id="como-funciona" class="sales-section process-section">
          <div class="section-heading">
            <span class="eyebrow">Como funciona na pr&aacute;tica</span>
            <h2>Do seu momento atual a uma jornada que voc&ecirc; consegue sustentar.</h2>
            <p>Um caminho simples para compreender, escolher, praticar e acompanhar sua evolu&ccedil;&atilde;o.</p>
          </div>
          <div class="process-grid process-grid-four">
            <article><span>01</span>${icon("user")}<h3>Reconhe&ccedil;a seu momento</h3><p>Crie seu perfil para contextualizar a jornada a partir da sua realidade.</p></article>
            <article><span>02</span>${icon("compass")}<h3>Encontre uma dire&ccedil;&atilde;o</h3><p>Compreenda seus ciclos em uma leitura clara, organizada e sem mistifica&ccedil;&atilde;o.</p></article>
            <article><span>03</span>${icon("target")}<h3>Defina uma prioridade</h3><p>Transforme a reflex&atilde;o em uma pergunta &uacute;til e uma a&ccedil;&atilde;o poss&iacute;vel.</p></article>
            <article><span>04</span>${icon("history")}<h3>Construa consist&ecirc;ncia</h3><p>Registre escolhas e aprendizados para perceber sua evolu&ccedil;&atilde;o ao longo do tempo.</p></article>
          </div>
        </section>

        <section id="o-que-recebe" class="sales-section deliverables-section">
          <div class="section-heading is-centered">
            <span class="eyebrow">O que voc&ecirc; recebe</span>
            <h2>Tudo o que voc&ecirc; precisa para manter dire&ccedil;&atilde;o no cotidiano.</h2>
            <p>Cada recurso ajuda voc&ecirc; a compreender o momento, escolher prioridades e sustentar uma rotina mais consciente.</p>
          </div>
          <div class="deliverables-grid">
            ${deliverables.map(([iconName, title, text, status]) => `
              <article>
                <div class="deliverable-heading"><span class="feature-icon">${icon(iconName)}</span><small>${status}</small></div>
                <h3>${title}</h3>
                <p>${text}</p>
              </article>
            `).join("")}
          </div>
          <div class="section-inline-cta">
            <div><strong>Sua primeira dire&ccedil;&atilde;o pode come&ccedil;ar agora.</strong><span>Crie seu perfil e organize o pr&oacute;ximo passo com mais clareza.</span></div>
            <button class="button-primary" data-route="signup" type="button">Come&ccedil;ar gratuitamente ${icon("arrow")}</button>
          </div>
        </section>

        <section id="exemplo" class="sales-section product-showcase-section">
          <div class="section-heading">
            <span class="eyebrow">Exemplo real da plataforma</span>
            <h2>Veja como clareza se transforma em rotina.</h2>
            <p>A experi&ecirc;ncia organiza contexto, prioridade e pr&aacute;tica sem confundir reflex&atilde;o com previs&atilde;o.</p>
          </div>
          <div class="showcase-dashboard">
            <div class="showcase-copy">
              <span>01 &middot; PAINEL PESSOAL</span>
              <h3>Seu momento, suas prioridades e sua evolu&ccedil;&atilde;o.</h3>
              <p>O dashboard mant&eacute;m energia do dia, Drive Di&aacute;rio, calend&aacute;rio e hist&oacute;rico ao alcance de uma decis&atilde;o consciente.</p>
              <ul>
                <li>${icon("check")} Prioridades vis&iacute;veis sem excesso de informa&ccedil;&atilde;o</li>
                <li>${icon("check")} Hist&oacute;rico para reconhecer seu progresso</li>
                <li>${icon("check")} Continuidade no desktop e no celular</li>
              </ul>
            </div>
            <figure class="showcase-screen">
              <img src="/assets/landing/dashboard-drive-astral.png" alt="Dashboard do Drive Mental com prioridades, calend&aacute;rio e hist&oacute;rico" loading="lazy" decoding="async" />
            </figure>
          </div>
          <div class="showcase-detail-grid">
            <article class="reading-showcase">
              <div>
                <span>02 &middot; LEITURA ESTRUTURADA</span>
                <h3>Contexto explicado sem linguagem complicada.</h3>
                <p>Entenda o que observar, por que isso importa e como levar a reflex&atilde;o para o cotidiano.</p>
              </div>
              <figure><img src="/assets/landing/leitura-drive-astral.png" alt="Exemplo de uma leitura organizada do Drive Mental no celular" loading="lazy" decoding="async" /></figure>
            </article>
            <article class="protocol-showcase">
              <div>
                <span>03 &middot; PROTOCOLO DI&Aacute;RIO</span>
                <h3>Presen&ccedil;a que acompanha o ritmo do seu dia.</h3>
                <p>Pequenas pausas de organiza&ccedil;&atilde;o pela manh&atilde;, durante o dia e &agrave; noite.</p>
              </div>
              <div class="protocol-preview" aria-label="Exemplo visual do protocolo di&aacute;rio">
                <div><i>${icon("spark")}</i><span><small>MANH&Atilde;</small><strong>Presen&ccedil;a e inten&ccedil;&atilde;o</strong></span><b>8 min</b></div>
                <div><i>${icon("target")}</i><span><small>DIA</small><strong>Uma a&ccedil;&atilde;o essencial</strong></span><b>Foco</b></div>
                <div><i>${icon("heart")}</i><span><small>NOITE</small><strong>Revis&atilde;o e gratid&atilde;o</strong></span><b>Pausa</b></div>
              </div>
            </article>
          </div>
          <div class="guided-program-showcase">
            <div class="guided-program-copy">
              <span class="eyebrow">04 &middot; ACOMPANHAMENTO GUIADO PREMIUM</span>
              <h3>Um plano de 90 dias para transformar inten&ccedil;&atilde;o em const&acirc;ncia.</h3>
              <p>Seus check-ins e aprendizados ajudam a ajustar prioridades e pequenas a&ccedil;&otilde;es ao longo da jornada.</p>
              <div class="guided-duration">
                <strong>90 dias</strong>
                <span>Jornada inicial estruturada</span>
                <i></i>
                <strong>180 dias</strong>
                <span>Continuidade opcional</span>
              </div>
            </div>
            <div class="guided-dashboard-preview" aria-label="Exemplo do dashboard de acompanhamento guiado">
              <header>
                <div><small>JORNADA GUIADA</small><strong>Dia 24 de 90</strong></div>
                <span>27% conclu&iacute;do</span>
              </header>
              <div class="guided-progress"><span style="width: 27%"></span></div>
              <div class="guided-preview-grid">
                <article><small>FOCO ATUAL</small><strong>Organizar limites e prioridades</strong><span>${icon("target")} Semana 4</span></article>
                <article><small>EVOLU&Ccedil;&Atilde;O</small><strong>8 check-ins</strong><span>${icon("chart")} Consist&ecirc;ncia em alta</span></article>
              </div>
              <div class="guided-diary-card">
                <span>${icon("book")}</span>
                <div><small>DI&Aacute;RIO DE DIFICULDADES</small><strong>&ldquo;Estou perdendo foco no meio do dia.&rdquo;</strong><p>Pr&oacute;xima a&ccedil;&atilde;o sugerida: reduzir a meta e criar um bloco de 25 minutos sem interrup&ccedil;&otilde;es.</p></div>
              </div>
              <div class="guided-alert">${icon("info")} <span>Check-in de energia dispon&iacute;vel hoje &middot; 3 minutos</span></div>
            </div>
          </div>
          <div class="showcase-cta">
            <div><span class="eyebrow">Experimente no seu ritmo</span><h3>Crie uma conta e encontre sua primeira dire&ccedil;&atilde;o.</h3></div>
            <button class="button-primary button-large" data-route="signup" type="button">Come&ccedil;ar gratuitamente ${icon("arrow")}</button>
          </div>
        </section>

        <section id="recursos" class="sales-section benefits-section">
          <div class="section-heading is-centered">
            <span class="eyebrow">Benef&iacute;cios pr&aacute;ticos</span>
            <h2>Mais clareza para decidir. Mais presen&ccedil;a para agir.</h2>
            <p>Organize o que voc&ecirc; percebe, escolha o que merece aten&ccedil;&atilde;o e avance com um passo de cada vez.</p>
          </div>
          <div class="benefits-grid">
            ${benefits.map(([iconName, title, text]) => `
              <article><span>${icon(iconName)}</span><div><h3>${title}</h3><p>${text}</p></div></article>
            `).join("")}
          </div>
        </section>

        <section id="transparencia" class="sales-section trust-section">
          <div class="trust-intro">
            <span class="eyebrow">Transpar&ecirc;ncia e confian&ccedil;a</span>
            <h2>Um m&eacute;todo claro, respons&aacute;vel e com limites.</h2>
            <p>O Drive Mental organiza reflex&otilde;es pessoais sem previs&otilde;es, diagn&oacute;sticos ou promessas. O objetivo &eacute; apoiar consci&ecirc;ncia, disciplina e melhores escolhas.</p>
            <a href="/privacy.html">Ler pol&iacute;tica de privacidade ${icon("arrow")}</a>
          </div>
          <div class="trust-grid">
            ${trustCards.map(([iconName, title, text]) => `
              <article><span>${icon(iconName)}</span><div><h3>${title}</h3><p>${text}</p></div></article>
            `).join("")}
          </div>
        </section>

        <section id="premium" class="sales-section plans-section">
          <div class="section-heading is-centered">
            <span class="eyebrow">Planos para cada etapa</span>
            <h2>Comece com uma resposta. Continue com uma jornada.</h2>
            <p>O Drive Mental acompanha diferentes momentos, da primeira dire&ccedil;&atilde;o a uma jornada guiada de consist&ecirc;ncia.</p>
          </div>
          <div class="plans-grid">
            <article class="plan-card">
              <span class="plan-label">Entrada</span>
              <h3>Consulta Gratuita</h3>
              <p>Encontre uma primeira dire&ccedil;&atilde;o e experimente o m&eacute;todo antes de escolher um plano.</p>
              <ul>
                <li>${icon("check")} Uma consulta inicial</li>
                <li>${icon("check")} Resumo das coordenadas</li>
                <li>${icon("check")} Uma &aacute;rea de aplica&ccedil;&atilde;o</li>
                <li>${icon("check")} Pr&aacute;tica inicial sugerida</li>
              </ul>
              <button class="button-ghost button-large" data-route="signup" type="button">Fazer consulta gr&aacute;tis</button>
            </article>
            <article class="plan-card is-featured">
              <span class="plan-badge">PREMIUM</span>
              <span class="plan-label">Assinatura mensal</span>
              <h3>Drive Mental</h3>
              <p>Acompanhe diferentes &aacute;reas da vida e mantenha suas prioridades vis&iacute;veis ao longo do tempo.</p>
              <ul>
                <li>${icon("check")} Novas consultas mensais</li>
                <li>${icon("check")} Outras &aacute;reas da vida</li>
                <li>${icon("check")} Hist&oacute;rico e snapshots</li>
                <li>${icon("check")} Linha do Tempo C&oacute;smica</li>
                <li>${icon("check")} Protocolos e registros pessoais</li>
              </ul>
              <div class="plan-price"><span>R$</span>29,90</div>
              ${CommercialPlanAction("monthly")}
            </article>
            <article class="plan-card is-guided">
              <span class="plan-badge">MENTOR</span>
              <span class="plan-label">Acompanhamento premium</span>
              <h3>Jornada Guiada</h3>
              <p>Transforme clareza em um plano acompanhado de 90 dias, com extens&atilde;o at&eacute; 180.</p>
              <ul>
                <li>${icon("check")} Plano baseado nas consultas</li>
                <li>${icon("check")} Dashboard de evolu&ccedil;&atilde;o e performance</li>
                <li>${icon("check")} Check-ins e di&aacute;rio de dificuldades</li>
                <li>${icon("check")} A&ccedil;&otilde;es pr&aacute;ticas adaptadas</li>
                <li>${icon("check")} Metas, marcos e alertas da jornada</li>
              </ul>
              <div class="plan-price"><span>R$</span>97,00</div>
              ${CommercialPlanAction("guided")}
            </article>
          </div>
        </section>

        <section id="faq" class="sales-section faq-section">
          <div class="section-heading">
            <span class="eyebrow">Perguntas frequentes</span>
            <h2>Respostas diretas antes de voc&ecirc; come&ccedil;ar.</h2>
          </div>
          <div class="faq-list">
            ${faqItems.map(([question, answer], index) => `
              <details ${index === 0 ? "open" : ""}>
                <summary><span>${question}</span>${icon("arrow")}</summary>
                <p>${answer}</p>
              </details>
            `).join("")}
          </div>
        </section>

        <section class="final-cta">
          ${BrandMark()}
          <span class="eyebrow">Comece com sua consulta gratuita</span>
          <h2>Transforme percep&ccedil;&atilde;o em dire&ccedil;&atilde;o.</h2>
          <p>Entre no Drive Mental e organize escolhas, prioridades e aprendizados em uma jornada com mais presen&ccedil;a e disciplina.</p>
          <div class="final-cta-actions">
            <button class="button-primary button-large" data-route="signup" type="button">Come&ccedil;ar minha jornada ${icon("arrow")}</button>
            <a class="button-ghost button-large" href="#premium">Comparar planos</a>
          </div>
          <small>Sem dados de pagamento &middot; Sem previs&otilde;es absolutas &middot; Uso consciente</small>
        </section>
      </main>
      <footer class="public-footer">
        <div class="footer-grid">
          <div class="footer-brand-column">
            <div class="public-brand">${BrandMark(true)}<span>Drive Mental</span></div>
            <p>Uma plataforma para organizar escolhas, pr&aacute;ticas e aprendizados com clareza, presen&ccedil;a e disciplina.</p>
          </div>
          <div>
            <strong>Plataforma</strong>
            <a href="#como-funciona">Como funciona</a>
            <a href="#o-que-recebe">O que voc&ecirc; recebe</a>
            <a href="#exemplo">Exemplo do mapa</a>
            <a href="#premium">Premium</a>
            <button data-route="login" type="button">Entrar</button>
          </div>
          <div>
            <strong>Recursos</strong>
            <a href="#exemplo">GPS do Sincron&aacute;rio</a>
            <a href="#o-que-recebe">Mapa dos 7 Chakras</a>
            <a href="#o-que-recebe">Protocolo Di&aacute;rio</a>
            <a href="#o-que-recebe">Linha do Tempo</a>
            <a href="#faq">Perguntas frequentes</a>
          </div>
          <div>
            <strong>Confian&ccedil;a</strong>
            <a href="/privacy.html">Privacidade e dados</a>
            <a href="/terms.html">Termos de uso</a>
            <a href="#transparencia">Aviso de responsabilidade</a>
            <a href="mailto:contato@driveastral.com">Contato</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 Drive Mental. Todos os direitos reservados.</span>
          <p>As leituras t&ecirc;m finalidade simb&oacute;lica, reflexiva e de autoconhecimento. N&atilde;o substituem orienta&ccedil;&atilde;o profissional.</p>
        </div>
      </footer>
    </div>
  `;
}

function AuthLayout(content, asideTitle, asideText) {
  return `
    <div class="auth-page">
      <button class="public-brand auth-brand" data-route="landing" type="button">
        ${BrandMark(true)}
        <span>Drive Mental</span>
      </button>
      <aside class="auth-aside">
        <div class="auth-aside-content">
          <span class="eyebrow">Sua jornada pessoal</span>
          <h2>${asideTitle}</h2>
          <p>${asideText}</p>
          <div class="auth-orbit"><span>${icon("compass")}</span></div>
        </div>
      </aside>
      <main class="auth-main">${content}</main>
    </div>
  `;
}

function AuthNotice() {
  return state.authNotice
    ? `<p class="auth-notice ${state.authNoticeKind === "error" ? "is-error" : ""}" role="alert" aria-live="polite">${state.authNotice}</p>`
    : "";
}

function AuthSessionLoadingScreen() {
  return AuthLayout(`
    <section class="auth-card" role="status" aria-live="polite">
      <div class="auth-heading">
        <span>Conta segura</span>
        <h1>Restaurando sua jornada</h1>
        <p>Aguarde enquanto confirmamos sua sess&atilde;o.</p>
      </div>
    </section>
  `, "Seu mapa continua com voc&ecirc;.", "Estamos recuperando sua conta e seus registros com seguran&ccedil;a.");
}

function LoginScreen() {
  const recoveryMode = isSupabaseMode()
    && new URLSearchParams(window.location.search || "").get("recovery") === "1";

  if (recoveryMode) {
    return AuthLayout(`
      <section class="auth-card">
        <div class="auth-heading">
          <span>Seguran&ccedil;a da conta</span>
          <h1>Crie uma nova senha</h1>
          <p>Use pelo menos 8 caracteres e evite repetir senhas de outros servi&ccedil;os.</p>
        </div>
        <form id="update-password-form" class="auth-form">
          <label><span>Nova senha</span><input name="password" type="password" autocomplete="new-password" placeholder="M&iacute;nimo de 8 caracteres" required /></label>
          ${AuthNotice()}
          <button class="button-primary button-large" type="submit">Atualizar senha ${icon("arrow")}</button>
        </form>
      </section>
    `, "Proteja sua jornada.", "A recupera&ccedil;&atilde;o de senha &eacute; processada com seguran&ccedil;a pelo Supabase Auth.");
  }

  return AuthLayout(`
    <section class="auth-card">
      <div class="auth-heading">
        <span>Bem-vindo de volta</span>
        <h1>Acesse sua conta</h1>
        <p>Continue de onde parou e consulte suas coordenadas.</p>
      </div>
      <form id="login-form" class="auth-form">
        <label><span>E-mail</span><input name="email" type="email" autocomplete="email" placeholder="voce@exemplo.com" required /></label>
        <label><span>Senha</span><input name="password" type="password" autocomplete="current-password" placeholder="${isSupabaseMode() ? "M&iacute;nimo de 8 caracteres" : "M&iacute;nimo de 6 caracteres"}" required /></label>
        ${AuthNotice()}
        <button class="button-primary button-large" type="submit">Entrar na plataforma ${icon("arrow")}</button>
        ${isSupabaseMode() ? '<button class="auth-text-action" data-reset-password type="button">Esqueci minha senha</button>' : ""}
      </form>
      ${isSupabaseMode() ? "" : `<div class="auth-demo-access">
        <span>ou</span>
        <button data-demo-login type="button">${icon("spark")} Acessar demonstra&ccedil;&atilde;o</button>
      </div>`}
      <p class="auth-switch">Ainda n&atilde;o possui conta? <button data-route="signup" type="button">Criar conta</button></p>
      <p class="local-access-note">${icon("info")} ${isSupabaseMode()
        ? "Sua conta e seus registros s&atilde;o sincronizados com seguran&ccedil;a."
        : "Nesta fase, o acesso &eacute; demonstrativo e fica salvo somente neste dispositivo."}</p>
    </section>
  `, "Seu mapa continua com voc&ecirc;.", "Acesse leituras, hist&oacute;rico e pr&aacute;ticas em uma experi&ecirc;ncia organizada para acompanhar seus ciclos.");
}

function SignupScreen() {
  return AuthLayout(`
    <section class="auth-card">
      <div class="auth-heading">
        <span>Comece sua jornada</span>
        <h1>Crie sua conta</h1>
        <p>Leva menos de dois minutos para preparar seu espa&ccedil;o.</p>
      </div>
      <form id="signup-form" class="auth-form">
        <label><span>Como podemos chamar voc&ecirc;?</span><input name="name" type="text" autocomplete="name" placeholder="Seu nome" required /></label>
        <label><span>E-mail</span><input name="email" type="email" autocomplete="email" placeholder="voce@exemplo.com" required /></label>
        <label><span>Crie uma senha</span><input name="password" type="password" autocomplete="new-password" placeholder="${isSupabaseMode() ? "M&iacute;nimo de 8 caracteres" : "M&iacute;nimo de 6 caracteres"}" required /></label>
        <label class="auth-consent"><input name="terms" type="checkbox" required /><span>Li e concordo com os <a href="/terms.html" target="_blank">Termos de Uso</a> e a <a href="/privacy.html" target="_blank">Pol&iacute;tica de Privacidade</a>.</span></label>
        ${AuthNotice()}
        <button class="button-primary button-large" type="submit">Continuar ${icon("arrow")}</button>
      </form>
      <p class="auth-switch">J&aacute; possui uma conta? <button data-route="login" type="button">Entrar</button></p>
    </section>
  `, "Um espa&ccedil;o para compreender seus ciclos.", "Organize suas coordenadas, registre momentos importantes e transforme leituras em a&ccedil;&otilde;es conscientes.");
}

function OnboardingAreaSelector() {
  const presentation = {
    general: ["Momento Atual", "Uma leitura mais ampla sobre seus ciclos e sua fase atual."],
    "work-prosperity": ["Vida Financeira", "Trabalho, organiza&ccedil;&atilde;o, prosperidade e decis&otilde;es financeiras."],
    "challenges-blocks": ["Desafios e Bloqueios", "Padr&otilde;es recorrentes, resist&ecirc;ncias e pontos de aten&ccedil;&atilde;o."],
    "energy-spirituality": ["Equil&iacute;brio e Energia", "Ritmo pessoal, disposi&ccedil;&atilde;o, limites e direcionamento."],
    purpose: ["Prop&oacute;sito e Dire&ccedil;&atilde;o", "Escolhas, voca&ccedil;&atilde;o, significado e pr&oacute;ximos movimentos."],
    "love-relationships": ["Relacionamentos", "Conex&otilde;es, conviv&ecirc;ncia, comunica&ccedil;&atilde;o e v&iacute;nculos."],
    "decisions-cycles": ["Mudan&ccedil;as e Ciclos", "Transi&ccedil;&otilde;es, encerramentos, come&ccedil;os e per&iacute;odos de adapta&ccedil;&atilde;o."],
  };
  const visualOrder = [
    "general",
    "purpose",
    "work-prosperity",
    "love-relationships",
    "challenges-blocks",
    "energy-spirituality",
    "decisions-cycles",
  ];
  const orderedAreas = [...consultationAreas].sort(
    (first, second) => visualOrder.indexOf(first.id) - visualOrder.indexOf(second.id),
  );
  return `
    <div class="onboarding-area-grid" role="radiogroup" aria-label="Tema que mais representa seu momento atual">
      ${orderedAreas.map((area) => {
        const [label, description] = presentation[area.id] || [area.shortTitle || area.title, area.description];
        return `
        <button
          class="${state.selectedAreaId === area.id ? "is-selected" : ""}"
          data-area-id="${area.id}"
          role="radio"
          aria-checked="${state.selectedAreaId === area.id ? "true" : "false"}"
          aria-selected="${state.selectedAreaId === area.id ? "true" : "false"}"
          aria-label="${label}: ${description}"
          type="button"
        >
          <i class="onboarding-area-icon" aria-hidden="true">${icon(area.icon)}</i>
          <span><strong>${label}</strong><small>${description}</small></span>
          <i class="onboarding-area-check" aria-hidden="true">${icon("check")}</i>
        </button>
      `;}).join("")}
    </div>
  `;
}

function OnboardingProcessingState() {
  const steps = [
    "Confirmando sua base pessoal",
    "Calculando a coordenada do dia",
    "Relacionando seus ciclos",
    "Aplicando a leitura ao tema escolhido",
    "Salvando seu resultado",
  ];
  const failed = state.firstReadingStatus === "failed";
  return `
    <section class="onboarding-processing ${failed ? "is-failed" : ""}" aria-live="polite" aria-busy="${failed ? "false" : "true"}">
      <span class="onboarding-processing-symbol">${icon(failed ? "info" : "spark")}</span>
      <div class="onboarding-processing-heading">
        <span>${failed ? "LEITURA PRESERVADA" : "PRIMEIRA LEITURA"}</span>
        <h1>${failed ? "Sua leitura poder&aacute; ser retomada." : "Estamos preparando sua primeira leitura."}</h1>
        <p>${failed
          ? "N&atilde;o foi poss&iacute;vel concluir sua leitura agora. Seus dados foram preservados e voc&ecirc; pode tentar novamente."
          : "Agora o Drive Mental est&aacute; organizando sua base pessoal, o ciclo do dia e a aplica&ccedil;&atilde;o no tema escolhido."}</p>
      </div>
      <ol class="onboarding-processing-steps">
        ${steps.map((label, index) => {
          const number = index + 1;
          const status = failed && number === state.firstReadingStep
            ? "is-error"
            : number < state.firstReadingStep
              ? "is-complete"
              : number === state.firstReadingStep
                ? "is-active"
                : "";
          return `<li class="${status}"><i>${status === "is-complete" ? icon("check") : number}</i><span>${label}</span></li>`;
        }).join("")}
      </ol>
      ${failed ? '<button class="button-primary button-large" data-retry-first-reading type="button">Tentar novamente</button>' : ""}
    </section>
  `;
}

function OnboardingScreen() {
  const selectedPresentation = {
    general: ["Momento Atual", "ao seu momento atual"],
    "work-prosperity": ["Vida Financeira", "&agrave; sua vida financeira"],
    "challenges-blocks": ["Desafios e Bloqueios", "aos seus desafios e bloqueios"],
    "energy-spirituality": ["Equil&iacute;brio e Energia", "ao seu equil&iacute;brio e energia"],
    purpose: ["Prop&oacute;sito e Dire&ccedil;&atilde;o", "ao seu prop&oacute;sito e dire&ccedil;&atilde;o"],
    "love-relationships": ["Relacionamentos", "aos seus relacionamentos"],
    "decisions-cycles": ["Mudan&ccedil;as e Ciclos", "&agrave;s suas mudan&ccedil;as e ciclos"],
  };
  const selectedArea = selectedPresentation[state.selectedAreaId] || null;
  const isSaving = isSupabaseMode() && state.authNotice === "Preparando sua leitura...";
  const birthStatus = state.birth ? validateBirthDateForProduct(state.birth).status : "empty";
  const isBirthValid = birthStatus === "valid";
  const birthStatusCopy = isBirthValid
    ? "Data confirmada para o c&aacute;lculo da sua base pessoal."
    : birthStatus === "empty"
      ? "Informe sua data completa para continuar."
      : "Verifique a data informada.";
  const isReady = Boolean(isBirthValid && state.selectedAreaId && !isSaving);
  if (["processing", "failed"].includes(state.firstReadingStatus)) {
    return `
      <div class="onboarding-page">
        <header class="onboarding-header">
          <div class="public-brand">${BrandMark(true)}<span>Drive Mental</span></div>
          <div class="onboarding-progress" aria-hidden="true"><span></span></div>
          <small>Preparando sua leitura</small>
        </header>
        <main class="onboarding-processing-main">${OnboardingProcessingState()}</main>
      </div>
    `;
  }
  return `
    <div class="onboarding-page">
      <header class="onboarding-header">
        <div class="public-brand">${BrandMark(true)}<span>Drive Mental</span></div>
        <div class="onboarding-progress" aria-hidden="true"><span></span></div>
        <small>Conhecendo seu momento</small>
      </header>
      <main class="onboarding-main">
        <section class="onboarding-copy">
          <span class="onboarding-badge">PRIMEIRA LEITURA</span>
          <h1>Vamos compreender o momento que voc&ecirc; est&aacute; vivendo.</h1>
          <p>Suas respostas ajudam o Drive Mental a organizar sua primeira leitura e apresentar seus ciclos de acordo com o momento e a &aacute;rea que voc&ecirc; deseja compreender.</p>
          <div class="onboarding-time">${icon("clock")}<strong>Voc&ecirc; levar&aacute; menos de 2 minutos.</strong></div>
          <ul class="onboarding-trust-list">
            <li>${icon("check")} Seus dados permanecem privados</li>
            <li>${icon("check")} A leitura ser&aacute; personalizada</li>
            <li>${icon("check")} Voc&ecirc; poder&aacute; alterar sua &aacute;rea de acompanhamento depois</li>
          </ul>
          <div class="onboarding-journey-visual" aria-label="Etapas da jornada: Momento, Leitura e Jornada">
            <span aria-hidden="true"></span>
            <div class="is-active"><i aria-hidden="true"></i><small>Momento</small></div>
            <div><i aria-hidden="true"></i><small>Leitura</small></div>
            <div><i aria-hidden="true"></i><small>Jornada</small></div>
          </div>
        </section>
        <form id="onboarding-form" class="onboarding-card">
          <div class="onboarding-field">
            <label for="onboarding-birth">Sua data de nascimento</label>
            <p>Ela ser&aacute; utilizada pelo motor do Drive Mental para calcular sua base pessoal dentro do Sincron&aacute;rio.</p>
            <div class="onboarding-input-wrap">${icon("calendar")}<input id="onboarding-birth" name="birth" type="date" value="${escapeHtml(state.birth)}" aria-describedby="onboarding-birth-help" required /></div>
            <small id="onboarding-birth-help" class="onboarding-field-status ${isBirthValid ? "is-valid" : birthStatus === "empty" ? "" : "is-invalid"}" aria-live="polite"><i aria-hidden="true">${icon("check")}</i><span>${birthStatusCopy}</span></small>
          </div>
          <div class="onboarding-field">
            <div class="onboarding-field-heading"><label>Qual tema mais representa o seu momento atual?</label><span>${selectedArea ? "Tema selecionado" : "Escolha um"}</span></div>
            <p>Escolha o assunto que hoje ocupa mais espa&ccedil;o na sua mente. Essa escolha n&atilde;o altera seus c&aacute;lculos; ela define como sua primeira leitura ser&aacute; aplicada.</p>
            ${OnboardingAreaSelector()}
            <div class="onboarding-selection-context ${selectedArea ? "is-visible" : ""}" aria-live="polite">
              ${selectedArea
                ? `${icon("target")}<p><strong>${selectedArea[0]}</strong><span>Vamos aplicar sua primeira leitura principalmente ${selectedArea[1]}, sem alterar os c&aacute;lculos originais do seu mapa.</span></p>`
                : `${icon("info")}<p><strong>Sua escolha orienta a aplica&ccedil;&atilde;o</strong><span>Selecione o tema que mais combina com seu momento atual.</span></p>`}
            </div>
          </div>
          ${AuthNotice()}
          <section class="onboarding-value" aria-labelledby="onboarding-value-title">
            <strong id="onboarding-value-title">Sua primeira leitura apresentar&aacute;:</strong>
            <ul>
              <li>${icon("check")} Sua base pessoal no Sincron&aacute;rio</li>
              <li>${icon("check")} O ciclo relacionado ao momento consultado</li>
              <li>${icon("check")} A aplica&ccedil;&atilde;o na &aacute;rea escolhida</li>
              <li>${icon("check")} Uma orienta&ccedil;&atilde;o inicial</li>
              <li>${icon("check")} Seu primeiro Drive</li>
            </ul>
          </section>
          <div class="onboarding-submit">
            <button class="button-primary button-large" type="submit" aria-live="polite" ${isReady ? "" : "disabled"}>${isSaving ? '<i class="button-spinner" aria-hidden="true"></i> Preparando sua leitura...' : `Criar minha primeira leitura ${icon("arrow")}`}</button>
            <small class="onboarding-submit-guidance" ${isReady || isSaving ? "hidden" : ""}>Preencha sua data e escolha um tema para continuar.</small>
            <small>Voc&ecirc; poder&aacute; revisar suas informa&ccedil;&otilde;es antes de iniciar uma nova consulta.</small>
          </div>
        </form>
      </main>
    </div>
  `;
}

function PortalSidebar() {
  const accountName = state.account && state.account.name ? state.account.name : state.name || "Minha conta";
  const activeRoute = state.route === "chakra-detail" ? "energy-cycle" : state.route;
  const items = [
    ["dashboard", "home", "Home"],
    ["my-day", "spark", "A&ccedil;&atilde;o do dia"],
    ["home", "compass", "Nova consulta"],
    ["energy-cycle", "lotus", "Ciclo Energ&eacute;tico"],
    ["journey", "calendar", "Jornada de 30 dias"],
    ["protocol", "protocol", "Protocolo di&aacute;rio"],
    ["profile", "user", "Meu perfil"],
  ];

  return `
    <aside class="portal-sidebar">
      <button class="portal-brand" data-route="dashboard" type="button">${BrandMark(true)}<span>Drive Mental</span></button>
      <nav aria-label="Navega&ccedil;&atilde;o da plataforma">
        <span>PLATAFORMA</span>
        ${items.map(([route, iconName, label]) => `
          <button class="${activeRoute === route ? "is-active" : ""}" data-route="${route}" type="button">
            ${icon(iconName)}<span>${label}</span>
          </button>
        `).join("")}
      </nav>
      <div class="sidebar-account">
        <span>${escapeHtml(accountName).slice(0, 1).toUpperCase()}</span>
        <div><strong>${escapeHtml(accountName)}</strong><small>${state.account && state.account.email ? escapeHtml(state.account.email) : "Perfil local"}</small></div>
        <button data-signout type="button" aria-label="Sair">${icon("back")}</button>
      </div>
    </aside>
  `;
}

function PortalTopbar() {
  const titles = {
    dashboard: ["Home", "Resumo da sua plataforma"],
    "my-day": ["A&ccedil;&atilde;o do dia", "Sua dire&ccedil;&atilde;o e seu pr&oacute;ximo passo"],
    home: ["Nova consulta", "Escolha uma &aacute;rea e gere suas coordenadas"],
    chakras: ["Resultado da consulta", "Seu mapa completo foi calculado"],
    "energy-cycle": ["Ciclo Energ&eacute;tico", "Plasmas, chakras e ciclo natural"],
    history: ["Hist&oacute;rico", "Leituras e marcos preservados"],
    protocol: ["Protocolo di&aacute;rio", "Pr&aacute;ticas para trazer a leitura ao cotidiano"],
    journey: ["Jornada de 30 dias", "Frases e a&ccedil;&otilde;es para acompanhar seu ciclo"],
    profile: ["Meu perfil", "Dados, prefer&ecirc;ncias e configura&ccedil;&otilde;es"],
  };
  const [title, subtitle] = titles[state.route] || ["Drive Mental", "Sua jornada de clareza e disciplina"];

  return `
    <header class="portal-topbar">
      <div><h1>${title}</h1><p>${subtitle}</p></div>
      <div class="topbar-actions">
        <span class="premium-pill">${icon("spark")} ${currentPlanBadge()}</span>
        <button class="topbar-avatar" data-route="profile" type="button">${escapeHtml((state.account && state.account.name) || state.name || "D").slice(0, 1).toUpperCase()}</button>
      </div>
    </header>
  `;
}

function CosmicBackground() {
  return `
    <div class="cosmic-background" data-component="CosmicBackground" aria-hidden="true">
      <span class="cosmic-depth"></span>
      <span class="cosmic-nebula nebula-green"></span>
      <span class="cosmic-nebula nebula-gold"></span>
      <span class="cosmic-nebula nebula-blue"></span>
      <span class="cosmic-nebula nebula-violet"></span>
      <span class="star-field"></span>
      <span class="star-layer stars-mid"></span>
      <span class="star-layer stars-near"></span>
      <div class="constellation-field-wrap">
        <canvas class="constellation-field"></canvas>
      </div>
      <span class="cosmic-orbit orbit-one"></span>
      <span class="cosmic-orbit orbit-two"></span>
      <span class="cosmic-glints">
        <i></i><i></i><i></i><i></i><i></i><i></i>
      </span>
      <span class="cosmic-vignette"></span>
    </div>
  `;
}

function PlatformShell(content) {
  return `
    <div class="app-shell platform-shell platform-route-${state.route}">
      ${CosmicBackground()}
      ${PortalSidebar()}
      <section class="portal-main">
        ${PortalTopbar()}
        <main class="screen portal-content screen-${state.route}">${content}</main>
      </section>
      ${BottomNavigation()}
      ${UpgradeModal()}
    </div>
  `;
}

function mergedAdminSettings(source = state.adminSettings) {
  const defaults = defaultAdminSettings();
  return {
    general: { ...defaults.general, ...(source && source.general ? source.general : {}) },
    plans: { ...defaults.plans, ...(source && source.plans ? source.plans : {}) },
    checkout: { ...defaults.checkout, ...(source && source.checkout ? source.checkout : {}) },
    methodology: { ...defaults.methodology, ...(source && source.methodology ? source.methodology : {}) },
  };
}

function adminFallbackPlans(settings = mergedAdminSettings()) {
  return [
    {
      plan_id: "free",
      display_name: "Consulta gratuita",
      badge: "BASE",
      price_label: "0,00",
      billing_label: "primeiro acesso",
      description: "Entrada inicial para gerar a primeira leitura e conhecer a plataforma.",
      cta_text: "CRIAR MEU MAPA",
      is_visible: true,
      features: ["Primeira consulta", "Mapa essencial", "Historico local"],
    },
    {
      plan_id: "premium",
      display_name: "Drive Mental",
      badge: settings.plans.premiumBadge,
      price_label: settings.plans.premiumPrice,
      billing_label: "mensal",
      description: "Consultas recorrentes, historico e recursos premium da plataforma.",
      cta_text: settings.plans.ctaText,
      is_visible: settings.plans.premiumVisible,
      features: ["Novas consultas mensais", "Historico e snapshots", "Protocolos pessoais"],
    },
    {
      plan_id: "mentor",
      display_name: "Jornada Guiada",
      badge: settings.plans.mentorBadge,
      price_label: settings.plans.mentorPrice,
      billing_label: "acompanhamento",
      description: "Plano acompanhado para transformar consultas em plano de acao.",
      cta_text: settings.plans.ctaText,
      is_visible: settings.plans.mentorVisible,
      features: ["Dashboard de evolucao", "Check-ins", "Metas e alertas da jornada"],
    },
  ];
}

function adminPlanRows() {
  return state.adminPlans && state.adminPlans.length
    ? state.adminPlans
    : adminFallbackPlans();
}

function adminAccessForUser(userId) {
  const plans = Array.isArray(state.adminUserAccessPlans) ? state.adminUserAccessPlans : [];
  return plans.find((plan) => plan.user_id === userId) || null;
}

function adminUserDisplayName(user) {
  return user.display_name || user.email || "Usuario sem nome";
}

function adminAccessStatusOptions() {
  return [
    ["active", "Ativo"],
    ["paused", "Pausado"],
    ["expired", "Expirado"],
    ["canceled", "Cancelado"],
    ["courtesy", "Cortesia"],
  ];
}

function adminNoticeMarkup() {
  if (!state.adminNotice) {
    return "";
  }
  return `<p class="form-notice ${state.adminNoticeKind === "error" ? "is-error" : ""}" role="status">${state.adminNotice}</p>`;
}

function adminPlanFeaturesText(plan) {
  if (Array.isArray(plan.features)) {
    return plan.features.join("\n");
  }
  return String(plan.features || "");
}

function adminPlansWithUpdate(plan) {
  const existing = adminPlanRows().filter((item) => item.plan_id !== plan.plan_id);
  return [...existing, plan].sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
}

function adminAccessPlansWithUpdate(access) {
  return [
    access,
    ...(Array.isArray(state.adminUserAccessPlans)
      ? state.adminUserAccessPlans.filter((item) => item.user_id !== access.user_id)
      : []),
  ];
}

function AdminSidebar() {
  const items = [
    ["admin-dashboard", "chart", "Dashboard"],
    ["admin-users", "user", "Usu&aacute;rios"],
    ["admin-plans", "dollar", "Planos"],
    ["admin-settings", "spark", "Configura&ccedil;&otilde;es"],
  ];
  return `
    <aside class="portal-sidebar admin-sidebar">
      <button class="portal-brand" data-route="admin-dashboard" type="button">${BrandMark(true)}<span>Admin</span></button>
      <nav aria-label="Navega&ccedil;&atilde;o administrativa">
        <span>ADMINISTRA&Ccedil;&Atilde;O</span>
        ${items.map(([route, iconName, label]) => `
          <button class="${state.route === route ? "is-active" : ""}" data-route="${route}" type="button">
            ${icon(iconName)}<span>${label}</span>
          </button>
        `).join("")}
      </nav>
      <div class="sidebar-account">
        <span>${escapeHtml((state.account && state.account.name) || "A").slice(0, 1).toUpperCase()}</span>
        <div><strong>${escapeHtml((state.account && state.account.name) || "Admin")}</strong><small>${escapeHtml(state.adminRole || "preview local")}</small></div>
        <button data-route="dashboard" type="button" aria-label="Voltar para plataforma">${icon("back")}</button>
      </div>
    </aside>
  `;
}

function AdminShell(content, title = "Admin", subtitle = "Gest&atilde;o da plataforma") {
  return `
    <div class="app-shell platform-shell admin-shell platform-route-${state.route}">
      ${CosmicBackground()}
      ${AdminSidebar()}
      <section class="portal-main admin-main">
        <header class="portal-topbar admin-topbar">
          <div><h1>${title}</h1><p>${subtitle}</p></div>
          <div class="topbar-actions">
            <span class="premium-pill">${icon("spark")} ${isSupabaseMode() ? "Role verificada" : "Preview local"}</span>
          </div>
        </header>
        <main class="screen portal-content admin-content screen-${state.route}">${content}</main>
      </section>
    </div>
  `;
}

function AdminAccessLoadingScreen() {
  return AdminShell(
    GoldenCard(`
      <h2 class="settings-title">Verificando permiss&atilde;o administrativa</h2>
      <p class="transparency-note">A &aacute;rea admin exige uma conta com role ativa em <strong>admin_roles</strong>.</p>
    `, "admin-status-card"),
    "Admin",
    "Verifica&ccedil;&atilde;o de acesso",
  );
}

function AdminAccessDeniedScreen() {
  return AdminShell(
    GoldenCard(`
      <h2 class="settings-title">Acesso administrativo n&atilde;o liberado</h2>
      <p class="transparency-note">Sua conta est&aacute; autenticada, mas n&atilde;o possui permiss&atilde;o admin ativa.</p>
      <p class="transparency-note">Para liberar acesso, registre seu usu&aacute;rio na tabela <strong>admin_roles</strong> com uma role ativa.</p>
    `, "admin-status-card"),
    "Admin",
    "Acesso restrito",
  );
}

function AdminDashboardScreen() {
  const settings = mergedAdminSettings();
  const userCount = state.adminUsersLoaded ? state.adminUsers.length : "-";
  const planCount = adminPlanRows().filter((plan) => plan.is_visible !== false).length;
  return AdminShell(`
    <section class="admin-overview-strip">
      ${GoldenCard(`
        <span class="admin-kpi-label">Usu&aacute;rios</span>
        <strong class="admin-kpi-value">${escapeHtml(String(userCount))}</strong>
        <small>Cadastros e libera&ccedil;&atilde;o manual de acesso.</small>
      `, "admin-kpi-card")}
      ${GoldenCard(`
        <span class="admin-kpi-label">Planos vis&iacute;veis</span>
        <strong class="admin-kpi-value">${escapeHtml(String(planCount))}</strong>
        <small>Drive Mental, Mentor e varia&ccedil;&otilde;es comerciais.</small>
      `, "admin-kpi-card")}
      ${GoldenCard(`
        <span class="admin-kpi-label">Checkout</span>
        <strong class="admin-kpi-value">${escapeHtml(settings.checkout.provider.toUpperCase())}</strong>
        <small>Pagamento externo, acesso liberado manualmente.</small>
      `, "admin-kpi-card")}
    </section>
    <section class="admin-management-grid">
      ${GoldenCard(`
        <span class="admin-card-icon">${icon("user")}</span>
        <h2 class="settings-title">Gerenciar Usu&aacute;rios</h2>
        <p class="transparency-note">Consulte cadastros, veja plano atual e prepare libera&ccedil;&atilde;o manual depois da compra externa.</p>
        <button class="button-primary" data-route="admin-users" type="button">Abrir Usu&aacute;rios ${icon("arrow")}</button>
      `, "admin-management-card")}
      ${GoldenCard(`
        <span class="admin-card-icon">${icon("dollar")}</span>
        <h2 class="settings-title">Gerenciar Planos</h2>
        <p class="transparency-note">Revise nomes, valores, badges, visibilidade e rela&ccedil;&atilde;o com checkout externo.</p>
        <button class="button-primary" data-route="admin-plans" type="button">Abrir Planos ${icon("arrow")}</button>
      `, "admin-management-card")}
      ${GoldenCard(`
        <span class="admin-card-icon">${icon("spark")}</span>
        <h2 class="settings-title">Configura&ccedil;&otilde;es</h2>
        <p class="transparency-note">Controle plataforma, CTAs, links de checkout e regras da metodologia lunar.</p>
        <button class="button-ghost" data-route="admin-settings" type="button">Abrir Configura&ccedil;&otilde;es ${icon("arrow")}</button>
      `, "admin-management-card")}
    </section>
  `, "Painel Admin", "Resumo operacional e atalhos de gest&atilde;o");
}

function AdminUsersScreen() {
  const users = Array.isArray(state.adminUsers) ? state.adminUsers : [];
  const planOptions = adminPlanRows();
  const statusOptions = adminAccessStatusOptions();
  const rows = users.map((user) => {
    const access = adminAccessForUser(user.user_id);
    const currentPlanId = access ? access.plan_id : "free";
    const currentStatus = access ? access.status : "active";
    return `
      <tr>
        <td><strong>${escapeHtml(adminUserDisplayName(user))}</strong><small>${escapeHtml(user.email || "")}</small></td>
        <td>${escapeHtml(user.primary_area_id || "Sem area")}</td>
        <td><span class="admin-status-pill">${escapeHtml(currentPlanId)}</span></td>
        <td>${escapeHtml(currentStatus)}</td>
        <td>${escapeHtml(user.created_at ? formatDatePtBr(user.created_at.slice(0, 10)) : "-")}</td>
        <td>
          <form class="admin-access-form" data-admin-access-form>
            <input name="userId" type="hidden" value="${escapeHtml(user.user_id)}" />
            <label class="admin-compact-field">
              <span>Plano</span>
              <select name="planId">
                ${planOptions.map((plan) => `<option value="${escapeHtml(plan.plan_id)}" ${currentPlanId === plan.plan_id ? "selected" : ""}>${escapeHtml(plan.display_name || plan.plan_id)}</option>`).join("")}
              </select>
            </label>
            <label class="admin-compact-field">
              <span>Status</span>
              <select name="status">
                ${statusOptions.map(([value, label]) => `<option value="${value}" ${currentStatus === value ? "selected" : ""}>${label}</option>`).join("")}
              </select>
            </label>
            <button class="button-primary" type="submit" ${state.adminSaving ? "disabled" : ""}>Salvar</button>
          </form>
        </td>
      </tr>
    `;
  }).join("");

  return AdminShell(`
    ${adminNoticeMarkup()}
    <section class="admin-page-heading">
      <div>
        <span class="eyebrow">ACESSOS</span>
        <h2>Gerenciamento de usu&aacute;rios</h2>
        <p>Esta tela lista os perfis cadastrados e prepara a libera&ccedil;&atilde;o manual de Premium ou Mentor ap&oacute;s pagamento externo.</p>
      </div>
      <button class="button-primary" data-route="admin-settings" type="button">Configurar checkout ${icon("arrow")}</button>
    </section>
    ${GoldenCard(`
      <div class="admin-table-header">
        <div><h2 class="settings-title">Usu&aacute;rios cadastrados</h2><p class="transparency-note">${state.adminUsersLoading ? "Carregando dados..." : "Perfis vis&iacute;veis para administradores."}</p></div>
      </div>
      ${rows ? `
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>Usu&aacute;rio</th><th>&Aacute;rea</th><th>Plano</th><th>Status</th><th>Cadastro</th><th>Acesso</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      ` : `
        <div class="admin-empty-state">
          <strong>Nenhum usu&aacute;rio listado ainda</strong>
          <span>Quando houver cadastros com permiss&atilde;o de leitura admin, eles aparecer&atilde;o aqui.</span>
        </div>
      `}
    `, "admin-wide-card admin-table-card")}
  `, "Usu&aacute;rios", "Cadastros, acessos e planos manuais");
}

function AdminPlansScreen() {
  const plans = adminPlanRows();
  return AdminShell(`
    ${adminNoticeMarkup()}
    <section class="admin-page-heading">
      <div>
        <span class="eyebrow">COMERCIAL</span>
        <h2>Gerenciamento de planos</h2>
        <p>Controle a oferta exibida, os valores comerciais e a rela&ccedil;&atilde;o com os links externos de checkout.</p>
      </div>
      <button class="button-primary" data-route="admin-settings" type="button">Editar valores ${icon("arrow")}</button>
    </section>
    <section class="admin-plan-grid">
      ${plans.map((plan) => GoldenCard(`
        <form class="admin-plan-edit-form" data-admin-plan-form>
          <input name="planId" type="hidden" value="${escapeHtml(plan.plan_id)}" />
          <input name="sortOrder" type="hidden" value="${escapeHtml(String(plan.sort_order || 0))}" />
          <div class="admin-plan-heading">
            <span class="admin-status-pill">${escapeHtml(plan.badge || plan.plan_id)}</span>
            <label class="admin-check"><input name="isVisible" type="checkbox" ${plan.is_visible === false ? "" : "checked"} /> <span>Vis&iacute;vel</span></label>
          </div>
          <label class="admin-field"><span>Nome do plano</span><input name="displayName" value="${escapeHtml(plan.display_name || plan.plan_id)}" /></label>
          <div class="admin-two-columns">
            <label class="admin-field"><span>Badge</span><input name="badge" value="${escapeHtml(plan.badge || "")}" /></label>
            <label class="admin-field"><span>Valor</span><input name="priceLabel" value="${escapeHtml(plan.price_label || "0,00")}" /></label>
          </div>
          <label class="admin-field"><span>Cobran&ccedil;a</span><input name="billingLabel" value="${escapeHtml(plan.billing_label || "")}" /></label>
          <label class="admin-field"><span>Texto do bot&atilde;o</span><input name="ctaText" value="${escapeHtml(plan.cta_text || "INICIAR A MINHA JORNADA")}" /></label>
          <label class="admin-field"><span>URL do checkout externo</span><input name="checkoutUrl" type="url" value="${escapeHtml(plan.checkout_url || "")}" placeholder="https://..." /></label>
          <label class="admin-field"><span>Descri&ccedil;&atilde;o</span><textarea name="description" rows="3">${escapeHtml(plan.description || "")}</textarea></label>
          <label class="admin-field"><span>Benef&iacute;cios, um por linha</span><textarea name="features" rows="4">${escapeHtml(adminPlanFeaturesText(plan))}</textarea></label>
          <button class="button-primary" type="submit" ${state.adminSaving ? "disabled" : ""}>Salvar plano ${icon("arrow")}</button>
        </form>
      `, "admin-plan-card")).join("")}
    </section>
  `, "Planos", "Catalogo comercial e visibilidade");
}

function AdminSettingsScreen() {
  const settings = mergedAdminSettings();
  const statusOptions = ["beta", "homologacao", "producao"];
  const providerOptions = ["hotmart", "kiwify", "outro"];
  const leapPolicyOptions = ["blocked", "manual", "previous_day"];

  return AdminShell(`
    <form id="admin-settings-form" class="admin-settings-form">
      ${adminNoticeMarkup()}
      ${isSupabaseMode() && state.adminSettingsLoading ? `<p class="transparency-note">Carregando configura&ccedil;&otilde;es publicadas...</p>` : ""}
      <section class="admin-settings-grid">
        ${GoldenCard(`
          <h2 class="settings-title">Configura&ccedil;&otilde;es gerais</h2>
          <label class="admin-field"><span>Nome da plataforma</span><input name="platformName" value="${escapeHtml(settings.general.platformName)}" /></label>
          <label class="admin-field"><span>E-mail de suporte</span><input name="supportEmail" type="email" value="${escapeHtml(settings.general.supportEmail)}" /></label>
          <label class="admin-field"><span>Status</span><select name="environmentStatus">
            ${statusOptions.map((option) => `<option value="${option}" ${settings.general.environmentStatus === option ? "selected" : ""}>${option}</option>`).join("")}
          </select></label>
          <label class="admin-check"><input name="maintenanceMode" type="checkbox" ${settings.general.maintenanceMode ? "checked" : ""} /> <span>Modo manuten&ccedil;&atilde;o</span></label>
          <label class="admin-field"><span>Mensagem global</span><textarea name="globalNotice" rows="3">${escapeHtml(settings.general.globalNotice)}</textarea></label>
        `, "admin-settings-card")}
        ${GoldenCard(`
          <h2 class="settings-title">Planos e CTAs</h2>
          <div class="admin-two-columns">
            <label class="admin-field"><span>Badge Premium</span><input name="premiumBadge" value="${escapeHtml(settings.plans.premiumBadge)}" /></label>
            <label class="admin-field"><span>Valor Premium</span><input name="premiumPrice" value="${escapeHtml(settings.plans.premiumPrice)}" /></label>
            <label class="admin-field"><span>Badge Mentor</span><input name="mentorBadge" value="${escapeHtml(settings.plans.mentorBadge)}" /></label>
            <label class="admin-field"><span>Valor Mentor</span><input name="mentorPrice" value="${escapeHtml(settings.plans.mentorPrice)}" /></label>
          </div>
          <label class="admin-field"><span>Texto dos bot&otilde;es</span><input name="ctaText" value="${escapeHtml(settings.plans.ctaText)}" /></label>
          <label class="admin-check"><input name="premiumVisible" type="checkbox" ${settings.plans.premiumVisible ? "checked" : ""} /> <span>Exibir plano Premium</span></label>
          <label class="admin-check"><input name="mentorVisible" type="checkbox" ${settings.plans.mentorVisible ? "checked" : ""} /> <span>Exibir plano Mentor</span></label>
        `, "admin-settings-card")}
        ${GoldenCard(`
          <h2 class="settings-title">Checkout externo</h2>
          <label class="admin-field"><span>Provedor principal</span><select name="provider">
            ${providerOptions.map((option) => `<option value="${option}" ${settings.checkout.provider === option ? "selected" : ""}>${option}</option>`).join("")}
          </select></label>
          <label class="admin-field"><span>URL checkout Premium</span><input name="premiumCheckoutUrl" type="url" value="${escapeHtml(settings.checkout.premiumCheckoutUrl)}" placeholder="https://..." /></label>
          <label class="admin-field"><span>URL checkout Mentor</span><input name="mentorCheckoutUrl" type="url" value="${escapeHtml(settings.checkout.mentorCheckoutUrl)}" placeholder="https://..." /></label>
          <label class="admin-field"><span>Instru&ccedil;&atilde;o ap&oacute;s pagamento</span><textarea name="accessInstruction" rows="3">${escapeHtml(settings.checkout.accessInstruction)}</textarea></label>
        `, "admin-settings-card")}
        ${GoldenCard(`
          <h2 class="settings-title">Metodologia lunar</h2>
          <div class="admin-two-columns">
            <label class="admin-field"><span>Vers&atilde;o ativa</span><input name="activeVersion" value="${escapeHtml(settings.methodology.activeVersion)}" /></label>
            <label class="admin-field"><span>Vers&atilde;o rascunho</span><input name="draftVersion" value="${escapeHtml(settings.methodology.draftVersion)}" /></label>
          </div>
          <label class="admin-field"><span>Pol&iacute;tica para 29/02</span><select name="leapDayPolicy">
            ${leapPolicyOptions.map((option) => `<option value="${option}" ${settings.methodology.leapDayPolicy === option ? "selected" : ""}>${option}</option>`).join("")}
          </select></label>
          <label class="admin-check"><input name="dailyPhraseEnabled" type="checkbox" ${settings.methodology.dailyPhraseEnabled ? "checked" : ""} /> <span>Frase do dia ativa</span></label>
          <label class="admin-check"><input name="mantraEnabled" type="checkbox" ${settings.methodology.mantraEnabled ? "checked" : ""} /> <span>Mantras ativos</span></label>
        `, "admin-settings-card")}
      </section>
      <div class="admin-settings-actions">
        <button class="button-ghost" data-route="admin-dashboard" type="button">Voltar ao dashboard</button>
        <button class="button-primary" type="submit" ${state.adminSettingsLoading ? "disabled" : ""}>Salvar Configura&ccedil;&otilde;es ${icon("arrow")}</button>
      </div>
    </form>
  `, "Configura&ccedil;&otilde;es", "Planos, checkout, metodologia e opera&ccedil;&atilde;o");
}

function AppHeader(title, subtitle, options = {}) {
  const backRoute = options.backRoute || "home";
  const backButton = options.back
    ? `<button class="icon-button" data-route="${backRoute}" aria-label="Voltar">${icon("back")}</button>`
    : `<span class="header-spacer"></span>`;

  return `
    <header class="app-header">
      ${backButton}
      <div class="app-header-copy">
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      <button class="icon-button" aria-label="Informa&ccedil;&otilde;es">${icon("info")}</button>
    </header>
  `;
}

function AstralEmblem() {
  return `
    <div class="astral-emblem-wrap" aria-hidden="true">
      <div class="sacred-ring ring-a"></div>
      <div class="sacred-ring ring-b"></div>
      <div class="ray-field"></div>
      <div class="astral-emblem">
        ${icon("meditate")}
      </div>
    </div>
  `;
}

function AstralHeader() {
  return `
    <section class="astral-hero">
      ${AstralEmblem()}
      <h1>DRIVE MENTAL</h1>
      <p>Sincron&aacute;rio C&oacute;smico &amp; Mapa Energ&eacute;tico Visual</p>
    </section>
  `;
}

function GoldenDivider(label = "✦") {
  return `
    <div class="golden-divider" aria-hidden="true">
      <span></span>
      <strong>${label}</strong>
      <span></span>
    </div>
  `;
}

function GoldenCard(content, className = "") {
  return `<section class="golden-card ${className}">${content}</section>`;
}

function GoldenInput({ label, name, value, placeholder, type, iconName }) {
  return `
    <label class="field-group">
      <span>${label}</span>
      <span class="golden-input">
        ${icon(iconName)}
        <input name="${name}" type="${type}" value="${escapeHtml(value || "")}" placeholder="${placeholder}" autocomplete="off" />
      </span>
    </label>
  `;
}

function HomeNotice() {
  if (!state.notice) {
    return "";
  }

  if (state.noticeKind === "pending_method_decision") {
    return `
      <section class="form-notice form-notice-special" role="alert">
        <strong>29 de fevereiro possui regra especial e ainda n&atilde;o est&aacute; dispon&iacute;vel nesta vers&atilde;o.</strong>
        <p>A data 29 de fevereiro possui tratamento especial no Sincron&aacute;rio das 13 Luas.</p>
        <p>Algumas fontes atribuem um Kin ao dia 29/02, enquanto a refer&ecirc;ncia metodol&oacute;gica utilizada pelo Drive Mental trata essa data como 0.0 Hunab Ku, exigindo uma decis&atilde;o espec&iacute;fica.</p>
        <p>Para evitar uma leitura incorreta, esta vers&atilde;o ainda n&atilde;o gera automaticamente leituras para nascidos em 29/02.</p>
        <small>Voc&ecirc; poder&aacute; continuar quando a regra metodol&oacute;gica de 29/02 for definida no Drive Mental.</small>
      </section>
    `;
  }

  return `<p class="form-notice" role="alert">${state.notice}</p>`;
}

function ConsultationAreaSelector() {
  const isMissing = state.areaCarouselTouched && !state.selectedAreaId;
  const selectedIndex = consultationAreas.findIndex((area) => area.id === state.selectedAreaId);
  const consultationLocked = freeConsultationUsed();

  return `
    <div class="theme-selector area-selector ${isMissing ? "is-alert" : ""} ${state.areaCarouselTouched ? "is-touched" : ""}">
      <div class="area-selector-heading">
        <span class="selector-label">Onde voc&ecirc; deseja aplicar sua leitura de hoje?</span>
        <small>${consultationLocked ? "Sua consulta gratuita j&aacute; foi usada. Ative um plano para liberar novas &aacute;reas." : "A escolha contextualiza a pr&aacute;tica, sem alterar os c&aacute;lculos"}</small>
      </div>
      <div class="area-carousel" role="radiogroup" aria-label="&Aacute;rea de aplica&ccedil;&atilde;o da leitura">
        ${consultationAreas
          .map(
            (area, index) => {
              const areaLocked = !canStartConsultationForArea(area.id);
              const actionAttrs = areaLocked
                ? `data-open-upgrade-modal data-upgrade-area-id="${escapeHtml(area.id)}" aria-disabled="true"`
                : `data-area-id="${escapeHtml(area.id)}"`;
              return `
              <button
                class="theme-option area-option ${state.selectedAreaId === area.id ? "is-selected" : ""} ${areaLocked ? "is-locked" : ""}"
                ${actionAttrs}
                role="radio"
                aria-checked="${!areaLocked && state.selectedAreaId === area.id ? "true" : "false"}"
                aria-label="${escapeHtml(area.title)}"
                type="button"
              >
                <span class="area-option-icon">${icon(area.icon)}</span>
                <span class="area-option-copy">
                  <strong>${area.shortTitle || area.title}</strong>
                  <small>${areaLocked ? "Desbloqueie no plano Drive Mental." : area.description}</small>
                </span>
                <span class="area-option-check" aria-hidden="true">${icon(areaLocked ? "unlock" : "check")}</span>
              </button>
            `;
            },
          )
          .join("")}
      </div>
      <div class="area-carousel-footer">
        <span class="area-carousel-hint">Deslize para ver mais &aacute;reas</span>
        <span class="area-carousel-dots" aria-hidden="true">
          ${consultationAreas
            .map((area, index) => `<span class="${index === selectedIndex && !consultationLocked ? "is-active" : ""}"></span>`)
            .join("")}
        </span>
      </div>
    </div>
  `;
}

function PrimaryEnergyButton(text, attrs = "") {
  return `
    <button class="primary-energy-button" ${attrs}>
      ${icon("spark")}
      <span>${text}</span>
    </button>
  `;
}

function EmptyState() {
  return `
    <section class="empty-state">
      ${GoldenDivider("✹")}
      <p><strong>Nenhuma consulta salva.</strong><br />Sintonize para criar seu primeiro relat&oacute;rio permanente de luz.</p>
    </section>
  `;
}

function BottomNavigation() {
  const items = [
    { route: "dashboard", label: "Home", iconName: "home" },
    { route: "my-day", label: "A&ccedil;&atilde;o", iconName: "spark" },
    { route: "home", label: "Consulta", iconName: "compass" },
    { route: "journey", label: "Jornada", iconName: "calendar" },
    { route: "profile", label: "Perfil", iconName: "profile" },
  ];

  return `
    <nav class="bottom-navigation" aria-label="Navega&ccedil;&atilde;o principal">
      ${items
        .map(
          (item) => `
            <button class="nav-item ${state.route === item.route ? "is-active" : ""}" data-route="${item.route}">
              ${icon(item.iconName)}
              <span>${item.label}</span>
            </button>
          `,
        )
        .join("")}
    </nav>
  `;
}
function DailyDirectionSection() {
  const name = (state.account && state.account.name) || state.name || "viajante";
  const kin = personalKin(state.reading);
  const guidance = readingGuidance(state.reading);
  const interpretation = guidance && guidance.interpretation;
  const areaId = interpretation ? interpretation.areaId : "general";
  const direction = essentialDirectionCopy[areaId] || essentialDirectionCopy.general;
  const suggestedAction = interpretation && (interpretation.dailyPractice || interpretation.suggestedPractice);
  const suggestedQuestion = interpretation && interpretation.reflectionQuestion;
  const journeyProgress = kin ? loadJourneyProgress() : null;
  const journeyDay = journeyProgress ? currentJourneyDay(journeyProgress) : 1;
  const journeyCompletedCount = journeyProgress
    ? (Array.isArray(journeyProgress.completedDays) ? journeyProgress.completedDays.length : 0)
    : 0;
  const journeyCompleted = journeyCompletedCount >= 30;
  const journeyToday = journeyProgress ? journeyPlan()[journeyDay - 1] : null;
  const todayMantra = journeyToday ? decodeStoredText(journeyToday.mantra) : decodeStoredText(direction.mantra);
  const todayAction = journeyToday
    ? decodeStoredText(journeyToday.action)
    : decodeStoredText(suggestedAction || "Escolha uma a&ccedil;&atilde;o simples e conclua antes de iniciar outra.");
  const todayQuestion = suggestedQuestion
    ? decodeStoredText(suggestedQuestion)
    : "O que merece sua aten&ccedil;&atilde;o agora?";

  if (!kin) {
    return `
      <section class="dashboard-start-card">
        <span class="dashboard-start-symbol">${icon("spark")}</span>
        <div>
          <span class="eyebrow">OL&Aacute;, ${escapeHtml(name).toUpperCase()}</span>
          <h2>Comece com uma &uacute;nica pergunta.</h2>
          <p>Escolha a &aacute;rea da vida que pede clareza. Sua primeira leitura entregar&aacute; uma dire&ccedil;&atilde;o, uma frase e uma a&ccedil;&atilde;o para hoje.</p>
          <button class="button-primary" data-route="home" type="button">${icon("compass")} Fazer primeira consulta</button>
        </div>
      </section>
    `;
  }

  const areaObj = consultationAreas.find((a) => a.id === areaId);
  const areaTitle = areaObj ? areaObj.title : "Vis&atilde;o Geral";

  const readingDateVal = state.reading && state.reading.input && state.reading.input.current_date && state.reading.input.current_date.value;
  const displayDate = readingDateVal ? formatReadingCreatedAtLong(readingDateVal) : "Data indispon&iacute;vel";

  const completedDays = journeyProgress ? (Array.isArray(journeyProgress.completedDays) ? journeyProgress.completedDays : []) : [];
  const todayCompleted = completedDays.includes(journeyDay);

  let journeyStatusText = "Jornada ainda não iniciada";
  if (journeyProgress) {
    if (journeyCompleted) {
      journeyStatusText = "Jornada conclu&iacute;da";
    } else {
      journeyStatusText = `Dia ${journeyDay} de 30`;
    }
  }

  const protocolProgress = loadProtocolProgress();
  const completedMomentsCount = Math.min(3, Math.max(0, Array.isArray(protocolProgress.completed)
    ? protocolProgress.completed.length
    : 0));

  let protocolStatusText = "Você ainda não iniciou o protocolo de hoje.";
  let dayStatusText = "Disponível para iniciar";

  if (todayCompleted) {
    dayStatusText = "Encerrado";
  } else if (completedMomentsCount === 3) {
    dayStatusText = "Concluído";
  } else if (completedMomentsCount > 0) {
    dayStatusText = "Em andamento";
  } else {
    dayStatusText = "Disponível para iniciar";
  }

  if (completedMomentsCount === 3) {
    protocolStatusText = "A prática de hoje foi concluída.";
  } else if (completedMomentsCount > 0) {
    protocolStatusText = "Continue de onde parou.";
  }

  let protocolBtnText = "INICIAR PROTOCOLO DI&Aacute;RIO";
  if (completedMomentsCount === 3) {
    protocolBtnText = "REVISAR PROTOCOLO";
  } else if (completedMomentsCount > 0) {
    protocolBtnText = "CONTINUAR PROTOCOLO";
  }

  let journeyBtnText = "INICIAR JORNADA DE 30 DIAS";
  if (journeyProgress) {
    if (journeyCompleted) {
      journeyBtnText = "REVISAR MINHA JORNADA";
    } else {
      journeyBtnText = "CONTINUAR MINHA JORNADA";
    }
  }

  return `
    <section class="daily-direction dashboard-today-card">
      <div class="dashboard-today-heading">
        <div>
          <span class="eyebrow">OL&Aacute;, ${escapeHtml(name).toUpperCase()} &middot; SUA DIRE&Ccedil;&Atilde;O DE HOJE</span>
          <span class="dashboard-today-metadata">${escapeHtml(areaTitle)} &middot; ${escapeHtml(displayDate)} &middot; ${escapeHtml(journeyStatusText)}</span>
          <h2>${direction.headline}</h2>
          <p>${direction.direction}</p>
        </div>
        <span class="dashboard-today-symbol">${icon("compass")}</span>
      </div>
      <div class="daily-triad dashboard-today-guidance">
        <article>
          <span>${icon("spark")} Frase do dia</span>
          <strong>&ldquo;${escapeHtml(todayMantra)}&rdquo;</strong>
        </article>
        <article>
          <span>${icon("target")} A&ccedil;&atilde;o do dia</span>
          <strong>${escapeHtml(todayAction)}</strong>
        </article>
        <article>
          <span>${icon("compass")} Pergunta do dia</span>
          <strong>${escapeHtml(todayQuestion)}</strong>
        </article>
      </div>

      <div class="daily-focus-card">
        <div class="daily-focus-header">
          ${icon("target")}
          <span>FOCO DE HOJE</span>
        </div>
        <div class="daily-focus-grid">
          <div class="daily-focus-item">
            <span class="daily-focus-label">AÇÃO PRINCIPAL</span>
            <p class="daily-focus-value">${escapeHtml(todayAction)}</p>
          </div>
          <div class="daily-focus-item">
            <span class="daily-focus-label">STATUS DO PROTOCOLO</span>
            <p class="daily-focus-value">${escapeHtml(protocolStatusText)}</p>
          </div>
          <div class="daily-focus-item">
            <span class="daily-focus-label">PROGRESSO</span>
            <p class="daily-focus-value">${completedMomentsCount} de 3 momentos conclu&iacute;dos.</p>
          </div>
          <div class="daily-focus-item">
            <span class="daily-focus-label">ESTADO DO DIA</span>
            <p class="daily-focus-value">${escapeHtml(dayStatusText)}</p>
          </div>
        </div>
      </div>

      <div class="myday-actions-block">
        <div class="myday-actions-row">
          <button class="button-primary" data-route="protocol" type="button">${icon("protocol")} ${protocolBtnText}</button>
          <button class="button-ghost" data-route="journey" type="button">${icon("calendar")} ${journeyBtnText}</button>
        </div>
        <div class="myday-actions-link">
          <button class="button-text" data-route="chakras" type="button">Rever minha leitura ${icon("arrow")}</button>
        </div>
      </div>
    </section>
  `;
}
function MyDayScreen() {
  return PlatformShell(`
    ${DailyDirectionSection()}
    ${personalKin(state.reading) ? EnergyCycleShortcutCard("is-dashboard") : ""}
  `);
}

function dashboardFirstReadingEntry() {
  return normalizedHistoryList(state.history).find((entry) => (
    entry.readingType === "first-reading" && entry.readingStatus === "completed" && entry.readingSnapshot
  )) || null;
}

function dashboardJourneyStreak(completedDays, currentDay) {
  const completed = new Set(completedDays);
  let cursor = completed.has(currentDay) ? currentDay : currentDay - 1;
  let streak = 0;
  while (cursor >= 1 && completed.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}

function dashboardPermissions() {
  const fullAccess = hasPremiumAccess();
  return {
    planId: currentPlanId(),
    planBadge: currentPlanBadge(),
    allowedAreas: consultationAreas
      .filter((area) => canStartConsultationForArea(area.id))
      .map((area) => area.id),
    allowedJourneyDays: 30,
    historyAccess: true,
    evolutionAccess: fullAccess,
  };
}

function dashboardContext() {
  const history = normalizedHistoryList(state.history);
  const firstReading = dashboardFirstReadingEntry();
  const activeEntry = historyEntryById(state.activeHistoryId) || history[0] || firstReading;
  const snapshotReading = activeEntry && activeEntry.readingSnapshot
    ? readingForHistoryEntry(activeEntry)
    : null;
  const guidance = readingGuidance(snapshotReading);
  const interpretation = guidance && guidance.interpretation ? guidance.interpretation : null;
  const presentation = interpretation ? firstReadingPresentation(interpretation) : null;
  const journeyProgress = snapshotReading ? loadJourneyProgress() : null;
  const journeyDay = journeyProgress ? currentJourneyDay(journeyProgress) : 1;
  const completedDays = journeyProgress
    ? visibleJourneyCompletedDays(journeyProgress, journeyDay)
    : [];
  const journey = snapshotReading ? journeyPlan(snapshotReading) : [];
  const today = journey[journeyDay - 1] || null;
  const todayCompleted = completedDays.includes(journeyDay);
  const journeyCompleted = completedDays.length >= 30;
  const permissions = dashboardPermissions();
  const consultedAreasCount = new Set(history.map((entry) => normalizeAreaId(entry.areaId)).filter(Boolean)).size;
  const protocolProgress = loadProtocolProgress();
  const protocolCompleted = Array.isArray(protocolProgress.completed)
    ? protocolProgress.completed.length
    : 0;

  return {
    history,
    firstReading,
    activeEntry,
    snapshotReading,
    interpretation,
    presentation,
    journeyProgress,
    journeyDay,
    completedDays,
    today,
    todayCompleted,
    journeyCompleted,
    journeyPercent: Math.round((completedDays.length / permissions.allowedJourneyDays) * 100),
    streak: dashboardJourneyStreak(completedDays, journeyDay),
    protocolCompleted,
    consultedAreasCount,
    permissions,
  };
}

function DashboardNextStepHero(context) {
  const firstName = String((state.account && state.account.name) || state.name || "viajante").trim().split(/\s+/)[0];
  let badge = "PRIMEIRA LEITURA";
  let title = "Comece sua primeira leitura";
  let description = "Informe sua data de nascimento e escolha o tema que mais representa seu momento.";
  let primary = `<button class="button-primary button-large" data-route="onboarding" type="button">Criar minha primeira leitura ${icon("arrow")}</button>`;
  let secondary = "";

  if (context.firstReading && !context.journeyProgress) {
    badge = "JORNADA N&Atilde;O INICIADA";
    title = "Sua primeira dire&ccedil;&atilde;o est&aacute; pronta";
    description = context.presentation ? context.presentation.heroSummary : "Sua leitura est&aacute; pronta para orientar o pr&oacute;ximo passo.";
    primary = `<button class="button-primary button-large" data-route="my-day" type="button">Ver minha A&ccedil;&atilde;o do Dia ${icon("arrow")}</button>`;
    secondary = `<button class="button-ghost button-large" data-route="journey" type="button">Iniciar Jornada de 30 dias</button>`;
  } else if (context.journeyCompleted) {
    badge = "CICLO CONCLU&Iacute;DO";
    title = "Voc&ecirc; concluiu este ciclo";
    description = `${context.completedDays.length} dias concluídos, ${context.consultedAreasCount} área${context.consultedAreasCount === 1 ? "" : "s"} trabalhada${context.consultedAreasCount === 1 ? "" : "s"} e sequência atual de ${context.streak} dias.`;
    primary = `<button class="button-primary button-large" data-route="journey" type="button">Revisar minha jornada ${icon("arrow")}</button>`;
  } else if (context.journeyProgress && context.todayCompleted) {
    badge = "DIA CONCLU&Iacute;DO";
    title = "Seu dia foi conclu&iacute;do";
    description = context.today ? `Ação realizada no dia ${context.journeyDay}: ${decodeStoredText(context.today.action)} Sequência atual: ${context.streak} dias.` : "Sua ação de hoje foi registrada.";
    primary = `<button class="button-primary button-large" data-route="journey" type="button">Revisar meu dia ${icon("arrow")}</button>`;
  } else if (context.journeyProgress) {
    badge = `DIA ${context.journeyDay} DE ${context.permissions.allowedJourneyDays}`;
    title = "Continue de onde parou";
    description = context.today
      ? `${decodeStoredText(context.today.phaseTitle)}: ${decodeStoredText(context.today.phaseSubtitle)}. ${decodeStoredText(context.today.action)}`
      : "Sua próxima ação está pronta.";
    primary = `<button class="button-primary button-large" data-route="journey" type="button">Continuar o dia ${icon("arrow")}</button>`;
  }

  return `
    <section class="continuity-hero" aria-labelledby="continuity-hero-title">
      <div>
        <span class="continuity-kicker">OL&Aacute;, ${escapeHtml(firstName).toUpperCase()} &middot; SEU PR&Oacute;XIMO PASSO</span>
        <span class="continuity-state-badge">${badge}</span>
        <h2 id="continuity-hero-title">${title}</h2>
        <p>${escapeHtml(decodeStoredText(description))}</p>
        <div class="continuity-hero-actions">${primary}${secondary}</div>
      </div>
      <span class="continuity-hero-symbol" aria-hidden="true">${icon("compass")}</span>
    </section>
  `;
}

function DashboardTodayDirection(context) {
  if (!context.firstReading || !context.interpretation || !context.presentation) {
    return `
      <section class="continuity-panel continuity-empty-panel" aria-labelledby="dashboard-direction-title">
        <span class="continuity-section-label">SUA DIRE&Ccedil;&Atilde;O DE HOJE</span>
        <h2 id="dashboard-direction-title">Sua dire&ccedil;&atilde;o aparecer&aacute; aqui.</h2>
        <p>Conclua sua primeira leitura para receber uma mensagem, uma frase e uma a&ccedil;&atilde;o para continuar.</p>
      </section>
    `;
  }

  const entry = context.activeEntry || context.firstReading;
  const area = entry.interpretationSnapshot?.areaTitle || entry.areaTitle || context.interpretation.areaTitle;
  const date = entry.createdAt ? formatReadingCreatedAtLong(entry.createdAt) : "Data indispon&iacute;vel";
  const action = context.today
    ? completePresentationText(context.today.action, 180) || context.presentation.actionShort
    : context.presentation.actionShort;

  return `
    <section class="continuity-panel dashboard-direction-panel" aria-labelledby="dashboard-direction-title">
      <header>
        <div><span class="continuity-section-label">SUA DIRE&Ccedil;&Atilde;O DE HOJE</span><h2 id="dashboard-direction-title">${escapeHtml(context.presentation.heroTitle)}</h2></div>
        <span class="continuity-panel-icon" aria-hidden="true">${icon("spark")}</span>
      </header>
      <p>${escapeHtml(context.presentation.heroSummary)}</p>
      <dl class="dashboard-direction-details">
        <div><dt>Frase de alinhamento</dt><dd>&ldquo;${escapeHtml(context.presentation.alignmentPhraseShort)}&rdquo;</dd></div>
        <div><dt>A&ccedil;&atilde;o do dia</dt><dd>${escapeHtml(action)}</dd></div>
      </dl>
      <footer><span>${escapeHtml(area)} &middot; ${escapeHtml(date)}</span><div><button class="button-primary" data-route="my-day" type="button">Ver A&ccedil;&atilde;o do Dia</button><button class="button-ghost" data-route="protocol" type="button">Abrir Protocolo</button></div></footer>
    </section>
  `;
}

function DashboardJourneyCard(context) {
  const started = Boolean(context.journeyProgress);
  const title = context.journeyCompleted
    ? "Ciclo conclu&iacute;do"
    : started
      ? `Dia ${context.journeyDay} de ${context.permissions.allowedJourneyDays}`
      : "Voc&ecirc; ainda n&atilde;o iniciou sua jornada.";
  const phase = context.today ? decodeStoredText(context.today.phaseTitle) : "Pronta para come&ccedil;ar";
  const nextStep = context.journeyCompleted
    ? "Revise os dias e reconhe&ccedil;a o que deseja sustentar."
    : context.todayCompleted
      ? "Seu dia atual est&aacute; conclu&iacute;do."
      : context.today
        ? decodeStoredText(context.today.action)
        : "Comece pelo primeiro dia quando fizer sentido.";
  const cta = context.journeyCompleted ? "Ver resumo" : started ? "Continuar Jornada" : "Iniciar Jornada";

  return `
    <section class="continuity-panel dashboard-journey-panel" aria-labelledby="dashboard-journey-title">
      <header><div><span class="continuity-section-label">SUA JORNADA</span><h2 id="dashboard-journey-title">${title}</h2></div><span class="continuity-panel-icon" aria-hidden="true">${icon("calendar")}</span></header>
      <div class="dashboard-journey-meta"><span aria-current="step">Fase atual<strong>${escapeHtml(phase)}</strong></span><span>Dias conclu&iacute;dos<strong>${context.completedDays.length}/${context.permissions.allowedJourneyDays}</strong></span><span>Sequ&ecirc;ncia atual<strong>${context.streak} dia${context.streak === 1 ? "" : "s"}</strong></span></div>
      <div class="dashboard-journey-progress" role="progressbar" aria-label="Progresso da jornada" aria-valuemin="0" aria-valuemax="${context.permissions.allowedJourneyDays}" aria-valuenow="${context.completedDays.length}"><span style="width:${context.journeyPercent}%"></span></div>
      <p>${escapeHtml(nextStep)}</p>
      ${started ? `<small>In&iacute;cio em ${formatDatePtBr(context.journeyProgress.startDate)}</small>` : ""}
      <button class="button-ghost" data-route="journey" type="button">${cta} ${icon("arrow")}</button>
    </section>
  `;
}

function DashboardAreas(context) {
  const primaryAreaId = normalizeAreaId(state.account && state.account.primaryAreaId);
  const visualTitles = {
    general: "Momento Atual",
    purpose: "Prop&oacute;sito e Dire&ccedil;&atilde;o",
    "work-prosperity": "Vida Financeira",
    "love-relationships": "Relacionamentos",
    "challenges-blocks": "Desafios e Bloqueios",
    "energy-spirituality": "Equil&iacute;brio e Energia",
    "decisions-cycles": "Mudan&ccedil;as e Ciclos",
  };

  return `
    <section class="dashboard-areas-section" aria-labelledby="dashboard-areas-title">
      <header><div><span class="continuity-section-label">SUAS &Aacute;REAS DE ACOMPANHAMENTO</span><h2 id="dashboard-areas-title">Continue pelas &aacute;reas dispon&iacute;veis no seu plano.</h2></div><span class="dashboard-plan-badge">${escapeHtml(context.permissions.planBadge)}</span></header>
      <div class="dashboard-areas-grid">
        ${consultationAreas.map((area) => {
          const entries = context.history.filter((entry) => normalizeAreaId(entry.areaId) === area.id);
          const latest = entries[0] || null;
          const consulted = Boolean(latest && latest.readingSnapshot);
          const primary = area.id === primaryAreaId;
          const available = context.permissions.allowedAreas.includes(area.id);
          const locked = !consulted && !available;
          const action = consulted
            ? `data-history-id="${escapeHtml(latest.readingId)}"`
            : locked
              ? `data-open-upgrade-modal data-upgrade-area-id="${escapeHtml(area.id)}" aria-label="Desbloquear ${escapeHtml(decodeStoredText(visualTitles[area.id]))}"`
              : `data-start-area-id="${escapeHtml(area.id)}"`;
          const stateLabel = consulted ? "Consultada" : locked ? "Bloqueada pelo plano" : "Dispon&iacute;vel";
          const note = consulted
            ? `Leitura de ${formatDateTimePtBr(latest.createdAt)}`
            : locked
              ? "Dispon&iacute;vel em outro plano"
              : "Pronta para consultar";
          const cta = consulted ? "Ver resultado" : locked ? "Desbloquear" : "Consultar &aacute;rea";
          return `
            <button class="dashboard-area-card ${consulted ? "is-consulted" : ""} ${locked ? "is-locked" : ""} ${primary ? "is-primary" : ""}" ${action} type="button" aria-label="${escapeHtml(decodeStoredText(visualTitles[area.id]))}: ${stateLabel}">
              <span class="dashboard-area-icon">${icon(locked ? "lock" : consulted ? "check" : area.icon)}</span>
              <span class="dashboard-area-copy"><strong>${visualTitles[area.id]}</strong><small>${note}</small></span>
              ${primary ? '<span class="dashboard-area-primary">&Aacute;rea principal</span>' : ""}
              <span class="dashboard-area-action">${cta} ${icon("arrow")}</span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function DashboardProgress(context) {
  const consultedAreas = context.consultedAreasCount;
  const hasProgress = context.completedDays.length || context.protocolCompleted || consultedAreas;
  return `
    <section class="dashboard-real-progress" aria-labelledby="dashboard-real-progress-title">
      <header><span class="continuity-section-label">SEU PROGRESSO</span><h2 id="dashboard-real-progress-title">Acompanhe o que voc&ecirc; realmente concluiu.</h2></header>
      <div class="dashboard-real-progress-grid">
        <article><span>${icon("calendar")}</span><strong>${context.completedDays.length}</strong><small>Dias conclu&iacute;dos</small></article>
        <article><span>${icon("cycle")}</span><strong>${context.streak}</strong><small>Sequ&ecirc;ncia atual</small></article>
        <article><span>${icon("protocol")}</span><strong>${context.protocolCompleted}</strong><small>Momentos conclu&iacute;dos hoje</small></article>
        <article><span>${icon("compass")}</span><strong>${consultedAreas}</strong><small>&Aacute;reas consultadas</small></article>
        ${context.journeyProgress ? `<article><span>${icon("chart")}</span><strong>${context.journeyPercent}%</strong><small>Jornada conclu&iacute;da</small></article>` : ""}
      </div>
      ${hasProgress ? "" : "<p>Conclua suas primeiras a&ccedil;&otilde;es para come&ccedil;ar a acompanhar sua evolu&ccedil;&atilde;o.</p>"}
    </section>
  `;
}

// Canonical Home for /app. Keep this as the only dashboard implementation.
function DashboardScreen() {
  const context = dashboardContext();

  return PlatformShell(`
    ${DashboardNextStepHero(context)}
    <div class="dashboard-continuity-columns">
      ${DashboardTodayDirection(context)}
      ${DashboardJourneyCard(context)}
    </div>
    ${DashboardAreas(context)}
    ${DashboardProgress(context)}

    <section class="dashboard-disclaimer">
      ${icon("info")}
      <p>O Drive Mental utiliza uma linguagem simb&oacute;lica como m&eacute;todo de organiza&ccedil;&atilde;o pessoal. As leituras n&atilde;o s&atilde;o previs&otilde;es nem diagn&oacute;sticos.</p>
    </section>
  `);
}

function HomeScreen() {
  const consultationLocked = freeConsultationUsed();
  return PlatformShell(`
    <section class="consultation-heading">
      <span class="eyebrow">GPS do Sincron&aacute;rio &middot; Mapa Energ&eacute;tico Visual</span>
      <h2>Qual &aacute;rea da sua vida pede mais clareza hoje?</h2>
      <p>Confirme seus dados, escolha um contexto e gere uma nova leitura. Os c&aacute;lculos s&atilde;o preservados no hist&oacute;rico.</p>
    </section>
    <div class="consultation-layout">
    ${GoldenCard(`
      <div class="card-title-block">
        <h2>Dados da consulta</h2>
        ${GoldenDivider()}
      </div>
      <form id="alignment-form" class="alignment-form">
        ${GoldenInput({
          label: "Nome completo",
          name: "name",
          value: state.name || (state.account && state.account.name),
          placeholder: "Ex: Gabriel Ferreira",
          type: "text",
          iconName: "user",
        })}
        ${GoldenInput({
          label: "Data de Nascimento",
          name: "birth",
          value: state.birth,
          placeholder: "1996-06-25",
          type: "date",
          iconName: "calendar",
        })}
        ${ConsultationAreaSelector()}
        ${consultationLocked
          ? PrimaryEnergyButton("Desbloquear novas consultas", 'type="button" data-open-upgrade-modal')
          : PrimaryEnergyButton("Calcular minhas coordenadas", `type="submit" ${state.selectedAreaId ? "" : "disabled"}`)}
      </form>
      ${HomeNotice()}
    `, "home-card")}
      <aside class="consultation-aside">
        <span class="consultation-aside-icon">${icon("spark")}</span>
        <span class="eyebrow">O QUE VOC&Ecirc; RECEBER&Aacute;</span>
        <h3>Uma leitura completa, organizada em etapas.</h3>
        <ul>
          <li>${icon("check")} Resumo do GPS de hoje</li>
          <li>${icon("check")} Coordenadas de nascimento e do dia</li>
          <li>${icon("check")} Sincroniza&ccedil;&atilde;o com seu Kin pessoal</li>
          <li>${icon("check")} Pergunta e pr&aacute;tica para a &aacute;rea escolhida</li>
          <li>${icon("check")} Snapshot salvo no hist&oacute;rico</li>
        </ul>
        <p>${icon("info")} A &aacute;rea escolhida contextualiza o conte&uacute;do, sem alterar as f&oacute;rmulas do c&aacute;lculo.</p>
      </aside>
    </div>
  `);
}

function ChakraBodyMap() {
  return `
    <div class="chakra-body-map" aria-label="Mapa luminoso dos chakras">
      <div class="body-aura"></div>
      <div class="body-silhouette">
        <div class="halo"></div>
        <div class="head"></div>
        <div class="spine"></div>
        <div class="shoulders"></div>
        <div class="torso"></div>
        <div class="pelvis"></div>
        <div class="legs"></div>
        <div class="arms"></div>
      </div>
      ${chakras
        .map((chakra, index) => `<span class="chakra-point chakra-${chakra.number}" style="--chakra:${chakra.color}; --delay:${index * 0.24}s"></span>`)
        .join("")}
    </div>
  `;
}

function ChakraCard(chakra) {
  return `
    <button class="chakra-card" style="--chakra:${chakra.color}" data-chakra-id="${chakra.id}" aria-label="Abrir detalhes do Chakra ${chakra.name}">
      <span class="chakra-number">${chakra.number}</span>
      <span class="chakra-copy">
        <strong>${chakra.name}</strong>
        <small>${chakra.traditional}</small>
      </span>
      ${icon("arrow")}
    </button>
  `;
}

function EnergyCycleScreen() {
  const guidance = readingGuidance(state.reading);
  const areaTitle = guidance && guidance.interpretation
    ? guidance.interpretation.areaTitle
    : "Vis&atilde;o Geral";

  return PlatformShell(`
    ${AppHeader("Ciclo Energ&eacute;tico", `${areaTitle} &bull; plasmas e chakras`, { back: true, backRoute: "dashboard" })}
    <section class="energy-cycle-page">
      <section class="energy-cycle-hero">
        <span class="energy-cycle-hero-icon">${icon("lotus")}</span>
        <div>
          <span>Ciclo natural do Sincron&aacute;rio</span>
          <h2>Ciclo Energ&eacute;tico</h2>
          <p>Uma leitura visual da sequ&ecirc;ncia simb&oacute;lica dos plasmas e chakras para apoiar reflex&atilde;o, organiza&ccedil;&atilde;o e presen&ccedil;a.</p>
        </div>
      </section>
      <section class="energy-cycle-main-card">
        ${EnergyCycleContent()}
      </section>
      <section class="dashboard-disclaimer energy-cycle-disclaimer">
        ${icon("info")}
        <p>Esta p&aacute;gina n&atilde;o mede bloqueios, doen&ccedil;as, hiperatividade ou estado individual dos chakras. Ela organiza correspond&ecirc;ncias simb&oacute;licas para autoconhecimento.</p>
      </section>
    </section>
  `);
}

function ChakraSummaryList(items) {
  return `
    <ul class="chakra-summary-list">
      ${items.map((item) => `<li>${readableText(item)}</li>`).join("")}
    </ul>
  `;
}

function ChakraSimpleDiagnosis(summary, areaTitle) {
  return `
    <section class="chakra-simple-diagnosis" style="--state-tone:${summary.stateTone}">
      <article class="chakra-simple-cell chakra-theme-cell">
        <span>Tema no ciclo</span>
        <strong>${readableText(summary.theme)}</strong>
      </article>
      <article class="chakra-simple-cell chakra-state-cell">
        <span>Situa&ccedil;&atilde;o na consulta</span>
        <strong><i></i>${readableText(summary.status)}</strong>
        <p>${readableText(summary.statusDescription)}</p>
        <small>Consulta: ${readableText(areaTitle)}</small>
      </article>
      <article class="chakra-simple-cell">
        <span>O que observar</span>
        ${ChakraSummaryList(summary.observationItems)}
      </article>
      <article class="chakra-simple-cell">
        <span>Pr&aacute;tica da leitura</span>
        ${ChakraSummaryList(summary.practiceItems)}
      </article>
    </section>
  `;
}

function ChakraDetailScreen() {
  const chakra = selectedChakra();
  const area = selectedConsultationArea();
  const guidance = readingGuidance(state.reading);
  const interpretation = guidance && guidance.interpretation ? guidance.interpretation : {};
  const areaId = normalizeAreaId(
    area && area.id
      ? area.id
      : interpretation.areaId || state.selectedAreaId,
  ) || "general";
  const areaTitle = area
    ? area.title
    : interpretation.areaTitle || "Vis&atilde;o Geral";
  const summary = chakraConsultationSummary(chakra, areaId, areaTitle);
  const orderedChakras = [...chakras].sort((a, b) => a.number - b.number);
  const currentIndex = orderedChakras.findIndex((item) => item.id === chakra.id);
  const previousChakra = orderedChakras[(currentIndex - 1 + orderedChakras.length) % orderedChakras.length];
  const nextChakra = orderedChakras[(currentIndex + 1) % orderedChakras.length];

  return PlatformShell(`
    ${AppHeader(`Chakra ${chakra.name}`, `${chakra.traditional} &bull; Chakra ${chakra.number}`, { back: true, backRoute: "energy-cycle" })}
    <section class="chakra-detail-stack chakra-simple-stack" style="--chakra:${chakra.color}">
      <section class="chakra-detail-hero chakra-simple-hero">
        <div class="chakra-hero-symbol">
          ${icon(chakra.symbol)}
        </div>
        <div class="chakra-hero-copy">
          <span>Chakra ${chakra.number}</span>
          <h2>${chakra.name}</h2>
          <strong>${chakra.traditional}</strong>
          <p>${chakra.phrase}</p>
        </div>
      </section>

      ${ChakraSimpleDiagnosis(summary, areaTitle)}

      <section class="chakra-detail-transparency">
        <h2>Valida&ccedil;&atilde;o metodol&oacute;gica</h2>
        <p>A metodologia atual calcula correspond&ecirc;ncias do ciclo dos sete plasmas e sua aplica&ccedil;&atilde;o por &aacute;rea. Ela n&atilde;o calcula bloqueio, hiperatividade, ferida ou estado individual do chakra.</p>
      </section>

      <nav class="chakra-detail-nav" aria-label="Navega&ccedil;&atilde;o entre chakras">
        <button data-chakra-id="${previousChakra.id}" type="button">${icon("back")}<span>${previousChakra.name}</span></button>
        <button data-chakra-id="${nextChakra.id}" type="button"><span>${nextChakra.name}</span>${icon("arrow")}</button>
      </nav>
    </section>
  `);
}

function ChakrasScreen() {
  const activeEntry = activeReadingHistoryEntry();
  const isFirstReading = activeEntry && activeEntry.readingType === "first-reading";
  const snapshotReading = isFirstReading ? readingForHistoryEntry(activeEntry) : state.reading;
  const guidance = readingGuidance(snapshotReading);
  const areaTitle = guidance && guidance.interpretation
    ? guidance.interpretation.areaTitle
    : "Leitura pessoal";

  return PlatformShell(`
    ${AppHeader(isFirstReading ? "SUA PRIMEIRA LEITURA" : "RESULTADO DA CONSULTA", areaTitle, { back: true })}
    <section class="result-stack">
      ${isFirstReading
        ? FirstReadingResult(snapshotReading, guidance, activeEntry)
        : `${EssentialDirectionCard(state.reading, guidance)}${EnergyCycleShortcutCard("is-result")}${ReadingDetailsSection(state.reading, guidance)}`}
    </section>
  `);
}

function protocolDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadProtocolProgress() {
  try {
    const progress = JSON.parse(localStorage.getItem(PROTOCOL_PROGRESS_KEY));
    if (!progress || progress.date !== protocolDateKey()) {
      return { date: protocolDateKey(), completed: [] };
    }
    return {
      date: progress.date,
      completed: Array.isArray(progress.completed) ? progress.completed : [],
    };
  } catch {
    return { date: protocolDateKey(), completed: [] };
  }
}

function toggleProtocolMoment(momentId) {
  const progress = loadProtocolProgress();
  const completed = progress.completed.includes(momentId)
    ? progress.completed.filter((item) => item !== momentId)
    : [...progress.completed, momentId];
  const nextProgress = {
    date: protocolDateKey(),
    completed,
  };
  localStorage.setItem(PROTOCOL_PROGRESS_KEY, JSON.stringify(nextProgress));
  if (isSupabaseMode()) {
    supabaseService().saveProtocolProgress(nextProgress).catch(() => {
      // The local progress remains available while offline.
    });
  }
  render();
}

function protocolMoments() {
  const guidance = readingGuidance(state.reading);
  const interpretation = guidance && guidance.interpretation;
  const areaId = interpretation ? interpretation.areaId : "general";
  const direction = essentialDirectionCopy[areaId] || essentialDirectionCopy.general;
  const dailyAction = interpretation && (interpretation.dailyPractice || interpretation.suggestedPractice);
  const reflection = interpretation && interpretation.reflectionQuestion;

  return [
    {
      id: "morning",
      label: "Manh&atilde;",
      time: "5 minutos",
      title: "Comece com presen&ccedil;a",
      subtitle: "Respira&ccedil;&atilde;o e dire&ccedil;&atilde;o",
      iconName: "spark",
      tone: "morning",
      focus: direction.mantra,
      steps: [
        "Coloque as m&atilde;os no peito e respire profundamente 10 vezes.",
        `Leia em voz alta: &ldquo;${direction.mantra}&rdquo;`,
        "Escolha uma inten&ccedil;&atilde;o simples para sustentar durante o dia.",
      ],
    },
    {
      id: "day",
      label: "Dia",
      time: "3 minutos",
      title: "Execute o essencial",
      subtitle: "Uma a&ccedil;&atilde;o com foco",
      iconName: "target",
      tone: "day",
      focus: dailyAction || "Escolha uma a&ccedil;&atilde;o importante e conclua antes de iniciar outra.",
      steps: [
        dailyAction || "Defina sua &uacute;nica a&ccedil;&atilde;o principal do dia.",
        "Comece sem redes sociais, notifica&ccedil;&otilde;es ou tarefas paralelas.",
        "Ao concluir, registre em uma frase o que avan&ccedil;ou.",
      ],
    },
    {
      id: "night",
      label: "Noite",
      time: "5 minutos",
      title: "Feche o dia em paz",
      subtitle: "Revis&atilde;o e gratid&atilde;o",
      iconName: "heart",
      tone: "night",
      focus: reflection || "O que hoje aproximou voc&ecirc; do que realmente importa?",
      steps: [
        reflection || "Pergunte a si mesmo onde sentiu mais presen&ccedil;a hoje.",
        "Registre algo pelo que &eacute; grato, algo que fez bem e algo que deseja melhorar.",
        "Libere o que n&atilde;o pode controlar e prepare uma prioridade para amanh&atilde;.",
      ],
    },
  ];
}

function currentProtocolMomentId() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "morning";
  }
  if (hour >= 12 && hour < 18) {
    return "day";
  }
  return "night";
}

function ProtocolMomentCard(moment, currentId, completed) {
  const isCurrent = moment.id === currentId;
  const isCompleted = completed.includes(moment.id);

  return `
    <article class="protocol-moment-card ${moment.tone} ${isCurrent ? "is-current" : ""} ${isCompleted ? "is-completed" : ""}">
      <div class="protocol-moment-heading">
        <span class="protocol-moment-icon">${icon(isCompleted ? "check" : moment.iconName)}</span>
        <div>
          <span>${moment.label} &middot; ${moment.time}${isCurrent ? " &middot; Agora" : ""}</span>
          <h2>${moment.title}</h2>
          <p>${moment.subtitle}</p>
        </div>
      </div>
      <p class="protocol-moment-focus">${moment.focus}</p>
      <details class="protocol-moment-details">
        <summary>Ver instru&ccedil;&otilde;es</summary>
        <ol>${moment.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
      </details>
      <button class="protocol-complete-button" data-complete-protocol="${moment.id}" type="button">
        ${icon(isCompleted ? "check" : "clock")}
        ${isCompleted ? "Pr&aacute;tica conclu&iacute;da" : "Marcar como conclu&iacute;da"}
      </button>
    </article>
  `;
}

function ProtocolPrinciplesDetails() {
  const pillars = [
    ["heart", "F&eacute;", "Confie sem abandonar a a&ccedil;&atilde;o."],
    ["protocol", "Ordem", "Organize o que sustenta sua rotina."],
    ["target", "Foco", "Fa&ccedil;a primeiro o que realmente importa."],
    ["chart", "Const&acirc;ncia", "Repita pequenos passos todos os dias."],
    ["leaf", "Entrega", "Fa&ccedil;a sua parte e libere o resultado."],
  ];

  return `
    <section class="protocol-principles">
      <details>
        <summary>
          <span>${icon("info")}</span>
          <span><strong>Princ&iacute;pios do protocolo</strong><small>Entenda a base da pr&aacute;tica di&aacute;ria.</small></span>
          ${icon("arrow")}
        </summary>
        <div class="protocol-principles-content">
          ${pillars.map(([iconName, title, text]) => `
            <div>${icon(iconName)}<strong>${title}</strong><p>${text}</p></div>
          `).join("")}
          <p class="protocol-maxim">M&aacute;xima efici&ecirc;ncia, m&iacute;nimo esfor&ccedil;o. Quando sua energia est&aacute; alinhada, a vida flui.</p>
        </div>
      </details>
    </section>
  `;
}

function ProtocolScreen() {
  const moments = protocolMoments();
  const currentId = currentProtocolMomentId();
  const currentMoment = moments.find((moment) => moment.id === currentId) || moments[0];
  const progress = loadProtocolProgress();
  const completedCount = moments.filter((moment) => progress.completed.includes(moment.id)).length;

  return PlatformShell(`
    ${AppHeader("Protocolo de hoje", `${completedCount} de 3 momentos conclu&iacute;dos`, { back: true })}
    <div class="protocol-stack protocol-simple">
      <section class="protocol-now-card ${currentMoment.tone}">
        <div class="protocol-now-copy">
          <span class="protocol-now-eyebrow">${icon("spark")} Pr&aacute;tica de agora &middot; ${currentMoment.time}</span>
          <h1>${currentMoment.title}</h1>
          <p>${currentMoment.focus}</p>
          <button class="protocol-journey-link" data-route="journey" type="button">
            ${icon("calendar")} Ver jornada de 30 dias ${icon("arrow")}
          </button>
        </div>
        <div class="protocol-progress" aria-label="${completedCount} de 3 momentos conclu&iacute;dos">
          <div class="protocol-progress-label"><span>Seu dia</span><strong>${completedCount}/3</strong></div>
          <div class="protocol-progress-track">
            ${moments.map((moment) => `<i class="${progress.completed.includes(moment.id) ? "is-completed" : ""}"></i>`).join("")}
          </div>
        </div>
      </section>

      <section class="protocol-moments-section">
        <div class="protocol-simple-heading">
          <span>Rotina em tr&ecirc;s momentos</span>
          <h2>Um passo de cada vez</h2>
          <p>Fa&ccedil;a apenas a pr&aacute;tica do momento atual. As demais ficam dispon&iacute;veis para quando chegar a hora.</p>
        </div>
        <div class="protocol-moments-grid">
          ${moments.map((moment) => ProtocolMomentCard(moment, currentId, progress.completed)).join("")}
        </div>
      </section>

      ${ProtocolPrinciplesDetails()}
    </div>
  `);
}

const journeyPhases = Object.freeze([
  {
    id: "observe",
    title: "Observar",
    subtitle: "Clareza antes do movimento",
    description: "Nos primeiros dias, reduza a pressa e reconhe&ccedil;a o que realmente pede aten&ccedil;&atilde;o.",
    mantras: [
      "Eu observo o presente sem precisar resolver tudo agora.",
      "Clareza nasce quando eu diminuo o ru&iacute;do.",
      "Eu reconhe&ccedil;o o que sinto antes de escolher.",
      "Minha aten&ccedil;&atilde;o retorna ao que realmente importa.",
      "Eu separo fatos, medos e possibilidades.",
      "Posso escutar antes de responder.",
      "Eu termino esta semana compreendendo melhor meu momento.",
    ],
    actions: [
      "Anote os tr&ecirc;s pontos que mais ocupam sua mente hoje.",
      "Retire uma distra&ccedil;&atilde;o por pelo menos uma hora.",
      "Nomeie a decis&atilde;o ou situa&ccedil;&atilde;o que pede mais clareza.",
      "Separe em duas listas: o que depende de voc&ecirc; e o que n&atilde;o depende.",
      "Converse com algu&eacute;m de confian&ccedil;a apenas para organizar sua percep&ccedil;&atilde;o.",
      "Reserve cinco minutos de sil&ecirc;ncio antes da principal escolha do dia.",
      "Registre o principal aprendizado desta primeira semana.",
    ],
  },
  {
    id: "organize",
    title: "Organizar",
    subtitle: "Ordem para sustentar o caminho",
    description: "Transforme percep&ccedil;&atilde;o em prioridade, limite e uma rotina que caiba na vida real.",
    mantras: [
      "Eu crio ordem para que minha energia tenha dire&ccedil;&atilde;o.",
      "O simples bem organizado sustenta meu avan&ccedil;o.",
      "Eu escolho prioridades em vez de acumular urg&ecirc;ncias.",
      "Meus limites protegem o que &eacute; importante.",
      "Cada coisa encontra seu tempo e seu lugar.",
      "Eu libero excessos para abrir espa&ccedil;o ao essencial.",
      "Minha rotina pode ser firme sem deixar de ser leve.",
    ],
    actions: [
      "Escolha as tr&ecirc;s prioridades reais desta semana.",
      "Organize um espa&ccedil;o f&iacute;sico ou digital que esteja gerando dispers&atilde;o.",
      "Defina qual tarefa deve ser feita primeiro durante os pr&oacute;ximos tr&ecirc;s dias.",
      "Diga n&atilde;o ou renegocie uma demanda que ultrapassa seus limites.",
      "Reserve na agenda um hor&aacute;rio para a prioridade principal.",
      "Retire uma tarefa, compromisso ou expectativa que n&atilde;o precisa continuar.",
      "Revise sua organiza&ccedil;&atilde;o e simplifique mais uma vez.",
    ],
  },
  {
    id: "act",
    title: "Agir",
    subtitle: "Movimento pequeno e verific&aacute;vel",
    description: "Use a clareza conquistada para concluir a&ccedil;&otilde;es concretas sem se dispersar.",
    mantras: [
      "Eu transformo inten&ccedil;&atilde;o em um passo concreto.",
      "Meu foco cresce quando eu concluo o que comecei.",
      "Eu n&atilde;o preciso fazer tudo; preciso fazer o essencial.",
      "A const&acirc;ncia vale mais do que a pressa.",
      "Eu ajo com presen&ccedil;a e corrijo o caminho quando necess&aacute;rio.",
      "Cada conclus&atilde;o fortalece minha confian&ccedil;a.",
      "Eu reconhe&ccedil;o o movimento que j&aacute; constru&iacute;.",
    ],
    actions: [
      "Conclua uma tarefa importante antes de abrir redes sociais ou mensagens.",
      "Divida a principal a&ccedil;&atilde;o em uma etapa que possa ser feita em 30 minutos.",
      "Finalize uma pend&ecirc;ncia pequena que vem consumindo aten&ccedil;&atilde;o.",
      "Proteja um bloco de tempo sem interrup&ccedil;&otilde;es para sua prioridade.",
      "Pe&ccedil;a o apoio, a informa&ccedil;&atilde;o ou o recurso necess&aacute;rio para avan&ccedil;ar.",
      "Entregue uma vers&atilde;o conclu&iacute;da antes de buscar perfei&ccedil;&atilde;o.",
      "Registre o que avan&ccedil;ou e qual ser&aacute; o pr&oacute;ximo passo.",
    ],
  },
  {
    id: "sustain",
    title: "Sustentar",
    subtitle: "Const&acirc;ncia sem excesso",
    description: "Consolide o que funciona, cuide do ritmo e mantenha o avan&ccedil;o poss&iacute;vel.",
    mantras: [
      "Eu sustento meu caminho com const&acirc;ncia e respeito ao meu ritmo.",
      "Repetir o essencial transforma minha realidade.",
      "Eu descanso sem abandonar minha dire&ccedil;&atilde;o.",
      "Meu progresso n&atilde;o precisa ser perfeito para ser verdadeiro.",
      "Eu preservo energia para continuar.",
      "A disciplina que me serve tamb&eacute;m inclui cuidado.",
      "Eu reconhe&ccedil;o a for&ccedil;a dos pequenos passos repetidos.",
    ],
    actions: [
      "Repita a pr&aacute;tica que mais ajudou voc&ecirc; nas semanas anteriores.",
      "Ajuste sua rotina para tornar a principal a&ccedil;&atilde;o mais f&aacute;cil de repetir.",
      "Inclua uma pausa real antes de chegar ao esgotamento.",
      "Observe um resultado concreto gerado pela sua const&acirc;ncia.",
      "Compartilhe seu avan&ccedil;o com algu&eacute;m que apoia sua jornada.",
      "Prepare hoje o ambiente ou material necess&aacute;rio para a a&ccedil;&atilde;o de amanh&atilde;.",
      "Escolha o h&aacute;bito que merece continuar no pr&oacute;ximo ciclo.",
    ],
  },
  {
    id: "integrate",
    title: "Integrar",
    subtitle: "Reconhecer e preparar o pr&oacute;ximo ciclo",
    description: "Feche a jornada reconhecendo mudan&ccedil;as, aprendizados e a dire&ccedil;&atilde;o que deseja manter.",
    mantras: [
      "Eu honro o caminho percorrido e integro o que aprendi.",
      "Eu encerro este ciclo com gratid&atilde;o e escolho conscientemente o pr&oacute;ximo.",
    ],
    actions: [
      "Escreva o que mudou em sua percep&ccedil;&atilde;o, rotina e capacidade de agir.",
      "Escolha uma frase, uma pr&aacute;tica e uma prioridade para levar ao pr&oacute;ximo ciclo.",
    ],
  },
]);

function dateOnlyToUtc(value) {
  const parsed = parseDateOnly(value);
  return parsed ? Date.UTC(parsed.year, parsed.month - 1, parsed.day) : null;
}

function addDaysToDateOnly(value, days) {
  const timestamp = dateOnlyToUtc(value);
  if (timestamp === null) {
    return value;
  }
  const date = new Date(timestamp + (Number(days) * 86400000));
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function journeyDayDifference(startDate, currentDate) {
  const start = dateOnlyToUtc(startDate);
  const current = dateOnlyToUtc(currentDate);
  if (start === null || current === null) {
    return 0;
  }
  return Math.floor((current - start) / 86400000);
}

function journeyContextKey() {
  const guidance = readingGuidance(state.reading);
  const interpretation = guidance && guidance.interpretation;
  const areaId = interpretation ? interpretation.areaId : normalizeAreaId(state.selectedAreaId) || "general";
  const readingDate = state.reading && state.reading.input && state.reading.input.current_date
    ? state.reading.input.current_date.value
    : todayForEngine();
  return [
    state.activeHistoryId || "current-reading",
    personalKin(state.reading) || "no-kin",
    areaId,
    readingDate,
  ].join(":");
}

function loadJourneyProgress() {
  try {
    const progress = JSON.parse(localStorage.getItem(JOURNEY_PROGRESS_KEY));
    if (
      !progress
      || !parseDateOnly(progress.startDate)
      || progress.contextKey !== journeyContextKey()
    ) {
      return null;
    }
    return {
      contextKey: progress.contextKey,
      startDate: progress.startDate,
      completedDays: Array.isArray(progress.completedDays) ? progress.completedDays : [],
    };
  } catch {
    return null;
  }
}

function ensureJourneyProgress() {
  const existing = loadJourneyProgress();
  if (existing) {
    return existing;
  }

  const progress = {
    contextKey: journeyContextKey(),
    startDate: todayForEngine(),
    completedDays: [],
  };
  localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(progress));
  return progress;
}

function currentJourneyDay(progress) {
  return Math.min(30, Math.max(1, journeyDayDifference(progress.startDate, todayForEngine()) + 1));
}

function normalizeJourneyDayNumber(dayNumber) {
  return Math.min(30, Math.max(1, Number(dayNumber) || 1));
}

function isAdminProfile() {
  return ["owner", "admin"].includes(String(state.adminRole || "").toLowerCase());
}

function canAccessJourneyDay(dayNumber, currentDay) {
  return isAdminProfile() || normalizeJourneyDayNumber(dayNumber) <= currentDay;
}

function accessibleJourneyDayNumber(dayNumber, currentDay) {
  const normalizedDay = normalizeJourneyDayNumber(dayNumber || currentDay);
  return canAccessJourneyDay(normalizedDay, currentDay) ? normalizedDay : currentDay;
}

function visibleJourneyCompletedDays(progress, currentDay) {
  const completedDays = Array.isArray(progress.completedDays) ? progress.completedDays : [];
  return [...new Set(completedDays)]
    .map((day) => normalizeJourneyDayNumber(day))
    .filter((day) => canAccessJourneyDay(day, currentDay))
    .sort((left, right) => left - right);
}

function toggleJourneyDay(dayNumber) {
  const progress = ensureJourneyProgress();
  const currentDay = currentJourneyDay(progress);
  const normalizedDay = normalizeJourneyDayNumber(dayNumber);
  if (!canAccessJourneyDay(normalizedDay, currentDay)) {
    state.journeySelectedDay = currentDay;
    render();
    return;
  }

  const completedDays = progress.completedDays.includes(normalizedDay)
    ? progress.completedDays.filter((day) => day !== normalizedDay)
    : [...progress.completedDays, normalizedDay].sort((left, right) => left - right);

  const nextProgress = {
    contextKey: progress.contextKey,
    startDate: progress.startDate,
    completedDays,
  };
  localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(nextProgress));
  if (isSupabaseMode()) {
    supabaseService().saveJourneyProgress(nextProgress).catch(() => {
      // The local progress remains available while offline.
    });
  }
  state.journeySelectedDay = normalizedDay;
  render();
}

function journeyPlan(reading = state.reading) {
  const guidance = readingGuidance(reading);
  const interpretation = guidance && guidance.interpretation;
  const areaId = interpretation ? interpretation.areaId : "general";
  const areaTitle = interpretation ? interpretation.areaTitle : "Vis&atilde;o Geral";
  const direction = essentialDirectionCopy[areaId] || essentialDirectionCopy.general;
  const dailyPractice = interpretation && (interpretation.dailyPractice || interpretation.suggestedPractice);
  const days = [];

  for (const phase of journeyPhases) {
    for (let index = 0; index < phase.mantras.length; index += 1) {
      const number = days.length + 1;
      days.push({
        number,
        phaseId: phase.id,
        phaseTitle: phase.title,
        phaseSubtitle: phase.subtitle,
        phaseDescription: phase.description,
        mantra: number === 1 ? direction.mantra : phase.mantras[index],
        action: number === 1 && dailyPractice ? dailyPractice : phase.actions[index],
        areaTitle,
      });
    }
  }

  return days;
}

function journeyDisplayDate(value) {
  const timestamp = dateOnlyToUtc(value);
  if (timestamp === null) {
    return "";
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(timestamp)).replace(".", "");
}

function JourneyDayButton(day, progress, currentDay, selectedDay) {
  const date = addDaysToDateOnly(progress.startDate, day.number - 1);
  const isCompleted = progress.completedDays.includes(day.number);
  const isCurrent = day.number === currentDay;
  const isSelected = day.number === selectedDay;
  const isLocked = !canAccessJourneyDay(day.number, currentDay);

  return `
    <button
      class="journey-day-button ${isCompleted ? "is-completed" : ""} ${isCurrent ? "is-current" : ""} ${isSelected ? "is-selected" : ""} ${isLocked ? "is-locked" : ""}"
      data-journey-day="${day.number}"
      type="button"
      aria-label="Dia ${day.number}, ${journeyDisplayDate(date)}${isLocked ? ", bloqueado at&eacute; a data chegar" : ""}"
      ${isLocked ? 'aria-disabled="true" disabled' : ""}
    >
      <span>${isCompleted ? icon("check") : day.number}</span>
      <small>${journeyDisplayDate(date)}</small>
    </button>
  `;
}

function JourneyScreen() {
  const progress = ensureJourneyProgress();
  const plan = journeyPlan();
  const currentDay = currentJourneyDay(progress);
  const selectedDayNumber = accessibleJourneyDayNumber(state.journeySelectedDay, currentDay);
  const selectedDay = plan[selectedDayNumber - 1] || plan[0];
  const visibleCompletedDays = visibleJourneyCompletedDays(progress, currentDay);
  const visibleProgress = { ...progress, completedDays: visibleCompletedDays };
  const weekStart = Math.floor((selectedDay.number - 1) / 7) * 7;
  const weekDays = plan.slice(weekStart, Math.min(weekStart + 7, plan.length));
  const completionPercent = Math.round((visibleCompletedDays.length / 30) * 100);
  const selectedCompleted = visibleCompletedDays.includes(selectedDay.number);
  const selectedDate = addDaysToDateOnly(progress.startDate, selectedDay.number - 1);

  return PlatformShell(`
    ${AppHeader("Jornada de 30 dias", selectedDay.areaTitle, { back: true, backRoute: "dashboard" })}
    <div class="journey-stack">
      <section class="journey-hero">
        <div class="journey-hero-copy">
          <span class="journey-eyebrow">Dia ${selectedDay.number} de 30 ${selectedDay.number === currentDay ? "&middot; Hoje" : ""}</span>
          <h1>${selectedDay.phaseTitle}: ${selectedDay.phaseSubtitle}</h1>
          <p>${selectedDay.phaseDescription}</p>
        </div>
        <div class="journey-total-progress">
          <div><span>Progresso da jornada</span><strong>${visibleCompletedDays.length}/30</strong></div>
          <div class="journey-progress-track"><span style="width: ${completionPercent}%"></span></div>
          <small>In&iacute;cio em ${formatDatePtBr(progress.startDate)}</small>
        </div>
      </section>

      <section class="journey-today-card">
        <div class="journey-today-heading">
          <div>
            <span>Frase do dia</span>
            <h2>&ldquo;${decodeStoredText(selectedDay.mantra)}&rdquo;</h2>
          </div>
          <span class="journey-day-seal">${selectedDay.number}</span>
        </div>
        <div class="journey-action-card">
          <span>${icon("target")} A&ccedil;&atilde;o do dia</span>
          <strong>${escapeHtml(decodeStoredText(selectedDay.action))}</strong>
        </div>
        <div class="journey-today-footer">
          <span>${icon("calendar")} ${journeyDisplayDate(selectedDate)} &middot; ${escapeHtml(decodeStoredText(selectedDay.areaTitle))}</span>
          <button class="${selectedCompleted ? "is-completed" : ""}" data-complete-journey-day="${selectedDay.number}" type="button">
            ${icon(selectedCompleted ? "check" : "clock")}
            ${selectedCompleted ? "Dia conclu&iacute;do" : "Concluir este dia"}
          </button>
        </div>
      </section>

      <section class="journey-week-section">
        <div class="journey-section-heading">
          <div><span>Semana ${Math.floor((selectedDay.number - 1) / 7) + 1}</span><h2>Seu ciclo atual</h2></div>
          <p>${isAdminProfile() ? "Perfil admin: todos os dias est&atilde;o liberados para revis&atilde;o." : "Dias futuros ficam bloqueados. Os dias de hoje e anteriores permanecem dispon&iacute;veis."}</p>
        </div>
        <div class="journey-week-strip">
          ${weekDays.map((day) => JourneyDayButton(day, visibleProgress, currentDay, selectedDay.number)).join("")}
        </div>
      </section>

      <section class="journey-overview">
        <details>
          <summary>
            <span>${icon("calendar")}</span>
            <span><strong>Ver os 30 dias</strong><small>Vis&atilde;o completa organizada por fases.</small></span>
            ${icon("arrow")}
          </summary>
          <div class="journey-overview-content">
            ${journeyPhases.map((phase) => {
              const phaseDays = plan.filter((day) => day.phaseId === phase.id);
              return `
                <section>
                  <div><span>${phase.title}</span><small>${phase.subtitle}</small></div>
                  <div class="journey-phase-days">
                    ${phaseDays.map((day) => JourneyDayButton(day, visibleProgress, currentDay, selectedDay.number)).join("")}
                  </div>
                </section>
              `;
            }).join("")}
          </div>
        </details>
      </section>
    </div>
  `);
}

function HistoryScreen() {
  const history = normalizedHistoryList(state.history);
  const timelineEvents = normalizedTimelineEvents(state.timelineEvents);
  const showingTimeline = state.historySection === "timeline";

  return PlatformShell(`
    ${AppHeader("Hist&oacute;rico Astral", "Consultas e Relat&oacute;rios de Luz", { back: true })}
    <div class="history-section-tabs" role="tablist" aria-label="&Aacute;reas do hist&oacute;rico">
      <button
        class="${showingTimeline ? "" : "is-active"}"
        data-history-section="readings"
        role="tab"
        aria-selected="${showingTimeline ? "false" : "true"}"
        type="button"
      >Hist&oacute;rico de Leituras</button>
      <button
        class="${showingTimeline ? "is-active" : ""}"
        data-history-section="timeline"
        role="tab"
        aria-selected="${showingTimeline ? "true" : "false"}"
        type="button"
      >Linha do Tempo C&oacute;smica</button>
    </div>
    ${showingTimeline
      ? TimelinePanel(timelineEvents)
      : ReadingHistoryPanel(history)}
  `);
}

function ReadingHistoryPanel(history) {
  return history.length
    ? `<section class="history-list" aria-label="Hist&oacute;rico de Leituras">
        ${history
          .map(
            (item, index) => `
              <article class="history-card ${item.legacy ? "is-legacy" : ""}">
                <div>
                  <span>${escapeHtml(item.date || formatDateTimePtBr(item.createdAt))}</span>
                  <h2>${escapeHtml(decodeStoredText(item.areaTitle || "Leitura Astral"))}</h2>
                  ${item.kin ? `<small class="history-signature">Kin ${item.kin}${item.signature ? ` - ${escapeHtml(decodeStoredText(item.signature))}` : ""}</small>` : ""}
                  <p>${escapeHtml(shortHistorySummary(item.summary))}</p>
                  ${item.legacy ? `<small class="history-version-note">Leitura criada em vers&atilde;o anterior</small>` : ""}
                </div>
                ${index === 0 ? `<strong>Mais recente</strong>` : ""}
                <button data-history-id="${escapeHtml(item.readingId)}" type="button">Visualizar novamente</button>
              </article>
            `,
          )
          .join("")}
      </section>`
    : EmptyState();
}

function TimelineNotice() {
  if (!state.timelineNotice) {
    return "";
  }

  return `
    <p class="form-notice ${state.timelineNoticeKind === "pending_method_decision" ? "form-notice-special" : ""}" role="alert">
      ${state.timelineNotice}
    </p>
  `;
}

function TimelineEventForm() {
  const draft = state.timelineDraft || {};

  return GoldenCard(`
    <div class="timeline-form-heading">
      <div>
        <span>Novo marco</span>
        <h2>Registrar evento</h2>
      </div>
      <button data-cancel-timeline-event type="button" aria-label="Fechar formul&aacute;rio">&times;</button>
    </div>
    <form id="timeline-event-form" class="timeline-event-form">
      ${GoldenInput({
        label: "Nome do evento",
        name: "eventTitle",
        value: draft.title,
        placeholder: "Ex: In&iacute;cio do meu neg&oacute;cio",
        type: "text",
        iconName: "spark",
      })}
      ${GoldenInput({
        label: "Data do evento",
        name: "eventDate",
        value: draft.eventDate,
        placeholder: "dd/mm/aaaa",
        type: "date",
        iconName: "calendar",
      })}
      <label class="field-group">
        <span>Categoria</span>
        <span class="golden-input golden-select">
          ${icon("compass")}
          <select name="eventCategory" aria-label="Categoria do evento">
            <option value="">Selecione uma categoria</option>
            ${timelineCategories
              .map((category) => `
                <option value="${category}" ${decodeStoredText(draft.category) === decodeStoredText(category) ? "selected" : ""}>
                  ${category}
                </option>
              `)
              .join("")}
          </select>
        </span>
      </label>
      <label class="field-group">
        <span>Observa&ccedil;&atilde;o opcional</span>
        <span class="golden-input golden-textarea">
          ${icon("book")}
          <textarea name="eventNote" placeholder="O que aconteceu nesse per&iacute;odo?">${escapeHtml(draft.note || "")}</textarea>
        </span>
      </label>
      ${TimelineNotice()}
      <p class="timeline-form-safety">Este registro ajuda a observar padr&otilde;es. Ele n&atilde;o prev&ecirc; acontecimentos nem estabelece causalidade.</p>
      ${PrimaryEnergyButton("Salvar evento", 'type="submit"')}
    </form>
  `, "timeline-form-card");
}

function TimelinePatternsCard(events) {
  const analysis = window.DriveAstralCosmicTimeline.analyzePatterns(events);
  if (!analysis.eligible) {
    return "";
  }

  const messages = analysis.repeated.map((pattern) => {
    const value = escapeHtml(decodeStoredText(pattern.value));
    if (pattern.field === "chromaticWeek") {
      return `${pattern.count} dos seus eventos ocorreram na ${value}.`;
    }
    if (pattern.field === "moon") {
      return `${pattern.count} eventos importantes ocorreram na ${value}.`;
    }
    return `Voc&ecirc; possui ${pattern.count} registros associados ao chakra ${value}.`;
  });

  return GoldenCard(`
    <div class="timeline-pattern-heading">
      ${icon("chart")}
      <div>
        <span>Leitura comparativa</span>
        <h2>Padr&otilde;es observados</h2>
      </div>
    </div>
    <div class="timeline-pattern-list">
      ${(messages.length
        ? messages
        : ["Ainda h&aacute; poucos eventos repetidos para identificar padr&otilde;es consistentes."])
        .map((message) => `<p>${message}</p>`)
        .join("")}
    </div>
    <small>Os padr&otilde;es s&atilde;o contagens descritivas. N&atilde;o s&atilde;o previs&atilde;o nem conclus&atilde;o definitiva.</small>
  `, "timeline-pattern-card");
}

function TimelineEventCard(event) {
  const coordinates = event.coordinatesSnapshot;
  const relation = event.relationToPersonalKin;

  return `
    <article class="timeline-event-card">
      <div class="timeline-event-heading">
        <div>
          <span>${escapeHtml(decodeStoredText(event.category))}</span>
          <h2>${escapeHtml(event.title)}</h2>
          <time datetime="${escapeHtml(event.eventDate)}">${escapeHtml(formatDatePtBr(event.eventDate))}</time>
        </div>
        <strong>Kin ${coordinates.kin}</strong>
      </div>
      <p class="timeline-event-signature">${escapeHtml(decodeStoredText(coordinates.signature))}</p>
      <div class="timeline-event-coordinates">
        <span>${escapeHtml(decodeStoredText(coordinates.moon))}${coordinates.moonDay ? `, Dia ${coordinates.moonDay}` : ""}</span>
        ${coordinates.chromaticWeek ? `<span>${escapeHtml(decodeStoredText(coordinates.chromaticWeek))}</span>` : ""}
        ${coordinates.plasma ? `<span>Plasma ${escapeHtml(decodeStoredText(coordinates.plasma))} / ${escapeHtml(decodeStoredText(coordinates.chakra))}</span>` : ""}
      </div>
      <div class="timeline-event-relation">
        <span>Rela&ccedil;&atilde;o com seu Kin</span>
        ${relation.distance !== null
          ? `<strong>Dist&acirc;ncia de ${relation.distance} Kins</strong>`
          : "<strong>Kin pessoal ainda n&atilde;o configurado</strong>"}
        ${relation.sameColor !== null ? `<small>${relation.sameColor ? "Mesma cor" : "Cor diferente"} &middot; ${relation.sameTone ? "Mesmo tom" : "Tom diferente"} &middot; ${relation.sameSeal ? "Mesmo selo" : "Selo diferente"}</small>` : ""}
      </div>
      <button data-timeline-event-id="${escapeHtml(event.eventId)}" type="button">Ver coordenadas</button>
    </article>
  `;
}

function TimelinePanel(events) {
  return `
    <section class="timeline-panel" aria-label="Linha do Tempo C&oacute;smica">
      <div class="timeline-intro">
        <div>
          <span>Mem&oacute;ria de ciclos</span>
          <h2>Linha do Tempo C&oacute;smica</h2>
          <p>Registre datas importantes e compare as coordenadas ativas em cada momento.</p>
        </div>
        <button data-add-timeline-event type="button">${icon("spark")}<span>Adicionar evento</span></button>
      </div>
      ${state.timelineFormOpen ? TimelineEventForm() : ""}
      ${TimelinePatternsCard(events)}
      ${events.length
        ? `<div class="timeline-event-list">${events.map(TimelineEventCard).join("")}</div>`
        : `<section class="timeline-empty-state">
            ${GoldenDivider()}
            <h2>Sua linha do tempo come&ccedil;a aqui</h2>
            <p>Adicione um marco da sua vida para registrar o Kin e as coordenadas das 13 Luas daquele dia.</p>
          </section>`}
    </section>
  `;
}

function TimelineEventDetailScreen() {
  const event = timelineEventById(state.activeTimelineEventId);
  if (!event) {
    return PlatformShell(`
      ${AppHeader("Linha do Tempo", "Evento n&atilde;o encontrado", { back: true, backRoute: "history" })}
      <section class="timeline-empty-state"><p>Este evento n&atilde;o est&aacute; mais dispon&iacute;vel.</p></section>
    `);
  }

  const coordinates = event.coordinatesSnapshot;
  const relation = event.relationToPersonalKin;
  const otherEvents = normalizedTimelineEvents(state.timelineEvents)
    .filter((item) => item.eventId !== event.eventId);
  const sameMoon = otherEvents.filter((item) => item.coordinatesSnapshot.moon === coordinates.moon).length;
  const sameWeek = otherEvents.filter((item) => item.coordinatesSnapshot.chromaticWeek === coordinates.chromaticWeek).length;
  const sameChakra = otherEvents.filter((item) => item.coordinatesSnapshot.chakra === coordinates.chakra).length;
  const comparisonItems = [
    sameMoon ? `${sameMoon} outro(s) evento(s) na mesma Lua.` : "",
    sameWeek ? `${sameWeek} outro(s) evento(s) na mesma semana crom&aacute;tica.` : "",
    sameChakra ? `${sameChakra} outro(s) evento(s) com o mesmo chakra do plasma.` : "",
  ].filter(Boolean);

  return PlatformShell(`
    ${AppHeader("Coordenadas do Evento", formatDatePtBr(event.eventDate), { back: true, backRoute: "history" })}
    <section class="timeline-detail-stack">
      <header class="timeline-detail-hero">
        <span>${escapeHtml(decodeStoredText(event.category))}</span>
        <h2>${escapeHtml(event.title)}</h2>
        <p>${escapeHtml(event.note || "Sem observa&ccedil;&atilde;o adicional.")}</p>
      </header>
      ${GoldenCard(`
        <h2 class="settings-title">1. Coordenadas do Evento</h2>
        <div class="timeline-coordinate-grid">
          <div><span>Data gregoriana</span><strong>${escapeHtml(formatDatePtBr(event.eventDate))}</strong></div>
          <div><span>Kin</span><strong>${coordinates.kin}</strong></div>
          <div class="is-wide"><span>Assinatura</span><strong>${escapeHtml(decodeStoredText(coordinates.signature))}</strong></div>
          <div><span>Lua</span><strong>${escapeHtml(decodeStoredText(coordinates.moon))}</strong></div>
          <div><span>Dia da Lua</span><strong>${coordinates.moonDay || "Especial"}</strong></div>
          <div><span>Semana crom&aacute;tica</span><strong>${coordinates.chromaticWeek ? escapeHtml(decodeStoredText(coordinates.chromaticWeek)) : "Fora da contagem"}</strong></div>
          <div><span>Plasma</span><strong>${coordinates.plasma ? escapeHtml(decodeStoredText(coordinates.plasma)) : "Fora da contagem"}</strong></div>
          <div><span>Chakra</span><strong>${coordinates.chakra ? escapeHtml(decodeStoredText(coordinates.chakra)) : "Fora da contagem"}</strong></div>
          <div><span>Onda encantada</span><strong>${escapeHtml(decodeStoredText(coordinates.waveSpell))}</strong></div>
          <div><span>Posi&ccedil;&atilde;o na onda</span><strong>${coordinates.wavePosition} de 13</strong></div>
        </div>
      `, "timeline-detail-card")}
      ${GoldenCard(`
        <h2 class="settings-title">2. Rela&ccedil;&atilde;o com Meu Kin</h2>
        ${relation.personalKin
          ? `<div class="timeline-coordinate-grid">
              <div><span>Kin pessoal</span><strong>${relation.personalKin}</strong></div>
              <div><span>Kin do evento</span><strong>${relation.eventKin}</strong></div>
              <div><span>Dist&acirc;ncia</span><strong>${relation.distance} Kins</strong></div>
              <div><span>Rela&ccedil;&atilde;o</span><strong>${escapeHtml(decodeStoredText(relation.relationshipLabel || "Dist&acirc;ncia no ciclo"))}</strong></div>
              <div><span>Cor</span><strong>${relation.sameColor ? "Mesma cor" : "Cor diferente"}</strong></div>
              <div><span>Tom</span><strong>${relation.sameTone ? "Mesmo tom" : "Tom diferente"}</strong></div>
              <div><span>Selo</span><strong>${relation.sameSeal ? "Mesmo selo" : "Selo diferente"}</strong></div>
            </div>`
          : `<p class="transparency-note">Cadastre sua data de nascimento para comparar este evento com seu Kin pessoal. O snapshot do evento foi preservado.</p>`}
      `, "timeline-detail-card")}
      ${GoldenCard(`
        <h2 class="settings-title">3. Rela&ccedil;&atilde;o com Minha Linha do Tempo</h2>
        <div class="timeline-comparison-list">
          ${(comparisonItems.length
            ? comparisonItems
            : ["Ainda n&atilde;o h&aacute; repeti&ccedil;&otilde;es suficientes para comparar este evento."])
            .map((item) => `<p>${item}</p>`)
            .join("")}
        </div>
      `, "timeline-detail-card")}
      ${GoldenCard(`
        <h2 class="settings-title">4. Reflex&atilde;o sobre o Padr&atilde;o</h2>
        <p class="timeline-reflection">Este evento aconteceu na ${escapeHtml(decodeStoredText(coordinates.moon))}. Observe se outros momentos importantes da sua vida tamb&eacute;m ocorreram em coordenadas semelhantes. Pode ser interessante comparar os registros: este dado sugere um ponto de investiga&ccedil;&atilde;o, mas n&atilde;o &eacute; uma conclus&atilde;o definitiva.</p>
        <small class="timeline-snapshot-note">Exibindo o snapshot salvo em ${escapeHtml(formatDateTimePtBr(event.createdAt))}. Nenhuma coordenada foi recalculada ao abrir este evento.</small>
      `, "timeline-detail-card")}
    </section>
  `);
}

function LegacyHistoryScreen() {
  const entry = historyEntryById(state.activeHistoryId);

  if (!entry) {
    return PlatformShell(`
      ${AppHeader("Leitura anterior", "Registro local", { back: true, backRoute: "history" })}
      ${EmptyState()}
    `);
  }

  return PlatformShell(`
      ${AppHeader("Leitura anterior", "Registro local", { back: true, backRoute: "history" })}
      <section class="history-list">
        ${GoldenCard(`
        <h2 class="settings-title">${escapeHtml(decodeStoredText(entry.areaTitle || "Leitura Astral"))}</h2>
        <p class="date-context">${escapeHtml(entry.date || "Data anterior")}</p>
        ${entry.kin ? `<p class="reading-signature">Kin ${entry.kin}${entry.signature ? ` - ${escapeHtml(decodeStoredText(entry.signature))}` : ""}</p>` : ""}
        <p class="transparency-note">${escapeHtml(decodeStoredText(entry.summary || "Leitura criada em vers&atilde;o anterior."))}</p>
        <small class="history-version-note">Leitura criada em vers&atilde;o anterior. Este registro preserva apenas os dados que j&aacute; estavam salvos no navegador.</small>
      `, "legacy-history-card")}
    </section>
  `);
}

function ProfileActionRow({ iconName, title, subtitle, value = "", attrs = "", danger = false }) {
  return `
    <button class="profile-action-row ${danger ? "is-danger" : ""}" ${attrs || 'type="button"'}>
      <span class="profile-action-icon">${icon(iconName)}</span>
      <span class="profile-action-copy">
        <strong>${title}</strong>
        <small>${subtitle}</small>
      </span>
      ${value ? `<span class="profile-action-value">${value}</span>` : ""}
      <span class="profile-action-arrow">${icon("arrow")}</span>
    </button>
  `;
}

function ProfileToggleRow({ iconName, title, subtitle, active = true }) {
  return `
    <div class="profile-action-row profile-toggle-row">
      <span class="profile-action-icon">${icon(iconName)}</span>
      <span class="profile-action-copy">
        <strong>${title}</strong>
        <small>${subtitle}</small>
      </span>
      <span class="profile-toggle ${active ? "is-active" : ""}" aria-hidden="true"><i></i></span>
    </div>
  `;
}

function monthYearPtBr(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return "data n&atilde;o informada";
  }
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function ProfileScreen() {
  const account = state.account || {};
  const name = account.name || state.name || "Seu Nome";
  const email = account.email || "seuemail@exemplo.com";
  const birth = account.birth || state.birth || "";
  const city = account.city || account.location || "Adicionar cidade";
  const phone = account.phone || "Adicionar telefone";
  const planLabel = currentPlanBadge();
  const joinedAt = account.created_at || account.createdAt || (state.history && state.history[0] && state.history[0].createdAt) || "";
  const memberSince = monthYearPtBr(joinedAt);
  const area = selectedConsultationArea();
  const focusArea = area
    ? area.title
    : state.reading && state.reading.input && state.reading.input.focus_area
      ? state.reading.input.focus_area.label
      : "Primeira consulta";

  return PlatformShell(`
    ${AppHeader("Meu Perfil", "Gerencie suas informa&ccedil;&otilde;es e prefer&ecirc;ncias", { back: true })}
    <section class="profile-page">
      <aside class="profile-body-rail" aria-hidden="true">
        ${ChakraBodyMap()}
      </aside>
      <div class="profile-main">
        <section class="profile-hero-card">
          <div class="profile-avatar-wrap">
            <span class="profile-avatar">${icon("user")}</span>
            <button class="profile-avatar-camera" type="button" aria-label="Alterar foto">${icon("camera")}</button>
          </div>
          <div class="profile-hero-copy">
            <h2>${escapeHtml(name)}</h2>
            <p>${planLabel === "FREE" ? "Caminhante da Luz" : `Plano ${planLabel}`}</p>
            <span>${icon("calendar")} Membro desde &bull; ${escapeHtml(memberSince)}</span>
          </div>
          <button class="profile-edit-button" type="button" aria-label="Editar perfil">${icon("edit")}</button>
        </section>

        <section class="profile-panel">
          <h2>Informa&ccedil;&otilde;es pessoais</h2>
          <div class="profile-action-list">
            ${ProfileActionRow({ iconName: "user", title: "Nome completo", subtitle: escapeHtml(name) })}
            ${ProfileActionRow({ iconName: "calendar", title: "Data de nascimento", subtitle: birth ? escapeHtml(formatDatePtBr(birth)) : "Adicionar data" })}
            ${ProfileActionRow({ iconName: "phone", title: "Telefone", subtitle: escapeHtml(phone) })}
            ${ProfileActionRow({ iconName: "mail", title: "E-mail", subtitle: escapeHtml(email) })}
            ${ProfileActionRow({ iconName: "pin", title: "Cidade", subtitle: escapeHtml(city) })}
          </div>
        </section>

        <section class="profile-panel">
          <h2>Seguran&ccedil;a</h2>
          <div class="profile-action-list">
            ${ProfileActionRow({ iconName: "lock", title: "Alterar senha", subtitle: "Atualize sua senha de acesso" })}
            ${ProfileToggleRow({ iconName: "shield", title: "Autentica&ccedil;&atilde;o em duas etapas", subtitle: "Proteja ainda mais sua conta", active: true })}
          </div>
        </section>

        <section class="profile-panel">
          <h2>Prefer&ecirc;ncias</h2>
          <div class="profile-action-list">
            ${ProfileToggleRow({ iconName: "bell", title: "Notifica&ccedil;&otilde;es", subtitle: "Receber lembretes e mensagens", active: true })}
            ${ProfileToggleRow({ iconName: "moon", title: "Modo escuro", subtitle: "Tema premium ativo", active: true })}
            ${ProfileActionRow({ iconName: "leaf", title: "Idioma", subtitle: "Portugu&ecirc;s" })}
            ${ProfileActionRow({ iconName: "ruler", title: "Unidade de medida", subtitle: "M&eacute;trica (kg, cm)" })}
            ${ProfileActionRow({ iconName: "clock", title: "Hor&aacute;rio de pr&aacute;tica di&aacute;rio", subtitle: "06:00" })}
            ${ProfileActionRow({ iconName: "compass", title: "&Aacute;rea padr&atilde;o", subtitle: escapeHtml(focusArea) })}
          </div>
        </section>

        <section class="profile-panel">
          <h2>Conta</h2>
          ${state.notice ? `<p class="form-notice" role="status">${state.notice}</p>` : ""}
          <div class="profile-action-list">
            ${ProfileActionRow({ iconName: "profile", title: "Gerenciar assinatura", subtitle: `Plano atual: ${planLabel}` })}
            <button class="profile-action-row" data-export-backup type="button">
              <span class="profile-action-icon">${icon("download")}</span>
              <span class="profile-action-copy"><strong>Exportar meus dados</strong><small>Baixar backup das suas informa&ccedil;&otilde;es</small></span>
              <span class="profile-action-arrow">${icon("arrow")}</span>
            </button>
            <button class="profile-action-row" data-import-backup type="button">
              <span class="profile-action-icon">${icon("upload")}</span>
              <span class="profile-action-copy"><strong>Importar backup</strong><small>Restaurar informa&ccedil;&otilde;es salvas</small></span>
              <span class="profile-action-arrow">${icon("arrow")}</span>
            </button>
            <button class="profile-action-row" data-install-platform type="button" hidden>
              <span class="profile-action-icon">${icon("device")}</span>
              <span class="profile-action-copy"><strong>Instalar no dispositivo</strong><small>Acessar o Drive Mental como aplicativo</small></span>
              <span class="profile-action-arrow">${icon("arrow")}</span>
            </button>
            <a class="profile-action-row" href="/privacy.html" target="_blank" rel="noopener">
              <span class="profile-action-icon">${icon("info")}</span>
              <span class="profile-action-copy"><strong>Privacidade e dados</strong><small>Como suas informa&ccedil;&otilde;es s&atilde;o tratadas</small></span>
              <span class="profile-action-arrow">${icon("arrow")}</span>
            </a>
            <a class="profile-action-row" href="/terms.html" target="_blank" rel="noopener">
              <span class="profile-action-icon">${icon("book")}</span>
              <span class="profile-action-copy"><strong>Termos de uso</strong><small>Condi&ccedil;&otilde;es de acesso &agrave; plataforma</small></span>
              <span class="profile-action-arrow">${icon("arrow")}</span>
            </a>
            <input id="backup-file-input" data-backup-file type="file" accept="application/json,.json" hidden />
            ${ProfileActionRow({
              iconName: "trash",
              title: "Excluir conta",
              subtitle: isSupabaseMode() ? "Excluir minha conta e todos os dados" : "Excluir meus dados deste dispositivo",
              attrs: 'data-clear-state type="button"',
              danger: true,
            })}
          </div>
        </section>

        <button class="profile-signout-button" data-signout type="button">
          <span>${icon("logout")}</span>
          <strong>Sair da conta</strong>
          ${icon("arrow")}
        </button>
      </div>
    </section>
  `);
}

function submitSignup({ name: nameValue, email: emailValue, password, termsAccepted }) {
  const name = String(nameValue || "").trim();
  const email = String(emailValue || "").trim().toLowerCase();
  const passwordValue = String(password || "");

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setState({
      authNotice: "Informe seu nome e um e-mail v&aacute;lido.",
      authNoticeKind: "error",
    });
    return;
  }

  const minimumPasswordLength = isSupabaseMode() ? 8 : 6;
  if (passwordValue.length < minimumPasswordLength) {
    setState({
      authNotice: `Crie uma senha com pelo menos ${minimumPasswordLength} caracteres.`,
      authNoticeKind: "error",
    });
    return;
  }

  if (!termsAccepted) {
    setState({
      authNotice: "Confirme a Pol&iacute;tica de Privacidade para continuar.",
      authNoticeKind: "error",
    });
    return;
  }

  if (isSupabaseMode()) {
    setState({
      authNotice: "Criando sua conta segura...",
      authNoticeKind: "",
    });
    supabaseService().signUp({
      name,
      email,
      password: passwordValue,
      privacyVersion: PRIVACY_POLICY_VERSION,
      termsVersion: TERMS_VERSION,
    }).then(({ account, requiresEmailConfirmation }) => {
      if (requiresEmailConfirmation) {
        setState({
          route: "login",
          authenticated: false,
          account: null,
          authNotice: "Enviamos um link de confirma&ccedil;&atilde;o para seu e-mail.",
          authNoticeKind: "",
        }, { updateUrl: true });
        return;
      }
      setState({
        route: account && account.onboardingComplete ? "dashboard" : "onboarding",
        account,
        authenticated: true,
        name: account ? account.name : name,
        birth: account ? account.birth : "",
        selectedAreaId: account ? account.primaryAreaId : "",
        authNotice: "",
        authNoticeKind: "",
      }, { updateUrl: true });
    }).catch(() => {
      setState({
        authNotice: "N&atilde;o foi poss&iacute;vel criar a conta. Verifique o e-mail e tente novamente.",
        authNoticeKind: "error",
      });
    });
    return;
  }

  const account = {
    name,
    email,
    birth: "",
    primaryAreaId: "",
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
    accessMode: "local-preview",
    consent: {
      acceptedAt: new Date().toISOString(),
      privacyVersion: PRIVACY_POLICY_VERSION,
      termsVersion: TERMS_VERSION,
    },
  };
  saveLocalAccount(account);
  setState({
    route: "onboarding",
    account,
    authenticated: true,
    name,
    birth: "",
    selectedAreaId: "",
    authNotice: "",
    authNoticeKind: "",
  }, { updateUrl: true });
}

function submitLogin({ email: emailValue, password }) {
  const email = String(emailValue || "").trim().toLowerCase();
  const passwordValue = String(password || "");
  if (isSupabaseMode()) {
    if (!email || passwordValue.length < 8) {
      setState({
        authNotice: "Informe e-mail e senha v&aacute;lidos.",
        authNoticeKind: "error",
      });
      return;
    }
    setState({
      authNotice: "Entrando com seguran&ccedil;a...",
      authNoticeKind: "",
    });
    supabaseService().signIn({ email, password: passwordValue }).then(async (account) => {
      const cloudState = await supabaseService().loadCloudState();
      const history = normalizedHistoryList(cloudState.history);
      const latestEntry = history[0] || null;
      setState({
        route: account.onboardingComplete ? "dashboard" : "onboarding",
        account,
        authenticated: true,
        name: account.name || "",
        birth: account.birth || "",
        selectedAreaId: account.primaryAreaId || "",
        history,
        timelineEvents: normalizedTimelineEvents(cloudState.timelineEvents),
        reading: latestEntry ? readingForHistoryEntry(latestEntry) : null,
        activeHistoryId: latestEntry ? latestEntry.readingId : "",
        authNotice: "",
        authNoticeKind: "",
      }, { persist: true, updateUrl: true });
      hydrateSupabaseProgress();
    }).catch((error) => {
      const errorCode = String(error?.code || "").toLowerCase();
      const errorMessage = String(error?.message || "").toLowerCase();
      let notice = "N&atilde;o foi poss&iacute;vel entrar agora. Tente novamente.";

      if (errorCode === "email_not_confirmed" || errorMessage.includes("email not confirmed")) {
        notice = "Este e-mail ainda n&atilde;o foi confirmado no Supabase.";
      } else if (errorCode === "invalid_credentials" || errorMessage.includes("invalid login credentials")) {
        notice = "E-mail ou senha incorretos.";
      } else if (errorCode.startsWith("pgrst") || errorCode === "42501") {
        notice = "Login aceito, mas o perfil n&atilde;o p&ocirc;de ser carregado do banco.";
      }

      console.error("Supabase login failed", {
        code: error?.code || "unknown",
        status: error?.status || null,
        message: error?.message || "Unknown authentication error",
      });
      setState({
        authNotice: notice,
        authNoticeKind: "error",
      });
    });
    return;
  }

  const account = loadLocalAccount();

  if (!account || account.email !== email) {
    setState({
      authNotice: "Nenhuma conta local foi encontrada para este e-mail neste dispositivo.",
      authNoticeKind: "error",
    });
    return;
  }

  if (passwordValue.length < 6) {
    setState({
      authNotice: "Informe a senha com pelo menos 6 caracteres.",
      authNoticeKind: "error",
    });
    return;
  }

  localStorage.setItem(SESSION_KEY, "active");
  setState({
    route: account.onboardingComplete ? "dashboard" : "onboarding",
    account,
    authenticated: true,
    name: state.name || account.name || "",
    birth: state.birth || account.birth || "",
    selectedAreaId: state.selectedAreaId || account.primaryAreaId || "",
    authNotice: "",
    authNoticeKind: "",
  }, { updateUrl: true });
}

function requestPasswordReset(emailValue) {
  const email = String(emailValue || "").trim().toLowerCase();
  if (!isSupabaseMode() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setState({
      authNotice: "Informe seu e-mail para receber o link de recupera&ccedil;&atilde;o.",
      authNoticeKind: "error",
    });
    return;
  }
  setState({
    authNotice: "Enviando o link de recupera&ccedil;&atilde;o...",
    authNoticeKind: "",
  });
  supabaseService().resetPassword(email).then(() => {
    setState({
      authNotice: "Confira seu e-mail para criar uma nova senha.",
      authNoticeKind: "",
    });
  }).catch(() => {
    setState({
      authNotice: "N&atilde;o foi poss&iacute;vel enviar o link. Tente novamente.",
      authNoticeKind: "error",
    });
  });
}

function submitUpdatedPassword(passwordValue) {
  const password = String(passwordValue || "");
  if (!isSupabaseMode() || password.length < 8) {
    setState({
      authNotice: "Use uma senha com pelo menos 8 caracteres.",
      authNoticeKind: "error",
    });
    return;
  }
  setState({
    authNotice: "Atualizando sua senha...",
    authNoticeKind: "",
  });
  supabaseService().updatePassword(password).then(async () => {
    const account = await supabaseService().getAccount();
    window.history.replaceState({ route: "login" }, "", "/login");
    setState({
      route: account && account.onboardingComplete ? "dashboard" : "onboarding",
      account,
      authenticated: true,
      name: account ? account.name : state.name,
      birth: account ? account.birth : state.birth,
      selectedAreaId: account ? account.primaryAreaId : state.selectedAreaId,
      authNotice: "",
      authNoticeKind: "",
    }, { updateUrl: true, replaceUrl: true });
  }).catch(() => {
    setState({
      authNotice: "O link expirou ou a senha n&atilde;o p&ocirc;de ser atualizada.",
      authNoticeKind: "error",
    });
  });
}

function enterDemoAccess() {
  const account = {
    name: decodeStoredText("Conta Demonstra&ccedil;&atilde;o"),
    email: "demo@driveastral.local",
    birth: "1996-06-25",
    primaryAreaId: "general",
    onboardingComplete: true,
    createdAt: new Date().toISOString(),
    accessMode: "local-demo",
  };
  const area = consultationAreas.find((item) => item.id === account.primaryAreaId);
  const reading = calculateReading(account.birth, account.primaryAreaId);
  const historyEntry = createReadingHistoryEntry({
    name: account.name,
    birth: account.birth,
    area,
    reading,
  });

  saveLocalAccount(account);
  setState({
    route: "dashboard",
    account,
    authenticated: true,
    name: account.name,
    birth: account.birth,
    selectedAreaId: account.primaryAreaId,
    reading,
    activeHistoryId: historyEntry.readingId,
    history: [historyEntry],
    authNotice: "",
    authNoticeKind: "",
  }, { persist: true, updateUrl: true });
}

function requestAdminAccess() {
  if (state.adminLoading || state.adminAccessChecked) {
    return;
  }

  if (!isSupabaseMode()) {
    setState({
      adminAccessChecked: true,
      adminRole: "owner",
      adminLoading: false,
    });
    return;
  }

  setState({ adminLoading: true, adminNotice: "", adminNoticeKind: "" });
  supabaseService().getAdminRole().then((role) => {
    setState({
      adminAccessChecked: true,
      adminLoading: false,
      adminRole: role || "",
    });
  }).catch(() => {
    setState({
      adminAccessChecked: true,
      adminLoading: false,
      adminRole: "",
      adminNotice: "N&atilde;o foi poss&iacute;vel verificar permiss&atilde;o admin.",
      adminNoticeKind: "error",
    });
  });
}

function normalizeAdminSettingsRows(rows) {
  const defaults = defaultAdminSettings();
  return {
    general: { ...defaults.general, ...(rows[ADMIN_SETTING_KEYS.general] || {}) },
    plans: { ...defaults.plans, ...(rows[ADMIN_SETTING_KEYS.plans] || {}) },
    checkout: { ...defaults.checkout, ...(rows[ADMIN_SETTING_KEYS.checkout] || {}) },
    methodology: { ...defaults.methodology, ...(rows[ADMIN_SETTING_KEYS.methodology] || {}) },
  };
}

function requestAdminSettings() {
  if (!isSupabaseMode() || state.adminSettingsLoading || state.adminSettingsLoaded || !state.adminRole) {
    return;
  }

  setState({ adminSettingsLoading: true, adminNotice: "", adminNoticeKind: "" });
  supabaseService().loadAdminSettings().then((rows) => {
    setState({
      adminSettings: normalizeAdminSettingsRows(rows || {}),
      adminSettingsLoaded: true,
      adminSettingsLoading: false,
    });
  }).catch(() => {
    setState({
      adminSettingsLoading: false,
      adminNotice: "N&atilde;o foi poss&iacute;vel carregar as configura&ccedil;&otilde;es.",
      adminNoticeKind: "error",
    });
  });
}

function requestAdminUsers() {
  if (state.adminUsersLoading || state.adminUsersLoaded) {
    return;
  }

  if (!isSupabaseMode()) {
    setState({
      adminUsers: [{
        user_id: "local-preview",
        email: (state.account && state.account.email) || "admin@preview.local",
        display_name: (state.account && state.account.name) || "Admin Preview",
        primary_area_id: "preview",
        created_at: new Date().toISOString(),
      }],
      adminUserAccessPlans: [],
      adminUsersLoaded: true,
    });
    return;
  }

  setState({ adminUsersLoading: true, adminNotice: "", adminNoticeKind: "" });
  supabaseService().listAdminUsers().then((payload) => {
    setState({
      adminUsers: payload.profiles || [],
      adminUserAccessPlans: payload.accessPlans || [],
      adminUsersLoaded: true,
      adminUsersLoading: false,
    });
  }).catch(() => {
    setState({
      adminUsersLoading: false,
      adminNotice: "N&atilde;o foi poss&iacute;vel carregar usu&aacute;rios.",
      adminNoticeKind: "error",
    });
  });
}

function requestAdminPlans() {
  if (state.adminPlansLoading || state.adminPlansLoaded) {
    return;
  }

  if (!isSupabaseMode()) {
    setState({
      adminPlans: adminFallbackPlans(),
      adminPlansLoaded: true,
    });
    return;
  }

  setState({ adminPlansLoading: true, adminNotice: "", adminNoticeKind: "" });
  supabaseService().listAdminPlans().then((plans) => {
    setState({
      adminPlans: plans && plans.length ? plans : adminFallbackPlans(),
      adminPlansLoaded: true,
      adminPlansLoading: false,
    });
  }).catch(() => {
    setState({
      adminPlansLoading: false,
      adminNotice: "N&atilde;o foi poss&iacute;vel carregar planos.",
      adminNoticeKind: "error",
    });
  });
}

function adminSettingsFromForm(formData) {
  return {
    general: {
      platformName: String(formData.get("platformName") || "").trim() || "Drive Mental",
      supportEmail: String(formData.get("supportEmail") || "").trim(),
      environmentStatus: String(formData.get("environmentStatus") || "producao"),
      maintenanceMode: formData.get("maintenanceMode") === "on",
      globalNotice: String(formData.get("globalNotice") || "").trim(),
    },
    plans: {
      premiumBadge: String(formData.get("premiumBadge") || "").trim() || "PREMIUM",
      premiumPrice: String(formData.get("premiumPrice") || "").trim() || "29,90",
      mentorBadge: String(formData.get("mentorBadge") || "").trim() || "MENTOR",
      mentorPrice: String(formData.get("mentorPrice") || "").trim() || "97,00",
      ctaText: String(formData.get("ctaText") || "").trim() || "INICIAR A MINHA JORNADA",
      premiumVisible: formData.get("premiumVisible") === "on",
      mentorVisible: formData.get("mentorVisible") === "on",
    },
    checkout: {
      provider: String(formData.get("provider") || "hotmart"),
      premiumCheckoutUrl: String(formData.get("premiumCheckoutUrl") || "").trim(),
      mentorCheckoutUrl: String(formData.get("mentorCheckoutUrl") || "").trim(),
      accessInstruction: String(formData.get("accessInstruction") || "").trim(),
    },
    methodology: {
      activeVersion: String(formData.get("activeVersion") || "").trim(),
      draftVersion: String(formData.get("draftVersion") || "").trim(),
      leapDayPolicy: String(formData.get("leapDayPolicy") || "blocked"),
      dailyPhraseEnabled: formData.get("dailyPhraseEnabled") === "on",
      mantraEnabled: formData.get("mantraEnabled") === "on",
    },
  };
}

function adminPlanFromForm(formData) {
  const features = String(formData.get("features") || "")
    .split("\n")
    .map((feature) => feature.trim())
    .filter(Boolean);
  return {
    plan_id: String(formData.get("planId") || "").trim(),
    display_name: String(formData.get("displayName") || "").trim(),
    badge: String(formData.get("badge") || "").trim(),
    price_label: String(formData.get("priceLabel") || "").trim(),
    billing_label: String(formData.get("billingLabel") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    cta_text: String(formData.get("ctaText") || "").trim(),
    checkout_url: String(formData.get("checkoutUrl") || "").trim(),
    is_visible: formData.get("isVisible") === "on",
    sort_order: Number(formData.get("sortOrder")) || 0,
    features,
  };
}

function submitAdminPlan(formData) {
  const plan = adminPlanFromForm(formData);
  if (!plan.plan_id || !plan.display_name) {
    setState({
      adminNotice: "Informe pelo menos o nome do plano.",
      adminNoticeKind: "error",
    });
    return;
  }

  if (!isSupabaseMode()) {
    setState({
      adminPlans: adminPlansWithUpdate(plan),
      adminPlansLoaded: true,
      adminNotice: "Plano atualizado na pr&eacute;via local.",
      adminNoticeKind: "",
    });
    return;
  }

  setState({
    adminSaving: true,
    adminNotice: "Salvando plano...",
    adminNoticeKind: "",
  });
  supabaseService().saveAdminPlan(plan).then(() => {
    setState({
      adminPlans: adminPlansWithUpdate(plan),
      adminPlansLoaded: true,
      adminSaving: false,
      adminNotice: "Plano salvo com sucesso.",
      adminNoticeKind: "",
    });
  }).catch(() => {
    setState({
      adminSaving: false,
      adminNotice: "N&atilde;o foi poss&iacute;vel salvar o plano.",
      adminNoticeKind: "error",
    });
  });
}

function adminUserAccessFromForm(formData) {
  return {
    user_id: String(formData.get("userId") || "").trim(),
    plan_id: String(formData.get("planId") || "").trim(),
    status: String(formData.get("status") || "active"),
    source: "manual",
  };
}

function submitAdminUserAccess(formData) {
  const access = adminUserAccessFromForm(formData);
  if (!access.user_id || !access.plan_id) {
    setState({
      adminNotice: "Escolha um usu&aacute;rio e um plano para liberar acesso.",
      adminNoticeKind: "error",
    });
    return;
  }

  if (!isSupabaseMode()) {
    setState({
      adminUserAccessPlans: adminAccessPlansWithUpdate(access),
      adminUsersLoaded: true,
      adminNotice: "Acesso atualizado na pr&eacute;via local.",
      adminNoticeKind: "",
    });
    return;
  }

  setState({
    adminSaving: true,
    adminNotice: "Salvando acesso do usu&aacute;rio...",
    adminNoticeKind: "",
  });
  supabaseService().assignAdminUserPlan(access).then(() => {
    setState({
      adminUserAccessPlans: adminAccessPlansWithUpdate(access),
      adminUsersLoaded: true,
      adminSaving: false,
      adminNotice: "Acesso atualizado com sucesso.",
      adminNoticeKind: "",
    });
  }).catch(() => {
    setState({
      adminSaving: false,
      adminNotice: "N&atilde;o foi poss&iacute;vel atualizar o acesso.",
      adminNoticeKind: "error",
    });
  });
}

function submitAdminSettings(formData) {
  const settings = adminSettingsFromForm(formData);
  if (!isSupabaseMode()) {
    setState({
      adminSettings: settings,
      adminSettingsLoaded: true,
      adminNotice: "Configura&ccedil;&otilde;es atualizadas na pr&eacute;via local.",
      adminNoticeKind: "",
    });
    return;
  }

  const payload = {
    [ADMIN_SETTING_KEYS.general]: settings.general,
    [ADMIN_SETTING_KEYS.plans]: settings.plans,
    [ADMIN_SETTING_KEYS.checkout]: settings.checkout,
    [ADMIN_SETTING_KEYS.methodology]: settings.methodology,
  };
  setState({
    adminSettingsLoading: true,
    adminNotice: "Salvando configura&ccedil;&otilde;es...",
    adminNoticeKind: "",
  });
  supabaseService().saveAdminSettings(payload).then(() => {
    setState({
      adminSettings: settings,
      adminSettingsLoaded: true,
      adminSettingsLoading: false,
      adminNotice: "Configura&ccedil;&otilde;es salvas com sucesso.",
      adminNoticeKind: "",
    });
  }).catch(() => {
    setState({
      adminSettingsLoading: false,
      adminNotice: "N&atilde;o foi poss&iacute;vel salvar as configura&ccedil;&otilde;es.",
      adminNoticeKind: "error",
    });
  });
}

function currentEngineVersion() {
  return window.DriveAstralSincronario
    && window.DriveAstralSincronario.constants
    && window.DriveAstralSincronario.constants.ENGINE_VERSION
    ? window.DriveAstralSincronario.constants.ENGINE_VERSION
    : "unknown";
}

function firstReadingIdempotencyKey({ userId, areaId, readingDate, engineVersion }) {
  return [
    "first-reading",
    userId || "local-user",
    areaId,
    readingDate,
    engineVersion,
  ].map((part) => String(part || "unknown").replace(/[^a-zA-Z0-9._-]/g, "-")).join(":");
}

function completeFirstReading(entry, account) {
  const normalizedEntry = normalizeHistoryEntry(entry);
  if (!normalizedEntry || !normalizedEntry.readingSnapshot) {
    throw new Error("FIRST_READING_SNAPSHOT_INVALID");
  }
  const completedAccount = { ...account, onboardingComplete: true };
  if (!isSupabaseMode()) saveLocalAccount(completedAccount);
  setState({
    route: "chakras",
    account: completedAccount,
    authenticated: true,
    name: completedAccount.name,
    birth: completedAccount.birth,
    selectedAreaId: completedAccount.primaryAreaId,
    reading: readingForHistoryEntry(normalizedEntry),
    activeHistoryId: normalizedEntry.readingId,
    requestedReadingId: normalizedEntry.readingId,
    history: [normalizedEntry, ...normalizedHistoryList(state.history).filter((item) => item.readingId !== normalizedEntry.readingId)].slice(0, 8),
    firstReadingStatus: "completed",
    firstReadingStep: 5,
    firstReadingError: "",
    authNotice: "",
    authNoticeKind: "",
  }, { persist: true, updateUrl: true });
}

async function submitOnboarding(birthValue) {
  if (state.firstReadingStatus === "processing") {
    return;
  }
  const birth = String(birthValue || "").trim();
  const validation = validateBirthDateForProduct(birth);
  const area = selectedConsultationArea();

  if (validation.status === "invalid") {
    setState({
      birth,
      authNotice: "Informe uma data de nascimento v&aacute;lida para continuar.",
      authNoticeKind: "error",
    });
    return;
  }

  if (validation.status === "pending_method_decision") {
    setState({
      birth,
      authNotice: "Datas de 29 de fevereiro ainda aguardam uma defini&ccedil;&atilde;o metodol&oacute;gica nesta vers&atilde;o.",
      authNoticeKind: "error",
    });
    return;
  }

  if (!area) {
    setState({
      birth,
      authNotice: "Escolha uma &aacute;rea principal para concluir.",
      authNoticeKind: "error",
    });
    return;
  }

  const account = {
    ...(state.account || loadLocalAccount() || {}),
    name: (state.account && state.account.name) || state.name || "",
    birth,
    primaryAreaId: area.id,
    onboardingComplete: false,
    updatedAt: new Date().toISOString(),
  };

  setState({
    birth,
    firstReadingStatus: "processing",
    firstReadingStep: 1,
    firstReadingError: "",
    authNotice: "",
    authNoticeKind: "",
  });

  try {
    const persistedAccount = isSupabaseMode()
      ? await supabaseService().updateProfile({
          name: account.name,
          birth,
          primaryAreaId: area.id,
        })
      : account;
    if (!isSupabaseMode()) saveLocalAccount(persistedAccount);

    const readingDate = todayForEngine();
    const engineVersion = currentEngineVersion();
    const idempotencyKey = firstReadingIdempotencyKey({
      userId: persistedAccount.id || persistedAccount.email || "local-user",
      areaId: area.id,
      readingDate,
      engineVersion,
    });
    const localExisting = normalizedHistoryList(state.history).find((entry) => (
      entry.readingId === idempotencyKey
      || (
        entry.readingType === "first-reading"
        && entry.areaId === area.id
        && entry.engineVersion === engineVersion
        && entry.readingSnapshot
        && entry.readingSnapshot.input
        && entry.readingSnapshot.input.current_date
        && entry.readingSnapshot.input.current_date.value === readingDate
      )
    ));
    const existing = isSupabaseMode()
      ? await supabaseService().findFirstReading({ areaId: area.id, readingDate, engineVersion })
      : localExisting;
    if (existing) {
      completeFirstReading(existing, persistedAccount);
      return;
    }

    setState({ firstReadingStep: 2 });
    const reading = calculateReading(birth, area.id);
    if (!personalKin(reading)) throw new Error("FIRST_READING_CALCULATION_FAILED");
    setState({ firstReadingStep: 3 });
    if (!reading.coordinates || !reading.coordinates.synchronization) {
      throw new Error("FIRST_READING_SYNCHRONIZATION_FAILED");
    }
    setState({ firstReadingStep: 4 });
    const guidance = readingGuidance(reading);
    if (!guidance || !guidance.interpretation) {
      throw new Error("FIRST_READING_INTERPRETATION_FAILED");
    }
    const historyEntry = createReadingHistoryEntry({
      name: persistedAccount.name,
      birth,
      area,
      reading,
      readingId: idempotencyKey,
      readingType: "first-reading",
    });
    setState({ firstReadingStep: 5 });
    const savedEntry = isSupabaseMode()
      ? await supabaseService().saveReading(historyEntry)
      : historyEntry;
    completeFirstReading(savedEntry, persistedAccount);
  } catch {
    setState({
      firstReadingStatus: "failed",
      firstReadingError: "FIRST_READING_FAILED",
      authNotice: "N&atilde;o foi poss&iacute;vel concluir sua leitura agora. Seus dados foram preservados e voc&ecirc; pode tentar novamente.",
      authNoticeKind: "error",
    });
  }
}

function submitAlignment(nameValue, birthValue) {
  const name = String(nameValue || "").trim();
  const birth = String(birthValue || "").trim();
  const area = selectedConsultationArea();

  if (!name || !birth) {
    setState({
      name,
      birth,
      notice: "Informe nome e data para iniciar a sintonia.",
      noticeKind: "missing_input",
    });
    return;
  }

  const birthDateValidation = validateBirthDateForProduct(birth);
  if (birthDateValidation.status === "invalid") {
    setState({
      name,
      birth,
      reading: null,
      notice: "Informe uma data de nascimento v&aacute;lida.",
      noticeKind: "invalid_date",
    });
    return;
  }

  if (birthDateValidation.status === "pending_method_decision") {
    setState({
      name,
      birth,
      reading: null,
      notice: "29 de fevereiro possui regra especial e ainda n&atilde;o est&aacute; dispon&iacute;vel nesta vers&atilde;o.",
      noticeKind: "pending_method_decision",
    });
    return;
  }

  if (!area) {
    setState({
      name,
      birth,
      areaCarouselTouched: true,
      notice: "Escolha uma &aacute;rea para iniciar a sintonia.",
      noticeKind: "missing_area",
    });
    return;
  }

  if (!canStartConsultationForArea(area.id)) {
    setState({
      name,
      birth,
      selectedAreaId: area.id,
      upgradeModalOpen: true,
      upgradeAreaId: area.id,
      notice: "",
      noticeKind: "",
    });
    return;
  }

  const reading = calculateReading(birth, area.id);
  const kin = personalKin(reading);

  if (!kin) {
    setState({
      name,
      birth,
      reading,
      notice: "Informe uma data de nascimento v&aacute;lida.",
      noticeKind: "invalid_date",
    });
    return;
  }

  const historyEntry = createReadingHistoryEntry({ name, birth, area, reading });

  setState({
    name,
    birth,
    selectedAreaId: area.id,
    areaCarouselTouched: false,
    reading,
    activeHistoryId: historyEntry.readingId,
    history: [historyEntry, ...normalizedHistoryList(state.history)].slice(0, 8),
    route: "chakras",
    notice: "",
    noticeKind: "",
  }, { persist: true, updateUrl: true });

  if (isSupabaseMode()) {
    supabaseService().saveReading(historyEntry).catch(() => {
      // The local copy remains available and can be synchronized on a later attempt.
    });
  }
}

function render() {
  const screens = {
    landing: LandingScreen,
    login: LoginScreen,
    signup: SignupScreen,
    onboarding: OnboardingScreen,
    dashboard: DashboardScreen,
    "my-day": MyDayScreen,
    home: HomeScreen,
    chakras: ChakrasScreen,
    "energy-cycle": EnergyCycleScreen,
    "chakra-detail": ChakraDetailScreen,
    "legacy-history": LegacyHistoryScreen,
    protocol: ProtocolScreen,
    journey: JourneyScreen,
    history: HistoryScreen,
    "timeline-event": TimelineEventDetailScreen,
    profile: ProfileScreen,
    "admin-dashboard": AdminDashboardScreen,
    "admin-users": AdminUsersScreen,
    "admin-plans": AdminPlansScreen,
    "admin-settings": AdminSettingsScreen,
  };

  const publicRoutes = ["landing", "login", "signup"];
  const adminRoute = isAdminRoute(state.route);
  const shouldWaitForAuthSession = state.authLoading
    && isSupabaseMode()
    && (state.route === "login" || !publicRoutes.includes(state.route));
  const accountNeedsOnboarding = state.authenticated
    && state.account
    && !state.account.onboardingComplete;
  let selectedScreen = screens[state.route] || LandingScreen;
  let shouldRequestAdminAccess = false;
  let shouldRequestAdminSettings = false;
  let shouldRequestAdminUsers = false;
  let shouldRequestAdminPlans = false;

  if (state.authenticated && isSupabaseMode() && !state.adminAccessChecked && !state.adminLoading) {
    shouldRequestAdminAccess = true;
  }

  if (shouldWaitForAuthSession) {
    selectedScreen = AuthSessionLoadingScreen;
  } else if (!state.authenticated && !publicRoutes.includes(state.route)) {
    state.route = "login";
    selectedScreen = LoginScreen;
  } else if (accountNeedsOnboarding && !adminRoute && !["landing", "login", "signup", "onboarding"].includes(state.route)) {
    state.route = "onboarding";
    selectedScreen = OnboardingScreen;
  } else if (adminRoute) {
    if (isSupabaseMode()) {
      if (!state.adminAccessChecked) {
        selectedScreen = AdminAccessLoadingScreen;
        shouldRequestAdminAccess = true;
      } else if (!state.adminRole) {
        selectedScreen = AdminAccessDeniedScreen;
      } else {
        if (!state.adminSettingsLoaded && !state.adminSettingsLoading) {
          shouldRequestAdminSettings = true;
        }
        if ((state.route === "admin-users" || state.route === "admin-dashboard") && !state.adminUsersLoaded && !state.adminUsersLoading) {
          shouldRequestAdminUsers = true;
        }
        if ((state.route === "admin-plans" || state.route === "admin-dashboard") && !state.adminPlansLoaded && !state.adminPlansLoading) {
          shouldRequestAdminPlans = true;
        }
      }
    } else {
      if (!state.adminAccessChecked) {
        state.adminAccessChecked = true;
        state.adminRole = "owner";
      }
      if ((state.route === "admin-users" || state.route === "admin-dashboard") && !state.adminUsersLoaded) {
        shouldRequestAdminUsers = true;
      }
      if ((state.route === "admin-plans" || state.route === "admin-dashboard") && !state.adminPlansLoaded) {
        shouldRequestAdminPlans = true;
      }
    }
  }

  document.getElementById("app").innerHTML = selectedScreen();
  bindEvents();
  updateBottomNavigationOffset();

  if (shouldRequestAdminAccess) {
    requestAdminAccess();
  }
  if (shouldRequestAdminSettings) {
    requestAdminSettings();
  }
  if (shouldRequestAdminUsers) {
    requestAdminUsers();
  }
  if (shouldRequestAdminPlans) {
    requestAdminPlans();
  }
}

function updateBottomNavigationOffset() {
  if (!document.querySelector || !document.documentElement || !document.documentElement.style) {
    return;
  }

  const navigation = document.querySelector(".bottom-navigation");
  if (!navigation || !navigation.getBoundingClientRect) {
    return;
  }

  const height = Math.ceil(navigation.getBoundingClientRect().height);
  if (height > 0) {
    document.documentElement.style.setProperty("--bottom-navigation-measured-height", `${height}px`);
  }

  if (window.ResizeObserver) {
    if (window.__driveAstralBottomNavigationTarget !== navigation) {
      if (window.__driveAstralBottomNavigationObserver) {
        window.__driveAstralBottomNavigationObserver.disconnect();
      }

      window.__driveAstralBottomNavigationObserver = new window.ResizeObserver(
        updateBottomNavigationOffset,
      );
      window.__driveAstralBottomNavigationTarget = navigation;
      window.__driveAstralBottomNavigationObserver.observe(navigation);
    }
  }
}

function initConstellationAnimation() {
  if (typeof document === "undefined" || typeof document.querySelector !== "function") {
    return;
  }
  const canvas = document.querySelector(".constellation-field");
  if (!canvas || typeof canvas.getContext !== "function") {
    return;
  }

  if (window.constellationAnimId) {
    if (typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(window.constellationAnimId);
    }
    window.constellationAnimId = null;
  }

  const rect = typeof canvas.getBoundingClientRect === "function" ? canvas.getBoundingClientRect() : {};
  let width = rect.width;
  let height = rect.height;
  if (!width || !height) {
    width = Math.round((window.innerWidth || 800) * 1.16);
    height = Math.round((window.innerHeight || 600) * 1.16);
  }
  canvas.width = width;
  canvas.height = height;

  const area = canvas.width * canvas.height;
  const count = Math.min(50, Math.floor(area / 18000));
  const stars = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.5 + 0.3,
      pulseSpeed: Math.random() * 0.015 + 0.005,
      pulseDir: Math.random() > 0.5 ? 1 : -1,
    });
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const reducedMotion = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      if (!reducedMotion) {
        s.x += s.vx;
        s.y += s.vy;

        s.alpha += s.pulseSpeed * s.pulseDir;
        if (s.alpha > 0.85) {
          s.alpha = 0.85;
          s.pulseDir = -1;
        } else if (s.alpha < 0.25) {
          s.alpha = 0.25;
          s.pulseDir = 1;
        }

        const margin = 20;
        if (s.x < -margin) s.x = canvas.width + margin;
        if (s.x > canvas.width + margin) s.x = -margin;
        if (s.y < -margin) s.y = canvas.height + margin;
        if (s.y > canvas.height + margin) s.y = -margin;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 201, 104, ${s.alpha})`;
      ctx.fill();

      if (s.r > 1.6 && s.alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 201, 104, ${s.alpha * 0.15})`;
        ctx.fill();
      }
    }

    const maxDist = Math.min(130, canvas.width * 0.22);
    ctx.lineWidth = 0.65;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const s1 = stars[i];
        const s2 = stars[j];
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const ratio = 1 - dist / maxDist;
          const lineAlpha = ratio * ratio * Math.min(s1.alpha, s2.alpha) * 0.38;
          ctx.strokeStyle = `rgba(214, 165, 58, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.stroke();
        }
      }
    }

    if (!reducedMotion && typeof requestAnimationFrame === "function") {
      window.constellationAnimId = requestAnimationFrame(tick);
    }
  }

  tick();
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      setState({
        route: element.dataset.route,
        notice: "",
        authNotice: "",
        authNoticeKind: "",
        upgradeModalOpen: false,
      }, { updateUrl: true });
    });
  });

  document.querySelectorAll("[data-open-upgrade-modal]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      setState({
        upgradeModalOpen: true,
        upgradeAreaId: normalizeAreaId(element.dataset.upgradeAreaId),
        notice: "",
        noticeKind: "",
      });
    });
  });

  document.querySelectorAll("[data-close-upgrade-modal]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (element.classList.contains("upgrade-modal-backdrop") && event.target !== element) {
        return;
      }
      event.preventDefault();
      setState({ upgradeModalOpen: false, upgradeAreaId: "" });
    });
  });

  document.querySelectorAll("[data-start-area-id]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      const areaId = normalizeAreaId(element.dataset.startAreaId);
      if (!canStartConsultationForArea(areaId) && !hasPremiumAccess()) {
        setState({ upgradeModalOpen: true, upgradeAreaId: areaId });
        return;
      }
      setState({
        route: "home",
        selectedAreaId: areaId,
        areaCarouselTouched: true,
        notice: "",
        noticeKind: "",
        upgradeModalOpen: false,
      }, { updateUrl: true });
    });
  });

  document.querySelectorAll("[data-signout]").forEach((button) => {
    button.addEventListener("click", signOut);
  });

  const adminSettingsForm = document.getElementById("admin-settings-form");
  if (adminSettingsForm) {
    adminSettingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitAdminSettings(new FormData(adminSettingsForm));
    });
  }

  document.querySelectorAll("[data-admin-plan-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitAdminPlan(new FormData(form));
    });
  });

  document.querySelectorAll("[data-admin-access-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitAdminUserAccess(new FormData(form));
    });
  });

  document.querySelectorAll("[data-chakra-id]").forEach((element) => {
    element.addEventListener("click", () => {
      setState({
        route: "chakra-detail",
        selectedChakraId: normalizeChakraId(element.dataset.chakraId),
        notice: "",
      }, { updateUrl: true });
    });
  });

  document.querySelectorAll("[data-area-id]").forEach((element) => {
    element.addEventListener("click", () => {
      const onboardingBirth = document.getElementById("onboarding-birth");
      setState({
        selectedAreaId: normalizeAreaId(element.dataset.areaId),
        ...(onboardingBirth ? { birth: onboardingBirth.value } : {}),
        areaCarouselTouched: true,
        notice: "",
        noticeKind: "",
      });
    });
  });

  document.querySelectorAll("[data-history-section]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({
        historySection: button.dataset.historySection === "timeline" ? "timeline" : "readings",
        timelineNotice: "",
        timelineNoticeKind: "",
      });
    });
  });

  document.querySelectorAll("[data-add-timeline-event]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({
        historySection: "timeline",
        timelineFormOpen: true,
        timelineNotice: "",
        timelineNoticeKind: "",
      });
    });
  });

  document.querySelectorAll("[data-cancel-timeline-event]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({
        timelineFormOpen: false,
        timelineNotice: "",
        timelineNoticeKind: "",
      });
    });
  });

  document.querySelectorAll("[data-timeline-event-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const event = timelineEventById(button.dataset.timelineEventId);
      if (!event) {
        return;
      }

      setState({
        route: "timeline-event",
        historySection: "timeline",
        activeTimelineEventId: event.eventId,
        timelineFormOpen: false,
        timelineNotice: "",
        timelineNoticeKind: "",
      }, { updateUrl: true });
    });
  });

  document.querySelectorAll(".area-carousel").forEach((carousel) => {
    const markCarouselInteraction = () => {
      state.areaCarouselTouched = true;
      const selector = carousel.closest(".area-selector");
      if (selector) {
        selector.classList.add("is-touched");
      }
    };

    carousel.addEventListener("scroll", markCarouselInteraction, { once: true, passive: true });
    carousel.addEventListener("pointerdown", markCarouselInteraction, { once: true });
    carousel.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();
      carousel.scrollLeft += event.deltaY;
      markCarouselInteraction();
    }, { passive: false });
  });

  document.querySelectorAll("input[name='name'], input[name='birth']").forEach((input) => {
    input.addEventListener("input", (event) => {
      state[event.target.name] = event.target.value;
    });
  });

  document.querySelectorAll(
    "input[name='eventTitle'], input[name='eventDate'], select[name='eventCategory'], textarea[name='eventNote']",
  ).forEach((input) => {
    input.addEventListener("input", (event) => {
      const draftFields = {
        eventTitle: "title",
        eventDate: "eventDate",
        eventCategory: "category",
        eventNote: "note",
      };
      const field = draftFields[event.target.name];
      if (field) {
        state.timelineDraft = {
          ...state.timelineDraft,
          [field]: event.target.value,
        };
      }
    });
  });

  document.querySelectorAll("[data-export-backup]").forEach((button) => {
    button.addEventListener("click", downloadLocalBackup);
  });

  document.querySelectorAll("[data-import-backup]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById("backup-file-input");
      if (input) {
        input.click();
      }
    });
  });

  document.querySelectorAll("[data-backup-file]").forEach((input) => {
    input.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        await restoreLocalBackup(file);
      }
      event.target.value = "";
    });
  });

  document.querySelectorAll("[data-clear-state]").forEach((button) => {
    button.addEventListener("click", () => {
      const confirmed = typeof window.confirm !== "function"
        || window.confirm(isSupabaseMode()
          ? "Excluir definitivamente sua conta, leituras, hist&oacute;rico e progresso?"
          : "Excluir a conta local, leituras, hist&oacute;rico e progresso deste dispositivo?");
      if (!confirmed) {
        return;
      }

      if (isSupabaseMode()) {
        button.disabled = true;
        supabaseService().deleteAccount().then(() => {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(ACCOUNT_KEY);
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(PROTOCOL_PROGRESS_KEY);
          localStorage.removeItem(JOURNEY_PROGRESS_KEY);
          state = {
            ...defaultState,
            route: "landing",
            account: null,
            authenticated: false,
            name: "",
            birth: "",
            selectedAreaId: "",
            reading: null,
            history: [],
            timelineEvents: [],
            notice: "",
          };
          updateLocationForState(state, true);
          render();
        }).catch(() => {
          button.disabled = false;
          setState({
            route: "profile",
            notice: "N&atilde;o foi poss&iacute;vel excluir a conta. Tente novamente.",
            noticeKind: "error",
          });
        });
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACCOUNT_KEY);
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(PROTOCOL_PROGRESS_KEY);
      localStorage.removeItem(JOURNEY_PROGRESS_KEY);
      state = {
        ...defaultState,
        route: "landing",
        account: null,
        authenticated: false,
        name: "",
        birth: "",
        selectedAreaId: "",
        reading: null,
        history: [],
        timelineEvents: [],
        notice: "",
      };
      updateLocationForState(state, true);
      render();
    });
  });

  document.querySelectorAll("[data-add-practice]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ notice: "Pr&aacute;tica preparada para integra&ccedil;&atilde;o futura com o protocolo." });
    });
  });

  document.querySelectorAll("[data-complete-protocol]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleProtocolMoment(button.dataset.completeProtocol);
    });
  });

  document.querySelectorAll("[data-journey-day]").forEach((button) => {
    button.addEventListener("click", () => {
      const progress = ensureJourneyProgress();
      const currentDay = currentJourneyDay(progress);
      const journeyDay = normalizeJourneyDayNumber(button.dataset.journeyDay);
      if (!canAccessJourneyDay(journeyDay, currentDay)) {
        return;
      }
      setState({ journeySelectedDay: journeyDay });
    });
  });

  document.querySelectorAll("[data-complete-journey-day]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleJourneyDay(button.dataset.completeJourneyDay);
    });
  });

  document.querySelectorAll("[data-history-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = historyEntryById(button.dataset.historyId);
      if (!entry) {
        return;
      }

      if (entry.readingSnapshot) {
        setState({
          route: "chakras",
          activeHistoryId: entry.readingId,
          reading: readingForHistoryEntry(entry),
          selectedAreaId: normalizeAreaId(
            entry.inputSnapshot && entry.inputSnapshot.selectedAreaId
              ? entry.inputSnapshot.selectedAreaId
              : entry.areaId,
          ),
          notice: "",
        }, { updateUrl: true });
        return;
      }

      setState({
        route: "legacy-history",
        activeHistoryId: entry.readingId,
        notice: "",
      }, { updateUrl: true });
    });
  });

  document.querySelectorAll("[data-open-reading-details]").forEach((button) => {
    button.addEventListener("click", () => {
      const details = document.querySelector("#reading-details details");
      if (!details) return;
      details.open = true;
      if (typeof details.focus === "function") {
        details.setAttribute("tabindex", "-1");
        details.focus();
      }
    });
  });

  document.querySelectorAll("[data-retry-first-reading]").forEach((button) => {
    button.addEventListener("click", () => {
      submitOnboarding(state.birth);
    });
  });

  const form = document.getElementById("alignment-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      submitAlignment(formData.get("name"), formData.get("birth"));
    });
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(signupForm);
      submitSignup({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        termsAccepted: formData.get("terms") === "on",
      });
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      submitLogin({
        email: formData.get("email"),
        password: formData.get("password"),
      });
    });
  }

  document.querySelectorAll("[data-reset-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const emailInput = document.querySelector("#login-form input[name='email']");
      requestPasswordReset(emailInput ? emailInput.value : "");
    });
  });

  const updatePasswordForm = document.getElementById("update-password-form");
  if (updatePasswordForm) {
    updatePasswordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(updatePasswordForm);
      submitUpdatedPassword(formData.get("password"));
    });
  }

  document.querySelectorAll("[data-demo-login]").forEach((button) => {
    button.addEventListener("click", enterDemoAccess);
  });

  const onboardingForm = document.getElementById("onboarding-form");
  if (onboardingForm) {
    const birthInput = onboardingForm.querySelector("#onboarding-birth");
    const birthStatus = onboardingForm.querySelector("#onboarding-birth-help");
    const submitButton = onboardingForm.querySelector('button[type="submit"]');
    const submitGuidance = onboardingForm.querySelector(".onboarding-submit-guidance");
    if (birthInput && submitButton) {
      birthInput.addEventListener("input", () => {
        const currentBirthStatus = birthInput.value
          ? validateBirthDateForProduct(birthInput.value).status
          : "empty";
        const birthIsValid = currentBirthStatus === "valid";
        const canContinue = Boolean(birthIsValid && state.selectedAreaId);
        submitButton.disabled = !canContinue;
        if (submitGuidance) submitGuidance.hidden = canContinue;
        if (birthStatus) {
          birthStatus.classList.toggle("is-valid", birthIsValid);
          birthStatus.classList.toggle("is-invalid", currentBirthStatus !== "empty" && !birthIsValid);
          const statusText = birthStatus.querySelector("span");
          if (statusText) {
            statusText.textContent = birthIsValid
              ? "Data confirmada para o cálculo da sua base pessoal."
              : currentBirthStatus === "empty"
                ? "Informe sua data completa para continuar."
                : "Verifique a data informada.";
          }
        }
      });
    }
    onboardingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(onboardingForm);
      submitOnboarding(formData.get("birth"));
    });
  }

  const timelineForm = document.getElementById("timeline-event-form");
  if (timelineForm) {
    timelineForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(timelineForm);
      submitTimelineEvent({
        title: formData.get("eventTitle"),
        eventDate: formData.get("eventDate"),
        category: formData.get("eventCategory"),
        note: formData.get("eventNote"),
      });
    });
  }

  initConstellationAnimation();
}

if (window.addEventListener) {
  window.addEventListener("popstate", () => {
    const routeState = routeStateFromLocation();
    setState(Object.keys(routeState).length ? routeState : { route: "landing", notice: "" });
  });
  window.addEventListener("resize", updateBottomNavigationOffset);
  window.addEventListener("resize", initConstellationAnimation);
}

render();

async function initializeSupabaseSession() {
  if (!isSupabaseMode()) {
    return;
  }
  try {
    const account = await supabaseService().getAccount();
    if (!account) {
      setState({ authLoading: false });
      return;
    }
    const cloudState = await supabaseService().loadCloudState();
    const history = normalizedHistoryList(cloudState.history);
    const currentRouteState = routeStateFromLocation();
    const currentRoute = currentRouteState.route;
    const requestedEntry = currentRouteState.requestedReadingId
      ? await supabaseService().loadReadingById(currentRouteState.requestedReadingId)
      : null;
    const firstReadingEntry = (requestedEntry && requestedEntry.readingType === "first-reading" ? requestedEntry : null)
      || history.find((entry) => entry.readingType === "first-reading")
      || null;
    const returningToCompletedOnboarding = currentRoute === "onboarding" && account.onboardingComplete;
    const targetRoute = currentRouteState.requestedReadingId
      ? (requestedEntry ? "chakras" : "dashboard")
      : returningToCompletedOnboarding
        ? (firstReadingEntry ? "chakras" : "dashboard")
        : ["landing", "login", "signup"].includes(currentRoute)
          ? (account.onboardingComplete ? "dashboard" : "onboarding")
          : currentRoute;
    const latestEntry = requestedEntry || (returningToCompletedOnboarding ? firstReadingEntry : null) || history[0] || null;
    const resolvedHistory = latestEntry
      ? [latestEntry, ...history.filter((entry) => entry.readingId !== latestEntry.readingId)].slice(0, 8)
      : history;
    setState({
      route: targetRoute,
      account,
      authenticated: true,
      authLoading: false,
      name: account.name || "",
      birth: account.birth || "",
      selectedAreaId: account.primaryAreaId || "",
      history: resolvedHistory,
      timelineEvents: normalizedTimelineEvents(cloudState.timelineEvents),
      reading: latestEntry ? readingForHistoryEntry(latestEntry) : state.reading,
      activeHistoryId: latestEntry ? latestEntry.readingId : state.activeHistoryId,
      requestedReadingId: latestEntry ? latestEntry.readingId : "",
      firstReadingStatus: firstReadingEntry ? "completed" : state.firstReadingStatus,
      authNotice: "",
      authNoticeKind: "",
      notice: currentRouteState.requestedReadingId && !requestedEntry
        ? "Esta leitura n&atilde;o est&aacute; dispon&iacute;vel para sua conta."
        : state.notice,
    }, { persist: true, updateUrl: true, replaceUrl: true });
    await hydrateSupabaseProgress();
  } catch {
    setState({
      route: "login",
      authenticated: false,
      authLoading: false,
      account: null,
      authNotice: "N&atilde;o foi poss&iacute;vel sincronizar sua conta agora.",
      authNoticeKind: "error",
    }, { updateUrl: true, replaceUrl: true });
  }
}

async function hydrateSupabaseProgress() {
  if (!isSupabaseMode() || !state.authenticated) {
    return;
  }
  try {
    const progress = await supabaseService().loadProgress({
      contextKey: state.reading ? journeyContextKey() : "",
      date: protocolDateKey(),
    });
    if (progress.journey) {
      localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(progress.journey));
    }
    if (progress.protocol) {
      localStorage.setItem(PROTOCOL_PROGRESS_KEY, JSON.stringify(progress.protocol));
    }
    render();
  } catch {
    // Local progress remains available when cloud synchronization is unavailable.
  }
}

initializeSupabaseSession();
