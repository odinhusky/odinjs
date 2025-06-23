import cx from '@libs/commonUtils/cx';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils/img/getImgUrl';
import { useEffect } from 'react';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import { useDeepEffect, useObserverElementMetrics } from '@libs/commonUtils';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { Layout } from 'antd';
import PopHeader from './components/PopHeader';
import InviteAdContent from './components/InviteAdContent';
import InvitedToRegisterContent from './components/InvitedToRegisterContent';
import './index.scss';
import PopPageRegisterSucessModal from '@modals/PopPageRegisterSucessModal';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import usePopPageStore from '@libs/mode2/zustand/page/PopPage';
import PopPageLectureModal from '@modals/PopPageLectureModal';

const { Content } = Layout;

export const PopPage = () => {
  const { navToHallPage } = useNavPageClick();

  const setShowPopPageRegitsterSuccessModal = usePopPageStore(
    (state) => state.setShowPopPageRegitsterSuccessModal
  );

  const setHasToken = usePopPageStore((state) => state.setHasToken);

  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.Main,
      onSystemLogoClick: () => {},
    });
  }, []);

  const { elementRef: headerElRef, elementMetrics: headerElMetrics } =
    useObserverElementMetrics<HTMLDivElement>();
  useDeepEffect(() => {}, [headerElMetrics]);

  const bgPath = getImgUrl(EResourceLevel.V, 'share_background');

  useEffect(() => {
    const token = sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '';
    // '是否为iOS内核:',
    const isIOSKernel = sdkUtils.isIOSKernel();
    // '是否为Android内核:',
    // const isAndroidKernel = sdkUtils.isAndroidKernel();

    if (token) {
      setHasToken(true);
      // 有 token 又是 IOS 內核，則直接倒頁到首頁
      if (isIOSKernel) {
        navToHallPage();
      } else {
        // 有 token 但不是安著內核
        setShowPopPageRegitsterSuccessModal(true);
      }
    } else {
      setHasToken(false);
    }
  }, []);

  return (
    <Layout
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'bgi-[var(--bg-main)] min-h-screen',
        'bg-bottom bg-no-repeat bg-cover'
      )}
      style={{
        paddingTop: `${headerElMetrics.height}px`,
        backgroundColor: 'var(--bg-main)',
        backgroundImage: `url(${bgPath})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPositionY: `${headerElMetrics.height}px`,
      }}
    >
      <PopHeader ref={headerElRef} />

      <Content className="pb-20">
        <InviteAdContent />

        <InvitedToRegisterContent />
      </Content>

      {/* 一進入有 token 的話就顯示 */}
      <PopPageRegisterSucessModal />

      {/* 教學Modal */}
      <PopPageLectureModal />
    </Layout>
  );
};
export default PopPage;
