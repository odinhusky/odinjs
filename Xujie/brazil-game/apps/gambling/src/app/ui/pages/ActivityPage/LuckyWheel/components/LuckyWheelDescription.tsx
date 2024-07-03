import cx from "apps/gambling/src/app/ui/utils/cx";
import { TranslateStringToDOM } from "../../TranslateStringToDOM";
import { environment } from "apps/gambling/src/environments/environment";

interface LuckyWheelDescriptionProps {
  content: string;
  className?: string;
}

export const LuckyWheelDescription = ({
  content,
  className
}: LuckyWheelDescriptionProps) => {

  return (
    <div
      className={cx(
        {
          'mt-4 tab:mt-5': environment.uVersion !== 'u6'
        },
        'rounded-lg',
        'p-3 tab:py-4 tab:px-6',
        'pl-9 tab:pl-12',
        'font-medium',
        'text-sm leading-5',
        'tab:text-base tab:leading-6',
        'lucky-wheel-description-container',
        className
      )}
    >
      <TranslateStringToDOM htmlContext={content}/>
    </div>
  )
}

export default LuckyWheelDescription;