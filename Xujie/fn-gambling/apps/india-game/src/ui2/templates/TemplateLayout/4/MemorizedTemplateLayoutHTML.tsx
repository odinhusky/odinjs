import cx from '@commonUtils/cx';
import { useDeepEffect } from '@commonUtils/hooks';
import { Header } from '@components/Header';

import FloatActionButton from '@components/FloatActionButton';
import BottomNavigation from '@components/BottomNavigation';
import ModalLayout from '@templates/ModalLayout';

import { Layout } from 'antd';
import { memo, ReactNode } from 'react';
import isEqual from 'lodash/isEqual';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';
import { useObserverElementMetrics } from '@commonUtils/hooks/useObserverElementMetrics';
import './vGlobal.scss';
import TemplatePageContent from './components/TemplatePageContent';
import { useHeaderStore } from '@mode2/zustand/components/headerStore';
import { useRouteTracker } from '@commonUtils/stayTracker/useRouterTracker';
import useMobileExclusiveMainOverride from './useMobileExclusiveMainOverride';

const { Content } = Layout;

const HeaderWrapper = () => {
  // headerElMetrics
  const setHeaderElMetrics = useTemplateLayoutStore(
    (state) => state.setHeaderElMetrics
  );
  const { elementRef: headerElRef, elementMetrics: headerElMetrics } =
    useObserverElementMetrics<HTMLDivElement>();
  useDeepEffect(() => {
    setHeaderElMetrics(headerElRef, headerElMetrics);
  }, [headerElMetrics]);
  return <Header ref={headerElRef} />;
};

const MainContentWrapper = ({ children }: { children: ReactNode }) => {
  // mainElMetrics
  const setMainContentElMetrics = useTemplateLayoutStore(
    (state) => state.setMainContentElMetrics
  );
  const { elementRef: mainElRef, elementMetrics: mainElMetrics } =
    useObserverElementMetrics<HTMLDivElement>();
  useDeepEffect(() => {
    setMainContentElMetrics(mainElRef, mainElMetrics);
  }, [mainElMetrics]);

  return (
    <div ref={mainElRef} id={'main-content'} className={cx('w-full h-full')}>
      <TemplatePageContent children={children} />

      <FloatActionButton />
    </div>
  );
};

const BottomNavigationWrapper = () => {
  // bottomNavElMetrics
  const setBottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.setBottomNavigationElMetrics
  );
  const { elementRef: bottomNavElRef, elementMetrics: bottomNavElMetrics } =
    useObserverElementMetrics<HTMLDivElement>();
  useDeepEffect(() => {
    setBottomNavigationElMetrics(bottomNavElRef, bottomNavElMetrics);
  }, [bottomNavElMetrics]);

  return <BottomNavigation ref={bottomNavElRef} />;
};

/**
 * [mode4] 只支援手機樣式版型
 */
export const MemorizedTemplateLayoutHTML = memo(
  ({ children }: { children: ReactNode }) => {
    useRouteTracker();
    useMobileExclusiveMainOverride();

    const config = useHeaderStore((state) => state.config);
    const headerElMetrics = useTemplateLayoutStore(
      (state) => state.headerElMetrics
    );
    const bottomNavigationElMetrics = useTemplateLayoutStore(
      (state) => state.bottomNavigationElMetrics
    );

    const mainStyle = useTemplateLayoutStore((state) => state.mainStyle);

    const layoutStyle = {
      backgroundColor: config.templateBgColor || 'var(--background-middle)',
      // background: config.templateBgColor
      //   ? config.templateBgColor
      //   : 'var(--background-middle)',
      backgroundAttachment: 'fixed',
    };

    const contentStyle = config.headerBgImg
      ? {
          backgroundImage: `url(${config.headerBgImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: '750px',
          backgroundPosition: 'top',
          ...config.headerBgStyle,
        }
      : {};
    return (
      <Layout
        className={cx(
          'w-full h-full bg-transparent bg-bottom bg-no-repeat bg-cover'
        )}
      >
        <HeaderWrapper />

        <Layout
          className={cx('w-full h-full min-h-screen')}
          style={{
            // backgroundColor: 'var(--background-middle)',
            // background: 'var(--background-middle)',
            ...layoutStyle,
            backgroundAttachment: 'fixed',
            backgroundSize: '750px',
            backgroundPosition: 'top',
          }}
        >
          {/*<SideMenu />*/}

          <Content
            className={cx(
              `flex relative h-full`
              // isDisplayBottomNavigation ? 'pb-14 mobile:pb-15' : ''
            )}
            style={{
              ...contentStyle,
              ...mainStyle,
              // backgroundImage: `url(${config.headerBgImg})`,
              // backgroundRepeat: 'no-repeat',
              // backgroundAttachment: 'fixed',
              // backgroundSize: '750px',
              // backgroundPosition: 'top',

              paddingTop: headerElMetrics.height,
              paddingBottom: bottomNavigationElMetrics.height,
            }}
          >
            <MainContentWrapper children={children} />
          </Content>
        </Layout>
        <BottomNavigationWrapper />

        <ModalLayout />
      </Layout>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
