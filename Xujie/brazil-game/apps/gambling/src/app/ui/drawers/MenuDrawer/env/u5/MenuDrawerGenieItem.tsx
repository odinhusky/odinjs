import cx from "classnames";
import {useEffect} from "react";
import {useImageLoad} from "../../../../hooks/useImageLoag";
import {CacheImage} from "../../../../components/image/CacheImage";


export interface IMenuDrawerGenieItem {
  title: string;
  subTitle: string;
  className?: string;
  icon?: string;
  defIcon?: string;
  onClick?: () => void;
  isActivePage?: boolean;
}

export const MenuDrawerGenieItem = (props: IMenuDrawerGenieItem) => {
  const {title, subTitle, className = '', icon, onClick} = props;
  const {loadImageAndCache, imageCache} = useImageLoad()
  const iconSrc = props?.icon || '';
  const defIconSrc = props?.defIcon || '';
  const isTextLeft = props?.isActivePage ? false : true;
  
  useEffect(() => {
    loadImageAndCache(iconSrc, defIconSrc, -1);
  }, []);

  return (
    <div className={cx(
      'w-full flex flex-col px-5 relative',
    )}>
      <button
        className={cx(className,
          // 'fixed bottom-0 left-0',
          'p-[8px] h-[56px] w-full',
          'rounded-[12px]',
          'shadow-[0px_4px_4px_0px_rgba(38,_33,_44,_1.0),_inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.4),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.4)]',
          {
            'pr-3': !isTextLeft
          }
        )}
        onClick={onClick && onClick}
      >
        <div className={cx(
          'w-full',
          'flex flex-col items-start',
          'text-sm font-bold text-[var(--grayscale-100)]',
          'mt-px',
          {
            'text-left': isTextLeft,
            'text-right': !isTextLeft
          },
        )}>
          <div className="w-full leading-[20px]">
            {title}
          </div>
          <div className="w-full leading-[24px]">
            {subTitle}
          </div>
        </div>
      </button>

      <CacheImage
        src={iconSrc}
        defSrc={defIconSrc}
        className={cx(
          'h-[64px]',
          'cursor-pointer mt-0',
          'absolute bottom-0',
          {
            'right-0 mr-[28px]': isTextLeft,
            'left-0 ml-[28px]': !isTextLeft
          }
        )}
        onClick={onClick && onClick}
      />
    </div>
  )
}
