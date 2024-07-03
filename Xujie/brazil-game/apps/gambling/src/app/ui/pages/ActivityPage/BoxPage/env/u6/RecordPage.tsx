import { PageContainer } from "../../../../../components-bs/PageContainer"
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation"
import Select, { StylesConfig } from "react-select"
import { useRecordModal } from "../../hooks/useRecordModal"
import { RecordTable } from "./RecordTable"
import {formatLocaleMoney} from "../../../../../utils/format";

const selectStyleProps: StylesConfig = {
  control: (base, { isFocused }) => ({
    ...base,
    background: "var(--grayscale-20)",
    border: isFocused
      ? "1.5px solid var(--state-warn-main)"
      : "1.5px solid var(--grayscale-80)",
    color: "var(--grayscale-80)",
    padding: "0px 8px",
    borderRadius: "8px",
    outline: "none",
    boxShadow: "none",
    "&:hover": {},
    cursor: "pointer",
  }),
  valueContainer: (style) => ({
    ...style,
    color: "var(--grayscale-80)",
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,
    background: isFocused ? "var(--grayscale-40)" : "var(--grayscale-20)",
    color:
      isSelected || isFocused ? "var(--grayscale-100)" : "var(--grayscale-80)",
    "&:active": {
      background: "var(--grayscale-20)",
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "8px",
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: "8px",
    border: "1.5px solid var(--grayscale-40)",
    padding: "0px",
  }),

  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: "var(--grayscale-80)",
  }),
}

interface RecordPageProps {
  onClickToBack: () => void
}

export const RecordPage = ({ onClickToBack }: RecordPageProps) => {
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
    <PageContainer className="text-[var(--grayscale-100)]">
      <BackNavigation onClick={onClickToBack} />

      <div
        className="bg-[var(--grayscale-20)] rounded-lg
          mt-3 p-4
          mobile:mt-4 mobile:p-5
          tablet:mt-8 tablet:p-8
        "
      >
        <div className="font-medium mobile:text-xl text-base max-mobile:text-center">
          Minha lista de recomendações
        </div>

        <div className="flex max-mobile:flex-col justify-between items-center mobile:my-5 mt-1 mb-4">
          <div
              className="font-medium
              text-base text-center
              mobile:text-lg mobile:text-left
              flex flex-col justify-end items-center mobile:items-start
            "
          >
            <p>Número total de convites： <span className='text-[var(--state-info-main)]'>{inviteTotalCount}</span></p>
            <p className={totalRechargeNum != undefined ? '' : 'hidden'}>Número de Usuários Recarregados： <span className='text-[var(--state-info-main)]'>{totalRechargeNum || 0}</span></p>
            <p className={totalRechargeAmount != undefined ? '' : 'hidden'}>Montante total recarregado： <span className='text-[var(--state-info-main)]'>R${formatLocaleMoney(totalRechargeAmount || 0)}</span></p>
          </div>
          <Select
              className="w-[240px] max-mobile:mt-4"
              isSearchable={false}
              styles={selectStyleProps}
              options={statusOption}
              value={selectedStatus}
            onChange={(item: any) => setSelectedStatus(item)}
          />
        </div>

        <RecordTable isShowConditionDetail={isShowConditionDetail} inviteList={inviteList} />
      </div>
    </PageContainer>
  )
}
