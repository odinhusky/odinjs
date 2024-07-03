import cx from "../../../../utils/cx";


type IMobileRecordItem = {
    title: string,
    value: string,
    className?: string,
    valueClassName?: string
}

export const MobileRecordItem = (props: IMobileRecordItem) => {
    return (
        <section className={cx(
            'p-2 flex justify-between gap-x-0.5',
            props.className
        )}>
            <p>{props.title}</p>
            <p className={cx(
                'text-[var(--grayscale-100)]',
                props.valueClassName
            )}>{props.value}</p>
        </section>
    )
}