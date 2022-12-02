import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    advertisement: {} as Advertisement,
}

const c2cSlice = createSlice({
  name: "c2c",
  initialState: initialState,
  reducers: {
    setSelectedAdvertisement(state, action: PayloadAction<Advertisement>) {
      state.advertisement = action.payload
    }
  }
});

export const c2cActions = c2cSlice.actions;

export default c2cSlice.reducer;