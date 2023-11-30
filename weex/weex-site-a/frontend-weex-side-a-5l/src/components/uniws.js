
let wSocket = undefined
import moduleFun from './__ag__moduleFun__.js'

let ws = function(onMessage, onClose, onOpen, onLogout, onLogin){
	if(!wSocket){
		wSocket = weex.requireModule('webSocket');
	}
	let ios = weex.config.env.platform == 'iOS'
	console.log('webSocket',wSocket)
	this.ts = new Date().getTime()
	this.log = function(){
		let a = [this.ts]
		
		for(let i=0;i<arguments.length;i++){
			a.push(arguments[i])
		}
		console.log(...a)
		// uni.$emit('wshbd', a)
	};

	this.timer = false;
	this.connecting = false;
	this.recvTime = 0;
	this.sendTime = 0;
	
	this.start = ()=>{
		
		if(this.timer){
			clearInterval(this.timer);
		}
		console.log("start",this.timer)
		this.timer = setInterval(()=>{
	
			let now = new Date().getTime();
			let ttl = this.recvTime + 9000*1.5 - now;
			console.log("recvTime",this.recvTime,now)
			this.log('ttl', ttl)
			//13.5秒心跳超时
			if(ttl<=0) {
				
				//是否在前台
				// if(!getApp().globalData.show){
				// 	return;
				// }
				onClose.call(this);
				this.log('ws.reopen', this.url, this.index, this.id,  this.token)
				this.open1()
				return;
			}
	
			//9秒心跳
			let timeToHeart = this.sendTime + 9000 - 1000 - now;
			if(timeToHeart<=0){
				this.sendHeart();
				return;
			}
			
		}, 6000);
		
		this.open0()
	};
	
	this.open = (url, index, id, token)=>{
		this.url = url;
		this.index = index;
		this.id = id;
		this.token  = token;
		
		if(this.timer){
			console.log("ws.close",this.timer)
			this.open1()
		}else{
			this.start()
		}

	};

	this.sendAuth = ()=>{
		
		let f = {action: 'auth'};
		f.id = this.id;
		f.ver = 2;
		f.token = this.token;
		f.index = this.index;
		console.log("--------",f)
		this.send(f);
	};
	
	this.open1 = ()=>{
		this.connecting = false
		setTimeout(this.open0, 500)
	};
	
	this.open0 = ()=>{
		console.log('open1',this.url)
		if(!this.url){
			return;
		}
		let that = this
		this.log('ws.open');
		let url = this.url;
		wSocket.WebSocket(url,'')
		let onopen = function(event) {
			console.log('ws.onopen',event)
			that.recvTime = new Date().getTime();
			that.sendAuth(that.id, that.token, that.index);
			onOpen.call(that);
	
		 };
		let onmessage =function(res){
			that.log('❤', res.data);
			if(res.data){
				that.recvTime = new Date().getTime();
				let j =JSON.parse(res.data);
				
				j.forEach(r=>{
					
					if(r.error && r.code == 'error_token'){
						moduleFun.__ag__setStore__('token','')
						moduleFun.__ag__setStore__('user','')
						moduleFun.__ag__setValue__('token','')
						moduleFun.__ag__setValue__('user','')
						onLogout.call(that, r)
						return;
					}

					if(r.action=='logout'){
						if(that.timer){
							clearInterval(that.timer);
							that.timer = false;
						}
						wSocket.close();
						// console.log("logout",r)
						onLogout.call(that, r)
						return;
					}

					if(r.action=='login'){
						onLogin.call(that, that.id)
						return;
					}
					
					if (r.msgId) {
						that.sendRead()
					}

				});
				onMessage.call(that, j);
			}
		};
		let onerror = function(res) {
			console.log('error',res)
			that.log('ws.error');
			that.recvTime = 0;
			onClose.call(that);
			wSocket.close();
		};
		let onclose = function(event){
			that.log('ws.onclose');
			that.recvTime = 0;
			onClose.call(that);
			console.log('----关闭')
			wSocket.close();
		};
		if(ios){
			wSocket.onopen(onopen)
			wSocket.onmessage(onmessage)
			wSocket.onerror(onerror)
			wSocket.onclose(onclose)
		}else {
			wSocket.onopen = onopen
			wSocket.onmessage =onmessage
			wSocket.onerror = onerror
			wSocket.onclose = onclose
		}
	};
	this.send = (msg)=>{

		
		
		let f = JSON.stringify(msg)
		this.log('send', f)
		wSocket.send(f);
	};
	
	this.sendHeart = ()=>{
		let f = {};
		f.action = 'heart';
		f.id = this.id;
		f.index = this.index;
		f.token = this.token;
		f.heart = new Date().getTime();
		
		this.send(f);
	};
	
	this.sendRead = ()=>{
		let f = {};
		f.action = 'read';
		f.msgId = r.msgId;
		this.send(f);
	};
	return this;
}

export default ws