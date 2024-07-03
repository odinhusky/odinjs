export const RangeDatePickerContent = ({
  value
}: { value: [string, string] }) => {
  return (
    <div className='flex items-center gap-2'>
      <div className="w-full text-sm font-medium flex items-center text-[var(--grayscale-70)]">
        <span>{value[0]}</span>
        <span className="block mx-2">{' - '}</span>
        <span>{value[1]}</span>
      </div>
      {/*<img*/}
      {/*  alt='calendar'*/}
      {/*  className='w-6 h-6'*/}
      {/*  src={`assets/${environment.uVersion}/Calendar.png`}*/}
      {/*/>*/}
    </div>
  )
}
