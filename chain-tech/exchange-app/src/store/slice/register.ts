import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisterRequest } from 'interfaces/request.interface';
const initialState: RegisterRequest = {
    account: "",
    password: "",
    password2: "",
    inviteCode: ""
}

const registerSlice = createSlice({
  name: "register",
  initialState: initialState,
  reducers: {
    setRequest(state, action: PayloadAction<RegisterRequest>) {
      state.account = action.payload.account
      state.password = action.payload.password
      state.password2 = action.payload.password2
      state.inviteCode = action.payload.inviteCode
    },
    clean(state){
      state.account=""
      state.password=""
      state.password2=""
      state.inviteCode=""
    }
  }
});

export const registerActions = registerSlice.actions;

export default registerSlice.reducer;