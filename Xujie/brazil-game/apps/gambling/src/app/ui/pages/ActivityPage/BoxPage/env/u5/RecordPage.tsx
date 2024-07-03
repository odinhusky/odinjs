import {PageContainer} from "../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import Select, {StylesConfig} from "react-select";
import {useRecordModal} from "../../hooks/useRecordModal";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {RecordTable} from "./RecordTable";
import {useEffect, useRef, useState} from "react";
import {formatLocaleMoney} from "../../../../../utils/format";
import {CardRecordTable} from "./CardRecordTable";

interface RecordPageProps {
  onClickToBack: () => void
}

export const RecordPage = ({   onClickToBack }:RecordPageProps) => {
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

  const { isMobile,isDesktop } = useBreakpoint()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectStyleProps: StylesConfig = {
    control: (base, { isFocused }) => (
      {
        ...base,
        background: 'var(--grayscale-30)',
        border: isFocused? '1.5px solid var(--state-warn-main)': '1.5px solid var(--grayscale-40)',
        color: 'white',
        padding: '0px 8px',
        borderRadius: '8px',
        outline: 'none',
        boxShadow: 'none',
        '&:hover': {
        },
        cursor: 'pointer'
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
  
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      background: isSelected ? 'var(--grayscale-20)': isFocused ? 'var(--grayscale-40)': 'var(--grayscale-30)',
      color: 'white',
      '&:active': {
        background: "var(--grayscale-20)"
      },
    }),
  
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
    }),
    menuList: (base) => ({
      ...base,
      borderRadius: '8px',
      border: '1.5px solid var(--grayscale-40)',
      padding: '0px'
    }),
    singleValue: (provided: any, state: any) => {
      console.log('@@ state', state)
      return {
        ...provided,
        color: isMenuOpen ? 'white' : 'var(--grayscale-60)'
      }
    },
  }


  return (
    <PageContainer
      className='text-[var(--grayscale-100)]'
    >
      <BackNavigation
        onClick={onClickToBack}
      />

      <div
        className='bg-[var(--grayscale-20)] rounded-lg
          mt-3 p-4
          mobile:mt-4 mobile:p-5
          tablet:mt-8 tablet:p-8
        '
      >
        <div

          className='font-extrabold
            text-base text-center
            mobile:text-lg mobile:text-left
            tablet:text-2xl
          '
        >
          Minha lista de recomendações
        </div>

        <div
          className='flex justify-between items-center
            mt-3 flex-col gap-3
            mobile:mt-5 mobile:flex-row
          '
        >
          <Select
            className='
            w-[200px]
            tablet:w-[240px]
          '
            isSearchable={false}
            styles={selectStyleProps}
            options={statusOption}
            value={selectedStatus}
            onChange={(item: any) => setSelectedStatus(item)}
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
          />

          <div
            className='font-extrabold
              text-base text-center
              mobile:text-lg mobile:text-left
              flex flex-col justify-end items-center mobile:items-end
            '
          >
            <p>Número total de convites： <span className='text-[var(--state-success-main)]'>{inviteTotalCount}</span></p>
            <p className={totalRechargeNum != undefined ? '' : 'hidden'}>Número de Usuários Recarregados： <span className='text-[var(--state-success-main)]'>{totalRechargeNum || 0}</span></p>
            <p className={totalRechargeAmount != undefined ? '' : 'hidden'}>Montante total recarregado： <span className='text-[var(--state-success-main)]'>R${formatLocaleMoney(totalRechargeAmount || 0)}</span></p>
          </div>
        </div>

        {
          !isMobile? (
            <RecordTable isShowConditionDetail={isShowConditionDetail} inviteList={inviteList} />
          ): (
              <CardRecordTable isShowConditionDetail={isShowConditionDetail} inviteList={inviteList} />
            // <HorizontalRecordTable isShowConditionDetail={isShowConditionDetail} inviteList={inviteList} />
          )
        }
      </div>


    </PageContainer>
  )
}