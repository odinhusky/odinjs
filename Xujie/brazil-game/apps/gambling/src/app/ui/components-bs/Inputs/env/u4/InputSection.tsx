import { cx } from "../../../../utils/cx";

type TInputSection = {
  focus?: boolean;
  validation?: boolean;
  className?: string;
  focusClassName?: string;
  errorClassName?: string
  children?: React.ReactNode;
}

export const InputSection = (props: TInputSection) => {
  return (
    <div className={cx(
      'px-4 box-border rounded-lg bg-surface-default transition ease-linear',
      props.className,
      `${props.focus && props.validation !== false ? props.focusClassName : ''}`,
      `${props.validation === false ? props.errorClassName : ''}`,
    )}>
      {props.children}
    </div>
  )
}
