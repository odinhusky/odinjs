import {PageContainer} from "../../../../../components-bs/PageContainer";
import {useScrollToPartPageTemplate} from "../../../../../pageTemplate/hooks/useScrollToPartPageTemplate";
import {ReactNode, useEffect} from "react";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import Select, {StylesConfig} from "react-select";
import {useRecordModal} from "../../hooks/useRecordModal";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {formatLocaleMoney} from "../../../../../utils/format";
import {Table} from "../../../../../components-bs/Table";


const selectStyleProps: StylesConfig = {
    control: (base, {isFocused}) => (
        {
            ...base,
            background: 'var(--grayscale-20)',
            border: isFocused ? '2px solid var(--primary-main)' : '1px solid var(--grayscale-50)',
            color: 'white',
            padding: '0px 8px',
            borderRadius: '8px',
            outline: 'none',
            boxShadow: 'none',
            '&:hover': {},
        }
    ),
    valueContainer: (style) => ({
        ...style,
        color: 'white',
    }),

    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
    }),

    option: (base, {isFocused, isSelected}) => ({
        ...base,
        background: isSelected ? 'var(--grayscale-30)' : isFocused ? 'var(--grayscale-50)' : 'var(--grayscale-20)',
        color: 'white',
        '&:active': {
            background: "rgba(0, 0, 0, .3)"
        },
    }),

    menu: (base) => ({
        ...base,
        borderRadius: '8px',
    }),
    menuList: (base) => ({
        ...base,
        borderRadius: '8px',
        padding: '0px'
    }),

    singleValue: (provided: any, state: any) => ({
        ...provided,
        color: 'white'
    }),
}

const Row = ({title, content}: { title: string, content: string | ReactNode }) => (
    <div
        className='flex justify-between text-sm items-center'
    >
        <div className='text-[var(--grayscale-70)]'>{title}</div>
        <div>{content}</div>
    </div>
)

interface RecordPageProps {
    onClickToBack: () => void
}

export const RecordPage = ({onClickToBack}: RecordPageProps) => {
    const {
        isShowConditionDetail,
        totalRechargeNum,
        totalRechargeAmount,
        inviteTotalCount,
        inviteList,
        statusOption,
        selectedStatus,
        setSelectedStatus,
    } = useRecordModal()

    const {scrollToWindowTop} = useScrollToPartPageTemplate();

    const {isMobile} = useBreakpoint();

    const columns = [
        {
            title: 'ID',
            name: 'invitee',
            key: 'invitee'
        },
        {
            title: 'Data recomendada',
            name: 'registerDate',
            key: 'registerDate'
        },
        {
            title: 'Válido ou não',
            name: 'effective',
            key: 'effective',
            render: (record: any) => record.effective ? 'SIM' : 'NÃO'
        },
        {
            title: 'Condições válido',
            name: 'effective',
            key: 'effective',
            render: (record: any) => {
                const recharge = record.achievements.find((item: any) => item.rule === 'RECHARGE')?.value
                const flow = record.achievements.find((item: any) => item.rule === 'BET_FLOW')?.value
                return (record.effective && !isShowConditionDetail)
                    ? 'Para atender às condições'
                    : (
                        <div className='text-right'>
                            Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br/>
                            Aposta acumulativa R${formatLocaleMoney(flow || 0)}
                        </div>
                    )
            }
        },
    ]

    useEffect(() => {
        scrollToWindowTop()
    }, []);

    return (
        <PageContainer
            className='text-[var(--grayscale-100)]'
        >
            <BackNavigation
                onClick={() => onClickToBack()}
            />

            <div
                className='font-bold
          mt-3 text-base
          mobile:mt-4 mobile:text-lg
          tablet:mt-8 tablet:text-xl
        '
            >
                Minha lista de recomendações
            </div>

            <div
                className='flex gap-3
          mt-3 flex-col
          mobile:mt-4 mobile:flex-row mobile:justify-between mobile:items-center
          tablet:mt-5
        '
            >
                <Select
                    className='
            w-full
            mobile:w-[320px]
          '
                    isSearchable={false}
                    styles={selectStyleProps}
                    options={statusOption}
                    value={selectedStatus}
                    onChange={(item: any) => setSelectedStatus(item)}
                />

                <div
                    className='font-medium flex
            text-center text-base justify-between
            mobile:justify-center mobile:text-right
            tablet:text-lg
            flex flex-col justify-end items-center mobile:items-end
          '
                >
                    <p>Número total de convites： <span className='text-[#00C885]'>{inviteTotalCount}</span></p>
                    <p className={totalRechargeNum != undefined ? '' : 'hidden'}>Número de Usuários Recarregados： <span className='text-[#00C885]'>{totalRechargeNum || 0}</span></p>
                    <p className={totalRechargeAmount != undefined ? '' : 'hidden'}>Montante total recarregado： <span className='text-[#00C885]'>R${formatLocaleMoney(totalRechargeAmount || 0)}</span></p>
                </div>
            </div>

            {
                isMobile ? (
                    <div
                        className='mt-3 rounded-lg bg-[var(--grayscale-20)] p-2 h-[40vh] overflow-y-scroll flex flex-col gap-[10px]'
                    >
                        {
                            inviteList.map((record, index) => {
                                const recharge = record.achievements.find((item) => item.rule === 'RECHARGE')?.value
                                const flow = record.achievements.find((item) => item.rule === 'BET_FLOW')?.value
                                return (
                                    <div
                                        key={index}
                                        className='rounded-lg bg-[var(--grayscale-15)] border border-[var(--grayscale-30)] p-2 flex flex-col gap-2'
                                    >
                                        <Row title='ID' content={record.invitee}/>
                                        <div
                                            className='h-[1px] w-full bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0)]'/>
                                        <Row title='Data recomendada' content={record.registerDate}/>
                                        <div
                                            className='h-[1px] w-full bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0)]'/>
                                        <Row title='Válido ou não' content={record.effective ? 'SIM' : 'NÃO'}/>
                                        <div
                                            className='h-[1px] w-full bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0)]'/>
                                        <Row
                                            title='Condições válido'
                                            content={
                                                (record.effective && !isShowConditionDetail) ?
                                                    'Para atender às condições' :
                                                    (
                                                        <div className='text-xs'>
                                                            Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br/>
                                                            Aposta acumulativa ${formatLocaleMoney(flow || 0)}
                                                        </div>
                                                    )
                                            }/>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (
                    <div
                        className='bg-[var(--grayscale-20)] rounded-lg p-5 h-[500px]
              mt-4
              tablet:mt-5
            '
                    >
                        <Table
                            className={'w-full overflow-x-auto border-r-0 '}
                            contentStyle={`border-b text-sm`}
                            dataSource={inviteList}
                            columns={columns}
                            dataCount={inviteList.length}
                        />
                    </div>
                )
            }

        </PageContainer>
    )
}