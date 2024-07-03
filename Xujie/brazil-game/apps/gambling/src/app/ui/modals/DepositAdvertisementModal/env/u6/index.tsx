import { environment } from '../../../../../../environments/environment';
import { CloseICON } from '../../../../components-bs/Icons/CloseICON';
import React from 'react';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { IDepositAdvertisementModalProps } from '../../index';

export const DepositAdvertisementModal = ({
  onConfirm,
  close,
}: IDepositAdvertisementModalProps) => {
  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );

  return (
    <div
      className="bg-linear-6-main relative flex flex-col gap-4 w-10/12 tablet:w-[552px] mobile:w-[360px] text-[var(--grayscale-100)] rounded-xl 
      py-6 px-4 tablet:py-10 tablet:px-9 mobile:p-8"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <button
        className="linear-5-button absolute w-7 tablet:w-10 mobile:w-9 h-7 tablet:h-10 mobile:h-9 
          top-2 right-2 mobile:top-3 mobile:right-3 rounded-full"
        onClick={close}
      >
        <img
          className="w-1/2"
          src={`assets/${environment.uVersion}/ic_close_noBorder.png`}
          alt="close"
        />
      </button>
      <div className=" flex flex-col justify-center">
        <img
          alt="bg"
          src={`assets/${environment.uVersion}/ic_deposit_advertisement.png`}
        />
        <div className="text-base tablet:text-2xl mobile:text-lg text-center font-medium">
          Equilíbrio insuficiente!
        </div>
      </div>
      <div className="text-sm tablet:text-lg text-center font-normal">
        Caros clientes VIP, você pode obter até {recharge_first_cashback_rate}
        de recompensa ao recarregar. Quanto mais você recarrega, mais bônus você
        recebe! Sem limite de tempo!
      </div>
      <button
        className="linear-1-button h-9 tablet:h-12 font-bold"
        onClick={onConfirm}
      >
        Depósito
      </button>
    </div>
  );
};
