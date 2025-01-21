import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';
import dayjs from 'dayjs';
import sdkUtils from '@libs/mode2/utils/sdk';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';

const depositAdvertisementStore = userLocalForage.getInstance(
  UserLocalforageStoreKeys.DEPOSIT_ADVERTISEMENT
);

interface IDepositAdvertisementModalStore {
  currentUserId: number;
  setCurrentUserId: (id: number) => void;
  activityEndTime: number;
  isShowDepositAdvertisementModal: boolean;
  setShowDepositAdvertisementModal: (show: boolean) => void;
  lastShowTime: number;
  showCount: number;
  maxShowCount: number;
  resetDepositAdvertiseData: (
    state?: Partial<IDepositAdvertisementModalStore>
  ) => void;
  cacheDepositAdvertiseData: () => void;
}
const defaultDepositAdvertisementState = {
  currentUserId: 0,
  activityEndTime: 0,
  maxShowCount: 3,
  lastShowTime: 0,
  showCount: 0,
  isShowDepositAdvertisementModal: false,
};

const getInitialDepositAdvertisementState = () => {
  return {
    ...defaultDepositAdvertisementState,
  };
};
export const useDepositAdvertisementStore =
  create<IDepositAdvertisementModalStore>()(
    devtoolsAndPersistWrapper(
      '[component store] useDepositAdvertisementStore',
      (set) => ({
        ...getInitialDepositAdvertisementState(),
        setCurrentUserId: (id: number) => {
          depositAdvertisementStore
            .getItem(id.toString())
            .then((value) => {
              console.log(
                '@@@===> depositAdvertisementStore decrypt',
                sdkUtils.decrypt(value as string)
              );
              const parsedValue = value
                ? JSON.parse(sdkUtils.decrypt(value as string))
                : {};

              set(() => ({
                ...parsedValue,
                currentUserId: id,
              }));
            })
            .catch(() => {
              set(() => ({
                currentUserId: id,
              }));
            });
        },
        setShowDepositAdvertisementModal: (show) =>
          set((state: IDepositAdvertisementModalStore) => {
            if (show === state.isShowDepositAdvertisementModal) return {};
            const remainActivityTime = state.activityEndTime - dayjs().unix();

            return show
              ? {
                  activityEndTime:
                    remainActivityTime > 0
                      ? state.activityEndTime
                      : dayjs().add(15, 'm').unix(),

                  isShowDepositAdvertisementModal: show,
                  lastShowTime: dayjs().unix(),
                  showCount:
                    state.showCount < state.maxShowCount
                      ? state.showCount + 1
                      : 1,
                }
              : {
                  isShowDepositAdvertisementModal: show,
                };
          }),
        resetDepositAdvertiseData: (payload) =>
          set(() => ({
            ...defaultDepositAdvertisementState,
            ...payload,
          })),
        cacheDepositAdvertiseData: () =>
          set(async (state: IDepositAdvertisementModalStore) => {
            if (!state.currentUserId) return {};

            const data = {
              activityEndTime: state.activityEndTime,
              lastShowTime: state.lastShowTime,
              showCount: state.showCount,
            };

            await depositAdvertisementStore.setItem(
              state.currentUserId.toString(),
              sdkUtils.encryption(JSON.stringify(data))
            );

            return {};
          }),
      })
    )
  );
