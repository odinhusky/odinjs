import { BaseModal } from "../../../BaseModal"
import { ITelegramDetailContactModalProps } from "../../index"
import { environment } from "../../../../../../environments/environment"

export const TelegramDetailContactModal = ({
  onClickToOpenTelegramService,
  onClickToOpenTelegramManager,
  onClose,
}: ITelegramDetailContactModalProps) => {
  return (
    <BaseModal
      className={"flex flex-col justify-center items-center text-white"}
      onClose={() => {}}
    >
      <div
        className="relative xl:w-[424px] w-[80vw] md:w-[360px] p-8 rounded-lg bg-linear-6-main"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute -right-2.5 -top-2.5 w-10 h-10 rounded-full flex justify-center items-center bg-linear-6-main shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]"
          onClick={onClose}
        >
          <img
            className="w-[24px] h-[24px] hover:opacity-80"
            src={`assets/${environment.uVersion}/icon_close.png`}
            alt="close"
          />
        </button>
        <div>
          <div className="text-center font-bold text-xl ">
            Clique no botão para pular
          </div>
          <img
            alt="bg"
            className="w-full mt-4 xl:mt-5"
            src={`assets/${environment.uVersion}/icon-telegram-mobile.png`}
          />
          <div className="bg-black/30 rounded-lg py-3 px-5 text-center font-bold text-sm sm:text-base xl:text-lg">
            Se precisar de ajuda, entre em contato com o atendimento ao cliente
            <button
              className="state-other-button font-extrabold mt-3 w-full h-10 tablet:h-12"
              onClick={onClickToOpenTelegramService}
            >
             Atendimento ao cliente
            </button>
          </div>
          <div className="bg-black/30 rounded-lg py-3 px-5 text-center font-bold text-sm sm:text-base xl:text-lg mt-3">
            Para cooperação comercial, entre em contato com o gerente
            <button
              className="state-other-button font-extrabold text-sm mt-3 relative w-full h-10 tablet:h-12 group"
              onClick={onClickToOpenTelegramManager}
            >
               Manager_telegram
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
