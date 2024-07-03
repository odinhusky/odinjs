import { environment } from '../../../../../../environments/environment';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import moment from 'moment';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { ReactElement } from 'react';
import { BaseModal } from '../../../BaseModal';
import { appSlice } from 'apps/gambling/src/app/reduxStore/appSlice';

interface IMaintenanceModal {
  onClickToOpenTelegramService: () => void;
}

const Paragraph = ({ text }: { text: string | ReactElement }) => {
  const { isMobile } = useBreakpoint();
  return (
    <div
      className={cx('mb-3 text-white text-center', {
        'text-xl leading-7': !isMobile,
        'text-lg leading-7': isMobile,
      })}
    >
      {text}
    </div>
  );
};

const Content = ({ text }: { text: string | ReactElement }) => {
  return (
    <div className={'mb-3 text-white text-center text-sm leading-5'}>
      {text}
    </div>
  );
};

export const U5MaintenanceModal = (props: IMaintenanceModal) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const dispatch = useDispatch();
  const maintenance = useSelector((state: RootState) => state.app.maintenance);
  const telegramService = AppLocalStorage.getItem(
    AppLocalStorageKey.telegramService
  );

  const maintenanceStart = moment(maintenance.start).format('DD-MM-YYYY HH:mm');
  const maintenanceEnd = moment(maintenance.end).format('DD-MM-YYYY HH:mm');
  const maintenanceMinutes = moment(maintenance.end).diff(
    moment(maintenance.start),
    'minutes'
  );
  const maintenanceHours = Math.ceil(maintenanceMinutes / 60);
  const maintenanceLeftTime =
    maintenanceMinutes >= 180
      ? `${maintenanceHours} horas`
      : `${maintenanceMinutes} minutos`;

  const closeModal = () => {
    dispatch(appSlice.actions.setShowMaintenanceModal(false));
  };

  return (
    <BaseModal
      onClose={() => {
        closeModal();
      }}
    >
      <div
        className={cx(
          'flex flex-col fixed bg-linear-5-main rounded-lg py-6 max-h-[840px]',
          {
            // NOTE: mt-[46px]:圖往上74px-24px(mb-6)
            'mt-[50px] px-6 w-[544px] h-[840px]': !isMobile,
            // NOTE: mt-[75px]:圖往上99px-24px(mb-6)
            'mt-[0px] w-[calc(100%-32px)] h-[calc(100%-300px)] px-4 md:w-[703px] justify-center items-center':
              isMobile,
          }
        )}
      >
        {/* Close Btn */}
        <button
          className="group absolute -right-2.5 -top-2.5 w-10 h-10 rounded-full flex justify-center items-center bg-linear-5-main shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]"
          onClick={() => {
            closeModal();
          }}
        >
          <img
            className="w-[24px] h-[24px] group-hover:opacity-80"
            src={`assets/${environment.uVersion}/icon_close.png`}
            alt="close icon image"
          />
        </button>

        <div
          className={cx('self-center', {
            'w-[480px] h-[320px] my-5 ': isDesktop,
            'my-5 w-[480px] h-[320px]': isTablet,
            'w-[344px] h-[226px] mb-1 mt-1': isMobile,
          })}
        >
          <img
            className={'w-full h-full'}
            src={`assets/${environment.uVersion}/${environment.mVersion}/maintenance_popup_icon.png`}
            alt={'icon'}
          />
        </div>
        <div className="overflow-auto flex-1">
          <Paragraph text={'Prezados usuários VIP:'} />
          <Content
            text={`O serviço do sistema ${environment.platformName} está sendo atualizado e mantido.
            De ${maintenanceStart} (Brasil) até ${maintenanceEnd}, o tempo estimado de manutenção é de ${maintenanceLeftTime}. Durante a manutenção do sistema, evite cadastro, login, jogos e outras operações. Obrigado pela sua compreensão e apoio!`}
          />
          <Content
            text={
              <div>
                {`Durante o período de manutenção do sistema, para evitar prejuízos, pedimos que não realize outras operações como depósitos e saques. Ao mesmo tempo, preparamos novas surpresas e recompensas de eventos para você, que serão anunciadas no ${environment.platformName} Canal `}
                <button
                  className="text-[var(--secondary-assistant)]"
                  onClick={props.onClickToOpenTelegramService}
                >
                  {' '}
                  {`(https://t.me/${telegramService})`}
                </button>
                {
                  ' de tempos em tempos. Se você estiver interessado, por favor, junte-se o mais rápido possível. possível. O tempo do evento é limitado.'
                }
              </div>
            }
          />
          <Content
            text={`Após o término da manutenção do sistema, forneceremos atendimento ao cliente on-line 7 × 24 para responder às suas perguntas! Obrigado pela sua paciência!`}
          />
          <Content
            text={`Alegria e emoções positivas dobram sua felicidade. Que o novo serviço traga mais recompensas e deixe você ir bem!`}
          />
          <Content text={`Lançado pelo ${environment.platformGroup}`} />
        </div>
      </div>
    </BaseModal>
  );
};

export default U5MaintenanceModal;
