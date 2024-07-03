import {createSlice, PayloadAction} from "@reduxjs/toolkit";


type IPageContainerSlice = {
    width: number;
    height: number;
    contentWidth: number;
    contentHeight: number;
}

type IUISlice = {
    openMenuDrawer: boolean;
    openUserInfoStatusPopover: boolean;
    isBackToBoxPage: boolean;
    pageContainerSlice: IPageContainerSlice;
}
const initialState = {
    openMenuDrawer: false,
    openUserInfoStatusPopover: false,
    isBackToBoxPage: true,
    pageContainerSlice: {width: 0, height: 0, contentWidth: 0, contentHeight: 0},
}
export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setOpenMenuDrawer: (state: IUISlice, action: PayloadAction<IUISlice["openMenuDrawer"]>) => {
            state.openMenuDrawer = action.payload;
        },
        openMenuDrawer: (state: IUISlice, action: PayloadAction<IUISlice["openMenuDrawer"]>) => {
            state.openMenuDrawer = true;
        },
        closeMenuDrawer: (state: IUISlice, action: PayloadAction<IUISlice["openMenuDrawer"]>) => {
            state.openMenuDrawer = false;
        },
        setUserInfoStatusPopover: (state: IUISlice, action: PayloadAction<IUISlice["openUserInfoStatusPopover"]>) => {
            state.openUserInfoStatusPopover = action.payload;
        },
        openUserInfoStatusPopover: (state: IUISlice) => {
            state.openUserInfoStatusPopover = true;
        },
        closeUserInfoStatusPopover: (state: IUISlice) => {
            state.openUserInfoStatusPopover = false;
        },
        setIsBackToBoxPage: (state: IUISlice, action: PayloadAction<IUISlice["isBackToBoxPage"]>) => {
            console.log('@@ action.payload', action.payload)
            state.isBackToBoxPage = action.payload;
        },
        setPageContainerSize: (state: IUISlice, action: PayloadAction<{ width: number, height: number }>) => {
            state.pageContainerSlice = {
                ...state.pageContainerSlice,
                ...action.payload
            };
        },
        setPageContainerContentSize: (state: IUISlice, action: PayloadAction<{ contentWidth: number, contentHeight: number }>) => {
            state.pageContainerSlice = {
                ...state.pageContainerSlice,
                ...action.payload
            };
        }
    }
})
