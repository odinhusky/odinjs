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

const { Content } = Layout;

const PopPage = () => {
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
    </Layout>
  );
};
export default PopPage;
