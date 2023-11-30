

import env from './env.js'
import AgRequest from './__ag__request__.js'
import AgRequestFile from './__ag__requestFile__.js'
import AgRequestEncodeFile from "./__ag__requestEncodeFile.js"

import apiList from './__ag__api__.js'
import random from 'string-random'
import util from './util.js'
function SportApi(method, form){
		let rd = random()
		let url =  '/api?method=' + method + '&random='+rd
		let token =util.getItem('token')
		let guestToken =util.getItem('guestToken')

		let aghash = util.urlsecret(method, rd,guestToken)
		if(WXEnvironment.platform != 'Web'){
			// if (process.env.NODE_ENV != 'development') {
				url = util.generateUrl(url)
			// }
		}
		url = env.host + url
    
		if (method === "uploadBase64") {
      return new AgRequestFile(url, form, { token, aghash }).promise
    } else if(method === "upload") {
      return new AgRequestEncodeFile(url, form, { token, aghash }).promise
    } else {
      return new AgRequest(url, form, { token, aghash }).promise
    }
}

const allApi = {}
for(let i in apiList){
	allApi[i] = (form)=>{
		return new SportApi(i, form)
	}
}

export default allApi