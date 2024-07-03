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
      className="relative xl:w-[424px] w-[80vw] md:w-[360px] p-8 rounded-lg bg-linear-4-main"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <button
        className="absolute -right-2.5 -top-2.5 w-10 h-10 rounded-full flex justify-center items-center bg-linear-4-main shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]"
        onClick={close}
      >
        <img
          className="w-[24px] h-[24px] hover:opacity-80"
          src={`assets/${environment.uVersion}/icon_close.png`}
          alt="close"
        />
      </button>
      <div>
        <img
          alt="bg"
          className="w-full"
          src={`assets/${environment.uVersion}/ic_deposit_advertisement.png`}
        />
        <div className="flex flex-col tablet:mt-4">
          <div className="text-white">
            <div className="text-center font-bold text-base tablet:text-xl">
              Equilíbrio insuficiente!
            </div>
            <div className="mt-2 mobile:mt-3 tablet:mt-5 text-center  font-normal">
              Caros clientes VIP, você pode obter até{' '}
              {recharge_first_cashback_rate} de recompensa ao recarregar. Quanto
              mais você recarrega, mais bônus você recebe! Sem limite de tempo!
            </div>
          </div>
          <button
            className="state-info-button font-extrabold tablet:mt-12 mobile:mt-5 mt-3 relative w-full h-10 tablet:h-12 group"
            onClick={onConfirm}
          >
            Depósito
          </button>
        </div>
      </div>
    </div>
  );
};
