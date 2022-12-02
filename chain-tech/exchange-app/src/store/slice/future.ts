import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  create: [] as Future[]
}

const futuresSlice = createSlice({
  name: "futures",
  initialState: initialState,
  reducers: {
    set(state, action: PayloadAction<Future[]>) {
      state.create = action.payload
    }
  }
});

export const futuresActions = futuresSlice.actions;

export default futuresSlice.reducer;