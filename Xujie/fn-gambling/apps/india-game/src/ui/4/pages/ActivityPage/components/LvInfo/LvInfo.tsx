import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import BaseProgress from '@libs/mode2/components/BaseProgress';
import { formatMoney } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
export interface LvInfoProps {
  curLv: number;
  maxLv: number;
  percent: number;
  deposit?: number;
  rechargeAmount?: number;
  hiddenProcess?: boolean;
  vipLevel?: number; // 當前用戶的level
}

export const LvInfo = ({
  curLv,
  maxLv,
  percent,
  rechargeAmount = 0,
  deposit = 0,
  hiddenProcess = false,
  vipLevel,
}: LvInfoProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        'w-full px-5 pb-4 box-border',
        'absolute',
        'flex flex-col justify-center items-center gap-1.5',
        'text-sm '
      )}
    >
      {/* 用戶非當前等級時顯示 */}
      {vipLevel !== curLv + 1 ? (
        <div className="bgi-text-[var(--grayscale-30)]">
          {t('activity_VIP_cards_deposit_amount')} {formatMoney(deposit)}
        </div>
      ) : null}

      {/* 用戶當前等級時顯示 */}
      {vipLevel === curLv + 1 ? (
        <div className="bgi-text-[var(--grayscale-30)]">
          {/* TODO i18n */}Next level upgrade requirements
        </div>
      ) : null}

      {!hiddenProcess && (
        <div className="w-full h-full relative text-xs font-medium bgi-text-[var(--grayscale-100)]">
          <div
            className={cx(
              'absolute left-2.5 top-0 z-10 h-full',
              FLEX_ITEMS_CENTER
            )}
          >
            V{curLv}
          </div>

          <BaseProgress
            percent={percent}
            strokeWidth={18}
            strokeClass="!bgi-[var(--grayscale-60)]"
            trailClass="!bgi-[var(--state-error-main)]"
          />

          <div
            className={cx(
              'absolute left-0 top-0 w-full h-full z-10',
              FLEX_CENTER
            )}
          >
            {formatMoney(rechargeAmount)} / {formatMoney(deposit)}
          </div>

          <div
            className={cx('absolute right-2.5 top-0.5 z-10', FLEX_ITEMS_CENTER)}
          >
            {curLv >= maxLv ? 'Max' : 'V' + (curLv + 1)}
          </div>
        </div>
      )}
    </div>
  );
};

export default LvInfo;
