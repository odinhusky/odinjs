import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { removeToken } from "utils/auth";
import UserService from "services/user.service";
import store from 'store';
const initialState: UserInfo = {
    token: "",
    detail: {} as User,
    favorite: [] as string[],
    otc: {} as OtcUser
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload
        },
        setUser(state, action: PayloadAction<User>) {
            state.detail = action.payload
        },
        logout(state) {
            state.token = ""
            state.favorite = []
            removeToken()
        },
        setFavorite(state, action: PayloadAction<string[]>) {
            state.favorite = action.payload
        },
        addFavorite(state, action: PayloadAction<string>) {
            state.favorite = state.favorite.concat(action.payload)
        },
        removeFavorite(state, action: PayloadAction<string>) {
            state.favorite = state.favorite.filter(symbol => symbol !== action.payload)
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            console.log("1")
            state.detail = action.payload
            fetchOtcUser(action.payload.account)
        }),
        builder.addCase(fetchOtcUser.fulfilled, (state, action) => {
            console.log("2")
            state.otc = action.payload
        })
    }
});

export const userActions = userSlice.actions;

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await UserService.getUserInfo()
    return response.data;
});

export const fetchOtcUser = createAsyncThunk<OtcUser, string>('user/fetchOtcUser', async (payload) => {
    const response = await UserService.getOtcUserInfo(payload)
    return response;
});

export default userSlice.reducer;