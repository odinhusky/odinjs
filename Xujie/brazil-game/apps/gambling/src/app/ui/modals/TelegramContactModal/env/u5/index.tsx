import { environment } from "../../../../../../environments/environment"
import { BaseModal } from "../../../BaseModal"

export type ITelegramContactModal = {
  close: () => void
  toTelegramGroup: () => void
}

export const TelegramContactModal = (props: ITelegramContactModal) => {
  return (
    <BaseModal
      className={"flex flex-col justify-center items-center"}
      onClose={(event) => {
        // props.close()
      }}
    >
      <div
        className="relative xl:w-[480px] w-[80vw] md:w-[360px] p-8 rounded-lg bg-linear-6-main"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <button
          className="group absolute -right-2.5 -top-2.5 w-10 h-10 rounded-full flex justify-center items-center bg-linear-6-main shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]"
          onClick={() => {
            props.close()
          }}
        >
          <img
            className="w-[24px] h-[24px] group-hover:opacity-80"
            src={`assets/${environment.uVersion}/icon_close.png`}
            alt="close"
          />
        </button>
        <div>
          <img
            alt="bg"
            className="w-full"
            src={`assets/${environment.uVersion}/ic_telegram_modal.png`}
          />
          <div className="flex flex-col tablet:mt-4">
            <div className="text-white">
              <div className="text-center font-bold text-base tablet:text-xl">
                Junte-se a nós
              </div>
              <div className="mt-2 mobile:mt-3 tablet:mt-5 text-center  font-normal">
                Prezados clientes VIP, juntem-se ao nosso canal oficial do
                Telegram. Realizaremos vários eventos de loteria de tempos em
                tempos. Dezenas de milhares de reais estão esperando por você
                para reivindicar.
              </div>
            </div>
            <button className="state-other-button font-extrabold tablet:mt-12 mobile:mt-5 mt-3 relative w-full h-10 tablet:h-12" onClick={() => props.toTelegramGroup() }>
             Junte-se
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
