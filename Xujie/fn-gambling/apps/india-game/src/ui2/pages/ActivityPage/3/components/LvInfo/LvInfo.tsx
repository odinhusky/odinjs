import { formatMoney } from '@libs/mode2/utils';
import Progress from 'antd/es/progress';
import { useTranslation } from 'react-i18next';
export interface LvInfoProps {
  curLv: number;
  maxLv: number;
  percent: number;
  deposit?: number;
  rechargeAmount?: number;
  hiddenProcess?: boolean;
}

export const LvInfo = ({
  curLv,
  maxLv,
  percent,
  rechargeAmount = 0,
  deposit = 0,
  hiddenProcess = false,
}: LvInfoProps) => {
  const { t } = useTranslation();

  return (
    <div className="absolute flex flex-col gap-1 bottom-0 left-0 right-0 text-sm font-medium bgi-text-[var(--grayscale-100)] w-full font-semibold text-xs mobile:text-sm px-3 mobile:px-4 bgi-[var(--transparent-gray-30)] py-2.5">
      <div>
        {t('activity_VIP_cards_deposit_amount')}{' '}
        {formatMoney({ value: deposit })}
      </div>
      {!hiddenProcess && (
        <div className="flex flex-row items-center font-semibold gap-2">
          <div className="text-xxs">V{curLv}</div>
          <div className="w-full relative">
            <Progress
              className="vip-level-progress"
              percent={percent}
              showInfo={false}
            />
            <div className=" absolute left-0 top-0 text-base w-full h-full flex items-center justify-center scale-50 origin-center">
              {formatMoney({ value: rechargeAmount })} /{' '}
              {formatMoney({ value: deposit })}
            </div>
          </div>

          <div className="text-xxs">
            {curLv >= maxLv ? 'Max' : 'V' + (curLv + 1)}
          </div>
        </div>
      )}
    </div>
  );
};

export default LvInfo;
