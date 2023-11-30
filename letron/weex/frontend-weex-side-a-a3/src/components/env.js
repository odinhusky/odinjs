
const config = {}

config.web  = 'https://liosIsraelt.xyz'
config.verIndex = 4070057
config.version = "4.7.57"
// bl-ios
// a3-ios
config.channel = { ios: "a31-ios" }
config.hard = 'A3 直播'
config.brand = '5'

// api.landmarkhb.com

// const host = "review.landingmakljdh.xyz"
// const host = "ryqclmzb31.cc" // 20231025 Frank 提出修改成這個
const host = "24kzb.com" // 20231027˙ Frank 提出修改成這個

// const host = "apggddbntr81.xyz"
// const fileHost = "ap047hhupf104.xyz"
const fileHost = "ryqclmzb31.cc"

const prefix = 'api'

// 隐私地址
config.agreement = "ryqclmzb31.cc"
config.dev = false

config.host = `https://${prefix}.${host}`
config.portal = `https://m.${host}`
config.upload = `https://${prefix}.${host}/api?method=upload`
config.download = `https://file.${fileHost}/file/`
config.logo = 'static/bbg/zf-logo5.png'
config.aboutLogo = 'static/bbg/zf-logo2.png'


if (process.env.NODE_ENV == 'development') {

	config.dev = true
	// let ip = '192.168.31.201'
	// config.host = `http://${ip}:60400`

}

export default config
