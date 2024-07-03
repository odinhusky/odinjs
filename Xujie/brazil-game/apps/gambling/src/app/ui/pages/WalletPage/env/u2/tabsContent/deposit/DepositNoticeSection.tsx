import cx from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../reduxStore';

export const DepositNoticeSection = () => {
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
    <div
      className={cx(
        'mb-3 md:mb-5 p-2 md:p-3 lg:px-5 text-sm lg:text-base leading-5 lg:leading-6 border border-solid border-[var(--grayscale-20)] bg-[var(--grayscale-10)] text-[var(--secondary-main)] rounded-lg text-center'
      )}
    >
      Prezado usuário, quando o valor da primeira recarga ultrapassar{' '}
      {recharge_bonus_start} reais, você receberá até R${' '}
      {recharge_first_cashback_rate} de recompensa de recarga. A partir da
      segunda recarga, se o valor da recarga ultrapassar R${' '}
      {recharge_bonus_start}, você receberá um bônus de recarga de até{' '}
      {recharge_cashback_rate}! Quanto maior o valor da recarga, maior a
      proporção de presentes!
    </div>
  );
};
