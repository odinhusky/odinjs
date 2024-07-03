import { NoData } from "../../../../../components-bs/Table/env/u5/NoData"
import { ReactNode,  useMemo, useRef } from "react"
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint"
import { Table } from "apps/gambling/src/app/ui/components-bs/Table"

const TableItem = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div
      className={`px-2 w-full h-14 text-xs flex justify-center items-center border border-[var(--grayscale-30)] text-white ${className}`}
    >
      {children}
    </div>
  )
}
export const DailyTable = (props: {
  records: any
  isProxy: boolean
  type: string
}) => {
  const columns = [
    {
      title: "Dividends",
      name: "dividendos",
      key: "dividendos",
      hidden: !props.isProxy,
      render: (record: any) => `R$ ${record.dividendos || "0,00"}`,
    },
    {
      title: "Data",
      name: "day",
      key: "day",
      render: (record: any) => record.day || "",
    },
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
      render: (record: any) => `R$ ${record.firstRecharge || "0,00"}`,
      hidden: props.type !== "1",
    },
    {
      title: "Valor da transação do jogo",
      name: "gameRecharge",
      key: "gameRecharge",
      render: (record: any) => `R$ ${record.gameRecharge || "0,00"} `,
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
  const bodyRef = useRef<HTMLDivElement>(null)
  const isWidthFull = useMemo(() => {
    if (bodyRef.current) {
      const maxNum = bodyRef.current.clientWidth / 144
      return props.records?.length > maxNum
    }
    return false
  }, [props.records])
  const { isDesktop } = useBreakpoint()
  return <div className="mt-3 mobile:mt-4 tablet:mt-5 mb-4">
    {
        isDesktop ? (
          <div className="riojungle777bet-table overflow-x-auto text-white text-center rounded-lg bg-[var(--grayscale-15)]">
            <Table
              containerClassName={`min-w-[500px] h-[460px]`}
              className={"w-full overflow-x-auto border-r-0 "}
              titleStyle={`font-normal text-xs lg:text-sm`}
              contentStyle={`border-b text-sm border-[var(--grayscale-20)] py-4`}
              theadClassName="bg-linear-6-disabled"
              tableClassName="h-auto"
              noDataClassName={"lg:py-8"}
              dataSource={
                props.records !== undefined && props.records?.length > 0
                  ? props.records
                  : []
              }
              columns={columns.filter(v=>!v.hidden)}
              dataCount={0}
            />
          </div>
         
        ) : (
          <div className="flex flex-col bg-[var(--grayscale-20)] rounded-lg text-white overflow-hidden">
          <div className={`w-full rounded-lg flex bg-[var(--grayscale-15)]`}>
            <div className="w-36 flex flex-col">
              {columns.map((item) =>
                item.hidden ? (
                  <></>
                ) : (
                  <TableItem
                    className={` font-bold bg-linear-6-disabled !justify-start`}
                  >
                    {item.title}
                  </TableItem>
                )
              )}
            </div>
            {props.records?.length ? (
              <div className={`flex flex-1 overflow-x-auto`} ref={bodyRef}>
                {props.records.map((record: any) => (
                  <div
                    className={`flex flex-col ${
                      isWidthFull ? "w-36 flex-shrink-0" : "flex-1"
                    }`}
                  >
                    {columns.map((item) =>
                      item.hidden ? (
                        <></>
                      ) : (
                        <TableItem>{item.render(record)}</TableItem>
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <NoData className="w-full" />
            )}
          </div>
        </div>
        )
    }
  </div>

}
