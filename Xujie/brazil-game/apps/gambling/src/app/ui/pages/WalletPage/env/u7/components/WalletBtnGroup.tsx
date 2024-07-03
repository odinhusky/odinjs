import t from "apps/gambling/src/assets/constant/lang";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { BaseBtn } from "apps/gambling/src/app/ui/components-bs/Buttons/BaseBtn";
import { environment } from "apps/gambling/src/environments/environment";
import { CacheImage } from "apps/gambling/src/app/ui/components/image/CacheImage";
import { BalanceSectionType } from "../types/walletTypes";

interface WalletBtnGroupProps {
  tabState: string;
  handleSetTabState: (val: BalanceSectionType) => void;
  groupClass?: string;
}

export const WalletBtnGroup = ({
  tabState,
  handleSetTabState,
  groupClass = ''
}: WalletBtnGroupProps) => {
  const btnList = [
    {
      text: t['totalBill'],
      state: 'total',
      src: `assets/${environment.uVersion}/icon_wallet_page_balance_total.png`,
      activeSrc: `assets/${environment.uVersion}/icon_wallet_page_balance_total_active.png`,
      alt: 'Total icon Image'
    },
    {
      text: t['depositAccount'],
      state: 'deposit',
      src: `assets/${environment.uVersion}/icon_wallet_page_balance_deposit.png`,
      activeSrc: `assets/${environment.uVersion}/icon_wallet_page_balance_deposit_active.png`,
      alt: 'Deposit icon Image'
    },
    {
      text: t['promotedAccount'],
      state: 'promotion',
      src: `assets/${environment.uVersion}/icon_wallet_page_balance_promotion.png`,
      activeSrc: `assets/${environment.uVersion}/icon_wallet_page_balance_promotion_active.png`,
      alt: 'Promotion icon Image'
    }
  ]

  return (
    <div className={cx(
      'mt-3 mobile:mt-4 tablet:mt-6',
      'flex items-center gap-2 mobile:gap-4 tablet:gap-3',
      groupClass
    )}>
      {
        btnList.map((btn) => {
          const isActive = tabState === btn.state;
          return (
            <BaseBtn
              isActive={isActive}
              leftIcon={
                <>
                  <CacheImage
                    className={cx(
                      'w-[20px] mobile:w-[21px]',
                      { 'hidden': isActive }
                    )}
                    src={btn.src}
                    alt={btn.alt}
                  />

                  <CacheImage
                    className={cx(
                      'w-[20px] mobile:w-[21px]',
                      { 'hidden': !isActive }
                    )}
                    src={btn.activeSrc}
                    alt={btn.alt}
                  />
                </>
              }
              leftContainerClass={cx('mb-[6px] mr-0 mobile:mb-0 mobile:mr-[10px]')}
              children={btn.text}
              childrenClass={cx('text-sm leading-5 mobile:text-base mobile:leading-6 tablet:text-lg')}
              btnCenterClass={cx('flex-col mobile:flex-row')}
              btnClass={cx(
                'h-[76px] mobile:h-[40px] tablet:h-[44px]',
                'py-[6px] mobile:py-[8px] tablet:py-[10px]'
              )}
              onClick={()=> { handleSetTabState(btn.state as BalanceSectionType) }}
            />
          )
        })
      }
    </div>
  )
}

export default WalletBtnGroup;