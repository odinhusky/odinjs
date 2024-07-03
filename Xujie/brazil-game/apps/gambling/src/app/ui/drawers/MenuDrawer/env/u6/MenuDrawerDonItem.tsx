import {useEffect} from "react";
import {useImageLoad} from "../../../../hooks/useImageLoag";
import {CacheImage} from "../../../../components/image/CacheImage";
import cx from "../../../../utils/cx";


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
      <button
          className={cx(
              'w-full flex flex-col px-5 py-2 text-sm',
              'menu-download-button',
              'min-h-9 items-center',
              className,
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
        <div>
          {item}
        </div>
      </button>
  )
}
