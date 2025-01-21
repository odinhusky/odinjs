import { create } from 'zustand';

export const useIndexPageStore = create<{
  text: string;
  setText: (text: string) => void;
}>((set) => ({
  text: '',
  setText: (text) =>
    set(() => ({
      text,
    })),
}));
