const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const REFERENCE_PATH = path.join(__dirname, "fixtures", "sincronario-reference-cases.json");
const MATRIX_PATH = path.join(ROOT, "docs", "validacao-motor", "05-matriz-de-validacao.csv");

const VALIDATED_AT = "2026-06-07";
const VALIDATED_BY = "Codex external source review";

const sourceUrls = {
  "SOURCE-001": "https://lawoftime.org/thirteenmoonfaq.html",
  "SOURCE-004": "https://mayankin.com/daily-tzolkin/",
  "SOURCE-007": "https://galacticark.org/dreamspell-kin-calculator",
  "SOURCE-008": "https://calculatorsocean.com/galactic-signature-calculator/",
};

const sourceCodeUrls = {
  "SOURCE-004":
    "https://mayankin.com/wp-content/themes/genesis-sample/scripts/dtselecteddate.js?ver=6.8.5",
  "SOURCE-007":
    "https://galacticark.org/wp-content/plugins/dreamspell_KIN_calculator_v1.3/dreamspell-calculator.js?ver=1.0.0",
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

const regularKins = {
  "1987-07-25": 33,
  "1987-07-26": 34,
  "1987-07-27": 35,
  "1982-12-10": 166,
  "1996-06-25": 168,
  "2026-06-05": 178,
  "1988-02-28": 251,
  "1988-03-01": 252,
  "2024-02-28": 131,
  "2024-03-01": 132,
  "2000-02-28": 211,
  "2000-03-01": 212,
  "1900-02-28": 111,
  "1900-03-01": 112,
  "2100-02-28": 51,
  "2100-03-01": 52,
};

const leapDays = {
  "1988-02-29": 251,
  "2024-02-29": 131,
  "2000-02-29": 211,
};

const invalidDates = new Set(["2026-02-30"]);

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
    engineStatus: "calculado",
    warningCodes: [],
    validationErrorCodes: [],
  };
}

function externalSignature(kin) {
  const sealNumber = ((kin - 1) % 20) + 1;
  const toneNumber = ((kin - 1) % 13) + 1;
  const [sealName, , color] = seals[sealNumber];
  const [toneName] = tones[toneNumber];
  return `${color} ${toneName} ${sealName}`;
}

function regularEvidence(date, kin) {
  const observed = {
    date,
    kin,
    sealNumber: ((kin - 1) % 20) + 1,
    toneNumber: ((kin - 1) % 13) + 1,
    signature: externalSignature(kin),
  };

  return [
    {
      sourceId: "SOURCE-004",
      consultedAt: VALIDATED_AT,
      url: sourceUrls["SOURCE-004"],
      codeUrl: sourceCodeUrls["SOURCE-004"],
      access: "public calculator JavaScript independently reproduced",
      observed,
      note: "Dreamspell result produced by the source's published date-selection algorithm.",
    },
    {
      sourceId: "SOURCE-007",
      consultedAt: VALIDATED_AT,
      url: sourceUrls["SOURCE-007"],
      codeUrl: sourceCodeUrls["SOURCE-007"],
      access: "public calculator JavaScript independently reproduced",
      observed,
      note: "Dreamspell result produced by the source's published Julian-day algorithm.",
    },
  ];
}

function leapEvidence(date, repeatedKin) {
  return [
    {
      sourceId: "SOURCE-001",
      consultedAt: VALIDATED_AT,
      url: sourceUrls["SOURCE-001"],
      access: "official methodology page",
      observed: {
        date,
        classification: "0.0 Hunab Ku",
        ordinaryKin: null,
      },
      note: "The official FAQ treats Gregorian February 29 as the intercalary 0.0 Hunab Ku day.",
    },
    {
      sourceId: "SOURCE-004",
      consultedAt: VALIDATED_AT,
      url: sourceUrls["SOURCE-004"],
      codeUrl: sourceCodeUrls["SOURCE-004"],
      access: "public calculator JavaScript inspected",
      observed: {
        date,
        substitutedDate: date.replace("-02-29", "-02-28"),
        displayedKin: repeatedKin,
      },
      note: "The calculator explicitly rewrites February 29 to February 28 before calculating.",
    },
    {
      sourceId: "SOURCE-007",
      consultedAt: VALIDATED_AT,
      url: sourceUrls["SOURCE-007"],
      codeUrl: sourceCodeUrls["SOURCE-007"],
      access: "public calculator JavaScript inspected",
      observed: {
        date,
        displayedKin: repeatedKin,
        calendarSequence: "February 29 skipped",
      },
      note: "The date calculator repeats the prior Kin, while the 13 Moon calendar grid omits February 29.",
    },
  ];
}

