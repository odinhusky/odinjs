import cx from "apps/gambling/src/app/ui/utils/cx";
import U7RechargeButton from "./U7RechargeButton";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import t from "apps/gambling/src/assets/constant/lang";
import ProgressBarBlock from "./ProgressBarBlock";
import { useUserDama } from "../../../../hooks/useUserDama";
import { PROGRESS_GRID_NUM_ARRAY } from "apps/gambling/src/assets/constant/math";
import U7BorderDiv from "../../../../components/U7BorderDiv";
import { FLEX_CENTER } from "../../../../../../assets/constant/style";

interface U7TotalAccountProps {
  onClose?: <T>(arg?: T) => void;
  totalReasableValue: number;
  totalBalanceSheetValue: number;
}

export const U7TotalAccount = ({
  onClose,
  totalReasableValue,
  totalBalanceSheetValue,
}: U7TotalAccountProps) => {

  const {
    onClickToWallet,
  } = usePageNavigate();

  const { damaResult } = useUserDama();

  return (
    <div className={cx(
      'flex flex-col gap-3'
    )}>
      <h4 className={cx(
        'm-0',
        'block',
        'text-[var(--grayscale-100)] font-bold',
        'text-lg leading-6'
      )}>
        { t['totalAccount'] }
      </h4>

      <div className={cx(
        'py-5 px-3',
        'flex items-center',
        'gap-3',
        'rounded-lg',
        'bg-[var(--transparent-black-10)]',
      )}>

        <U7RechargeButton
          className="linear-2-button"
          onClick={() => {
            onClose && onClose();
            onClickToWallet({ panelType: "deposit" })
          }}
          totalValue={totalBalanceSheetValue}
          titleName={`${t['Balance']} ${t['Total']}`}
        >
          { t['Deposit'] }
        </U7RechargeButton>

        <U7RechargeButton
          className="linear-2-button"
          onClick={() => {
            onClose && onClose();
            onClickToWallet({ panelType: "withdraw" })
          }}
          totalValue={totalReasableValue}
          titleName={`${t['Withdrawable']} ${t['Total']}`}
        >
          { t['Withdraw'] }
        </U7RechargeButton>
      </div>

      {/*打码进度*/}
      {
        damaResult.isShowDama ? (
          <ProgressBarBlock
            title={t['currentBetProgress']}
            directProgress={damaResult.progressValue} 
            gridNum={PROGRESS_GRID_NUM_ARRAY[3]}
            progressColorClass={cx('bg-linear-3-main')}
          />
        ) : null
      }
    </div>
  )
}

export default U7TotalAccount;