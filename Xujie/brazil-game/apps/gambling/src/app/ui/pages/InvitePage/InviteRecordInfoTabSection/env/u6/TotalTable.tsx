import { ITotal } from "../..";
export const TotalTable = (props: ITotal & { type: string }) => {
  const columns = [
    {
      title: "Usuário De Recarga",
      name: "numRecharge",
      key: "numRecharge",
      hidden: props.type !== "1",
      render: (record: any) => record.numRecharge || 0,
    },
    {
      title: "Primeira Recarga Recompensas",
      name: "firstRecharge",
      key: "firstRecharge",
      hidden: props.type !== "1",
      render: (record: any) => `R$ ${record.firstRecharge || "0,00"}`,
    },
    {
      title: "Valor Da Transação Do Jogo",
      name: "gameRecharge",
      key: "gameRecharge",
      render: (record: any) => `R$ ${record.gameRecharge || "0,00"}`,
    },
    {
      title: "Recompensas De Troca De Jogos",
      name: "gameRechargeReward",
      key: "gameRechargeReward",
      render: (record: any) => `R$ ${record.gameRechargeReward || "0,00"}`,
    },
    {
      title: "Recompensa Total",
      name: "totalReward",
      key: "totalReward",
      render: (record: any) => `R$ ${record.totalReward || "0,00"}`,
    },
  ];
  return (
    <div
      className="flex tablet:flex-row flex-col tablet:bg-inherit bg-[var(--grayscale-40)] rounded-xl 
        tablet:py-0 tablet:px-0 mobile:py-3 mobile:px-4 py-0 px-4"
    >
      {columns.map((item) =>
        !item.hidden ? (
          <div
            className="group flex tablet:flex-col flex-row w-full tablet:border-b-0 border-solid border-b border-[var(--grayscale-50)] 
              last:border-b-0 tablet:justify-start justify-between"
            key={item.key}
          >
            <div
              className="flex mobile:text-sm text-xs tablet:font-bold font-normal tablet:text-center text-left py-2 justify-center items-center
                tablet:h-[56px] tablet:group-first:rounded-l-lg tablet:group-last:rounded-r-lg
                tablet:bg-[linear-gradient(180deg,rgba(189,50,240,0.6)_0%,rgba(81,13,137,0.6)_100%)]
                tablet:py-0 
                "
            >
              {item.title}
            </div>
            <div className="flex text-sm tablet:text-center text-right tablet:font-normal font-medium tablet:h-[52px] justify-center items-center">
              {item.render(props.data)}
            </div>
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
};
