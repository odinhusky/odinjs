import {
    GetBoxInviteListResponseDataInvitees
} from "../../../../../../external/endpoint/activity/box/GetBoxInviteListEndpoint";
import {InfiniteTable, TInfiniteTableColumn} from "../../../../../components-bs/InfiniteTable";
import {formatLocaleMoney} from "../../../../../utils/format";

interface RecordTableProps {
    isShowConditionDetail: boolean;
    inviteList: GetBoxInviteListResponseDataInvitees[]
}

export const RecordTable = ({isShowConditionDetail, inviteList}: RecordTableProps) => {
    const columns: TInfiniteTableColumn<GetBoxInviteListResponseDataInvitees>[] = [
        {title: 'ID', dataIndex: 'invitee'},
        {title: 'Data recomendada', dataIndex: 'registerDate'},
        {title: 'Válido ou não', dataIndex: 'effective', render: (record) => record.effective ? 'SIM' : 'NÃO'},
        {
            title: 'Condições válido',
            dataIndex: 'effective',
            render: record => {
                const recharge = record.achievements.find((item: any) => item.rule === 'RECHARGE')?.value
                const flow = record.achievements.find((item: any) => item.rule === 'BET_FLOW')?.value
                return (record.effective && !isShowConditionDetail)
                    ? 'Para atender às condições'
                    : (
                        <div>
                            Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br/>
                            Aposta acumulativa R${formatLocaleMoney(flow || 0)}
                        </div>
                    )
            }
        },
    ]

    return (
        <InfiniteTable
            className='mt-5 h-[400px]'
            rowKey='invitee'
            datasource={inviteList}
            columns={columns}
            totalCount={inviteList.length}
        />
    )
}