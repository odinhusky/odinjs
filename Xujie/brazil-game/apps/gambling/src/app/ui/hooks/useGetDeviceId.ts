import {AppLocalStorage} from "../../persistant/localstorage";
import {AppLocalStorageKey} from "../../persistant/AppLocalStorageKey";
import {v4 as uuidv4} from "uuid";

type IGetDeviceProps = [phoneNumber: string, type: "login" | "register" | "forget"]

export const getDeviceId = (...[phoneNumber, type]: IGetDeviceProps) =>{
  const deviceId = AppLocalStorage.getItem(AppLocalStorageKey.deviceId);
  let finalDeviceId = deviceId;
  const customDeviceId = `CUSTOM_DEVICE_ID_${phoneNumber}_${Date.now()}`;
  if(!deviceId) {
    try {
      const newDeviceId = uuidv4();
      finalDeviceId = newDeviceId;
    } catch (e) {
      console.log(e);
      finalDeviceId = customDeviceId;
    }
  }
  AppLocalStorage.setItem(AppLocalStorageKey.deviceId, finalDeviceId || customDeviceId);
  return finalDeviceId || customDeviceId
}

export const useGetDeviceId = (...[phoneNumber, type]: IGetDeviceProps) => {
  return {
    deviceId: getDeviceId(phoneNumber,type),
  }
}
