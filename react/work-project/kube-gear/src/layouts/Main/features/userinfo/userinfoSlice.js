import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// # API
import { getCurrentUserInfo } from 'utils/api'

// ^ Plugin
import { toast } from 'react-toastify';

export const getUserInfo = createAsyncThunk(
  'userinfo/get',
  async (username, thunkAPI) => {
    try {
      const result = await getCurrentUserInfo(username)
      return {
        ...result,
        admin: result.privileges.find(item => item === 'ADMIN') !== undefined ? 'true' : false
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const userinfoSlice = createSlice({
  name: 'userinfo',
  initialState: {
    data: {},
    error: null
  },
  reducers: {
    resetUserInfoState: (state) => {
      state.data = {}
    }
  },
  extraReducers: {
    [getUserInfo.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    [getUserInfo.rejected]: (state, action) => {
      const error = action.payload

      state.error = error
      toast.error(error.data.message)
      // toast.error(error.message)
    }
  }
})

// ^ actions
export const { resetUserInfoState } = userinfoSlice.actions

// - selectors
export const selectUserInfo = state => state.userinfo.data


export default userinfoSlice.reducer;
