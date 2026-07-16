const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const REFERENCE_PATH = path.join(__dirname, "fixtures", "sincronario-reference-cases.json");
const SOURCES_PATH = path.join(__dirname, "fixtures", "sincronario-validation-sources.json");
const MATRIX_PATH = path.join(ROOT, "docs", "validacao-motor", "05-matriz-de-validacao.csv");

const VALIDATED_AT = "2026-06-07";
const VALIDATED_BY = "Codex external source review";

const sources = {
  mayanKin: {
    sourceId: "SOURCE-004",
    sourceName: "MayanKin Daily Tzolkin",
    pageUrl: "https://mayankin.com/daily-tzolkin/",
    codeUrl:
      "https://mayankin.com/wp-content/themes/genesis-sample/scripts/dtselecteddate.js?ver=6.8.5",
  },
  galacticArk: {
    sourceId: "SOURCE-007",
    sourceName: "Galactic Ark Dreamspell Kin Calculator",
    pageUrl: "https://galacticark.org/dreamspell-kin-calculator",
    codeUrl:
      "https://galacticark.org/wp-content/plugins/dreamspell_KIN_calculator_v1.3/dreamspell-calculator.js?ver=1.0.0",
  },
};

const tones = [
  null,
  ["Magnetic", "Magnetico"],
  ["Lunar", "Lunar"],
  ["Electric", "Eletrico"],
  ["Self-Existing", "Autoexistente"],
  ["Overtone", "Entonado"],
  ["Rhythmic", "Ritmico"],
  ["Resonant", "Ressonante"],
  ["Galactic", "Galactico"],
  ["Solar", "Solar"],
  ["Planetary", "Planetario"],
  ["Spectral", "Espectral"],
  ["Crystal", "Cristal"],
  ["Cosmic", "Cosmico"],
];

const seals = [
  null,
  ["Dragon", "Dragao", "Red", "Vermelho"],
  ["Wind", "Vento", "White", "Branco"],
  ["Night", "Noite", "Blue", "Azul"],
  ["Seed", "Semente", "Yellow", "Amarelo"],
  ["Serpent", "Serpente", "Red", "Vermelho"],
  ["World Bridger", "Enlacador de Mundos", "White", "Branco"],
  ["Hand", "Mao", "Blue", "Azul"],
  ["Star", "Estrela", "Yellow", "Amarelo"],
  ["Moon", "Lua", "Red", "Vermelho"],
  ["Dog", "Cachorro", "White", "Branco"],
  ["Monkey", "Macaco", "Blue", "Azul"],
  ["Human", "Humano", "Yellow", "Amarelo"],
  ["Skywalker", "Caminhante do Ceu", "Red", "Vermelho"],
  ["Wizard", "Mago", "White", "Branco"],
  ["Eagle", "Aguia", "Blue", "Azul"],
  ["Warrior", "Guerreiro", "Yellow", "Amarelo"],
  ["Earth", "Terra", "Red", "Vermelho"],
  ["Mirror", "Espelho", "White", "Branco"],
  ["Storm", "Tormenta", "Blue", "Azul"],
  ["Sun", "Sol", "Yellow", "Amarelo"],
];

function emptyExpected() {
  return {
    kin: null,
    sealNumber: null,
    sealName: null,
    toneNumber: null,
    toneName: null,
    color: null,
    signature: null,
    earthFamily: null,
    oracle: null,
    waveSpell: null,
    castle: null,
    harmonic: null,
    engineStatus: null,
    warningCodes: null,
    validationErrorCodes: null,
  };
}

function expectedFromKin(kin) {
  const sealNumber = ((kin - 1) % 20) + 1;
  const toneNumber = ((kin - 1) % 13) + 1;
  const [, sealName, , color] = seals[sealNumber];
  const [, toneName] = tones[toneNumber];

  return {
    ...emptyExpected(),
    kin,
    sealNumber,
    sealName,
    toneNumber,
    toneName,
    color,
    signature: `${color} ${toneName} ${sealName}`,
  };
}

function parseStrictGregorianDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (month < 1 || month > 12 || day < 1) return null;

  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) return null;

  return { year, month, day };
}

