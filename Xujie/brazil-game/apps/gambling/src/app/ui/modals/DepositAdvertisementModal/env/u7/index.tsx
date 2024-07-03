import { environment } from '../../../../../../environments/environment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { IDepositAdvertisementModalProps } from '../../index';
import { U7Modal } from '../../../UModal/u7/U7Modal';
import cx from '../../../../utils/cx';
import t from 'apps/gambling/src/assets/constant/lang';
import { X_CENTER } from 'apps/gambling/src/assets/constant/style';
import U7OutlinedTransparentBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedTransparentBtn';

export const DepositAdvertisementModalU7 = ({
  onConfirm,
  close,
}: IDepositAdvertisementModalProps) => {
  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );

  return (
    <U7Modal onClose={close} isShowBorder={false} modalClass={cx('bg-popup2')}>
      <div
        className={cx(
          'relative',
          'flex flex-col',
          'text-[var(--grayscale-100)]'
        )}
      >
        <div
          className={cx(
            'flex flex-col justify-center',
            'pt-[30%] se:pt-[80px]'
          )}
        >
          <img
            className={cx(
              'max-w-fit',
              'w-[90%] se:w-[320px]',
              'absolute left-0',
              X_CENTER,
              'top-[-30%] se:top-[-120px]'
            )}
            src={`assets/${environment.uVersion}/ic_deposit_advertisement.png`}
            alt="bg"
          />

          <div
            className={cx(
              'text-[24px] leading-[32px]',
              'tab:text-[30px] tab:leading-[40px]',
              'text-center font-bold text-white'
            )}
          >
            {t['DepositAdvertisementModalTitle']}
          </div>
        </div>

        <div
          className={cx(
            'mt-3',
            'text-[18px] leading-[24px]',
            'text-center font-medium'
          )}
        >
          {t['DepositAdvertisementModalText'](recharge_first_cashback_rate)}
        </div>

        <U7OutlinedTransparentBtn
          className={cx(
            'max-w-[200px]',
            'h-[48px]',
            'text-[18px] leading-[24px]',
            'font-bold'
          )}
          containerClass={cx('mt-8')}
          onClick={onConfirm}
        >
          {t['Deposit']}
        </U7OutlinedTransparentBtn>
      </div>
    </U7Modal>
  );
};

export default DepositAdvertisementModalU7;
