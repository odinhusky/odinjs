import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { formatMoney } from '@libs/mode2/utils';
import { useRechargeWheelTabStore } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import useMode2RechargeWheelPageStore, {
  defaultAnchorPointList,
} from '@libs/mode2/zustand/page/rechargeWheelPage';
import get from 'lodash/get';
import { useTranslation } from 'react-i18next';

interface RechargeWheelDepositInfoProps {}

export const RechargeWheelDepositInfo = ({}: RechargeWheelDepositInfoProps) => {
  const { t } = useTranslation();

  const activeRechargeActiveTab = useRechargeWheelTabStore(
    (state) => state.activeRechargeActiveTab
  );

  const currentDeposit = useMode2RechargeWheelPageStore(
    (state) => state.currentDeposit
  );

  const progressConfigObj = useMode2RechargeWheelPageStore(
    (state) => state.progressConfigObj
  );

  const isShowDepositInfo = useMode2RechargeWheelPageStore(
    (state) => state.isShowDepositInfo
  );

  const thisProgressObj = progressConfigObj[activeRechargeActiveTab];
  const thisAnchorPointList = get(
    thisProgressObj,
    'anchorPointList',
    defaultAnchorPointList
  );

  const thisClosestPoint = thisAnchorPointList.find(
    (item) => item.requiredReward > currentDeposit
  ) || { requiredReward: currentDeposit + 200, receiveSpin: 1 };

  const thisDepositMoreMoney =
    thisClosestPoint.requiredReward > currentDeposit
      ? thisClosestPoint.requiredReward - currentDeposit
      : 0;

  return (
    <div className={cx(FLEX_CENTER)}>
      <span
        className={cx(
          'block',
          'text-sm font-medium',
          'bgi-text-[var(--grayscale-100)]',
          isShowDepositInfo ? 'opacity-100' : 'opacity-0'
        )}
      >
        {t('deposit_wheel_deposit_amount_get_spin', {
          count: thisClosestPoint.receiveSpin,
          depositMoreMoney: formatMoney({ value: thisDepositMoreMoney }),
          receiveSpin: thisClosestPoint.receiveSpin,
        })}
      </span>

      {/* deposit amount: XX */}
      {/* <div className={cx(FLEX_ITEMS_CENTER, 'gap-1', 'text-xxs')}>
        <span className={cx('bgi-text-[var(--grayscale-70)]')}>
          {t('deposit_wheel_deposit_amount')}
        </span>
        <span className={cx('bgi-text-[var(--linear-2)]')}>
          {formatMoney({value: currentDeposit})}
        </span>
      </div> */}
    </div>
  );
};

export default RechargeWheelDepositInfo;
