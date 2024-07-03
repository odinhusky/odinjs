import {
    GetBoxInviteListResponseDataInvitees
} from "../../../../../../external/endpoint/activity/box/GetBoxInviteListEndpoint";
import cx from "classnames";
import React from "react";
import {formatLocaleMoney} from "../../../../../utils/format";
import BaseNoData from "../../../../../components-bs/BaseNoData/BaseNoData";
import {environment} from "../../../../../../../environments/environment";


interface CardRecordTableProps {
    isShowConditionDetail: boolean;
    inviteList: GetBoxInviteListResponseDataInvitees[]
}


const RecordCard = (item: GetBoxInviteListResponseDataInvitees, isShowConditionDetail: boolean) => {
    const recharge = item.achievements.find((item: any) => item.rule === 'RECHARGE')?.value
    const flow = item.achievements.find((item: any) => item.rule === 'BET_FLOW')?.value
    const detail = item.effective && !isShowConditionDetail
        ? 'Para atender às condições'
        : (<div>
            Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br/>
            Aposta acumulativa R${formatLocaleMoney(flow || 0)}
        </div>)


    const rowTopClassName = 'border-t border-[rgba(255,255,255,0.2)]';
    const columnStartClassName = 'text-center w-auto p-4 bg-linear-5-dark-active';
    const columnEndClassName = 'w-full p-4 border-[rgba(255,255,255,0.2)]';

    return (
        <table className={cx('bg-[var(--grayscale-15)] text-[var(--grayscale-100)] rounded-lg text-sx')}>
            <tbody className={''}>

            <tr className={cx('')}>
                <td className={cx(columnStartClassName, 'rounded-tl-lg')}>{'ID'}</td>
                <td className={cx(columnEndClassName)}>{item.invitee}</td>
            </tr>
            <tr className={cx(rowTopClassName)}>
                <td className={cx(columnStartClassName)}>{'Data recomendada'}</td>
                <td className={cx(columnEndClassName)}>{item.registerDate}</td>
            </tr>

            <tr className={cx(rowTopClassName)}>
                <td className={cx(columnStartClassName)}>{'Válido ou não'}</td>
                <td className={cx(columnEndClassName)}>{item.effective ? 'SIM' : 'NÃO'}</td>
            </tr>

            <tr className={cx(rowTopClassName)}>
                <td className={cx(columnStartClassName, 'rounded-bl-lg')}>{'Válido ou não'}</td>
                <td className={cx(columnEndClassName)}>{detail}</td>
            </tr>
            </tbody>
        </table>
    )
}
export const CardRecordTable = (props: CardRecordTableProps) => {
    const {isShowConditionDetail, inviteList} = props;


    return (
        <div className={'flex flex-col gap-y-3 mt-3'}>
            {inviteList.length === 0
                ? <div className='w-full h-full flex flex-col gap-3 justify-center items-center bg-[var(--grayscale-15)] rounded-lg py-8' >
                    <img
                        className='w-[120px]'
                        alt='noData'
                        src={`assets/${environment.uVersion}/noData.png`}
                    />

                    <div className='text-white font-bold text-base w-full text-center'>
                        Nada aqui
                    </div>
                </div>
                : inviteList.map(item => {
                    return RecordCard(item, isShowConditionDetail)
                })
            }
        </div>
    )

}