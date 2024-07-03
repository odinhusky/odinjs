import {RecordModalProps, selectStyleProps, statusMap} from "../RecordModal";
import {environment} from "../../../../../../../../environments/environment";
import {useRecordModal} from "../../../hooks/useRecordModal";
import Select from "react-select";
import cx from "../../../../../../utils/cx";
import {ReactNode, useEffect, useRef} from "react";
import {formatLocaleMoney} from "../../../../../../utils/format";


const TableRow = ({title, content}:{title: string, content: string | ReactNode}) => (
  <tr
    className='odd:bg-[var(--primary-assistant-20)] even:bg-[var(--white-20)] flex'
  >
    <td className='w-[140px] text-center py-2 border-r border-[var(--white-20)]'>{title}</td>
    <td className='w-full text-center py-2 flex items-center justify-center'>{content}</td>
  </tr>
)


export const MobileRecordModal = ({ onClose}: RecordModalProps) => {
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

  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    ref.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [inviteList])

  return (
    <div
      className='relative flex flex-col text-white bg-blue-500 w-[95%] h-[80%] rounded-2xl p-3 border-2 border-[var(--stroke-modal)]
      bg-gradient-to-b from-[var(--background-modal-from)] to-[var(--background-modal-to)]
      '
      onClick={(e) => e.stopPropagation()}
    >
      <img
        alt='close'
        className='absolute right-4 top-4 w-6 cursor-pointer'
        src={`assets/${environment.uVersion}/icon=close.png`}
        onClick={onClose}
      />
      <div className='text-center text-base font-bold'>Minha lista de recomendações</div>

      <div
        className='text-sm font-bold mt-4 text-center'
      >
        <p>Número total de convites <span className='text-[var(--state-info-main)]'>{inviteTotalCount}</span></p>
        <p className={totalRechargeNum != undefined ? '' : 'hidden'}>Número de Usuários Recarregados <span className='text-[var(--state-info-main)]'>{totalRechargeNum || 0}</span></p>
        <p className={totalRechargeAmount != undefined ? '' : 'hidden'}>Montante total recarregado <span className='text-[var(--state-info-main)]'>R${formatLocaleMoney(totalRechargeAmount || 0)}</span></p>
      </div>

      <Select
        className='w-full mt-3'
        isSearchable={false}
        styles={selectStyleProps}
        options={statusOption}
        value={selectedStatus}
        onChange={(item: any) => setSelectedStatus(item)}
      />

      <div
        ref={ref}
        className={
          cx(
            'h-full mt-3 overflow-y-scroll',
            inviteList.length === 0 && 'flex justify-center items-center bg-[var(--primary-assistant-20)] rounded-2xl'
          )
        }
      >
        {
          inviteList.map((record, index) => {
            const recharge = record.achievements.find((item) => item.rule ==='RECHARGE')?.value
            const flow = record.achievements.find((item) => item.rule ==='BET_FLOW')?.value
            return (
              <table
                key={index}
                className='w-full rounded-md overflow-hidden mb-3 text-sm'
              >
                <tbody>
                <TableRow title='ID' content={record.invitee} />
                <TableRow title='Data recomendada' content={record.registerDate} />
                <TableRow title='Válido ou não' content={(
                  <div
                    className='font-bold'
                    style={{
                      color: `var(${statusMap[record.effective ? 1:0].color})`
                    }}
                  >
                    {statusMap[record.effective ? 1:0].text}
                  </div>
                )} />
                <TableRow title='Condições válido' content={
                    (record.effective && !isShowConditionDetail) ? (
                    <div className='px-2'>Para atender às condições</div>
                    ) : (
                    <div
                      className='px-2'
                    >
                      Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br/>
                      Aposta acumulativa R${formatLocaleMoney(flow || 0)}
                    </div>
                  )
                }/>
                </tbody>
              </table>
            )
          })
        }
        {
          inviteList.length === 0 && (
            <div
              className='flex flex-col justify-center items-center gap-1'
            >
              <img
                alt='noData'
                src={`assets/${environment.uVersion}/noData.png`}
                className='w-[76px]'
              />

              <div
                className='text-lg font-mediumo'
              >Nada aqui</div>
            </div>
          )
        }
      </div>

    </div>
  )
}