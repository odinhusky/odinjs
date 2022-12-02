import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getToken() {
  return await AsyncStorage.getItem("token");
}

export function setToken(token) {
  AsyncStorage.setItem("token",token)
}

export async function removeToken() {
  return await AsyncStorage.removeItem("token")
}
