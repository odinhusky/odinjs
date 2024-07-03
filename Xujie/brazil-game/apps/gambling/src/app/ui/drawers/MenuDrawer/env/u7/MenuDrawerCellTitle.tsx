import cx from "../../../../utils/cx";

interface IMenuDrawerCellTitle {
    className?: string;
    title: string
}

export const MenuDrawerCellTitle = (props: IMenuDrawerCellTitle) => {
    return (<div
        className={cx(
            'w-full text-sm font-medium text-[var(--grayscale-100)]',
            props.className
        )}>
        {props.title}
    </div>)
}
