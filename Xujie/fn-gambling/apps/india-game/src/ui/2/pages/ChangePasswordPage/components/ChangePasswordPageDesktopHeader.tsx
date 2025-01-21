import { PageDeskTopHeader } from '@components/PageDeskTopHeader';

const ChangePasswordPageDesktopHeader = () => {
  return (
    <PageDeskTopHeader
      classNameObj={{
        headerText: 'font-bold text-3xxl bgi-text-[var(--base-2-main)]',
      }}
      headerTitle={{ i18nKey: 'account_menu_change_password' }}
    />
  );
};
export default ChangePasswordPageDesktopHeader;
