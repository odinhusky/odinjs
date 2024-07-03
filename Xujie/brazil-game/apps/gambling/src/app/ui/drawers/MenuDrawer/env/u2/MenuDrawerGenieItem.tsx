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
}


export const MenuDrawerGenieItem = (props: IMenuDrawerGenieItem) => {
  const {title, subTitle, className = '', icon, onClick} = props;
  const {loadImageAndCache, imageCache} = useImageLoad()
  const iconSrc = props?.icon || '';
  const defIconSrc = props?.defIcon || '';
  useEffect(() => {
    loadImageAndCache(iconSrc, defIconSrc, -1);
  }, []);

  return (
    <div className={"w-full flex flex-col px-5"}>
      <button
        className={cx(className, {})}
        onClick={onClick && onClick}
      >
        <div className="flex flex-col mt-px items-start text-left">
          <div className="text-sm font-medium leading-[20px] text-white">
            {title}
          </div>
          <div className="font-medium leading-[24px] text-white">
            {subTitle}
          </div>
        </div>

        <CacheImage
          src={iconSrc}
          defSrc={defIconSrc}
          className={'w-[64px] mt-0 mb-[-38px]'}
        />
      </button>
    </div>
  )
}
