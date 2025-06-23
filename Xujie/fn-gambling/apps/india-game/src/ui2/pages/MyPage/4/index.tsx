import './index.scss';
import useMode2MyPageBase from '@mode2/usecase/page/myPage/useMode2MyPageBase';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import { handleMyPageLogoutBtnClick } from '@mode2/action/actionTypes';
import MyPageVIPBlock from './components/MyPageVIPBlock';
import MyPageUserInfo from './components/MyPageUserInfo';
import { QuitButton } from '@components/QuitButton';
import QuickLineCellButtons from '@components/QuickLineCellButtons';
import useMyPageHeaderSettingOverride from '@mode2/usecase/page/myPage/useMyPageHeaderSettingOverride';

export const MyPage = () => {
  useMode2MyPageBase();

  useMyPageHeaderSettingOverride();

  const { handleMyPageClick } = useMyPageActions();

  return (
    <div className="my-page mt-5">
      <MyPageUserInfo />

      {/* vip */}
      <MyPageVIPBlock />

      {/* 按钮 */}
      <QuickLineCellButtons />

      {/* 退出 */}
      <div className="mt-8 mb-3 flex justify-center">
        <QuitButton
          className={'w-40 py-3 justify-center'}
          onClick={() => {
            handleMyPageClick({
              actionName: handleMyPageLogoutBtnClick,
            });
          }}
        />
      </div>
    </div>
  );
};

export default MyPage;
