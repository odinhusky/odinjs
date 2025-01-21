import './index.scss';
import useMode2MyPageBase from '@/ui/hooks/pages/myPage/useMode2MyPageBase';
import MyPageLineBtns from './components/MyPageLineBtns';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import {
  handleMyPageBannerBtnClick,
  handleMyPageLogoutBtnClick,
} from '@mode2/action/myPageAction/acitonType';
import MyPageBannerBtn from './components/MyPageBannerBtn';
import MyPageVIPBlock from './components/MyPageVIPBlock';
import MyPageUserInfo from './components/MyPageUserInfo';
import MyPageVersion from './components/MyPageVersion';
import { QuitButton } from '@components/QuitButton';

const MyPage = () => {
  useMode2MyPageBase();

  const { handleMyPageClick } = useMyPageActions();

  return (
    <div className="my-page">
      <MyPageUserInfo />

      {/* vip */}
      <MyPageVIPBlock />

      {/* 按钮 */}
      <MyPageLineBtns />

      {/* banner */}
      <MyPageBannerBtn />

      <QuitButton
        className={'justify-center mobile:text-sm'}
        onClick={() => {
          handleMyPageClick({
            actionName: handleMyPageLogoutBtnClick,
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
      <div className="pb-6">
        <MyPageVersion />
      </div>
    </div>
  );
};

export default MyPage;
