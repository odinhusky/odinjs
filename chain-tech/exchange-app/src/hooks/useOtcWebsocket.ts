import React, { useEffect } from 'react';
import useWebSocket from "react-use-websocket";
import { useAppDispatch, useAppSelector } from 'hooks/redux-hooks'
import { otcOrderActions } from "store/slice";
import {  AppState, Platform}  from 'react-native';
import defaultSettings from "defaultSettings";
const  { apiDomain, ssl } = defaultSettings;
const baseWsUrl = ssl ? `wss://${apiDomain}` : `ws://${apiDomain}`
// /socket.io/?EIO=4&transport=websocket
const useOtcWebsocket = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state)=> state.user.token )
    const account = useAppSelector((state)=> state.user.detail.account )
    const debug = true;

    const { sendJsonMessage } = useWebSocket(`${baseWsUrl}/otc/ws`, {
      onOpen: () => {
        debug && console.log('open otc connection')
        sendJsonMessage({
          "operation": "subscribe",
          "channel": "otcOrder"
        })
      },
      onMessage: (message) => {
        console.log(message)
        if ( message ) {
          const wsResponse: WebSocketResponse<OtcOrder> = JSON.parse(message.data)
          if ( wsResponse.channel==="otcOrder"){
            debug && console.log(`get otcOrder ${wsResponse.data.status} msg ${JSON.stringify(wsResponse.data)}`)
            if ( wsResponse.data.buyUser===account ){
              console.log(`get buy order ${wsResponse.data.id}`)
              dispatch(otcOrderActions.updateBuying(wsResponse.data))
            }
            else {
              console.log(`get sell order ${wsResponse.data.id}`)
              dispatch(otcOrderActions.updateSelling(wsResponse.data))
            }
          } 
        }
      },
      onClose: (e) => debug && console.log(e.reason),
      shouldReconnect: () => true,
      queryParams:{token: token}
    });
}
export default useOtcWebsocket