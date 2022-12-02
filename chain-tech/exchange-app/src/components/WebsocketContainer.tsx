import React from "react"
import { useMarketWebsocket,useExchangeWebsocket } from "hooks"

import RenderCounter from "./render-counter"
const WebsocketContainer = () => {
    useMarketWebsocket()
    useExchangeWebsocket()
    
    return (<>
        <RenderCounter name={"WebsocketContainer"} debug={false}/>
    </>)
}

export default WebsocketContainer