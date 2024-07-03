import {RecordModalProps, selectStyleProps, statusMap} from "./RecordModal";
import Select from "react-select";
import {useRecordModal} from "../../hooks/useRecordModal";
import {formatLocaleMoney} from "../../../../../utils/format";
import cx from "../../../../../utils/cx";
import {CacheImage} from "../../../../../components/image/CacheImage";
import {environment} from "../../../../../../../environments/environment";


export const MobileRecordModal = () => {
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

  return (
    <div
      className='rounded-2xl bg-[var(--background-modal)] w-[90%] h-[70%] px-3 py-6 flex flex-col'
      onClick={e => e.stopPropagation()}
    >
      <div className='font-bold text-base'>Minha lista de recomendações</div>
      <Select
        className='w-full mt-4'
        isSearchable={false}
        styles={selectStyleProps}
        options={statusOption}
        value={selectedStatus}
        onChange={(item: any) => setSelectedStatus(item)}
      />
      <div className='mt-2 font-bold text-base text-center'>
        <p>Número total de convites <span className='text-[var(--state-info)]'>{inviteTotalCount}</span></p>
        <p className={totalRechargeNum != undefined ? '' : 'hidden'}>Número de Usuários Recarregados <span className='text-[var(--state-info)]'>{totalRechargeNum || 0}</span></p>
        <p className={totalRechargeAmount != undefined ? '' : 'hidden'}>Montante total recarregado <span className='text-[var(--state-info)]'>R${formatLocaleMoney(totalRechargeAmount || 0)}</span></p>
      </div>

      <div
        className={
          cx(
            'mt-4 flex flex-col grow overflow-y-scroll gap-4',
            inviteList.length === 0 && 'justify-center items-center'
          )
        }
      >
        {
          inviteList.map((item, index) => {
            const recharge = item.achievements.find((i) => i.rule ==='RECHARGE')?.value
            const flow = item.achievements.find((i) => i.rule ==='BET_FLOW')?.value
            return (
              <div
                key={index}
                className='rounded-2xl border border-[var(--outline-table)] bg-[var(--table-varient)] text-base'
              >
                <div
                  className='flex justify-between px-4 py-2'
                >
                  <div className='font-bold'>ID</div>
                  <div>{item.invitee}</div>
                </div>
                <div className='w-full h-[1px] bg-[var(--outline-table)]'/>
                <div
                  className='flex justify-between px-4 py-2'
                >
                  <div className='font-bold'>Data recomendada</div>
                  <div>{item.registerDate}</div>
                </div>
                <div className='w-full h-[1px] bg-[var(--outline-table)]'/>
                <div
                  className='flex justify-between px-4 py-2'
                >
                  <div className='font-bold'>Válido ou não</div>
                  <div
                    style={{
                      color: `var(${statusMap[item.effective ? 1 : 0].color})`
                    }}
                  >{statusMap[item.effective ? 1 : 0].text}</div>
                </div>
                <div className='w-full h-[1px] bg-[var(--outline-table)]'/>
                <div
                  className='px-4 py-2'
                >
                  <div className='font-bold'>Condições válido</div>
                  <div className='mt-2'>
                    {(item.effective && !isShowConditionDetail)? 'Para atender às condições': (
                      <div className='text-left'>
                        Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br/>
                        Aposta acumulativa R${formatLocaleMoney(flow || 0)}
                      </div>)
                    }
                  </div>
                </div>
              </div>
            )
          })
        }

        {
          inviteList.length === 0 && (
            <div className='flex flex-col justify-center items-center gap-1'>
              <CacheImage
                alt='noData'
                className='w-[60px]'
                src={`assets/${environment.uVersion}/noData.png`}
              />
              <div className='text-[#FBFF3F]'>Nada aqui</div>
            </div>
          )
        }
      </div>
    </div>
  )
}