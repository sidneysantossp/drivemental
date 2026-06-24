const assert = require("assert");
const { SincronarioEngine } = require("../src/domain/sincronario/engine.js");
const { AreaApplicationKnowledge } = require("../src/domain/sincronario/area-application-knowledge.js");
const { AreaKnowledge } = require("../src/domain/sincronario/area-knowledge.js");
const { SincronarioKnowledge } = require("../src/domain/sincronario/knowledge.js");

function assertKin(date, expected) {
  const result = SincronarioEngine.calculateKinForDate(date);
  assert.strictEqual(result.kin.value, expected.kin, `${date} kin`);
  assert.strictEqual(result.seal.number, expected.seal, `${date} seal`);
  assert.strictEqual(result.tone.number, expected.tone, `${date} tone`);
  assert.strictEqual(result.signature.value, expected.signature, `${date} signature`);
  return result;
}

const anchorKin = assertKin("1987-07-26", {
  kin: 34,
  seal: 14,
  tone: 8,
  signature: "Branco Galactico Mago",
});
assert.strictEqual(anchorKin.earth_family.value, "Gateway");
assert.strictEqual(anchorKin.earth_family.key, "gateway");

assertKin("1987-07-27", {
  kin: 35,
  seal: 15,
  tone: 9,
  signature: "Azul Solar Aguia",
});

assertKin("1987-07-25", {
  kin: 33,
  seal: 13,
  tone: 7,
  signature: "Vermelho Ressonante Caminhante do Ceu",
});

assertKin("1982-12-10", {
  kin: 166,
  seal: 6,
  tone: 10,
  signature: "Branco Planetario Enlacador de Mundos",
});

assertKin("1996-06-25", {
  kin: 168,
  seal: 8,
  tone: 12,
  signature: "Amarelo Cristal Estrela",
});

assertKin("2026-06-05", {
  kin: 178,
  seal: 18,
  tone: 9,
  signature: "Branco Solar Espelho",
});

const feb28 = SincronarioEngine.calculateKinForDate("1988-02-28");
const feb29 = SincronarioEngine.calculateKinForDate("1988-02-29");
const mar01 = SincronarioEngine.calculateKinForDate("1988-03-01");
assert.strictEqual(feb29.kin.value, null);
assert.strictEqual(feb29.kin.status, "fora_da_contagem");
assert.ok(feb29.warnings.some((warning) => warning.code === "LEAP_DAY_0_0_HUNAB_KU"));
assert.strictEqual(mar01.kin.value, ((feb28.kin.value % 260) + 1));

for (const date of ["1988-02-29", "2000-02-29", "2024-02-29"]) {
  const leapDay = SincronarioEngine.calculateKinForDate(date);
  assert.strictEqual(leapDay.kin.value, null, `${date} has no approved ordinary Kin`);
  assert.strictEqual(leapDay.kin.status, "fora_da_contagem", `${date} special status`);
  assert.ok(
    leapDay.warnings.some((warning) => warning.code === "LEAP_DAY_0_0_HUNAB_KU"),
    `${date} special warning`,
  );
}

const invalid = SincronarioEngine.calculateKinForDate("2026-02-30");
assert.strictEqual(invalid.kin.status, "invalido");
assert.strictEqual(invalid.validation_errors[0].code, "DATE_INVALID");

const contract = SincronarioEngine.calculate({
  birthDate: "1996-06-25",
  currentDate: "2026-06-05",
  timezone: "America/Sao_Paulo",
});
assert.strictEqual(contract.engine.version, "0.4.0");
assert.strictEqual(contract.engine.method, "dreamspell-wizard-count");
assert.ok(Array.isArray(contract.rules_applied));
assert.ok(Array.isArray(contract.warnings));
assert.ok(Array.isArray(contract.validation_errors));
assert.strictEqual(contract.input.birth_date.source, "informado_pelo_usuario");
assert.strictEqual(contract.personal_map.kin.classification, "calculado");
assert.strictEqual(contract.personal_map.kin.value, 168);
assert.strictEqual(contract.personal_map.signature.value, "Amarelo Cristal Estrela");
assert.strictEqual(contract.personal_map.signature.classification, "derivado");
assert.strictEqual(contract.personal_map.earth_family.status, "calculado");
assert.strictEqual(contract.personal_map.oracle.status, "calculado");
assert.strictEqual(contract.daily.kin_of_day.value, 178);
assert.strictEqual(contract.daily.signature.value, "Branco Solar Espelho");
assert.strictEqual(contract.daily.earth_family.value, "Signal");
assert.strictEqual(contract.daily.relationship_to_personal_kin.status, "derivado");
assert.strictEqual(contract.daily.relationship_to_personal_kin.value, "same_earth_family");
assert.strictEqual(contract.daily.relationship_to_personal_kin.deltas.kin_forward, 10);
assert.strictEqual(contract.daily.relationship_to_personal_kin.deltas.kin_nearest, 10);
assert.strictEqual(contract.daily.relationship_to_personal_kin.deltas.seal_forward, 10);
assert.strictEqual(contract.daily.relationship_to_personal_kin.deltas.tone_forward, 10);
assert.strictEqual(contract.daily.relationship_to_personal_kin.matches.same_earth_family, true);
assert.strictEqual(contract.daily.relationship_to_personal_kin.matches.oracle_role, null);
assert.ok(contract.rules_applied.includes("daily-personal-kin-relationship-v0.4"));

