export const getAvailableStorage = data => {
  let storageTotal = 0;
  let alreadyUsedStorage = 0;
  data.forEach(item => {
    if (item.name !== 'total') {
      alreadyUsedStorage += Number(item.storageTotal);
    } else {
      storageTotal = Number(item.storageTotal);
    }
  });
  return storageTotal - alreadyUsedStorage;
};

export const getAvailableMemory = data => {
  let memoryTotal = 0;
  let alreadyUsedMemory = 0;
  data.forEach(item => {
    if (item.name !== 'total') {
      alreadyUsedMemory += Number(item.memoryTotal);
    } else {
      memoryTotal = Number(item.memoryTotal);
    }
  });
  return memoryTotal - alreadyUsedMemory;
};

export const getAvailableCPU = data => {
  let cpuTotal = 0;
  let alreadyUsedCPU = 0;
  data.forEach(item => {
    if (item.name !== 'total') {
      alreadyUsedCPU += Number(item.cpuTotal);
    } else {
      cpuTotal = Number(item.cpuTotal);
    }
  });
  return cpuTotal - alreadyUsedCPU;
};

export const getAvailableGPU = data => {
  let gpuTotal = {};
  const gpuOther = [];
  const alreadyUsedCPU = {};
  data.forEach( item => {
    if (item.name === 'total') {
      gpuTotal = item.gpuTotal;
      gpuTotal.forEach( gpu => {
        alreadyUsedCPU[gpu.name] = gpu.number;
      });
    } else {
      gpuOther.push(item);
    }
  });
  const availableGpu = gpuOther.reduce((prev, vgInfo) => {
    if (vgInfo.name !== 'total') {
      vgInfo.gpuTotal.forEach(gpuInfo => {
        prev[gpuInfo.name] -= parseInt(gpuInfo.number);
      });
    }
    return prev;
  }, { ...alreadyUsedCPU });
  return availableGpu;
};

export const orderData = data => {
  if (data.length > 0) {
    const summary = data.reduce((acc, curr) => {
      if (curr.name === 'total') return acc
      
      const gpuUsed = curr.gpuUsed.reduce((sum, now) => {
        const findData = sum.find(item => item.name === now.name)
        if (!findData) return [...sum, { ...now }]

        return sum.map(item => {
          if (item.name === now.name) return {
            ...item,
            number: Number(now.number) + Number(item.number)
          }

          return { ...item }
        })
      }, acc.gpuUsed)

      return {
        cpuUsed: acc.cpuUsed + Number(curr.cpuUsed),
        memoryUsed: acc.memoryUsed + Number(curr.memoryUsed),
        storageUsed: acc.storageUsed + Number(curr.storageUsed),
        gpuUsed
      }
    }, { cpuUsed: 0, memoryUsed: 0, gpuUsed: [], storageUsed: 0 })

    const returnData = data.map(item => {
      if (item.name === 'total') {
        return { ...item, ...summary }
      }
      return { ...item }
    })

    const total = returnData.find(item => item.name === 'total');

    return [total, ...returnData.filter(item => item.name !== 'total').sort((a, b) => String(a.name).localeCompare(b.name))]
  }
}
