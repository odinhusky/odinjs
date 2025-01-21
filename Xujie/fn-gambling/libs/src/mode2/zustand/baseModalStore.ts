import { create } from 'zustand';

export interface BaseModalStoreTypes {
  modalIds: string[];
  addModalId: (id: string) => void;
  clearModalIds: (id: string) => void;
}

export const useBaseModalStore = create<BaseModalStoreTypes>((set) => ({
  modalIds: [],
  addModalId: (id) =>
    set((state) => ({ modalIds: state.modalIds.concat([id]) })),
  clearModalIds: (id) =>
    set((state) => ({ modalIds: state.modalIds.filter((v) => v !== id) })),
}));