const enrichedContract = SincronarioKnowledge.enrichReading(contract, { focusArea: "financas" });
assert.strictEqual(enrichedContract.engine.version, "0.4.0");
assert.strictEqual(enrichedContract.knowledge_base.version, "0.8.0");
assert.strictEqual(enrichedContract.knowledge_base.content_version, "area-knowledge-v0.3");
assert.strictEqual(enrichedContract.input.focus_area.value, "work-prosperity");
assert.strictEqual(enrichedContract.guidance.status, "derivado");
assert.strictEqual(enrichedContract.guidance.rule_id, "area-coordinate-application-v0.3");
assert.strictEqual(enrichedContract.guidance.interpretation.areaId, "work-prosperity");
assert.strictEqual(enrichedContract.guidance.interpretation.areaTitle, "Trabalho e Prosperidade");
assert.strictEqual(enrichedContract.guidance.interpretation.contentVersion, "area-knowledge-v0.3");
assert.ok(enrichedContract.guidance.interpretation.synthesis.includes("Amarelo Cristal Estrela"));
assert.ok(enrichedContract.guidance.interpretation.synthesis.includes("Estrela"));
assert.ok(enrichedContract.guidance.interpretation.synthesis.includes("Cristal"));
assert.ok(enrichedContract.guidance.interpretation.synthesis.includes("Kin do dia 178"));
assert.ok(enrichedContract.guidance.interpretation.synthesis.includes("Mesma Familia Terrestre"));
assert.ok(enrichedContract.knowledge_base.rules_applied.includes("area-coordinate-application-v0.3"));

const areaIds = [
  "general",
  "purpose",
  "work-prosperity",
  "love-relationships",
  "challenges-blocks",
  "energy-spirituality",
  "decisions-cycles",
];
assert.deepStrictEqual(Object.keys(AreaKnowledge.areaKnowledge), areaIds);
assert.deepStrictEqual(
  Object.keys(AreaApplicationKnowledge.areaApplicationKnowledge),
  areaIds,
);
for (const areaId of areaIds) {
  const area = AreaKnowledge.areaKnowledge[areaId];
  const applicationArea = AreaApplicationKnowledge.areaApplicationKnowledge[areaId];
  assert.ok(area.title, `${areaId} title`);
  assert.ok(area.intent, `${areaId} intent`);
  assert.strictEqual(area.synthesisFocus.length, 2, `${areaId} synthesis paragraphs`);
  assert.ok(area.reflectionQuestion, `${areaId} reflection question`);
  assert.ok(area.suggestedPractice, `${areaId} suggested practice`);
  assert.ok(applicationArea.focusTerms.length >= 5, `${areaId} focus terms`);
  assert.strictEqual(Object.keys(applicationArea.moonTranslations).length, 13, `${areaId} moons`);
  assert.strictEqual(Object.keys(applicationArea.weekTranslations).length, 4, `${areaId} weeks`);
  assert.strictEqual(Object.keys(applicationArea.plasmaTranslations).length, 7, `${areaId} plasmas`);
  assert.strictEqual(applicationArea.questions.length, 3, `${areaId} questions`);
  assert.strictEqual(Object.keys(applicationArea.practices).length, 4, `${areaId} practices`);
}

