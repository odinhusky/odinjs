import moduleAll  from './__ag__moduleAll__.js';
import env from './env.js'
import require from './__ag__requireModule__.js'
import  util  from './util.js';

const module = moduleAll[env.code]

let download = require.download
let crypto = require.crypto
let net = require.net
let agstore = require.agstore
let agvalue = require.agvalue
let agkey = require.agkey
let agdevice = require.agdevice
let agnav = require.agnav
let openInstall = require.openInstall

const f = {}

f.__ag__hmacSha256Sync__ = function (v,k) {
    if (crypto) {
        return crypto[module.hmacSha256Sync](v,k)
    }
    return ''
}

f.__ag__getLandscape__ = function () {
    if (agdevice) {
        return weex.supports(`@module/${module.__ag__device__}.${module.getLandscape}`)
    }
    return false
}

f.__ag__setLandscape__ = function (val) {
    if (agdevice) {
        agdevice[module.setLandscape](val)
    }
}

f.__ag__setBadge__ = function(v) {
    if(agdevice){
        agdevice[module.setBadge](v)
    }
}

f.__ag__setStatusBarStyle__ = function(v) {
    if (agdevice) {
        agdevice[module.setStatusBarStyle](v)
    }
}

f.__ag__vibrate__ = function(v) {
    if (agdevice) {
        agdevice[module.vibrate](v)
    }
}

f.__ag__getDeviceName__ = function() {
    if (agdevice) {
        return agdevice[module.getDeviceName]()
    }
    return undefined
}

f.__ag__setVolume__ = function(v) {
    if (agdevice) {
        let isVolume = weex.supports(`@module/${module.__ag__device__}.${module.setVolume}`)
        
        if (isVolume) {
            agdevice[module.setVolume](v)
        }
    }
}

f.__ag__getVolume__ = function () {
    if (agdevice) {
		let isVolume = weex.supports(`@module/${module.__ag__device__}.${module.getVolume}`)
		if (isVolume) {
		 	return agdevice[module.getVolume]()
		}
	}
	return 0
}

f.__ag__isVolume__ = function () {
    if (agdevice) {
		let isVolume = weex.supports(`@module/${module.__ag__device__}.${module.getVolume}`)
		if (isVolume) {
            return true
		}
        return false
	}
	return false
}

f.__ag__setAudioCategory__ = function (m) {
    if (agdevice) {
		let isAudioCategory = weex.supports(`@module/${module.__ag__device__}.${module.setAudioCategory}`)
		if (isAudioCategory) {
			agdevice[module.setAudioCategory](m)
		}
	}
}

f.__ag__download__ = function(wgt,fnc) {
    if (download) {
        download[module.download](wgt, (e)=>{
            f.__ag__update__()
            fnc()
        });
        return
    }
    let downList = ['zfdownloadag','baidownloadhei','xiongdownloadmao','shuidownloadguo','zhongdownloadchao','download']
    let funList = ['download','tiger','panda','koala','dog','download']
    let upList = ['updatePilau','updateTiger','updatePanda','updateKoala','updateDog','update']
    for (let i in downList) {
        let r = downList[i]
        download = weex.requireModule(r);
        if (download) {
            download[funList[i]](wgt, (e)=>{
                download[upList[i]]()
                fnc()
            });
            return
        }
    }
    
}

f.__ag__update__ = function() {
    if (download) {
        download[module.update]()
    }
}

f.__ag__updateUrl__ = function () {
    if (download) {
        download[module.updateUrl]()
    }
}

f.__ag__getStore__ = function(key) {
    if (agstore) {
        return agstore[module.sgetItem](key)
    }
}

f.__ag__setStore__ = function(k,v) {
    if (agstore) {
        agstore[module.ssetItem](k,v)
    }
}

f.__ag__getValue__ = function(key) {
    if (agvalue) {
        return agvalue[module.vgetItem](key)
    }
}

f.__ag__setValue__ = function(k,v) {
    if (agvalue) {
        agvalue[module.vsetItem](k,v)
    }
}

f.__ag__getKey__ = function(key) {
    if (agkey) {
        return agkey[module.kgetItem](key)
    }
}

f.__ag__setKey__ = function(k,v) {
    if (agkey) {
        agkey[module.ksetItem](k,v)
    }
}

f.__ag__removeItem__ = function(k) {
    if (agkey) {
        agkey[module.removeKeyItem](k)
    }
}

f.__ag__open__ = function(v) {
    if (agnav) {
        agnav[module.open](v)
    }
}

f.__ag__check__ = function() {
    if(net){
       return net[module.check]()
    }
}

f.__ag__oiOpenInstall_ = function() {
    let isOpenInstall =  weex.supports(`@module/${module.__ag__openInstall__}`)
    if(isOpenInstall){
        openInstall[module.oiopen]()
    }
}

f.__ag__regist__ = function(v) {
    let isOpenInstall =  weex.supports(`@module/${module.__ag__openInstall__}`)
    if(isOpenInstall){
        openInstall[module.regist]()
    }
}

f.__ag__report__ = function(v) {
    let isOpenInstall =  weex.supports(`@module/${module.__ag__openInstall__}`)
    if(isOpenInstall){
        openInstall[module.report]()
    }
}


export default f
