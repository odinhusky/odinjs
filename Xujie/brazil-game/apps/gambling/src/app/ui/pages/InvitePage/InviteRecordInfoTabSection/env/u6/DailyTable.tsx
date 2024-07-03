import { NoData } from "../../../../../components-bs/Table/env/u6/NoData";
import { ReactNode, useMemo, useRef } from "react";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import { Table } from "apps/gambling/src/app/ui/components-bs/Table";
import cx from "apps/gambling/src/app/ui/utils/cx";

export const DailyTable = (props: {
  records: any;
  isProxy: boolean;
  type: string;
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
  ];
  const bodyRef = useRef<HTMLDivElement>(null);
  const isWidthFull = useMemo(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo(0, 0);
      const maxNum = bodyRef.current.clientWidth / 144;
      return props.records?.length > maxNum;
    }
    return false;
  }, [props.records]);
  const { isDesktop } = useBreakpoint();
  return (
    <div className="tablet:mt-6 mobile:mt-4 mt-3">
      {isDesktop ? (
        <div className="">
          <Table
            containerClassName={`min-w-[500px] h-[460px]`}
            className={"w-full overflow-x-auto"}
            titleStyle={`font-bold text-sm`}
            contentStyle={`text-sm py-4 font-normal`}
            theadClassName="bg-[linear-gradient(180deg,rgba(189,50,240,0.6)_0%,rgba(81,13,137,0.6)_100%)]"
            tableClassName="h-auto"
            noDataClassName={"lg:py-8"}
            dataSource={
              props.records !== undefined && props.records?.length > 0
                ? props.records
                : []
            }
            columns={columns.filter((v) => !v.hidden)}
            dataCount={0}
          />
        </div>
      ) : (
        <div className="flex flex-col mobile:h-[276px] h-[344px] overflow-hidden">
          {props.records?.length ? (
            <div
              className="flex flex-col gap-3 overflow-y-auto"
              ref={bodyRef}
            >
              {props.records.map((record: any) => {
                return (
                  <div className="flex flex-col bg-[var(--grayscale-40)] mobile:py-3 py-0 px-4 rounded-xl">
                    {/* 列表项 */}
                    {columns.map((item: any) => {
                      if (!item.hidden) {
                        /* 列表项中的数据 */
                        return (
                          <div className="flex gap-3 justify-between py-2 px-0 border-solid border-b last:border-b-0 border-[var(--grayscale-50)] items-center">
                            <div className="mobile:text-sm text-xs text-[var(--grayscale-80)] font-normal tablet:w-auto w-2/5">
                              {item.title}
                            </div>
                            <div className="text-sm font-medium text-nowrap text-right">
                              {item.render(record)}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <NoData className="w-full" />
          )}
        </div>
      )}
    </div>
  );
};
