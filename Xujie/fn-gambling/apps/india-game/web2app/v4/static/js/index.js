// import '/sa-sdk-javascript/core/sensorsdata.min.js'

// var sensors = window['sensorsDataAnalytic201505'];
// function sensorsDataInit(envName) {
//   sensors.init({
//     sdk_url: './sa-sdk-javascript/sensorsdata.min.js', // sensorsdata.min.js 文件的地址(github下载 https://github.com/sensorsdata/sa-sdk-javascript)
//     server_url: `https://bi.game-strategy.vip/pixel?app=${envName}`, // 数据接收地址 Evan
//     // server_url: `${window.location.origin}${VITE_SENSOR_SERVER_URL}/?shopName=${VITE_COUNTRY_CODE.toLowerCase()}_${DEV === true ? 'dev_' : ''}${VITE_PACKAGENAME}`, // 数据接收地址 Evan
//     app_js_bridge: false, // App是否打通H5
//     is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
//     use_client_time: true,
//     send_type: 'image', // 表示使用 beacon 请求方式发数据，可选使用 'image' 图片 get 请求方式发数据。( 神策系统 1.10 版本以后 ) 支持使用 'ajax' 和 'beacon' 方式发送数据，这两种默认都是 post 方式， beacon 方式兼容性较差。
//     show_log: true, // 设置 true 后会在网页控制台打 logger，会显示发送的数据,设置 false 表示不显示。
//     debug_mode: false,
//     heatmap: {
//       /**
//        * 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
//        * 默认只有点击 a input button textarea 四种元素时，才会触发 $WebClick 元素点击事件
//        */
//       clickmap: 'not_collect',
//       /**
//        * 是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
//        * 默认的 4 秒或者自定义的时间是有效停留
//        */
//       scroll_notice_map: 'not_collect',
//       // 全埋点不建议超过3个任意元素标签
//       collect_tags: {
//         /**
//          * 开启div的采集，两个条件：
//          * 1 div 为叶子结点（无子元素）时采集 div 的点击；
//          * 2 div 中有且只有样式标签（['mark','strong','b','em','i','u','abbr','ins','del','s','sup']）时，点击 div 或者样式标签都采集 div 的点击
//          */
//         div: true,
//       },
//     },
//     scrollmap: {
//       // collect_url: function () {} // 默认采集所有页面
//     },
//     preset_properties: {
//       //是否采集 $latest_utm 最近一次广告系列相关参数，默认值 true。
//       latest_utm: false,
//       //是否采集 $latest_referrer 最近一次前向地址，默认值 true。
//       latest_referrer: false,
//       //是否采集 $latest_referrer_host 最近一次前向地址，1.14.8 以下版本默认是true，1.14.8 及以上版本默认是 false，需要手动设置为 true 开启。
//       latest_referrer_host: false,
//       //是否采集 $latest_traffic_source_type 最近一次流量来源类型，默认值 true。
//       latest_traffic_source_type: false,
//       //是否采集 $latest_search_keyword 最近一次搜索引擎关键字，默认值 true。
//       latest_search_keyword: false,
//     },
//   });
//   // /**
//   //  * 用于采集 $pageview 事件。
//   //  * 设置之后，SDK 就会自动收集页面浏览事件，以及设置初始来源。
//   //  * 如果想加额外的属性，可以如下方式（添加 platform 属性为 h5）
//   //  */
//   // js.quick("autoTrack", {
//   //   // platform:'h5'
//   // });
// }
//
// function sensorsDataTrack(event, data) {
//   sensors.track(event, data);
// }

/**
 * 生成頂級域名
 * @returns {string}
 */
function generateTopDomain() {
  // Use the URL object to parse the URL and get the hostname
  const hostname = window.location.hostname;
  // Split the hostname by '.'
  const parts = hostname.split('.');
  // If the hostname has more than two parts, it has a subdomain
  if (parts.length > 2) {
    const rootDomain = parts.slice(parts.length - 2).join('.');
    return 'https://' + rootDomain;
  }
  return window.location.origin;
}

function generateRandomPath(length = 5) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
