import PolicyPageContent from './components/PolicyPageContent';
import useMode2PolicyPageBase from '@libs/mode2/usecase/page/policyPage/useMode2PolicyPageBase';
import PolicyPageDesktopHeader from './components/PolicyPageDesktopHeader';
import { cx } from '@libs/commonUtils';

const PolicyPage = () => {
  useMode2PolicyPageBase();
  return (
    <div className={cx('py-3 mobile:py-5 tablet:py-8')}>
      <PolicyPageDesktopHeader />
      <PolicyPageContent />
    </div>
  );
};
export default PolicyPage;
