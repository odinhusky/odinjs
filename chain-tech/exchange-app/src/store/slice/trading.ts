import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CreateFutureRequest } from 'interfaces/request.interface';
import { ContractSide, ContractType } from "common/types";
import { investorService } from 'services';

const initialState = {
  information:{
    availableBalance: 0,
    availableQuantity: 0,
    leverage: 0
  },
  request: {
      symbol: "",
      type: "LIMIT",
      origQty: 0,
      side: "BUY"
  } as CreateFutureRequest
}

const tradingSlice = createSlice({
  name: "market",
  initialState: initialState,
  reducers: {
    setRequestOrigQty(state, action: PayloadAction<number>) {
      state.request.origQty = action.payload
    },
    setRequestType(state, action: PayloadAction<ContractType>) {
      state.request.type = action.payload
    },
    setRequestSide(state, action: PayloadAction<ContractSide>) {
      state.request.side = action.payload
    },
    setRequestSymbol(state, action: PayloadAction<string>) {
      state.request.symbol = action.payload
    },
    setRequestStopPrice(state, action: PayloadAction<number>) {
      state.request.stopPrice = action.payload
    },
    setRequestPrice(state, action: PayloadAction<number | null>) {
      state.request.price = action.payload
    },
    cleanRequest(state) {
      state.request.type = "LIMIT"
      state.request.price = null
      state.request.origQty = 0
      state.request.side = "BUY"
      state.information.availableQuantity = 0
    },
    setAvailableBalance(state, action: PayloadAction<number>){
      state.information.availableBalance = action.payload
    },
    setAvailableQuantity(state, action: PayloadAction<number>){
      state.information.availableQuantity = action.payload
    },
    setLeverage(state, action: PayloadAction<number>){
      state.information.leverage = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAvailableQuantityTrunk.fulfilled, (state, action) => {
      state.information.availableQuantity = action.payload
    })
  }
});

export const tradingActions = tradingSlice.actions;

export const getAvailableQuantityTrunk = createAsyncThunk<number,{symbol: string, side: ContractSide}> ('future/getAvailableQuantity', async (payload) => {
  const response = await investorService.getAvailableQuantity(payload.symbol, payload.side);
  return response.data;
});

export default tradingSlice.reducer;