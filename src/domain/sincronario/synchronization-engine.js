(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }

  root.DriveAstralSynchronization = factory().SynchronizationEngine;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const ENGINE_VERSION = "0.1.0";

  function validKin(kin) {
    return Number.isInteger(kin) && kin >= 1 && kin <= 260;
  }

  function reduceKinSum(rawSum) {
    return ((rawSum - 1) % 260) + 1;
  }

  function calculateDailySynchronization(personalKin, dayKin) {
    if (!validKin(personalKin) || !validKin(dayKin)) {
      return {
        status: "invalido",
        personalKin,
        dayKin,
        rawSum: null,
        synchronizedKin: null,
        reductionApplied: false,
        reductions: 0,
      };
    }

    const rawSum = personalKin + dayKin;
    const reductions = Math.floor((rawSum - 1) / 260);

    return {
      status: "calculado",
      classification: "matematico",
      personalKin,
      dayKin,
      rawSum,
      synchronizedKin: reduceKinSum(rawSum),
      reductionApplied: reductions > 0,
      reductions,
      rule_id: "daily-kin-sum-reduction-v0.1",
      safety_note: "Este resultado é uma coordenada simbólica, não uma previsão.",
    };
  }

  function calculateHarmonicKin(kins) {
    if (!Array.isArray(kins) || !kins.length || !kins.every(validKin)) {
      return {
        status: "invalido",
        kins: Array.isArray(kins) ? [...kins] : [],
        rawSum: null,
        harmonicKin: null,
        reductionApplied: false,
        reductions: 0,
      };
    }

    const rawSum = kins.reduce((sum, kin) => sum + kin, 0);
    const reductions = Math.floor((rawSum - 1) / 260);

    return {
      status: "calculado",
      classification: "matematico",
      kins: [...kins],
      rawSum,
      harmonicKin: reduceKinSum(rawSum),
      reductionApplied: reductions > 0,
      reductions,
      rule_id: "harmonic-kin-sum-reduction-v0.1",
    };
  }

  return {
    SynchronizationEngine: {
      calculateDailySynchronization,
      calculateHarmonicKin,
      constants: {
        ENGINE_VERSION,
        KIN_CYCLE_SIZE: 260,
      },
    },
  };
});
