import { BaseModal } from "../../../BaseModal";
import { ITelegramDetailContactModalProps } from "../../index";
import { environment } from "../../../../../../environments/environment";

export const TelegramDetailContactModal = ({
  onClickToOpenTelegramService,
  onClickToOpenTelegramManager,
  onClose,
}: ITelegramDetailContactModalProps) => {
  return (
    <BaseModal
      className={"flex flex-col justify-center items-center"}
      onClose={() => {}}
    >
      <div
        className="bg-linear-3-main relative flex flex-col gap-4 tablet:gap-8 w-10/12 tablet:w-[552px] mobile:w-[360px] text-[var(--grayscale-100)] rounded-xl 
        py-6 px-4 tablet:py-10 tablet:px-9 mobile:p-8 font-medium"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="linear-5-button absolute w-7 tablet:w-10 mobile:w-9 h-7 tablet:h-10 mobile:h-9 top-2 right-2 mobile:top-3 mobile:right-3 rounded-full"
          onClick={onClose}
        >
          <img
            className="w-1/2"
            src={`assets/${environment.uVersion}/ic_close_noBorder.png`}
            alt="close"
          />
        </button>
        <div className="flex flex-col justify-center">
          <img
            alt="bg"
            src={`assets/${environment.uVersion}/icon-telegram-mobile.png`}
          />
          <div className="text-center text-base tablet:text-2xl mobile:text-lg">
            Clique no botão para pular
          </div>
        </div>
        <div className="bg-transparente-20 flex flex-col gap-3 tablet:gap-5 rounded-xl py-2 px-3 tablet:py-5 tablet:px-4 mobile:py-3 mobile:px-5">
          <div className="text-sm tablet:text-xl mobile:text-base w-full text-center">
            Se precisar de ajuda, entre em contato com o atendimento ao cliente
            <button
              className="linear-1-button text-sm tablet:text-base w-full h-9 tablet:h-12 font-bold mt-3"
              onClick={onClickToOpenTelegramService}
            >
              Atendimento ao cliente
            </button>
          </div>
          <div className="text-sm tablet:text-xl mobile:text-base w-full text-center">
            Para cooperação comercial, entre em contato com o gerente
            <button
              className="linear-2-button text-sm tablet:text-base w-full h-9 tablet:h-12 font-bold mt-3"
              onClick={onClickToOpenTelegramManager}
            >
              Manager_telegram
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
