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
    error: null,
    is401error: false,
    is401errorMsg: ''
  },
  reducers: {
    resetUserInfoState: (state) => {
      state.data = {}
      state.is401error = false
      state.is401errorMsg = ''
    },
    updateUserInfoState: (state, action) => {
      state.data = { ...state.data, ...action.payload }
    },
    update401: (state, action) => {
      state.is401error = action.payload.isError
      state.is401errorMsg = action.payload.errorMsg
    },
    reset401: (state) => {
      state.is401error = false
      state.is401errorMsg = ''
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
export const { resetUserInfoState, updateUserInfoState, update401, reset401 } = userinfoSlice.actions

// - selectors
export const selectUserInfo = state => state.userinfo.data
export const selectIs401error = state => state.userinfo.is401error
export const selectErrorMsg401 = state => state.userinfo.is401errorMsg

export default userinfoSlice.reducer;
