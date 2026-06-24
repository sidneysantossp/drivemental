(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    const { SincronarioEngine } = require("./sincronario/engine.js");
    const { ThirteenMoonsEngine } = require("./sincronario/thirteen-moons-engine.js");
    const { KinCycleEngine } = require("./sincronario/kin-cycle-engine.js");
    module.exports = factory(SincronarioEngine, ThirteenMoonsEngine, KinCycleEngine);
    return;
  }

  root.DriveAstralCosmicTimeline = factory(
    root.DriveAstralSincronario,
    root.DriveAstralThirteenMoons,
    root.DriveAstralKinCycle,
  ).CosmicTimeline;
})(typeof globalThis !== "undefined" ? globalThis : this, function (
  SincronarioEngine,
  ThirteenMoonsEngine,
  KinCycleEngine,
) {
  const MODULE_VERSION = "0.1.0";
  const EVENT_SCHEMA_VERSION = "cosmic-timeline-event-v1";

  function validateEventDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) {
      return { status: "invalid" };
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      year < 1
      || date.getUTCFullYear() !== year
      || date.getUTCMonth() !== month - 1
      || date.getUTCDate() !== day
    ) {
      return { status: "invalid" };
    }

    if (month === 2 && day === 29) {
      return { status: "pending_method_decision" };
    }

    return { status: "valid" };
  }

  function createEventId() {
    if (
      typeof globalThis !== "undefined"
      && globalThis.crypto
      && typeof globalThis.crypto.randomUUID === "function"
    ) {
      return globalThis.crypto.randomUUID();
    }

    return `event-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function emptyRelation(personalKin, eventKin) {
    return {
      personalKin: Number.isInteger(personalKin) ? personalKin : null,
      eventKin: Number.isInteger(eventKin) ? eventKin : null,
      distance: null,
      sameColor: null,
      sameTone: null,
      sameSeal: null,
      relationshipKey: null,
      relationshipLabel: null,
    };
  }

  function relationSnapshot(personalKin, eventKin) {
    if (!Number.isInteger(personalKin) || !Number.isInteger(eventKin)) {
      return emptyRelation(personalKin, eventKin);
    }

    const relation = SincronarioEngine.calculateRelationshipForKins(personalKin, eventKin);
    if (!relation || relation.status !== "derivado") {
      return emptyRelation(personalKin, eventKin);
    }

    return {
      personalKin,
      eventKin,
      distance: relation.deltas ? relation.deltas.kin_forward : null,
      sameColor: Boolean(relation.matches && relation.matches.same_color),
      sameTone: Boolean(relation.matches && relation.matches.same_tone),
      sameSeal: Boolean(relation.matches && relation.matches.same_seal),
      relationshipKey: relation.value || null,
      relationshipLabel: relation.label || null,
    };
  }

  function createEvent(input) {
    const eventDate = String(input && input.eventDate || "").trim();
    const validation = validateEventDate(eventDate);
    if (validation.status !== "valid") {
      return { status: validation.status, event: null };
    }

    const kinResult = SincronarioEngine.calculateKinForDate(eventDate);
    const thirteenMoons = ThirteenMoonsEngine.calculateForDate(eventDate);
    const eventKin = kinResult && kinResult.kin ? kinResult.kin.value : null;

    if (!Number.isInteger(eventKin) || !thirteenMoons || !String(thirteenMoons.status).startsWith("calculado")) {
      return { status: "invalid", event: null };
    }

    const wave = KinCycleEngine.calculateWavespellPosition(eventKin);
    const waveSeal = kinResult.wavespell && kinResult.wavespell.seal
      ? kinResult.wavespell.seal.name
      : null;
    const createdAt = input && input.createdAt
      ? String(input.createdAt)
      : new Date().toISOString();

    return {
      status: "created",
      event: {
        eventId: input && input.eventId ? String(input.eventId) : createEventId(),
        schemaVersion: EVENT_SCHEMA_VERSION,
        createdAt,
        title: String(input && input.title || "").trim(),
        eventDate,
        category: String(input && input.category || "").trim(),
        note: String(input && input.note || "").trim(),
        coordinatesSnapshot: {
          kin: eventKin,
          signature: kinResult.signature ? kinResult.signature.value : null,
          moon: thirteenMoons.is_day_out_of_time
            ? "Dia Fora do Tempo"
            : thirteenMoons.moon && thirteenMoons.moon.name,
          moonDay: thirteenMoons.moon_day,
          chromaticWeek: thirteenMoons.chromatic_week
            ? thirteenMoons.chromatic_week.name
            : null,
          plasma: thirteenMoons.plasma ? thirteenMoons.plasma.name : null,
          chakra: thirteenMoons.chakra ? thirteenMoons.chakra.label : null,
          waveSpell: waveSeal ? `Onda Encantada do ${waveSeal}` : null,
          wavePosition: wave && wave.status === "calculado" ? wave.position : null,
        },
        relationToPersonalKin: relationSnapshot(input && input.personalKin, eventKin),
        engineVersion: kinResult.engine && kinResult.engine.version
          ? kinResult.engine.version
          : SincronarioEngine.constants.ENGINE_VERSION,
        thirteenMoonsEngineVersion: thirteenMoons.engine
          ? thirteenMoons.engine.version
          : ThirteenMoonsEngine.constants.ENGINE_VERSION,
        timelineModuleVersion: MODULE_VERSION,
      },
    };
  }

  function normalizeEvent(event) {
    if (
      !event
      || typeof event !== "object"
      || !event.eventId
      || event.schemaVersion !== EVENT_SCHEMA_VERSION
      || !event.coordinatesSnapshot
      || !event.relationToPersonalKin
    ) {
      return null;
    }

    return event;
  }

  function normalizeEvents(events) {
    const seen = new Set();

    return (Array.isArray(events) ? events : [])
      .map(normalizeEvent)
      .filter((event) => {
        if (!event || seen.has(event.eventId)) {
          return false;
        }
        seen.add(event.eventId);
        return true;
      });
  }

  function mostFrequent(events, field) {
    const counts = new Map();

    events.forEach((event) => {
      const value = event.coordinatesSnapshot && event.coordinatesSnapshot[field];
      if (value) {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    });

    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1] || String(left[0]).localeCompare(String(right[0])))[0]
      || null;
  }

  function analyzePatterns(events) {
    const normalized = normalizeEvents(events);
    if (normalized.length < 3) {
      return {
        eligible: false,
        eventCount: normalized.length,
        repeated: [],
      };
    }

    const repeated = ["chromaticWeek", "moon", "chakra"]
      .map((field) => {
        const result = mostFrequent(normalized, field);
        return result && result[1] >= 2
          ? { field, value: result[0], count: result[1] }
          : null;
      })
      .filter(Boolean);

    return {
      eligible: true,
      eventCount: normalized.length,
      repeated,
    };
  }

  return {
    CosmicTimeline: {
      createEvent,
      validateEventDate,
      normalizeEvent,
      normalizeEvents,
      analyzePatterns,
      constants: {
        MODULE_VERSION,
        EVENT_SCHEMA_VERSION,
      },
    },
  };
});
