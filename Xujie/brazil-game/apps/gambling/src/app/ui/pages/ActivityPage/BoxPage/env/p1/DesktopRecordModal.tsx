import {useRecordModal} from "../../hooks/useRecordModal";
import Select from "react-select";
import {RecordModalProps, selectStyleProps, statusMap} from "./RecordModal";
import {formatLocaleMoney} from "../../../../../utils/format";
import {Table} from "../../../../../components-bs/Table";


export const DesktopRecordModal = () => {
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
      render: (record: any) => (
        <div
          style={{
            color: `var(${statusMap[record.effective ? 1:0].color})`
          }}
        >
          {statusMap[record.effective ? 1:0].text}
        </div>
      )
    },
    {
      title: 'Condições válido',
      name: 'effective',
      key: 'effective',
      render: (record: any) => {
        const recharge = record.achievements.find((item:any) => item.rule ==='RECHARGE')?.value
        const flow = record.achievements.find((item: any) => item.rule ==='BET_FLOW')?.value
        return (record.effective && !isShowConditionDetail) ? 'Para atender às condições': (
          <div className='text-center'>
            Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br/>
            Aposta acumulativa R${formatLocaleMoney(flow || 0)}
          </div>
        )
      }
    },
  ]

  return (
    <div
      className='rounded-2xl bg-[var(--background-modal)] w-[960px] h-3/5 p-6 flex flex-col'
      onClick={e=>e.stopPropagation()}
    >
      <div className='font-bold text-2xl'>Minha lista de recomendações</div>

      <div
        className='mt-4 flex justify-between'
      >
        <Select
          className='w-[236px]'
          isSearchable={false}
          styles={selectStyleProps}
          options={statusOption}
          value={selectedStatus}
          onChange={(item: any) => setSelectedStatus(item)}
        />

        <div className='font-bold text-base
        flex flex-col justify-end items-end
        '>
          <p>Número total de convites <span className='text-[var(--state-info)]'>{inviteTotalCount}</span></p>
          <p className={totalRechargeNum != undefined ? '' : 'hidden'}>Número de Usuários Recarregados <span className='text-[var(--state-info)]'>{totalRechargeNum || 0}</span></p>
          <p className={totalRechargeAmount != undefined ? '' : 'hidden'}>Montante total recarregado <span className='text-[var(--state-info)]'>R${formatLocaleMoney(totalRechargeAmount || 0)}</span></p>
        </div>
      </div>

      <div
        className='mt-4 rounded-2xl border border-[var(--outline-table)] grow overflow-hidden'
      >
        <Table
          dataSource={inviteList}
          columns={columns}
          dataCount={inviteList.length}
        />
      </div>
    </div>
  )
}