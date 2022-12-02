import { EnhancedStore } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { userActions } from "store/slice";
import { Alert } from "react-native";
const debug = true;
export const interceptor = (instance: AxiosInstance, store: EnhancedStore<any>) => {
    instance.interceptors.request.use(
        (config) => {
            const token = store.getState().user.token
            if (config.headers && token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config;
        },
        (error) => {
            console.log(error);
            Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response.data
        },
        (error) => {
            debug && console.log("path: ", error.response.config.url);
            debug && console.log("response: ", error);
            if (error.response === undefined) {
                return Promise.reject(error);
            }
            if (error.response.status === 403 || error.response.status === 401) {
                store.dispatch(userActions.logout())
            }
            if (error.response.status === 400) {
                Alert.alert(error.response.data.msg)
            }
            if (error.response.status === 500) {
                alert("系統發生錯誤");
            }
            return Promise.reject(error);
        }
    );
}
