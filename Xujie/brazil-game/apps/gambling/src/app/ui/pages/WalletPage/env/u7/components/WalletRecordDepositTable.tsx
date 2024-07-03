import { useRechargeHistoryListMutation } from "apps/gambling/src/app/external";
import { GetRechargeRecordResponseData } from "apps/gambling/src/app/external/PaymentEndpoint";
import {
  InfiniteTable,
  TInfiniteTableColumn,
} from "apps/gambling/src/app/ui/components-bs/InfiniteTable";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";
import { environment } from "apps/gambling/src/environments/environment";
import { useEffect, useState } from "react";
import { DepositStatusMap } from "../RecordPanel";
import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";
import WalletRecordDepositMobileTable from "./WalletRecordDepositMobileTable";
import useCopy from "apps/gambling/src/app/ui/hooks/useCopy";
import WalletRecordTableControl from "./WalletRecordTableControl";
import t from "apps/gambling/src/assets/constant/lang";

interface WalletRecordDepositTableProps {}

export const WalletRecordDepositTable = ({}: WalletRecordDepositTableProps) => {
  // # states
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [records, setRecords] = useState<GetRechargeRecordResponseData[]>([]);

  // * hooks
  const { copy, contextHolder } = useCopy();
  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  // # API data
  const [triggerGetDepositRecord, { data: depositRecordData, isSuccess }] =
    useRechargeHistoryListMutation({});

  useEffect(() => {
    triggerGetDepositRecord({
      limit: 100000000,
      page: 1,
    });
  }, []);

  useEffect(() => {
    if (depositRecordData !== undefined) {
      // console.log('@@ depositRecordData?.data', depositRecordData)
      setTotalPage(depositRecordData.page.page_count);
      setRecords([...depositRecordData.data]);
    }
  }, [depositRecordData?.data]);

  // = styles
  const thStyle = cx(
    "text-[var(--grayscale-80)] tablet:text-sm text-xs font-normal",
    "h-[40px]"
  );

  // & handled data
  const columns: TInfiniteTableColumn<GetRechargeRecordResponseData>[] = [
    {
      dataIndex: "pay_serial_no",
      title: t["Identificator"],
      thClassName: thStyle,
      render: (record) => (
        <div className="flex items-center gap-2">
          <div className="break-all">{record.pay_serial_no}</div>
          <img
            alt="copy"
            className="h-3 w-3 cursor-pointer"
            onClick={() => copy(record.pay_serial_no)}
            src={`assets/${environment.uVersion}/${
              isMobile ? "icon_copy3" : "icon_copy2"
            }.png`}
          />
        </div>
      ),
    },
    {
      dataIndex: "amount",
      title: t["Value"],
      thClassName: thStyle,
      render: (record) => `R$ ${formatLocaleMoney(Number(record.amount))}`,
    },
    {
      dataIndex: "rate",
      title: t["Bonus"],
      thClassName: thStyle,
      render: (record) =>
        `R$ ${formatLocaleMoney(Number(record.amount) * Number(record.rate))}`,
    },
    {
      dataIndex: "pay_channel",
      title: t["depositMethod"],
      thClassName: thStyle,
    },
    {
      dataIndex: "status",
      title: t["depositStatus"],
      thClassName: thStyle,
      render: (record) => (
        <div style={{ color: DepositStatusMap[record.status].color }}>
          {DepositStatusMap[record.status].title}
        </div>
      ),
    },
    {
      dataIndex: "created_at",
      title: t["Time"],
      thClassName: thStyle,
    },
  ];

  return (
    <>
      {contextHolder}
      {isDesktop || isTablet ? (
        <>
          <InfiniteTable<GetRechargeRecordResponseData>
            rowKey="pay_serial_no"
            className={cx("h-auto max-h-[500px]", {
              "h-[400px]": records.length === 0,
            })}
            datasource={records}
            columns={columns}
            totalCount={depositRecordData?.page.count || 0}
            isSuccess={isSuccess}
            headerClassName="bg-[var(--transparent-black-10)]"
            tbodyClassName={"overflow-y-auto tablet:text-sm text-xs px-1"}
          />
        </>
      ) : null}

      {isMobile ? (
        <WalletRecordDepositMobileTable
          columns={columns}
          datasource={records}
          isSuccess={isSuccess}
        />
      ) : null}
    </>
  );
};

export default WalletRecordDepositTable;
