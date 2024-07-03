import { IDepositPanelProps } from '../../../components/deposit/DepositPanel';
import { DepositInput } from '../../../components/deposit/DepositInput';
import { formatLocaleMoney } from '../../../../../utils/format';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';
import cx from 'apps/gambling/src/app/ui/utils/cx';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

const DesktopDepositPanel = ({
  isLoaded,
  depositInputProps,
  depositButtonsOptions,
  selectedIndex,
  handleClickDepositMoneyButton,
  onClickToNextDepositPage,
}: IDepositPanelProps) => {
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
    <div className="text-white p-8 rounded-lg bg-[var(--grayscale-20)] mt-8">
      {isLoaded && <DepositInput {...depositInputProps} />}

      <div className="mt-8 py-3 px-5 rounded-lg bg-[var(--grayscale-25)]">
        <p>
          Prezado usuário, quando o valor da primeira recarga ultrapassar R${' '}
          {recharge_bonus_start} reais, você receberá até{' '}
          {recharge_first_cashback_rate} de recompensa de recarga.
        </p>
        <p>
          {' '}
          A partir da segunda recarga, se o valor da recarga ultrapassar R${' '}
          {recharge_bonus_start}, você receberá um bônus de recarga de até{' '}
          {recharge_cashback_rate}! Quanto maior o valor da recarga, maior a
          proporção de presentes!
        </p>
      </div>

      <div className="grid grid-cols-5 gap-5 mt-8">
        {depositButtonsOptions?.map((option, index) => {
          const { rechargeValue, isShowRate, config, rate } = option;
          const isActive = selectedIndex === index;

          return (
            <button
              key={index}
              className={cx(
                FLEX_CENTER,
                'group flex-col gap-1',
                'rounded-lg',
                'min-h-[72px]',
                'bg-[var(--grayscale-25)]',
                'hover:bg-[var(--grayscale-40)]',
                isActive && 'bg-linear-5-dark-active'
              )}
              onClick={() =>
                handleClickDepositMoneyButton(rechargeValue, index, config)
              }
            >
              <div className="font-extrabold text-base">
                R${formatLocaleMoney(rechargeValue)}
              </div>
              {isShowRate && (
                <div
                  className={cx(
                    'text-sm rounded min-w-[96px] bg-[var(--grayscale-40)] py-[2px]',
                    'group-hover:bg-[var(--grayscale-60)]',
                    isActive && 'bg-linear-5-dark-active'
                  )}
                >
                  R${rate}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onClickToNextDepositPage}
          className={cx(
            'linear-5-button',
            'min-w-[480px] rounded-full text-white py-3 font-extrabold shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]'
          )}
        >
          Depósito
        </button>
      </div>
    </div>
  );
};

export default DesktopDepositPanel;
