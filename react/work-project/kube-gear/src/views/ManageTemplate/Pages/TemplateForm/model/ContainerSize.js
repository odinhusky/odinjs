import { isNil } from 'lodash';

const skuUnit = {
  gpu: 0,
  cpu: 0,
  memoryMB: 0
};

export function getDefaultContainerSize(gpu) {
  if (isNil(gpu)) {
    gpu = 0;
  }
  // const factor = Math.max(gpu, 1);
  return {
    gpu,
    cpu: skuUnit.cpu,
    memoryMB: skuUnit.memoryMB
    // storageGB: 5
  };
}

export function isDefaultContainerSize(size) {
  const factor = Math.max(size.gpu, 1);
  return size.cpu === skuUnit.cpu * factor && size.memoryMB === size.memoryMB * factor;
}
