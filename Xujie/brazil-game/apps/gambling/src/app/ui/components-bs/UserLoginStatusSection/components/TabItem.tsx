import cx from 'classnames';

type ITabItem = {
  active: boolean;
  name: string;
  onClick: () => void;
  className?: string;
}

export const TabItem = (props: ITabItem) => {

  return (

    <div
      onClick={props.onClick}
      className={cx(`rounded-lg`,
        "flex flex-row justify-center items-center",
        "text-sm font-bold",
        "py-[10px]",
        "whitespace-nowrap",
        "flex-1",
        "cursor-pointer",
        {
          'text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--primary-main)]': props.active,
          'bg-[--grayscale-20] text-[rgba(255,255,255,1)]': !props.active
        },
        props.className
      )}
    >
      <div>{props.name}</div>
    </div>
  )
}

