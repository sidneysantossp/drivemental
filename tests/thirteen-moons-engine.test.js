const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const { SincronarioEngine } = require("../src/domain/sincronario/engine.js");
const { ThirteenMoonsEngine } = require("../src/domain/sincronario/thirteen-moons-engine.js");
const { KinCycleEngine } = require("../src/domain/sincronario/kin-cycle-engine.js");
const { SynchronizationEngine } = require("../src/domain/sincronario/synchronization-engine.js");
const { CoordinatesEngine } = require("../src/domain/sincronario/coordinates-engine.js");
const { SincronarioKnowledge } = require("../src/domain/sincronario/knowledge.js");

const VALIDATED_KIN_ENGINE_SHA256 = "617686b2cbd2cb8d0dfa87b525835831d29e2b0e54d99e8cb31f989d6b79d961";
const VALIDATED_THIRTEEN_MOONS_ENGINE_SHA256 = "7905ea2d90419352da11ab71684b3fa4cacd22c89b90d9b6c5a71ac5f5f3e4a1";

function addDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const magneticStart = ThirteenMoonsEngine.calculateForDate("2025-07-26");
assert.strictEqual(magneticStart.status, "calculado");
assert.strictEqual(magneticStart.moon.number, 1);
assert.strictEqual(magneticStart.moon.name, "Lua Magnética");
assert.strictEqual(magneticStart.moon_day, 1);
assert.strictEqual(magneticStart.chromatic_week.name, "Semana Vermelha");
assert.strictEqual(magneticStart.plasma.name, "Dali");
assert.strictEqual(magneticStart.chakra.name, "Coroa");

const dayOutOfTime = ThirteenMoonsEngine.calculateForDate("2026-07-25");
assert.strictEqual(dayOutOfTime.status, "calculado_especial");
assert.strictEqual(dayOutOfTime.is_day_out_of_time, true);
assert.strictEqual(dayOutOfTime.day_out_of_time.name, "Dia Fora do Tempo");
assert.strictEqual(dayOutOfTime.moon, null);

assert.strictEqual(ThirteenMoonsEngine.constants.MOONS.length, 13);
for (const moon of ThirteenMoonsEngine.constants.MOONS) {
  assert.ok(moon.number >= 1 && moon.number <= 13);
  assert.ok(moon.name);
  assert.ok(moon.guiding_question);
  assert.ok(moon.symbolic_function);
  assert.ok(moon.practical_application);
  assert.ok(moon.short_description);
  assert.ok(moon.expanded_description.includes("Versão v0.1"));
}

for (let index = 0; index < 13; index += 1) {
  const firstDay = ThirteenMoonsEngine.calculateForDate(addDays("2025-07-26", index * 28));
  const lastDay = ThirteenMoonsEngine.calculateForDate(addDays("2025-07-26", (index * 28) + 27));
  assert.strictEqual(firstDay.moon.number, index + 1, `moon ${index + 1} first day`);
  assert.strictEqual(firstDay.moon_day, 1, `moon ${index + 1} starts at day 1`);
  assert.strictEqual(lastDay.moon.number, index + 1, `moon ${index + 1} last day`);
  assert.strictEqual(lastDay.moon_day, 28, `moon ${index + 1} ends at day 28`);
}

const weekCases = [
  [1, 1, "Semana Vermelha", "Vermelha"],
  [7, 1, "Semana Vermelha", "Vermelha"],
  [8, 2, "Semana Branca", "Branca"],
  [14, 2, "Semana Branca", "Branca"],
  [15, 3, "Semana Azul", "Azul"],
  [21, 3, "Semana Azul", "Azul"],
  [22, 4, "Semana Amarela", "Amarela"],
  [28, 4, "Semana Amarela", "Amarela"],
];

for (const [moonDay, number, name, color] of weekCases) {
  const result = ThirteenMoonsEngine.calculateForDate(addDays("2025-07-26", moonDay - 1));
  assert.strictEqual(result.moon_day, moonDay);
  assert.strictEqual(result.chromatic_week.number, number);
  assert.strictEqual(result.chromatic_week.name, name);
  assert.strictEqual(result.chromatic_week.color, color);
}

const expectedPlasmas = ["Dali", "Seli", "Gama", "Kali", "Alfa", "Limi", "Silio"];
const expectedChakras = [
  "Coroa",
  "Raiz",
  "Terceiro Olho",
  "Sacral",
  "Laríngeo",
  "Plexo Solar",
  "Cardíaco",
];

for (let index = 0; index < 7; index += 1) {
  const result = ThirteenMoonsEngine.calculateForDate(addDays("2025-07-26", index));
  assert.strictEqual(result.plasma.name, expectedPlasmas[index]);
  assert.strictEqual(result.chakra.name, expectedChakras[index]);
  assert.strictEqual(result.plasma_cycle_position, index + 1);
}

