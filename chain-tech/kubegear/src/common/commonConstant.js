// $ Regex
const TEXT_FILED_REGX = /^[a-zA-Z][a-zA-Z0-9]*$/;
const NUMBER_REGEX = /^[0-9]+$/;

// # RWD Ratio
const ratio64 = (bool) => (bool ? 6 : 4)
const ratio54 = (bool) => (bool ? 5 : 4)
const ratio24 = (bool) => (bool ? 2 : 4)

// ? Constant
const maxSafeNumber = 9007199254740991;

// * Unit
const CPUUnit = 'vcpu';
const GPUUnit = 'vgpu';
const MemoryUnit = 'MB';
const GPUMemoryPercentageUnit = '%';

export {
  // $ regex ================
  TEXT_FILED_REGX,
  NUMBER_REGEX,
  // # RWD Ratio ================
  ratio64,
  ratio54,
  ratio24,
  // ? Constant ================
  maxSafeNumber,
  // * Unit ================
  CPUUnit,
  GPUUnit,
  MemoryUnit,
  GPUMemoryPercentageUnit
}