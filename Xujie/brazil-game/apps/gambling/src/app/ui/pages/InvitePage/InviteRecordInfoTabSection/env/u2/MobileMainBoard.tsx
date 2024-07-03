import { useNavigate } from "react-router";
import { IBoardData } from "../.."
import { IBoardContainer } from "../../components/DesktopBoard";

export const MobileMainBoard = (props: IBoardData) => {
  const navigate = useNavigate();
  const BoardContainer = (props: IBoardContainer) => {
    return (<div className={`
    boardContainer px-3 h-[80px] font-bold
    shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] 
    bg-[var(--grayscale-20)] flex flex-col w-full items-center justify-center rounded-lg 
    `}>
      {props.children}
    </div>)
  }
  return (
    <section className={"flex flex-col w-full [&>*:nth-child(2)]:my-2"}>
      <BoardContainer>
        <div className={"text-base text-white"}>R$ {props.data.totalReward || '0,00'}</div>
        <div className={"text-sm text-[var(--grayscale-70)] md:mt-5"}>Prêmio total</div>
      </BoardContainer>
      <BoardContainer>
        <div className={"text-base text-white"}>R$ {props.data.paidReward || '0,00'}</div>
        <div className={"text-sm  text-[var(--grayscale-70)] md:mt-5"}>Bônus já liquidados</div>
      </BoardContainer>
      <BoardContainer>
        <div className={"text-base text-white"}>R$ {props.data.waitForCalReward || '0,00'}</div>
        <div className={"text-sm text-center text-[var(--grayscale-70)] leading-5 lg:leading-7 md:mt-5"}>Bônus aguardando liquidação</div>
        <div className={"text-sm text-center text-[var(--grayscale-70)] leading-5 lg:leading-7"}>(Atualizar a cada 24 horas)</div>
      </BoardContainer>
    </section>
  )
}