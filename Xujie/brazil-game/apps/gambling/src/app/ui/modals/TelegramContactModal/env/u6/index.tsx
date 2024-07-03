import { environment } from "../../../../../../environments/environment";
import { BaseModal } from "../../../BaseModal";

export type ITelegramContactModal = {
  close: () => void;
  toTelegramGroup: () => void;
};

export const TelegramContactModal = (props: ITelegramContactModal) => {
  return (
    <BaseModal
      className={"flex flex-col justify-center items-center"}
      onClose={(event) => {
        // props.close()
      }}
    >
      <div
        className="bg-linear-3-main relative flex flex-col gap-4 text-[var(--grayscale-100)] w-10/12 tablet:w-[552px] mobile:w-[360px] rounded-xl 
          py-6 px-4 tablet:py-10 tablet:px-9 mobile:p-8 font-medium"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <button
          className="linear-5-button absolute top-2 right-2 mobile:top-3 mobile:right-3 w-7 tablet:w-10 mobile:w-9 h-7 tablet:h-10 mobile:h-9 rounded-full"
          onClick={() => {
            props.close();
          }}
        >
          <img
            className="w-1/2"
            src={`assets/${environment.uVersion}/ic_close_noBorder.png`}
            alt="close"
          />
        </button>
        <div>
          <img
            alt="bg"
            src={`assets/${environment.uVersion}/ic_telegram_modal.png`}
          />
          <div className="text-center text-base tablet:text-2xl mobile:text-lg">
            Junte-se a nós
          </div>
        </div>
        <div className="text-sm text-center">
          Prezados clientes VIP, juntem-se ao nosso canal oficial do Telegram.
          Realizaremos vários eventos de loteria de tempos em tempos. Dezenas de
          milhares de reais estão esperando por você para reivindicar.
        </div>
        <button
          className="linear-1-button text-sm tablet:text-base h-9 tablet:h-12 font-bold"
          onClick={() => props.toTelegramGroup()}
        >
          Junte-se
        </button>
      </div>
    </BaseModal>
  );
};
