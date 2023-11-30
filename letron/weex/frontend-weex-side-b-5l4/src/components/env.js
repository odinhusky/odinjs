
import handleConfig from "./remoteconfig.js"

const config = {}

config.web  = 'https://proveshitli.xyz'

let id = 7
let channels = [
  {
    id: "1",
    ios: "5l3-ios2",
    verIndex: 4020011,
    version: "4.2.11",
    hard: "五楼直播",
    brand: "5",
    mycolor: "#07C160",
    agreement: "qlfrgrpn5l29.cc",
    aboutLogo: "static/__ag__logo1__.png",
    loadLogo: "static/loader-logo.png",
    line: "static/lines.png",
    code: "wl3",
    iconfont: "iconfont",
  },
  {
    id: "2",
    ios: "hb3-ios",
    verIndex: 4020037,
    version: "4.2.37",
    hard: "白黑体育",
    brand: "hb",
    mycolor: "#FF3551",
    agreement: "rzpxhewb5l210.cc",
    aboutLogo: "static/__ag__logobh__.png",
    loadLogo: "static/loader-logohb.png",
    line: "static/line.png",
    code: "hb3",
    iconfont: "iconfont",
  },
  {
    id: "3",
    ios: "hb4-ios",
    verIndex: 4070022,
    version: "4.7.22",
    hard: "抓饭直播",
    brand: "hb",
    mycolor: "#ffffff",
    agreement: "rzpxhewb5l210.cc",
    aboutLogo: "static/hb4-logo.png",
    loadLogo: "static/loader-logohb.png",
    line: "static/line.png",
    code: "zfv2",
  },
  {
    id: "4",
    ios: "hb4-iosb2",
    verIndex: 4080004,
    version: "4.8.4",
    hard: "抓饭直播",
    brand: "hb",
    mycolor: "#FF3551",
    agreement: "penentblacm2.xyz",
    aboutLogo: "static/zf-logo2.png",
    loadLogo: "static/loader-logohb.png",
    line: "static/line.png",
    code: "zfv2",
    iconfont: "zfv2",
  },
  {
    id: "5",
    ios: "hb5-ios",
    verIndex: 4070020,
    version: "4.7.20",
    hard: "黑白直播",
    brand: "hb",
    mycolor: "#FF3551",
    agreement: "rzpxhewb5l210.cc",
    aboutLogo: "static/hb5-logo3.png",
    loadLogo: "static/loader-logohb.png",
    line: "static/line.png",
    code: "hb5",
    iconfont: "hb5v2",
  },
  {
    id: "6",
    ios: "hb8-ios",
    verIndex: 4070040,
    version: "4.7.40",
    hard: "黑白直播",
    brand: "hb",
    mycolor: "#FF3551",
    agreement: "rzpxhewb5l210.cc",
    aboutLogo: "static/hb8/logo2.png",
    loadLogo: "static/loader-logohb.png",
    line: "static/line.png",
    code: "hb8v2",
    iconfont: "hb8v2",
  },
  {
    id: "7",
    ios: "5l4-ios",
    verIndex: 4050001,
    version: "4.5.1",
    hard: "五楼直播",
    brand: "5",
    mycolor: "#07C160",
    agreement: "nturystyme32.xyz",
    aboutLogo: "static/5l4/logo.png",
    loadLogo: "static/loader-logo.png",
    line: "static/lines.png",
    code: "wl4",
    iconfont: "iconfont",
    isDynamicDomain: false,
    // # dev
    host: "api.5l-dev.landingmakljdh.xyz",
    portalMHost: "apnxhmvrd783.xyz",
    fileHost: "5l-dev.landingmakljdh.xyz",
    rcurl1:
      "https://l5-cfg-01.oss-accelerate.aliyuncs.com/735q92pm76CCJDWXlhrRd.s",
    rcurl2:
      "https://l5-cfg-01-1314527561.cos.accelerate.myqcloud.com/735q92pm76CCJDWXlhrRd.s",
    rcurl3: "https://l5-cfg-01.s3-cn-east-7.wcsapi.com/735q92pm76CCJDWXlhrRd.s",
    // & qa
    // host: "api.5l-qa.landingmakljdh.xyz",
    // portalMHost: "apnxhmvrd783.xyz",
    // fileHost: "5l-qa.landingmakljdh.xyz",
    // rcurl1:
    //   "https://l5-cfg-01.oss-accelerate.aliyuncs.com/N35F635HfCbKgHMyrlJtq.s",
    // rcurl2:
    //   "https://l5-cfg-01-1314527561.cos.accelerate.myqcloud.com/N35F635HfCbKgHMyrlJtq.s",
    // rcurl3: "https://l5-cfg-01.s3-cn-east-7.wcsapi.com/N35F635HfCbKgHMyrlJtq.s",
    // $ uat
    // host: "api.apkuo4ujy5118.xyz",
    // portalMHost: "apnxhmvrd783.xyz",
    // fileHost: "apkuo4ujy5118.xyz",
    // rcurl1:
    //   "https://l5-cfg-01.oss-accelerate.aliyuncs.com/ru5LaRmzQvJsL72CmldKu.s",
    // rcurl2:
    //   "https://l5-cfg-01-1314527561.cos.accelerate.myqcloud.com/ru5LaRmzQvJsL72CmldKu.s",
    // rcurl3: "https://l5-cfg-01.s3-cn-east-7.wcsapi.com/ru5LaRmzQvJsL72CmldKu.s",
    // - prod
    // host: "apip.ap5mw4r28p90.xyz",
    // portalMHost: "apnxhmvrd783.xyz",
    // fileHost: "5r.ruickejiwang886.com",
    // rcurl1:
    //   "https://l5-cfg-01.oss-accelerate.aliyuncs.com/mh5Sa8K2m8uWs97Sal4p.s",
    // rcurl2:
    //   "https://l5-cfg-01-1314527561.cos.accelerate.myqcloud.com/mh5Sa8K2m8uWs97Sal4p.s",
    // rcurl3: "https://l5-cfg-01.s3-cn-east-7.wcsapi.com/mh5Sa8K2m8uWs97Sal4p.s",
  },
]
config.id = id
config.channel = channels[id-1]
let m = channels[id-1]
// 4 00 00010
config.verIndex = m.verIndex
config.version = m.version
config.code = m.code
config.iconfont = m.iconfont
config.hard = m.hard
config.brand = m.brand
config.aboutLogo = m.aboutLogo
config.loadLogo = m.loadLogo
config.line = m.line
// ozmktoly5l24.cc
// api.landmarkhb.com
// api2.mixiangchina.com
// api.qlfrgrpn5l29.cc 五楼提审
// api.rzpxhewb5l210.cc 白黑提审