const december1980 = ThirteenMoonsEngine.calculateForDate("1980-12-30");
assert.strictEqual(december1980.moon.name, "Lua Rítmica");
assert.strictEqual(december1980.plasma.name, "Kali");
assert.strictEqual(december1980.moon_day, 18);
assert.strictEqual(SincronarioEngine.calculateKinForDate("1980-12-30").kin.value, 236);

const may1978 = ThirteenMoonsEngine.calculateForDate("1978-05-26");
assert.strictEqual(may1978.moon.name, "Lua Espectral");
assert.strictEqual(may1978.plasma.name, "Kali");
assert.strictEqual(may1978.moon_day, 25);
assert.strictEqual(SincronarioEngine.calculateKinForDate("1978-05-26").kin.value, 68);

const reducedSynchronization = SynchronizationEngine.calculateDailySynchronization(236, 133);
assert.strictEqual(reducedSynchronization.rawSum, 369);
assert.strictEqual(reducedSynchronization.synchronizedKin, 109);
assert.strictEqual(reducedSynchronization.reductionApplied, true);

const directSynchronization = SynchronizationEngine.calculateDailySynchronization(68, 133);
assert.strictEqual(directSynchronization.rawSum, 201);
assert.strictEqual(directSynchronization.synchronizedKin, 201);
assert.strictEqual(directSynchronization.reductionApplied, false);

const harmonic = SynchronizationEngine.calculateHarmonicKin([236, 133]);
assert.strictEqual(harmonic.harmonicKin, 109);
assert.strictEqual(harmonic.reductionApplied, true);

assert.deepStrictEqual(
  [
    KinCycleEngine.calculateWavespellPosition(1).wave_number,
    KinCycleEngine.calculateWavespellPosition(13).position,
    KinCycleEngine.calculateWavespellPosition(14).wave_number,
    KinCycleEngine.calculateWavespellPosition(260).wave_number,
  ],
  [1, 13, 2, 20],
);
assert.strictEqual(KinCycleEngine.constants.WAVESPELL_COUNT, 20);
assert.strictEqual(KinCycleEngine.constants.POSITIONS_PER_WAVESPELL, 13);

for (const leapDate of ["1988-02-29", "2000-02-29", "2024-02-29"]) {
  assert.strictEqual(
    ThirteenMoonsEngine.calculateForDate(leapDate).status,
    "fora_da_contagem",
    leapDate,
  );
  assert.strictEqual(
    SincronarioEngine.calculateKinForDate(leapDate).kin.status,
    "fora_da_contagem",
    leapDate,
  );
}

const kinEngineHash = crypto
  .createHash("sha256")
  .update(fs.readFileSync("src/domain/sincronario/engine.js"))
  .digest("hex");
assert.strictEqual(kinEngineHash, VALIDATED_KIN_ENGINE_SHA256);

const thirteenMoonsEngineHash = crypto
  .createHash("sha256")
  .update(fs.readFileSync("src/domain/sincronario/thirteen-moons-engine.js"))
  .digest("hex");
assert.strictEqual(thirteenMoonsEngineHash, VALIDATED_THIRTEEN_MOONS_ENGINE_SHA256);

const baseReading = SincronarioEngine.calculate({
  birthDate: "1980-12-30",
  currentDate: "2026-06-05",
  timezone: "date-only",
});
const coordinatedReading = CoordinatesEngine.enrichReading(baseReading);
assert.strictEqual(coordinatedReading.coordinates.birth.thirteen_moons.moon.name, "Lua Rítmica");
assert.strictEqual(coordinatedReading.coordinates.day.thirteen_moons.moon.name, "Lua Cristal");
assert.strictEqual(coordinatedReading.coordinates.birth.wavespell.wave_number, 19);
assert.strictEqual(coordinatedReading.coordinates.day.wavespell.position, 9);
assert.strictEqual(coordinatedReading.coordinates.synchronization.synchronizedKin, 154);

const workReading = SincronarioKnowledge.enrichReading(coordinatedReading, {
  focusArea: "work-prosperity",
});
const relationshipReading = SincronarioKnowledge.enrichReading(coordinatedReading, {
  focusArea: "love-relationships",
});

assert.deepStrictEqual(workReading.coordinates, relationshipReading.coordinates);
assert.notStrictEqual(
  workReading.guidance.interpretation.applicationSummary,
  relationshipReading.guidance.interpretation.applicationSummary,
);
assert.strictEqual(
  workReading.guidance.interpretation.coordinatesUsed.synchronizedKin,
  relationshipReading.guidance.interpretation.coordinatesUsed.synchronizedKin,
);
assert.ok(workReading.guidance.interpretation.applicationSummary.includes("Lua Cristal"));
assert.ok(workReading.guidance.interpretation.applicationSummary.includes("Semana Vermelha"));
assert.ok(workReading.guidance.interpretation.applicationSummary.includes("Silio"));
assert.ok(workReading.guidance.interpretation.applicationSummary.includes("Kin de navegação 154"));
assert.ok(!workReading.guidance.interpretation.applicationSummary.toLowerCase().includes("vai acontecer"));

console.log("thirteen-moons-engine tests passed");
