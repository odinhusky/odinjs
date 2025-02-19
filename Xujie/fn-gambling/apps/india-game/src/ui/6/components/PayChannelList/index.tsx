import { useTranslation } from 'react-i18next';
import {
  PayChannelItem,
  useWalletPageRechargeContentStore,
} from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import StarMark from '@components/StarMark';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import React from 'react';
import { Icon } from '@components/Icon';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import { handleWalletPageUseGuideActionClick } from '@mode2/action/walletPageAction/acitonType';

const ActiveCardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'rounded-md border-[1.5px]',
        'bgi-[var(--linear-4)]',
        'bgi-border-[var(--base-1-variant1)]'
      )}
    >
      <div
        style={{
          backgroundImage: `url(${getImgUrl(
            EResourceLevel.V,
            'payment_methods_focus'
          )})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {children}
        <img
          alt={'check_box'}
          className="absolute right-0 bottom-0 rounded-br-[5px] h-8 w-8"
          src={getImgUrl(EResourceLevel.V, 'check_box')}
        />
      </div>
    </div>
  );
};

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'rounded-md border-[1.5px]',
        'bgi-[var(--base-2-variant11)]',
        'bgi-border-[var(--base-2-variant6)]'
      )}
      style={{
        backgroundImage: `url(${getImgUrl(EResourceLevel.V, 'pattern')})`,
        backgroundSize: '100%',
        backgroundPosition: '1rem 1rem',
      }}
    >
      <div className={'w-auto h-full'}>{children}</div>
    </div>
  );
};

const payIconMapping: Record<string, string> = {
  tpay_upi: 'ic_upi',
  tpay: 'ic_qrpay',
};

const PayChannelCard = ({ item }: { item: PayChannelItem }) => {
  /* 當前選定支付通道 */
  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );
  const isActive = item.payName === currentPayChannel.payName;
  const payIcon = payIconMapping[item.payName] || undefined;
  const Wrapper = isActive ? ActiveCardWrapper : CardWrapper;

  return (
    <Wrapper>
      <div
        className="relative text-sm bgi-text-[var(--grayscale-100)] min-h-[56px] flex justify-center items-center"
        onClick={item.onAction}
      >
        <div className="absolute left-0 right-0 w-full flex justify-center items-center gap-3">
          {payIcon ? (
            <Icon className="w-8 h-8 !max-w-8 !max-h-8" name={`${payIcon}`} />
          ) : null}

          <p>{`${item.displayName}`}</p>
        </div>
        {item.isRecommend ? (
          <div className="w-full absolute -top-1.5 -right-1.5 z-10 flex items-end justify-end">
            <Icon
              className={cx(
                'w-6 h-6 p-1 bgi-[var(--base-2-variant8)] ',
                'rounded-full border bgi-border-[var(--base-1-variant1)]'
              )}
              name={'ic_recommend_2'}
            />
          </div>
        ) : null}
      </div>
    </Wrapper>
  );
};

const HowToUseItem = () => {
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();
  const { t } = useTranslation();
  return (
    <CardWrapper>
      <div
        className="relative text-sm text-nowrap bgi-text-[var(--grayscale-100)] min-h-[56px] flex justify-center items-center"
        onClick={() => {
          handleWalletPageBaseClick({
            actionName: handleWalletPageUseGuideActionClick,
          });
        }}
      >
        {/* TODO i18n */}
        {/* TODO Evan 觀賞教學獎勵 */}
        <p className={'mr-1'}>{t('How to use?')}</p>

        <div
          className={'h-[27px] w-[56px] absolute -top-3 -right-6 text-center'}
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
        <Icon className={'w-5 h-5'} name={'ic_double_arrow_right'} />
      </div>
    </CardWrapper>
  );
};
export const PayChannelList = () => {
  const { t } = useTranslation();

  /* 全部支付通道 */
  const allPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.allPayChannelActionItems
  );

  // TODO i18n
  return (
    <div className="flex flex-col gap-1 adm-space-justify-start">
      <div className="flex gap-1 text-base font-medium bgi-text-[var(--grayscale-100)]">
        <p>{t('Payment Methods')}</p>
        <StarMark className={'!bgi-text-[var(--base-1-main)]'} />
      </div>

      <div className={'grid grid-cols-3 gap-y-3 gap-x-2 py-2'}>
        {allPayChannelActionItems.map((item, index) => (
          <PayChannelCard key={`${item.payName}_${index}`} item={item} />
        ))}

        <HowToUseItem />
      </div>
    </div>
  );
};

// const PayChannelSwiper = () => {
//   const allPayChannelActionItems = useWalletPageRechargeContentStore(
//     (state) => state.allPayChannelActionItems
//   );
//
//   return (
//     <Swiper
//       className={'w-full !z-0'}
//       slidesPerView={3} // 一次顯示 3 個
//       spaceBetween={10} // 項目之間間距
//       loop={false} // 不輪播
//       observer={true}
//       observeParents={false}
//     >
//       {allPayChannelActionItems.map((item, index) => (
//         <SwiperSlide key={`${item.displayName}_${index}`}>
//           <PayChannelCard item={item} index={index} />
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// };
