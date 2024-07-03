import {Table} from "apps/gambling/src/app/ui/components-bs/Table"
import {
    GetBoxInviteListResponseDataInvitees
} from "../../../../../../external/endpoint/activity/box/GetBoxInviteListEndpoint"
import {formatLocaleMoney} from "../../../../../utils/format"
import {useMemo, useState} from "react"
import {NoData} from "../../../../../components-bs/Table/env/u6/NoData"
import {tcx} from "apps/gambling/src/app/ui/utils/tcx"
import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint"

interface RecordTableProps {
    isShowConditionDetail: boolean;
    inviteList: GetBoxInviteListResponseDataInvitees[]
}

export const RecordTable = ({isShowConditionDetail, inviteList}: RecordTableProps) => {
    const columns = [
        {title: "ID", name: "invitee", key: "invitee"},
        {title: "Data recomendada", name: "registerDate", key: "registerDate"},
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
            render: (record: any) => {
                const recharge = record.achievements.find(
                    (item: any) => item.rule === "RECHARGE"
                )?.value
                const flow = record.achievements.find(
                    (item: any) => item.rule === "BET_FLOW"
                )?.value
                return (record.effective && !isShowConditionDetail)
                    ? ("Para atender às condições")
                    : (
                        <div>
                            Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br/>
                            Aposta acumulativa R${formatLocaleMoney(flow || 0)}
                        </div>
                    )
            },
        },
    ]
    const {isMobile} = useBreakpoint()
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10
    const onPrevPage = () => {
        setCurrentPage((pre) => pre - 1)
    }
    const onNextPage = () => {
        setCurrentPage((pre) => pre + 1)
    }
    const dataSource = useMemo(
        () =>
            inviteList.slice(
                (currentPage - 1) * pageSize,
                (currentPage - 1) * pageSize + pageSize
            ),
        [currentPage, inviteList]
    )
    const MobileTable = useMemo(() => () => {
        return (
            <div className="max-h-[70vh] overflow-y-auto">
                {inviteList.length ? (
                    <>
                        {inviteList.map((record: any, i) => (
                            <div key={i} className={"w-full mb-4 text-white"}>
                                {columns.map((item, index) => (
                                    <div className="mt-1">
                                        <div
                                            className={tcx(
                                                "flex justify-between items-center box-border",
                                                [
                                                    "w-full h-11 p-2 rounded-lg bg--linear-3-disabled",
                                                    index == 0,
                                                ]
                                            )}
                                        >
                                            <div
                                                className={tcx(
                                                    "text-sm",
                                                    index == 0
                                                        ? "text-white"
                                                        : "text-[var(--grayscale-80)]"
                                                )}
                                            >
                                                {item.title}
                                            </div>
                                            <div className="text-sm font-medium">
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
                        className="w-full !py-4"
                        imgClassName="!w-[120px] !h-[120px] mobile:!w-40 tablet:!w-50"
                        textClassName="!text-xs mobile:!text-2xl !text-[var(--grayscale-60)]"
                    />
                )}
            </div>
        )
    }, [inviteList])
    return isMobile ? (
        <MobileTable/>
    ) : (
        <Table
            columns={columns || []}
            dataSource={dataSource}
            dataCount={inviteList.length}
            currentPage={currentPage}
            pageSize={pageSize}
            pages={Math.ceil(inviteList.length / pageSize)}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
        />
    )
}
