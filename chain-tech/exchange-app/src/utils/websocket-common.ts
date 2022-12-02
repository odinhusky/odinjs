import defaultSettings from "defaultSettings";
const  { apiDomain, ssl } = defaultSettings;
const baseWsUrl = ssl ? `wss://${apiDomain}` :  `ws://${apiDomain}`

export const wsInstance = (targetPath: string) => {
    const ws = new WebSocket(`${baseWsUrl}${targetPath}`)

    ws.onopen = ()=> {
        console.log(`hello websocket ${targetPath}`)
    }

    ws.onmessage = (msg: MessageEvent<string>)=>{
        console.log(`get message ${msg.data.length}`)
    }
    
    ws.onclose = ()=> {
        console.log(`goodbye websocket ${baseWsUrl}${targetPath}`)
    }

    return ws
}