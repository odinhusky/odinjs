import { EResourceLevel, getImgUrl } from '@mode2/utils';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import cx from '@commonUtils/cx';
import { Icon } from '@components/Icon';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import useWalletGuidePageActions from '@mode2/action/walletGuidePageAction/useWalletGuidePageAction';
import { handleWalletGuidePageRewardsButtonClickAction } from '@mode2/action/walletGuidePageAction/acitonType';

// TODO Evan
// TODO i18n
export const VideoTutorialsContent = () => {
  const { handleWalletGuidePageClick } = useWalletGuidePageActions();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <img
          className="object-contain bgi-border-[var(--base-1-variant1)] border-[1.5px] rounded-lg"
          alt={'watch_learn_get_reward_banner'}
          src={getImgUrl(EResourceLevel.V, 'watch_learn_get_reward_banner')}
        />
      </div>
      {/* block 3 */}
      <div className="text-lg font-medium bgi-text-[var(--grayscale-100)]">
        <div>{'Deposite Tutorial'}</div>
        <Swiper
          className={'w-full mt-2.5'}
          slidesPerView={'auto'} // 一次顯示 3 個
          spaceBetween={10} // 項目之間間距
          loop={false} // 不輪播
          observer={true}
          observeParents={false}
        >
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <SwiperSlide className="max-w-[198px]" key={`${index}_${index}`}>
              <div className="w-auto h-[276px] bg-blue-500">{`${index}`}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* block 4 */}
      <div className="flex flex-col items-center gap-2.5 text-lg font-medium bgi-text-[var(--grayscale-100)] gap-2">
        <div>{'Watch the tutorial video and win rewards!'}</div>

        <div className="relative">
          <img
            className="object-contain"
            alt={'watch_learn_get_reward_banner'}
            src={getImgUrl(EResourceLevel.V, 'play_video_banner')}
          />
          <div
            className={'h-[27px] w-[56px] absolute -top-2 -right-2 text-center'}
            style={{
              backgroundImage: `url(${getImgUrl(
                EResourceLevel.V,
                'how_to_use_tooltip'
              )})`,
              backgroundSize: '100%',
            }}
          >
            {'2'}
          </div>
        </div>

        <BasePrimaryBtn
          className={cx(
            'font-medium w-1/2',
            // 'bgi-[var(--linear-11)]',
            {
              // 'mb-[64px]': !isRechargeFromGame,
            }
          )}
          debounceTimer={500}
          onClick={() => {
            handleWalletGuidePageClick({
              actionName: handleWalletGuidePageRewardsButtonClickAction,
            });
          }}
          children={
            <div className=" flex justify-center items-center gap-2 font-medium text-xl">
              <Icon name={'ic_claim_rewads'} />
              {'Claim Rewards'}
            </div>
          }
        />
      </div>
      {/* block 5 */}

      <div className="bgi-border-[var(--base-2-variant5)] border-[1.5px] rounded-lg text-base font-medium bgi-text-[var(--grayscale-100)] px-6 py-[50px]">
        {
          'Each user has one chance to receive a reward after watching the video, and also has a chance to draw a mysterious grand prize.'
        }
      </div>
    </div>
  );
};

export default VideoTutorialsContent;
