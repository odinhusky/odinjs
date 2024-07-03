import cx from "classnames";
import {SyntheticEvent} from "react";
import {CacheImage} from "../../../../components/image/CacheImage";


export interface IMenuDrawerItem {
  item: string;
  className?: string;
  icon?: string;
  defIcon?: string;
  onClick?: () => void;
  badge?: React.ReactNode;
}


export const MenuDrawerItem = (props: IMenuDrawerItem) => {
  const {item, className = '', icon, onClick,badge} = props;
  const iconSrc = props?.icon || '';
  const defIconSrc = props?.defIcon || '';

  return (
    <div className={"w-full flex flex-col px-5"}>
      <button
        className={cx(className, {})}
        onClick={onClick && onClick}
      >
        <CacheImage
          alt={'tab-icon'}
          src={iconSrc}
          defSrc={defIconSrc}
          className={'w-5'}
          onError={(e: SyntheticEvent<HTMLImageElement>) => {
            console.log(`load game type icon fail`, `item = ${item}`, e)
            e.currentTarget.style.visibility = 'hidden'
          }}
        />
        <div className="text-sm font-medium leading-[20px] text-left">
          {item}
        </div>
      {badge &&
          <div>
              {badge}
          </div>
      }
      </button>
    </div>
  )
}
