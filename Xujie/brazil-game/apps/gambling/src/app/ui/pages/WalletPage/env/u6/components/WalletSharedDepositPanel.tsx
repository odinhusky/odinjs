import { IDepositPanelProps } from '../../../components/deposit/DepositPanel';
import { DepositInput } from '../../../components/deposit/DepositInput';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import t from 'apps/gambling/src/assets/constant/lang';
import WalletDepositBtn from './WalletDepositBtn';
import cx from 'apps/gambling/src/app/ui/utils/cx';
import WalletBtn from './WalletBtn';
import { get } from 'lodash';

const WalletSharedDepositPanel = ({
  isLoaded,
  depositInputProps,
  depositButtonsOptions,
  selectedIndex,
  selectedIndexConfig,
  handleClickDepositMoneyButton,
  onClickToNextDepositPage,
}: IDepositPanelProps) => {
  const buyTimes = get(selectedIndexConfig, 'user_count_day', 0);

  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );
  const recharge_bonus_start = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_bonus_start
  );
  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );

  return (
    <div className="text-white">
      {/* Notification */}
      <div className={cx('mb-3 mobile:mb-4 tablet:mb-7')}>
        <p>
          {t['walletDeopsitNotificationP1'](
            recharge_bonus_start,
            recharge_first_cashback_rate
          )}
        </p>
        <p>
          {t['walletDeopsitNotificationP2'](
            recharge_bonus_start,
            recharge_cashback_rate,
            buyTimes
          )}
        </p>
      </div>

      {isLoaded && <DepositInput {...depositInputProps} />}

      <div
        className={cx(
          'grid',
          'grid-cols-2 gap-2',
          'mobile:grid-cols-4 mobile:gap-4',
          'tablet:grid-cols-5 tablet:gap-5'
        )}
      >
        {depositButtonsOptions?.map((option, index) => {
          const { rechargeValue, isShowRate, config, rate } = option;
          const isSelected = selectedIndex === index;

          return (
            <WalletDepositBtn
              key={index}
              isSelected={isSelected}
              isShowRate={isShowRate}
              rechargeValue={rechargeValue}
              rate={rate}
              onClick={() => {
                handleClickDepositMoneyButton(rechargeValue, index, config);
              }}
            />
          );
        })}
      </div>

      <div
        className={cx('flex justify-center', 'mt-3 mobile:mt-4 tablet:mt-7')}
      >
        <WalletBtn children={t['Deposit']} onClick={onClickToNextDepositPage} />
      </div>
    </div>
  );
};

export default WalletSharedDepositPanel;
