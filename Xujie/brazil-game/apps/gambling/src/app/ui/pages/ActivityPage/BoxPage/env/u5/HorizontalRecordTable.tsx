import {
    GetBoxInviteListResponseDataInvitees
} from "../../../../../../external/endpoint/activity/box/GetBoxInviteListEndpoint";
import {
    InfiniteHorizontalTable,
    TInfiniteHorizontalTableRow
} from "../../../../../components-bs/InfiniteHorizontalTable";
import {formatLocaleMoney} from "../../../../../utils/format";

interface HorizontalRecordTableProps {
    isShowConditionDetail: boolean;
    inviteList: GetBoxInviteListResponseDataInvitees[]
}

export const HorizontalRecordTable = ({isShowConditionDetail, inviteList}: HorizontalRecordTableProps) => {
    const row: TInfiniteHorizontalTableRow<GetBoxInviteListResponseDataInvitees>[] = [
        {title: 'ID', dataIndex: 'invitee'},
        {title: 'Data recomendada', dataIndex: 'registerDate'},
        {title: 'Válido ou não', dataIndex: 'effective', render: (record) => record.effective ? 'SIM' : 'NÃO'},
        {
            title: 'Condições válido',
            dataIndex: 'effective',
            className: 'h-[56px]',
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
        }
    ]

    return (
        <InfiniteHorizontalTable
            className='mt-3 mobile:mt-5 rounded-lg'
            rowClassName='px-5'
            columnKey='invitee'
            datasource={inviteList}
            rows={row}
            totalCount={inviteList.length}
        />
    )
}