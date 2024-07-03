import { Table } from "apps/gambling/src/app/ui/components-bs/Table";
import { GetBoxInviteListResponseDataInvitees } from "../../../../../../external/endpoint/activity/box/GetBoxInviteListEndpoint";
import { formatLocaleMoney } from "../../../../../utils/format";
import { useMemo, useState } from "react";
import { NoData } from "../../../../../components-bs/Table/env/u7/NoData";
import { tcx } from "apps/gambling/src/app/ui/utils/tcx";
import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";

interface RecordTableProps {
  isShowConditionDetail: boolean;
  inviteList: GetBoxInviteListResponseDataInvitees[];
}

export const RecordTable = ({
  isShowConditionDetail,
  inviteList,
}: RecordTableProps) => {
  const columns = [
    { title: "ID", name: "invitee", key: "invitee" },
    { title: "Data recomendada", name: "registerDate", key: "registerDate" },
    {
      title: "Válido ou não",
      name: "effective",
      key: "effective",
      render: (record: any) => (record.effective ? "SIM" : "NÃO"),
    },
    {
      title: "Condições válido",
      name: "effective",
      key: "effective2",
      width: "400px",
      maxWidth: "400px",
      render: (record: any) => {
        const recharge = record.achievements.find(
          (item: any) => item.rule === "RECHARGE"
        )?.value;
        const flow = record.achievements.find(
          (item: any) => item.rule === "BET_FLOW"
        )?.value;
        return record.effective && !isShowConditionDetail ? (
          "Para atender às condições"
        ) : (
          <div>
            Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br />
            Aposta acumulativa R${formatLocaleMoney(flow || 0)}
          </div>
        );
      },
    },
  ];
  const { isMobile } = useBreakpoint();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1000000;
  const onPrevPage = () => {
    setCurrentPage((pre) => pre - 1);
  };
  const onNextPage = () => {
    setCurrentPage((pre) => pre + 1);
  };
  const dataSource = useMemo(
    () =>
      inviteList.slice(
        (currentPage - 1) * pageSize,
        (currentPage - 1) * pageSize + pageSize
      ),
    [currentPage, inviteList]
  );
  const MobileTable = useMemo(
    () => () => {
      return (
        <div className="flex flex-col gap-2 max-h-[65vh] overflow-y-auto">
          {inviteList.length ? (
            <>
              {inviteList.map((record: any, i) => (
                <div
                  key={i}
                  className={
                    "bg-linear-4-main border-popup-button before:rounded-lg flex flex-col gap-4 p-2 w-full rounded-lg"
                  }
                >
                  {columns.map((item, index) => (
                    <div className="text-xs font-normal">
                      <div
                        className={tcx(
                          "flex justify-between items-center box-border"
                        )}
                      >
                        <div
                          className={tcx(
                            "text-[var(--transparent-white-70)]"
                          )}
                        >
                          {item.title}
                        </div>
                        <div className="text-[var(--grayscale-100)]">
                          {item.render ? item.render(record) : record[item.key]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <NoData
              className="bg-linear-4-main border-popup-button before:rounded-lg w-full h-[344px] !py-4"
              imgClassName="!w-[120px] !h-[120px] mobile:!w-40 tablet:!w-50"
              textClassName="!text-base mobile:!text-lg font-bold"
            />
          )}
        </div>
      );
    },
    [inviteList]
  );
  return isMobile ? (
    <MobileTable />
  ) : (
    <div className="bg-linear-4-main relative rounded-lg shadow-[0px_4px_4px_0px_#00000040]">
      <div className="border-popup-button absolute left-0 right-0 w-full h-full before:rounded-lg pointer-events-none" />
      <Table
        columns={columns || []}
        dataSource={dataSource}
        dataCount={inviteList.length}
        currentPage={currentPage}
        pageSize={pageSize}
        pages={Math.ceil(inviteList.length / pageSize)}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        containerClassName={"max-h-[500px]"}
        theadBoxClassName={inviteList.length>0?"h-[133px]":"h-[40px]"}
        theadClassName={
          "bg-[var(--transparent-black-10)] tablet:text-sm text-xs tablet:font-medium font-normal text-[var(--grayscale-80)]"
        }
        tableClassName={"tablet:text-sm text-xs font-normal"}
        isHidePagination={true}
      />
    </div>
  );
};
