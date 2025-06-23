import './index.scss';
import useMode2MyPageBase from '@mode2/usecase/page/myPage/useMode2MyPageBase';
import QuickLineCellButtons from '@components/QuickLineCellButtons';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import { handleLogoutBtnClick } from '@mode2/action/actionTypes';
import MyPageBannerBtn from './components/MyPageBannerBtn';
import MyPageVIPBlock from './components/MyPageVIPBlock';
import MyPageUserInfo from './components/MyPageUserInfo';
import MyPageVersion from './components/MyPageVersion';
import { QuitButton } from '@components/QuitButton';
import cx from '@libs/commonUtils/cx';

export const MyPage = () => {
  useMode2MyPageBase();

  const { handleMyPageClick } = useMyPageActions();

  return (
    <div className="my-page">
      <MyPageUserInfo />

      {/* vip */}
      <MyPageVIPBlock />

      {/* 按钮 */}
      <QuickLineCellButtons />

      {/* banner */}
      <MyPageBannerBtn />

      <QuitButton
        className={cx(
          'justify-center mobile:text-sm rounded',
          '!bgi-[var(--grayscale-10)] hover:!bgi-[var(--grayscale-20)] active:!bgi-[var(--grayscale-00)]'
        )}
        onClick={() => {
          handleMyPageClick({
            actionName: handleLogoutBtnClick,
          });
        }}
      />
      {/*/!* 登出 *!/*/}
      {/*<MyPageLoginOutBtn*/}
      {/*  onClick={() => {*/}
      {/*    handleMyPageClick({*/}
      {/*      actionName: handleMyPageLogoutBtnClick,*/}
      {/*    });*/}
      {/*  }}*/}
      {/*/>*/}

      {/* 版本 */}
      <div className="pb-8">
        <MyPageVersion />
      </div>
    </div>
  );
};

export default MyPage;
