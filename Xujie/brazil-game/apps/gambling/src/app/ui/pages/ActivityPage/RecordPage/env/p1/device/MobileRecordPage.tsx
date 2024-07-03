import {PageContainer} from "../../../../../../components-bs/PageContainer";
import {usePageNavigate} from "../../../../../../router/hooks/usePageNavigate";
import {useActivityRecord} from "../../../../hooks/useActivityRecord";
import {BackNavigation} from "../../../../../../components-bs/BackNavigation/BackNavigation";
import Select, {StylesConfig} from "react-select";
import React from "react";
import {environment} from "../../../../../../../../environments/environment";
import {recordStatusMap} from "../RecordPage";

const selectStyleProps: StylesConfig = {
  control: (base, {isFocused}) => (
    {
      ...base,
      background: '#008B8D',
      border: 'none',
      color: 'white',
      padding: '0px 8px',
      borderRadius: '100px',
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
    background: isSelected ? 'rgba(0,0,0,.2)' : isFocused ? 'rgba(0,0,0,.2)' : '',
    color: 'white',
    '&:active': {
      background: "rgba(0, 0, 0, .3)"
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    background: '#008B8D'
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
  const { onClickToActivity } = usePageNavigate()
  const { activityRecordState, useQueryByActivityOptionAndDayOption } = useActivityRecord()

  return (
    <PageContainer
      className='text-white'
    >
      <BackNavigation
        onClick={onClickToActivity}
      />
      <Select
        className='w-full mt-3'
        isSearchable={false}
        value={activityRecordState?.currentDay}
        options={activityRecordState?.dayOptions}
        onChange={(item: any) => {
          useQueryByActivityOptionAndDayOption(activityRecordState?.currentTypeName || { label: '', value: '', type: ''}, item)
        }}
        styles={selectStyleProps}
      />

      <Select
        className='w-full mt-3'
        isSearchable={false}
        value={activityRecordState?.currentTypeName}
        options={activityRecordState?.activityOptions}
        onChange={(item: any) => {
          useQueryByActivityOptionAndDayOption(item, activityRecordState?.currentDay || { label: '', value: 1})
        }}
        styles={selectStyleProps}
      />

      <div className='flex justify-end mt-3'>
        <div className='font-bold text-base'>
          Bônus{' '}
          <span className='text-[#33F7DE]'>{activityRecordState?.totalBonus}</span>
        </div>
      </div>

      <div className='mt-3'>
        {
          activityRecordState?.tableBody?.length || 0 > 0 ? (
            <div className='h-[40vh] overflow-y-scroll flex flex-col gap-3 text-base'>
              {
                activityRecordState?.tableBody?.map((item, index)=>(
                  <div
                    key={index}
                    className='rounded-2xl border border-[#58DCC7] bg-[#006D79]'
                  >
                    <div className='py-2 px-4 border border-transparent border-b-[#58DCC7] flex justify-between'>
                      <div className='font-bold'>Tempo</div>
                      <div>{item.time}</div>
                    </div>
                    <div className='py-2 px-4 border border-transparent border-b-[#58DCC7] flex justify-between'>
                      <div className='font-bold w-1/3'>Nomes do evento</div>
                      <div className='w-2/3 text-right'>{item.name}</div>
                    </div>
                    <div className='py-2 px-4 border border-transparent border-b-[#58DCC7] flex justify-between'>
                      <div className='font-bold'>Valor do bônus</div>
                      <div>{item.bonus}</div>
                    </div>
                    <div className='py-2 px-4 border border-transparent border-b-[#58DCC7] flex justify-between'>
                      <div className='font-bold'>Estado</div>
                      <div
                        style={{
                          color: recordStatusMap[item.status ? 'true' : 'false'].color
                        }}
                      >{recordStatusMap[item.status ? 'true' : 'false'].title}</div>
                    </div>
                    <div className='py-2 px-4 flex justify-between'>
                      <div className='font-bold'>IP</div>
                      <div>{item.ip}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className='rounded-lg h-[30vh] bg-[#006D79] flex justify-center items-center flex-col gap-1'>
              <img alt='noData' className='w-[60px]' src={`assets/${environment.uVersion}/noData.png`} />
              <div className='text-[#FBFF3F]'>Nada aqui</div>
            </div>
          )
        }
      </div>
    </PageContainer>
  )
}