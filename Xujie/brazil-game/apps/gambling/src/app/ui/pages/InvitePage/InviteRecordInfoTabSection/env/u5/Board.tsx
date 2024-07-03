import { IBoardData } from "../.."
import { IBoardContainer } from "../../components/DesktopBoard"

export const Board = (props: IBoardData) => {
  const BoardContainer = (props: IBoardContainer) => {
    return (
      <div
        className={`
          boardContainer font-bold
          p-3 md:py-5 md:px-3 lg:py-8 lg:px-10
          mt-2 md:mt-0
          shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]
          bg-linear-6-main flex flex-col w-full items-center justify-center rounded-lg
        `}
      >
        {props.children}
      </div>
    )
  }
  return (
    <>
      <section
        className={
          "flex flex-col md:flex-row w-full [&>*:nth-child(2)]:md:mx-5 "
        }
      >
        <BoardContainer>
          <div className={"text-base md:text-xl lg:text-3xl text-white"}>
            R$ {props.data.totalReward || "0,00"}
          </div>
          <div
            className={"text-sm lg:text-lg text-[var(--grayscale-100)] md:mt-1 lg:mt-2"}
          >
            Prêmio total
          </div>
        </BoardContainer>
        <BoardContainer>
          <div className={"text-base md:text-xl lg:text-3xl text-white"}>
            R$ {props.data.paidReward || "0,00"}
          </div>
          <div
            className={"text-sm lg:text-lg text-[var(--grayscale-100)] md:mt-1 lg:mt-2"}
          >
            Bônus já liquidados
          </div>
        </BoardContainer>
        <BoardContainer>
          <div className={"text-base md:text-xl lg:text-3xl text-white"}>
            R$ {props.data.waitForCalReward || "0,00"}
          </div>
          <div
            className={
              "text-sm lg:text-lg text-center text-[var(--grayscale-100)] leading-5 lg:leading-7 md:mt-1 lg:mt-2"
            }
          >
            Bônus aguardando liquidação
          </div>
          <div
            className={
              "text-sm lg:text-lg text-center text-[var(--grayscale-100)] leading-5 lg:leading-7"
            }
          >
            (Atualizar a cada 24 horas)
          </div>
        </BoardContainer>
      </section>
    </>
  )
}
