
import handleConfig from "./remoteconfig.js"

const config = {}

config.web  = 'https://proveshitli.xyz'

let id = 9
let channels = [
  {
    id: "1",
    ios: "5l3-ios2",
    verIndex: 4020018,
    version: "4.2.18",
    hard: "五楼直播",
    brand: "5",
    mycolor: "#07C160",
    agreement: "qlfrgrpn5l29.cc",
    aboutLogo: "static/__ag__logo1__.png",
    loadLogo: "static/loader-logo.png",
    line: "static/lines.png",
    code: "wl3",
    iconfont: "iconfont",
    host: "mixiangchina.com",
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
    host: "jsmmr.com",
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
    host: "jsmmr.com",
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
    host: "jsmmr.com",
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
    host: "jsmmr.com",
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
    host: "jsmmr.com",
  },
  {
    id: "7",
    ios: "5l4-ios",
    verIndex: 4040000,
    version: "4.4.0",
    hard: "五楼直播",
    brand: "5",
    mycolor: "#07C160",
    agreement: "nturystyme32.xyz",
    aboutLogo: "static/5l4/logo.png",
    loadLogo: "static/loader-logo.png",
    line: "static/lines.png",
    code: "wl4",
    iconfont: "iconfont",
    host: "mixiangchina.com",
  },
  {
    id: "8",
    ios: "bl-ios",
    verIndex: 5010001,
    version: "5.1.1",
    hard: "播龙体育",
    brand: "bl",
    mycolor: "#FCC400",
    agreement: "liosIsraelt.xyz",
    aboutLogo: "static/bl/logo.png",
    loadLogo: "static/bl/loader-logo.png",
    line: "static/bl/lines.png",
    code: "bl",
    iconfont: "bl",
    host: "mixiangchina.com",
  },
  {
    id: "9",
    ios: "5l7-ios",
    verIndex: 5010017,
    version: "5.1.15",
    hard: "西瓜看球",
    brand: "bl",
    mycolor: "#FCC400",
    agreement: "ppingona.xyz",
    aboutLogo: "static/xg-logo1.png",
    loadLogo: "static/xg2-logo2.png",
    line: "static/line.png",
    code: "xg",
    iconfont: "xg2",
    isDynamicDomain: false,
    // # dev
    host: "bl-dev.landingmakljdh.xyz",
    fileHost: "bl-dev.landingmakljdh.xyz",
    rcurl1:
      "https://lb-cfg-01.oss-accelerate.aliyuncs.com/CdbNTvUmntpg6uANClxpd.s",
    rcurl2:
      "https://lb-cfg-01-1314527561.cos.accelerate.myqcloud.com/CdbNTvUmntpg6uANClxpd.s",
    rcurl3: "https://lb-cfg-01.s3-cn-east-7.wcsapi.com/CdbNTvUmntpg6uANClxpd.s",
    // & qa
    // host: "bl-qa.landingmakljdh.xyz",
    // fileHost: "bl-qa.landingmakljdh.xyz",
    // rcurl1:
    //   "https://lb-cfg-01.oss-accelerate.aliyuncs.com/Lkb3iCiT49wL6zTrulMjq.s",
    // rcurl2:
    //   "https://lb-cfg-01-1314527561.cos.accelerate.myqcloud.com/Lkb3iCiT49wL6zTrulMjq.s",
    // rcurl3: "https://lb-cfg-01.s3-cn-east-7.wcsapi.com/Lkb3iCiT49wL6zTrulMjq.s",
    // $ uat site-b
    // host: "apszy13rsx119.xyz",
    // fileHost: "apszy13rsx119.xyz",
    // rcurl1:
    //   "https://lb-cfg-01.oss-accelerate.aliyuncs.com/xGbCaaHVtSdT37GclD5u.s",
    // rcurl2:
    //   "https://lb-cfg-01-1314527561.cos.accelerate.myqcloud.com/xGbCaaHVtSdT37GclD5u.s",
    // rcurl3: "https://lb-cfg-01.s3-cn-east-7.wcsapi.com/xGbCaaHVtSdT37GclD5u.s",
    // - prod site-b
    // host: "apeqtmo1tq91.xyz",
    // fileHost: "br.syruicxikj.cn",
    // rcurl1:
    //   "https://lb-cfg-01.oss-accelerate.aliyuncs.com/jYbnanUkEdCwmESdlZfp.s",
    // rcurl2:
    //   "https://lb-cfg-01-1314527561.cos.accelerate.myqcloud.com/jYbnanUkEdCwmESdlZfp.s",
    // rcurl3: "https://lb-cfg-01.s3-cn-east-7.wcsapi.com/jYbnanUkEdCwmESdlZfp.s",
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
const host = m.host
const fileHost = m.fileHost;
// let prefix =
//   m.host == "mixiangchina.com"
//     ? "api2"
//     : host == "aph3qkzfpw77.xyz"
//     ? "api"
//     : "apiv2"
// 文件上传，冷重启 全屏 投屏 手机顶部字体颜色 声音提醒

if (process.env.NODE_ENV == 'development') {
	// host = "landmarkhb.com"
	// prefix = "api"
}

config.agreement = m.agreement
//config.host = `https://${prefix}.${host}`
//config.portal = `https://m.${host}`
//config.upload = `https://${prefix}.${host}/api?method=upload`
//config.download = `https://file.${host}/file/`

//config.host= 'https://api.aph3qkzfpw77.xyz',
//config.portal= 'https://m.blty15.com',
//config.upload= 'https://api.aph3qkzfpw77.xyz/api?method=upload',
//config.download= 'https://file.aph3qkzfpw77.xyz/file/'

config.host = `https://api.${host}`
config.portal = `https://m.blty25.com`;
config.upload = `https://api.${host}/api?method=upload`;
config.download = `https://file.${fileHost}/file/`


if (process.env.NODE_ENV == 'development') {
	// let ip = '192.168.31.201'
	// let ip = '192.168.31.172'
	// config.host = `http://${ip}:60400`
}


if(m.isDynamicDomain) {
  const asyncFn = async () => {

    const rmConf = await handleConfig(m)


    config.host = rmConf.host;
    config.portal = rmConf.portalM;
    config.upload = rmConf.upload;
    config.download = `${rmConf.download}file/`;
 
  }

  asyncFn();
 }


export default config
