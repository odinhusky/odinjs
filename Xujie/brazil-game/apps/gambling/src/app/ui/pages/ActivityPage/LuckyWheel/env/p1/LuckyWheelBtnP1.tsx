import cx from "apps/gambling/src/app/ui/utils/cx";
import { LuckyWheelBtnProps } from "../../components/LuckyWheelBtn";

export const LuckyWheelBtnP1 = ({
  isDisabled = false,
  children = '',
  className = '',
  onClick = () => {},
}: LuckyWheelBtnProps) => {
  return (
    <button 
      className={cx(
        'w-full h-[35px]',
        'mt-3 tab:mt-0',
        'font-bold',
        'text-sm leading-5',
        {
          'lucky-wheel-btn': !isDisabled,
          '': isDisabled
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default LuckyWheelBtnP1;