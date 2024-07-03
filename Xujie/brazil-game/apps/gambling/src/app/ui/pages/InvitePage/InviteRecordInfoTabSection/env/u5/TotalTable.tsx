import { ITotal } from "../.."
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
  ]
  return (
    <div className="flex gap-2 text-white max-sm:flex-col mt-3 mobile:mt-4 tablet:mt-5 mb-4">
      {columns.map((item) =>
        !item.hidden ? (
          <div
            className="flex sm:flex-col sm:justify-center justify-between items-center flex-1 p-3 rounded-lg bg-[var(--grayscale-30)] text-sm leading-5 font-bold max-sm:px-3 max-sm:py-3.5 max-sm:text-sm max-sm:border-b max-sm:border-[var(--grayscale-40)] max-sm:last:border-none"
            key={item.key}
          >
            <div className="sm:min-h-[48px] max-sm:flex-1 flex  sm:justify-center items-center text-center  max-sm:text-start">
              {item.title}
            </div>
            <div className="max-sm:flex-1 max-sm:text-end sm:mt-2 text-center">{item.render(props.data)}</div>
          </div>
        ) : (
          <></>
        )
      )}
    </div>
  )
}
