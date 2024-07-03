import {Table} from "../../../../../../components-bs/Table";
import {useEffect, useState} from "react";
import {useWithdrawHistoryListMutation} from "../../../../../../../external";
import {notification} from "antd";
import {formatLocaleMoney} from "../../../../../../utils/format";
import {GetWithdrawRecordResponseData} from "../../../../../../../external/PaymentEndpoint";
import {DragScrollContainer} from "../../../../../../components/DragScrollContainer";
import {WithdrawStatusMap} from "./RecordPanel";
import {appCopy} from "../../../../../../utils/appCopy";

export const RecordPanelWithdraw = () => {
    const [records, setRecords] = useState<GetWithdrawRecordResponseData[]>([])
    const [page, setPage] = useState(1);


    const [triggerGetWithdrawRecord, {data: withdrawRecordData}] = useWithdrawHistoryListMutation()
    const [notice, contextHolder] = notification.useNotification()

    const onClickToCopy = (copyText: string) => {
        appCopy(copyText || '');
        notice.success({
            message: "Copiado!"
        })
    }

    const columns = [
        {
            title: 'Identificador', name: 'pay_serial_no', key: 'pay_serial_no', width: '200px',
            render: (record: any) => {
                return (
                    <div className='flex gap-2'>
                        <div>{record.pay_serial_no}</div>
                        <button onClick={() => onClickToCopy(record.pay_serial_no)}>
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
            name: 'amount',
            key: 'amount',
            render: (record: any) => <div>R${formatLocaleMoney(Number(record.amount))}</div>
        },
        {
            title: 'Taxa De Retirada',
            name: 'fee',
            key: 'fee',
            render: (record: any) => <div>R${formatLocaleMoney(Number(record.fee))}</div>
        },
        {title: 'Método De Retirada', name: 'pay_channel', key: 'pay_channel'},
        {
            title: 'Status De Retirada',
            name: 'status',
            key: 'status',
            render: (record: any) => <div
                style={{color: WithdrawStatusMap[record.status].color}}>{WithdrawStatusMap[record.status].title}</div>
        },
        {title: 'Tempo', name: 'created_at', key: 'created_at'},
    ]

    const handleFetchData = () => {
        if (withdrawRecordData !== undefined) {
            if (page < withdrawRecordData.page.page_count) {
                setPage(page + 1)
            }
        }
    }

    useEffect(() => {
        triggerGetWithdrawRecord({
            limit: 10,
            page,
        })
    }, [page])

    useEffect(() => {
        if (withdrawRecordData !== undefined) {
            setRecords([...records, ...withdrawRecordData.data])
        }
    }, [withdrawRecordData?.data])

    return (
        <DragScrollContainer className='h-[40vh] rounded-xl overflow-hidden cursor-default'>
            {contextHolder}
            <Table
                fetchData={handleFetchData}
                dataSource={records}
                columns={columns}
                dataCount={withdrawRecordData?.page?.count || 0}
            />
        </DragScrollContainer>
        // <div className="overflow-x-auto text-white text-center" style={{borderWidth:'1px',borderColor:'#58DCC7',borderRadius:'10px'}}>
        //   <table className="table-zebra relative table w-full">
        //     {/* head */}
        //     <thead className="sticky top-0">
        //       <tr>
        //         <th className="text-center">ID da ordem</th>
        //         <th className="text-center">Valor</th>
        //         <th className="text-center">Valor do bônus</th>
        //         <th className="text-center">Modelo</th>
        //         <th className="text-center">Estado Do Depósito</th>
        //         <th className="text-center">Tempo</th>
        //       </tr>
        //     </thead>
        //
        //     <tbody>
        //       {records !== undefined && records.length > 0 ? records.map((record) => (
        //         <tr key={record.id}>
        //           <td className={'flex flex-row justify-center'}>
        //             <span>{record.pay_serial_no}</span>
        //             <span>
        //               <button>
        //                 <img
        //                   className="h-[20px] w-[22px]"
        //                   alt={'copy'}
        //                   src={
        //                     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkBAMAAAAX21WWAAAALVBMVEUAAAD///////////////////////////////////////////////////////+hSKubAAAAD3RSTlMAslqHLVh8VSU4cCENn3Foj007AAAAbUlEQVQoz2MgDbAkG0NAJkKMVxAGGuBibHCxAoTCFhcw8BMMwDCXCZ/YNGOYpXAxDkGEpTAxdoRYAVQMqH4JxFIvQQWEmALUgpEoVoAhxi24AUOM4QyCiWCQKoYIeyAXI46AXIy4BHIx4pwkAABWmSbbBWXeeAAAAABJRU5ErkJggg=='
        //                   }
        //                 />
        //               </button>
        //             </span>
        //           </td>
        //           <td className="text-center">
        //             R${Number(record.amount).toFixed(2)}
        //           </td>
        //           <td className="text-center">R${Number(record.fee).toFixed(2)}</td>
        //           <td className="text-center">{record.pay_channel}</td>
        //           <td className="text-center">
        //             {WithdrawStatusMap[record.status]}
        //           </td>
        //           <td className="text-center">{record.created_at}</td>
        //         </tr>
        //       )):(<tr>
        //           <td colSpan={6}>
        //             <div className="flex flex-col items-center p-14" style={{backgroundColor:'#006D79'}}>
        //               <div><img className={'h-[100px]'} src={`assets/${environment.assetPrefix}/noData.png`} /></div>
        //               <div>Nothing here</div>
        //             </div>
        //           </td>
        //         </tr>
        //       )}
        //     </tbody>
        //   </table>
        // </div>
    );
};
