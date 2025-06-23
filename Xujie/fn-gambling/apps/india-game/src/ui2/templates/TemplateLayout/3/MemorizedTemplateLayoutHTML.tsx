import cx from '@commonUtils/cx';
import {
  useBreakPoint,
  useDeepEffect,
  useImgUrlByBreakPoint,
} from '@commonUtils/hooks';
import { Header } from '@components/Header';
import Footer from '@components/Footer';

import FloatActionButton from '@components/FloatActionButton';
import BottomNavigation from '@components/BottomNavigation';
import ModalLayout from '@templates/ModalLayout';

import { useBottomNavigationStore } from '@mode2/zustand/components/bottomNavigationStore';

import { Layout } from 'antd';
import { memo, ReactNode } from 'react';
import isEqual from 'lodash/isEqual';
import ApkDownloadBanner from '@components/ApkDownloadBanner';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';
import { useObserverElementMetrics } from '@commonUtils/hooks/useObserverElementMetrics';
import { SideMenu } from '@components/SideMenu';
import DrawerMenu from '@components/DrawerMenu';
import { useLocation } from 'react-router';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { MyDrawer } from '@components/MyDrawer';
import './vGlobal.scss';
import { EResourceLevel } from '@mode2/utils';
import TemplatePageContent from './components/TemplatePageContent';

const { Content } = Layout;

export const MemorizedTemplateLayoutHTML = memo(
  ({ children }: { children: ReactNode }) => {
    const location = useLocation();

    const isDisplayBottomNavigation = useBottomNavigationStore(
      (state) => state.isDisplayBottomNavigation
    );
    const { isDesktop } = useBreakPoint();

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

    // footerElMetrics
    const setFooterElMetrics = useTemplateLayoutStore(
      (state) => state.setFooterElMetrics
    );
    const { elementRef: footerElementRef, elementMetrics: footerElMetrics } =
      useObserverElementMetrics<HTMLDivElement>();
    useDeepEffect(() => {
      setFooterElMetrics(footerElementRef, footerElMetrics);
    }, [footerElMetrics]);

    const isHallPage = location.pathname === BasePagePathObj.HallPage;
    const showDownloadBanner = isHallPage && !isDesktop;

    const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();
    const bgMainPath = isHallPage
      ? getImgUrlByBreakPoint('bg_main', EResourceLevel.V, true, true)
      : null;
    return (
      <Layout
        className={
          'w-full h-full bg-transparent bg-bottom bg-no-repeat bg-cover'
        }
        style={{
          ...(bgMainPath ? { backgroundImage: `url(${bgMainPath})` } : {}),
        }}
      >
        {showDownloadBanner && <ApkDownloadBanner />}

        <Header ref={headerElRef} />
        <DrawerMenu />
        <Layout className={'w-full h-full min-h-screen bg-transparent'}>
          <SideMenu />
          <Content
            className={cx(
              `flex relative h-full`,
              isDisplayBottomNavigation ? 'pb-14 mobile:pb-15' : '',
              isDesktop ? headerElMetrics : ''
            )}
            style={{
              paddingTop: isDesktop ? headerElMetrics.height : 0,
            }}
          >
            <div
              ref={mainElRef}
              id={'main-content'}
              className={`w-full h-full`}
            >
              <TemplatePageContent children={children} />

              <FloatActionButton />

              <Footer ref={footerElementRef} />
            </div>
          </Content>
          <MyDrawer />
        </Layout>

        <BottomNavigation ref={bottomNavElRef} />
        <ModalLayout />
      </Layout>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
