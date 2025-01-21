import PageDeskTopHeader from '@components/PageDeskTopHeader';

const PolicyPageDesktopHeader = () => {
  return (
    <PageDeskTopHeader
      classNameObj={{
        headerText: 'font-bold text-3xxl bgi-text-[var(--base-2-main)]',
      }}
      headerTitle={{ i18nKey: 'sign_in_link_privacy_policy' }}
    />
  );
};
export default PolicyPageDesktopHeader;