const crystalApplications = Object.fromEntries(areaIds.map((areaId) => [
  areaId,
  AreaApplicationKnowledge.buildApplication({
    areaId,
    moonName: "Lua Cristal",
    moonNumber: 12,
    weekName: "Semana Branca",
    weekNumber: 2,
    plasmaName: "Seli",
    plasmaNumber: 2,
    chakraName: "Raiz",
    navigationKin: 154,
    dailyTone: "Solar",
    dailySeal: "Espelho",
  }),
]));
assert.strictEqual(
  new Set(Object.values(crystalApplications).map((item) => item.applicationSummary)).size,
  7,
);
assert.strictEqual(
  new Set(Object.values(crystalApplications).map((item) => item.reflectionQuestion)).size,
  7,
);
assert.strictEqual(
  new Set(Object.values(crystalApplications).map((item) => item.dailyPractice)).size,
  7,
);
assert.ok(crystalApplications["love-relationships"].applicationSummary.includes("reciprocidade"));
assert.ok(crystalApplications["love-relationships"].applicationSummary.includes("acordos"));
assert.ok(crystalApplications["love-relationships"].applicationSummary.includes("convivência"));
assert.ok(crystalApplications["work-prosperity"].applicationSummary.includes("parcerias"));
assert.ok(crystalApplications["work-prosperity"].applicationSummary.includes("clientes"));
assert.ok(crystalApplications.purpose.applicationSummary.includes("contribuição"));
assert.ok(crystalApplications.purpose.applicationSummary.includes("missão"));
assert.ok(crystalApplications["challenges-blocks"].applicationSummary.includes("isolamento"));
assert.ok(crystalApplications["challenges-blocks"].applicationSummary.includes("pedir ajuda"));
assert.ok(crystalApplications["energy-spirituality"].applicationSummary.includes("prática coletiva"));
assert.ok(crystalApplications["energy-spirituality"].applicationSummary.includes("escuta interior"));
assert.ok(crystalApplications["decisions-cycles"].applicationSummary.includes("outras pessoas"));
assert.ok(crystalApplications["decisions-cycles"].applicationSummary.includes("impactos coletivos"));
assert.ok(crystalApplications.general.applicationSummary.includes("sem limitar a leitura"));
for (const application of Object.values(crystalApplications)) {
  assert.ok(application.applicationSummary.includes("Semana Branca"));
  assert.ok(application.applicationSummary.includes("Seli"));
  assert.ok(application.applicationSummary.includes("Kin de navegação 154"));
  assert.ok(!application.applicationSummary.includes(
    "a Lua Cristal orienta a compartilhar, cooperar e fortalecer a comunidade",
  ));
}

const areaInterpretations = areaIds.map((areaId) => (
  SincronarioKnowledge.enrichReading(contract, { focusArea: areaId }).guidance.interpretation
));
assert.strictEqual(new Set(areaInterpretations.map((item) => item.synthesis)).size, 7);
assert.strictEqual(new Set(areaInterpretations.map((item) => item.reflectionQuestion)).size, 7);
assert.strictEqual(new Set(areaInterpretations.map((item) => item.suggestedPractice)).size, 7);
assert.ok(areaInterpretations.every((item) => item.contentVersion === "area-knowledge-v0.3"));
assert.ok(areaInterpretations.every((item) => item.contentFallbackUsed === false));
for (const interpretation of areaInterpretations) {
  assert.ok(interpretation.synthesis.includes(interpretation.areaTitle), `${interpretation.areaId} area`);
  assert.ok(interpretation.synthesis.includes("Amarelo Cristal Estrela"), `${interpretation.areaId} signature`);
  assert.ok(interpretation.synthesis.includes("Estrela"), `${interpretation.areaId} seal`);
  assert.ok(interpretation.synthesis.includes("Cristal"), `${interpretation.areaId} tone`);
  assert.ok(interpretation.synthesis.includes("Kin do dia 178"), `${interpretation.areaId} daily kin`);
  assert.ok(interpretation.synthesis.includes("Mesma Familia Terrestre"), `${interpretation.areaId} relationship`);
}

const fallbackInterpretation = SincronarioKnowledge.enrichReading(contract, {
  focusArea: "area-inexistente",
}).guidance.interpretation;
assert.strictEqual(fallbackInterpretation.areaId, "general");
assert.strictEqual(fallbackInterpretation.areaTitle, "Visão Geral");
assert.strictEqual(fallbackInterpretation.contentFallbackUsed, true);