// Transcribed from MayanKin's public dtselecteddate.js.
function calculateMayanKin(year, month, inputDay) {
  const day = month === 2 && inputDay === 29 ? 28 : inputDay;
  const monthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const kinYear = (year * 365) % 260;
  const kinBase = kinYear + monthDays[month - 1] + day - 28;
  const kinCalc = kinBase > 260 ? kinBase % 260 : kinBase;
  return kinCalc === 0 ? 260 : kinCalc;
}

// Transcribed from Galactic Ark's public dreamspell-calculator.js.
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function toJulianDay(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const adjustedYear = year + 4800 - a;
  const adjustedMonth = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * adjustedMonth + 2) / 5) +
    365 * adjustedYear +
    Math.floor(adjustedYear / 4) -
    Math.floor(adjustedYear / 100) +
    Math.floor(adjustedYear / 400) -
    32045
  );
}

function countLeapDays(julianDay1, julianDay2) {
  let count = 0;
  let sign = 1;
  let lower = julianDay1;
  let upper = julianDay2;

  if (upper < lower) {
    [lower, upper] = [upper, lower];
    sign = -1;
  }

  const firstYear = Math.floor((lower - 1721119) / 365.25) - 1;
  const lastYear = Math.floor((upper - 1721119) / 365.25) + 1;

  for (let year = firstYear; year <= lastYear; year += 1) {
    if (!isLeapYear(year)) continue;
    const february29 = toJulianDay(year, 2, 29);
    if (february29 > lower && february29 <= upper) count += 1;
  }

  return count * sign;
}

const GALACTIC_ARK_ANCHOR = toJulianDay(2025, 12, 10);

function calculateGalacticArkKin(year, month, day) {
  const julianDay = toJulianDay(year, month, day);
  const totalDays = julianDay - GALACTIC_ARK_ANCHOR;
  const leapDays = countLeapDays(GALACTIC_ARK_ANCHOR, julianDay);
  return (((totalDays - leapDays) % 260) + 260) % 260 + 1;
}

function reportedFromKin(kin) {
  const sealNumber = ((kin - 1) % 20) + 1;
  const toneNumber = ((kin - 1) % 13) + 1;
  const [sealName, , color] = seals[sealNumber];
  const [toneName] = tones[toneNumber];

  return {
    kin,
    sealName,
    toneName,
    color,
    signature: `${color} ${toneName} ${sealName}`,
  };
}

function sourceEvidence(source, date, kin, notes) {
  return {
    sourceId: source.sourceId,
    sourceName: source.sourceName,
    consultedAt: VALIDATED_AT,
    inputDate: date,
    reported: reportedFromKin(kin),
    evidence: {
      urlOrReference: source.codeUrl,
      notes,
    },
  };
}

function evidenceForDate(date, mayanKin, galacticArkKin) {
  return [
    sourceEvidence(
      sources.mayanKin,
      date,
      mayanKin,
      "Result reproduced only from the source's published date-selection algorithm. The source page identifies the decoder as synchronized with the 13 Moon Calendar and Dreamspell.",
    ),
    sourceEvidence(
      sources.galacticArk,
      date,
      galacticArkKin,
      "Result reproduced only from the source's published Julian-day algorithm, independent anchor and explicit removal of February 29 from the count.",
    ),
  ];
}

