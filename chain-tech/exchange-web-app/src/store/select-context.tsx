import React, {
  useReducer,
  useEffect,
  createContext,
  useState
} from "react";

// ^ Plugins
import useWebSocket from "react-use-websocket";
import { isEmpty, isNil } from 'lodash';

// ? Self-packed Components || Functions
import { appReducer } from "./reducer";

// ^ Types
import {
  MarketUnit,
  MarketObjType,
  PriceCtxValueTypes
} from '@/constants/type'

type initialType = {
  selectItem: string[];
};

// & handled data
const initialState = {
  selectItem: ["BTC"],
};


export const AppContext = React.createContext<{
  state: initialType;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => {},
});

export const PositionContext = createContext
([{
    "avgPrice": 0,
    "forceClose": 0,
    "leverage": 0,
    "lossPrice": 0,
    "margin": 0,
    "owner": "",
    "positionId": "",
    "profitAndLoss": 0,
    "profitPrice": 0,
    "quantity": 0,
    "side": "",
    "status": "",
    "symbol": "",
    "type": "",
  }],

);

export const PriceContext = createContext(
  [{
    E:"",
    P:"",
    c:"",
    e:"",
    p:"",
    s:"",
    v:"",
    w:"",
    m:""
  }],
);


export const AppProvider: React.FC = ({ children }) => {

  // $ init data
  const socketUrl = 'wss://api-ex.usefordemo.com/otc/ws';
  const socketUrl2 = 'wss://api-ex.usefordemo.com/market/ws/latest';

  // # states
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [socketUrl3,] = useState('wss://api-ex.usefordemo.com/ws');

  const [position,setPosition] = useState([])
  const [market,setMarket] = useState([])
  const [marketObj, setMarketObj] = useState<MarketObjType | any>({});

  const { lastJsonMessage,sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => sendJsonMessage({
      "operation": "subscribe",
      "channel": "otcOrder"
  }),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: closeEvent => true,
    queryParams:{token: localStorage.getItem("token")!}
  });

  const { lastJsonMessage:lastJsonMessage3,sendJsonMessage:sendJsonMessage2 } = useWebSocket(socketUrl3, {
    onOpen: () => sendJsonMessage2({
      "operation": "subscribe",
      "channel": "position"
    }),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: closeEvent => true,
    queryParams:{token: localStorage.getItem("token")!}
  });

  const { lastJsonMessage: marketWS } = useWebSocket(socketUrl2, {
    // onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: closeEvent => true
  });

  // - methods
  const handleMarketToObj = (market: []) => {
    // console.log('handleMarketToObj market', market);
    if(isEmpty(market)) return {};

    return market.reduce((acc, cur: (MarketUnit | any)) => {
      return {
        ...acc,
        [cur.s]: { ...cur }
      }
    }, {});
  };

  // & handled data
  const priceCtxValue: PriceCtxValueTypes | any = {
    marketArr: market,
    marketObj
  }

  // * hooks
  useEffect(() => {
    if (lastJsonMessage) {
      console.log(lastJsonMessage)
    }
  },[lastJsonMessage])
  useEffect(() => {
    if (lastJsonMessage3) {
      setPosition(lastJsonMessage3.data)
    }
  },[lastJsonMessage3])

  useEffect(() => {
    // console.log('marketWS!!', marketWS);
    if (!isNil(marketWS)) {
      setMarket(marketWS);
      const obj = handleMarketToObj(marketWS);
      setMarketObj(obj);
    }
  },[marketWS])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <PositionContext.Provider value={position}>
        <PriceContext.Provider value={priceCtxValue}>
          {children}
        </PriceContext.Provider>
      </PositionContext.Provider>
    </AppContext.Provider>
  );
};
