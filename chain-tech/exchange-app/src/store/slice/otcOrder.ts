import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { C2cOrderType } from 'common/types';
import { CreateOtcOrderRequest } from 'interfaces/request.interface';
import { advertisementService } from 'services';

const initialState = {
    buying: {} as OtcOrder,
    selling: {} as OtcOrder
}

const otcOrderSlice = createSlice({
  name: "otcOrder",
  initialState: initialState,
  reducers: {
    updateBuying(state, action: PayloadAction<OtcOrder>) {
      state.buying = action.payload
    },
    updateSelling(state, action: PayloadAction<OtcOrder>) {
      state.selling = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOtcOrder.fulfilled, (state, action) => {
      if ( action.payload.type === "buy" ){
        state.buying = action.payload.order
      }
      else {
        state.selling = action.payload.order
      }
    })
  }
});

export const otcOrderActions = otcOrderSlice.actions;

export const createOtcOrder = createAsyncThunk<{ type:C2cOrderType, order: OtcOrder }, CreateOtcOrderRequest>('c2c/confirmAdvertisement', async (payload) => {
  const response = await advertisementService.createOtcOrder(payload.id, payload.orderInfo)
  return {
    type: payload.type,
    order: response
  };
});

export default otcOrderSlice.reducer;