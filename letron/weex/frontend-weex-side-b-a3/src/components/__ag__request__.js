import util from "./util.js";
let stream=undefined
function AgRequest(url, data={}, header={}){
	if(!stream){
		stream = weex.requireModule('stream');
	}
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
	this.promise = new Promise((resolve, reject)=> {
		this.resolve = resolve;
		this.reject = reject;
		header.token = token
		header.agtoken = agtoken
		stream.fetch({
			method: 'POST',
			type: 'json',
			url,
			headers:header,
			body: s,
			timeout:30000,
		},  (r)=> {
			if(r.data && (r.data.message == '该账号已在别的设备登录' || r.data.message == '该账号已冻结')){
				util.message(r.data.message)
				util.clearUsers()
				reject(r.data);
				return
			}
			if (r.data && r.data.success) {
				t.state = 1;
				if (r.data.payload && r.data.payload.agtoken) {
					util.setItem('agtoken',r.data.payload.agtoken)
				}
				resolve(r.data);
			} else {
				t.state = 2;
				reject(r.data);
			}
		})
	})
}

export default AgRequest