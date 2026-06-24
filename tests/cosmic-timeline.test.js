const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const { CosmicTimeline } = require("../src/domain/cosmic-timeline.js");

const created = CosmicTimeline.createEvent({
  eventId: "event-1",
  createdAt: "2026-06-07T12:00:00.000Z",
  title: "Inicio do meu negocio",
  eventDate: "2024-03-15",
  category: "Trabalho e Prosperidade",
  note: "Primeiro marco",
  personalKin: 168,
});

assert.strictEqual(created.status, "created");
assert.strictEqual(created.event.schemaVersion, "cosmic-timeline-event-v1");
assert.strictEqual(created.event.coordinatesSnapshot.kin, 146);
assert.strictEqual(created.event.coordinatesSnapshot.signature, "Branco Eletrico Enlacador de Mundos");
assert.strictEqual(created.event.coordinatesSnapshot.moon, "Lua Solar");
assert.strictEqual(created.event.coordinatesSnapshot.moonDay, 9);
assert.strictEqual(created.event.coordinatesSnapshot.chromaticWeek, "Semana Branca");
assert.strictEqual(created.event.coordinatesSnapshot.plasma, "Seli");
assert.strictEqual(created.event.coordinatesSnapshot.chakra, "Raiz");
assert.strictEqual(created.event.coordinatesSnapshot.waveSpell, "Onda Encantada do Semente");
assert.strictEqual(created.event.coordinatesSnapshot.wavePosition, 3);
assert.strictEqual(created.event.relationToPersonalKin.personalKin, 168);
assert.strictEqual(created.event.relationToPersonalKin.eventKin, 146);
assert.strictEqual(created.event.relationToPersonalKin.distance, 238);
assert.strictEqual(created.event.relationToPersonalKin.sameColor, false);
assert.strictEqual(created.event.relationToPersonalKin.sameTone, false);
assert.strictEqual(created.event.relationToPersonalKin.sameSeal, false);
assert.strictEqual(created.event.engineVersion, "0.4.0");
assert.strictEqual(created.event.thirteenMoonsEngineVersion, "0.1.0");

assert.strictEqual(CosmicTimeline.validateEventDate("2026-02-30").status, "invalid");
assert.strictEqual(CosmicTimeline.validateEventDate("2024-02-29").status, "pending_method_decision");
assert.strictEqual(CosmicTimeline.createEvent({
  title: "Invalido",
  eventDate: "2026-02-30",
  category: "Outro",
  personalKin: 168,
}).event, null);
assert.strictEqual(CosmicTimeline.createEvent({
  title: "Bloqueado",
  eventDate: "2024-02-29",
  category: "Outro",
  personalKin: 168,
}).event, null);

const repeatedWeekEvents = [
  created.event,
  CosmicTimeline.createEvent({
    eventId: "event-2",
    title: "Evento 2",
    eventDate: "2024-03-16",
    category: "Outro",
    personalKin: 168,
  }).event,
  CosmicTimeline.createEvent({
    eventId: "event-3",
    title: "Evento 3",
    eventDate: "2024-05-10",
    category: "Outro",
    personalKin: 168,
  }).event,
];
const patterns = CosmicTimeline.analyzePatterns(repeatedWeekEvents);
assert.strictEqual(patterns.eligible, true);
assert.ok(patterns.repeated.some((item) => item.field === "chromaticWeek" && item.count >= 2));
assert.strictEqual(CosmicTimeline.analyzePatterns(repeatedWeekEvents.slice(0, 2)).eligible, false);
assert.strictEqual(
  CosmicTimeline.normalizeEvents([created.event, created.event]).length,
  1,
);

const expectedHashes = {
  "src/domain/sincronario/engine.js": "617686B2CBD2CB8D0DFA87B525835831D29E2B0E54D99E8CB31F989D6B79D961",
  "src/domain/sincronario/kin-cycle-engine.js": "B84DEDF4426A470FC8B5ED16097070C0D4E72C8042BE6F11AC1A409F9C9D4631",
  "src/domain/sincronario/thirteen-moons-engine.js": "7905EA2D90419352DA11AB71684B3FA4CACD22C89B90D9B6C5A71AC5F5F3E4A1",
};

for (const [file, expectedHash] of Object.entries(expectedHashes)) {
  const actualHash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
  assert.strictEqual(actualHash, expectedHash, `${file} must remain unchanged`);
}

console.log("cosmic-timeline tests passed");
