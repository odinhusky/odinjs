// import { useEffect } from 'react';
// import { useDeepEffect } from '@commonUtils/hooks';
// import { usePostVIPHomeMutation } from '@mode2/external/api';
// import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
//
// export const useMode2Vip = () => {
//   const [triggerVIPHome, { data: vipHome }] = usePostVIPHomeMutation();
//
//   const setVipTableDatas = useMyPageStore((state) => state.setVipTableDatas);
//   const setVipLevel = useMyPageStore((state) => state.setVipLevel);
//   const setVipProgressPercent = useMyPageStore(
//     (state) => state.setVipProgressPercent
//   );
//
//   useDeepEffect(() => {
//     if (!vipHome) return;
//
//     setVipTableDatas(vipHome.vipInfos);
//     setVipLevel(vipHome.vipLevel);
//     setVipProgressPercent(vipHome.vipPercent);
//   }, [vipHome]);
//
//   useEffect(() => {
//     triggerVIPHome();
//   }, []);
// };
//
// export default useMode2Vip;
