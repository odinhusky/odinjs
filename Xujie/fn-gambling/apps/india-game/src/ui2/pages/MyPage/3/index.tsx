import './index.scss';
import useMode2MyPageBase from '@mode2/usecase/page/myPage/useMode2MyPageBase';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import { handleMyPageLogoutBtnClick } from '@mode2/action/actionTypes';
import MyPageBannerBtn from './components/MyPageBannerBtn';
import MyPageVIPBlock from './components/MyPageVIPBlock';
import MyPageUserInfo from './components/MyPageUserInfo';
import MyPageVersion from './components/MyPageVersion';
import { QuitButton } from '@components/QuitButton';
import QuickLineCellButtons from '@components/QuickLineCellButtons';

export const MyPage = () => {
  useMode2MyPageBase();

  const { handleMyPageClick } = useMyPageActions();

  return (
    <div className="my-page mt-3">
      <div className="w-full bgi-[var(--base-1-light)] overflow-hidden p-[1px] rounded-t-[60px] rounded-b-lg">
        <div className="bgi-[var(--grayscale-10)] rounded-t-[60px] rounded-b-lg">
          <div className="bgi-[var(--linear-1)] p-3">
            <MyPageUserInfo />
            <div className="w-full h-[1px] bgi-[var(--transparent-white-10)] my-3" />
            {/* vip */}
            <MyPageVIPBlock />
          </div>
        </div>
      </div>
      {/* 按钮 */}
      <QuickLineCellButtons />
      {/* banner */}
      <MyPageBannerBtn />
      <QuitButton
        className={'justify-center mobile:text-sm my-4'}
        onClick={() => {
          handleMyPageClick({
            actionName: handleMyPageLogoutBtnClick,
          });
        }}
      />
      {/* 版本 */}
      <div className="pb-6">
        <MyPageVersion />
      </div>
    </div>
  );
};

export default MyPage;
