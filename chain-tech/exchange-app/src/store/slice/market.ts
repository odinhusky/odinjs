import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  price: [] as  MarketPrice[]
}

const marketSlice = createSlice({
  name: "market",
  initialState: initialState,
  reducers: {
    set(state, action: PayloadAction<MarketPrice[]>) {
      state.price = action.payload
    }
  }
});

export const marketActions = marketSlice.actions;

export default marketSlice.reducer;