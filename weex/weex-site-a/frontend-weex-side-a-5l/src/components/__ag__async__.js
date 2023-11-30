

import AgRequest from './__ag__request__.js'


const all = {}

function AgAsync(url, form={}, header={}){
	
	const req = new AgRequest(url, form, header)
	
	this.genKey = ()=>{
		const k = {url, form}
		const s = JSON.stringify(k)
		return s
	}
	
	let key = this.genKey()
	
	let queue = all[key]
	if(!queue){
		queue = []
		all[key] = queue
	}
	
	queue.push(req)
	
	
	return new Promise((resolve, reject)=>{
		
		req.promise.then(resp=>{
			
			resolve(resp)
			
			let q = all[key]
			if(q){
				for(let i in q){
					let r = q[i];
					if(r.state == 0){
						r.resolve(resp)
					}
				}
				delete all[key];
			}
			
			
		}).catch(err=>{
			
			reject(err)
			
			let q = all[key]
			if(q){
				for(let i in q){
					let r = q[i];
					if(r.state == 0){
						r.reject(err)
					}
				}
				delete all[key];
			}
			
		})
		
	})
	
	
}

export default AgAsync