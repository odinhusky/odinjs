import {useNavigate} from "react-router";
import {IBoardData} from "../.."
import {IBoardContainer} from "../../components/DesktopBoard";
import cx from "classnames";
import {PageOrModalPathEnum} from "../../../../../PageOrModalPathEnum";


export interface IP1BoardContainer extends IBoardContainer {
  className: string
}

export const MobileMainBoard = (props: IBoardData) => {
  const navigate = useNavigate();
  const BoardContainer = (props: IP1BoardContainer) => {
    return (<div className={cx(
      'boardContainer px-3 h-[80px] font-bold',
      'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]',
      'flex flex-col w-full items-center justify-center rounded-lg',
      // 'bg-[var(--grayscale-20)]',
      props.className
    )}>
      {props.children}
    </div>)
  }
  return (

    <div>

      <div className={'relative flex flex-row justify-end mb-2'}>
        <button
          onClick={() => navigate(PageOrModalPathEnum.InviteSettlementRecordPage)}
          className={cx(
            'w-[150px]',
            'bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)]',
            'text-sm lg:text-lg leading-5 lg:leading-7 text-white',
            'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] relative flex flex-row justify-center py-2.5 lg:py-1.5 px-5 cursor-pointer rounded-[100px]'
          )}
        >
          Registro
        </button>
      </div>

      <section className={"flex flex-col w-full [&>*:nth-child(2)]:my-2 text-white"}>

        <BoardContainer className={cx('bg-gradient-to-b from-[#6373FF] to-[#4FFFDF]')}>
          <div className={"text-base text-white"}>R$ {props.data.totalReward || '0,00'}</div>
          <div className={"text-sm md:mt-5"}>Prêmio total</div>
        </BoardContainer>

        <BoardContainer className={cx('bg-gradient-to-b from-[#11D279] to-[#BFE750]')}>
          <div className={"text-base text-white"}>R$ {props.data.paidReward || '0,00'}</div>
          <div className={"text-sm md:mt-5"}>Bônus já liquidados</div>
        </BoardContainer>

        <BoardContainer className={cx('bg-gradient-to-b from-[#FF725C] to-[#FF9752]')}>
          <div className={"text-base"}>R$ {props.data.waitForCalReward || '0,00'}</div>
          <div className={"text-sm text-center leading-5 lg:leading-7 md:mt-5"}>Bônus
            aguardando liquidação
          </div>
          <div className={"text-sm text-center leading-5 lg:leading-7"}>(Atualizar a cada 24
            horas)
          </div>
        </BoardContainer>

      </section>

    </div>


  )
}
