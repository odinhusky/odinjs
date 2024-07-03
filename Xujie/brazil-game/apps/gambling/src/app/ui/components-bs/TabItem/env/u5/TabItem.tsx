import cx from 'classnames';
import { SyntheticEvent, useEffect, useState } from 'react'
import { CacheImage } from "../../../../components/image/CacheImage";
import { useImageExist } from '../../../../hooks/useImageExist';

type ITabItem = {
  imgUrl?: string
  active: boolean;
  icon?: string;
  name: string;
  onClick: () => void;
  className?: string;
  defIcon?: string;
  activeClassName?:string
}

export const TabItem = (props: ITabItem) => {
  const iconSrc = props?.icon || '';
  const defIconSrc = props?.defIcon || '';
  return (
    <div
      onClick={props.onClick}
      className={cx(`rounded-[100px]`,
        "flex flex-row justify-center items-center",
        "text-white text-xs lg:text-sm",
        "font-normal",
        "whitespace-nowrap",
        "flex-1",
        "cursor-pointer",
        {
          'py-2.5 px-4': props?.icon !== undefined,
          'py-3 px-4 md:px-10 lg:py-2.5 lg:px-16': props?.icon === undefined,
          [`bg-[var(--grayscale-30)] border-[var(--state-warn-main)] border-solid border ${props.activeClassName}`]:props.active,
          'bg-[var(--grayscale-20)': !props.active
        },
        props.className
      )}
    >

      {iconSrc && <CacheImage
        alt={'tab-icon'}
        src={iconSrc}
        defSrc={defIconSrc}
        className={'w-[16px] lg:w-[20px] mr-2'}
        onError={(e: SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.style.visibility = 'hidden'
          e.currentTarget.style.width = '0px';
        }}
      />}
      <div>{props.name}</div>
    </div>
  )
}

export const SubTabItem = (props: ITabItem) => {
  const [imgError, setImgError] = useState(false);

  const handleImageOnError = () => {
    setImgError(true);
  };

  const isImgExist = useImageExist(props.imgUrl, props.defIcon)

  return (
    <div
      onClick={props.onClick}
      className={cx(`rounded-[100px] text-base w-auto h-[28px] lg:h-[40px] mr-3 p-1 lg:py-2.5 lg:px-4 `,
        "flex flex-row justify-center items-center",
        "text-xs lg:text-sm text-white",
        "font-normal",
        "whitespace-nowrap",
        {
          'bg-[var(--grayscale-30)] border-[var(--state-warn-main)] border-solid border': props.active,
          'bg-[var(--grayscale-20)]]]': !props.active,
          'min-w-[72px]': isImgExist || props.name === 'All',
          'min-w-auto px-4': !isImgExist && props.name !== 'All'
        },
        props.className
      )}
    >
      {
        props.name === "All" 
          ? props.name
          : props.imgUrl && (!imgError) 
            ? (
              <CacheImage
                alt={'img'}
                src={props.imgUrl}
                className={'w-[40px] h-[20px]'}
                onError={(e) => {
                  handleImageOnError()
                }}
              >
                {props.name}
              </CacheImage>
              // <img className='w-[64px] h-[32px] ' src={props.imgUrl} alt='img' onError={handleImageOnError}/>
            )
            : props.name
      }

    </div>
  )
}
