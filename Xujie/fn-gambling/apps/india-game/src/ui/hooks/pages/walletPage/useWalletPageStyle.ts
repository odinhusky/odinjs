// import { useBreakPoint } from '@commonUtils/hooks';
// import { useWalletPageStylesStore } from '@mode2/zustand/page/walletPageStore';
// import { useEffect } from 'react';
//
// export const useWalletPageStyle = () => {
//   const { isTablet, isDesktop } = useBreakPoint();
//
//   const setWalletPageGridCol = useWalletPageStylesStore(
//     (state) => state.setWalletPageGridCol
//   );
//
//   useEffect(() => {
//     const gridCol = isDesktop
//       ? 'grid-cols-6'
//       : isTablet
//       ? 'grid-cols-4'
//       : 'grid-cols-3';
//
//     setWalletPageGridCol(gridCol);
//   }, [isTablet, isDesktop]);
// };
//
// export default useWalletPageStyle;
