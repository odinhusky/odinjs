import module from './__ag__module__.js'
import moduleReg from './__ag__moduleReg__.js'

let download = weex.requireModule(module.__ag__download__);
let crypto = weex.requireModule(module.__ag__crypto__)
let net = weex.requireModule(module.__ag__net__)
let agstore = weex.requireModule(module.__ag__store__);
let agvalue = weex.requireModule(module.__ag__value__);
let agkey = weex.requireModule(module.__ag__key__);
let agdevice = weex.requireModule(module.__ag__device__);
let agnav = weex.requireModule(module.__ag__nav__)
let openInstall = weex.requireModule(module.__ag__openInstall__)

const f = {}

f.__ag__hmacSha256Sync__ = function (v,k) {
    if (crypto) {
        return crypto[moduleReg.hmacSha256Sync](v,k)
    }
    return ''
}

f.__ag__getLandscape__ = function () {
    if (agdevice) {
        return weex.supports(`@module/${module.__ag__device__}.${moduleReg.getLandscape}`)
    }
    return false
}

f.__ag__setLandscape__ = function (val) {
    if (agdevice) {
        agdevice[moduleReg.setLandscape](val)
    }
}

f.__ag__setBadge__ = function(v) {
    if(agdevice){
        agdevice[moduleReg.setBadge](v)
    }
}

f.__ag__setStatusBarStyle__ = function(v) {
    if (agdevice) {
        agdevice[moduleReg.setStatusBarStyle](v)
    }
}

f.__ag__vibrate__ = function() {
    if (agdevice) {
        agdevice[moduleReg.vibrate]()
    }
}

f.__ag__getDeviceName__ = function() {
    if (agdevice) {
        return agdevice[moduleReg.getDeviceName]()
    }
    return undefined
}

f.__ag__setVolume__ = function(v) {
    if (agdevice) {
        let isVolume = weex.supports(`@module/${module.__ag__device__}.${moduleReg.setVolume}`)
        
        if (isVolume) {
            agdevice[moduleReg.setVolume](v)
        }
    }
}

f.__ag__getVolume__ = function () {
    if (agdevice) {
		let isVolume = weex.supports(`@module/${module.__ag__device__}.${moduleReg.getVolume}`)
		if (isVolume) {
		 	return agdevice[moduleReg.getVolume]()
		}
	}
	return 0
}

f.__ag__isVolume__ = function () {
    if (agdevice) {
		let isVolume = weex.supports(`@module/${module.__ag__device__}.${moduleReg.getVolume}`)
		if (isVolume) {
            return true
		}
        return false
	}
	return false
}

f.__ag__setAudioCategory__ = function () {
    if (agdevice) {
		let isAudioCategory = weex.supports(`@module/${module.__ag__device__}.${moduleReg.setAudioCategory}`)
		if (isAudioCategory) {
			agdevice[moduleReg.setAudioCategory](m)
		}
	}
}

f.__ag__download__ = function(wgt,fnc) {
    if (download) {
        download[moduleReg.download](wgt, (e)=>{
            f.__ag__update__()
            fnc()
        });
    }
}

f.__ag__update__ = function() {
    if (download) {
        download[moduleReg.update]()
    }
}

f.__ag__updateUrl__ = function () {
    if (download) {
        download[moduleReg.updateUrl]()
    }
}

f.__ag__getStore__ = function(key) {
    if (agstore) {
        return agstore[moduleReg.sgetItem](key)
    }
}

f.__ag__setStore__ = function(k,v) {
    if (agstore) {
        agstore[moduleReg.ssetItem](k,v)
    }
}

f.__ag__getValue__ = function(key) {
    if (agvalue) {
        return agvalue[moduleReg.vgetItem](key)
    }
}

f.__ag__setValue__ = function(k,v) {
    if (agvalue) {
        agvalue[moduleReg.vsetItem](k,v)
    }
}

f.__ag__getKey__ = function(key) {
    if (agkey) {
        return agkey[moduleReg.kgetItem](key)
    }
}

f.__ag__setKey__ = function(k,v) {
    if (agkey) {
        agkey[moduleReg.ksetItem](k,v)
    }
}

f.__ag__removeItem__ = function(k) {
    if (agkey) {
        agkey[moduleReg.removeKeyItem](k)
    }
}

f.__ag__open__ = function(v) {
    if (agnav) {
        agnav[moduleReg.open](v)
    }
}

f.__ag__check__ = function() {
    if(net){
        return net[moduleReg.check]()
    }
}

f.__ag__oiOpenInstall_ = function() {
    let isOpenInstall =  weex.supports(`@module/${module.__ag__openInstall__}`)
    if(isOpenInstall){
        openInstall[moduleReg.oiopen]()
    }
}

f.__ag__regist__ = function(v) {
    let isOpenInstall =  weex.supports(`@module/${module.__ag__openInstall__}`)
    if(isOpenInstall){
        openInstall[moduleReg.regist]()
    }
}

f.__ag__report__ = function(v) {
    let isOpenInstall =  weex.supports(`@module/${module.__ag__openInstall__}`)
    if(isOpenInstall){
        openInstall[moduleReg.report]()
    }
}


export default f
