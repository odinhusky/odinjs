import useMode2SharePageBase from '@/ui/hooks/pages/SharePage/useMode2SharePageBase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRef, useState } from 'react';
import { cx } from '@libs/commonUtils';
import { SocialScenarios } from '@libs/mode2/zustand/components/socialListStore';
import { SocialList } from '@components/SocialList';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { QRCode } from 'antd';
import useSharePageAction from '@mode2/action/sharePageAction/useSharePageAction';
import {
  handleSharePageClipboardClick,
  handleSharePageSaveImageClick,
} from '@libs/mode2/action/sharePageAction/actionType';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';
import { useMode2InviteEarnStore } from '@libs/mode2/zustand/page/invitePageStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useMode2SharePageStore } from '@libs/mode2/zustand/page/sharePageStore';
import Avatar from '@components/Avatar';
import Icon from '@components/Icon';
import { useTranslation } from 'react-i18next';

const SharePage = () => {
  useMode2SharePageBase();

  const { t } = useTranslation();

  const { handleSharePageClick } = useSharePageAction();

  const id = useUserProfileStore((state) => state.id);
  const sharePosterList = useMode2SharePageStore(
    (state) => state.sharePosterList
  );
  const referralInfo = useMode2InviteEarnStore((state) => state.referralInfo);

  const swiperRef = useRef<SwiperCore | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const asImageRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrent(swiper.realIndex);
  };

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'h-full pt-10 box-border min-',
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
                style={{ width: '70%', maxWidth: '21rem', height: 'auto' }}
              >
                <div
                  ref={(el) => {
                    asImageRef.current[index] = el;
                  }}
                  key={index}
                  className={cx(
                    'w-full bg-black text-xxs bgi-text-[var(--transparent-white-60)] rounded-lg overflow-hidden',
                    'relative',
                    {
                      'shadow-[0px_0px_12px_0px_rgba(255,150,44,0.5)]':
                        index === current,
                    }
                  )}
                >
                  <div className="w-full flex items-center justify-center text-base">
                    <img
                      className="w-full h-[calc(100%_-_72px)]"
                      src={item}
                      alt=""
                    />
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
                        <Avatar className={cx('w-6 h-6', 'rounded-[100%]')} />
                        {/* TODO icon */}
                        <Icon
                          name={'ic_google'}
                          className={cx('w-6 h-6', 'rounded-[100%]')}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 bgi-text-[var(--grayscale-100)]">
                        <div>
                          {/* TODO i18n  */}
                          <span className="">Player{id}</span>
                        </div>
                        <div className="mt-1.5">
                          <span>Invite code:&nbsp;</span>
                          <span className="bgi-text-[#FFE16B]">
                            {referralInfo.code}
                          </span>
                        </div>
                        <div className="mt-1.5">
                          <span>Google Play:&nbsp;</span>
                          <span>{sdkUtils.productName()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-[72px] h-[72px]">
                      {referralInfo.link ? (
                        <QRCode
                          bgColor="white"
                          style={{
                            width: '100%',
                            height: '100%',
                            background: '#FFFFFF',
                            padding: '0.25rem',
                            borderRadius: '0.25rem',
                          }}
                          value={referralInfo.link}
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

      {/* TODO Ronan 判斷是否分享成功, 只有俱樂部有 */}
      {/* {currentShareType === SharePosterType.SHARETEAMCLUB ? (
        <div className="flex items-center justify-center text-center bgi-text-[var(--transparent-white-70)]">
          <Icon name={'ic_share_star'} className="w-5 h-5 mr-2" />
          <span>Share to other APPs to get ₹1</span>
        </div>
      ) : null} */}

      <div className="w-full mt-[4%]">
        <SocialList
          scenarios={SocialScenarios.V6_VERSION_SHARE}
          isShowLabelFromProps={true}
          className="flex justify-center items-center flex-wrap"
          classNameUnit="gap-2 w-20 flex-shrink-0 flex-col flex-wrap"
          iconOuterClassName="p-3 box-border rounded-full bgi-[var(--base-2-variant6)]"
          iconClassName="!w-8 !h-8"
          classNameLabel="text-xs !bgi-text-[var(--base-2-variant1)]"
          isShowLabel={true}
          extraList={[
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
                }),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default SharePage;
