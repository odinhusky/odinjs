import ws from './uniws.js'
const webSocket = {}
webSocket.uniws = undefined
webSocket.openws = function(onMessage,onClose,onOpen,onLogout,onLogint,user,token){
	if(!webSocket.uniws){
		        webSocket.uniws =  new ws(
			onMessage,
			onClose,
			onOpen,
			onLogout,
			onLogint
		);
    }
		webSocket.uniws.wsonclose()
    webSocket.uniws.open(user.socketUrl, user.socketIndex, user.id,token)
	// let uniws =  new ws(
	// 		onMessage,
	// 		onClose,
	// 		onOpen,
	// 		onLogout,
	// 		onLogint
	// 	);
    // uniws.open(user.socketUrl, user.socketIndex, user.id,token)

}

export default webSocket