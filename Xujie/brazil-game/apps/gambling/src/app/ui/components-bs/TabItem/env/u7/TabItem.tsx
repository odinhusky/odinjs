import cx from 'classnames';
import { SyntheticEvent } from 'react';
import { CacheImage } from '../../../../components/image/CacheImage';

type ITabItem = {
  imgUrl?: string;
  active: boolean;
  icon?: string;
  name: string;
  onClick: () => void;
  className?: string;
  defIcon?: string;
  activeClassName?: string;
};

export const TabItem = (props: ITabItem) => {
  const iconSrc = props?.icon || '';
  const defIconSrc = props?.defIcon || '';
  return (
    <div
      onClick={props.onClick}
      className={cx(
        'flex flex-row justify-center items-center',
        'whitespace-nowrap',
        'flex-1',
        'cursor-pointer',
        {
          'py-2.5 px-4': props?.icon !== undefined,
          'mobile:py-2 mobile:px-5 py-2 px-4': props?.icon === undefined,
          [`bg-[var(--grayscale-30)] border-[var(--state-warn-main)] border-solid border ${props.activeClassName}`]:
            props.active,
          'bg-[var(--grayscale-20)': !props.active,
        },
        props.className
      )}
    >
      {iconSrc && (
        <CacheImage
          alt={'tab-icon'}
          src={iconSrc}
          defSrc={defIconSrc}
          className={'w-[16px] lg:w-[20px] mr-2'}
          onError={(e: SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.style.visibility = 'hidden';
            e.currentTarget.style.width = '0px';
          }}
        />
      )}
      <div>{props.name}</div>
    </div>
  );
};
