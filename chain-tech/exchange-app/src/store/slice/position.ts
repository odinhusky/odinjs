import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  trading: [] as Position[],
  closing: [] as string[]
}

const positionsSlice = createSlice({
  name: "positions",
  initialState: initialState,
  reducers: {
    set(state, action: PayloadAction<Position[]>) {
      state.trading = action.payload.filter( position => !state.closing.includes(position.positionId))
    },
    close(state, action: PayloadAction<string>) {
      state.closing = state.closing.concat(action.payload)
      state.trading = state.trading.filter( position => !state.closing.includes(position.positionId))
    }
  }
});

export const positionsActions = positionsSlice.actions;

export default positionsSlice.reducer;