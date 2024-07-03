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

export const U6MaintenanceModal = (props: IMaintenanceModal) => {
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
    <BaseModal>
      <div
        className="
        w-[320px] mobile:w-[480px] tablet:w-[606px] px-4 py-6 mobile:px-8 mobile:py-8 tablet:px-9 tablet:py-10 rounded-xl
        absolute box-border text-center text-[var(--grayscale-100)] bg-linear-6-main"
      >
        <div className="w-full space-y-4 mobile:space-y-[10px] target:space-y-2">
          <div>
            <img
              className={'h-[120px] mobile:h-[200px] tablet:h-[280px] mx-auto'}
              src={`assets/${environment.uVersion}/${environment.mVersion}/maintenance_popup_icon.png`}
              alt={'icon'}
            />
          </div>

          <div className="w-full space-y-1 mobile:space-y-[18px] target:space-y-6">
            <div className="text-base mobile:text-lg tablet:text-xl font-medium">
              Prezados usuários VIP
            </div>
            <div
              className="
              w-full max-mobile:h-[268px] max-tablet:h-[328px] h-full overflow-auto flex flex-1 text-[var(--transparente-80)] text-start text-xs mobile:text-sm"
            >
              {`O serviço do sistema ${environment.platformName} está sendo atualizado e mantido.
                De ${maintenanceStart} (Brasil) até ${maintenanceEnd}, o tempo estimado de manutenção é de ${maintenanceLeftTime}. 
                Durante a manutenção do sistema, evite cadastro, login, jogos e outras operações. Obrigado pela sua compreensão e apoio!`}
              <br></br>
              <br></br>
              {`Durante o período de manutenção do sistema, para evitar prejuízos, pedimos que não realize outras operações como depósitos e saques.
                Ao mesmo tempo, preparamos novas surpresas e recompensas de eventos para você, que serão anunciadas no ${environment.platformName} Canal 
                https://t.me/${telegramService} de tempos em tempos. Se você estiver interessado, por favor, junte-se o mais rápido possível. possível. O tempo do evento é limitado.`}
              <br></br>
              <br></br>
              {`Após o término da manutenção do sistema, forneceremos atendimento ao cliente on-line 7 × 24 para responder às suas perguntas! Obrigado pela sua paciência!`}
              <br></br>
              <br></br>
              {`Alegria e emoções positivas dobram sua felicidade. Que o novo serviço traga mais recompensas e deixe você ir bem!`}
              <br></br>
              <br></br>
              {`Lançado pelo ${environment.platformGroup}`}
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default U6MaintenanceModal;
