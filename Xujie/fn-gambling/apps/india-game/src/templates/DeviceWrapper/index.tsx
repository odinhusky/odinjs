// import React, { useEffect, useState } from 'react';
// import tailwindVariables from '@libs/plugins/tailwindcss/tailwind.variables';
// import { useDeviceStore } from '@mode2/zustand/deviceStore';
//
// const { screens } = tailwindVariables.tailwindVariables.theme;
//
// interface IDeviceWrapperProps {
//   children: React.ReactNode;
// }
//
// export const DeviceWrapper = ({ children }: IDeviceWrapperProps) => {
//   const [screenWidth, setScreenWidth] = useState(window.innerWidth);
//
//   const setIsSE = useDeviceStore((state) => state.setIsSE);
//   const setIsPhone = useDeviceStore((state) => state.setIsPhone);
//   const setIsMobile = useDeviceStore((state) => state.setIsMobile);
//   const setIsTablet = useDeviceStore((state) => state.setIsTablet);
//   const setIsDesktop = useDeviceStore((state) => state.setIsDesktop);
//
//   useEffect(() => {
//     function handleResize() {
//       setScreenWidth(window.innerWidth);
//     }
//
//     window.addEventListener('resize', handleResize);
//
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//
//   useEffect(() => {
//     let isSE = true;
//     let isPhone = false;
//     let isMobile = true;
//     let isTablet = false;
//     let isDesktop = false;
//
//     const sePoint = parseInt(screens.se.replace('px', ''));
//     const phonePoint = parseInt(screens.phone.replace('px', ''));
//     const mobilePoint = parseInt(screens.mobile.replace('px', ''));
//     const tabletPoint = parseInt(screens.tablet.replace('px', ''));
//
//     if (0 < screenWidth && screenWidth < sePoint) {
//       isSE = true;
//       isPhone = false;
//     }
//
//     if (sePoint < screenWidth && screenWidth <= phonePoint) {
//       isSE = false;
//       isPhone = true;
//     }
//
//     if (screenWidth > phonePoint) {
//       isSE = false;
//       isPhone = false;
//     }
//
//     if (0 < screenWidth && screenWidth < mobilePoint) {
//       isMobile = true;
//       isTablet = false;
//       isDesktop = false;
//     }
//
//     if (mobilePoint <= screenWidth && screenWidth < tabletPoint) {
//       isMobile = false;
//       isTablet = true;
//       isDesktop = false;
//     }
//
//     if (tabletPoint <= screenWidth) {
//       isMobile = false;
//       isTablet = false;
//       isDesktop = true;
//     }
//
//     setIsSE(isSE);
//     setIsPhone(isPhone);
//     setIsMobile(isMobile);
//     setIsTablet(isTablet);
//     setIsDesktop(isDesktop);
//   }, [screenWidth]);
//
//   return <>{children}</>;
// };
