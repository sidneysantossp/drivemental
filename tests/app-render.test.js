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
assert.ok(landingHtml.includes("Seu mapa pessoal para entender ciclos"));
assert.ok(landingHtml.includes("Criar meu mapa gr&aacute;tis"));
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
assert.ok(styles.includes(".admin-field input"));

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

assert.ok(homeHtml.includes("Onde voc&ecirc; deseja aplicar sua leitura de hoje?"));
assert.ok(homeHtml.includes("A escolha contextualiza a pr&aacute;tica, sem alterar os c&aacute;lculos"));
assert.ok(homeHtml.includes("area-carousel"));
assert.ok(homeHtml.includes('role="radiogroup"'));
assert.ok(homeHtml.includes('role="radio"'));
assert.ok(homeHtml.includes("Deslize para ver mais &aacute;reas"));
assert.ok(homeHtml.includes('data-area-id="work-prosperity"'));
assert.strictEqual((homeHtml.match(/data-area-id="/g) || []).length, 7);
for (const areaId of areaIds) {
  assert.ok(homeHtml.includes(`data-area-id="${areaId}"`), areaId);
}
assert.ok(!homeHtml.includes("area-grid"));
assert.ok(!homeHtml.includes("theme-grid"));
assert.ok(homeHtml.includes('type="submit" disabled'));
assert.ok(!homeHtml.includes("Inten&ccedil;&atilde;o da Consulta"));
assert.ok(!homeHtml.includes("Salvar nome"));
assert.ok(homeHtml.includes("Mapa Energ&eacute;tico Visual"));
assert.ok(styles.includes(".area-carousel"));
assert.ok(styles.includes("overflow-x: auto"));
assert.ok(styles.includes("scroll-snap-type: x mandatory"));
assert.ok(styles.includes("scroll-snap-align: start"));
assert.ok(styles.includes("scrollbar-width: none"));
assert.ok(styles.includes("height: 102px"));
assert.ok(styles.includes("flex: 0 0 clamp(150px, 42vw, 176px)"));
assert.ok(appSource.includes("carousel.addEventListener(\"wheel\""));
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
assert.ok(appSource.includes('window.addEventListener("resize", updateBottomNavigationOffset)'));

const selectionContext = createBrowserLikeContext();
for (const areaId of areaIds) {
  selectionContext.setState({ route: "home", selectedAreaId: areaId });
  const selectedHtml = selectionContext.__getHtml();
  assert.strictEqual((selectedHtml.match(/is-selected/g) || []).length, 1, areaId);
  assert.strictEqual((selectedHtml.match(/aria-checked="true"/g) || []).length, 1, areaId);
  assert.ok(selectedHtml.includes(`data-area-id="${areaId}"`), areaId);
  assert.ok(!selectedHtml.includes('type="submit" disabled'));
}

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
assert.ok(resultHtml.includes("Dire&ccedil;&atilde;o de hoje"));
assert.ok(resultHtml.includes("Sua resposta essencial"));
assert.ok(resultHtml.includes("Organize antes de expandir."));
assert.ok(resultHtml.includes("Frase de alinhamento"));
assert.ok(resultHtml.includes("A&ccedil;&atilde;o de hoje"));
assert.ok(resultHtml.includes("Pergunta para confirmar"));
assert.ok(resultHtml.includes("Abrir protocolo di&aacute;rio"));
assert.ok(resultHtml.includes("Entenda sua leitura"));
assert.ok(resultHtml.includes("Veja Kins, coordenadas e o ciclo dos chakras."));
assert.ok(resultHtml.includes("Resumo do GPS de Hoje"));
assert.ok(resultHtml.includes("Suas Coordenadas de Nascimento"));
assert.ok(resultHtml.includes("Coordenadas do Dia"));
assert.ok(resultHtml.includes("Sua Sincroniza&ccedil;&atilde;o com Hoje"));
assert.ok(resultHtml.includes("Aplica&ccedil;&atilde;o na &Aacute;rea Escolhida"));
assert.ok(resultHtml.includes("Pr&aacute;tica de Sincroniza&ccedil;&atilde;o do Dia"));
assert.ok(!resultHtml.includes("Como esta leitura foi criada"));
assert.ok(!resultHtml.includes("Matriz de 260 Kins"));
assert.ok(!resultHtml.includes("SHA-256"));
assert.ok(resultHtml.includes("Ciclo dos Plasmas e Chakras"));
assert.ok(!resultHtml.includes("Mapa visual dos 7 chakras"));
assert.ok(resultHtml.includes("N&atilde;o representa diagn&oacute;stico individual dos seus chakras."));
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
assert.strictEqual((resultHtml.match(/data-chakra-id="/g) || []).length, 7);
assert.ok(resultHtml.includes('data-chakra-id="root"'));
assert.ok(resultHtml.includes('aria-label="Abrir detalhes do Chakra Raiz"'));
assert.strictEqual((resultHtml.match(/<details class="coordinate-details/g) || []).length, 4);

const summaryIndex = resultHtml.indexOf("Resumo do GPS de Hoje");
const essentialIndex = resultHtml.indexOf("Sua resposta essencial");
const detailsIndex = resultHtml.indexOf("Entenda sua leitura");
const applicationIndex = resultHtml.indexOf("Aplica&ccedil;&atilde;o na &Aacute;rea Escolhida");
const birthCoordinatesIndex = resultHtml.indexOf("Suas Coordenadas de Nascimento");
const dayCoordinatesIndex = resultHtml.indexOf("Coordenadas do Dia");
const synchronizationIndex = resultHtml.indexOf("Sua Sincroniza&ccedil;&atilde;o com Hoje");
const practiceIndex = resultHtml.indexOf("Pr&aacute;tica de Sincroniza&ccedil;&atilde;o do Dia");
const chakraCycleIndex = resultHtml.indexOf("Ciclo dos Plasmas e Chakras");

assert.ok(essentialIndex < detailsIndex);
assert.ok(detailsIndex < summaryIndex);
assert.ok(summaryIndex < applicationIndex);
assert.ok(applicationIndex < birthCoordinatesIndex);
assert.ok(birthCoordinatesIndex < dayCoordinatesIndex);
assert.ok(dayCoordinatesIndex < synchronizationIndex);
assert.ok(synchronizationIndex < practiceIndex);
assert.ok(practiceIndex < chakraCycleIndex);
assert.ok(resultHtml.includes("Como aplicar minhas coordenadas de hoje em Trabalho e Prosperidade?"));

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

resultContext.setState({ route: "journey", journeySelectedDay: 0 });
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

resultContext.toggleJourneyDay(1);
const completedJourneyHtml = resultContext.__getHtml();
const journeyProgress = JSON.parse(resultContext.localStorage.getItem("drive-astral-journey-progress"));
assert.deepStrictEqual(journeyProgress.completedDays, [1]);
assert.ok(completedJourneyHtml.includes("1/30"));
assert.ok(completedJourneyHtml.includes("Dia conclu&iacute;do"));

resultContext.setState({ journeySelectedDay: 8 });
const secondWeekJourneyHtml = resultContext.__getHtml();
assert.ok(secondWeekJourneyHtml.includes("Dia 8 de 30"));
assert.ok(secondWeekJourneyHtml.includes("Organizar: Ordem para sustentar o caminho"));

const directJourneyContext = createBrowserLikeContext("http://localhost:4173/app/jornada");
assert.strictEqual(vm.runInContext("state.route", directJourneyContext), "journey");
assert.ok(directJourneyContext.__getHtml().includes("Jornada de 30 dias"));

const invalidDateContext = createBrowserLikeContext();
invalidDateContext.setState({
  route: "home",
  selectedAreaId: "general",
});
invalidDateContext.submitAlignment("Data Invalida", "2026-02-30");
const invalidDateHtml = invalidDateContext.__getHtml();
const invalidDateState = vm.runInContext("state", invalidDateContext);
assert.ok(invalidDateHtml.includes("Informe uma data de nascimento v&aacute;lida."));
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
});
leapDayContext.submitAlignment("Data Especial", "2000-02-29");
const leapDayHtml = leapDayContext.__getHtml();
const leapDayState = vm.runInContext("state", leapDayContext);
assert.ok(leapDayHtml.includes("29 de fevereiro possui regra especial e ainda n&atilde;o est&aacute; dispon&iacute;vel nesta vers&atilde;o."));
assert.ok(leapDayHtml.includes("A data 29 de fevereiro possui tratamento especial no Sincron&aacute;rio das 13 Luas."));
assert.ok(leapDayHtml.includes("Para evitar uma leitura incorreta"));
assert.ok(leapDayHtml.includes("Voc&ecirc; poder&aacute; continuar quando a regra metodol&oacute;gica de 29/02 for definida no Drive Astral."));
assert.ok(!leapDayHtml.includes("Informe uma data de nascimento v&aacute;lida."));
assert.ok(!leapDayHtml.includes("data inv&aacute;lida"));
assert.strictEqual(leapDayState.route, "home");
assert.strictEqual(leapDayState.reading, null);
assert.strictEqual(leapDayState.history.length, 0);
assert.strictEqual(leapDayContext.__getSavedState(), null);

const regularSubmissionContext = createBrowserLikeContext();
regularSubmissionContext.setState({
  route: "home",
  selectedAreaId: "general",
  history: [],
});
regularSubmissionContext.submitAlignment("Data Regular", "1982-12-10");
const regularSubmissionState = vm.runInContext("state", regularSubmissionContext);
assert.strictEqual(regularSubmissionState.route, "chakras");
assert.strictEqual(regularSubmissionState.reading.personal_map.kin.value, 166);
assert.strictEqual(regularSubmissionState.history.length, 1);
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
assert.ok(platformProfileHtml.includes("Instalar no dispositivo"));
assert.ok(platformProfileHtml.includes("Baixar backup"));
assert.ok(platformProfileHtml.includes("Importar backup"));
assert.ok(platformProfileHtml.includes("Privacidade e dados"));
assert.ok(platformProfileHtml.includes('href="/privacy.html"'));
assert.ok(platformProfileHtml.includes("Termos de uso"));
assert.ok(platformProfileHtml.includes('href="/terms.html"'));
assert.ok(platformProfileHtml.includes("Excluir meus dados deste dispositivo"));

const chakraExpectations = [
  ["root", "1", "Raiz", "Muladhara", "Seguran&ccedil;a", "organiza&ccedil;&atilde;o da rotina"],
  ["sacral", "2", "Sacral", "Svadhisthana", "Emo&ccedil;&otilde;es", "atividade criativa"],
  ["solarPlexus", "3", "Plexo Solar", "Manipura", "Autoconfian&ccedil;a", "defini&ccedil;&atilde;o de uma tarefa principal"],
  ["heart", "4", "Card&iacute;aco", "Anahata", "Amor", "pr&aacute;tica de gratid&atilde;o"],
  ["throat", "5", "Lar&iacute;ngeo", "Vishuddha", "Comunica&ccedil;&atilde;o", "conversa honesta"],
  ["thirdEye", "6", "Terceiro Olho", "Ajna", "Clareza", "mapa de prioridades"],
  ["crown", "7", "Coron&aacute;rio", "Sahasrara", "Prop&oacute;sito", "ora&ccedil;&atilde;o ou pausa contemplativa"],
];

for (const [id, number, name, traditional, lifeArea, practice] of chakraExpectations) {
  const chakraContext = createBrowserLikeContext(`http://localhost:4173/chakras/${id}?area=work-prosperity`);
  const chakraHtml = chakraContext.__getHtml();
  assert.ok(chakraHtml.includes(`Chakra ${number}`), id);
  assert.ok(chakraHtml.includes(name), id);
  assert.ok(chakraHtml.includes(traditional), id);
  assert.ok(chakraHtml.includes(lifeArea), id);
  assert.ok(chakraHtml.includes(practice), id);
  assert.ok(chakraHtml.includes("Trabalho e Prosperidade"), id);
  assert.ok(chakraHtml.includes("Adicionar ao meu protocolo"), id);
  assert.ok(chakraHtml.includes('data-route="chakras"'), id);
  assert.ok(chakraHtml.includes("Navega&ccedil;&atilde;o entre chakras"), id);
  assert.ok(chakraHtml.includes("Esses sinais s&atilde;o convites"), id);
  assert.ok(chakraHtml.includes("n&atilde;o avalia individualmente"), id);
  assert.ok(!chakraHtml.includes("hiperativo"), id);
  assert.ok(!chakraHtml.includes("ferido"), id);
  assert.ok(!chakraHtml.includes("drenado"), id);
  assert.ok(!chakraHtml.includes("sintoma"), id);
  const headerMatch = chakraHtml.match(/<header class="app-header">[\s\S]*?<\/header>/);
  assert.ok(headerMatch, id);
  assert.ok(!headerMatch[0].includes("#"), id);
}

const directGeneralContext = createBrowserLikeContext("http://localhost:4173/chakras/root");
const directGeneralHtml = directGeneralContext.__getHtml();
assert.ok(directGeneralHtml.includes("Como o Chakra Raiz se relaciona com Vis&atilde;o Geral"));
assert.ok(directGeneralHtml.includes("Na Vis&atilde;o Geral, o Chakra Raiz"));
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

console.log("app-render tests passed");
