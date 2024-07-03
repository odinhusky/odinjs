import { useInviteConfig } from 'apps/gambling/src/app/ui/hooks/useInviteConfig';
import { environment } from 'apps/gambling/src/environments/environment';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../reduxStore';

type QuestionSection = {
  className?: string;
};

export const QuestionSection1 = (props: QuestionSection) => {
  const { currentConfig } = useInviteConfig();
  const currentConfigItems = currentConfig ? currentConfig?.items : [];
  const reward_daily_reset = useSelector(
    (rootState: RootState) => rootState.app.config.reward_daily_reset
  );

  return (
    <>
      <div>
        Fornecer à {environment.platformName} um convite efetivo ao cliente (o
        cliente deve preencher o registro do número do celular e concluir uma
        recarga).
      </div>
      {currentConfigItems?.map((item, index) => {
        if (currentConfigItems.length - 1 !== index) {
          // NOTICE: 型別遺失 這個沒有寫 number 沒有被檢測到要number, money={Number(item.reward)}
          return (
            <div className={props.className} key={index}>{`Convidar ${
              item.num
            } - ${
              Number(currentConfigItems[index + 1]?.num) - 1
            } pessoas, recompense R$ ${Number(item.reward) / 100}`}</div>
          );
        } else {
          return (
            <div className={props.className} key={index}>{`Mais de ${
              item.num
            } pessoas, recompensa R$ ${Number(item.reward) / 100}`}</div>
          );
        }
      })}
      <div>
        As recompensas serão distribuídas às 11 horas do dia seguinte.
        {reward_daily_reset &&
          'Observe que o número de pessoas que você convidar naquele dia será zerado no dia seguinte e não será acumulado.'}
        Ao mesmo tempo, realizamos anticomissões de acordo com o valor da aposta
        do jogo do usuário do jogo na plataforma do jogo (a comissão é
        considerável). A taxa de comissão varia de jogo para jogo.
      </div>
    </>
  );
};
