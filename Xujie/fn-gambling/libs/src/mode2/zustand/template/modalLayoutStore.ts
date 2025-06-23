import { create } from 'zustand';
import { AnnouncementType } from '@mode2/@types/announcementType';
import {
  AdModelCommandType,
  SourceFrom,
} from '@mode2/usecase/announcement/command/HallAdModelCommand';
import { v4 as uuidv4 } from 'uuid';
export interface HallAdModelCommandTypes {
  uniqueId: string;
  type: AdModelCommandType;
  parameterJson?: string;
  from: SourceFrom;
}

interface ModalLayoutStoreTypes {
  hallAdModelCommandTypes: HallAdModelCommandTypes;
  setHallAdModelCommandTypes: (type: HallAdModelCommandTypes) => void;
  resetHallAdModelCommandTypes: () => void;
  verifyNextStepCount: number;
  verifyNextStep: (flag: string) => void;
}

export const useModalLayoutStore = create<ModalLayoutStoreTypes>(
  (set, get) => ({
    hallAdModelCommandTypes: {
      uniqueId: uuidv4(),
      type: AnnouncementType.UNKNOWN,
      from: SourceFrom.ANNOUNCEMENTS,
    },
    setHallAdModelCommandTypes: (obj) =>
      set(() => ({ hallAdModelCommandTypes: obj })),
    resetHallAdModelCommandTypes: () =>
      set(() => ({
        hallAdModelCommandTypes: {
          uniqueId: uuidv4(),
          type: AnnouncementType.UNKNOWN,
          from: SourceFrom.ANNOUNCEMENTS,
        },
      })),
    verifyNextStepCount: -1,
    verifyNextStep: (flag) =>
      set(() => {
        console.log('useModalLayoutStore.verifyNextStep', flag);
        return { verifyNextStepCount: get().verifyNextStepCount + 1 };
      }),
  })
);

export default useModalLayoutStore;