function invalidEvidence(date) {
  return [
    {
      sourceId: "SOURCE-004",
      consultedAt: VALIDATED_AT,
      url: sourceUrls["SOURCE-004"],
      access: "public validation JavaScript inspected",
      observed: { date, valid: false },
      note: "The source validates the selected day against the Gregorian month's maximum.",
    },
    {
      sourceId: "SOURCE-008",
      consultedAt: VALIDATED_AT,
      url: sourceUrls["SOURCE-008"],
      access: "public calculator validation JavaScript inspected",
      observed: { date, valid: false },
      note: "Used only for strict Gregorian input validation; rejected as a Kin reference source.",
    },
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
let analyzed = 0;
let populated = 0;
let conflicts = 0;

for (const referenceCase of referenceCases) {
  referenceCase.expected = {
    ...emptyExpected(),
    ...referenceCase.expected,
  };
  referenceCase.evidence = referenceCase.evidence || [];
  referenceCase.validation.phase = referenceCase.validation.phase || null;

  const date = referenceCase.input.date;

  if (regularKins[date]) {
    const kin = regularKins[date];
    referenceCase.expected = expectedFromKin(kin);
    referenceCase.sources = ["SOURCE-004", "SOURCE-007"];
    referenceCase.evidence = regularEvidence(date, kin);
    referenceCase.validation = {
      phase: "A1",
      status: "externally_validated",
      validatedAt: VALIDATED_AT,
      validatedBy: VALIDATED_BY,
      differenceType: "TRANSLATION_DIFFERENCE",
      notes:
        "Two independent Dreamspell calculators agree on Kin, seal, tone and color. English names were normalized to the project's Portuguese vocabulary.",
    };
    analyzed += 1;
    populated += 1;
    continue;
  }

  if (leapDays[date]) {
    referenceCase.expected = emptyExpected();
    referenceCase.sources = ["SOURCE-001", "SOURCE-004", "SOURCE-007"];
    referenceCase.evidence = leapEvidence(date, leapDays[date]);
    referenceCase.validation = {
      phase: "A1",
      status: "source_conflict",
      validatedAt: VALIDATED_AT,
      validatedBy: VALIDATED_BY,
      differenceType: "SOURCE_CONFLICT",
      notes:
        "Official methodology defines 0.0 Hunab Ku with no ordinary Kin; public calculators expose a repeated/substituted neighboring Kin. Expected remains empty.",
    };
    analyzed += 1;
    conflicts += 1;
    continue;
  }

  if (invalidDates.has(date)) {
    referenceCase.expected = {
      ...emptyExpected(),
      engineStatus: "invalido",
      warningCodes: ["INVALID_DATE"],
      validationErrorCodes: ["DATE_INVALID"],
    };
    referenceCase.sources = ["SOURCE-004", "SOURCE-008"];
    referenceCase.evidence = invalidEvidence(date);
    referenceCase.validation = {
      phase: "A1",
      status: "externally_validated_invalid_input",
      validatedAt: VALIDATED_AT,
      validatedBy: VALIDATED_BY,
      differenceType: null,
      notes:
        "Two independent Gregorian validators reject the impossible date. SOURCE-008 is used only for input validity.",
    };
    analyzed += 1;
    populated += 1;
  }
}

if (analyzed !== 20 || populated !== 17 || conflicts !== 3) {
  throw new Error(
    `Unexpected Phase A1 totals: analyzed=${analyzed}, populated=${populated}, conflicts=${conflicts}`,
  );
}

fs.writeFileSync(REFERENCE_PATH, `${JSON.stringify(referenceCases, null, 2)}\n`);
fs.writeFileSync(MATRIX_PATH, buildCsv(referenceCases));

console.log(JSON.stringify({ analyzed, populated, conflicts }, null, 2));
