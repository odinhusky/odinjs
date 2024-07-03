import {PageContainer} from "../../../../../../components-bs/PageContainer";
import {usePageNavigate} from "../../../../../../router/hooks/usePageNavigate";
import {BackNavigation} from "../../../../../../components-bs/BackNavigation/BackNavigation";
import Select, {StylesConfig} from "react-select";
import {useActivityRecord} from "../../../../hooks/useActivityRecord";
import {environment} from "../../../../../../../../environments/environment";
import {recordStatusMap} from "../RecordPage";


const selectStyleProps: StylesConfig = {
  control: (base, { isFocused }) => (
    {
      ...base,
      background: 'var(--grayscale-20)',
      border: isFocused? '2px solid var(--primary-main)': '1px solid var(--grayscale-50)',
      color: 'white',
      padding: '0px 8px',
      borderRadius: '8px',
      outline: 'none',
      boxShadow: 'none',
      '&:hover': {
      },
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
    background: isSelected ? 'var(--grayscale-30)': isFocused ? 'var(--grayscale-50)': 'var(--grayscale-20)',
    color: 'white',
    '&:active': {
      background: "rgba(0, 0, 0, .3)"
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '8px',
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

  const{ activityRecordState, useQueryByActivityOptionAndDayOption} = useActivityRecord()


  const mock = [
    {
      time: "01.01.1999 14:00", //Tempo
      name: "LossBenefit", //Nomes do evento
      bonus: "0.1", //Valor do bônus
      status: true, //Estado
      ip: "192.168.0.1" //ip
    },
    {
      time: "02.01.1999 21:11", //Tempo
      name: "LossBenefit", //Nomes do evento
      bonus: "0.05", //Valor do bônus
      status: true, //Estado
      ip: "192.168.0.1" //ip
    },
    {
      time: "17.02.1999 23:59", //Tempo
      name: "LossBenefit", //Nomes do evento
      bonus: "0.1", //Valor do bônus
      status: true, //Estado
      ip: "192.168.0.1" //ip
    },
    {
      time: "11.05.1999 01:20", //Tempo
      name: "LossBenefit", //Nomes do evento
      bonus: "0.122", //Valor do bônus
      status: false, //Estado
      ip: "192.168.0.1" //ip
    },
    {
      time: "11.05.1999 01:30", //Tempo
      name: "LossBenefit", //Nomes do evento
      bonus: "0.21", //Valor do bônus
      status: true, //Estado
      ip: "192.168.0.1" //ip
    },
    {
      time: "21.07.1999 00:30", //Tempo
      name: "LossBenefit", //Nomes do evento
      bonus: "0.11", //Valor do bônus
      status: true, //Estado
      ip: "192.168.1.1" //ip
    },
  ]


  return (
    <PageContainer
      className='text-white'
    >
      <BackNavigation
        onClick={onClickToActivity}
      />

      <div className='flex gap-5 mt-3'>
        <Select
          className='w-full'
          isSearchable={false}
          value={activityRecordState?.currentDay}
          options={activityRecordState?.dayOptions}
          styles={selectStyleProps}
          onChange={(item: any) => {
            useQueryByActivityOptionAndDayOption(activityRecordState?.currentTypeName || { label: '', value: '', type: ''}, item)
          }}
        />
        <Select
          className='w-full'
          isSearchable={false}
          value={activityRecordState?.currentTypeName}
          options={activityRecordState?.activityOptions}
          styles={selectStyleProps}
          onChange={(item: any) => {
            useQueryByActivityOptionAndDayOption(item, activityRecordState?.currentDay || { label: '', value: 1})
          }}
        />
      </div>

      <div className='mt-3 text-base flex justify-center'>
        <div
          className='text-[var(--grayscale-70)]'
        >
          Bônus{' '}
          <span
            className='text-[var(--state-success-main)] font-bold'
          >
            {activityRecordState?.totalBonus}
          </span>
        </div>
      </div>

      <div
        className='mt-3 rounded-lg p-2 h-[57vh] bg-[var(--grayscale-20)]'
      >
        {activityRecordState?.tableBody?.length || 0 > 0 ? (
          <div
            className='h-full overflow-y-scroll flex flex-col gap-[10px]'
          >
            {
              activityRecordState?.tableBody?.map((item, index) => (
                <div
                  key={index}
                  className='text-sm text-[var(--grayscale-70)] rounded-lg p-2 border border-[var(--grayscale-30)] flex flex-col gap-2'
                >
                  <div className='flex justify-between'>
                    <div>Tempo</div>
                    <div className='text-white'>{item.time}</div>
                  </div>
                  <div
                    className='w-full h-[1px] bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,.2)] to-[rgba(255,255,255,0)]'
                  />
                  <div className='flex justify-between items-center'>
                    <div className='w-1/2'>Nome do evento</div>
                    <div className='text-white w-1/2 text-right'>{item.name}</div>
                  </div>
                  <div
                    className='w-full h-[1px] bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,.2)] to-[rgba(255,255,255,0)]'
                  />
                  <div className='flex justify-between'>
                    <div>Valor do bônus</div>
                    <div className='text-white'>{item.bonus}</div>
                  </div>
                  <div
                    className='w-full h-[1px] bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,.2)] to-[rgba(255,255,255,0)]'
                  />
                  <div className='flex justify-between'>
                    <div>Estado</div>
                    <div
                      style={{
                        color: recordStatusMap[item.status ? 'true' : 'false'].color
                      }}>{recordStatusMap[item.status ? 'true' : 'false'].title}</div>
                  </div>
                  <div
                    className='w-full h-[1px] bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,.2)] to-[rgba(255,255,255,0)]'
                  />
                  <div className='flex justify-between'>
                    <div>IP</div>
                    <div className='text-white'>{item.ip}</div>
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          <div
            className='h-full w-full flex justify-center items-center border border-dashed border-[var(--grayscale-70)] rounded-lg'
          >
            <div
              className='flex flex-col gap-2'
            >
              <img alt='noData' className='w-[64px]' src={`assets/${environment.uVersion}/noData.png`}/>
              <div className='text-[var(--grayscale-70)]'>Nada aqui</div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}