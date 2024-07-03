import cx from 'classnames';

type IPhonePrefix = {
  className?: string;
}

export const PhonePrefix = (props: IPhonePrefix) => {
  return (
    <span className={cx("text-[var(--input-text-color)] mr-2 leading-[24px] text-sm md:text-xl", props.className)}>+55</span>
  )
}
