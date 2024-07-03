import {PageContainer} from "../../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../../components-bs/BackNavigation/BackNavigation";
import {usePageNavigate} from "../../../../../../router/hooks/usePageNavigate";
import React from "react";
import {useActivityRecord} from "../../../../hooks/useActivityRecord";
import Select, {StylesConfig} from "react-select";
import {environment} from "../../../../../../../../environments/environment";
import {recordStatusMap} from "../RecordPage";

const selectStyleProps: StylesConfig = {
    control: (base, {isFocused}) => (
        {
            ...base,
            background: 'var(--primary-variant)',
            borderColor: isFocused ? 'var(--primary-assistant)' : 'rgba(255,255,255,.3)',
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
        background: isFocused ? 'rgba(255,255,255, .2)' : 'var(--primary-variant)',
        color: 'white',
        '&:active': {
            background: "rgba(0, 0, 0, .3)"
        },
    }),

    menu: (base) => ({
        ...base,
        borderRadius: '8px',
        background: 'var(--primary-variant)',
        border: 'rgba(255,255,255,.3) solid 1px',
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

export const MobileRecordPage = () => {
    const {onClickToActivity} = usePageNavigate()
    const {activityRecordState, useQueryByActivityOptionAndDayOption} = useActivityRecord()

    return (
        <PageContainer
            className='text-white'
        >
            <BackNavigation
                onClick={onClickToActivity}
                title={<div className={"w-full font-bold text-center"}>Reg de Coletas</div>}
            />

            <div
                className='h-[70vh] flex flex-col'
            >
                <Select
                    className='w-full mt-4'
                    isSearchable={false}
                    value={activityRecordState?.currentDay}
                    options={activityRecordState?.dayOptions}
                    onChange={(item: any) => {
                        useQueryByActivityOptionAndDayOption(activityRecordState?.currentTypeName || {
                            label: '',
                            value: '',
                            type: ''
                        }, item)
                    }}
                    styles={selectStyleProps}
                />

                <Select
                    className='w-full mt-3'
                    isSearchable={false}
                    value={activityRecordState?.currentTypeName}
                    options={activityRecordState?.activityOptions}
                    onChange={(item: any) => {
                        useQueryByActivityOptionAndDayOption(item, activityRecordState?.currentDay || {
                            label: '',
                            value: 1
                        })
                    }}
                    styles={selectStyleProps}
                />

                <div
                    className='mt-4 flex justify-end'
                >
                    <div className='text-base font-bold'>Bônus <span
                        className='text-[var(--state-info-main)]'>{activityRecordState?.totalBonus}</span></div>
                </div>

                {
                    activityRecordState?.tableBody?.length || 0 > 0 ? (
                        <div
                            className='grow overflow-y-scroll mt-3 flex flex-col gap-3'
                        >
                            {
                                activityRecordState?.tableBody?.map((item, index) => (
                                    <table
                                        className='rounded-lg overflow-hidden text-base table-zebra'
                                    >
                                        <tbody
                                            key={index}
                                            className='bg-[var(--table-tbody)]'
                                        >
                                        <tr>
                                            <td
                                                className='font-bold text-center py-2 border-r border-[rgba(255,255,255,.3)] w-[100px]'>Tempo
                                            </td>
                                            <td className='font-medium text-center py-2'>{item.time}</td>
                                        </tr>
                                        <tr>
                                            <td className='font-bold text-center py-2 border-r border-[rgba(255,255,255,.3)] w-[100px]'>Nomes
                                                do evento
                                            </td>
                                            <td className='font-medium text-center py-2'>{item.name}</td>
                                        </tr>
                                        <tr>
                                            <td className='font-bold text-center py-2 border-r border-[rgba(255,255,255,.3)] w-[100px]'>Valor
                                                do bônus
                                            </td>
                                            <td className='font-medium text-center py-2 text-[var(--secondary-assistant)]'>{item.bonus}</td>
                                        </tr>
                                        <tr>
                                            <td className='font-bold text-center py-2 border-r border-[rgba(255,255,255,.3)] w-[100px]'>Estado
                                            </td>
                                            <td
                                                className={`font-medium text-center py-2`}
                                                style={{
                                                    color: recordStatusMap[item.status ? 'true' : 'false'].color
                                                }}
                                            >{recordStatusMap[item.status ? 'true' : 'false'].title}</td>
                                        </tr>
                                        <tr>
                                            <td className='font-bold text-center py-2 border-r border-[rgba(255,255,255,.3)] w-[100px]'>IP
                                            </td>
                                            <td className='font-medium text-center py-2'>{item.ip}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                ))
                            }
                        </div>
                    ) : (
                        <div
                            className='grow flex justify-center items-center'
                        >
                            <div
                                className='flex flex-col justify-center items-center gap-1'
                            >
                                <img alt='noData' className='w-[52px]'
                                     src={`assets/${environment.uVersion}/noData.png`}/>
                                <div>Sem Registros</div>
                            </div>
                        </div>
                    )
                }
            </div>
        </PageContainer>
    )
}