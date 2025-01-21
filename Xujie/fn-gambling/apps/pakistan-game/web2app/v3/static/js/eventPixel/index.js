async function  useEventPixel(request) {

  // 請求參數
  // {
  //   "vendorPixelID": "772246788003043",
  //   "vendorAccesToken": "EAAY1KPxaw7MBO0d8jbdSjEO3Km0Ot18xXPlp1eCSS6qkPi3SLF4TTyJIgu2aRfbCObi1insyn8uZA1qoFJO4QTbrg9HHfaewuUorrFrT7boO7HZCf0Qv3iJXz3ZBfMlZBacVIW2RIXoM3FxeSOk1ykOYZBzvqP0UvCU9HMsKF62WcxtU4NSPNOZCZAICdecyQyyjQZDZD",
  //   "eventName": "Download",
  //   "fbp": "fb.1.1698120531255.2104012279",
  //   "fbc": "fb.1.1698120531248.IwAR0lUprZ0MWXmCP-BIzIDPFnVRxMogqWaI67eS7d2-tbjyeof0x9yMkeQb8_aem_AZtVviKzy3TNQmv1aaPwaSCX-_HqqGWgTqnSJCtY2LTx89qMRagHu7_DNbSQnycnXYtJXOEnQJz1qAQ3WfIF5LMe",
  //   "ip": "129.123.1.12"
  // }

  const url = `${window.location.origin}/v2/api/event/pixel`;
  const myIp = await fetchMyIp();

  console.log('@@==> EventPixel, IP Address:', myIp.ip);
  console.log('@@==> EventPixel, requestBody:', request);
  const data = {
    ...request,
    'ip': myIp.ip
  }
  console.log('@@==> EventPixel, requestBody:', data);
  fetch(url, {
    method: 'POST', // 指定请求方法为 POST
    headers: {
      'Content-Type': 'application/json' // 请求头，指定发送的是 JSON 数据
    },
    body: JSON.stringify(data) // 将 JavaScript 对象转换为 JSON 字符串
  }).then(resp => {
    console.log('@@==> EventPixel, event/pixel resp:', resp);
  })

}
