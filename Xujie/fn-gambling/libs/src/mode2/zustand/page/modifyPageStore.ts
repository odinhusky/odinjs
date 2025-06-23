import { RefObject } from 'react';
import { create } from 'zustand';
import { FormRef } from '../../@types/formTypes';

export interface ModifyPageFormData {
  phone: string;
  username: string;
  password: string;
}
// devtoolsAndPersistWrapper;

export interface ModifyPageStoreTypes {
  personalID: string;
  setPersonalID: (id: string) => void;
}

export const useModifyPageStore = create<ModifyPageStoreTypes>()((set) => ({
  personalID: '',
  setPersonalID: (id) => set(() => ({ personalID: id })),
}));

export interface ModifyPageRefsTypes {
  modifyPageFormRef: RefObject<FormRef> | null;
  setModifyPageFormRef: (ref: RefObject<FormRef>) => void;
}

export const useModifyPageRefsStore = create<ModifyPageRefsTypes>((set) => ({
  modifyPageFormRef: null,
  setModifyPageFormRef: (ref) =>
    set(() => ({
      modifyPageFormRef: ref,
    })),
}));
