import PageDeskTopHeader from '@components/PageDeskTopHeader';
import { useKycDisplayStore } from '@/zustand/kyc/useKycDisplayStore';

export const BindKYCDesktopHeader = () => {
  const headerTitleText = useKycDisplayStore((state) => state.headerTitleText);

  // const { handleBindKYCPageClick } = useBindKYCPageActions();
  // const onBack = useCallback(() => {
  //   handleBindKYCPageClick({
  //     actionName: handleBindKYCPageDesktopHeaderBackBtnClick,
  //   });
  // }, []);

  return <PageDeskTopHeader headerTitle={{ i18nKey: headerTitleText }} />;
};

export default BindKYCDesktopHeader;
