import { createSlice } from '@reduxjs/toolkit'

export const guideSlice = createSlice({
  name: 'guide',
  initialState: {
    isShowGuide: false,
    currentStep: 1
  },
  reducers: {
    changeGuideShow: (state, action) => { state.isShowGuide = action.payload},
    openGuide: (state) => (state.isShowGuide = true),
    closeGuide: (state) => {
      state.isShowGuide = false
      state.currentStep = 1
    },
    changeGuideStep: (state, action) => { state.currentStep = action.payload}
  }
})

// - selectors
export const selectIsShowGuide = state => state.guide.isShowGuide
export const selectCurrentStep = state => state.guide.currentStep

// ^ actions
export const {
  openGuide,
  closeGuide,
  changeGuideStep,
  changeGuideShow
} = guideSlice.actions

export default guideSlice.reducer;
