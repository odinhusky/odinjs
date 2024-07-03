import { AppLocalStorage } from "../../persistant/localstorage";
import { AppLocalStorageKey } from "../../persistant/AppLocalStorageKey";

export const removeRedirectLocalStorage = () => {
  AppLocalStorage.removeItem(AppLocalStorageKey.loginRedirect)
  AppLocalStorage.removeItem(AppLocalStorageKey.loginRedirectParam)
};