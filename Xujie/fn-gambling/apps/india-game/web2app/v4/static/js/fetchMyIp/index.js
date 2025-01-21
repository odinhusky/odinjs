async function fetchMyIp() {
  const apis = [
    'https://api.ip.sb/geoip',
    'https://api.db-ip.com/v2/free/self',
  ];

  try {
    // 封装 fetch 请求
    const requests = apis.map(url => fetch(url).then(res => res.json()));

    // 使用 Promise.race，返回第一个成功的请求结果，且包含 country 或 countryName
    const response = await Promise.race(requests.map(req =>
      req.then(data => {
        // 检查 country 或 countryName 是否存在
        if (data.country || data.countryName) {
          return data;
        }
        return null; // 返回 null 表示无效结果
      }).catch(() => null) // 捕获并忽略任何请求错误
    ));

    let ip = '';
    let country = '';

    // 提取 IP 地址和国家信息
    if (response.ip) {
      ip = response.ip; // 來自 api.ip.sb 或 iplocate.io
    } else if (response.ipAddress) {
      ip = response.ipAddress; // 來自 api.db-ip.com
    }

    // 提取 country 或 countryName
    country = response?.country || response?.countryName || '';

    return {ip, country};
  } catch (error) {
    console.error('Error fetching IP:', error);
    return {ip: '', country: ''};
  }
}

//
// // 调用函数
// fetchMyIp();
