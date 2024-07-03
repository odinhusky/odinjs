import { GetWithdrawRecordResponseData } from "apps/gambling/src/app/external/PaymentEndpoint";
import BaseNoData from "apps/gambling/src/app/ui/components-bs/BaseNoData/BaseNoData";
import { TInfiniteTableColumn } from "apps/gambling/src/app/ui/components-bs/InfiniteTable";
import cx from "apps/gambling/src/app/ui/utils/cx";

interface WalletRecordWithdrawMobileTableProps {
  columns: TInfiniteTableColumn<GetWithdrawRecordResponseData>[];
  datasource: GetWithdrawRecordResponseData[];
  isSuccess: boolean;
}

export const WalletRecordWithdrawMobileTable = ({
  columns,
  datasource,
  isSuccess
}: WalletRecordWithdrawMobileTableProps) => {

  const showNoData = isSuccess === undefined ? true: isSuccess

  return (
    (datasource.length === 0 && showNoData) ? (
      <BaseNoData />
    ) : (
      <div className={cx('w-full overflow-y-auto')}>
        <div className={cx('max-h-[625px]')}>
        {
          datasource.map(data => (
            <div className={cx('mb-3')}>
              {
                columns.map(col => (
                  <div className={cx(
                    'flex items-center justify-between',
                    'py-1',
                    {
                      'p-2 bg--linear-3-disabled rounded-lg': col.dataIndex === 'pay_serial_no'
                    }
                  )}>
                    <h5 
                      className={cx(
                        'text-sm leading-5 text-[var(--grayscale-80)] font-normal',
                        {
                          'text-white font-medium': col.dataIndex === 'pay_serial_no',
                        }
                      )}
                    >{col.title}</h5>
                    <div className={cx(
                      'pl-2',
                      'text-sm leading-5 font-medium',
                      {
                        'text-white': col.dataIndex !== 'status',
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

export default WalletRecordWithdrawMobileTable;
