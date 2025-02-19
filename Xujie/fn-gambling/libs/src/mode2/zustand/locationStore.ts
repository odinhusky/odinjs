import { create } from 'zustand';
import { Location } from 'react-router-dom';

export type LocationStoreType = {
  location?: Location;
  setLocation: (location: Location) => void;
};

export const useLocationStore = create<LocationStoreType>((set) => ({
  location: undefined,
  setLocation: (value) => set(() => ({ location: value })),
}));
