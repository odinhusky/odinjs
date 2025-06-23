import {
  AccountPageTypes,
  useAccountPageStore,
} from '@libs/mode2/zustand/page/accountPageStore';
import useMode2AccountPageBase from '@mode2/usecase/page/accountPage/useMode2AccountPageBase';
import { MyInfo } from './components/MyInfo';
import { cx } from '@libs/commonUtils';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';

export const AccountPage = () => {
  useMode2AccountPageBase();

  const tabIndex = useAccountPageStore((state) => state.tabIndex);

  return (
    <div className={cx(MOBILE_BREAK_POINT_MAX_WIDTH, 'w-screen -ml-4 h-screen')}>
      {tabIndex === AccountPageTypes.MYINFO ? <MyInfo /> : null}
    </div>
  );
};

export default AccountPage;