const forbiddenAbsolutePhrases = [
  "você vai",
  "isso acontecerá",
  "seu destino é",
  "sua vida financeira será",
  "esse relacionamento deve acabar",
  "você está bloqueado",
  "diagnóstico médico",
  "diagnóstico financeiro",
  "diagnóstico jurídico",
  "diagnóstico psicológico",
  "cura",
  "tratamento",
];
for (const interpretation of areaInterpretations) {
  const content = [
    interpretation.synthesis,
    interpretation.reflectionQuestion,
    interpretation.suggestedPractice,
  ].join(" ").toLowerCase();

  for (const phrase of forbiddenAbsolutePhrases) {
    assert.ok(!content.includes(phrase), `${interpretation.areaId} contains ${phrase}`);
  }
}

const kin166Contract = {
  personal_map: {
    kin: { value: 166 },
    signature: { value: "Branco Planetario Enlacador de Mundos" },
    seal: { name: "Enlacador de Mundos", power: "Morte", action: "Equalizar", essence: "Oportunidade" },
    tone: { name: "Planetario", power: "Manifestacao", action: "Aperfeicoar", essence: "Producao" },
  },
  daily: {
    kin_of_day: { value: 178 },
    signature: { value: "Branco Solar Espelho" },
    seal: { name: "Espelho", power: "Infinito", action: "Refletir", essence: "Ordem" },
    tone: { name: "Solar", power: "Intencao", action: "Pulsar", essence: "Realizacao" },
    relationship_to_personal_kin: {
      value: "cycle_distance",
      label: "Distancia no ciclo",
    },
  },
};
const kin166Guidance = SincronarioKnowledge.enrichReading(kin166Contract, { focusArea: "geral" });
assert.ok(kin166Guidance.guidance.interpretation.synthesis.includes("Branco Planetario Enlacador de Mundos"));
assert.ok(kin166Guidance.guidance.interpretation.synthesis.includes("Enlacador de Mundos"));
assert.ok(kin166Guidance.guidance.interpretation.synthesis.includes("Planetario"));

const relationshipFocus = SincronarioKnowledge.normalizeFocusArea("relationships");
assert.strictEqual(relationshipFocus.key, "love-relationships");

const invalidGuidance = SincronarioKnowledge.enrichReading(null, { focusArea: "desconhecido" });
assert.strictEqual(invalidGuidance.knowledge_base.version, "0.8.0");
assert.strictEqual(invalidGuidance.guidance.status, "invalido");
assert.strictEqual(invalidGuidance.guidance.focus_area.key, "general");
assert.strictEqual(invalidGuidance.guidance.focus_area.contentFallbackUsed, true);

const earthFamilyCases = [
  [5, "Polar", "polar"],
  [10, "Polar", "polar"],
  [15, "Polar", "polar"],
  [20, "Polar", "polar"],
  [1, "Cardinal", "cardinal"],
  [6, "Cardinal", "cardinal"],
  [11, "Cardinal", "cardinal"],
  [16, "Cardinal", "cardinal"],
  [2, "Core", "core"],
  [7, "Core", "core"],
  [12, "Core", "core"],
  [17, "Core", "core"],
  [3, "Signal", "signal"],
  [8, "Signal", "signal"],
  [13, "Signal", "signal"],
  [18, "Signal", "signal"],
  [4, "Gateway", "gateway"],
  [9, "Gateway", "gateway"],
  [14, "Gateway", "gateway"],
  [19, "Gateway", "gateway"],
];

for (const [seal, value, key] of earthFamilyCases) {
  const family = SincronarioEngine.calculateEarthFamilyForSeal(seal);
  assert.strictEqual(family.value, value, `seal ${seal} earth family`);
  assert.strictEqual(family.key, key, `seal ${seal} earth family key`);
  assert.strictEqual(family.status, "calculado", `seal ${seal} earth family status`);
  assert.ok(family.seal_numbers.includes(seal), `seal ${seal} is listed in family`);
}

const invalidEarthFamily = SincronarioEngine.calculateEarthFamilyForSeal(21);
assert.strictEqual(invalidEarthFamily.value, null);
assert.strictEqual(invalidEarthFamily.status, "invalido");

const sameKinRelationship = SincronarioEngine.calculateRelationshipForKins(34, 34);
assert.strictEqual(sameKinRelationship.value, "same_kin");
assert.strictEqual(sameKinRelationship.deltas.kin_forward, 0);
assert.strictEqual(sameKinRelationship.matches.oracle_role.key, "destiny");

