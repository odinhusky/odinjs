export class WebLocalStorage<T extends string> {
  // Storage
  getStorage(key: T): string | null {
    if (!window.localStorage) {
      if (window.fakeLocalStorage && window.fakeLocalStorage[key]) {
        return window.fakeLocalStorage[key];
      }
    } else {
      return localStorage.getItem(key);
    }
    return null;
  }

  setStorage(key: T, value: string): void {
    if (!window.localStorage) {
      window.fakeLocalStorage = window.fakeLocalStorage || {};
      window.fakeLocalStorage[key] = value;
    } else {
      localStorage.setItem(key, value);
    }
  }

  removeStorage(key: T): void {
    if (!window.localStorage) {
      if (window.fakeLocalStorage && window.fakeLocalStorage[key]) {
        delete window.fakeLocalStorage[key];
      }
    } else {
      localStorage.removeItem(key);
    }
  }
}
