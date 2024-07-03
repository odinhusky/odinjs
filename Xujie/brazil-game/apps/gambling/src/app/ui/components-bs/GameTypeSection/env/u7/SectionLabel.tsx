import cx from "../../../../utils/cx";

type ISectionLabel = {
    label?: string;
    className?: string;
    iconSrc?: string;
    iconClassName?: string;
}
export const SectionLabel = (props: ISectionLabel) => {
    const {label, className} = props;
    return (
        <div
            className={cx(
                'flex flex-row justify-center items-center text-linear font-bold text-lg',
                className,
            )}
        >
            <div>{label ? label : ''}</div>
        </div>
    )
}