const oracleGuideRelationship = SincronarioEngine.calculateRelationshipForKins(173, 69);
assert.strictEqual(oracleGuideRelationship.value, "oracle_guide");
assert.strictEqual(oracleGuideRelationship.matches.oracle_role.key, "guide");

const sameSealRelationship = SincronarioEngine.calculateRelationshipForKins(1, 21);
assert.strictEqual(sameSealRelationship.value, "same_seal");
assert.strictEqual(sameSealRelationship.matches.same_seal, true);

const sameToneRelationship = SincronarioEngine.calculateRelationshipForKins(1, 14);
assert.strictEqual(sameToneRelationship.value, "same_tone");
assert.strictEqual(sameToneRelationship.matches.same_tone, true);

const sameColorRelationship = SincronarioEngine.calculateRelationshipForKins(1, 5);
assert.strictEqual(sameColorRelationship.value, "same_color");
assert.strictEqual(sameColorRelationship.matches.same_color, true);

const sameFamilyRelationship = SincronarioEngine.calculateRelationshipForKins(168, 178);
assert.strictEqual(sameFamilyRelationship.value, "same_earth_family");
assert.strictEqual(sameFamilyRelationship.matches.same_earth_family, true);

const distanceRelationship = SincronarioEngine.calculateRelationshipForKins(1, 2);
assert.strictEqual(distanceRelationship.value, "cycle_distance");
assert.strictEqual(distanceRelationship.deltas.kin_forward, 1);

const invalidRelationship = SincronarioEngine.calculateRelationshipForKins(0, 1);
assert.strictEqual(invalidRelationship.value, null);
assert.strictEqual(invalidRelationship.status, "invalido");

const oracle173 = SincronarioEngine.calculateOracleForKin(173);
assert.strictEqual(oracle173.destiny.signature, "Vermelho Autoexistente Caminhante do Ceu");
assert.strictEqual(oracle173.guide.kin, 69);
assert.strictEqual(oracle173.guide.signature, "Vermelho Autoexistente Lua");
assert.strictEqual(oracle173.analog.kin, 186);
assert.strictEqual(oracle173.analog.signature, "Branco Autoexistente Enlacador de Mundos");
assert.strictEqual(oracle173.antipode.kin, 43);
assert.strictEqual(oracle173.antipode.signature, "Azul Autoexistente Noite");
assert.strictEqual(oracle173.occult.kin, 88);
assert.strictEqual(oracle173.occult.signature, "Amarelo Planetario Estrela");

const oracle2 = SincronarioEngine.calculateOracleForKin(2);
assert.strictEqual(oracle2.destiny.signature, "Branco Lunar Vento");
assert.strictEqual(oracle2.guide.signature, "Branco Lunar Mago");
assert.strictEqual(oracle2.analog.signature, "Vermelho Lunar Terra");
assert.strictEqual(oracle2.antipode.signature, "Amarelo Lunar Humano");
assert.strictEqual(oracle2.occult.signature, "Azul Cristal Tormenta");

const cases = [
  "1900-01-01",
  "1900-02-28",
  "1910-06-15",
  "1920-02-29",
  "1933-07-26",
  "1940-02-29",
  "1950-12-31",
  "1960-02-29",
  "1970-01-01",
  "1980-02-29",
  "1987-07-26",
  "1992-02-29",
  "1996-06-25",
  "2000-02-29",
  "2012-12-21",
  "2020-02-29",
  "2024-02-29",
  "2026-06-05",
  "2032-02-29",
  "2100-02-28",
];

for (const date of cases) {
  const first = SincronarioEngine.calculateKinForDate(date);
  const second = SincronarioEngine.calculateKinForDate(date);
  assert.deepStrictEqual(first, second, `${date} should be deterministic`);

  if (date.endsWith("02-29")) {
    assert.strictEqual(first.kin.value, null, `${date} is outside regular count`);
  } else {
    assert.ok(first.kin.value >= 1 && first.kin.value <= 260, `${date} kin range`);
    assert.ok(first.seal.number >= 1 && first.seal.number <= 20, `${date} seal range`);
    assert.ok(first.tone.number >= 1 && first.tone.number <= 13, `${date} tone range`);
  }
}

console.log("sincronario-engine tests passed");
