const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const STORAGE_KEY = "drive-astral-state";
const ACCOUNT_KEY = "drive-astral-account";
const SESSION_KEY = "drive-astral-session";
const FIXED_NOW = "2026-06-05T12:00:00-03:00";

class FixedDate extends Date {
  constructor(...args) {
    super(...(args.length ? args : [FIXED_NOW]));
  }

  static now() {
    return new Date(FIXED_NOW).getTime();
  }
}

function cloneForTest(value) {
  return JSON.parse(JSON.stringify(value));
}

function createBrowserLikeContext(
  initialUrl = "http://localhost:4173/app/consulta",
  options = { authenticated: true },
) {
  let html = "";
  const storage = new Map();
  const appElement = {};
  const locationUrl = new URL(initialUrl);
  const location = {
    pathname: locationUrl.pathname,
    search: locationUrl.search,
  };
  let context;

  if (options.authenticated !== false) {
    storage.set(ACCOUNT_KEY, JSON.stringify({
      name: "Pessoa Teste",
      email: "pessoa@teste.local",
      birth: "1990-01-01",
      primaryAreaId: "general",
      onboardingComplete: true,
      accessMode: "local-preview",
    }));
    storage.set(SESSION_KEY, "active");
  }

  Object.defineProperty(appElement, "innerHTML", {
    get() {
      return html;
    },
    set(value) {
      html = String(value);
    },
  });

  const history = {
    pushState(_state, _title, url) {
      const nextUrl = new URL(url, "http://localhost:4173");
      location.pathname = nextUrl.pathname;
      location.search = nextUrl.search;
    },
    replaceState(_state, _title, url) {
      const nextUrl = new URL(url, "http://localhost:4173");
      location.pathname = nextUrl.pathname;
      location.search = nextUrl.search;
    },
  };

  context = {
    console,
    Date: FixedDate,
    Intl,
    URLSearchParams,
    encodeURIComponent,
    Map,
    JSON,
    String,
    Number,
    Boolean,
    Array,
    Math,
    RegExp,
    Object,
    innerWidth: Number(options.viewportWidth) || 1440,
    matchMedia(query) {
      const maxWidth = String(query).match(/max-width:\s*(\d+)px/);
      return {
        matches: maxWidth ? context.innerWidth <= Number(maxWidth[1]) : false,
        media: query,
        addEventListener() {},
        removeEventListener() {},
      };
    },
    localStorage: {
      getItem(key) {
        return storage.has(key) ? storage.get(key) : null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
      removeItem(key) {
        storage.delete(key);
      },
    },
    document: {
      getElementById(id) {
        return id === "app" ? appElement : null;
      },
      querySelectorAll() {
        return [];
      },
    },
    location,
    history,
    addEventListener() {},
    __getHtml() {
      return html;
    },
    __getSavedState() {
      return storage.has(STORAGE_KEY) ? JSON.parse(storage.get(STORAGE_KEY)) : null;
    },
  };

  context.window = context;
  context.globalThis = context;
  if (options.supabaseMode) {
    context.DriveAstralRuntimeConfig = {
      authMode: "supabase",
      supabaseUrl: "https://example.supabase.co",
      supabasePublishableKey: "test-key",
    };
    context.DriveAstralSupabase = {
      isEnabled() {
        return true;
      },
      getAccount() {
        return new Promise(() => {});
      },
      getAdminRole() {
        return Promise.resolve(null);
      },
      findReadingForCycle() {
        return Promise.resolve(options.cloudExisting || null);
      },
      saveReading(entry) {
        if (options.saveReadingError) {
          return Promise.reject(new Error("NETWORK_FAILURE"));
        }
        return Promise.resolve(entry);
      },
    };
  }
  vm.createContext(context);

  for (const file of [
    "src/domain/sincronario/engine.js",
    "src/domain/sincronario/thirteen-moons-engine.js",
    "src/domain/sincronario/kin-cycle-engine.js",
    "src/domain/sincronario/synchronization-engine.js",
    "src/domain/sincronario/coordinates-engine.js",
    "src/domain/cosmic-timeline.js",
    "src/domain/sincronario/area-application-knowledge.js",
    "src/domain/sincronario/area-knowledge.js",
    "src/domain/sincronario/knowledge.js",
    "app.js",
  ]) {
    vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  }

  return context;
}

const homeContext = createBrowserLikeContext();
const homeHtml = homeContext.__getHtml();
const appSource = fs.readFileSync("app.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const areaIds = [
  "general",
  "purpose",
  "work-prosperity",
  "love-relationships",
  "challenges-blocks",
  "energy-spirituality",
  "decisions-cycles",
];

const landingContext = createBrowserLikeContext(
  "http://localhost:4173/",
  { authenticated: false },
);
const landingHtml = landingContext.__getHtml();
assert.ok(landingHtml.includes("Clareza para escolher"));
assert.ok(landingHtml.includes("Come&ccedil;ar gratuitamente"));
assert.ok(landingHtml.includes("Como funciona"));
assert.ok(landingHtml.includes("Planos para cada etapa"));
assert.ok(landingHtml.includes("GPS do Sincron&aacute;rio"));
assert.ok(landingHtml.includes("O que voc&ecirc; recebe"));
assert.ok(landingHtml.includes("Exemplo real da plataforma"));
assert.ok(landingHtml.includes("Perguntas frequentes"));
assert.ok(landingHtml.includes("Jornada Guiada"));
assert.ok(landingHtml.includes("Dia 24 de 90"));
assert.ok(landingHtml.includes("DI&Aacute;RIO DE DIFICULDADES"));
assert.ok(landingHtml.includes("Assinatura mensal"));
assert.ok(landingHtml.includes("PREMIUM"));
assert.ok(landingHtml.includes("MENTOR"));
assert.ok(landingHtml.includes("R$</span>29,90"));
assert.ok(landingHtml.includes("R$</span>97,00"));
assert.ok(landingHtml.includes("INICIAR A MINHA JORNADA"));
assert.ok(!landingHtml.includes("A compra acontece fora da plataforma"));
assert.ok(!landingHtml.includes("CHECKOUT EXTERNO"));
assert.ok(landingHtml.includes("/assets/landing/dashboard-drive-astral.png"));
assert.ok(styles.includes(".public-site"));
assert.ok(styles.includes(".portal-sidebar"));
assert.ok(styles.includes(".dashboard-grid"));
assert.ok(styles.includes(".deliverables-grid"));
assert.ok(styles.includes(".faq-list"));
assert.ok(styles.includes(".guided-program-showcase"));
assert.ok(styles.includes(".plans-grid"));
assert.ok(styles.includes(".plan-price"));
assert.ok(appSource.includes("function CosmicBackground()"));
assert.ok(appSource.includes('data-component="CosmicBackground"'));
assert.ok(appSource.includes('aria-hidden="true"'));
assert.ok(appSource.includes("nebula-green"));
assert.ok(appSource.includes("nebula-gold"));
assert.ok(appSource.includes("nebula-blue"));
assert.ok(appSource.includes("nebula-violet"));
assert.ok(appSource.includes("star-layer stars-mid"));
assert.ok(appSource.includes("star-layer stars-near"));
assert.ok(appSource.includes("cosmic-glints"));
assert.ok(appSource.includes("cosmic-vignette"));
assert.ok(styles.includes("@keyframes nebulaGreen"));
assert.ok(styles.includes("@keyframes starsNear"));
assert.ok(styles.includes("@keyframes starGlint"));
assert.ok(styles.includes("@media (prefers-reduced-motion: reduce)"));
assert.ok(styles.includes(".cosmic-nebula"));
assert.ok(styles.includes("pointer-events: none"));
assert.ok(styles.includes(".admin-settings-grid"));
assert.ok(styles.includes(".admin-overview-strip"));
assert.ok(styles.includes(".admin-management-grid"));
assert.ok(styles.includes(".admin-table"));
assert.ok(styles.includes(".admin-field input"));
assert.ok(!styles.includes(".dashboard-evolution-panel"));
assert.ok(!styles.includes(".area-evolution-card"));
assert.ok(styles.includes(".upgrade-modal"));
assert.ok(styles.includes(".energy-cycle-shortcut"));
assert.ok(styles.includes(".energy-cycle-main-card"));
assert.ok(styles.includes("grid-template-columns: repeat(5, 1fr)"));
assert.ok(!appSource.includes("function DashboardEvolutionSection()"));
assert.ok(!appSource.includes("function areaEvolutionRows()"));
assert.ok(!appSource.includes("Math.min(94, 46 +"));
assert.ok(appSource.includes("Canonical Home for /app"));
assert.ok(appSource.includes("function MyDayScreen()"));
assert.ok(appSource.includes("function UpgradeModal()"));
assert.ok(appSource.includes("function EnergyCycleScreen()"));
assert.ok(appSource.includes('"/app/meu-dia": "my-day"'));
assert.ok(appSource.includes('"/app/ciclo-energetico": "energy-cycle"'));

const restoringSessionContext = createBrowserLikeContext(
  "http://localhost:4173/app",
  { authenticated: false, supabaseMode: true },
);
assert.ok(restoringSessionContext.__getHtml().includes("Restaurando sua jornada"));
assert.ok(!restoringSessionContext.__getHtml().includes("Acesse sua conta"));
vm.runInContext("setState({ authLoading: false })", restoringSessionContext);
assert.ok(restoringSessionContext.__getHtml().includes("Acesse sua conta"));

const onboardingContext = createBrowserLikeContext("http://localhost:4173/onboarding");
vm.runInContext(`setState({
  route: "onboarding",
  account: { name: "Pessoa Teste", email: "pessoa@teste.local", onboardingComplete: false },
  birth: "",
  selectedAreaId: ""
})`, onboardingContext);
const onboardingHtml = onboardingContext.__getHtml();
assert.ok(onboardingHtml.includes("Vamos compreender o momento que voc&ecirc; est&aacute; vivendo."));
assert.ok(onboardingHtml.includes("PRIMEIRA LEITURA"));
assert.ok(onboardingHtml.includes('name="birth"'));
assert.ok(onboardingHtml.includes('data-area-id="general"'));
assert.ok(onboardingHtml.includes('data-area-id="work-prosperity"'));
assert.ok(onboardingHtml.includes("Momento Atual"));
assert.ok(onboardingHtml.includes("Vida Financeira"));
assert.ok(onboardingHtml.includes("Criar minha primeira leitura"));
assert.ok(onboardingHtml.includes("Informe sua data completa para continuar."));
assert.ok(onboardingHtml.includes("Escolha um"));
assert.ok(onboardingHtml.includes("Preencha sua data e escolha um tema para continuar."));
assert.ok(onboardingHtml.includes("Momento</small>"));
assert.ok(onboardingHtml.includes("Leitura</small>"));
assert.ok(onboardingHtml.includes("Jornada</small>"));
assert.ok(!onboardingHtml.includes('<span class="eyebrow">Conhecendo seu momento</span>'));
assert.strictEqual((onboardingHtml.match(/data-area-id="/g) || []).length, areaIds.length);
assert.strictEqual((onboardingHtml.match(/aria-selected="false"/g) || []).length, areaIds.length);

vm.runInContext('setState({ selectedAreaId: "work-prosperity" })', onboardingContext);
const selectedOnboardingHtml = onboardingContext.__getHtml();
assert.ok(selectedOnboardingHtml.includes('data-area-id="work-prosperity"'));
assert.ok(selectedOnboardingHtml.includes('aria-selected="true"'));
assert.ok(selectedOnboardingHtml.includes("&agrave; sua vida financeira"));
assert.ok(selectedOnboardingHtml.includes("Tema selecionado"));

vm.runInContext('setState({ birth: "1990-01-01" })', onboardingContext);
const validBirthOnboardingHtml = onboardingContext.__getHtml();
assert.ok(validBirthOnboardingHtml.includes("Data confirmada para o c&aacute;lculo da sua base pessoal."));
assert.ok(validBirthOnboardingHtml.includes('class="onboarding-field-status is-valid"'));
assert.ok(!validBirthOnboardingHtml.includes('type="submit" aria-live="polite" disabled'));

vm.runInContext('setState({ birth: "2024-02-29" })', onboardingContext);
const invalidBirthOnboardingHtml = onboardingContext.__getHtml();
assert.ok(invalidBirthOnboardingHtml.includes("Verifique a data informada."));
assert.ok(invalidBirthOnboardingHtml.includes('class="onboarding-field-status is-invalid"'));

vm.runInContext('submitOnboarding("1990-01-01")', onboardingContext);
assert.strictEqual(vm.runInContext("state.route", onboardingContext), "chakras");
assert.strictEqual(vm.runInContext("state.account.primaryAreaId", onboardingContext), "work-prosperity");
assert.strictEqual(vm.runInContext("state.account.birth", onboardingContext), "1990-01-01");
assert.strictEqual(vm.runInContext("state.history.length", onboardingContext), 1);
assert.strictEqual(vm.runInContext("state.history[0].readingType", onboardingContext), "first-reading");
assert.strictEqual(vm.runInContext("state.history[0].readingStatus", onboardingContext), "completed");
assert.ok(onboardingContext.location.pathname.startsWith("/app/consulta/resultado/first-reading%3A"));
const firstReadingResultHtml = onboardingContext.__getHtml();
assert.ok(firstReadingResultHtml.includes("SUA PRIMEIRA LEITURA"));
assert.ok(firstReadingResultHtml.includes("LEITURA CONCLU&Iacute;DA"));
assert.ok(firstReadingResultHtml.includes("COMO CHEGAMOS A ESTA LEITURA"));
assert.ok(firstReadingResultHtml.includes("SUA BASE PESSOAL"));
assert.ok(firstReadingResultHtml.includes("O CICLO DO DIA"));
assert.ok(firstReadingResultHtml.includes("A APLICA&Ccedil;&Atilde;O"));
assert.ok(firstReadingResultHtml.includes("SEU PRIMEIRO DIRECIONAMENTO"));
assert.ok(firstReadingResultHtml.includes("Ver minha A&ccedil;&atilde;o do Dia"));
assert.ok(firstReadingResultHtml.includes("Abrir Protocolo Di&aacute;rio"));
assert.ok(firstReadingResultHtml.includes("Conhecer minha Jornada"));
assert.ok(firstReadingResultHtml.includes("Consulta de 5 de junho de 2026"));
assert.ok(!firstReadingResultHtml.includes("Entender os c&aacute;lculos desta leitura"));

const persistedPersonalKin = vm.runInContext("state.history[0].readingSnapshot.personal_map.kin.value", onboardingContext);
vm.runInContext(`
  state.history[0].createdAt = "2024-03-10T23:45:00.000Z";
  state.history[0].summary = "MENSAGEM ORIGINAL DO SNAPSHOT";
  state.history[0].interpretationSnapshot.areaTitle = "Tema Hist\u00f3rico";
  state.history[0].inputSnapshot.selectedAreaTitle = "Tema Hist\u00f3rico";
  state.history[0].interpretationSnapshot.synthesis = "ALINHAMENTO ORIGINAL DO SNAPSHOT";
  state.history[0].interpretationSnapshot.applicationSummary = "APLICA\u00c7\u00c3O ORIGINAL DO SNAPSHOT";
  state.reading.personal_map.kin.value = 999;
  state.reading.guidance.interpretation.synthesis = "CONTE\u00daDO RECALCULADO INDEVIDO";
  render();
`, onboardingContext);
const historicalSnapshotHtml = onboardingContext.__getHtml();
assert.ok(historicalSnapshotHtml.includes("Tema Histórico &middot; Consulta de 10 de março de 2024"));
assert.ok(historicalSnapshotHtml.includes("ALINHAMENTO ORIGINAL DO SNAPSHOT"));
assert.ok(historicalSnapshotHtml.includes("APLICAÇÃO ORIGINAL DO SNAPSHOT"));
assert.ok(historicalSnapshotHtml.includes(`Kin ${persistedPersonalKin}`));
assert.ok(!historicalSnapshotHtml.includes("Kin 999"));
assert.ok(!historicalSnapshotHtml.includes("CONTEÚDO RECALCULADO INDEVIDO"));
assert.strictEqual(vm.runInContext("state.history[0].summary", onboardingContext), "MENSAGEM ORIGINAL DO SNAPSHOT");

assert.strictEqual(vm.runInContext('completePresentationText("Frase curta e completa.", 30)', onboardingContext), "Frase curta e completa.");
assert.strictEqual(vm.runInContext('completePresentationText("palavra ".repeat(50), 80)', onboardingContext), "");
const purposePresentation = vm.runInContext(`firstReadingPresentation({
  areaId: "purpose",
  synthesis: "conteúdo extenso sem pontuação ".repeat(20),
  applicationSummary: "outro conteúdo extenso sem pontuação ".repeat(20),
})`, onboardingContext);
assert.strictEqual(purposePresentation.heroTitle, "Escolha o que tem sentido para você.");
assert.ok(purposePresentation.heroTitle.length <= 90);
assert.ok(purposePresentation.heroSummary.length <= 240);
assert.ok(!purposePresentation.heroTitle.includes("..."));
assert.ok(!purposePresentation.heroTitle.includes("…"));
const longWordPresentation = vm.runInContext(`firstReadingPresentation({
  areaId: "work-prosperity",
  synthesis: "supercalifragilisticamente".repeat(12),
  applicationSummary: "hiperresponsavelmente".repeat(15),
  dailyPractice: "inconstitucionalissimamente".repeat(10),
  reflectionQuestion: "interdisciplinarissimamente".repeat(10),
})`, onboardingContext);
assert.strictEqual(longWordPresentation.heroTitle, "Organize antes de expandir.");
assert.ok(!Object.values(longWordPresentation).some((value) => value.includes("...") || value.includes("…")));
vm.runInContext(`
  state.history[0].summary = "HEADLINE LONGA " + "com direção clara e presença disciplinada ".repeat(12) + "FIM-HEADLINE";
  state.history[0].interpretationSnapshot.synthesis = "ALINHAMENTO LONGO " + "para observar o momento com serenidade ".repeat(12) + "FIM-ALINHAMENTO";
  state.history[0].interpretationSnapshot.applicationSummary = "APOIO LONGO " + "que contextualiza a leitura preservada ".repeat(15) + "FIM-APOIO";
  state.history[0].interpretationSnapshot.dailyPractice = "AÇÃO LONGA " + "com um passo simples e possível ".repeat(12) + "FIM-AÇÃO";
  state.history[0].interpretationSnapshot.reflectionQuestion = "PERGUNTA LONGA " + "para compreender o foco escolhido ".repeat(12) + "FIM-PERGUNTA";
  render();
`, onboardingContext);
const longContentHtml = onboardingContext.__getHtml();
const longHeroHtml = longContentHtml.match(/<section class="first-reading-hero">([\s\S]*?)<\/section>/)[1];
const longGuidanceHtml = longContentHtml.match(/<section class="first-reading-guidance"[\s\S]*?<\/section>/)[0];
assert.ok(!longHeroHtml.includes("..."));
assert.ok(!longHeroHtml.includes("…"));
assert.ok(!longGuidanceHtml.includes("..."));
assert.ok(!longGuidanceHtml.includes("…"));
assert.ok(!longHeroHtml.includes("FIM-HEADLINE"));
assert.ok(!longHeroHtml.includes("FIM-APOIO"));
assert.ok(!longGuidanceHtml.includes("FIM-ALINHAMENTO"));
assert.ok(!longGuidanceHtml.includes("FIM-AÇÃO"));
assert.ok(!longGuidanceHtml.includes("FIM-PERGUNTA"));
assert.ok(vm.runInContext('state.history[0].interpretationSnapshot.dailyPractice.endsWith("FIM-AÇÃO")', onboardingContext));
assert.ok(longContentHtml.includes("FIM-AÇÃO"));
assert.ok(longContentHtml.includes("FIM-PERGUNTA"));
vm.runInContext('submitOnboarding("1990-01-01")', onboardingContext);
assert.strictEqual(vm.runInContext("state.history.length", onboardingContext), 1);

const processingContext = createBrowserLikeContext("http://localhost:4173/onboarding");
processingContext.setState({
  route: "onboarding",
  firstReadingStatus: "processing",
  firstReadingStep: 3,
});
const processingHtml = processingContext.__getHtml();
assert.ok(processingHtml.includes("Estamos preparando sua primeira leitura."));
assert.ok(processingHtml.includes('aria-busy="true"'));
assert.ok(processingHtml.includes("Relacionando seus ciclos"));
processingContext.setState({ firstReadingStatus: "failed", firstReadingStep: 5 });
const failedFirstReadingHtml = processingContext.__getHtml();
assert.ok(failedFirstReadingHtml.includes("N&atilde;o foi poss&iacute;vel concluir sua leitura agora."));
assert.ok(failedFirstReadingHtml.includes("Tentar novamente"));
assert.ok(failedFirstReadingHtml.includes('aria-busy="false"'));

const directReadingRouteContext = createBrowserLikeContext(
  "http://localhost:4173/app/consulta/resultado/first-reading%3Atest-user%3Ageneral%3A2026-06-05%3A0.4.0",
);
assert.strictEqual(vm.runInContext("state.route", directReadingRouteContext), "chakras");
assert.strictEqual(
  vm.runInContext("state.requestedReadingId", directReadingRouteContext),
  "first-reading:test-user:general:2026-06-05:0.4.0",
);

const invalidOnboardingAreaContext = createBrowserLikeContext("http://localhost:4173/onboarding");
invalidOnboardingAreaContext.setState({
  route: "onboarding",
  birth: "1990-01-01",
  selectedAreaId: "",
  firstReadingStatus: "pending",
});
vm.runInContext('submitOnboarding("1990-01-01")', invalidOnboardingAreaContext);
assert.strictEqual(vm.runInContext("state.route", invalidOnboardingAreaContext), "onboarding");
assert.ok(invalidOnboardingAreaContext.__getHtml().includes("Escolha uma &aacute;rea principal para concluir."));

const duplicateBlockedContext = createBrowserLikeContext("http://localhost:4173/onboarding");
duplicateBlockedContext.setState({
  route: "onboarding",
  birth: "1990-01-01",
  selectedAreaId: "general",
  firstReadingStatus: "processing",
  history: [],
});
vm.runInContext('submitOnboarding("1990-01-01")', duplicateBlockedContext);
assert.strictEqual(vm.runInContext("state.history.length", duplicateBlockedContext), 0);

const adminDashboardContext = createBrowserLikeContext("http://localhost:4173/admin");
const adminDashboardHtml = adminDashboardContext.__getHtml();
assert.strictEqual(vm.runInContext("state.route", adminDashboardContext), "admin-dashboard");
assert.ok(adminDashboardHtml.includes("Gerenciar Usu&aacute;rios"));
assert.ok(adminDashboardHtml.includes("Gerenciar Planos"));
assert.ok(adminDashboardHtml.includes("Abrir Usu&aacute;rios"));
assert.ok(adminDashboardHtml.includes("Abrir Planos"));

const adminContext = createBrowserLikeContext("http://localhost:4173/admin/configuracoes");
const adminHtml = adminContext.__getHtml();
assert.strictEqual(vm.runInContext("state.route", adminContext), "admin-settings");
assert.ok(adminHtml.includes("Configura&ccedil;&otilde;es"));
assert.ok(adminHtml.includes("Planos e CTAs"));
assert.ok(adminHtml.includes("Checkout externo"));
assert.ok(adminHtml.includes("Metodologia lunar"));
assert.ok(adminHtml.includes("PREMIUM"));
assert.ok(adminHtml.includes("29,90"));
assert.ok(adminHtml.includes("97,00"));
assert.ok(adminHtml.includes("INICIAR A MINHA JORNADA"));
assert.ok(adminHtml.includes('id="admin-settings-form"'));

const adminUsersContext = createBrowserLikeContext("http://localhost:4173/admin/usuarios");
const adminUsersHtml = adminUsersContext.__getHtml();
assert.strictEqual(vm.runInContext("state.route", adminUsersContext), "admin-users");
assert.ok(adminUsersHtml.includes("Gerenciamento de usu&aacute;rios"));
assert.ok(adminUsersHtml.includes("Usu&aacute;rios cadastrados"));
assert.ok(adminUsersHtml.includes("Pessoa Teste"));
assert.ok(adminUsersHtml.includes("data-admin-access-form"));
assert.ok(adminUsersHtml.includes("Salvar"));

const adminPlansContext = createBrowserLikeContext("http://localhost:4173/admin/planos");
const adminPlansHtml = adminPlansContext.__getHtml();
assert.strictEqual(vm.runInContext("state.route", adminPlansContext), "admin-plans");
assert.ok(adminPlansHtml.includes("Gerenciamento de planos"));
assert.ok(adminPlansHtml.includes("Drive Mental"));
assert.ok(adminPlansHtml.includes("Jornada Guiada"));
assert.ok(adminPlansHtml.includes('value="29,90"'));
assert.ok(adminPlansHtml.includes('value="97,00"'));
assert.ok(adminPlansHtml.includes("data-admin-plan-form"));
assert.ok(adminPlansHtml.includes("Salvar plano"));

const adminDeniedContext = createBrowserLikeContext(
  "http://localhost:4173/admin",
  { authenticated: false },
);
assert.strictEqual(vm.runInContext("state.route", adminDeniedContext), "login");

const demoContext = createBrowserLikeContext(
  "http://localhost:4173/login",
  { authenticated: false },
);
assert.ok(demoContext.__getHtml().includes("Acessar demonstra&ccedil;&atilde;o"));
demoContext.enterDemoAccess();
const demoState = vm.runInContext("state", demoContext);
assert.strictEqual(demoState.route, "dashboard");
assert.strictEqual(demoState.authenticated, true);
assert.strictEqual(demoState.account.accessMode, "local-demo");
assert.strictEqual(demoState.reading.personal_map.kin.value, 168);
assert.ok(demoContext.__getHtml().includes("Conta Demonstra"));

const myDayRouteContext = createBrowserLikeContext("http://localhost:4173/app/meu-dia");
assert.strictEqual(vm.runInContext("state.route", myDayRouteContext), "my-day");
assert.ok(myDayRouteContext.__getHtml().includes("A&ccedil;&atilde;o do dia"));

function seedConsultationBase(context, {
  planId = "free",
  primaryAreaId = "general",
  consultedAreaId = "",
  adminRole = "",
  selectedAreaId = "",
} = {}) {
  const account = vm.runInContext("state.account", context) || {
    name: "Pessoa Teste",
    email: "pessoa@teste.local",
    birth: "1990-01-01",
    primaryAreaId: "general",
    onboardingComplete: true,
    accessMode: "supabase",
  };
  const reading = context.calculateReading(account.birth, primaryAreaId);
  const history = [];
  if (consultedAreaId) {
    history.push(context.createReadingHistoryEntry({
      name: account.name,
      birth: account.birth,
      area: {
        id: consultedAreaId,
        title: consultedAreaId,
      },
      reading: context.calculateReading(account.birth, consultedAreaId),
      readingType: "first-reading",
    }));
  }
  context.setState({
    route: "home",
    authenticated: true,
    reading,
    history,
    selectedAreaId,
    adminRole,
    account: {
      ...account,
      id: "11111111-1111-4111-8111-111111111111",
      planId,
      primaryAreaId,
      accessPlans: planId === "free"
        ? []
        : [{ plan_id: planId, status: "active" }],
    },
  });
  return history;
}

const emptyConsultationContext = createBrowserLikeContext();
seedConsultationBase(emptyConsultationContext);
const emptyConsultationHtml = emptyConsultationContext.__getHtml();
assert.ok(emptyConsultationHtml.includes("NOVA LEITURA &middot; APLICA&Ccedil;&Atilde;O POR &Aacute;REA"));
assert.ok(emptyConsultationHtml.includes("0 de 7 &aacute;reas consultadas"));
assert.ok(emptyConsultationHtml.includes("SUA BASE PESSOAL"));
assert.ok(emptyConsultationHtml.includes("Pessoa Teste"));
assert.ok(emptyConsultationHtml.includes("01/01/1990"));
assert.ok(emptyConsultationHtml.includes("Kin pessoal"));
assert.ok(emptyConsultationHtml.includes("Momento Atual"));
assert.ok(emptyConsultationHtml.includes("Estes dados formam sua base pessoal"));
assert.ok(emptyConsultationHtml.includes("Corrigir meus dados no perfil"));
assert.ok(!emptyConsultationHtml.includes('name="name"'));
assert.ok(!emptyConsultationHtml.includes('name="birth"'));
assert.strictEqual((emptyConsultationHtml.match(/data-consultation-area-id="/g) || []).length, 1);
assert.strictEqual((emptyConsultationHtml.match(/data-open-upgrade-modal/g) || []).length, 6);
assert.ok(emptyConsultationHtml.includes("Selecione uma &aacute;rea dispon&iacute;vel"));
assert.ok(emptyConsultationHtml.includes('role="progressbar"'));
assert.ok(emptyConsultationHtml.includes('aria-valuenow="0"'));

const completedConsultationContext = createBrowserLikeContext();
const completedConsultationHistory = seedConsultationBase(completedConsultationContext, {
  consultedAreaId: "general",
});
const completedConsultationHtml = completedConsultationContext.__getHtml();
assert.ok(completedConsultationHtml.includes("1 de 7 &aacute;reas consultadas"));
assert.ok(completedConsultationHtml.includes("Consulta conclu&iacute;da"));
assert.ok(completedConsultationHtml.includes("&Aacute;rea principal"));
assert.ok(completedConsultationHtml.includes("Ver resultado"));
assert.ok(completedConsultationHtml.includes(`data-history-id="${completedConsultationHistory[0].readingId}"`));
assert.ok(completedConsultationHtml.includes("Seu plano inclui uma &aacute;rea."));
assert.strictEqual((completedConsultationHtml.match(/data-open-upgrade-modal/g) || []).length, 6);

const selectionContext = createBrowserLikeContext();
seedConsultationBase(selectionContext, {
  planId: "premium",
  selectedAreaId: "work-prosperity",
});
const selectedHtml = selectionContext.__getHtml();
assert.strictEqual((selectedHtml.match(/is-selected/g) || []).length, 1);
assert.strictEqual((selectedHtml.match(/aria-selected="true"/g) || []).length, 1);
assert.ok(selectedHtml.includes('data-consultation-area-id="work-prosperity"'));
assert.ok(selectedHtml.includes("Voc&ecirc; est&aacute; criando uma nova leitura para <strong>Vida Financeira</strong>"));
assert.ok(selectedHtml.includes("Criar leitura para Vida Financeira"));
assert.strictEqual((selectedHtml.match(/data-consultation-area-id="/g) || []).length, 7);
assert.strictEqual((selectedHtml.match(/data-open-upgrade-modal/g) || []).length, 0);

const adminConsultationContext = createBrowserLikeContext();
seedConsultationBase(adminConsultationContext, { adminRole: "owner" });
const adminConsultationHtml = adminConsultationContext.__getHtml();
assert.ok(adminConsultationHtml.includes("Todas as &aacute;reas est&atilde;o dispon&iacute;veis"));
assert.strictEqual((adminConsultationHtml.match(/data-consultation-area-id="/g) || []).length, 7);

const freeSelectionContext = createBrowserLikeContext();
seedConsultationBase(freeSelectionContext);
freeSelectionContext.setState({
  selectedAreaId: "work-prosperity",
  upgradeModalOpen: false,
});
freeSelectionContext.submitAlignment("Pessoa adulterada", "2001-02-03");
const freeSelectionState = vm.runInContext("state", freeSelectionContext);
assert.strictEqual(freeSelectionState.upgradeModalOpen, true);
assert.strictEqual(freeSelectionState.upgradeAreaId, "work-prosperity");
assert.strictEqual(freeSelectionState.history.length, 0);
assert.ok(freeSelectionContext.__getHtml().includes("Esta &aacute;rea n&atilde;o est&aacute; dispon&iacute;vel no seu plano atual."));

const tamperedSubmissionContext = createBrowserLikeContext();
seedConsultationBase(tamperedSubmissionContext, {
  planId: "premium",
  selectedAreaId: "work-prosperity",
});
tamperedSubmissionContext.setState({
  name: "Pessoa adulterada",
  birth: "2001-02-03",
});
tamperedSubmissionContext.submitAlignment("Outra pessoa", "1999-09-09");
const tamperedSubmissionState = vm.runInContext("state", tamperedSubmissionContext);
assert.strictEqual(tamperedSubmissionState.route, "chakras");
assert.strictEqual(tamperedSubmissionState.history.length, 1);
assert.strictEqual(tamperedSubmissionState.history[0].inputSnapshot.name, "Pessoa Teste");
assert.strictEqual(tamperedSubmissionState.history[0].inputSnapshot.birthDate, "1990-01-01");

tamperedSubmissionContext.setState({
  route: "home",
  selectedAreaId: "work-prosperity",
});
tamperedSubmissionContext.submitAlignment();
const duplicateSubmissionState = vm.runInContext("state", tamperedSubmissionContext);
assert.strictEqual(duplicateSubmissionState.route, "chakras");
assert.strictEqual(duplicateSubmissionState.history.length, 1);
assert.ok(duplicateSubmissionState.notice.includes("j&aacute; possui uma leitura"));

completedConsultationContext.openConsultationHistoryEntry(completedConsultationHistory[0]);
const reopenedSnapshotState = vm.runInContext("state", completedConsultationContext);
assert.strictEqual(reopenedSnapshotState.route, "chakras");
assert.strictEqual(reopenedSnapshotState.activeHistoryId, completedConsultationHistory[0].readingId);
assert.strictEqual(reopenedSnapshotState.history.length, 1);

for (const viewportWidth of [1440, 1280, 1024, 768, 430, 390, 360]) {
  const responsiveContext = createBrowserLikeContext(
    "http://localhost:4173/app/consulta",
    { authenticated: true, viewportWidth },
  );
  seedConsultationBase(responsiveContext, {
    planId: "premium",
    selectedAreaId: "purpose",
  });
  const responsiveHtml = responsiveContext.__getHtml();
  assert.ok(responsiveHtml.includes("new-consultation-area-grid"), viewportWidth);
  assert.ok(responsiveHtml.includes("new-consultation-submit"), viewportWidth);
  assert.ok(responsiveHtml.includes("consultation-aside"), viewportWidth);
}

assert.ok(styles.includes(".new-consultation-area-grid"));
assert.ok(styles.includes("grid-template-columns: repeat(2, minmax(0, 1fr))"));
assert.ok(styles.includes("@media (max-width: 768px)"));
assert.ok(styles.includes("@media (max-width: 430px)"));
assert.ok(styles.includes(".new-consultation-submit .primary-energy-button"));
assert.ok(styles.includes("overflow-wrap: anywhere"));
assert.ok(appSource.includes("submitConsultation(state.selectedAreaId)"));
assert.ok(styles.includes("--bottom-navigation-height"));
assert.ok(styles.includes("--bottom-navigation-measured-height: calc(var(--bottom-navigation-height) + env(safe-area-inset-bottom))"));
assert.ok(styles.includes("--bottom-nav-offset: calc(var(--bottom-navigation-measured-height) + var(--bottom-content-gap))"));
assert.ok(styles.includes("grid-template-rows: minmax(0, 1fr) auto"));
assert.ok(styles.includes("overflow-y: auto"));
assert.ok(styles.includes("padding: calc(env(safe-area-inset-top) + 18px) 18px var(--bottom-content-gap)"));
assert.ok(styles.includes("scroll-padding-bottom: var(--bottom-content-gap)"));
assert.ok(styles.includes(".bottom-navigation {\n  position: relative;"));
assert.ok(appSource.includes("setProperty(\"--bottom-navigation-measured-height\""));
assert.ok(appSource.includes("new window.ResizeObserver"));
assert.ok(appSource.includes("__driveAstralBottomNavigationTarget !== navigation"));
assert.ok(appSource.includes('window.addEventListener("resize", handlePlatformViewportResize)'));

const resultContext = createBrowserLikeContext();
const reading = resultContext.calculateReading("1996-06-25", "financas");
assert.strictEqual(resultContext.normalizeAreaId("financas"), "work-prosperity");
assert.strictEqual(resultContext.validateBirthDateForProduct("1982-12-10").status, "valid");
assert.strictEqual(resultContext.validateBirthDateForProduct("2026-02-30").status, "invalid");
assert.strictEqual(resultContext.calculateReading("1982-12-10", "geral").personal_map.kin.value, 166);
assert.strictEqual(resultContext.calculateReading("1996-06-25", "geral").personal_map.kin.value, 168);
assert.strictEqual(resultContext.calculateReading("2026-06-05", "geral").personal_map.kin.value, 178);

for (const date of ["1988-02-29", "2000-02-29", "2024-02-29"]) {
  assert.strictEqual(
    resultContext.validateBirthDateForProduct(date).status,
    "pending_method_decision",
    date,
  );
  assert.strictEqual(resultContext.calculateReading(date, "geral"), null, date);
}

assert.strictEqual(resultContext.calculateReading("2026-02-30", "geral"), null);

const firstHistoryEntry = resultContext.createReadingHistoryEntry({
  name: "Gabriel Ferreira",
  birth: "1996-06-25",
  area: { id: "work-prosperity", title: "Trabalho e Prosperidade" },
  reading,
});
const secondHistoryEntry = resultContext.createReadingHistoryEntry({
  name: "Gabriel Ferreira",
  birth: "1996-06-25",
  area: { id: "love-relationships", title: "Amor e Relacionamentos" },
  reading: resultContext.calculateReading("1996-06-25", "relacionamentos"),
});
assert.notStrictEqual(firstHistoryEntry.readingId, secondHistoryEntry.readingId);
assert.strictEqual(firstHistoryEntry.schemaVersion, "history-snapshot-v2");
assert.strictEqual(firstHistoryEntry.inputSnapshot.birthDate, "1996-06-25");
assert.strictEqual(firstHistoryEntry.calculationSnapshot.dayKin.kin.value, 178);
assert.strictEqual(firstHistoryEntry.interpretationSnapshot.areaId, "work-prosperity");
assert.strictEqual(firstHistoryEntry.interpretationSnapshot.areaTitle, "Trabalho e Prosperidade");
assert.strictEqual(firstHistoryEntry.interpretationSnapshot.contentVersion, "area-knowledge-v0.3");
assert.deepStrictEqual(
  Object.keys(firstHistoryEntry.interpretationSnapshot),
  [
    "areaId",
    "areaTitle",
    "contentVersion",
    "synthesis",
    "reflectionQuestion",
    "suggestedPractice",
    "applicationSummary",
    "dailyPractice",
    "coordinatesUsed",
    "contentFallbackUsed",
  ],
);
assert.ok(firstHistoryEntry.interpretationSnapshot.synthesis.includes("Trabalho e Prosperidade"));
assert.ok(firstHistoryEntry.interpretationSnapshot.synthesis.includes("Lua Cristal"));
assert.ok(firstHistoryEntry.interpretationSnapshot.synthesis.includes("Kin de navegação 86"));
assert.ok(firstHistoryEntry.interpretationSnapshot.reflectionQuestion.includes("organização de recursos"));
assert.ok(firstHistoryEntry.interpretationSnapshot.suggestedPractice.includes("Levante informações"));
assert.strictEqual(firstHistoryEntry.calculationSnapshot.coordinates.birth.thirteen_moons.moon.name, "Lua Cristal");
assert.strictEqual(firstHistoryEntry.calculationSnapshot.coordinates.day.thirteen_moons.moon.name, "Lua Cristal");
assert.strictEqual(firstHistoryEntry.interpretationSnapshot.contentFallbackUsed, false);
assert.notStrictEqual(
  firstHistoryEntry.interpretationSnapshot.synthesis,
  secondHistoryEntry.interpretationSnapshot.synthesis,
);
assert.notStrictEqual(
  firstHistoryEntry.interpretationSnapshot.reflectionQuestion,
  secondHistoryEntry.interpretationSnapshot.reflectionQuestion,
);
assert.notStrictEqual(
  firstHistoryEntry.interpretationSnapshot.suggestedPractice,
  secondHistoryEntry.interpretationSnapshot.suggestedPractice,
);

resultContext.setState({
  route: "chakras",
  name: "Gabriel Ferreira",
  birth: "1996-06-25",
  selectedAreaId: "work-prosperity",
  reading,
  activeHistoryId: firstHistoryEntry.readingId,
  history: [firstHistoryEntry, secondHistoryEntry],
}, { persist: true });

const resultHtml = resultContext.__getHtml();
assert.ok(resultHtml.includes("RESULTADO DA CONSULTA"));
assert.ok(resultHtml.includes("Sua resposta essencial"));
assert.ok(resultHtml.includes("Organize antes de expandir."));
assert.ok(resultHtml.includes("Frase de alinhamento"));
assert.ok(resultHtml.includes("A&ccedil;&atilde;o de hoje"));
assert.ok(resultHtml.includes("Pergunta para confirmar"));
assert.ok(resultHtml.includes("Abrir protocolo di&aacute;rio"));
assert.ok(resultHtml.includes("Entenda sua leitura"));
assert.ok(resultHtml.includes("Veja Kins, coordenadas e aplica&ccedil;&otilde;es da leitura."));
assert.ok(resultHtml.includes("Ciclo Energ&eacute;tico"));
assert.ok(resultHtml.includes("Ver Ciclo Energ&eacute;tico"));
assert.ok(resultHtml.includes("Resumo do GPS de Hoje"));
assert.ok(resultHtml.includes("Suas Coordenadas de Nascimento"));
assert.ok(resultHtml.includes("Coordenadas do Dia"));
assert.ok(resultHtml.includes("Sua Sincroniza&ccedil;&atilde;o com Hoje"));
assert.ok(resultHtml.includes("Aplica&ccedil;&atilde;o na &Aacute;rea Escolhida"));
assert.ok(resultHtml.includes("Pr&aacute;tica de Sincroniza&ccedil;&atilde;o do Dia"));
assert.ok(!resultHtml.includes("Como esta leitura foi criada"));
assert.ok(!resultHtml.includes("Matriz de 260 Kins"));
assert.ok(!resultHtml.includes("SHA-256"));
assert.ok(!resultHtml.includes("Ciclo dos Plasmas e Chakras"));
assert.ok(!resultHtml.includes("Mapa visual dos 7 chakras"));
assert.ok(resultHtml.includes("Kin pessoal"));
assert.ok(resultHtml.includes("<strong>168</strong>"));
assert.ok(resultHtml.includes("Branco Solar Espelho"));
assert.ok(resultHtml.includes("Lua Cristal"));
assert.ok(resultHtml.includes("Silio"));
assert.ok(resultHtml.includes("Coração / Cardíaco"));
assert.ok(resultHtml.includes("Kin de navega&ccedil;&atilde;o"));
assert.ok(resultHtml.includes("<strong>86</strong>"));
assert.ok(resultHtml.includes("Trabalho e Prosperidade"));
assert.ok(resultHtml.includes("Onde organização de recursos pode gerar mais consistência"));
assert.ok(resultHtml.includes("Levante informações, números e prioridades antes de decidir"));
assert.ok(resultHtml.includes("parcerias, clientes, rede de apoio e colaboração produtiva"));
assert.ok(resultHtml.includes("Posição da sua data dentro do ciclo anual de 13 luas."));
assert.ok(resultHtml.includes("Coordenada diária ligada ao ciclo de sete plasmas."));
assert.ok(resultHtml.includes("Fase de 7 dias dentro da Lua atual."));
assert.ok(resultHtml.includes("Resultado da sincroniza&ccedil;&atilde;o entre seu Kin pessoal e o Kin do dia."));
assert.ok(!resultHtml.includes("Classifica&ccedil;&atilde;o"));
assert.ok(!resultHtml.includes("Motor v0.4.0"));
assert.ok(!resultHtml.includes("Pendente"));
assert.ok(!resultHtml.toLowerCase().includes("previs&atilde;o absoluta do futuro"));
assert.ok(!resultHtml.includes("Inten&ccedil;&atilde;o Declarada"));
assert.strictEqual((resultHtml.match(/<details class="coordinate-details/g) || []).length, 3);

const dashboardFirstReading = {
  ...cloneForTest(firstHistoryEntry),
  readingType: "first-reading",
  readingStatus: "completed",
};
const emptyDashboardContext = createBrowserLikeContext();
emptyDashboardContext.setState({ route: "dashboard", history: [], reading: null, activeHistoryId: "" });
const emptyDashboardHtml = emptyDashboardContext.__getHtml();
assert.ok(emptyDashboardHtml.includes("Comece sua primeira leitura"));
assert.ok(emptyDashboardHtml.includes("Criar minha primeira leitura"));
assert.ok(emptyDashboardHtml.includes("Sua dire&ccedil;&atilde;o aparecer&aacute; aqui."));
assert.ok(emptyDashboardHtml.includes("Conclua suas primeiras a&ccedil;&otilde;es"));

const freeDashboardContext = createBrowserLikeContext();
freeDashboardContext.setState({
  route: "dashboard",
  account: {
    ...vm.runInContext("state.account", freeDashboardContext),
    planId: "free",
    primaryAreaId: "work-prosperity",
    accessPlans: [],
  },
  name: "Gabriel Ferreira",
  birth: "1996-06-25",
  selectedAreaId: "work-prosperity",
  reading,
  activeHistoryId: firstHistoryEntry.readingId,
  history: [dashboardFirstReading],
});
const freeDashboardHtml = freeDashboardContext.__getHtml();
assert.ok(freeDashboardHtml.includes("SEU PR&Oacute;XIMO PASSO"));
assert.ok(freeDashboardHtml.includes("Sua primeira dire&ccedil;&atilde;o est&aacute; pronta"));
assert.ok(freeDashboardHtml.includes("JORNADA N&Atilde;O INICIADA"));
assert.ok(freeDashboardHtml.includes("Ver minha A&ccedil;&atilde;o do Dia"));
assert.ok(freeDashboardHtml.includes("Iniciar Jornada de 30 dias"));
assert.ok(freeDashboardHtml.includes("SUA DIRE&Ccedil;&Atilde;O DE HOJE"));
assert.ok(freeDashboardHtml.includes("SUA JORNADA"));
assert.ok(freeDashboardHtml.includes('aria-current="step"'));
assert.ok(freeDashboardHtml.includes('role="progressbar"'));
assert.ok(freeDashboardHtml.includes("SUAS &Aacute;REAS DE ACOMPANHAMENTO"));
assert.ok(freeDashboardHtml.includes("SEU PROGRESSO"));
assert.ok(!freeDashboardHtml.includes("EVOLU&Ccedil;&Atilde;O POR &Aacute;REAS"));
assert.ok(!freeDashboardHtml.includes("MELHOR EVOLU&Ccedil;&Atilde;O ATUAL"));
assert.ok(!freeDashboardHtml.includes("PRECISA MELHORAR"));
assert.ok(!freeDashboardHtml.includes("74%"));
assert.ok(!freeDashboardHtml.includes("18%"));
assert.ok(freeDashboardHtml.includes("FREE</span>"));
assert.ok(freeDashboardHtml.includes(">Home</span>"));
assert.ok(freeDashboardHtml.includes(">A&ccedil;&atilde;o do dia</span>"));
assert.ok(!freeDashboardHtml.includes("Conta sincronizada"));
assert.ok(!freeDashboardHtml.includes("VER CICLO ENERG&Eacute;TICO"));
assert.ok(freeDashboardHtml.includes("Desbloquear"));
assert.ok(freeDashboardHtml.includes("data-open-upgrade-modal"));
assert.ok(freeDashboardHtml.includes("Bloqueada pelo plano"));
assert.ok(freeDashboardHtml.includes("Vida Financeira"));
assert.ok(freeDashboardHtml.includes("&Aacute;rea principal"));
assert.ok(freeDashboardHtml.includes("Ver resultado"));
assert.ok(freeDashboardHtml.includes(`data-history-id="${dashboardFirstReading.readingId}"`));
assert.strictEqual((freeDashboardHtml.match(/class="dashboard-area-card/g) || []).length, 7);
assert.ok(!freeDashboardHtml.includes("Fazer primeira consulta"));
assert.ok(!freeDashboardHtml.includes("Calcular minhas coordenadas"));
vm.runInContext('state.reading.guidance.interpretation.synthesis = "CONTEÚDO ATUAL QUE NÃO PODE SUBSTITUIR O SNAPSHOT"; render();', freeDashboardContext);
assert.ok(!freeDashboardContext.__getHtml().includes("CONTEÚDO ATUAL QUE NÃO PODE SUBSTITUIR O SNAPSHOT"));

const freeJourneyContextKey = vm.runInContext("journeyContextKey()", freeDashboardContext);
freeDashboardContext.setState({
  account: {
    ...vm.runInContext("state.account", freeDashboardContext),
    planId: "premium",
    accessPlans: [{ plan_id: "premium", status: "active" }],
  },
});
freeDashboardContext.localStorage.setItem("drive-astral-journey-progress", JSON.stringify({
  contextKey: freeJourneyContextKey,
  startDate: "2026-06-02",
  completedDays: [1, 2, 3],
}));
freeDashboardContext.setState({ route: "dashboard" });
const activeJourneyDashboardHtml = freeDashboardContext.__getHtml();
assert.ok(activeJourneyDashboardHtml.includes("Continue de onde parou"));
assert.ok(activeJourneyDashboardHtml.includes("DIA 4 DE 30"));
assert.ok(activeJourneyDashboardHtml.includes("Continuar o dia"));
assert.ok(activeJourneyDashboardHtml.includes("3/30"));

freeDashboardContext.localStorage.setItem("drive-astral-journey-progress", JSON.stringify({
  contextKey: freeJourneyContextKey,
  startDate: "2026-06-02",
  completedDays: [1, 2, 3, 4],
}));
freeDashboardContext.setState({ route: "dashboard" });
const completedDayDashboardHtml = freeDashboardContext.__getHtml();
assert.ok(completedDayDashboardHtml.includes("Seu dia foi conclu&iacute;do"));
assert.ok(completedDayDashboardHtml.includes("DIA CONCLU&Iacute;DO"));
assert.ok(completedDayDashboardHtml.includes("Revisar meu dia"));

freeDashboardContext.localStorage.setItem("drive-astral-journey-progress", JSON.stringify({
  contextKey: freeJourneyContextKey,
  startDate: "2026-05-07",
  completedDays: Array.from({ length: 30 }, (_item, index) => index + 1),
}));
freeDashboardContext.setState({ route: "dashboard" });
const completedJourneyDashboardHtml = freeDashboardContext.__getHtml();
assert.ok(completedJourneyDashboardHtml.includes("Voc&ecirc; concluiu este ciclo"));
assert.ok(completedJourneyDashboardHtml.includes("CICLO CONCLU&Iacute;DO"));
assert.ok(completedJourneyDashboardHtml.includes("Revisar minha jornada"));
assert.ok(completedJourneyDashboardHtml.includes("1 área trabalhada"));

const myDayContext = createBrowserLikeContext("http://localhost:4173/app/meu-dia");
myDayContext.setState({
  route: "my-day",
  name: "Gabriel Ferreira",
  birth: "1996-06-25",
  selectedAreaId: "work-prosperity",
  reading,
  activeHistoryId: firstHistoryEntry.readingId,
  history: [cloneForTest(firstHistoryEntry)],
});
const myDayHtml = myDayContext.__getHtml();
assert.ok(myDayHtml.includes("A&Ccedil;&Atilde;O DO DIA"));
assert.ok(myDayHtml.includes("Sua dire&ccedil;&atilde;o e pr&aacute;tica para hoje"));
assert.ok(myDayHtml.includes("Observe o momento antes de tentar resolver tudo."));
assert.ok(myDayHtml.includes("Frase do dia"));
assert.ok(myDayHtml.includes("A&ccedil;&atilde;o do dia"));
assert.ok(myDayHtml.includes("Pergunta do dia"));
assert.ok(myDayHtml.includes("ROTINA EM TR&Ecirc;S MOMENTOS"));
assert.ok(myDayHtml.includes("Manh&atilde;"));
assert.ok(myDayHtml.includes("Comece com presen&ccedil;a"));
assert.ok(myDayHtml.includes("Execute o essencial"));
assert.ok(myDayHtml.includes("Feche o dia em paz"));
assert.ok(myDayHtml.includes("0 de 3 momentos conclu&iacute;dos"));
assert.ok(myDayHtml.includes("Ver minha jornada"));
assert.ok(myDayHtml.includes("Princ&iacute;pios da pr&aacute;tica"));
assert.strictEqual((myDayHtml.match(/FOCO DE HOJE/g) || []).length, 0);
assert.strictEqual((myDayHtml.match(/class="daily-focus-card"/g) || []).length, 0);
assert.ok(myDayHtml.includes("VER CICLO ENERG&Eacute;TICO"));

const desktopSidebarHtml = myDayHtml.slice(
  myDayHtml.indexOf('<aside class="portal-sidebar">'),
  myDayHtml.indexOf("</aside>") + "</aside>".length,
);
const desktopNavigationHtml = desktopSidebarHtml.slice(
  desktopSidebarHtml.indexOf('<nav aria-label="Navega&ccedil;&atilde;o da plataforma">'),
  desktopSidebarHtml.indexOf("</nav>") + "</nav>".length,
);
const expectedDesktopMenuItems = [
  ["dashboard", "Home"],
  ["my-day", "A&ccedil;&atilde;o do dia"],
  ["home", "Nova consulta"],
  ["energy-cycle", "Ciclo Energ&eacute;tico"],
  ["journey", "Jornada de 30 dias"],
  ["protocol", "Protocolo di&aacute;rio"],
  ["profile", "Meu perfil"],
];
assert.strictEqual((myDayHtml.match(/class="portal-sidebar"/g) || []).length, 1);
assert.strictEqual((myDayHtml.match(/aria-label="Navega&ccedil;&atilde;o da plataforma"/g) || []).length, 1);
assert.strictEqual((myDayHtml.match(/class="bottom-navigation"/g) || []).length, 0);
assert.strictEqual((myDayHtml.match(/aria-current="page"/g) || []).length, 1);
for (const [route, label] of expectedDesktopMenuItems) {
  assert.strictEqual((desktopNavigationHtml.match(new RegExp(`data-route="${route}"`, "g")) || []).length, 1);
  assert.strictEqual((desktopNavigationHtml.match(new RegExp(label, "g")) || []).length, 1);
}

const dailyTriadHtml = myDayHtml.slice(
  myDayHtml.indexOf('<div class="daily-triad dashboard-today-guidance myday-routine-grid">'),
  myDayHtml.indexOf('<div class="myday-actions-block">'),
);
assert.strictEqual((myDayHtml.match(/class="daily-triad dashboard-today-guidance myday-routine-grid"/g) || []).length, 1);
assert.strictEqual((dailyTriadHtml.match(/<article>/g) || []).length, 3);
assert.strictEqual((dailyTriadHtml.match(/<(?:aside|nav)\b/g) || []).length, 0);

for (const viewportWidth of [1440, 1280, 1024, 768, 430, 390, 360]) {
  const responsiveMyDayContext = createBrowserLikeContext(
    "http://localhost:4173/app/meu-dia",
    { authenticated: true, viewportWidth },
  );
  responsiveMyDayContext.setState({
    route: "my-day",
    name: "Gabriel Ferreira",
    birth: "1996-06-25",
    selectedAreaId: "work-prosperity",
    reading,
    activeHistoryId: firstHistoryEntry.readingId,
    history: [cloneForTest(firstHistoryEntry)],
  });
  const responsiveHtml = responsiveMyDayContext.__getHtml();
  const expectsMobileNavigation = viewportWidth <= 900;
  assert.strictEqual(
    (responsiveHtml.match(/class="portal-sidebar"/g) || []).length,
    expectsMobileNavigation ? 0 : 1,
    `sidebar at ${viewportWidth}px`,
  );
  assert.strictEqual(
    (responsiveHtml.match(/class="bottom-navigation"/g) || []).length,
    expectsMobileNavigation ? 1 : 0,
    `mobile navigation at ${viewportWidth}px`,
  );
  assert.strictEqual((responsiveHtml.match(/aria-current="page"/g) || []).length, 1);
  assert.strictEqual((responsiveHtml.match(/class="daily-triad dashboard-today-guidance myday-routine-grid"/g) || []).length, 1);
  assert.strictEqual((responsiveHtml.match(/FOCO DE HOJE/g) || []).length, 0);
}

const protocolDate = vm.runInContext("protocolDateKey()", myDayContext);
myDayContext.localStorage.setItem("drive-astral-protocol-progress", JSON.stringify({
  date: protocolDate,
  completed: ["morning", "day"],
}));
myDayContext.setState({ route: "my-day" });
const partialProtocolMyDayHtml = myDayContext.__getHtml();
assert.strictEqual((partialProtocolMyDayHtml.match(/FOCO DE HOJE/g) || []).length, 0);
assert.ok(partialProtocolMyDayHtml.includes("2 de 3 momentos conclu&iacute;dos"));

myDayContext.localStorage.setItem("drive-astral-protocol-progress", JSON.stringify({
  date: protocolDate,
  completed: ["morning", "day", "night"],
}));
myDayContext.setState({ route: "my-day" });
const completedProtocolMyDayHtml = myDayContext.__getHtml();
assert.strictEqual((completedProtocolMyDayHtml.match(/FOCO DE HOJE/g) || []).length, 0);
assert.ok(completedProtocolMyDayHtml.includes("3 de 3 momentos conclu&iacute;dos"));

freeDashboardContext.setState({
  route: "home",
  selectedAreaId: "love-relationships",
  upgradeModalOpen: false,
  account: {
    ...vm.runInContext("state.account", freeDashboardContext),
    planId: "free",
    accessPlans: [],
  },
});
const lockedHomeHtml = freeDashboardContext.__getHtml();
assert.ok(lockedHomeHtml.includes("1 de 7 &aacute;reas consultadas"));
assert.ok(lockedHomeHtml.includes("Dispon&iacute;vel no plano completo"));
assert.ok(lockedHomeHtml.includes("Desbloquear &aacute;rea"));
freeDashboardContext.submitAlignment("Gabriel Ferreira", "1996-06-25");
const lockedConsultState = vm.runInContext("state", freeDashboardContext);
assert.strictEqual(lockedConsultState.upgradeModalOpen, true);
assert.strictEqual(lockedConsultState.history.length, 1);
assert.ok(freeDashboardContext.__getHtml().includes("QUERO INICIAR MINHA JORNADA"));

const premiumDashboardContext = createBrowserLikeContext();
const premiumAccount = {
  ...vm.runInContext("state.account", premiumDashboardContext),
  planId: "premium",
  accessPlans: [{ plan_id: "premium", status: "active" }],
};
premiumDashboardContext.setState({
  route: "dashboard",
  account: premiumAccount,
  name: "Gabriel Ferreira",
  birth: "1996-06-25",
  selectedAreaId: "work-prosperity",
  reading,
  activeHistoryId: firstHistoryEntry.readingId,
  history: [dashboardFirstReading, cloneForTest(secondHistoryEntry)],
});
const premiumDashboardHtml = premiumDashboardContext.__getHtml();
assert.ok(premiumDashboardHtml.includes("PREMIUM</span>"));
assert.ok(!premiumDashboardHtml.includes("Conta sincronizada"));
assert.ok(premiumDashboardHtml.includes("2</strong><small>&Aacute;reas consultadas"));
assert.ok(premiumDashboardHtml.includes('data-start-area-id="energy-spirituality"'));
assert.ok(premiumDashboardHtml.includes("Consultar &aacute;rea"));
assert.ok(!premiumDashboardHtml.includes("Bloqueada pelo plano"));

const mentorDashboardContext = createBrowserLikeContext();
mentorDashboardContext.setState({
  route: "dashboard",
  account: {
    ...vm.runInContext("state.account", mentorDashboardContext),
    planId: "mentor",
    accessPlans: [{ plan_id: "mentor", status: "active" }],
  },
  reading,
});
assert.ok(mentorDashboardContext.__getHtml().includes("MENTOR</span>"));

const summaryIndex = resultHtml.indexOf("Resumo do GPS de Hoje");
const essentialIndex = resultHtml.indexOf("Sua resposta essencial");
const detailsIndex = resultHtml.indexOf("Entenda sua leitura");
const energyCycleShortcutIndex = resultHtml.indexOf("Ver Ciclo Energ&eacute;tico");
const applicationIndex = resultHtml.indexOf("Aplica&ccedil;&atilde;o na &Aacute;rea Escolhida");
const birthCoordinatesIndex = resultHtml.indexOf("Suas Coordenadas de Nascimento");
const dayCoordinatesIndex = resultHtml.indexOf("Coordenadas do Dia");
const synchronizationIndex = resultHtml.indexOf("Sua Sincroniza&ccedil;&atilde;o com Hoje");
const practiceIndex = resultHtml.indexOf("Pr&aacute;tica de Sincroniza&ccedil;&atilde;o do Dia");

assert.ok(essentialIndex < energyCycleShortcutIndex);
assert.ok(energyCycleShortcutIndex < detailsIndex);
assert.ok(detailsIndex < summaryIndex);
assert.ok(summaryIndex < applicationIndex);
assert.ok(applicationIndex < birthCoordinatesIndex);
assert.ok(birthCoordinatesIndex < dayCoordinatesIndex);
assert.ok(dayCoordinatesIndex < synchronizationIndex);
assert.ok(synchronizationIndex < practiceIndex);
assert.ok(resultHtml.includes("Como aplicar minhas coordenadas de hoje em Trabalho e Prosperidade?"));

const energyCycleContext = createBrowserLikeContext("http://localhost:4173/app/ciclo-energetico");
energyCycleContext.setState({
  route: "energy-cycle",
  name: "Gabriel Ferreira",
  birth: "1996-06-25",
  selectedAreaId: "work-prosperity",
  reading,
  history: [firstHistoryEntry, secondHistoryEntry],
});
const energyCycleHtml = energyCycleContext.__getHtml();
assert.strictEqual(vm.runInContext("state.route", energyCycleContext), "energy-cycle");
assert.ok(energyCycleHtml.includes("Ciclo Energ&eacute;tico"));
assert.strictEqual((energyCycleHtml.match(/class="portal-sidebar"/g) || []).length, 1);
assert.strictEqual((energyCycleHtml.match(/class="app-shell platform-shell/g) || []).length, 1);
assert.strictEqual((energyCycleHtml.match(/class="energy-cycle-page"/g) || []).length, 1);
assert.strictEqual((energyCycleHtml.match(/data-energy-report-document/g) || []).length, 1);
assert.strictEqual((energyCycleHtml.match(/data-report-sheet=/g) || []).length, 2);
assert.strictEqual((energyCycleHtml.match(/class="app-header"/g) || []).length, 0);
assert.strictEqual((energyCycleHtml.match(/class="energy-cycle-hero"/g) || []).length, 0);
assert.strictEqual((energyCycleHtml.match(/<h[1-6][^>]*>Ciclo Energ&eacute;tico<\/h[1-6]>/g) || []).length, 1);
assert.ok(energyCycleHtml.includes("Mapa dos 7 Chakras"));
assert.ok(energyCycleHtml.includes("Leitura simb&oacute;lica do ciclo pessoal"));
assert.ok(energyCycleHtml.includes("Protocolo Di&aacute;rio"));
assert.ok(energyCycleHtml.includes("Organiza&ccedil;&atilde;o, presen&ccedil;a e a&ccedil;&atilde;o pr&aacute;tica"));
assert.ok(energyCycleHtml.includes("Mapa dos Chakras"));
assert.ok(energyCycleHtml.includes("Protocolo vinculado"));
assert.ok(energyCycleHtml.includes("Baixar relat&oacute;rio"));
assert.ok(energyCycleHtml.includes("Resumo do seu mapa"));
assert.ok(energyCycleHtml.includes("Sequ&ecirc;ncia de observa&ccedil;&atilde;o do ciclo"));
assert.ok(energyCycleHtml.includes("Pilares do protocolo"));
assert.ok(energyCycleHtml.includes("Regras de ouro"));
assert.ok(energyCycleHtml.includes("Abrir Protocolo Completo"));
assert.ok(energyCycleHtml.includes("N&atilde;o representa diagn&oacute;stico m&eacute;dico, psicol&oacute;gico ou energ&eacute;tico individual."));
assert.ok(!energyCycleHtml.includes("Diagn&oacute;stico energ&eacute;tico pessoal"));
assert.ok(!energyCycleHtml.includes("Ordem de tratamento"));
assert.ok(!energyCycleHtml.includes("chakra cr&iacute;tico"));
assert.strictEqual((energyCycleHtml.match(/class="chakra-body-map"/g) || []).length, 1);
assert.strictEqual((energyCycleHtml.match(/data-chakra-id="/g) || []).length, 7);
assert.ok(energyCycleHtml.includes('data-chakra-id="root"'));
assert.ok(energyCycleHtml.includes("Coordenada do dia"));
assert.ok(energyCycleHtml.includes("Coordenada de nascimento"));
assert.ok(energyCycleHtml.includes("Refer\u00eancia do ciclo"));

const energyReportViewModel = vm.runInContext("EnergyReportViewModel()", energyCycleContext);
assert.strictEqual(energyReportViewModel.metadata.personalKin, 168);
assert.strictEqual(energyReportViewModel.metadata.dailyKin, 178);
assert.strictEqual(energyReportViewModel.metadata.plasma, "Silio");
assert.strictEqual(energyReportViewModel.metadata.structuralChakra, "Cora\u00e7\u00e3o / Card\u00edaco");
assert.strictEqual(energyReportViewModel.chakras.length, 7);
assert.strictEqual(energyReportViewModel.chakras.filter((chakra) => chakra.isDailyCoordinate).length, 1);
assert.strictEqual(energyReportViewModel.chakras.filter((chakra) => chakra.isBirthCoordinate).length, 1);
assert.strictEqual(energyReportViewModel.summary.observationSequence.length, 7);
assert.strictEqual(energyReportViewModel.protocol.goldenRules.length, 5);
assert.strictEqual(energyReportViewModel.versions.reportVersion, "energy-report-v1");

energyCycleContext.setState({ energyReportPage: "protocol" });
const energyProtocolHtml = energyCycleContext.__getHtml();
assert.ok(energyProtocolHtml.includes('data-report-sheet="protocol"'));
assert.ok(energyProtocolHtml.includes('id="energy-report-protocol-tab"'));
assert.ok(energyProtocolHtml.includes('aria-selected="true"'));
assert.ok(energyProtocolHtml.includes("P&aacute;gina 2 de 2"));

const noBirthChakraReading = cloneForTest(reading);
delete noBirthChakraReading.coordinates.birth.thirteen_moons.chakra;
delete noBirthChakraReading.coordinates.birth.thirteen_moons.plasma;
energyCycleContext.setState({
  energyReportPage: "map",
  reading: noBirthChakraReading,
  activeHistoryId: "",
  history: [],
});
const noBirthViewModel = vm.runInContext("EnergyReportViewModel()", energyCycleContext);
assert.strictEqual(noBirthViewModel.chakras.filter((chakra) => chakra.isBirthCoordinate).length, 0);
assert.strictEqual(noBirthViewModel.chakras.filter((chakra) => chakra.isDailyCoordinate).length, 1);

const longReportReading = cloneForTest(reading);
longReportReading.guidance.interpretation.areaTitle = "Planejamento financeiro familiar, profissional e patrimonial de longo prazo";
longReportReading.guidance.interpretation.synthesis = "Organize as prioridades atuais com clareza. Preserve os compromissos essenciais e escolha uma etapa verific&aacute;vel antes de iniciar um novo movimento.";
energyCycleContext.setState({
  reading: longReportReading,
  account: {
    ...vm.runInContext("state.account", energyCycleContext),
    name: "Nome Completo Muito Longo Para Validar a Composi&ccedil;&atilde;o Editorial do Relat&oacute;rio",
  },
});
const longReportHtml = energyCycleContext.__getHtml();
assert.ok(longReportHtml.includes("Planejamento financeiro familiar"));
assert.ok(longReportHtml.includes("Nome Completo Muito Longo"));
assert.ok(!longReportHtml.includes("text-overflow: ellipsis"));

assert.ok(styles.includes("@page"));
assert.ok(styles.includes("size: A4 portrait"));
assert.ok(styles.includes(".report-sheet:not(.is-active)"));
assert.ok(styles.includes("width: 210mm"));
assert.ok(styles.includes("min-height: 297mm"));
assert.ok(styles.includes("page-break-after: always"));
assert.ok(styles.includes("break-inside: avoid"));
assert.ok(styles.includes("print-color-adjust: exact"));
assert.ok(styles.includes("-webkit-print-color-adjust: exact"));
assert.ok(styles.includes("@media print"));
assert.ok(styles.includes("@media (max-width: 700px)"));
assert.ok(appSource.includes("window.print()"));

resultContext.setState({ route: "protocol" });
const protocolHtml = resultContext.__getHtml();
assert.ok(protocolHtml.includes("Protocolo de hoje"));
assert.ok(protocolHtml.includes("Pr&aacute;tica de agora"));
assert.ok(protocolHtml.includes("Execute o essencial"));
assert.ok(protocolHtml.includes("Rotina em tr&ecirc;s momentos"));
assert.ok(protocolHtml.includes("Um passo de cada vez"));
assert.ok(protocolHtml.includes("Manh&atilde; &middot; 5 minutos"));
assert.ok(protocolHtml.includes("Dia &middot; 3 minutos &middot; Agora"));
assert.ok(protocolHtml.includes("Noite &middot; 5 minutos"));
const protocolDayFocus = vm.runInContext("protocolMoments()[1].focus", resultContext);
assert.ok(protocolHtml.includes(resultContext.escapeHtml(protocolDayFocus)));
assert.ok(protocolHtml.includes("Princ&iacute;pios do protocolo"));
assert.strictEqual((protocolHtml.match(/data-complete-protocol="/g) || []).length, 3);
assert.ok(!protocolHtml.includes("Pilares do Protocolo"));

resultContext.toggleProtocolMoment("day");
const completedProtocolHtml = resultContext.__getHtml();
const protocolProgress = JSON.parse(resultContext.localStorage.getItem("drive-astral-protocol-progress"));
assert.deepStrictEqual(protocolProgress.completed, ["day"]);
assert.ok(completedProtocolHtml.includes("1 de 3 momentos conclu&iacute;dos"));
assert.ok(completedProtocolHtml.includes("Pr&aacute;tica conclu&iacute;da"));

resultContext.setState({
  route: "journey",
  journeySelectedDay: 0,
  account: {
    ...vm.runInContext("state.account", resultContext),
    planId: "premium",
    accessPlans: [{ plan_id: "premium", status: "active" }],
  },
});
const journeyHtml = resultContext.__getHtml();
const journeyPlan = vm.runInContext("journeyPlan()", resultContext);
assert.strictEqual(journeyPlan.length, 30);
assert.deepStrictEqual(
  [...new Set(journeyPlan.map((day) => day.phaseId))],
  ["observe", "organize", "act", "sustain", "integrate"],
);
assert.ok(journeyHtml.includes("Jornada de 30 dias"));
assert.ok(journeyHtml.includes("Dia 1 de 30 &middot; Hoje"));
assert.ok(journeyHtml.includes("Frase do dia"));
assert.ok(journeyHtml.includes("A&ccedil;&atilde;o do dia"));
assert.ok(journeyHtml.includes("Seu ciclo atual"));
assert.ok(journeyHtml.includes("Ver os 30 dias"));
assert.ok(journeyHtml.includes(resultContext.escapeHtml(resultContext.decodeStoredText(journeyPlan[0].action))));
assert.ok((journeyHtml.match(/data-journey-day="/g) || []).length >= 30);
assert.strictEqual((journeyHtml.match(/data-complete-journey-day="/g) || []).length, 1);
assert.ok(journeyHtml.includes("Conclua a etapa dispon&iacute;vel para abrir a pr&oacute;xima."));
assert.ok(/data-journey-day="2"[\s\S]*?disabled/.test(journeyHtml));

resultContext.toggleJourneyDay(8);
const lockedJourneyProgress = JSON.parse(resultContext.localStorage.getItem("drive-astral-journey-progress"));
assert.deepStrictEqual(lockedJourneyProgress.completedDays, []);
assert.ok(resultContext.__getHtml().includes("Dia 1 de 30 &middot; Hoje"));

resultContext.toggleJourneyDay(1);
const completedJourneyHtml = resultContext.__getHtml();
const journeyProgress = JSON.parse(resultContext.localStorage.getItem("drive-astral-journey-progress"));
assert.deepStrictEqual(journeyProgress.completedDays, [1]);
assert.ok(completedJourneyHtml.includes("1 de 30"));
assert.ok(completedJourneyHtml.includes("Dia conclu&iacute;do"));

resultContext.setState({ journeySelectedDay: 8 });
const secondWeekJourneyHtml = resultContext.__getHtml();
assert.ok(secondWeekJourneyHtml.includes("Dia 1 de 30 &middot; Hoje"));
assert.ok(!secondWeekJourneyHtml.includes("Dia 8 de 30"));
assert.ok(!secondWeekJourneyHtml.includes("Organizar: Ordem para sustentar o caminho"));

resultContext.setState({ adminRole: "owner", journeySelectedDay: 8 });
const adminJourneyHtml = resultContext.__getHtml();
assert.ok(adminJourneyHtml.includes("Dia 8 de 30"));
assert.ok(adminJourneyHtml.includes("Organizar: Ordem para sustentar o caminho"));
assert.ok(adminJourneyHtml.includes("Perfil admin: todos os dias est&atilde;o liberados"));
assert.ok(!adminJourneyHtml.includes('aria-disabled="true" disabled'));

const freeJourneyPlanContext = createBrowserLikeContext();
seedConsultationBase(freeJourneyPlanContext, { planId: "free", primaryAreaId: "general" });
freeJourneyPlanContext.setState({ route: "journey", journeySelectedDay: 1 });
const freeJourneyPlanHtml = freeJourneyPlanContext.__getHtml();
assert.ok(freeJourneyPlanHtml.includes("Plano atual"));
assert.ok(freeJourneyPlanHtml.includes("Free"));
assert.ok(freeJourneyPlanHtml.includes("Etapa bloqueada"));
assert.ok(freeJourneyPlanHtml.includes("Desbloqueie sua jornada completa"));
assert.ok(freeJourneyPlanHtml.includes("Dispon&iacute;vel no plano completo"));
assert.strictEqual((freeJourneyPlanHtml.match(/data-complete-journey-day="/g) || []).length, 0);
assert.ok(/data-journey-day="1"[\s\S]*?disabled/.test(freeJourneyPlanHtml));

const essentialJourneyContext = createBrowserLikeContext();
seedConsultationBase(essentialJourneyContext, { planId: "essential", primaryAreaId: "general" });
const essentialJourneyContextKey = vm.runInContext("journeyContextKey()", essentialJourneyContext);
essentialJourneyContext.localStorage.setItem("drive-astral-journey-progress", JSON.stringify({
  contextKey: essentialJourneyContextKey,
  startDate: "2026-06-03",
  completedDays: [],
}));
essentialJourneyContext.setState({ route: "journey", journeySelectedDay: 1 });
const essentialJourneyHtml = essentialJourneyContext.__getHtml();
assert.ok(essentialJourneyHtml.includes("Essencial"));
assert.ok(essentialJourneyHtml.includes("0 de 3 liberados"));
assert.ok(essentialJourneyHtml.includes("upgrade para 30"));
assert.ok(/data-journey-day="2"[\s\S]*?disabled/.test(essentialJourneyHtml));
assert.ok(/data-journey-day="4"[\s\S]*?data-journey-lock="plan"[\s\S]*?disabled/.test(essentialJourneyHtml));
essentialJourneyContext.toggleJourneyDay(1);
const essentialDayTwoHtml = essentialJourneyContext.__getHtml();
assert.ok(/class="journey-day-button is-available[\s\S]*?data-journey-day="2"/.test(essentialDayTwoHtml));
essentialJourneyContext.toggleJourneyDay(4);
const essentialLockedState = vm.runInContext("state", essentialJourneyContext);
const essentialLockedProgress = JSON.parse(essentialJourneyContext.localStorage.getItem("drive-astral-journey-progress"));
assert.strictEqual(essentialLockedState.upgradeModalOpen, true);
assert.deepStrictEqual(essentialLockedProgress.completedDays, [1]);

const directJourneyContext = createBrowserLikeContext("http://localhost:4173/app/jornada");
assert.strictEqual(vm.runInContext("state.route", directJourneyContext), "journey");
assert.ok(directJourneyContext.__getHtml().includes("Jornada de 30 dias"));

const invalidDateContext = createBrowserLikeContext();
invalidDateContext.setState({
  route: "home",
  selectedAreaId: "general",
  account: {
    ...vm.runInContext("state.account", invalidDateContext),
    birth: "2026-02-30",
  },
});
invalidDateContext.submitAlignment("Data Invalida", "2026-02-30");
const invalidDateHtml = invalidDateContext.__getHtml();
const invalidDateState = vm.runInContext("state", invalidDateContext);
assert.ok(invalidDateHtml.includes("N&atilde;o foi poss&iacute;vel localizar sua base pessoal."));
assert.ok(!invalidDateHtml.includes("0.0 Hunab Ku"));
assert.strictEqual(invalidDateState.route, "home");
assert.strictEqual(invalidDateState.reading, null);
assert.strictEqual(invalidDateState.history.length, 0);
assert.strictEqual(invalidDateContext.__getSavedState(), null);

const leapDayContext = createBrowserLikeContext();
leapDayContext.setState({
  route: "home",
  selectedAreaId: "general",
  history: [],
  account: {
    ...vm.runInContext("state.account", leapDayContext),
    birth: "2000-02-29",
  },
});
leapDayContext.submitAlignment("Data Especial", "2000-02-29");
const leapDayHtml = leapDayContext.__getHtml();
const leapDayState = vm.runInContext("state", leapDayContext);
assert.ok(leapDayHtml.includes("N&atilde;o foi poss&iacute;vel localizar sua base pessoal."));
assert.strictEqual(leapDayState.route, "home");
assert.strictEqual(leapDayState.reading, null);
assert.strictEqual(leapDayState.history.length, 0);
assert.strictEqual(leapDayContext.__getSavedState(), null);

const regularSubmissionContext = createBrowserLikeContext();
const regularAccount = vm.runInContext("state.account", regularSubmissionContext);
regularSubmissionContext.setState({
  route: "home",
  reading: regularSubmissionContext.calculateReading("1982-12-10", "general"),
  selectedAreaId: "general",
  history: [],
  account: {
    ...regularAccount,
    id: "22222222-2222-4222-8222-222222222222",
    name: "Data Regular",
    birth: "1982-12-10",
    primaryAreaId: "general",
  },
});
regularSubmissionContext.submitAlignment("Nome adulterado", "2001-01-01");
const regularSubmissionState = vm.runInContext("state", regularSubmissionContext);
assert.strictEqual(regularSubmissionState.route, "chakras");
assert.strictEqual(regularSubmissionState.reading.personal_map.kin.value, 166);
assert.strictEqual(regularSubmissionState.history.length, 1);
assert.strictEqual(regularSubmissionState.history[0].inputSnapshot.name, "Data Regular");
assert.strictEqual(regularSubmissionState.history[0].inputSnapshot.birthDate, "1982-12-10");
assert.ok(regularSubmissionContext.__getSavedState());

const sameColorContext = createBrowserLikeContext();
sameColorContext.setState({
  route: "chakras",
  name: "Gabriel Ferreira",
  birth: "1996-06-23",
  selectedAreaId: "general",
  reading: sameColorContext.calculateReading("1996-06-23", "geral"),
});
const sameColorHtml = sameColorContext.__getHtml();
assert.ok(sameColorHtml.includes("Suas Coordenadas de Nascimento"));
assert.ok(sameColorHtml.includes("Kin de navega&ccedil;&atilde;o"));
assert.ok(sameColorHtml.includes("<strong>84</strong>"));
assert.ok(!sameColorHtml.includes("O que esta rela&ccedil;&atilde;o representa"));

const savedWithArea = resultContext.__getSavedState();
assert.strictEqual(savedWithArea.selectedAreaId, "work-prosperity");
assert.strictEqual(savedWithArea.storageSchemaVersion, 2);
assert.strictEqual(savedWithArea.name, "Gabriel Ferreira");
assert.strictEqual(savedWithArea.birth, "1996-06-25");
assert.strictEqual(savedWithArea.history[0].areaTitle, "Trabalho e Prosperidade");
assert.strictEqual(savedWithArea.history[0].readingId, firstHistoryEntry.readingId);
assert.strictEqual(savedWithArea.history[0].calculationSnapshot.dayKin.kin.value, 178);
assert.strictEqual(savedWithArea.history[0].interpretationSnapshot.synthesis, firstHistoryEntry.interpretationSnapshot.synthesis);
assert.strictEqual(savedWithArea.history[0].interpretationSnapshot.contentVersion, "area-knowledge-v0.3");
assert.ok(!Object.hasOwn(savedWithArea, "consent"));
assert.ok(!Object.hasOwn(savedWithArea, "intention"));
assert.ok(savedWithArea.reading);

const backupPayload = resultContext.createBackupPayload();
assert.strictEqual(backupPayload.formatVersion, "drive-astral-backup-v2");
assert.strictEqual(backupPayload.appVersion, "web-platform-v1");
assert.strictEqual(backupPayload.data.storageSchemaVersion, 2);
assert.strictEqual(backupPayload.data.history.length, 2);
const parsedBackup = resultContext.parseBackupPayload(JSON.stringify(backupPayload)).state;
assert.strictEqual(parsedBackup.storageSchemaVersion, 2);
assert.strictEqual(parsedBackup.history[0].readingId, firstHistoryEntry.readingId);
const migratedLegacyState = resultContext.normalizePersistedState({
  name: "Estado antigo",
  birth: "1990-01-01",
  selectedAreaId: "general",
  reading: null,
  history: [],
});
assert.strictEqual(migratedLegacyState.storageSchemaVersion, 2);
assert.strictEqual(migratedLegacyState.name, "Estado antigo");

resultContext.setState({ route: "history" });
const historyHtml = resultContext.__getHtml();
assert.ok(historyHtml.includes("Visualizar novamente"));
assert.ok(historyHtml.includes("Mais recente"));
assert.strictEqual((historyHtml.match(/Mais recente/g) || []).length, 1);
assert.ok(!historyHtml.includes("Ativo"));

const savedBeforeNavigation = JSON.stringify(resultContext.__getSavedState());
resultContext.setState({ route: "profile" });
resultContext.setState({ route: "history" });
const preservedHistoryEntry = cloneForTest(savedWithArea.history[0]);
preservedHistoryEntry.interpretationSnapshot.synthesis = "SINTese historica preservada";
preservedHistoryEntry.interpretationSnapshot.applicationSummary = "SINTese historica preservada";
preservedHistoryEntry.interpretationSnapshot.reflectionQuestion = "Pergunta historica preservada?";
preservedHistoryEntry.interpretationSnapshot.suggestedPractice = "Pratica historica preservada.";
preservedHistoryEntry.interpretationSnapshot.dailyPractice = "Pratica historica preservada.";
const preservedReading = resultContext.readingForHistoryEntry(preservedHistoryEntry);
resultContext.setState({ route: "chakras", reading: preservedReading });
const preservedHistoryHtml = resultContext.__getHtml();
assert.ok(preservedHistoryHtml.includes("SINTese historica preservada"));
assert.ok(preservedHistoryHtml.includes("Pergunta historica preservada?"));
assert.ok(preservedHistoryHtml.includes("Pratica historica preservada."));
assert.strictEqual(JSON.stringify(resultContext.__getSavedState()), savedBeforeNavigation);

const manualFlowContext = createBrowserLikeContext();
const manualReading = manualFlowContext.calculateReading("1996-06-23", "geral");
const manualEntry = manualFlowContext.createReadingHistoryEntry({
  name: "Leitura Manual",
  birth: "1996-06-23",
  area: { id: "general", title: "Vis&atilde;o Geral" },
  reading: manualReading,
});
manualFlowContext.localStorage.removeItem(STORAGE_KEY);
manualFlowContext.setState({
  route: "chakras",
  name: "Leitura Manual",
  birth: "1996-06-23",
  selectedAreaId: "general",
  reading: manualReading,
  activeHistoryId: manualEntry.readingId,
  history: [manualEntry],
}, { persist: true });
const manualSnapshot = JSON.stringify(manualFlowContext.__getSavedState());
const manualSaved = manualFlowContext.__getSavedState();
assert.strictEqual(manualSaved.history.length, 1);
assert.strictEqual(manualSaved.history[0].calculationSnapshot.dayKin.kin.value, 178);
assert.strictEqual(manualSaved.history[0].interpretationSnapshot.synthesis, manualEntry.interpretationSnapshot.synthesis);
assert.strictEqual(manualSaved.history[0].inputSnapshot.selectedAreaId, "general");
manualFlowContext.setState({ route: "chakra-detail", selectedChakraId: "root" }, { updateUrl: true });
manualFlowContext.setState({ route: "chakras", reading: manualEntry.readingSnapshot }, { updateUrl: true });
manualFlowContext.setState({ route: "history" }, { updateUrl: true });
manualFlowContext.setState({
  route: "chakras",
  activeHistoryId: manualEntry.readingId,
  reading: manualEntry.readingSnapshot,
  selectedAreaId: manualEntry.inputSnapshot.selectedAreaId,
}, { updateUrl: true });
manualFlowContext.setState({ route: "home" }, { updateUrl: true });
manualFlowContext.setState({ route: "protocol" }, { updateUrl: true });
manualFlowContext.setState({ route: "history" }, { updateUrl: true });
manualFlowContext.setState({ route: "profile" }, { updateUrl: true });
assert.strictEqual(JSON.stringify(manualFlowContext.__getSavedState()), manualSnapshot);
assert.strictEqual(manualFlowContext.__getSavedState().history.length, 1);

const unsavedContext = createBrowserLikeContext();
unsavedContext.setState({
  name: "Pessoa Teste",
  birth: "1990-01-01",
  selectedAreaId: "general",
  reading: unsavedContext.calculateReading("1990-01-01", "geral"),
  history: [{ summary: "privado" }],
});

assert.strictEqual(unsavedContext.__getSavedState(), null);

const legacyContext = createBrowserLikeContext();
legacyContext.setState({
  route: "history",
  history: [
    {
      date: "05/06/2026",
      theme: "Finan&ccedil;as",
      summary: "Potencial: Equalizar morte com manifesta&ccedil;&atilde;o e produ&ccedil;&atilde;o.",
      kin: 166,
      signature: "Branco Planetario Enlacador de Mundos",
      status: "Ativo",
    },
  ],
});
const legacyHtml = legacyContext.__getHtml();
assert.ok(legacyHtml.includes("Leitura criada em vers&atilde;o anterior"));
assert.ok(legacyHtml.includes("Potencial: Equalizar morte com manifesta\u00e7\u00e3o e produ\u00e7\u00e3o."));
assert.ok(!legacyHtml.includes("Ativo"));

resultContext.setState({ route: "profile" });
const platformProfileHtml = resultContext.__getHtml();
assert.ok(platformProfileHtml.includes("Meu Perfil"));
assert.ok(platformProfileHtml.includes("Resumo do perfil"));
assert.ok(platformProfileHtml.includes("Dados pessoais"));
assert.ok(platformProfileHtml.includes("Plano e acesso"));
assert.ok(platformProfileHtml.includes("Seguran&ccedil;a da conta"));
assert.ok(platformProfileHtml.includes("Prefer&ecirc;ncias reais"));
assert.ok(platformProfileHtml.includes("Privacidade e dados"));
assert.ok(platformProfileHtml.includes("Zona de risco"));
assert.ok(platformProfileHtml.includes("Gerenciar assinatura"));
assert.ok(platformProfileHtml.includes("Instalar no dispositivo"));
assert.ok(platformProfileHtml.includes("Baixar backup"));
assert.ok(platformProfileHtml.includes("Importar backup"));
assert.ok(platformProfileHtml.includes("Privacidade e dados"));
assert.ok(platformProfileHtml.includes('href="/privacy.html"'));
assert.ok(platformProfileHtml.includes("Termos de uso"));
assert.ok(platformProfileHtml.includes('href="/terms.html"'));
assert.ok(platformProfileHtml.includes("Excluir meus dados deste dispositivo"));
assert.ok(platformProfileHtml.includes("Sair da conta"));
assert.ok(platformProfileHtml.indexOf("Resumo do perfil") < platformProfileHtml.indexOf("Dados pessoais"));
assert.ok(platformProfileHtml.indexOf("Dados pessoais") < platformProfileHtml.indexOf("Plano e acesso"));
assert.ok(platformProfileHtml.indexOf("Plano e acesso") < platformProfileHtml.indexOf("Seguran&ccedil;a da conta"));
assert.ok(platformProfileHtml.indexOf("Seguran&ccedil;a da conta") < platformProfileHtml.indexOf("Prefer&ecirc;ncias reais"));
assert.ok(platformProfileHtml.indexOf("Prefer&ecirc;ncias reais") < platformProfileHtml.indexOf("Privacidade e dados"));
assert.ok(platformProfileHtml.indexOf("Privacidade e dados") < platformProfileHtml.indexOf("Zona de risco"));
assert.ok(platformProfileHtml.indexOf("Zona de risco") < platformProfileHtml.indexOf("Sair da conta"));

const chakraExpectations = [
  ["root", "1", "Raiz", "Muladhara", "Seli"],
  ["sacral", "2", "Sacral", "Svadhisthana", "Kali"],
  ["solarPlexus", "3", "Plexo Solar", "Manipura", "Limi"],
  ["heart", "4", "Cardíaco", "Anahata", "Silio"],
  ["throat", "5", "Laríngeo", "Vishuddha", "Alfa"],
  ["thirdEye", "6", "Terceiro Olho", "Ajna", "Gama"],
  ["crown", "7", "Coronário", "Sahasrara", "Dali"],
];

for (const [id, number, name, traditional, plasmaName] of chakraExpectations) {
  const chakraContext = createBrowserLikeContext(`http://localhost:4173/chakras/${id}?area=work-prosperity`);
  const chakraHtml = chakraContext.__getHtml();
  assert.ok(chakraHtml.includes(`Chakra ${number}`), id);
  assert.ok(chakraHtml.includes(name), id);
  assert.ok(chakraHtml.includes(traditional), id);
  assert.ok(chakraHtml.includes("Ciclo Energ&eacute;tico"), id);
  assert.ok(chakraHtml.includes("Voltar ao Mapa dos Chakras"), id);
  assert.ok(chakraHtml.includes("Situa&ccedil;&atilde;o nesta leitura"), id);
  assert.ok(chakraHtml.includes("Resumo r&aacute;pido"), id);
  assert.ok(chakraHtml.includes("Como este chakra aparece no ciclo"), id);
  assert.ok(chakraHtml.includes("Como ele se relaciona com sua leitura"), id);
  assert.ok(chakraHtml.includes("O que observar"), id);
  assert.ok(chakraHtml.includes("Pr&aacute;tica sugerida"), id);
  assert.ok(chakraHtml.includes("Abrir Protocolo Di&aacute;rio"), id);
  assert.ok(chakraHtml.includes("Entenda a metodologia"), id);
  assert.ok(chakraHtml.includes(`Plasma ${plasmaName}`), id);
  assert.ok(chakraHtml.includes("Refer\u00eancia do ciclo"), id);
  assert.ok(chakraHtml.includes("n&atilde;o indica estado individual"), id);
  assert.ok(chakraHtml.includes("Trabalho e Prosperidade"), id);
  assert.ok(chakraHtml.includes('data-route="energy-cycle"'), id);
  assert.ok(chakraHtml.includes('data-route="protocol"'), id);
  assert.ok(chakraHtml.includes("Navega&ccedil;&atilde;o entre chakras"), id);
  assert.ok(chakraHtml.includes("A metodologia organiza correspond&ecirc;ncias simb&oacute;licas"), id);
  assert.ok(chakraHtml.includes("Chakra anterior"), id);
  assert.ok(chakraHtml.includes("Próximo chakra"), id);
  assert.ok(!chakraHtml.includes("O que este chakra representa"), id);
  assert.ok(!chakraHtml.includes("Perguntas para reflex&atilde;o"), id);
  assert.ok(!chakraHtml.includes("Adicionar ao meu protocolo"), id);
  assert.ok(!chakraHtml.includes("Sinais / sintomas"), id);
  assert.ok(!chakraHtml.includes("Corre&ccedil;&atilde;o / pr&aacute;ticas"), id);
  assert.ok(!chakraHtml.includes("Cr&iacute;tico"), id);
  assert.ok(!chakraHtml.includes("Protegido"), id);
  assert.ok(!chakraHtml.includes("Drenado"), id);
  assert.ok(!chakraHtml.includes("Ferido"), id);
  assert.ok(!chakraHtml.includes("Hiperativo"), id);
  const headerMatch = chakraHtml.match(/<header class="chakra-detail-header">[\s\S]*?<\/header>/);
  assert.ok(headerMatch, id);
  assert.ok(!headerMatch[0].includes("#"), id);
}

const calculatedChakraContext = createBrowserLikeContext();
calculatedChakraContext.setState({
  route: "chakra-detail",
  selectedChakraId: "heart",
  selectedAreaId: "work-prosperity",
  reading,
});
const calculatedChakraHtml = calculatedChakraContext.__getHtml();
assert.ok(calculatedChakraHtml.includes("Coordenada do dia"));
assert.ok(calculatedChakraHtml.includes("Silio / Cora\u00e7\u00e3o / Card\u00edaco"));
assert.ok(calculatedChakraHtml.includes("Levante informa\u00e7\u00f5es, n\u00fameros e prioridades antes de decidir"));
assert.ok(!calculatedChakraHtml.includes("Ferido"));

const directGeneralContext = createBrowserLikeContext("http://localhost:4173/chakras/root");
const directGeneralHtml = directGeneralContext.__getHtml();
assert.ok(directGeneralHtml.includes("&Aacute;rea consultada: Vis\u00e3o Geral"));
assert.ok(directGeneralHtml.includes("Refer\u00eancia do ciclo"));
assert.ok(!directGeneralHtml.includes("Trabalho e Prosperidade"));

const timelineContext = createBrowserLikeContext();
timelineContext.setState({
  route: "history",
  historySection: "timeline",
  name: "Pessoa da Linha do Tempo",
  birth: "1996-06-25",
  reading: timelineContext.calculateReading("1996-06-25", "geral"),
  timelineEvents: [],
});
const emptyTimelineHtml = timelineContext.__getHtml();
assert.ok(emptyTimelineHtml.includes("Hist&oacute;rico de Leituras"));
assert.ok(emptyTimelineHtml.includes("Linha do Tempo C&oacute;smica"));
assert.ok(emptyTimelineHtml.includes("Adicionar evento"));
assert.ok(emptyTimelineHtml.includes("Sua linha do tempo come&ccedil;a aqui"));

const savedEvent = timelineContext.submitTimelineEvent({
  title: "Inicio do meu negocio",
  eventDate: "2024-03-15",
  category: "Trabalho e Prosperidade",
  note: "",
});
const timelineState = vm.runInContext("state", timelineContext);
const timelineSavedState = timelineContext.__getSavedState();
assert.ok(savedEvent);
assert.strictEqual(timelineState.timelineEvents.length, 1);
assert.strictEqual(timelineSavedState.timelineEvents.length, 1);
assert.strictEqual(savedEvent.schemaVersion, "cosmic-timeline-event-v1");
assert.strictEqual(savedEvent.coordinatesSnapshot.kin, 146);
assert.strictEqual(savedEvent.coordinatesSnapshot.moon, "Lua Solar");
assert.strictEqual(savedEvent.coordinatesSnapshot.moonDay, 9);
assert.strictEqual(savedEvent.coordinatesSnapshot.chromaticWeek, "Semana Branca");
assert.strictEqual(savedEvent.coordinatesSnapshot.plasma, "Seli");
assert.strictEqual(savedEvent.coordinatesSnapshot.chakra, "Raiz");
assert.strictEqual(savedEvent.coordinatesSnapshot.wavePosition, 3);
assert.strictEqual(savedEvent.relationToPersonalKin.personalKin, 168);
assert.strictEqual(savedEvent.relationToPersonalKin.eventKin, 146);
assert.strictEqual(savedEvent.engineVersion, "0.4.0");
assert.strictEqual(savedEvent.thirteenMoonsEngineVersion, "0.1.0");

const timelineListHtml = timelineContext.__getHtml();
assert.ok(timelineListHtml.includes("Inicio do meu negocio"));
assert.ok(timelineListHtml.includes("Kin 146"));
assert.ok(timelineListHtml.includes("Ver coordenadas"));
assert.ok(!timelineListHtml.includes("Padr&otilde;es observados"));

const savedSnapshotBeforeDetail = JSON.stringify(timelineSavedState.timelineEvents[0]);
timelineContext.DriveAstralSincronario.calculateKinForDate = () => {
  throw new Error("Old timeline events must not be recalculated");
};
timelineContext.setState({
  route: "timeline-event",
  historySection: "timeline",
  activeTimelineEventId: savedEvent.eventId,
});
const timelineDetailHtml = timelineContext.__getHtml();
assert.ok(timelineDetailHtml.includes("1. Coordenadas do Evento"));
assert.ok(timelineDetailHtml.includes("2. Rela&ccedil;&atilde;o com Meu Kin"));
assert.ok(timelineDetailHtml.includes("3. Rela&ccedil;&atilde;o com Minha Linha do Tempo"));
assert.ok(timelineDetailHtml.includes("4. Reflex&atilde;o sobre o Padr&atilde;o"));
assert.ok(timelineDetailHtml.includes("Branco Eletrico Enlacador de Mundos"));
assert.ok(timelineDetailHtml.includes("Nenhuma coordenada foi recalculada"));
assert.ok(timelineDetailHtml.includes("n&atilde;o &eacute; uma conclus&atilde;o definitiva"));
assert.strictEqual(JSON.stringify(timelineContext.__getSavedState().timelineEvents[0]), savedSnapshotBeforeDetail);

const invalidTimelineContext = createBrowserLikeContext();
invalidTimelineContext.setState({ route: "history", historySection: "timeline" });
invalidTimelineContext.submitTimelineEvent({
  title: "Data invalida",
  eventDate: "2026-02-30",
  category: "Outro",
  note: "",
});
const invalidTimelineState = vm.runInContext("state", invalidTimelineContext);
assert.strictEqual(invalidTimelineState.timelineEvents.length, 0);
assert.ok(invalidTimelineContext.__getHtml().includes("Informe uma data v&aacute;lida."));
assert.strictEqual(invalidTimelineContext.__getSavedState(), null);

const leapTimelineContext = createBrowserLikeContext();
leapTimelineContext.setState({ route: "history", historySection: "timeline" });
leapTimelineContext.submitTimelineEvent({
  title: "Data especial",
  eventDate: "2024-02-29",
  category: "Outro",
  note: "",
});
const leapTimelineState = vm.runInContext("state", leapTimelineContext);
assert.strictEqual(leapTimelineState.timelineEvents.length, 0);
assert.ok(leapTimelineContext.__getHtml().includes("29 de fevereiro possui regra especial"));
assert.strictEqual(leapTimelineContext.__getSavedState(), null);

const patternTimelineContext = createBrowserLikeContext();
patternTimelineContext.setState({
  route: "history",
  historySection: "timeline",
  birth: "1996-06-25",
  reading: patternTimelineContext.calculateReading("1996-06-25", "geral"),
});
for (const [title, eventDate] of [
  ["Marco um", "2024-03-15"],
  ["Marco dois", "2024-03-16"],
  ["Marco tres", "2024-05-10"],
]) {
  patternTimelineContext.submitTimelineEvent({
    title,
    eventDate,
    category: "Outro",
    note: "",
  });
}
const patternTimelineHtml = patternTimelineContext.__getHtml();
const patternTimelineState = vm.runInContext("state", patternTimelineContext);
assert.strictEqual(patternTimelineState.timelineEvents.length, 3);
assert.ok(patternTimelineHtml.includes("Padr&otilde;es observados"));
assert.ok(patternTimelineHtml.includes("3 dos seus eventos ocorreram na Semana Branca."));
assert.ok(patternTimelineHtml.includes("N&atilde;o s&atilde;o previs&atilde;o nem conclus&atilde;o definitiva."));
const eventIdsBeforeNavigation = patternTimelineState.timelineEvents.map((event) => event.eventId).join(",");
patternTimelineContext.setState({ route: "profile" });
patternTimelineContext.setState({ route: "history", historySection: "timeline" });
patternTimelineContext.setState({ route: "home" });
patternTimelineContext.setState({ route: "history", historySection: "timeline" });
const eventIdsAfterNavigation = vm.runInContext("state", patternTimelineContext)
  .timelineEvents.map((event) => event.eventId).join(",");
assert.strictEqual(eventIdsAfterNavigation, eventIdsBeforeNavigation);
assert.strictEqual(vm.runInContext("state", patternTimelineContext).timelineEvents.length, 3);

assert.ok(styles.includes(".timeline-event-card"));
assert.ok(styles.includes(".timeline-coordinate-grid"));
assert.ok(appSource.includes("timelineEvents"));
assert.ok(appSource.includes("Nenhuma coordenada foi recalculada"));

(async () => {
  const networkFailureContext = createBrowserLikeContext(
    "http://localhost:4173/app/consulta",
    {
      authenticated: true,
      supabaseMode: true,
      saveReadingError: true,
    },
  );
  seedConsultationBase(networkFailureContext, {
    planId: "premium",
    selectedAreaId: "purpose",
  });
  await networkFailureContext.submitConsultation("purpose");
  const failedNetworkState = vm.runInContext("state", networkFailureContext);
  assert.strictEqual(failedNetworkState.route, "home");
  assert.strictEqual(failedNetworkState.history.length, 0);
  assert.strictEqual(failedNetworkState.consultationStatus, "idle");
  assert.strictEqual(failedNetworkState.noticeKind, "processing_failed");
  assert.ok(failedNetworkState.notice.includes("criar sua leitura agora"));

  const cloudSourceContext = createBrowserLikeContext();
  const cloudReading = cloudSourceContext.calculateReading("1990-01-01", "purpose");
  const cloudEntry = cloudSourceContext.createReadingHistoryEntry({
    name: "Pessoa Teste",
    birth: "1990-01-01",
    area: { id: "purpose", title: "Prop&oacute;sito" },
    reading: cloudReading,
    readingType: "consultation",
  });
  const otherDeviceContext = createBrowserLikeContext(
    "http://localhost:4173/app/consulta",
    {
      authenticated: true,
      supabaseMode: true,
      cloudExisting: cloneForTest(cloudEntry),
    },
  );
  seedConsultationBase(otherDeviceContext, {
    planId: "premium",
    selectedAreaId: "purpose",
  });
  await otherDeviceContext.submitConsultation("purpose");
  const otherDeviceState = vm.runInContext("state", otherDeviceContext);
  assert.strictEqual(otherDeviceState.route, "chakras");
  assert.strictEqual(otherDeviceState.history.length, 1);
  assert.strictEqual(otherDeviceState.activeHistoryId, cloudEntry.readingId);
  assert.ok(otherDeviceState.notice.includes("j&aacute; possui uma leitura"));

  console.log("app-render tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
