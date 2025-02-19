import cx from '@commonUtils/cx';
import { useDeepEffect } from '@commonUtils/hooks';
import { Header } from '@components/Header';

import { FloatActionButton } from '@components/FloatActionButton';
import BottomNavigation from '@components/BottomNavigation';
import ModalLayout from '@templates/ModalLayout';

import { useBottomNavigationStore } from '@mode2/zustand/components/bottomNavigationStore';

import { Layout } from 'antd';
import { memo, ReactNode } from 'react';
import { isEqual } from 'lodash';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';
import { useObserverElementMetrics } from '@commonUtils/hooks/useObserverElementMetrics';
import './vGlobal.scss';
import TemplatePageContent from './components/TemplatePageContent';

const { Content } = Layout;

/**
 * [mode4] 只支援手機樣式版型
 */
export const MemorizedTemplateLayoutHTML = memo(
  ({ children }: { children: ReactNode }) => {
    // const location = useLocationStore(state => state.location);

    const isDisplayBottomNavigation = useBottomNavigationStore(
      (state) => state.isDisplayBottomNavigation
    );
    // mainElMetrics
    const setMainContentElMetrics = useTemplateLayoutStore(
      (state) => state.setMainContentElMetrics
    );
    const { elementRef: mainElRef, elementMetrics: mainElMetrics } =
      useObserverElementMetrics<HTMLDivElement>();
    useDeepEffect(() => {
      setMainContentElMetrics(mainElRef, mainElMetrics);
    }, [mainElMetrics]);

    // bottomNavElMetrics
    const setBottomNavigationElMetrics = useTemplateLayoutStore(
      (state) => state.setBottomNavigationElMetrics
    );
    const { elementRef: bottomNavElRef, elementMetrics: bottomNavElMetrics } =
      useObserverElementMetrics<HTMLDivElement>();
    useDeepEffect(() => {
      setBottomNavigationElMetrics(bottomNavElRef, bottomNavElMetrics);
    }, [bottomNavElMetrics]);

    // headerElMetrics
    const setHeaderElMetrics = useTemplateLayoutStore(
      (state) => state.setHeaderElMetrics
    );
    const { elementRef: headerElRef, elementMetrics: headerElMetrics } =
      useObserverElementMetrics<HTMLDivElement>();
    useDeepEffect(() => {
      setHeaderElMetrics(headerElRef, headerElMetrics);
    }, [headerElMetrics]);

    return (
      <Layout
        className={cx(
          'w-full h-full bg-transparent bg-bottom bg-no-repeat bg-cover'
          // 'bgi-[var(--background-middle)]'
        )}
      >
        <Header ref={headerElRef} />
        <Layout className={cx('w-full h-full min-h-screen bg-transparent')}>
          {/*<SideMenu />*/}

          <Content
            className={cx(
              `flex relative h-full`
              // isDisplayBottomNavigation ? 'pb-14 mobile:pb-15' : ''
            )}
            style={{
              paddingTop: headerElMetrics.height,
              // marginTop: headerElMetrics.height,
              paddingBottom: bottomNavElMetrics.height,
              // marginBottom: -bottomNavElMetrics.height,
              // height: `calc(100vh - ${headerElMetrics.height / 16}rem)`,
            }}
          >
            <div
              ref={mainElRef}
              id={'main-content'}
              className={cx('w-full h-full')}
            >
              <TemplatePageContent children={children} />

              <FloatActionButton />
            </div>
          </Content>
        </Layout>
        <BottomNavigation ref={bottomNavElRef} />
        <ModalLayout />
      </Layout>
    );

    // return (
    //   <>
    //     <Header ref={headerElRef} />
    //     <Layout className={cx('w-full h-full min-h-screen bg-transparent')}>
    //       {/*<SideMenu />*/}
    //
    //       <Content
    //         className={cx(
    //           `flex relative h-full`
    //           // isDisplayBottomNavigation ? 'pb-14 mobile:pb-15' : ''
    //         )}
    //         style={{
    //           marginTop: headerElMetrics.height,
    //           paddingBottom: bottomNavElMetrics.height,
    //           // height: `calc(100vh - ${headerElMetrics.height / 16}rem)`,
    //         }}
    //       >
    //         <div
    //           ref={mainElRef}
    //           id={'main-content'}
    //           className={`w-full h-full`}
    //         >
    //           <TemplatePageContent children={children} />
    //
    //           <FloatActionButton />
    //         </div>
    //       </Content>
    //     </Layout>
    //     <BottomNavigation ref={bottomNavElRef} />
    //     <ModalLayout />
    //   </>
    // );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
