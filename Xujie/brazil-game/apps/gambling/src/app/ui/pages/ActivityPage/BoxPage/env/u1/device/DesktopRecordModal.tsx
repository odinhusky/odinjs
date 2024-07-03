import {RecordModalProps, selectStyleProps, statusMap} from "../RecordModal";
import {environment} from "../../../../../../../../environments/environment";
import Select from "react-select";
import {useRecordModal} from "../../../hooks/useRecordModal";
import {formatLocaleMoney} from "../../../../../../utils/format";
import {InfiniteTable, TInfiniteTableColumn} from "../../../../../../components-bs/InfiniteTable";
import {
  GetBoxInviteListResponseDataInvitees
} from "../../../../../../../external/endpoint/activity/box/GetBoxInviteListEndpoint";


export const DesktopRecordModal = ({ onClose }: RecordModalProps) => {
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

  const columns: TInfiniteTableColumn<GetBoxInviteListResponseDataInvitees>[]= [
    {
      title: 'ID',
      dataIndex: 'invitee'
    },
    {
      title: 'Data recomendada',
      dataIndex: 'registerDate'
    },
    {
      title: 'Válido ou não',
      dataIndex: 'effective',
      render: record => (
        <div
          className='font-bold'
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
      dataIndex: 'achievements',
      render: record => {
        if (record.effective && !isShowConditionDetail) {
          return <div className='px-2'>Para atender às condições</div>
        }else {
          const recharge = record.achievements.find((item) => item.rule ==='RECHARGE')?.value
          const flow = record.achievements.find((item) => item.rule ==='BET_FLOW')?.value
          return (
            <div
              className='px-2 text-center'
            >
              Recarga acumulada R${formatLocaleMoney(recharge || 0)},<br/>
              Aposta acumulativa R${formatLocaleMoney(flow || 0)}
            </div>
          )
        }
      }
    }
  ]

  return (
    <div
      className='relative flex flex-col text-white w-3/5 h-2/3 rounded-2xl p-6 border-2 border-[var(--stroke-modal)]
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
      <div className='text-center text-2xl font-bold'>Minha lista de recomendações</div>

      <div
        className='mt-6 flex justify-between items-center'
      >
        <Select
          className='w-[280px]'
          isSearchable={false}
          styles={selectStyleProps}
          options={statusOption}
          value={selectedStatus}
          onChange={(item: any) => setSelectedStatus(item)}
        />

        <div
          className='text-base font-bold
          flex flex-col justify-end items-end
          '
        >
          <p>Número total de convites <span className='text-[var(--state-info-main)]'>{inviteTotalCount}</span></p>
          <p className={totalRechargeNum != undefined ? '' : 'hidden'}>Número de Usuários Recarregados <span className='text-[var(--state-info-main)]'>{totalRechargeNum || 0}</span></p>
          <p className={totalRechargeAmount != undefined ? '' : 'hidden'}>Montante total recarregado <span className='text-[var(--state-info-main)]'>R${formatLocaleMoney(totalRechargeAmount || 0)}</span></p>
        </div>
      </div>

      <InfiniteTable
        className='mt-6'
        rowKey='invitee'
        datasource={inviteList}
        columns={columns}
        totalCount={inviteList.length}
      />
    </div>
  )
}