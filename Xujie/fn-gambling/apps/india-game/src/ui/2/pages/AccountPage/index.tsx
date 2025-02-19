import {
  AccountPageTypes,
  useAccountPageStore,
} from '@libs/mode2/zustand/page/accountPageStore';
import useMode2AccountPageBase from '@mode2/usecase/page/accountPage/useMode2AccountPageBase';
import { MyInfo } from './components/MyInfo';

export const AccountPage = () => {
  useMode2AccountPageBase();

  const tabIndex = useAccountPageStore((state) => state.tabIndex);

  return <div>{tabIndex === AccountPageTypes.MYINFO ? <MyInfo /> : null}</div>;
};

export default AccountPage;
