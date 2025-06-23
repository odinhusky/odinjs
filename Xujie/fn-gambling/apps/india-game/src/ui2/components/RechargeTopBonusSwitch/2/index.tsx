import { Trans, useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils';
import Icon from '@components/Icon';
import { useEffect, useRef } from 'react';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
  useWalletRechargeHighBonusStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import { handleWalletPageRechargeBonusSwitchClick } from '@mode2/action/actionTypes';
import { useHighBonusRecharge } from '@mode2/usecase/page/walletPage/rechargeContent/useHighBonusRechargeContentBase';
import { formatDurationTimeSplit } from '@mode2/utils';
import { usePlatformDynamicConfigStore } from '@libs/mode2/zustand/platform/platformDynamicConfig';

const HighBonusCoolDown = () => {
  const { saveRemainTime, handleOverdueCoolDown } = useHighBonusRecharge();
  const countdownRef = useRef<number>(0);

  // 上一次剩餘時間
  const highBonusRemainTime = useWalletRechargeHighBonusStore(
    (state) => state.highBonusRemainTime
  );

  // 倒數時間
  const highBonusCoolDownTime = useWalletRechargeHighBonusStore(
    (state) => state.highBonusCoolDownTime
  );

  // 設置倒數時間
  const setHighBonusCoolDownTime = useWalletRechargeHighBonusStore(
    (state) => state.setHighBonusCoolDownTime
  );

  useEffect(() => {
    const remainTime = highBonusRemainTime;
    if (remainTime > 0) {
      countdownRef.current = remainTime;
      setHighBonusCoolDownTime(remainTime);
    }
  }, [highBonusRemainTime]);

  const clearCoolDownInterval = (timer: NodeJS.Timer | null) => {
    if (highBonusRemainTime > 0) {
      // 倒數未結束，儲存剩餘時間
      saveRemainTime(countdownRef.current);
    } else {
      // 等待下一次30分鐘後重置，不可以儲存
    }
    timer && clearInterval(timer);
  };

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (countdownRef.current > 0) {
      timer = setInterval(() => {
        countdownRef.current =
          countdownRef.current > 0 ? countdownRef.current - 1 : 0;
        if (countdownRef.current <= 0) {
          handleOverdueCoolDown();
        }
        setHighBonusCoolDownTime(countdownRef.current);
      }, 1000);
    }
    return () => {
      timer && clearCoolDownInterval(timer);
    };
  }, [countdownRef]);

  return (
    <div className="flex justify-center items-center gap-1 text-xs bgi-text-[var(--base-2-main)] font-medium">
      <div className="bgi-[var(--grayscale-10)] rounded-lg py-0.5 px-1.5 text-center ">
        <p className={'bgi-text-[var(--base-2-main)]'}>
          {formatDurationTimeSplit(highBonusCoolDownTime).minutes}
        </p>
      </div>
      <span>{':'}</span>
      <div className="bgi-[var(--grayscale-10)] rounded-lg py-0.5 px-1.5 text-center">
        <p className={'bgi-text-[var(--base-2-main)]'}>
          {formatDurationTimeSplit(highBonusCoolDownTime).seconds}
        </p>
      </div>
    </div>
  );
};
/**
 * export enum RechargeCard {
 *   TOP_UP_BONUS = 'TOP_UP_BONUS',
 *   HIGH_BONUS = 'HIGH_BONUS',
 * }
 * @constructor
 */
const RechargeTopBonusSwitch = () => {
  const { t } = useTranslation();
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();

  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );
  const isSupportHighBonus = useWalletRechargeHighBonusStore(
    (state) => state.isSupportHighBonus
  );
  const { depositBonusUpPercent } = usePlatformDynamicConfigStore();
  return (
    <div className="flex justify-start items-center gap-2">
      <div
        className={cx(
          'w-6 h-6 p-0.5 rounded-full border border-[var(--grayscale-70)] cursor-pointer',
          {
            'bgi-[var(--base-2-main)]':
              currentRechargeCard === RechargeCard.HIGH_BONUS,
          }
        )}
        onClick={() => {
          handleWalletPageBaseClick({
            actionName: handleWalletPageRechargeBonusSwitchClick,
          });
        }}
      >
        <Icon
          name="ic_check"
          className={cx('w-full h-full', {
            hidden: currentRechargeCard !== RechargeCard.HIGH_BONUS,
          })}
        />
      </div>
      <span className="text-sm bgi-text-[var(--grayscale-100)]">
        {t('wallet_deposit_premium_bonus')}
      </span>
      {isSupportHighBonus ? <HighBonusCoolDown /> : null}
      {currentRechargeCard === RechargeCard.HIGH_BONUS && (
        <span className="text-sm mobile:text-base font-black">
          +
          <Trans
            i18nKey="deposit_wheel_prize"
            values={{
              value: ` ${depositBonusUpPercent}%`,
            }}
            components={{
              divTag: <span />,
            }}
          />
        </span>
      )}
    </div>
  );
};

export default RechargeTopBonusSwitch;
