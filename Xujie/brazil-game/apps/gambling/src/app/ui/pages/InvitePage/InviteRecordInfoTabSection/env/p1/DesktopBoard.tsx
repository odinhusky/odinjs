import {useNavigate} from "react-router";
import {IBoardData} from "../.."
import {IBoardContainer} from "../../components/DesktopBoard";
import cx from "classnames";

export interface IP1BoardContainer extends IBoardContainer {
  className: string
}

export const DesktopBoard = (props: IBoardData) => {
  const navigate = useNavigate();
  const BoardContainer = (props: IP1BoardContainer) => {
    return (
      <div className={cx(
        'boardContainer font-bold',
        'p-3 md:py-5 md:px-3 lg:py-8 lg:px-10',
        'mt-2 md:mt-0',
        'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]',
        'flex flex-col w-full items-center justify-start rounded-lg',
        'border-white',
        // 'bg-[var(--primary-variant)] ',
        props.className
      )}>
        {props.children}
      </div>)
  }
  return (
    <>
      {/* <section className={"flex flex-row justify-end mb-4"}>
        <button
          onClick={() => { navigate(PageOrModalPathEnum.InviteSettlementRecordPage) }}
          className=" leading-[28px] text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--secondary-main)] flex flex-row justify-center py-1.5 px-5 cursor-pointer  rounded-[100px]"
        >
          Registro

        </button>
      </section> */}
      <section className={"flex flex-col md:flex-row w-full [&>*:nth-child(2)]:md:mx-5 text-white"}>
        <BoardContainer className={cx('bg-gradient-to-b from-[#6373FF] to-[#4FFFDF]')}>
          <div className={"text-base md:text-xl lg:text-3xl text-white"}>R$ {props.data.totalReward || '0,00'}</div>
          <div className={"text-sm lg:text-lg md:mt-5"}>Prêmio total</div>
        </BoardContainer>
        <BoardContainer className={cx('bg-gradient-to-b from-[#11D279] to-[#BFE750]')}>
          <div className={"text-base md:text-xl lg:text-3xl "}>R$ {props.data.paidReward || '0,00'}</div>
          <div className={"text-sm lg:text-lg md:mt-5"}>Bônus já liquidados</div>
        </BoardContainer>
        <BoardContainer className={cx('bg-gradient-to-b from-[#FF725C] to-[#FF9752]')}>
          <div
            className={"text-base md:text-xl lg:text-3xl text-white"}>R$ {props.data.waitForCalReward || '0,00'}</div>
          <div
            className={"text-sm lg:text-lg text-center leading-5 lg:leading-7 md:mt-5"}>Bônus
            aguardando liquidação
          </div>
          <div className={"text-sm lg:text-lg text-center leading-5 lg:leading-7"}>(Atualizar
            a cada 24 horas)
          </div>
        </BoardContainer>
      </section>
    </>
  )
}
