import React, { useEffect } from 'react';
import useWebSocket from "react-use-websocket";
import { useAppDispatch, useAppSelector } from 'hooks/redux-hooks'
import { positionsActions, futuresActions } from "store/slice";
import {  AppState, Platform }  from 'react-native';
import defaultSettings from "defaultSettings";
const  { apiDomain, ssl } = defaultSettings;
const baseWsUrl = ssl ? `wss://${apiDomain}` : `ws://${apiDomain}`

const useExchangeWebsocket = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state)=> state.user.token )
    const debug = false;

    const { sendJsonMessage } = useWebSocket(`${baseWsUrl}/ws`, {
      onOpen: () => {
        debug && console.log('open exchange connection')
        sendJsonMessage({
          "operation": "subscribe",
          "channel": "position"
        })
        sendJsonMessage({
          "operation": "subscribe",
          "channel": "future"
        })
      },   
      onClose: (e) => debug && console.log(e.reason),
      onMessage: ( message )=>{
        if ( message ) {
          const wsResponse = JSON.parse(message.data)
          if ( AppState.currentState === "active" && wsResponse){
            if ( wsResponse.channel==="position"){
              dispatch(positionsActions.set(wsResponse.data))
            } 
            if ( wsResponse.channel==="future"){
              dispatch(futuresActions.set(wsResponse.data))
            } 
          }
        }
      },
      shouldReconnect: () => true,
      queryParams:{token: token}
  });
}

export default useExchangeWebsocket