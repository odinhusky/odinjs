import {useState} from "react";
import {useGetBoxInviteListQuery} from "../../../../../external";

const initialStatusSelected = {
  label: 'Todas as recomendações',
  value: 0
}

const statusOption = [
  initialStatusSelected,
  {
    label: 'Jogador válido',
    value: 1
  },
  {
    label: 'Jogador inválido',
    value: -1
  }
]

export const useRecordModal = () => {
  const { data } = useGetBoxInviteListQuery(null, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })

  const [selectedStatus, setSelectedStatus] = useState(initialStatusSelected)

  const inviteList = data?.data?.invitees?.filter((item) => {
    if(selectedStatus.value === 0) return true;
    return selectedStatus.value === 1 ? item.effective : !item.effective
  }) || []

  const inviteTotalCount = data?.data?.invitees?.length || 0;
  const totalRechargeAmount: number| undefined = data?.data?.inviteRechargeAmount;
  const totalRechargeNum: number| undefined = data?.data?.inviteRechargeNum;
  const isShowConditionDetail: boolean = data?.data?.effectiveDetailDisplay || false;
  return {
    totalRechargeNum,
    isShowConditionDetail,
    totalRechargeAmount,
    inviteList,
    inviteTotalCount,
    selectedStatus,
    statusOption,
    setSelectedStatus
  }
}