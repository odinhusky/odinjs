import { WebLocalStorage } from '@libs/commonUtils/localStorage';

export enum AppLocalStorageKey {
  TOKEN = 'token',
  LANG = 'lang',
  H5_LAST_MODIFIED = 'H5_LAST_MODIFIED',
  H5_LAST_ETAG = 'H5_LAST_ETAG',
}
export const AppLocalStorage = new WebLocalStorage<AppLocalStorageKey>();
