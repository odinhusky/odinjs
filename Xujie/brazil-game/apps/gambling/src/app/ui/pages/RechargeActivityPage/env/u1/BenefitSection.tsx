import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';

export const BenefitSection = () => {
  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );

  return (
    <div className="md:px-8 text-white my-4 md:my-8">
      <div className="text-2xl font-bold mb-4">Recarga benefícios</div>
      <div className="mb-1 text-base md:text-2xl leading-6 md:leading-8">
        A partir de agora, a recarga pode obter recompensas extras em dinheiro.
      </div>
      <div className="text-base md:text-2xl leading-6 md:leading-8">
        Quanto mais você recarregar, maior será a taxa de recompensa, até{' '}
        {recharge_cashback_rate}. Após a recarga, o dinheiro extra também será
        transferido diretamente para a sua conta.
      </div>
    </div>
  );
};
