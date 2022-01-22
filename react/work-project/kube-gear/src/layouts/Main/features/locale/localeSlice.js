import { createSlice } from '@reduxjs/toolkit'

export const localeSlice = createSlice({
  name: 'locale',
  initialState: 'zh-CN',
  reducers: {
    changeLocale: (state, action) => (action.payload)
  }
})

// ^ actions
export const { changeLocale } = localeSlice.actions

export default localeSlice.reducer;
