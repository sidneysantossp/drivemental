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
    platformName: "Drive Astral",
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

function environmentLabel() {
  return isSupabaseMode()
    ? "Conta sincronizada"
    : "Beta local";
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

const icons = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.8 12 3l9 7.8"/><path d="M5.2 9.6v10h5.1v-5.7h3.4v5.7h5.1v-10"/></svg>',
  protocol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8l2 2v14H6V6l2-2Z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>',
  history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.34-5.66"/><path d="M4 5v5h5"/><path d="M12 8v4l3 2"/></svg>',
  profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',
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

function routeStateFromLocation() {
  if (!window.location || !window.location.pathname) {
    return {};
  }

  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
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
    "/app/consulta": "home",
    "/app/protocolo": "protocol",
    "/app/jornada": "journey",
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
    home: "/app/consulta",
    chakras: "/app/consulta/resultado",
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
  onboardingStep: 1,
  authNotice: "",
  authNoticeKind: "",
  name: "",
  birth: "",
  selectedAreaId: "",
  selectedChakraId: "root",
  activeHistoryId: "",
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

function shortHistorySummary(text) {
  const clean = decodeStoredText(text).replace(/\s+/g, " ").trim();
  if (clean.length <= 124) {
    return clean;
  }

  return `${clean.slice(0, 121).trim()}...`;
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
      symbolic: "Esta dist&acirc;ncia &eacute; atualmente exibida apenas como uma rela&ccedil;&atilde;o matem&aacute;tica. O Drive Astral ainda n&atilde;o atribui um significado simb&oacute;lico validado a esse intervalo.",
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

function createReadingHistoryEntry({ name, birth, area, reading }) {
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
    readingId: createReadingId(),
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
      <p>${escapeHtml(interpretation.applicationSummary || interpretation.synthesis)}</p>
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

function ChakraCycleCard() {
  return GoldenCard(`
    <details class="coordinate-details chakra-cycle-details">
      <summary>
        <span class="coordinate-step">7</span>
        <span class="coordinate-summary-copy">
          <strong>Ciclo dos Plasmas e Chakras</strong>
          <small>Sequ&ecirc;ncia simb&oacute;lica do ciclo natural</small>
        </span>
        <span class="coordinate-summary-toggle" aria-hidden="true">${icon("arrow")}</span>
      </summary>
      <div class="coordinate-details-content chakra-cycle-content">
        <p class="chakra-cycle-note">Esta se&ccedil;&atilde;o mostra a sequ&ecirc;ncia simb&oacute;lica dos plasmas e chakras no ciclo natural do Sincron&aacute;rio. N&atilde;o representa diagn&oacute;stico individual dos seus chakras.</p>
        <div class="chakra-layout">
          ${ChakraBodyMap()}
          <div class="chakra-list">
            ${chakras.map(ChakraCard).join("")}
          </div>
        </div>
      </div>
    </details>
  `, "coordinate-card chakra-cycle-card");
}

function ReadingDetailsSection(reading, guidance) {
  return `
    <section class="reading-details-section">
      <details class="reading-details-disclosure">
        <summary>
          <span class="reading-details-icon">${icon("info")}</span>
          <span class="reading-details-summary">
            <strong>Entenda sua leitura</strong>
            <small>Veja Kins, coordenadas e o ciclo dos chakras.</small>
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
          ${ChakraCycleCard()}
        </div>
      </details>
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
      <button class="public-brand" data-route="landing" type="button" aria-label="Drive Astral - in&iacute;cio">
        ${BrandMark(true)}
        <span>Drive Astral</span>
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
        <button class="button-primary" data-route="signup" type="button">Consulta gr&aacute;tis</button>
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

function LandingScreen() {
  const productFoundations = [
    ["compass", "Mapa pessoal", "Veja seu Kin, suas coordenadas de nascimento e a rela&ccedil;&atilde;o simb&oacute;lica com o dia atual."],
    ["lotus", "Mapa energ&eacute;tico visual", "Explore os sete chakras como temas de reflex&atilde;o, sem diagn&oacute;sticos ou estados inventados."],
    ["target", "Aplica&ccedil;&atilde;o no cotidiano", "Converta a leitura em uma pergunta para observar e uma pr&aacute;tica simples para experimentar."],
  ];
  const deliverables = [
    ["compass", "GPS do Sincron&aacute;rio", "Nascimento, Kin do dia e sincroniza&ccedil;&atilde;o reunidos em uma leitura estruturada.", "Dispon&iacute;vel"],
    ["lotus", "Mapa dos 7 Chakras", "Uma navega&ccedil;&atilde;o visual por temas, sinais de observa&ccedil;&atilde;o e pr&aacute;ticas gerais.", "Dispon&iacute;vel"],
    ["protocol", "Protocolo Di&aacute;rio", "Uma rotina geral organizada em manh&atilde;, dia e noite para apoiar presen&ccedil;a e foco.", "Dispon&iacute;vel"],
    ["chart", "Linha do Tempo C&oacute;smica", "Registre acontecimentos e compare coordenadas preservadas de cada momento.", "Dispon&iacute;vel"],
    ["history", "Hist&oacute;rico Pessoal", "Volte a leituras e snapshots sem recalcular ou alterar o registro original.", "Dispon&iacute;vel"],
    ["home", "Painel da Jornada", "Acesse consultas, registros, protocolo e perfil em uma &aacute;rea pessoal organizada.", "Dispon&iacute;vel"],
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
    ["O Drive Astral faz previs&otilde;es sobre o futuro?", "N&atilde;o. A plataforma oferece leituras simb&oacute;licas e reflexivas para observar ciclos, rela&ccedil;&otilde;es e possibilidades de a&ccedil;&atilde;o. Ela n&atilde;o promete acontecimentos futuros."],
    ["Preciso entender de chakras ou do Sincron&aacute;rio das 13 Luas?", "N&atilde;o. A experi&ecirc;ncia apresenta as coordenadas em linguagem explicada, com contexto e transpar&ecirc;ncia sobre a origem de cada informa&ccedil;&atilde;o."],
    ["O mapa &eacute; um diagn&oacute;stico energ&eacute;tico individual?", "N&atilde;o. O mapa dos chakras &eacute; uma navega&ccedil;&atilde;o simb&oacute;lica para reflex&atilde;o. A vers&atilde;o atual n&atilde;o calcula bloqueio, estado, hiperatividade ou prioridade individual dos chakras."],
    ["O Drive Astral substitui terapia ou aconselhamento profissional?", "N&atilde;o. O conte&uacute;do n&atilde;o substitui acompanhamento m&eacute;dico, psicol&oacute;gico, jur&iacute;dico, financeiro ou qualquer orienta&ccedil;&atilde;o profissional especializada."],
    ["Quais dados preciso informar?", "Para preparar o mapa inicial, a plataforma utiliza seu nome, data de nascimento e a &aacute;rea em que deseja contextualizar a leitura. A p&aacute;gina de privacidade explica como esses dados s&atilde;o armazenados nesta fase."],
    ["Posso come&ccedil;ar gratuitamente?", "Sim. Voc&ecirc; poder&aacute; fazer uma consulta inicial gratuita para conhecer seu mapa e entender como a plataforma organiza a leitura."],
    ["Qual &eacute; a diferen&ccedil;a entre a assinatura e o acompanhamento premium?", "A assinatura mensal amplia o acesso a consultas em outras &aacute;reas da vida, hist&oacute;rico e recursos recorrentes. O acompanhamento premium acrescenta uma jornada guiada de 90 dias, renov&aacute;vel at&eacute; 180, com metas, check-ins, di&aacute;rio de dificuldades, a&ccedil;&otilde;es adaptadas e painel de evolu&ccedil;&atilde;o."],
    ["Como o acompanhamento se adapta ao meu momento?", "A jornada parte dos resultados das suas consultas e dos check-ins registrados por voc&ecirc;. Dificuldades, percep&ccedil;&otilde;es e avan&ccedil;os alimentam a organiza&ccedil;&atilde;o das pr&oacute;ximas a&ccedil;&otilde;es e alertas do plano."],
    ["O acompanhamento premium substitui um profissional?", "N&atilde;o. Mesmo no plano guiado, o Drive Astral continua sendo uma ferramenta de autoconhecimento e organiza&ccedil;&atilde;o pessoal. Ele n&atilde;o substitui acompanhamento m&eacute;dico, psicol&oacute;gico, financeiro ou profissional especializado."],
  ];

  return `
    <div class="public-site">
      ${PublicHeader()}
      <main>
        <section class="sales-hero">
          <div class="sales-hero-copy">
            <span class="eyebrow">Mapa pessoal &middot; Ciclos &middot; Pr&aacute;tica di&aacute;ria</span>
            <h1>Seu mapa pessoal para entender ciclos, <em>energia e dire&ccedil;&atilde;o.</em></h1>
            <p>Comece com uma consulta gratuita e transforme sua data de nascimento em uma jornada organizada de autoconhecimento. Nos planos avan&ccedil;ados, acompanhe outras &aacute;reas da vida e siga um plano guiado de evolu&ccedil;&atilde;o.</p>
            <div class="hero-actions">
              <button class="button-primary button-large" data-route="signup" type="button">Fazer consulta gr&aacute;tis ${icon("arrow")}</button>
              <a class="button-ghost button-large" href="#exemplo">Ver exemplo do mapa</a>
            </div>
            <div class="hero-trust">
              <span>${icon("check")} Sem previs&otilde;es absolutas</span>
              <span>${icon("check")} Dados sob seu controle</span>
              <span>${icon("check")} Experi&ecirc;ncia simb&oacute;lica e reflexiva</span>
            </div>
          </div>
          <div class="platform-preview" aria-label="Pr&eacute;via do dashboard Drive Astral">
            <div class="preview-window">
              <div class="preview-sidebar">
                ${BrandMark(true)}
                <i></i><i></i><i></i><i></i>
              </div>
              <div class="preview-content">
                <div class="preview-topline"><span></span><b></b></div>
                <div class="preview-welcome">
                  <small>SEU MAPA DE HOJE</small>
                  <strong>Uma dire&ccedil;&atilde;o pr&aacute;tica para o seu momento</strong>
                  <span></span>
                </div>
                <div class="preview-grid">
                  <article class="preview-kin"><small>KIN DO DIA</small><strong>178</strong><span>Branco Solar Espelho</span></article>
                  <article><small>CHAKRA DO PLASMA</small><strong>Raiz</strong><span>Base e presen&ccedil;a</span></article>
                  <article><small>PR&Aacute;TICA</small><strong>Clareza</strong><span>Uma a&ccedil;&atilde;o essencial</span></article>
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
            <span class="eyebrow">O que &eacute; o Drive Astral?</span>
            <h2>Uma plataforma para transformar s&iacute;mbolos em pr&aacute;tica di&aacute;ria.</h2>
            <p>Em vez de entregar dados soltos, o Drive Astral organiza informa&ccedil;&otilde;es do Sincron&aacute;rio das 13 Luas, ciclos e chakras em uma leitura com contexto, explica&ccedil;&atilde;o e aplica&ccedil;&atilde;o para o cotidiano.</p>
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
            <h2>Da sua data de nascimento a uma jornada que voc&ecirc; consegue acompanhar.</h2>
            <p>O fluxo foi desenhado para explicar o resultado e manter um registro do que voc&ecirc; consultou.</p>
          </div>
          <div class="process-grid process-grid-four">
            <article><span>01</span>${icon("user")}<h3>Informe sua data</h3><p>Crie seu perfil com os dados b&aacute;sicos usados no c&aacute;lculo inicial.</p></article>
            <article><span>02</span>${icon("compass")}<h3>Receba seu mapa</h3><p>Veja Kin, ciclos, coordenadas e a sincroniza&ccedil;&atilde;o com o dia.</p></article>
            <article><span>03</span>${icon("target")}<h3>Aplique a leitura</h3><p>Escolha uma &aacute;rea e receba uma pergunta e uma pr&aacute;tica contextualizadas.</p></article>
            <article><span>04</span>${icon("history")}<h3>Acompanhe a jornada</h3><p>Volte aos snapshots e registre acontecimentos na sua linha do tempo.</p></article>
          </div>
        </section>

        <section id="o-que-recebe" class="sales-section deliverables-section">
          <div class="section-heading is-centered">
            <span class="eyebrow">O que voc&ecirc; recebe</span>
            <h2>Recursos conectados para acompanhar seu ciclo com clareza.</h2>
            <p>As informa&ccedil;&otilde;es deixam de ser uma consulta isolada e passam a fazer parte da sua &aacute;rea pessoal.</p>
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
            <div><strong>Seu primeiro mapa pode come&ccedil;ar agora.</strong><span>Crie o perfil e conhe&ccedil;a a experi&ecirc;ncia dispon&iacute;vel nesta fase.</span></div>
            <button class="button-primary" data-route="signup" type="button">Criar meu mapa gr&aacute;tis ${icon("arrow")}</button>
          </div>
        </section>

        <section id="exemplo" class="sales-section product-showcase-section">
          <div class="section-heading">
            <span class="eyebrow">Exemplo real da plataforma</span>
            <h2>Veja como a leitura ganha forma.</h2>
            <p>O resultado &eacute; organizado em telas e cards que mostram o que foi calculado, o que &eacute; interpreta&ccedil;&atilde;o e como levar a leitura para a rotina.</p>
          </div>
          <div class="showcase-dashboard">
            <div class="showcase-copy">
              <span>01 &middot; PAINEL PESSOAL</span>
              <h3>Uma vis&atilde;o central da sua jornada.</h3>
              <p>O dashboard re&uacute;ne acesso &agrave; consulta, leituras salvas, marcos da linha do tempo e protocolo di&aacute;rio.</p>
              <ul>
                <li>${icon("check")} Navega&ccedil;&atilde;o clara por recurso</li>
                <li>${icon("check")} Hist&oacute;rico e registros no mesmo lugar</li>
                <li>${icon("check")} Acesso responsivo em desktop e celular</li>
              </ul>
            </div>
            <figure class="showcase-screen">
              <img src="/assets/landing/dashboard-drive-astral.png" alt="Dashboard do Drive Astral com consulta, hist&oacute;rico e linha do tempo" loading="lazy" />
            </figure>
          </div>
          <div class="showcase-detail-grid">
            <article class="reading-showcase">
              <div>
                <span>02 &middot; LEITURA ESTRUTURADA</span>
                <h3>Coordenadas explicadas em etapas.</h3>
                <p>Resumo, aplica&ccedil;&atilde;o na &aacute;rea escolhida, nascimento, dia, sincroniza&ccedil;&atilde;o e metodologia.</p>
              </div>
              <figure><img src="/assets/landing/leitura-drive-astral.png" alt="Exemplo de uma leitura do GPS do Sincron&aacute;rio no celular" loading="lazy" /></figure>
            </article>
            <article class="protocol-showcase">
              <div>
                <span>03 &middot; PROTOCOLO DI&Aacute;RIO</span>
                <h3>Uma rotina geral em tr&ecirc;s momentos.</h3>
                <p>Pr&aacute;ticas simples de observa&ccedil;&atilde;o e organiza&ccedil;&atilde;o para manh&atilde;, dia e noite.</p>
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
              <h3>Um plano de 90 dias que aprende com a sua jornada.</h3>
              <p>Os resultados das consultas definem o ponto de partida. Seus check-ins, dificuldades e relatos ajudam a organizar novas a&ccedil;&otilde;es pr&aacute;ticas, prioridades e alertas ao longo do acompanhamento.</p>
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
            <div><span class="eyebrow">Explore com seus pr&oacute;prios dados</span><h3>Crie uma conta e veja seu mapa pessoal.</h3></div>
            <button class="button-primary button-large" data-route="signup" type="button">Fazer consulta gr&aacute;tis ${icon("arrow")}</button>
          </div>
        </section>

        <section id="recursos" class="sales-section benefits-section">
          <div class="section-heading is-centered">
            <span class="eyebrow">Benef&iacute;cios pr&aacute;ticos</span>
            <h2>Mais clareza para decidir. Mais presen&ccedil;a para agir.</h2>
            <p>O valor est&aacute; em organizar percep&ccedil;&otilde;es e transformar uma leitura simb&oacute;lica em observa&ccedil;&atilde;o consciente.</p>
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
            <h2>Espiritualidade com clareza, responsabilidade e limites.</h2>
            <p>O Drive Astral &eacute; uma ferramenta simb&oacute;lica de autoconhecimento. O objetivo &eacute; apoiar reflex&atilde;o, organiza&ccedil;&atilde;o pessoal e tomada de consci&ecirc;ncia, sem substituir orienta&ccedil;&atilde;o profissional.</p>
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
            <p>O Drive Astral acompanha diferentes profundidades de uso, da primeira consulta ao plano guiado de evolu&ccedil;&atilde;o.</p>
          </div>
          <div class="plans-grid">
            <article class="plan-card">
              <span class="plan-label">Entrada</span>
              <h3>Consulta Gratuita</h3>
              <p>Conhe&ccedil;a seu mapa inicial e experimente a metodologia antes de escolher um plano.</p>
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
              <h3>Drive Astral</h3>
              <p>Amplie as consultas e acompanhe diferentes &aacute;reas da sua vida dentro da plataforma.</p>
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
              <p>Transforme os resultados das consultas em um plano acompanhado de 90 dias, com extens&atilde;o at&eacute; 180.</p>
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
          <p>Entre no Drive Astral e comece a organizar seus ciclos, escolhas e aprendizados em uma jornada pessoal de autoconhecimento.</p>
          <div class="final-cta-actions">
            <button class="button-primary button-large" data-route="signup" type="button">Fazer consulta gr&aacute;tis ${icon("arrow")}</button>
            <a class="button-ghost button-large" href="#premium">Comparar planos</a>
          </div>
          <small>Sem dados de pagamento &middot; Sem previs&otilde;es absolutas &middot; Uso consciente</small>
        </section>
      </main>
      <footer class="public-footer">
        <div class="footer-grid">
          <div class="footer-brand-column">
            <div class="public-brand">${BrandMark(true)}<span>Drive Astral</span></div>
            <p>Uma plataforma de autoconhecimento simb&oacute;lico para organizar ciclos, pr&aacute;ticas e percep&ccedil;&otilde;es pessoais.</p>
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
          <span>&copy; 2026 Drive Astral. Todos os direitos reservados.</span>
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
        <span>Drive Astral</span>
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
    ? `<p class="auth-notice ${state.authNoticeKind === "error" ? "is-error" : ""}" role="alert">${state.authNotice}</p>`
    : "";
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
  return `
    <div class="onboarding-area-grid" role="radiogroup" aria-label="&Aacute;rea principal de interesse">
      ${consultationAreas.map((area) => `
        <button
          class="${state.selectedAreaId === area.id ? "is-selected" : ""}"
          data-area-id="${area.id}"
          role="radio"
          aria-checked="${state.selectedAreaId === area.id ? "true" : "false"}"
          type="button"
        >
          ${icon(area.icon)}
          <span><strong>${area.shortTitle || area.title}</strong><small>${area.description}</small></span>
          ${icon("check")}
        </button>
      `).join("")}
    </div>
  `;
}

function OnboardingScreen() {
  const accountName = state.account && state.account.name ? escapeHtml(state.account.name) : "sua jornada";
  return `
    <div class="onboarding-page">
      <header class="onboarding-header">
        <div class="public-brand">${BrandMark(true)}<span>Drive Astral</span></div>
        <div class="onboarding-progress"><span style="width: 66%"></span></div>
        <small>Configura&ccedil;&atilde;o do perfil</small>
      </header>
      <main class="onboarding-main">
        <section class="onboarding-copy">
          <span class="eyebrow">Ol&aacute;, ${accountName}</span>
          <h1>Vamos personalizar sua experi&ecirc;ncia.</h1>
          <p>Essas informa&ccedil;&otilde;es preparam o dashboard. A primeira leitura s&oacute; ser&aacute; criada quando voc&ecirc; solicitar.</p>
        </section>
        <form id="onboarding-form" class="onboarding-card">
          <div class="onboarding-field">
            <label for="onboarding-birth">Data de nascimento</label>
            <p>Usada para calcular seu Kin pessoal e suas coordenadas de origem.</p>
            <input id="onboarding-birth" name="birth" type="date" value="${escapeHtml(state.birth)}" required />
          </div>
          <div class="onboarding-field">
            <label>Qual &aacute;rea voc&ecirc; deseja acompanhar primeiro?</label>
            <p>Voc&ecirc; poder&aacute; consultar todas as &aacute;reas depois.</p>
            ${OnboardingAreaSelector()}
          </div>
          ${AuthNotice()}
          <button class="button-primary button-large" type="submit" ${state.selectedAreaId ? "" : "disabled"}>Concluir e acessar dashboard ${icon("arrow")}</button>
        </form>
      </main>
    </div>
  `;
}

function PortalSidebar() {
  const accountName = state.account && state.account.name ? state.account.name : state.name || "Minha conta";
  const activeRoute = ["chakras", "chakra-detail"].includes(state.route) ? "home" : state.route;
  const items = [
    ["dashboard", "home", "Hoje"],
    ["home", "compass", "Nova consulta"],
    ["journey", "calendar", "Jornada de 30 dias"],
    ["protocol", "protocol", "Protocolo di&aacute;rio"],
    ["profile", "user", "Meu perfil"],
  ];

  return `
    <aside class="portal-sidebar">
      <button class="portal-brand" data-route="dashboard" type="button">${BrandMark(true)}<span>Drive Astral</span></button>
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
    dashboard: ["Hoje", "Sua dire&ccedil;&atilde;o e seu pr&oacute;ximo passo"],
    home: ["Nova consulta", "Escolha uma &aacute;rea e gere suas coordenadas"],
    chakras: ["Resultado da consulta", "Seu mapa completo foi calculado"],
    history: ["Hist&oacute;rico", "Leituras e marcos preservados"],
    protocol: ["Protocolo di&aacute;rio", "Pr&aacute;ticas para trazer a leitura ao cotidiano"],
    journey: ["Jornada de 30 dias", "Frases e a&ccedil;&otilde;es para acompanhar seu ciclo"],
    profile: ["Meu perfil", "Dados, prefer&ecirc;ncias e configura&ccedil;&otilde;es"],
  };
  const [title, subtitle] = titles[state.route] || ["Drive Astral", "Sua plataforma de ciclos pessoais"];

  return `
    <header class="portal-topbar">
      <div><h1>${title}</h1><p>${subtitle}</p></div>
      <div class="topbar-actions">
        <span class="premium-pill">${icon("spark")} ${environmentLabel()}</span>
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
      <canvas class="constellation-field"></canvas>
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
      display_name: "Drive Astral",
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
        <small>Drive Astral, Mentor e varia&ccedil;&otilde;es comerciais.</small>
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
  const rows = users.map((user) => {
    const access = adminAccessForUser(user.user_id);
    return `
      <tr>
        <td><strong>${escapeHtml(adminUserDisplayName(user))}</strong><small>${escapeHtml(user.email || "")}</small></td>
        <td>${escapeHtml(user.primary_area_id || "Sem area")}</td>
        <td><span class="admin-status-pill">${escapeHtml(access ? access.plan_id : "sem plano")}</span></td>
        <td>${escapeHtml(access ? access.status : "pendente")}</td>
        <td>${escapeHtml(user.created_at ? formatDatePtBr(user.created_at.slice(0, 10)) : "-")}</td>
      </tr>
    `;
  }).join("");

  return AdminShell(`
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
            <thead><tr><th>Usu&aacute;rio</th><th>&Aacute;rea</th><th>Plano</th><th>Status</th><th>Cadastro</th></tr></thead>
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
        <div class="admin-plan-heading">
          <span class="admin-status-pill">${escapeHtml(plan.badge || plan.plan_id)}</span>
          <span>${plan.is_visible === false ? "Oculto" : "Vis&iacute;vel"}</span>
        </div>
        <h2>${escapeHtml(plan.display_name || plan.plan_id)}</h2>
        <strong class="admin-plan-price">R$ ${escapeHtml(plan.price_label || "0,00")}</strong>
        <p>${escapeHtml(plan.description || "Sem descri&ccedil;&atilde;o publicada.")}</p>
        <ul>
          ${(Array.isArray(plan.features) ? plan.features : []).slice(0, 4).map((feature) => `<li>${icon("check")}<span>${escapeHtml(feature)}</span></li>`).join("")}
        </ul>
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
      ${state.adminNotice ? `<p class="form-notice ${state.adminNoticeKind === "error" ? "is-error" : ""}" role="status">${state.adminNotice}</p>` : ""}
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
      <h1>DRIVE ASTRAL</h1>
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
        <p>Algumas fontes atribuem um Kin ao dia 29/02, enquanto a refer&ecirc;ncia metodol&oacute;gica utilizada pelo Drive Astral trata essa data como 0.0 Hunab Ku, exigindo uma decis&atilde;o espec&iacute;fica.</p>
        <p>Para evitar uma leitura incorreta, esta vers&atilde;o ainda n&atilde;o gera automaticamente leituras para nascidos em 29/02.</p>
        <small>Voc&ecirc; poder&aacute; continuar quando a regra metodol&oacute;gica de 29/02 for definida no Drive Astral.</small>
      </section>
    `;
  }

  return `<p class="form-notice" role="alert">${state.notice}</p>`;
}

function ConsultationAreaSelector() {
  const isMissing = state.areaCarouselTouched && !state.selectedAreaId;
  const selectedIndex = consultationAreas.findIndex((area) => area.id === state.selectedAreaId);

  return `
    <div class="theme-selector area-selector ${isMissing ? "is-alert" : ""} ${state.areaCarouselTouched ? "is-touched" : ""}">
      <div class="area-selector-heading">
        <span class="selector-label">Onde voc&ecirc; deseja aplicar sua leitura de hoje?</span>
        <small>A escolha contextualiza a pr&aacute;tica, sem alterar os c&aacute;lculos</small>
      </div>
      <div class="area-carousel" role="radiogroup" aria-label="&Aacute;rea de aplica&ccedil;&atilde;o da leitura">
        ${consultationAreas
          .map(
            (area, index) => `
              <button
                class="theme-option area-option ${state.selectedAreaId === area.id ? "is-selected" : ""}"
                data-area-id="${area.id}"
                role="radio"
                aria-checked="${state.selectedAreaId === area.id ? "true" : "false"}"
                aria-label="${escapeHtml(area.title)}"
                type="button"
              >
                <span class="area-option-icon">${icon(area.icon)}</span>
                <span class="area-option-copy">
                  <strong>${area.shortTitle || area.title}</strong>
                  <small>${area.description}</small>
                </span>
                <span class="area-option-check" aria-hidden="true">${icon("check")}</span>
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="area-carousel-footer">
        <span class="area-carousel-hint">Deslize para ver mais &aacute;reas</span>
        <span class="area-carousel-dots" aria-hidden="true">
          ${consultationAreas
            .map((area, index) => `<span class="${index === selectedIndex ? "is-active" : ""}"></span>`)
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
    { route: "dashboard", label: "In&iacute;cio", iconName: "home" },
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

function DashboardScreen() {
  const name = (state.account && state.account.name) || state.name || "viajante";
  const history = normalizedHistoryList(state.history);
  const kin = personalKin(state.reading);
  const guidance = readingGuidance(state.reading);
  const interpretation = guidance && guidance.interpretation;
  const areaId = interpretation ? interpretation.areaId : "general";
  const direction = essentialDirectionCopy[areaId] || essentialDirectionCopy.general;
  const suggestedAction = interpretation && (interpretation.dailyPractice || interpretation.suggestedPractice);
  const journeyProgress = kin ? loadJourneyProgress() : null;
  const journeyDay = journeyProgress ? currentJourneyDay(journeyProgress) : 1;
  const journeyCompleted = journeyProgress ? journeyProgress.completedDays.length : 0;
  const journeyPercent = Math.round((journeyCompleted / 30) * 100);
  const journeyToday = journeyProgress ? journeyPlan()[journeyDay - 1] : null;
  const todayMantra = journeyToday ? decodeStoredText(journeyToday.mantra) : decodeStoredText(direction.mantra);
  const todayAction = journeyToday
    ? decodeStoredText(journeyToday.action)
    : decodeStoredText(suggestedAction || "Escolha uma a&ccedil;&atilde;o simples e conclua antes de iniciar outra.");
  const moments = protocolMoments();
  const currentMoment = moments.find((moment) => moment.id === currentProtocolMomentId()) || moments[0];
  const protocolProgress = loadProtocolProgress();
  const protocolCompleted = moments.filter((moment) => protocolProgress.completed.includes(moment.id)).length;

  return PlatformShell(`
    ${kin ? `
      <section class="dashboard-today-card">
        <div class="dashboard-today-heading">
          <div>
            <span class="eyebrow">OL&Aacute;, ${escapeHtml(name).toUpperCase()} &middot; SUA DIRE&Ccedil;&Atilde;O DE HOJE</span>
            <h2>${direction.headline}</h2>
            <p>${direction.direction}</p>
          </div>
          <span class="dashboard-today-symbol">${icon("compass")}</span>
        </div>
        <div class="dashboard-today-guidance">
          <article>
            <span>${icon("spark")} Frase do dia</span>
            <strong>&ldquo;${escapeHtml(todayMantra)}&rdquo;</strong>
          </article>
          <article>
            <span>${icon("target")} A&ccedil;&atilde;o do dia</span>
            <strong>${escapeHtml(todayAction)}</strong>
          </article>
        </div>
        <div class="dashboard-today-actions">
          <button class="button-primary" data-route="journey" type="button">${icon("calendar")} ${journeyProgress ? "Abrir meu dia" : "Iniciar jornada de 30 dias"}</button>
          <button class="button-ghost" data-route="chakras" type="button">Ver minha leitura ${icon("arrow")}</button>
        </div>
      </section>

      <section class="dashboard-continuity-grid">
        <article class="dashboard-progress-card">
          <span class="dashboard-progress-icon">${icon("calendar")}</span>
          <div class="dashboard-progress-copy">
            <span>JORNADA DE 30 DIAS</span>
            <strong>${journeyProgress ? `Dia ${journeyDay} de 30` : "Pronta para come&ccedil;ar"}</strong>
            <p>${journeyProgress ? `${journeyCompleted} dias conclu&iacute;dos. Continue no seu ritmo.` : "Uma frase e uma a&ccedil;&atilde;o simples por dia."}</p>
            <div class="dashboard-progress-track"><span style="width: ${journeyPercent}%"></span></div>
          </div>
          <button data-route="journey" type="button" aria-label="Abrir jornada">${icon("arrow")}</button>
        </article>

        <article class="dashboard-progress-card is-protocol">
          <span class="dashboard-progress-icon">${icon(currentMoment.iconName)}</span>
          <div class="dashboard-progress-copy">
            <span>PR&Aacute;TICA DE AGORA &middot; ${currentMoment.time}</span>
            <strong>${currentMoment.title}</strong>
            <p>${protocolCompleted} de 3 momentos conclu&iacute;dos hoje.</p>
          </div>
          <button data-route="protocol" type="button" aria-label="Abrir protocolo">${icon("arrow")}</button>
        </article>
      </section>
    ` : `
      <section class="dashboard-start-card">
        <span class="dashboard-start-symbol">${icon("spark")}</span>
        <div>
          <span class="eyebrow">OL&Aacute;, ${escapeHtml(name).toUpperCase()}</span>
          <h2>Comece com uma &uacute;nica pergunta.</h2>
          <p>Escolha a &aacute;rea da vida que pede clareza. Sua primeira leitura entregar&aacute; uma dire&ccedil;&atilde;o, uma frase e uma a&ccedil;&atilde;o para hoje.</p>
          <button class="button-primary" data-route="home" type="button">${icon("compass")} Fazer primeira consulta</button>
        </div>
      </section>
    `}

    <section class="dashboard-secondary-actions" aria-label="Outros acessos">
      <button data-route="home" type="button">
        <span>${icon("compass")}</span>
        <div><strong>Nova consulta</strong><small>Escolha outra &aacute;rea de vida</small></div>
        ${icon("arrow")}
      </button>
      <button data-route="history" type="button">
        <span>${icon("history")}</span>
        <div><strong>Hist&oacute;rico</strong><small>${history.length ? `${history.length} leitura${history.length === 1 ? "" : "s"} salva${history.length === 1 ? "" : "s"}` : "Suas leituras e registros"}</small></div>
        ${icon("arrow")}
      </button>
    </section>

    <section class="dashboard-disclaimer">
      ${icon("info")}
      <p>O Drive Astral oferece uma linguagem simb&oacute;lica para autoconhecimento. As leituras n&atilde;o s&atilde;o previs&otilde;es nem diagn&oacute;sticos.</p>
    </section>
  `);
}

function HomeScreen() {
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
        ${PrimaryEnergyButton("Calcular minhas coordenadas", `type="submit" ${state.selectedAreaId ? "" : "disabled"}`)}
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
        <div class="head"></div>
        <div class="torso"></div>
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

function ChakraSection({ title, content, className = "" }) {
  return `
    <section class="chakra-detail-card ${className}">
      <h2>${title}</h2>
      ${content}
    </section>
  `;
}

function ChakraChips(items) {
  return `
    <div class="chakra-chip-list">
      ${items.map((item) => `<span>${item}</span>`).join("")}
    </div>
  `;
}

function ChakraBulletList(items) {
  return `
    <ul class="chakra-detail-list">
      ${items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

function ChakraDetailScreen() {
  const chakra = selectedChakra();
  const area = selectedConsultationArea();
  const areaId = area ? area.id : "general";
  const areaTitle = area ? area.title : "Vis&atilde;o Geral";
  const interpretation = (areaChakraInterpretations[areaId] && areaChakraInterpretations[areaId][chakra.id])
    || areaChakraInterpretations.general[chakra.id];
  const orderedChakras = [...chakras].sort((a, b) => a.number - b.number);
  const currentIndex = orderedChakras.findIndex((item) => item.id === chakra.id);
  const previousChakra = orderedChakras[(currentIndex - 1 + orderedChakras.length) % orderedChakras.length];
  const nextChakra = orderedChakras[(currentIndex + 1) % orderedChakras.length];

  return PlatformShell(`
    ${AppHeader(`Chakra ${chakra.name}`, `${chakra.traditional} &bull; Chakra ${chakra.number}`, { back: true, backRoute: "chakras" })}
    <section class="chakra-detail-stack" style="--chakra:${chakra.color}">
      <section class="chakra-detail-hero">
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

      ${ChakraSection({
        title: "O que este chakra representa",
        content: `<p>${chakra.essence}</p>`,
      })}

      ${ChakraSection({
        title: "&Aacute;reas da vida relacionadas",
        content: ChakraChips(chakra.lifeAreas),
      })}

      ${ChakraSection({
        title: "Quando esta energia est&aacute; bem direcionada",
        content: ChakraBulletList(chakra.balancedExpressions),
      })}

      ${ChakraSection({
        title: "Sinais para observar em sua rotina",
        content: `
          ${ChakraBulletList(chakra.observationSignals)}
          <p class="chakra-reflection-note">Esses sinais s&atilde;o convites &agrave; reflex&atilde;o e n&atilde;o constituem diagn&oacute;stico.</p>
        `,
      })}

      ${ChakraSection({
        title: `Como o Chakra ${chakra.name} se relaciona com ${areaTitle}`,
        content: `<p>${interpretation}</p>`,
        className: "chakra-area-card",
      })}

      ${ChakraSection({
        title: "Perguntas para reflex&atilde;o",
        content: ChakraBulletList(chakra.reflectionQuestions),
      })}

      ${ChakraSection({
        title: "Pr&aacute;ticas de alinhamento",
        content: `
          ${ChakraChips(chakra.practices)}
          <button class="secondary-energy-button" data-add-practice="${chakra.id}" type="button">${icon("check")}<span>Adicionar ao meu protocolo</span></button>
          ${state.notice ? `<p class="form-notice">${state.notice}</p>` : ""}
        `,
      })}

      <section class="chakra-detail-transparency">
        <h2>Sobre esta leitura</h2>
        <p>Esta p&aacute;gina apresenta associa&ccedil;&otilde;es simb&oacute;licas utilizadas para autoconhecimento e reflex&atilde;o. Ela n&atilde;o avalia individualmente o estado do seu chakra e n&atilde;o substitui orienta&ccedil;&atilde;o m&eacute;dica, psicol&oacute;gica ou profissional.</p>
      </section>

      <nav class="chakra-detail-nav" aria-label="Navega&ccedil;&atilde;o entre chakras">
        <button data-chakra-id="${previousChakra.id}" type="button">${icon("back")}<span>${previousChakra.name}</span></button>
        <button data-chakra-id="${nextChakra.id}" type="button"><span>${nextChakra.name}</span>${icon("arrow")}</button>
      </nav>
    </section>
  `);
}

function ChakrasScreen() {
  const guidance = readingGuidance(state.reading);
  const areaTitle = guidance && guidance.interpretation
    ? guidance.interpretation.areaTitle
    : "Leitura pessoal";

  return PlatformShell(`
    ${AppHeader("Dire&ccedil;&atilde;o de hoje", areaTitle, { back: true })}
    <section class="result-stack">
      ${EssentialDirectionCard(state.reading, guidance)}
      ${ReadingDetailsSection(state.reading, guidance)}
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

function toggleJourneyDay(dayNumber) {
  const progress = ensureJourneyProgress();
  const normalizedDay = Math.min(30, Math.max(1, Number(dayNumber) || 1));
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

function journeyPlan() {
  const guidance = readingGuidance(state.reading);
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

  return `
    <button
      class="journey-day-button ${isCompleted ? "is-completed" : ""} ${isCurrent ? "is-current" : ""} ${isSelected ? "is-selected" : ""}"
      data-journey-day="${day.number}"
      type="button"
      aria-label="Dia ${day.number}, ${journeyDisplayDate(date)}"
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
  const selectedDayNumber = state.journeySelectedDay || currentDay;
  const selectedDay = plan[selectedDayNumber - 1] || plan[0];
  const weekStart = Math.floor((selectedDay.number - 1) / 7) * 7;
  const weekDays = plan.slice(weekStart, Math.min(weekStart + 7, plan.length));
  const completionPercent = Math.round((progress.completedDays.length / 30) * 100);
  const selectedCompleted = progress.completedDays.includes(selectedDay.number);
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
          <div><span>Progresso da jornada</span><strong>${progress.completedDays.length}/30</strong></div>
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
          <p>Toque em um dia para rever ou antecipar sua frase e sua a&ccedil;&atilde;o.</p>
        </div>
        <div class="journey-week-strip">
          ${weekDays.map((day) => JourneyDayButton(day, progress, currentDay, selectedDay.number)).join("")}
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
                    ${phaseDays.map((day) => JourneyDayButton(day, progress, currentDay, selectedDay.number)).join("")}
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

function ProfileScreen() {
  const kin = personalKin(state.reading);
  const signature = personalSignature(state.reading);
  const seal = state.reading && state.reading.personal_map ? state.reading.personal_map.seal : null;
  const tone = state.reading && state.reading.personal_map ? state.reading.personal_map.tone : null;
  const earthFamily = state.reading && state.reading.personal_map ? state.reading.personal_map.earth_family : null;
  const earthFamilyName = earthFamily && earthFamily.value ? earthFamily.value : "N&atilde;o dispon&iacute;vel";
  const daily = state.reading && state.reading.daily ? state.reading.daily : null;
  const dailyKin = daily && daily.kin_of_day ? daily.kin_of_day.value : null;
  const dailySignature = daily && daily.signature ? daily.signature.value : null;
  const dailySeal = daily && daily.seal ? daily.seal : null;
  const dailyTone = daily && daily.tone ? daily.tone : null;
  const relationship = daily && daily.relationship_to_personal_kin ? daily.relationship_to_personal_kin : null;
  const relationshipLabel = relationship && relationship.label ? relationship.label : "N&atilde;o dispon&iacute;vel";
  const relationshipDistance = relationship && relationship.deltas ? relationship.deltas.kin_forward : null;
  const oracle = oracleItems(state.reading);
  const area = selectedConsultationArea();
  const focusArea = area
    ? area.title
    : state.reading && state.reading.input && state.reading.input.focus_area
      ? state.reading.input.focus_area.label
      : "N&atilde;o definida";

  return PlatformShell(`
    ${AppHeader("Perfil Energ&eacute;tico", "Prefer&ecirc;ncias e Sintonia", { back: true })}
    <section class="profile-stack">
      ${GoldenCard(`
        <div class="profile-head">
          <div class="profile-emblem">${icon("spark")}</div>
          <div>
            <h2>${escapeHtml(state.name) || "Iniciado Astral"}</h2>
            <p>${state.birth || "Data de nascimento n&atilde;o informada"}</p>
          </div>
        </div>
      `)}
      ${kin ? GoldenCard(`
        <h2 class="settings-title">Mapa Gal&aacute;ctico Inicial</h2>
        <div class="reading-grid reading-grid-expanded">
          <div><span>Kin</span><strong>${kin}</strong></div>
          <div><span>Selo</span><strong>${escapeHtml(seal.name)}</strong></div>
          <div><span>Tom</span><strong>${escapeHtml(tone.name)}</strong></div>
          <div><span>Fam&iacute;lia</span><strong>${escapeHtml(earthFamilyName)}</strong></div>
        </div>
        <p class="reading-signature">${escapeHtml(signature)}</p>
        <p class="transparency-note">Fam&iacute;lia Terrestre possui valida&ccedil;&atilde;o externa separada e n&atilde;o integra a aprova&ccedil;&atilde;o parcial dos campos b&aacute;sicos.</p>
      `) : ""}
      ${dailyKin ? GoldenCard(`
        <h2 class="settings-title">Energia do Dia</h2>
        <div class="reading-grid reading-grid-expanded">
          <div><span>Kin do dia</span><strong>${dailyKin}</strong></div>
          <div><span>Selo</span><strong>${escapeHtml(dailySeal.name)}</strong></div>
          <div><span>Tom</span><strong>${escapeHtml(dailyTone.name)}</strong></div>
          <div><span>Rela&ccedil;&atilde;o</span><strong>${escapeHtml(relationshipLabel)}</strong></div>
        </div>
        <p class="reading-signature">${escapeHtml(dailySignature)}</p>
        ${relationshipDistance !== null ? `<p class="relationship-note">Dist&acirc;ncia no ciclo: ${relationshipDistance} Kin</p>` : ""}
      `) : ""}
      ${oracle.length ? GoldenCard(`
        <h2 class="settings-title">Or&aacute;culo do Destino</h2>
        <div class="oracle-list">
          ${oracle
            .map(
              ([label, item]) => `
                <div>
                  <span>${label}</span>
                  <strong>Kin ${item.kin}</strong>
                  <small>${escapeHtml(item.signature)}</small>
                </div>
              `,
            )
            .join("")}
        </div>
        <p class="transparency-note">O Or&aacute;culo do Destino &eacute; um c&aacute;lculo avan&ccedil;ado com valida&ccedil;&atilde;o externa separada.</p>
      `) : ""}
      ${GoldenCard(`
        <h2 class="settings-title">Prefer&ecirc;ncias</h2>
        <div class="settings-list">
          <button><span>${icon("dollar")} &Aacute;rea padr&atilde;o</span><strong>${focusArea}</strong></button>
          <button><span>${icon("lotus")} Frequencia</span><strong>Diaria</strong></button>
          <button><span>${icon("spark")} Intensidade visual</span><strong>Premium</strong></button>
        </div>
      `)}
      ${GoldenCard(`
        <h2 class="settings-title">Plano e acesso</h2>
        <p class="transparency-note">Seu acesso &eacute; definido pelas credenciais recebidas por e-mail ap&oacute;s a compra externa.</p>
        ${runtimeConfig().billingMode === "external-checkout" ? `
          <p class="transparency-note">A plataforma n&atilde;o processa pagamentos nem recebe dados financeiros. O checkout abre em uma nova aba.</p>
          <div class="profile-plan-actions">
            ${CommercialPlanAction("monthly")}
            ${CommercialPlanAction("guided")}
          </div>
        ` : '<p class="transparency-note">Os planos pagos ainda n&atilde;o est&atilde;o dispon&iacute;veis nesta vers&atilde;o.</p>'}
      `)}
      ${GoldenCard(`
        <h2 class="settings-title">Dados Locais</h2>
        <p class="transparency-note">Nome, data, &aacute;rea, leitura, hist&oacute;rico e linha do tempo ficam salvos apenas neste navegador. Use o backup para trocar de dispositivo ou proteger seus registros.</p>
        ${state.notice ? `<p class="form-notice" role="status">${state.notice}</p>` : ""}
        <div class="data-tools">
          <button data-install-platform type="button" hidden>${icon("device")}<span>Instalar no dispositivo</span></button>
          <button data-export-backup type="button">${icon("download")}<span>Baixar backup</span></button>
          <button data-import-backup type="button">${icon("upload")}<span>Importar backup</span></button>
          <input id="backup-file-input" data-backup-file type="file" accept="application/json,.json" hidden />
          <a href="/privacy.html" target="_blank" rel="noopener">${icon("info")}<span>Privacidade e dados</span></a>
          <a href="/terms.html" target="_blank" rel="noopener">${icon("book")}<span>Termos de uso</span></a>
        </div>
        <button class="danger-action" data-clear-state type="button">${icon("trash")}<span>${isSupabaseMode()
          ? "Excluir minha conta e todos os dados"
          : "Excluir meus dados deste dispositivo"}</span></button>
      `)}
      ${PrimaryEnergyButton("Recalibrar Sintonia", 'data-route="home" type="button"')}
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
    }).catch(() => {
      setState({
        authNotice: "E-mail ou senha incorretos, ou conta ainda n&atilde;o confirmada.",
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
      platformName: String(formData.get("platformName") || "").trim() || "Drive Astral",
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

function submitOnboarding(birthValue) {
  const birth = String(birthValue || "").trim();
  const validation = validateBirthDateForProduct(birth);
  const area = selectedConsultationArea();

  if (validation.status === "invalid") {
    setState({
      birth,
      authNotice: "Informe uma data de nascimento v&aacute;lida.",
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
    onboardingComplete: true,
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseMode()) {
    setState({
      birth,
      authNotice: "Salvando seu perfil...",
      authNoticeKind: "",
    });
    supabaseService().updateProfile({
      name: account.name,
      birth,
      primaryAreaId: area.id,
    }).then((remoteAccount) => {
      setState({
        route: "dashboard",
        account: remoteAccount,
        authenticated: true,
        name: remoteAccount.name,
        birth: remoteAccount.birth,
        selectedAreaId: remoteAccount.primaryAreaId,
        authNotice: "",
        authNoticeKind: "",
      }, { persist: true, updateUrl: true });
    }).catch(() => {
      setState({
        authNotice: "N&atilde;o foi poss&iacute;vel salvar o perfil. Tente novamente.",
        authNoticeKind: "error",
      });
    });
    return;
  }

  saveLocalAccount(account);
  setState({
    route: "dashboard",
    account,
    authenticated: true,
    name: account.name,
    birth,
    selectedAreaId: area.id,
    authNotice: "",
    authNoticeKind: "",
  }, { persist: true, updateUrl: true });
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
    home: HomeScreen,
    chakras: ChakrasScreen,
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
  const accountNeedsOnboarding = state.authenticated
    && state.account
    && !state.account.onboardingComplete;
  let selectedScreen = screens[state.route] || LandingScreen;
  let shouldRequestAdminAccess = false;
  let shouldRequestAdminSettings = false;
  let shouldRequestAdminUsers = false;
  let shouldRequestAdminPlans = false;

  if (!state.authenticated && !publicRoutes.includes(state.route)) {
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
      setState({
        selectedAreaId: normalizeAreaId(element.dataset.areaId),
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
      setState({ journeySelectedDay: Number(button.dataset.journeyDay) || 1 });
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
      return;
    }
    const cloudState = await supabaseService().loadCloudState();
    const history = normalizedHistoryList(cloudState.history);
    const currentRoute = routeStateFromLocation().route;
    const targetRoute = ["landing", "login", "signup"].includes(currentRoute)
      ? (account.onboardingComplete ? "dashboard" : "onboarding")
      : currentRoute;
    const latestEntry = history[0] || null;
    setState({
      route: targetRoute,
      account,
      authenticated: true,
      name: account.name || "",
      birth: account.birth || "",
      selectedAreaId: account.primaryAreaId || "",
      history,
      timelineEvents: normalizedTimelineEvents(cloudState.timelineEvents),
      reading: latestEntry ? readingForHistoryEntry(latestEntry) : state.reading,
      activeHistoryId: latestEntry ? latestEntry.readingId : state.activeHistoryId,
      authNotice: "",
      authNoticeKind: "",
    }, { persist: true, updateUrl: true, replaceUrl: true });
    await hydrateSupabaseProgress();
  } catch {
    setState({
      route: "login",
      authenticated: false,
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
