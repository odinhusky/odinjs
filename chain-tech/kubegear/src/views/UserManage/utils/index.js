export const addDropDownOptionKeys = (optionItems, defaultSelect) => {
  if (defaultSelect !== undefined) {
    return [defaultSelect, ...optionItems].map((item, index) => ({
      key: index,
      text: item.name,
      data: item.data,
      ...item
    }));
  } else {
    return optionItems.map((item, index) => ({
      key: index,
      text: item.name,
      data: item.data,
      ...item
    }));
  }
};

export const selectColor = key => {
  const state = ['all', 'accept', 'pending', 'deny'];
  const colors = ['blue', 'green', 'orange', 'red'];
  return colors[state.indexOf(key)];
};

export const parseVGInfos = (vgInfos) => {
  return vgInfos.map(vgInfo => {
    vgInfo.memoryTotal = parseInt(vgInfo.memoryTotal);
    vgInfo.memoryUsed = parseInt(vgInfo.memoryUsed);
    vgInfo.storageTotal = parseInt(vgInfo.storageTotal);
    vgInfo.storageUsed = parseInt(vgInfo.storageUsed);
    vgInfo.cpuTotal = parseInt(vgInfo.cpuTotal);
    vgInfo.cpuUsed = parseInt(vgInfo.cpuUsed);
    vgInfo.gpuTotal = vgInfo.gpuTotal.map(gpuInfo => {
      gpuInfo.number = parseInt(gpuInfo.number);
      return gpuInfo;
    });
    vgInfo.gpuUsed = vgInfo.gpuUsed.map(gpuInfo => {
      gpuInfo.number = parseInt(gpuInfo.number);
      return gpuInfo;
    });

    return vgInfo;
  });
}
