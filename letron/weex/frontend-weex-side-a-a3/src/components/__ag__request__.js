// import urlencode from "urlencode";
let stream=undefined
import util from './util.js'
import sport from './__ag__sport__.js'

function AgRequest(url, data={}, header={}){
	if(!stream){
		stream = weex.requireModule('stream');
	}
	console.log("stream",stream)
	if(!header['content-type']){
		header['content-type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	}

	this.state = 0;
	let t = this;
	let s  = ''
	
	for(let i in data){
		let v = data[i]
		if(v){
			let q = s ? '&' : ''
			s += q + i + '=' + encodeURIComponent(v)
		}
	}
	let token = util.getItem('token')
	let agtoken = util.getItem('agtoken') || ''
	this.promise =  new Promise((resolve, reject)=> {
		this.resolve = resolve;
		this.reject = reject;
		header.token = token
		// header.agtoken = agtoken
		stream.fetch({
			method: 'POST',
			type: 'json',
			url,
			headers:header,
			body: s,
			timeout:30000,
		},  (r)=> {
			if (r.data && r.data.success) {
				if (r.data.payload && r.data.payload.agtoken) {
					util.setItem('agtoken',r.data.payload.agtoken)
				}
				t.state = 1;
				resolve(r.data);
			} else {
				t.state = 2;
        if (r.data && r.data.message && r.data.message === "未登录") {
          sport.__ag__infoUser_editGuest__()
          return
        }
        reject(r.data)
			}
		})
	})
}

export default AgRequest