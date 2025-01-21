import { create } from 'zustand';

interface FetchMyIpStore {
  isFetching: boolean;
  setFetching: (isFetching: boolean) => void;
  ip: string;
  country: string;
  setIpAndCountry: (ip: string, country: string) => void;
}
export const useFetchMyIpStore = create<FetchMyIpStore>((set) => ({
  isFetching: false,
  setFetching: (isFetching) => set(() => ({ isFetching: isFetching })),
  ip: '',
  country: '',
  setIpAndCountry: (ip, country) => set(() => ({ ip: ip, country: country })),
}));
