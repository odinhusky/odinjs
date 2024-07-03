import {useEffect, useState} from 'react';
import {useRechargeHistoryListMutation} from '../../../../../../../external';
import {Table} from '../../../../../../components-bs/Table';
import copy from 'copy-to-clipboard';
import {notification} from 'antd';
import {DragScrollContainer} from '../../../../../../components/DragScrollContainer';
import {formatLocaleMoney} from "../../../../../../utils/format";
import {GetRechargeRecordResponseData} from "../../../../../../../external/PaymentEndpoint";
import {DepositStatusMap} from "./RecordPanel";
import {InfiniteTable, TInfiniteTableColumn} from "../../../../../../components-bs/InfiniteTable";
import {appCopy} from "../../../../../../utils/appCopy";

interface IRecordPanelDepositProps {
    records: GetRechargeRecordResponseData[];
}

export const RecordPanelDeposit = () => {

    const [api, contextHolder] = notification.useNotification();

    const onClickToCopy = (copyText: string) => {
        appCopy(copyText || '');
        api.success({
            message: "Copiado!"
        })
    }

    const columns: TInfiniteTableColumn<any> [] = [
        {
            title: 'Identificador',
            dataIndex: 'pay_serial_no',
            width: '250px',
            render: (record: any) => {
                return (
                    <div className='flex'>
                        <div className='flex-1'>{record.pay_serial_no}</div>
                        <button className='' onClick={() => onClickToCopy(record.pay_serial_no)}>
                            <img className="h-[20px] w-[22px]" alt={'copy'}
                                 src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkBAMAAAAX21WWAAAALVBMVEUAAAD///////////////////////////////////////////////////////+hSKubAAAAD3RSTlMAslqHLVh8VSU4cCENn3Foj007AAAAbUlEQVQoz2MgDbAkG0NAJkKMVxAGGuBibHCxAoTCFhcw8BMMwDCXCZ/YNGOYpXAxDkGEpTAxdoRYAVQMqH4JxFIvQQWEmALUgpEoVoAhxi24AUOM4QyCiWCQKoYIeyAXI46AXIy4BHIx4pwkAABWmSbbBWXeeAAAAABJRU5ErkJggg=='}
                            />
                        </button>
                    </div>
                )
            }
        },
        {
            title: 'Valor',
            dataIndex: 'amount',
            render: (record: any) => <div>R${formatLocaleMoney(Number(record.amount))}</div>
        },
        {
            title: 'Bônus',
            dataIndex: 'rate',
            render: (record: any) => <div>R${(formatLocaleMoney(Number(record.amount) * Number(record.rate)))}</div>
        },
        {title: 'Método De Depósito', dataIndex: 'pay_channel'},
        {
            title: 'Estado Do Depósito',
            dataIndex: 'status',
            render: (record: any) => <div
                style={{color: DepositStatusMap[record.status].color}}>{DepositStatusMap[record.status].title}</div>
        },
        {title: 'Tempo', dataIndex: 'created_at'},
    ]

    // 充值紀錄
    const [triggerGetDepositRecord, {data: depositRecordData}] = useRechargeHistoryListMutation({});
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState<GetRechargeRecordResponseData[]>([]);


    useEffect(() => {
        triggerGetDepositRecord({
            limit: 10,
            page: page,
        });

    }, [page]);

    useEffect(() => {
        if (depositRecordData !== undefined) {
            setRecords(i => [...i, ...depositRecordData.data])
        }

    }, [depositRecordData?.data])

    const handleFetchData = () => {
        if (depositRecordData !== undefined) {
            if (page < depositRecordData.page.page_count) {
                setPage(i => i + 1)
            }
        }
    }

    return (
        <div>
            {contextHolder}
            <InfiniteTable
              className='text-white h-[40vh]'
              rowKey='pay_serial_no'
              datasource={records}
              columns={columns}
              totalCount={Number(depositRecordData?.page?.count)}
              fetchData={handleFetchData}
            />
        </div>
    )
};
