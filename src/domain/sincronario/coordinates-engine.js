(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    const { ThirteenMoonsEngine } = require("./thirteen-moons-engine.js");
    const { KinCycleEngine } = require("./kin-cycle-engine.js");
    const { SynchronizationEngine } = require("./synchronization-engine.js");
    module.exports = factory(ThirteenMoonsEngine, KinCycleEngine, SynchronizationEngine);
    return;
  }

  root.DriveAstralCoordinates = factory(
    root.DriveAstralThirteenMoons,
    root.DriveAstralKinCycle,
    root.DriveAstralSynchronization,
  ).CoordinatesEngine;
})(typeof globalThis !== "undefined" ? globalThis : this, function (
  ThirteenMoonsEngine,
  KinCycleEngine,
  SynchronizationEngine,
) {
  const ENGINE_VERSION = "0.1.0";

  function kinValue(container, field) {
    return container && container[field] && Number.isInteger(container[field].value)
      ? container[field].value
      : null;
  }

  function calculateCoordinates(input) {
    const birthDate = input && input.birthDate;
    const currentDate = input && input.currentDate;
    const personalKin = input && input.personalKin;
    const dayKin = input && input.dayKin;

    return {
      engine: {
        name: "drive-astral-coordinates-engine",
        version: ENGINE_VERSION,
      },
      birth: {
        date: birthDate || null,
        thirteen_moons: ThirteenMoonsEngine.calculateForDate(birthDate),
        wavespell: KinCycleEngine.calculateWavespellPosition(personalKin),
      },
      day: {
        date: currentDate || null,
        thirteen_moons: ThirteenMoonsEngine.calculateForDate(currentDate),
        wavespell: KinCycleEngine.calculateWavespellPosition(dayKin),
      },
      synchronization: SynchronizationEngine.calculateDailySynchronization(personalKin, dayKin),
      future_architecture: {
        harmonic_kin: "prepared_in_synchronization_engine",
        cosmic_timeline: "documented_for_future_interface",
      },
    };
  }

  function enrichReading(reading) {
    if (!reading || typeof reading !== "object") {
      return reading;
    }

    const birthDate = reading.input && reading.input.birth_date
      ? reading.input.birth_date.value
      : null;
    const currentDate = reading.input && reading.input.current_date
      ? reading.input.current_date.value
      : null;
    const personalKin = kinValue(reading.personal_map, "kin");
    const dayKin = kinValue(reading.daily, "kin_of_day");

    return {
      ...reading,
      coordinates: calculateCoordinates({
        birthDate,
        currentDate,
        personalKin,
        dayKin,
      }),
    };
  }

  return {
    CoordinatesEngine: {
      calculateCoordinates,
      enrichReading,
      constants: {
        ENGINE_VERSION,
      },
    },
  };
});
