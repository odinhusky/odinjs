import cx from "classnames";
import {useEffect} from "react";
import {useImageLoad} from "../../../../hooks/useImageLoag";
import {CacheImage} from "../../../../components/image/CacheImage";


export interface IMenuDrawerDonItem {
  item: string;
  className?: string;
  icon?: string;
  defIcon?: string;
  onClick?: () => void;
  id: string;
}


export const MenuDrawerDonItem = (props: IMenuDrawerDonItem) => {
  const {id, item, className = '', icon, onClick} = props;
  const iconSrc = props?.icon || '';
  const defIconSrc = props?.defIcon || '';
  const {loadImageAndCache, imageCache} = useImageLoad()
  useEffect(() => {
    loadImageAndCache(iconSrc, defIconSrc, -1);
  }, []);


  return (
    <div className={"w-full flex flex-col px-5"}>
      <button
        className={cx(className,
          'min-h-[44px] items-center pl-2',
          'bg-[var(--grayscale-20)] text-[var(--grayscale-70)] border-[1.5px] border-[var(--grayscale-30)]',
          'active:bg-[var(--grayscale-15)] active:text-[rgb(255,255,255)]',
          'rounded-full',
          {})}
        onClick={onClick && onClick}
      >

        <CacheImage
          id={id}
          alt={id}
          src={iconSrc}
          defSrc={defIconSrc}
          className={'w-5'}
        />
        <div className="text-sm font-medium text-[var(--grayscale-70)]">
          {item}
        </div>
      </button>
    </div>
  )
}
