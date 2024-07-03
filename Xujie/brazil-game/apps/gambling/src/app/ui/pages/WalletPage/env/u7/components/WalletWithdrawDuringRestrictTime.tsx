import cx from "apps/gambling/src/app/ui/utils/cx";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import { environment } from "apps/gambling/src/environments/environment";
import WalletContent from "./WalletContent";
import t from "apps/gambling/src/assets/constant/lang";
interface WalletWithdrawDuringRestrictTimeProps {
  withdrawBegin: string;
  withdrawEnd: string;
}

export const WalletWithdrawDuringRestrictTime = ({
  withdrawBegin,
  withdrawEnd
}: WalletWithdrawDuringRestrictTimeProps) => {
  return (
    <div className=" flex flex-col gap-5 text-sm">
      {/* <div className={cx(FLEX_CENTER, 'mb-3')}>
        <img 
          className={cx(
            'w-[27px]',
            'mr-[15px]'
          )}
          src={`assets/${environment.uVersion}/${environment.mVersion}/icon_loading.png`} 
          alt="Loading icon image" 
        />
        <span className={cx(
          'text-base leading-6 mobile:text-lg tablet:text-2xl tablet:leading-7 text-white font-medium'
        )}>{t['withdrawRestrictTitle']}</span>
      </div> */}
      
      <WalletContent>
        {t['withdrawRestrictP1_U7']} <span className="text-[var(--state-warn-main)]">{withdrawBegin} às {withdrawEnd}</span>, horário brasileiro!
      </WalletContent>

      <WalletContent>
        {t['withdrawRestrictP2']}
      </WalletContent>

      <WalletContent className="mb-0">
        {t['withdrawRestrictP3']}
      </WalletContent>
    </div>
  )
}
export default WalletWithdrawDuringRestrictTime;