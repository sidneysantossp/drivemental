const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { SincronarioEngine } = require("../src/domain/sincronario/engine.js");

const REFERENCE_PATH = path.join(__dirname, "fixtures", "sincronario-reference-cases.json");
const RESULTS_PATH = path.join(__dirname, "fixtures", "sincronario-validation-results.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function valueOrNull(value) {
  return value === undefined ? null : value;
}

function buildActual(date) {
  const result = SincronarioEngine.calculateKinForDate(date);
  const kin = result.kin && result.kin.value;

  return {
    kin: valueOrNull(kin),
    sealNumber: valueOrNull(result.seal && result.seal.number),
    sealName: valueOrNull(result.seal && result.seal.name),
    toneNumber: valueOrNull(result.tone && result.tone.number),
    toneName: valueOrNull(result.tone && result.tone.name),
    color: valueOrNull(result.seal && result.seal.color),
    signature: valueOrNull(result.signature && result.signature.value),
    earthFamily: valueOrNull(result.earth_family && result.earth_family.value),
    oracle: Number.isInteger(kin) ? SincronarioEngine.calculateOracleForKin(kin) : null,
    waveSpell: valueOrNull(result.wavespell),
    castle: valueOrNull(result.castle && result.castle.value),
    harmonic: valueOrNull(result.harmonic && result.harmonic.value),
    engineStatus: valueOrNull(result.kin && result.kin.status),
    warningCodes: (result.warnings || []).map((warning) => warning.code),
    validationErrorCodes: (result.validation_errors || []).map((error) => error.code),
    validationErrors: result.validation_errors || [],
    warnings: result.warnings || [],
  };
}

function compareExpected(expected, actual) {
  const differences = [];

  for (const [field, expectedValue] of Object.entries(expected)) {
    if (expectedValue === null) continue;

    try {
      assert.deepStrictEqual(actual[field], expectedValue);
    } catch {
      differences.push({
        field,
        expected: expectedValue,
        actual: valueOrNull(actual[field]),
      });
    }
  }

  return differences;
}

const referenceCases = readJson(REFERENCE_PATH);
const stats = {
  totalCases: referenceCases.length,
  casesWithExpectedBeforePhaseA2: 0,
  newCasesWithExpectedPhaseA2: 0,
  casesWithExpected: 0,
  kinExpectationsPopulated: 0,
  pendingValidation: 0,
  exactMatches: 0,
  divergences: 0,
  sourceConflicts: 0,
  casesAwaitingSecondSource: 0,
  invalidInputsHandledCorrectly: 0,
  unresolvedInvalidInputContracts: 0,
  skippedForMissingExternalSource: 0,
  phaseA1Analyzed: 0,
  phaseA1WithExpected: 0,
  phaseA1Pending: 0,
  phaseA2Analyzed: 0,
  phaseA2WithExpected: 0,
  phaseA2Pending: 0,
};

const cases = referenceCases.map((referenceCase) => {
  const actual = buildActual(referenceCase.input.date);
  const hasExpected = Object.values(referenceCase.expected).some((value) => value !== null);
  const hasKinExpected = referenceCase.expected.kin !== null;
  const hasExternalEvidence =
    Array.isArray(referenceCase.evidence) && referenceCase.evidence.length > 0;
  const isSourceConflict = referenceCase.validation.differenceType === "SOURCE_CONFLICT";
  const isPhaseA1 = referenceCase.validation.phase === "A1";
  const isPhaseA2 = referenceCase.validation.phase === "A2";
  const isAwaitingSecondSource =
    referenceCase.validation.status === "pending_second_source";
  const isUnresolvedInvalidInputContract =
    referenceCase.validation.status === "pending_external_input_contract";
  const invalidInputHandled =
    referenceCase.category === "invalid_input" &&
    actual.engineStatus === "invalido" &&
    actual.validationErrors.length > 0;

  if (isPhaseA1) {
    stats.phaseA1Analyzed += 1;
  }

  if (isPhaseA2) {
    stats.phaseA2Analyzed += 1;
  }

  if (isSourceConflict) {
    stats.sourceConflicts += 1;
  }

  if (isAwaitingSecondSource) {
    stats.casesAwaitingSecondSource += 1;
  }

  if (isUnresolvedInvalidInputContract) {
    stats.unresolvedInvalidInputContracts += 1;
  }

  if (invalidInputHandled) {
    stats.invalidInputsHandledCorrectly += 1;
  }

  if (!hasExpected) {
    stats.pendingValidation += 1;
    if (isPhaseA1) {
      stats.phaseA1Pending += 1;
    }
    if (isPhaseA2) {
      stats.phaseA2Pending += 1;
    }
    if (!hasExternalEvidence) {
      stats.skippedForMissingExternalSource += 1;
    }

    return {
      ...referenceCase,
      actual,
      comparison: {
        status: isSourceConflict
          ? "source_conflict"
          : isAwaitingSecondSource
            ? "pending_second_source"
            : "pending_validation",
        exactMatch: null,
        invalidInputHandled,
        differences: [],
        note: isSourceConflict
          ? "Expected values remain empty because the external sources conflict."
          : "Expected values were not populated from independent external sources.",
      },
    };
  }

  stats.casesWithExpected += 1;
  if (!isPhaseA2) {
    stats.casesWithExpectedBeforePhaseA2 += 1;
  }
  if (isPhaseA2) {
    stats.newCasesWithExpectedPhaseA2 += 1;
    stats.phaseA2WithExpected += 1;
  }
  if (hasKinExpected) {
    stats.kinExpectationsPopulated += 1;
  }
  if (isPhaseA1) {
    stats.phaseA1WithExpected += 1;
  }
  const differences = compareExpected(referenceCase.expected, actual);
  const exactMatch = differences.length === 0;

  if (exactMatch) {
    stats.exactMatches += 1;
  } else {
    stats.divergences += 1;
  }

  return {
    ...referenceCase,
    actual,
    comparison: {
      status: exactMatch ? "exact_match" : "divergence",
      exactMatch,
      invalidInputHandled,
      differences,
      note: exactMatch
        ? "All populated expected fields match."
        : "Difference found against externally populated expected fields.",
    },
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  purpose: "Comparison report only. Actual values never become expected values.",
  engine: {
    name: "drive-astral-sincronario-engine",
    version: SincronarioEngine.constants.ENGINE_VERSION,
    method: SincronarioEngine.constants.METHOD_ID,
    anchor: SincronarioEngine.constants.ANCHOR,
  },
  stats,
  cases,
};

fs.writeFileSync(RESULTS_PATH, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(stats, null, 2));
