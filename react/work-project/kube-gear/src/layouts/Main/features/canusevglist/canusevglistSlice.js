import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// # API
import { getCanUseVirtualGroups } from 'utils/api'

// ^ Plugin
import { toast } from 'react-toastify';

/**
 * @author odin
 * @param {string} username -- 登入者用戶名
 * @description 取得目前登入者的可使用集群列表
*/
export const getSelfCanUseVgList = createAsyncThunk(
  'selfcanusevglist/get',
  async (username, thunkAPI) => {
    try {
      // 取得資源對照表
      const result = await getCanUseVirtualGroups(username);

      return [
        ...result
      ]
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

/**
 * @author odin
 * @param {string} username -- 登入者用戶名
 * @description 取得特定用戶的可使用集群列表
*/
export const getSomeoneCanUseVgList = createAsyncThunk(
  'someonecanusevglist/get',
  async (someoneName, thunkAPI) => {
    try {
      // 取得資源對照表
      const result = await getCanUseVirtualGroups(someoneName);

      return {
        someoneName,
        list: [...result]
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const canusevglistSlice = createSlice({
  name: 'canusevglist',
  initialState: {
    selfCanUseVgList: [],
    someoneName: '',
    someoneCanUseVgList: [],
    error: null
  },
  extraReducers: {
    [getSelfCanUseVgList.fulfilled]: (state, action) => {
      state.selfCanUseVgList = action.payload;
      state.error = null;
    },
    [getSelfCanUseVgList.rejected]: (state, action) => {
      const error = action.payload

      state.selfCanUseVgList = [];
      state.error = error
      toast.error(error.data.message)
      // toast.error(error.message)
    },
    [getSomeoneCanUseVgList.fulfilled]: (state, action) => {
      const { someoneName, list } = action.payload
      state.someoneName = someoneName;
      state.someoneCanUseVgList = list;
      state.error = null;
    },
    [getSomeoneCanUseVgList.rejected]: (state, action) => {
      const error = action.payload

      state.someoneName = '';
      state.someoneCanUseVgList = [];
      state.error = error
      toast.error(error.data.message)
      // toast.error(error.message)
    }
  }
})

// ^ actions
export const { resetUserInfoState } = canusevglistSlice.actions

// - selectors
export const selectSelfCanUseVgList = state => state.canusevglist.selfCanUseVgList
export const selectSomeoneName = state => state.canusevglist.someoneName
export const selectSomeoneCanUseVgList = state => state.canusevglist.someoneCanUseVgList


export default canusevglistSlice.reducer;
