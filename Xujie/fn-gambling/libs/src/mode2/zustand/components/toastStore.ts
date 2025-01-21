import { create } from 'zustand';

export interface ToastResult {
  id?: string;
  message: string;
  callback?: (id: string) => void;
}

interface ToastStore {
  toastResult: ToastResult;
  showToast: (
    message: string,
    callback?: (id: string) => void,
    id?: string
  ) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toastResult: { message: '' },
  showToast: (value, callback, id) =>
    set(() => ({
      toastResult: { id: id, message: value, callback: callback },
    })),
}));
