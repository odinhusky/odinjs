import cx from "classnames";

interface IRedeemableButton {
    text: string,
    className: string;
    disabled: boolean;
    onClick?: () => void;
}

export const ActivityRedeemableButton = (props: IRedeemableButton) => {
    const {text, className, disabled, onClick} = props;
    return (
        <button
            className={cx('', className)}
            disabled={disabled}
            onClick={onClick && onClick}
        >
            {text}
        </button>
    )
}