import { memo, ReactNode } from 'react';
import { useTemplateLayoutBase } from '@/hooks/templates/useTemplateLayoutBase';
import { MemorizedTemplateLayoutHTML } from './MemorizedTemplateLayoutHTML';
import usePlayerRegister from '@mode2/usecase/playerMode/usePlayerRegister';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';

/**
 *  [mode4] 只支援手機樣式版型
 */
const TemplateLayout = memo(({ children }: { children: ReactNode }) => {
  useTemplateLayoutBase();
  // const { refreshUserState } = useUserState(); // TODO Evan +3 渲染次數，需重構
  // Evan 避免不必要選染
  usePlayerRegister({
    // refreshUserState,
    refreshUserState: () => {
      useUserProfileStore.getState().refreshUserData();
      useKycDataStore.getState().refreshKYCInit();
    },
  });
  return <MemorizedTemplateLayoutHTML children={children} />;
});

export default TemplateLayout;
