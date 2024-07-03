import { environment } from '../../../../../../environments/environment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import moment from 'moment';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { BaseModal } from '../../../BaseModal';
import { appSlice } from 'apps/gambling/src/app/reduxStore/appSlice';
import cx from '../../../../utils/cx';
import t from 'apps/gambling/src/assets/constant/lang';

interface IMaintenanceModal {
  onClickToOpenTelegramService: () => void;
}

export const U7MaintenanceModal = (props: IMaintenanceModal) => {
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
    <BaseModal className={cx('px-4 py-6')}>
      <div
        className={cx(
          'border-stroke-popup',
          'rounded-[20px]',
          'h-auto',
          'max-mobile:overflow-auto'
        )}
      >
        <div
          className={cx(
            'w-full tab:max-w-[640px]',
            'h-full tab:max-h-[625px]',
            'p-4 tab:p-8',
            'rounded-[20px]',
            'box-border',
            'text-center text-[var(--grayscale-100)]',
            'bg-popup1'
          )}
        >
          <h6
            className={cx(
              'block',
              'text-center text-[var(--grayscale-100)] font-bold',
              'text-base leading-5',
              'mobile:text-lg leading-6'
            )}
          >
            {t['maintenanceTitle']}
          </h6>

          <p
            className={cx(
              'block',
              'w-full',
              'h-[95%] mobile:max-h-[504px]',
              'overflow-y-auto',
              'flex flex-1',
              'text-[var(--transparente-80)]',
              'text-base mobile:text-lg'
            )}
          >
            {t['maintenanceP1'](
              environment.platformName,
              maintenanceStart,
              maintenanceEnd,
              maintenanceLeftTime
            )}
            <br></br>
            <br></br>
            {t['maintenanceP2'](environment.platformName, telegramService)}
            <br></br>
            <br></br>
            {t['maintenanceP3']}
            <br></br>
            <br></br>
            {t['maintenanceP5']}
            <br></br>
            <br></br>
            {t['maintenanceP4'](environment.platformGroup)}
          </p>
        </div>
      </div>
    </BaseModal>
  );
};

export default U7MaintenanceModal;
