import cx from "apps/gambling/src/app/ui/utils/cx";
import { LuckyWheelBtnProps } from "../../components/LuckyWheelBtn";

export const LuckyWheelBtnU1 = ({
  isDisabled = false,
  children = '',
  className = '',
  onClick = () => {},
}: LuckyWheelBtnProps) => {
  return (
    <button 
      className={cx(
        'w-full h-[35px]',
        'tab:w-[230px] tab:h-[53px]',
        'tablet:w-[200px] tablet:h-[56px]',
        'mt-3 tab:mt-0',
        'font-medium',
        'text-sm leading-5',
        'tab:text-[24px] tab:leading-8',
        'tablet:text-lg tablet:leading-7',
        {
          'blue-btn': !isDisabled,
          'blue-btn-disabled': isDisabled
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default LuckyWheelBtnU1;