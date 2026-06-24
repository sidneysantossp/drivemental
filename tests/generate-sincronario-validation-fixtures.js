const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const REFERENCE_PATH = path.join(__dirname, "fixtures", "sincronario-reference-cases.json");
const MATRIX_PATH = path.join(ROOT, "docs", "validacao-motor", "05-matriz-de-validacao.csv");

const casesByCategory = {
  common_date: [
    "1901-01-15", "1905-02-10", "1910-03-12", "1915-04-18", "1921-05-09",
    "1926-06-14", "1930-07-22", "1935-08-11", "1941-09-17", "1946-10-23",
    "1952-11-08", "1957-12-19", "1961-01-24", "1966-02-13", "1970-03-20",
    "1975-04-16", "1981-05-27", "1986-06-06", "1990-07-19", "1995-08-25",
    "2001-09-14", "2006-10-07", "2010-11-22", "2014-12-03", "2018-01-28",
    "2022-02-17", "2026-03-15", "2030-04-09", "2034-05-26", "2038-06-12",
    "1943-01-07", "1954-02-21", "1963-03-30", "1977-04-08", "1989-05-16",
    "1993-06-24", "1998-07-13", "2002-08-29", "2009-09-05", "2013-10-18",
    "2017-11-26", "2021-12-11", "2027-01-09", "2033-02-14", "2039-03-23",
    "1912-04-27", "1929-05-20", "1947-06-02", "1958-07-15", "1969-08-28",
    "1979-09-03", "1984-10-19", "1997-11-07", "2003-12-22", "2008-01-13",
    "2011-02-25", "2016-03-18", "2019-04-24", "2028-05-11", "1982-12-10",
  ],
  month_boundary: [
    "1910-01-31", "1925-04-01", "1937-06-30", "1948-09-01",
    "1959-11-30", "1971-05-01", "1983-08-31", "1994-10-01",
    "2007-04-30", "2015-07-01", "2023-09-30", "2031-12-01",
  ],
  year_boundary: [
    "1950-12-31", "1951-01-01", "1999-12-31", "2000-01-01",
    "2025-12-31", "2026-01-01", "2029-12-31", "2030-01-01",
  ],
  leap_year: [
    "1920-06-15", "1940-07-10", "1960-08-20", "1972-09-05", "1980-10-12",
    "1992-11-18", "2004-04-04", "2012-05-21", "2020-06-30", "2032-08-08",
  ],
  leap_day_neighborhood: [
    "1988-02-28", "1988-02-29", "1988-03-01",
    "2024-02-28", "2024-02-29", "2024-03-01",
    "2026-02-28", "2026-03-01",
    "1900-02-28", "1900-03-01",
    "2000-02-28", "2000-02-29",
  ],
  historical_or_future: [
    "1850-01-15", "1875-07-04", "1899-12-30", "2000-03-01",
    "2050-07-26", "2099-12-30", "2100-02-28", "2100-03-01",
  ],
  current_app_case: [
    "1987-07-25", "1987-07-26", "1987-07-27", "1996-06-25", "2026-06-05",
  ],
  invalid_input: [
    "INVALID", "2026-13-01", "2026-02-30", "2026-00-10", "not-a-date",
  ],
};

const expectedCounts = {
  common_date: 60,
  month_boundary: 12,
  year_boundary: 8,
  leap_year: 10,
  leap_day_neighborhood: 12,
  historical_or_future: 8,
  current_app_case: 5,
  invalid_input: 5,
};

const mandatoryDates = [
  "1982-12-10", "1996-06-25", "2026-06-05",
  "1987-07-25", "1987-07-26", "1987-07-27",
  "1988-02-28", "1988-02-29", "1988-03-01",
  "2024-02-28", "2024-02-29", "2024-03-01",
  "2026-02-28", "2026-03-01",
  "1900-02-28", "1900-03-01",
  "2000-02-28", "2000-02-29", "2000-03-01",
  "2100-02-28", "2100-03-01", "2026-02-30",
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

function buildCases() {
  const cases = [];

  for (const [category, dates] of Object.entries(casesByCategory)) {
    if (dates.length < expectedCounts[category]) {
      throw new Error(`${category} has ${dates.length}; expected at least ${expectedCounts[category]}`);
    }

    for (const date of dates) {
      cases.push({
        caseId: `CASE-${String(cases.length + 1).padStart(3, "0")}`,
        category,
        input: {
          date,
          time: null,
          timezone: null,
        },
        expected: emptyExpected(),
        actual: null,
        sources: [],
        evidence: [],
        validation: {
          phase: null,
          status: "pending_validation",
          validatedAt: null,
          validatedBy: null,
          differenceType: null,
          notes: "",
        },
      });
    }
  }

  if (cases.length < 120) {
    throw new Error(`Matrix has ${cases.length} cases; expected at least 120`);
  }

  const allDates = new Set(cases.map((item) => item.input.date));
  const missing = mandatoryDates.filter((date) => !allDates.has(date));
  if (missing.length) {
    throw new Error(`Missing mandatory dates: ${missing.join(", ")}`);
  }

  return cases;
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

const referenceCases = buildCases();
fs.mkdirSync(path.dirname(REFERENCE_PATH), { recursive: true });
fs.mkdirSync(path.dirname(MATRIX_PATH), { recursive: true });
fs.writeFileSync(REFERENCE_PATH, `${JSON.stringify(referenceCases, null, 2)}\n`);
fs.writeFileSync(MATRIX_PATH, buildCsv(referenceCases));

const counts = Object.fromEntries(
  Object.keys(casesByCategory).map((category) => [
    category,
    referenceCases.filter((item) => item.category === category).length,
  ]),
);

console.log(JSON.stringify({ total: referenceCases.length, counts }, null, 2));
