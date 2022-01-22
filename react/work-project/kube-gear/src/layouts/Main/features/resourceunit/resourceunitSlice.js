import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// # API
import { getHivedResourceUnit } from 'utils/api'

// ^ Plugin
import { toast } from 'react-toastify';

export const getResourceUnit = createAsyncThunk(
  'resourceunit/get',
  async (arg, thunkAPI) => {
    try {
      // 取得資源對照表
      const result = await getHivedResourceUnit();

      return {
        ...result
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const resourceunitSlice = createSlice({
  name: 'resourceunit',
  initialState: {
    data: {},
    error: null
  },
  extraReducers: {
    [getResourceUnit.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    [getResourceUnit.rejected]: (state, action) => {
      const error = action.payload

      state.error = error
      toast.error(error.data.message)
      // toast.error(error.message)
    }
  }
})

// ^ actions
export const { resetUserInfoState } = resourceunitSlice.actions

// - selectors
export const selectResourceUnit = state => state.resourceunit.data


export default resourceunitSlice.reducer;
