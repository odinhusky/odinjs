import { environment } from "../../../../../../../environments/environment";


export const RangeDatePickerContent = ({
  value
}: { value: [string, string] }) => {
  return (
    <div className='flex items-center gap-2'>
      <img
        alt='calendar'
        className='w-[20px] h-[20px]'
        src={`assets/${environment.uVersion}/Calendar.png`}
      />
      <div className="w-full flex justify-between items-center">
        <span>{value[0]}</span>
        <span>{' - '}</span>
        <span>{value[1]}</span>
      </div>
    </div>
  )
}
