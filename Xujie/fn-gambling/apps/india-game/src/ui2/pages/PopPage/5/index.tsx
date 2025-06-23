import cx from '@libs/commonUtils/cx';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils/img/getImgUrl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import { useObserverElementMetrics } from '@libs/commonUtils';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { Layout } from 'antd';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useAppStore } from '@mode2/zustand/appStore';
import sdkUtils from '@mode2/utils/sdk';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import { Button, Dropdown, Menu } from 'antd';
import { Icon } from '@components/Icon';
import { useLoadingStore } from '@mode2/zustand/components/loadingStore';
import Loading from '@/components/Loading';
import dayjs from 'dayjs';
import posthog from 'posthog-js';
import { PostHogAnalytics } from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

const { Content } = Layout;

export const PopPage = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.Main,
      onSystemLogoClick: () => {},
    });
  }, []);

  const { elementRef: headerElRef, elementMetrics: headerElMetrics } =
    useObserverElementMetrics<HTMLDivElement>();

  const bgPath = getImgUrl(EResourceLevel.V, 'share_background_2');

  const temporaryReferralCode = useAppStore(
    (state) => state.temporaryReferralCode
  );

  const handleDownloadClick = useCallback(() => {
    // const fallbackDelay = 1500;
    // const startTime = dayjs().unix();
    useLoadingStore.getState().setShowLoading(true);
    sdkUtils.wakeUpOrDownloadApp({
      referralCode: temporaryReferralCode,
      downloadFrom: 'pop',
      postHogDistinctId: PostHogAnalytics.extra.getDistinctId(),
    });

    setTimeout(() => {
      useLoadingStore.getState().setShowLoading(false);
    }, 3000);

    // const timeoutId = setTimeout(() => {
    //   const elapsed = dayjs().unix() - startTime;
    //   // 若時間差小於 delay，表示未跳轉成功，執行 fallback
    //   if (elapsed < fallbackDelay + 200) {
    //     sdkUtils.downloadApp({
    //       referralCode: temporaryReferralCode,
    //       downloadFrom: 'pop',
    //       postHogDistinctId: PostHogAnalytics.extra.getDistinctId(),
    //     });
    //   }
    // }, 3000);

    // const handleVisibilityChange = () => {
    //   if (document.hidden) {
    //     clearTimeout(timeoutId); // 成功打開 App，就不執行 fallback
    //     document.removeEventListener(
    //       'visibilitychange',
    //       handleVisibilityChange
    //     );
    //   }
    // };
    //
    // document.addEventListener('visibilitychange', handleVisibilityChange);
  }, [temporaryReferralCode]);

  const [lang, setLang] = useState('en');

  useEffect(() => {
    const userLang = navigator.language || navigator.languages[0];
    const langFlag = ['hi-IN'].includes(userLang) ? 'hi' : 'en';
    setLang(langFlag);
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    setLang(key);
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      className={cx(
        'menuASDSADASD',
        '!bgi-[var(--grayscale-00)] border bgi-border-[var(--base-1-main)] rounded-md'
      )}
      items={[
        {
          key: 'en',
          label: <>English</>,
          className:
            'key1 !text-xs !bgi-text-[var(--base-1-main)] !text-center !px-0 !py-1 hover:!bgi-[var(--transparent-white-20)]',
        },
        {
          key: 'hi',
          label: <>हिन्दी</>,
          className:
            'key2 !text-xs !bgi-text-[var(--base-1-main)] !text-center !px-0 !py-1 hover:!bgi-[var(--transparent-white-20)]',
        },
      ]}
    />
  );

  const UserLangMapping: Record<
    string,
    { label: string; downloadText: string; imageRes: string }
  > = {
    en: {
      label: 'English',
      downloadText: 'Download',
      imageRes: getImgUrl(EResourceLevel.V, 'share_link_img_en'),
    },
    hi: {
      label: 'हिन्दी',
      downloadText: 'डाउनलोड करें',
      imageRes: getImgUrl(EResourceLevel.V, 'share_link_img_hi'),
    },
  };

  const userLangData = useMemo(() => {
    return UserLangMapping[lang];
  }, [lang]);

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
      <div
        ref={headerElRef}
        className={cx(
          'h-[46px] w-full px-4 py-2',
          'flex justify-between items-center',
          'bgi-[var(--base-2-variant5)]',
          'fixed top-0 z-10',
          MOBILE_BREAK_POINT_MAX_WIDTH
        )}
      >
        <BaseCacheImg
          className="h-full "
          src={getImgUrl(EResourceLevel.LOGO, 'logo_7ind_com')}
        />

        <Dropdown
          trigger={['click']}
          className={
            'className !bgi-[var(--base-1-variant3)] !h-8 !text-xs !text-bgi-[var(--base-2-variant5)] !border-0 hover:!text-[#1a1b1c] hover:!border-0'
          }
          rootClassName={'rootClassName'}
          overlayClassName={'overlayClassName'}
          openClassName={'openClassName !text-bgi-[var(--base-2-variant5)]'}
          overlay={menu}
          placement="bottomRight"
        >
          <Button className={''}>
            <div className="flex justify-center items-center gap-2 p-2">
              {userLangData.label}
            </div>
          </Button>
        </Dropdown>
      </div>

      <Content className="pb-20">
        <div className="relative">
          <BaseCacheImg src={userLangData.imageRes} />

          <BasePrimaryBtn
            debounceTimer={500}
            disabled={false}
            className={cx(
              'w-[264px] h-[46px]',
              'text-xl font-medium',
              'absolute -bottom-4 left-0 right-0',
              'm-auto'
            )}
            children={
              <div className="flex justify-center gap-2 items-center">
                <Icon className="h-[30px] w-[30px]" name={'icon_android'} />
                {userLangData.downloadText}
              </div>
            }
            onClick={() => {
              handleDownloadClick();
            }}
          />
        </div>
      </Content>
      <Loading />
    </Layout>
  );
};
export default PopPage;
