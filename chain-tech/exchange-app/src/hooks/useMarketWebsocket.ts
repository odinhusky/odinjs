import React, { useEffect } from 'react';
import useWebSocket from "react-use-websocket";
import { useAppDispatch } from 'hooks/redux-hooks'
import { marketActions } from "store/slice";
import {  AppState, Platform}  from 'react-native';
import defaultSettings from "defaultSettings";
const  { apiDomain, ssl } = defaultSettings;
const baseWsUrl = ssl ? `wss://${apiDomain}` : `ws://${apiDomain}`

const useMarketWebsocket = () => {
    const dispatch = useAppDispatch();
    const debug = true;

    useWebSocket(`${baseWsUrl}/market/ws/latest`, {
        onOpen: () => {
            debug && console.log('open market connection')
        },
        onMessage: ( message )=>{
            if ( message ) {
                const wsResponse = JSON.parse(message.data)
                if ( AppState.currentState === "active" ) {
                    dispatch(marketActions.set(wsResponse))
                }
            }
        },
        shouldReconnect: () => true,
        reconnectInterval: 1000,
        onClose: () => debug && console.log('close market connection'),
    });
}

export default useMarketWebsocket