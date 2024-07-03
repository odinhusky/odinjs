import cx from "apps/gambling/src/app/ui/utils/cx";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import { environment } from "apps/gambling/src/environments/environment";
import t from "apps/gambling/src/assets/constant/lang";

interface WalletWithdrawWarningZoneProps {

}

export const WalletWithdrawWarningZone = ({

}: WalletWithdrawWarningZoneProps) => {
  return (
    <div className={cx(
      'my-4 tablet:my-3',
      'p-2',
      'bg-[var(--grayscale-20)] mobile:bg-transparent',
      'mobile:flex mobile:items-center',
      'rounded-lg'
    )}>
      {/* Warning Icon */}
        <div className={cx(
          'w-full mobile:w-auto',
          FLEX_CENTER,
          'mb-2 mobile:mb-0 mobile:mr-[20px]'
        )}>
          <div className={cx(
            'w-[24px] h-[24px]',
            'mobile:w-[32px] mobile:h-[32px]',
            'tablet:w-[36px] tablet:h-[36px]',
            'bg-linear-1-main',
            'rounded-full',
          )}>
            <img
              className={cx('w-full h-full')}
              src={`assets/${environment.uVersion}/icon_warn.png`} alt="Warning image" />
          </div>
      </div>
        
      <span className={cx(
        'block',
        'w-full flex-1',
        'text-center mobile:text-left',
        'text-sm tablet:text-base',
        'leading-5 tablet:leading-6',
        'text-[var(--grayscale-70)]'
      )}>
        {t['withdrawWarning']}
      </span>
    </div>
  )
}

export default WalletWithdrawWarningZone;