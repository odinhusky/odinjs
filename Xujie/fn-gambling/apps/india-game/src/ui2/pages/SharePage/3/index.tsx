import useMode2SharePageBase from '@/ui/hooks/pages/SharePage/useMode2SharePageBase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRef, useState } from 'react';
import { cx, getAvatarOrder } from '@libs/commonUtils';
import { SocialScenarios } from '@libs/mode2/zustand/components/socialListStore';
import { SocialList } from '@components/SocialList';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { QRCode } from 'antd';
import useSharePageAction from '@mode2/action/sharePageAction/useSharePageAction';
import {
  handleSharePageClipboardClick,
  handleSharePagePostTgClick,
  handleSharePagePostWhatsAppClick,
  handleSharePageSaveImageClick,
} from '@mode2/action/actionTypes';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import sdkUtils from '@libs/mode2/utils/sdk';
import {
  SharePosterType,
  useMode2SharePageStore,
} from '@libs/mode2/zustand/page/sharePageStore';
import Icon from '@components/Icon';
import { useTranslation } from 'react-i18next';
import { SocialUnitImageType } from '@libs/mode2/zustand/components/socialListStore';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';

export const SharePage = () => {
  useMode2SharePageBase();

  const { t } = useTranslation();

  const { handleSharePageClick } = useSharePageAction();
  const displayUserName = useUserProfileStore((state) => state.displayUserName);
  const currentShareType = useMode2SharePageStore(
    (state) => state.currentShareType
  );
  const sharePosterList = useMode2SharePageStore(
    (state) => state.sharePosterList
  );
  const referralCode = useUserProfileStore((state) => state.referralCode);
  const referralLink = useUserProfileStore((state) => state.referralLink);
  const avatarOrder = useUserProfileStore((state) => state.avatarOrder);

  const swiperRef = useRef<SwiperCore | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const asImageRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrent(swiper.realIndex);
  };

  // const postTgSchemeData: SchemeData | null = useMemo(() => {
  //   const data: SchemeData | null = AppSchemeData['telegram'];
  //   if (!data) {
  //     return null;
  //   }
  //   switch (currentShareType) {
  //     case SharePosterType.SHARETEAMCLUB:
  //       return {
  //         ...data,
  //         postShareLink: (shareLink) =>
  //           `https://t.me/share/url?url=${shareLink}`,
  //       };
  //     case SharePosterType.SHAREINVITE:
  //       return {
  //         ...data,
  //         postShareLink: (shareLink) =>
  //           `https://t.me/share/url?url=${shareLink}`,
  //       };
  //     default:
  //       return {
  //         ...data,
  //         postShareLink: (shareLink) =>
  //           `https://t.me/share/url?url=${shareLink}`,
  //       };
  //   }
  // }, [currentShareType, referralCode]);

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen h-full -mb-4 -ml-4 h-full pt-6 pb-4 box-border',
        'flex flex-col justify-around'
      )}
    >
      <div className="w-full">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className=""
          spaceBetween={'10%'}
          slidesPerView={'auto'}
          centeredSlides={true}
          slideToClickedSlide={false}
          loop={false}
          observer={true}
          observeParents={false}
          // initialSlide={}
          onSlideChange={handleSlideChange}
        >
          {sharePosterList.map((item, index) => {
            return (
              <SwiperSlide
                className=""
                key={index}
                style={{ width: '21rem', height: '37.25rem' }} // 21rem == 336px  37.25rem == 596px
              >
                <div
                  ref={(el) => {
                    asImageRef.current[index] = el;
                  }}
                  key={index}
                  className={cx(
                    'w-full h-full text-xxs bgi-text-[var(--transparent-white-60)] overflow-hidden',
                    'relative'
                  )}
                >
                  <div
                    className="w-full flex items-center justify-center text-base"
                    style={{ width: '21rem', height: '37.25rem' }}
                  >
                    <img className="w-full h-full" src={item} alt="" />
                  </div>
                  <div
                    className={cx(
                      'absolute bottom-0',
                      'w-full',
                      'p-3 box-border flex justify-between items-end'
                      // 'bg-purple-500'
                    )}
                  >
                    <div className="flex gap-4">
                      <div className="flex flex-col justify-between">
                        {/* <Avatar
                          rootClassName={cx('!w-6 !h-6', 'rounded-full')}
                          className={cx('!w-6 !h-6', 'rounded-full !bgi-border-[#FFF6D0]')}
                          isShowVIP={false}
                        /> */}
                        {/* #FFF6D0 用純色保存圖片才會顯示頭像 */}
                        <BaseCacheImg
                          src={getImgUrl(
                            EResourceLevel.V,
                            avatarOrder
                              ? `avatar_${getAvatarOrder(Number(avatarOrder))}`
                              : 'avatar_guest'
                          )}
                          className={cx(
                            '!w-6 !h-6',
                            'rounded-full border border-[#FFF6D0]'
                          )}
                          alt="avatar"
                        />
                        <Icon
                          name={'ic_google'}
                          className={cx('w-6 h-6', 'rounded-full')}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 bgi-text-[var(--grayscale-100)]">
                        <div>
                          <span className="">{displayUserName}</span>
                        </div>
                        <div className="mt-1.5 flex items-center">
                          <span>
                            {t('spin_and_share_wheel_share_invite_code')}:&nbsp;
                          </span>
                          <span className="text-base font-bold bgi-text-[var(--base-1-main)]">
                            {referralCode}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center">
                          <span>
                            {t('spin_and_share_wheel_share_search')}:&nbsp;
                          </span>
                          <span className="text-base font-bold">
                            {sdkUtils.productName()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-[72px] h-[72px]">
                      {referralLink ? (
                        <QRCode
                          bgColor="white"
                          style={{
                            width: '100%',
                            height: '100%',
                            background: '#FFFFFF',
                            padding: '0.25rem',
                            borderRadius: '0.25rem',
                          }}
                          value={referralLink}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="flex gap-5 mt-6 items-center justify-center box-border">
          {sharePosterList.map((_, index) => {
            return (
              <div
                key={index}
                className={cx('w-2 h-2 rounded-full cursor-pointer', {
                  'bgi-[var(--base-2-variant1)]': index === current,
                  'bgi-[var(--base-2-variant2)]': index !== current,
                })}
              ></div>
            );
          })}
        </div>
      </div>

      {/* TODO Ronan 判斷是否分享成功, 成功分享返回頁面 消失 */}
      {currentShareType === SharePosterType.SHARETEAMCLUB ? (
        <div className="flex items-center justify-center pt-6 box-border text-center bgi-text-[var(--transparent-white-70)]">
          <Icon name={'ic_coin'} className="w-5 h-5 mr-2" />
          <span>Share to other APPs to get ₹1</span>
        </div>
      ) : null}

      <div className="w-full mt-[4%]">
        <SocialList
          scenarios={SocialScenarios.NOTHING}
          isShowLabelFromProps={true}
          className="flex justify-center items-center flex-wrap"
          classNameUnit="gap-2 w-20 flex-shrink-0 flex-col flex-wrap"
          iconOuterClassName="p-4 box-border rounded-full bgi-[var(--base-2-variant6)]"
          iconClassName="!w-8 !h-8 rounded-none"
          classNameLabel="text-xs !bgi-text-[var(--base-2-variant1)]"
          isShowLabel={true}
          srcType={SocialUnitImageType.OUTLINE}
          extraList={[
            {
              label: 'Whatsapp',
              icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_whatsapp'),
              onActionClick: () => {
                handleSharePageClick({
                  actionName: handleSharePagePostWhatsAppClick,
                  payload: {
                    postLinkText: '',
                  },
                });
              },
            },
            {
              label: 'Telegram',
              icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_telegram'),
              onActionClick: () => {
                handleSharePageClick({
                  actionName: handleSharePagePostTgClick,
                  payload: {
                    postLinkText: '',
                  },
                });
              },
            },
            {
              label: 'Save Picture',
              icon: getImgUrl(EResourceLevel.ICONS, 'ic_save'),
              onActionClick: () =>
                handleSharePageClick({
                  actionName: handleSharePageSaveImageClick,
                  payload: {
                    asImageRef: {
                      current: asImageRef.current[current],
                    },
                  },
                }),
            },
            {
              label: t('earn_share_link'),
              icon: getImgUrl(EResourceLevel.ICONS, 'ic_link'),
              onActionClick: () =>
                handleSharePageClick({
                  actionName: handleSharePageClipboardClick,
                  payload: {
                    shareText: '',
                  },
                }),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default SharePage;