function csvCell(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function buildCsv(cases) {
  const headers = [
    "caseId", "category", "date", "time", "timezone",
    "expectedKin", "expectedSealNumber", "expectedSealName",
    "expectedToneNumber", "expectedToneName", "expectedColor",
    "expectedSignature", "expectedEarthFamily", "expectedOracle",
    "expectedWaveSpell", "expectedCastle", "expectedHarmonic",
    "expectedEngineStatus", "expectedWarningCodes", "expectedValidationErrorCodes",
    "sourceIds", "evidenceCount", "validationPhase", "validationStatus",
    "differenceType", "notes",
  ];

  const rows = cases.map((item) => [
    item.caseId,
    item.category,
    item.input.date,
    item.input.time,
    item.input.timezone,
    item.expected.kin,
    item.expected.sealNumber,
    item.expected.sealName,
    item.expected.toneNumber,
    item.expected.toneName,
    item.expected.color,
    item.expected.signature,
    item.expected.earthFamily,
    item.expected.oracle,
    item.expected.waveSpell,
    item.expected.castle,
    item.expected.harmonic,
    item.expected.engineStatus,
    item.expected.warningCodes && item.expected.warningCodes.join(";"),
    item.expected.validationErrorCodes && item.expected.validationErrorCodes.join(";"),
    item.sources.join(";"),
    item.evidence.length,
    item.validation.phase,
    item.validation.status,
    item.validation.differenceType,
    item.validation.notes,
  ].map(csvCell).join(","));

  return [headers.map(csvCell).join(","), ...rows].join("\n") + "\n";
}

const referenceCases = JSON.parse(fs.readFileSync(REFERENCE_PATH, "utf8"));
const validationSources = JSON.parse(fs.readFileSync(SOURCES_PATH, "utf8"));

let analyzed = 0;
let populated = 0;
let pendingInputContract = 0;
let conflicts = 0;

for (const referenceCase of referenceCases) {
  if (referenceCase.validation.phase && referenceCase.validation.phase !== "A2") continue;

  analyzed += 1;
  const date = referenceCase.input.date;
  const parsed = parseStrictGregorianDate(date);

  if (!parsed) {
    referenceCase.validation = {
      phase: "A2",
      status: "pending_external_input_contract",
      validatedAt: VALIDATED_AT,
      validatedBy: VALIDATED_BY,
      differenceType: "PENDING_VALIDATION",
      notes:
        "The accepted calculators use separate day/month/year controls and do not expose the same raw YYYY-MM-DD string contract. Expected remains empty rather than being inferred from the Drive Mental motor.",
    };
    pendingInputContract += 1;
    continue;
  }

  if (parsed.month === 2 && parsed.day === 29) {
    throw new Error(`Unexpected unresolved leap day in Phase A2: ${referenceCase.caseId}`);
  }

  const mayanKin = calculateMayanKin(parsed.year, parsed.month, parsed.day);
  const galacticArkKin = calculateGalacticArkKin(parsed.year, parsed.month, parsed.day);
  referenceCase.sources = [sources.mayanKin.sourceId, sources.galacticArk.sourceId];
  referenceCase.evidence = evidenceForDate(date, mayanKin, galacticArkKin);

  if (mayanKin !== galacticArkKin) {
    referenceCase.expected = emptyExpected();
    referenceCase.validation = {
      phase: "A2",
      status: "source_conflict",
      validatedAt: VALIDATED_AT,
      validatedBy: VALIDATED_BY,
      differenceType: "SOURCE_CONFLICT",
      notes: `Accepted sources disagree: MayanKin=${mayanKin}, Galactic Ark=${galacticArkKin}.`,
    };
    conflicts += 1;
    continue;
  }

  referenceCase.expected = expectedFromKin(mayanKin);
  referenceCase.validation = {
    phase: "A2",
    status: "externally_validated",
    validatedAt: VALIDATED_AT,
    validatedBy: VALIDATED_BY,
    differenceType: "TRANSLATION_DIFFERENCE",
    notes:
      "Two accepted Dreamspell calculators agree on Kin, seal, tone and color. English names were normalized to the Drive Mental Portuguese convention. Unconfirmed derived fields remain null.",
  };
  populated += 1;
}

if (analyzed !== 100 || populated !== 96 || pendingInputContract !== 4 || conflicts !== 0) {
  throw new Error(
    `Unexpected Phase A2 totals: analyzed=${analyzed}, populated=${populated}, pendingInputContract=${pendingInputContract}, conflicts=${conflicts}`,
  );
}

for (const source of validationSources) {
  if (![sources.mayanKin.sourceId, sources.galacticArk.sourceId].includes(source.sourceId)) {
    continue;
  }

  source.consultedAt = VALIDATED_AT;
  source.phaseA2 = {
    reviewedAt: VALIDATED_AT,
    casesChecked: 96,
    agreementsWithOtherAcceptedSource: 96,
    disagreementsWithOtherAcceptedSource: 0,
  };
}

fs.writeFileSync(REFERENCE_PATH, `${JSON.stringify(referenceCases, null, 2)}\n`);
fs.writeFileSync(SOURCES_PATH, `${JSON.stringify(validationSources, null, 2)}\n`);
fs.writeFileSync(MATRIX_PATH, buildCsv(referenceCases));

console.log(JSON.stringify({ analyzed, populated, pendingInputContract, conflicts }, null, 2));
