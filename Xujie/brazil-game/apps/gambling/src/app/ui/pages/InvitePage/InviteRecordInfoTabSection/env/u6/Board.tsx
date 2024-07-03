import { IBoardData } from "../..";
import { IBoardContainer } from "../../components/DesktopBoard";

export const Board = (props: IBoardData) => {
  const BoardContainer = (props: IBoardContainer) => {
    return (
      <div
        className="flex flex-col gap-0 mobile:gap-1 w-full text-[var(--grayscale-100)] bg-[var(--grayscale-60)] 
          tablet:py-5 tablet:px-4 mobile:py-4 mobile:px-2 py-1 px-4 
          rounded-xl justify-center items-center"
      >
        {props.children}
      </div>
    );
  };
  const rewardDatas = [
    {
      balance: "R$ " + props.data.totalReward || "0,00",
      title: "Prêmio total",
    },
    {
      balance: "R$ " + props.data.paidReward || "0,00",
      title: "Bônus já liquidados",
    },
    {
      balance: "R$ " + props.data.waitForCalReward || "0,00",
      title: "Bônus aguardando liquidação * (Atualizar a cada 24 horas)",
    },
  ];
  return (
    <>
      <section className="flex flex-col mobile:flex-row tablet:gap-5 moblie:gap-3 gap-2 justify-between">
        {rewardDatas.map((data, index) => {
          return (
            <BoardContainer>
              <div className="tablet:text-4xl mobile:text-lg text-base tablet:font-medium font-bold">
                {data.balance}
              </div>
              <div className="tablet:text-base text-sm mobile:font-medium font-normal text-center h-auto">
                {data.title.split("*")[0]}
                <br />
                {data.title.split("*")[1]}
              </div>
            </BoardContainer>
          );
        })}
      </section>
    </>
  );
};