let host = null;
let fileHost = null;
let portalHost = null

if(m.brand === '5') {
  host = m.host
  fileHost = m.fileHost
  portalHost = m.portalMHost
} else {
  host = "apiv2.jsmmr.com"
  fileHost =  "apiv2.jsmmr.com"
  portalHost = "apiv2.jsmmr.com"

}

// let host = m.brand == "5" ? "ap5mw4r28p90.xyz" : "jsmmr.com"
// let prefix = m.brand == "5" ? "apip" : "apiv2"
// const fileHost = "5r.ruickejiwang886.com"

// let host = m.brand == '5' ? 'mixiangchina.com' : 'jsmmr.com'
// let  prefix = m.brand == '5' ? 'api2' : 'apiv2'
// 文件上传，冷重启 全屏 投屏 手机顶部字体颜色 声音提醒

if (process.env.NODE_ENV == 'development') {
	// host = "landmarkhb.com"
	// prefix = "api"
}

config.agreement = m.agreement
config.host = `https://${host}`
config.portal = `https://m.${portalHost}`
config.upload = `https://${host}/api?method=upload`
config.download = `https://file.${fileHost}/file/`


if (process.env.NODE_ENV == 'development') {
	// let ip = '192.168.31.201'
	// let ip = '192.168.31.172'
	// config.host = `http://${ip}:60400`
}

if (m.isDynamicDomain) {

  const asyncFn = async () => {
    const { rmConf } = await handleConfig(m)

    config.rmConf = rmConf
    //  config.stream = stream
    config.host = rmConf.host
    config.portal = rmConf.portalM
    config.upload = rmConf.upload
    config.download = `${rmConf.download}file/`
  }
  asyncFn()
}

export default config