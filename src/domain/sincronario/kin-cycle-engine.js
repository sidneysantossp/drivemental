(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }

  root.DriveAstralKinCycle = factory().KinCycleEngine;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const ENGINE_VERSION = "0.1.0";

  function calculateWavespellPosition(kin) {
    if (!Number.isInteger(kin) || kin < 1 || kin > 260) {
      return {
        status: "invalido",
        kin: Number.isInteger(kin) ? kin : null,
        wave_number: null,
        position: null,
        tone: null,
      };
    }

    const waveNumber = Math.floor((kin - 1) / 13) + 1;
    const position = ((kin - 1) % 13) + 1;

    return {
      status: "calculado",
      classification: "estrutural",
      kin,
      wave_number: waveNumber,
      position,
      tone: position,
      start_kin: ((waveNumber - 1) * 13) + 1,
      end_kin: waveNumber * 13,
      rule_id: "wavespell-position-by-groups-of-13-v0.1",
    };
  }

  return {
    KinCycleEngine: {
      calculateWavespellPosition,
      constants: {
        ENGINE_VERSION,
        WAVESPELL_COUNT: 20,
        POSITIONS_PER_WAVESPELL: 13,
      },
    },
  };
});
