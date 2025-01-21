// import { useDeepEffect } from '@libs/commonUtils';
// import { useEffect } from 'react';
//
// import { usePostPlayerInformationMutation } from '@libs/mode2/external/api';
// import { useKycDataStore } from '@libs/mode2/zustand/user/userProfileStore';
// import { useIsLoginStore } from '../zustand/loginStore';
//
// export const useKYCInit = () => {
//   const [triggerPlayer, { data: playerInfo, isLoading }] =
//     usePostPlayerInformationMutation();
//
//   const isLogin = useIsLoginStore((state) => state.isLogin);
//
//   const refreshKycInitCount = useKycDataStore(
//     (state) => state.refreshKycInitCount
//   );
//
//   const setKycBankAccountInfo = useKycDataStore(
//     (state) => state.setKycBankAccountInfo
//   );
//   const setIsPersonalInfoFirstBind = useKycDataStore(
//     (state) => state.setIsPersonalInfoFirstBind
//   );
//
//   const setIsAPIPlayerInformationLoading = useKycDataStore(
//     (state) => state.setIsAPIPlayerInformationLoading
//   );
//
//   useDeepEffect(() => {
//     if (playerInfo) {
//       console.log('@@ playerInfo123', playerInfo);
//       setKycBankAccountInfo(playerInfo.bankAccountInfo);
//       setIsPersonalInfoFirstBind(playerInfo.isPersonalInfoFirstBind);
//     }
//   }, [playerInfo]);
//
//   useEffect(() => {
//     setIsAPIPlayerInformationLoading(isLoading);
//   }, [isLoading]);
//
//   useEffect(() => {
//     if (isLogin) {
//       triggerPlayer();
//     }
//   }, [isLogin, refreshKycInitCount]);
// };
//
// export default useKYCInit;
