
const config = {}

config.web  = 'https://liosIsraelt.xyz'

config.verIndex = 4090006
config.version = "4.9.6"
// bl-ios
config.channel = {ios:'5l10-ios'}
config.hard = '西瓜看球'
config.brand = '5'


// api.landmarkhb.com
// api.aprwh3smpy76.xyz

const host = 'aprwh3smpy76.xyz'
const prefix = 'api'

// 隐私地址
config.agreement = 'liosIsraelt.xyz'
config.dev = false

config.host = `https://${prefix}.${host}`
config.portal = `https://m.blty15.com`
config.upload = `https://${prefix}.${host}/api?method=upload`
config.download = `https://file.${host}/file/`
config.logo = 'static/zf-logo5.png'
config.aboutLogo = 'static/zf-logo2.png'


if (process.env.NODE_ENV == 'development') {

	config.dev = true
	// let ip = '192.168.31.201'
	// config.host = `http://${ip}:60400`

}

export default config
