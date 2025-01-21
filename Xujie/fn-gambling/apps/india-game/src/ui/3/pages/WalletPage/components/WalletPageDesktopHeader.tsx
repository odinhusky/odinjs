import PageDeskTopHeader from '@components/PageDeskTopHeader';

const WalletPageDesktopHeader = () => {
  return (
    <PageDeskTopHeader
      classNameObj={{
        headerText: 'font-bold text-3xxl bgi-text-[var(--base-2-main)]',
      }}
      headerTitle={{ i18nKey: '' }}
    />
  );
};
export default WalletPageDesktopHeader;
