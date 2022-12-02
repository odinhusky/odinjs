import { configureStore } from '@reduxjs/toolkit'
import { 
  userReducer, 
  positionsReducer, 
  futuresReducer, 
  marketReducer, 
  c2cReducer, 
  registerReducer,
  tradingReducer,
  otcOrderReducer
} from 'store/slice'

const store = configureStore({
  reducer: {
    user: userReducer,
    positions: positionsReducer,
    futures: futuresReducer,
    market: marketReducer,
    c2c: c2cReducer,
    register: registerReducer,
    trading: tradingReducer,
    otcOrder: otcOrderReducer
  }
})

export default store;