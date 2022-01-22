import { configureStore } from '@reduxjs/toolkit'
import userinfoReducer from './features/userinfo/userinfoSlice';
import localeReducer from './features/locale/localeSlice';
import resourceunitReducer from './features/resourceunit/resourceunitSlice';
import canusevglistReducer from './features/canusevglist/canusevglistSlice';



const reducer = {
  userinfo: userinfoReducer,
  locale: localeReducer,
  resourceunit: resourceunitReducer,
  canusevglist: canusevglistReducer
}

export default configureStore({
  reducer
})