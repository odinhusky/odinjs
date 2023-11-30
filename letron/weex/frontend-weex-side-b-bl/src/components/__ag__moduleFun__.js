import moduleAll  from './__ag__moduleAll__.js';
import env from './env.js'
import require from './__ag__requireModule__.js'

const thisModule = moduleAll[env.code]

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
        return crypto[thisModule.hmacSha256Sync](v,k)
    }
    return ''
}

f.__ag__getLandscape__ = function () {
    if (agdevice) {
        return weex.supports(`@module/${thisModule.__ag__device__}.${thisModule.getLandscape}`)
    }
    return false
}

f.__ag__setLandscape__ = function (val) {
    if (agdevice) {
        agdevice[thisModule.setLandscape](val)
    }
}

f.__ag__setBadge__ = function(v) {
    if(agdevice){
        agdevice[thisModule.setBadge](v)
    }
}

f.__ag__setStatusBarStyle__ = function(v) {
    if (agdevice) {
        agdevice[thisModule.setStatusBarStyle](v)
    }
}

f.__ag__vibrate__ = function(v) {
    if (agdevice) {
        agdevice[thisModule.vibrate](v)
    }
}

f.__ag__getDeviceName__ = function() {
    if (agdevice) {
        return agdevice[thisModule.getDeviceName]()
    }
    return undefined
}

f.__ag__setVolume__ = function(v) {
    if (agdevice) {
        let isVolume = weex.supports(`@module/${thisModule.__ag__device__}.${thisModule.setVolume}`)
        
        if (isVolume) {
            agdevice[thisModule.setVolume](v)
        }
    }
}

f.__ag__getVolume__ = function () {
    if (agdevice) {
		let isVolume = weex.supports(`@module/${thisModule.__ag__device__}.${thisModule.getVolume}`)
		if (isVolume) {
		 	return agdevice[thisModule.getVolume]()
		}
	}
	return 0
}

f.__ag__isVolume__ = function () {
    if (agdevice) {
		let isVolume = weex.supports(`@module/${thisModule.__ag__device__}.${thisModule.getVolume}`)
		if (isVolume) {
            return true
		}
        return false
	}
	return false
}

f.__ag__setAudioCategory__ = function (m) {
    if (agdevice) {
		let isAudioCategory = weex.supports(`@module/${thisModule.__ag__device__}.${thisModule.setAudioCategory}`)
		if (isAudioCategory) {
			agdevice[thisModule.setAudioCategory](m)
		}
	}
}

f.__ag__download__ = function(wgt,fnc) {
    if (download) {
        download[thisModule.download](wgt, (e)=>{
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
        download[thisModule.update]()
    }
}

f.__ag__updateUrl__ = function () {
    if (download) {
        download[thisModule.updateUrl]()
    }
}

f.__ag__getStore__ = function(key) {
    if (agstore) {
        return agstore[thisModule.sgetItem](key)
    }
}

f.__ag__setStore__ = function(k,v) {
    if (agstore) {
        agstore[thisModule.ssetItem](k,v)
    }
}

f.__ag__getValue__ = function(key) {
    if (agvalue) {
        return agvalue[thisModule.vgetItem](key)
    }
}

f.__ag__setValue__ = function(k,v) {
    if (agvalue) {
        agvalue[thisModule.vsetItem](k,v)
    }
}

f.__ag__getKey__ = function(key) {
    if (agkey) {
        return agkey[thisModule.kgetItem](key)
    }
}

f.__ag__setKey__ = function(k,v) {
    if (agkey) {
        agkey[thisModule.ksetItem](k,v)
    }
}

f.__ag__removeItem__ = function(k) {
    if (agkey) {
        agkey[thisModule.removeKeyItem](k)
    }
}

f.__ag__open__ = function(v) {
    if (agnav) {
        agnav[thisModule.open](v)
    }
}

f.__ag__check__ = function() {
    if(net){
       return net[thisModule.check]()
    }
}

f.__ag__oiOpenInstall_ = function() {
    let isOpenInstall =  weex.supports(`@module/${thisModule.__ag__openInstall__}`)
    if(isOpenInstall){
        openInstall[thisModule.oiopen]()
    }
}

f.__ag__regist__ = function(v) {
    let isOpenInstall =  weex.supports(`@module/${thisModule.__ag__openInstall__}`)
    if(isOpenInstall){
        openInstall[thisModule.regist]()
    }
}

f.__ag__report__ = function(v) {
    let isOpenInstall =  weex.supports(`@module/${thisModule.__ag__openInstall__}`)
    if(isOpenInstall){
        openInstall[thisModule.report]()
    }
}


export default f
