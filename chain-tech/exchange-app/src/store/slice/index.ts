import userReducer,  { userActions } from "store/slice/user";
import positionsReducer,  { positionsActions } from "store/slice/position";
import futuresReducer,  { futuresActions } from "store/slice/future";
import marketReducer,  { marketActions } from "store/slice/market";
import c2cReducer,  { c2cActions } from "store/slice/c2c";
import registerReducer,  { registerActions } from "store/slice/register";
import tradingReducer,  { tradingActions } from "store/slice/trading";
import otcOrderReducer, { otcOrderActions } from "store/slice/otcOrder";
export {
    userReducer,
    userActions,
    positionsReducer,
    positionsActions,
    futuresReducer,
    futuresActions,
    marketReducer,
    marketActions,
    c2cReducer,
    c2cActions,
    registerReducer,
    registerActions,
    tradingReducer,
    tradingActions,
    otcOrderReducer,
    otcOrderActions
}