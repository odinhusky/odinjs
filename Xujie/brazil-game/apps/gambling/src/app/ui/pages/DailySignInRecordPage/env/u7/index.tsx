import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import {BackNavigation} from '../../../../components-bs/BackNavigation/BackNavigation';
import {usePageNavigate} from '../../../../router/hooks/usePageNavigate';
import {formatLocaleMoney} from '../../../../utils/format';
import {PageContainer} from '../../../../components-bs/PageContainer';
import {useEffect, useState} from 'react';
import {useGetSignInRecordMutation} from '../../../../../external';
import {GetSignInRecordResponseData} from '../../../../../external/endpoint/signin/GetSignInEndpoint';
import {AppLocalStorage} from '../../../../../persistant/localstorage';
import {AppLocalStorageKey} from '../../../../../persistant/AppLocalStorageKey';
import cx from '../../../../utils/cx';
import {InfiniteTable, TInfiniteTableColumn} from '../../../../components-bs/InfiniteTable';
import {useAllowLoginRouterRules} from '../../../../router/hooks/useAllowLoginRouterRules';
import {MobileRecordItem} from "./MobileRecordItem";

export type TDailySignInRecord = {
    id: string;
    vipLevel: string; // Nivel VIP
    days: string; // Coleta Contínua
    cashback: string; // Recompensas
    createdTime: string; // Tempo
}


const TableHeads: string[] = ['ID', 'Nivel VIP', 'Coleta Contínua', 'Recompensas', 'Tempo'];

export const DailySignInRecordPage = () => {
    useAllowLoginRouterRules();

    const [triggerGetSignInRecord, {data}] = useGetSignInRecordMutation();
    const [page, setPage] = useState(1);
    const [datasource, setDatasource] = useState<TDailySignInRecord[]>([])

    const {isMobile} = useBreakpoint();
    const {onClickToCheckInDaily} = usePageNavigate();

    const pageSize = 100

    const handleFetchData = () => {
        if (page < (data?.page?.page_count || 0)) {
            setPage(page + 1)
        }
    }

    const columns: TInfiniteTableColumn<TDailySignInRecord>[] = isMobile
        ? [{
            title: TableHeads[0], dataIndex: 'id', renderClassName: 'w-full py-0 pb-2', render: (record: any) =>
                <div className={'rounded-lg w-full border-stroke-popup shadow-[0_4px_4px_rgba(0,0,0,0.25)]'}>
                    <div
                        className={'bg-linear-4-main w-full rounded-lg text-xs text-[var(--transparent-white-70)]'}>
                        <MobileRecordItem title={TableHeads[0]} value={record.id} className={''}/>
                        <MobileRecordItem title={TableHeads[1]} value={record.vipLevel} className={'bg-[var(--transparent-white-5)]'}/>
                        <MobileRecordItem title={TableHeads[2]} value={record.days} className={''}/>
                        <MobileRecordItem title={TableHeads[3]} value={record.cashback} className={'bg-[var(--transparent-white-5)]'}/>
                        <MobileRecordItem title={TableHeads[4]} value={record.createdTime} className={''}/>
                    </div>
                </div>
        }]
        : [
            {title: TableHeads[0], dataIndex: 'id', render: (record: any) => <div>{record.id}</div>},
            {title: TableHeads[1], dataIndex: 'vipLevel', render: (record: any) => <div>{record.vipLevel}</div>},
            {title: TableHeads[2], dataIndex: 'days', render: (record: any) => <div>{record.days}</div>},
            {title: TableHeads[3], dataIndex: 'cashback', render: (record: any) => <div>{record.cashback}</div>},
            {title: TableHeads[4], dataIndex: 'createdTime', render: (record: any) => <div>{record.createdTime}</div>},
        ]

    // 轉換數據
    const transformData = (data: GetSignInRecordResponseData[]) => {
        return data.map(item => {
            return {
                id: item.id,
                vipLevel: `VIP${item.vip_level}`, // Nivel VIP
                days: `${item.days}dia${item.days === 1 ? '' : 's'}`, // Coleta Contínua
                cashback: `R$ ${formatLocaleMoney(item.cashback / 100)}`, // Recompensas
                createdTime: `${item.created_at}`, // Tempo
            }
        })
    }

    const getData = async (page: number) => {
        triggerGetSignInRecord({
            limit: pageSize,
            page: page,
            token: AppLocalStorage.getItem(AppLocalStorageKey.token) || '',
        })
    }

    useEffect(() => {
        getData(page)
    }, [page])

    useEffect(() => {
        setDatasource(prevState => {
            return [...prevState, ...transformData(data?.data || [])]
                .filter((record, index, self) =>
                    index === self.findIndex((t) => t.id === record.id)
                )
        })
    }, [data?.data])

    return (
        <PageContainer>
            <BackNavigation
                onClick={() => onClickToCheckInDaily()}
            />

            <div className={cx('mx-auto text-[var(--grayscale-100)] w-full',
                'flex flex-col justify-center items-center',
                'mt-4 mobile:mt-8.5 tablet:mt-8',
            )}>
                <div className={cx(
                    'w-full',
                    !isMobile ? ['border-stroke-popup shadow-[0_4px_4px_rgba(0,0,0,0.25)]',
                            'max-h-[684px] rounded-lg relative',
                            'text-center text-xs tablet:text-sm']
                        : ''
                )}>
                    <InfiniteTable<TDailySignInRecord>
                        className={isMobile ? '' : 'bg-linear-4-main'}
                        headerClassName={isMobile ? 'hidden' : 'bg-[var(--transparent-black-10)] text-[var(--grayscale-80)] font-medium'}
                        rowKey='id'
                        datasource={datasource}
                        columns={columns}
                        totalCount={data?.page?.count || 0}
                        fetchData={() => handleFetchData()}
                    />
                </div>
            </div>
        </PageContainer>
    )
}
