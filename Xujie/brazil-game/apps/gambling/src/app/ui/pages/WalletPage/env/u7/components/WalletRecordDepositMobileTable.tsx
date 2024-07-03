import { GetRechargeRecordResponseData } from "apps/gambling/src/app/external/PaymentEndpoint";
import BaseNoData from "apps/gambling/src/app/ui/components-bs/BaseNoData/BaseNoData";
import { TInfiniteTableColumn } from "apps/gambling/src/app/ui/components-bs/InfiniteTable";
import cx from "apps/gambling/src/app/ui/utils/cx";

interface WalletRecordDepositMobileTableProps {
  columns: TInfiniteTableColumn<GetRechargeRecordResponseData>[];
  datasource: GetRechargeRecordResponseData[];
  isSuccess: boolean;
}

export const WalletRecordDepositMobileTable = ({
  columns,
  datasource,
  isSuccess
}: WalletRecordDepositMobileTableProps) => {

  const showNoData = isSuccess === undefined ? true: isSuccess

  return (
    (datasource.length === 0 && showNoData) ? (
      <BaseNoData />
    ) : (
      <div className={cx('w-full overflow-y-auto')}>
        <div className={cx('max-h-[500px]')}>
        {
          datasource.map(data => (
            <div className={cx('bg-linear-4-main relative text-xs rounded-lg mb-3 font-normal shadow-[0px_0px_8px_0px_#FFFFFF40_inset]')}>
              <div className="border-popup-button absolute w-full h-full top-0 left-0 before:rounded-lg pointer-events-none" />
              {
                columns.map(col => (
                  <div className={cx('flex gap-2 items-center justify-between p-2')}>
                    <h5 
                      className={cx(
                        'text-[var(--transparent-white-70)]',
                        {
                          'text-[var(--text-highlight)]': col.dataIndex === 'pay_serial_no',
                        }
                      )}
                    >{col.title}</h5>
                    <div className={cx(
                      '',
                      {
                        'text-[var(--text-highlight)]': col.dataIndex === 'pay_serial_no',
                      }
                    )}>
                      {
                        col.render 
                          ? (col.render(data)) 
                          : (data[col.dataIndex])
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          ))
        }
        </div>
      </div>
    )
  )
}

export default WalletRecordDepositMobileTable;
