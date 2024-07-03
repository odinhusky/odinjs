import { useEffect, useState } from 'react';
import { renderByUVersion } from '../../utils/renderByUVersion';
import { InputSection } from './InputSection';
import cx from '../../utils/cx';

export type IInput = {
  prefix?: React.ReactNode;
  focusPrefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: string;
  inputmode?:
    | 'search'
    | 'text'
    | 'email'
    | 'tel'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
    | undefined;
  placeholder?: string;
  value?: string;
  inputOuterClassName?: string;
  className?: string;
  inputClassName?: string;
  inputStyle?: React.CSSProperties | undefined;
  errorMessageClassName?: string;
  focusStyle?: string;
  errorStyle?: string;
  focusClassName?: string;
  inputFocusClass?: string;
  errorClassName?: string;
  themeStyle?: 'normal' | 'simple';
  children?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validation?: boolean;
  errorMessage?: string;
  outerSuffix?: React.ReactNode;
  pureContainer?: boolean;
  disable?: boolean;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  readonly?: boolean;
  disableReadOnlyAfterRender?: boolean;
};

const BaseInput = (props: IInput) => {
  // const inputRef = useRef();
  const [focus, setFocus] = useState(false);
  const [readonly, setReadOnly] = useState(props.readonly);
  const isPureContainer =
    typeof props.pureContainer == 'undefined' ? false : props.pureContainer;
  const isDisable =
    typeof props.disable === 'undefined' ? false : props.disable;
  // console.log("isDisable props.placeholder", isDisable, props.placeholder);

  useEffect(() => {
    const disableReadOnly = () => {
      if (props.disableReadOnlyAfterRender) {
        setReadOnly(false);
      }
    };

    const timerId = setTimeout(disableReadOnly, 500);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      className={cx(
        {
          'mb-3 md:mb-4': !isPureContainer,
        },
        props.inputOuterClassName
      )}
    >
      <div className={'flex flex-row justify-center items-center h-full'}>
        <InputSection
          focus={focus}
          onClick={() => {
            // (inputRef && inputRef.current as any).focus()
          }}
          className={cx(
            'w-full flex items-center flex-grow',
            {
              'border-utils-gray': props.themeStyle === 'simple',
            },
            props.className
          )}
          focusStyle={props.focusStyle}
          errorStyle={props.errorStyle}
          focusClassName={props.focusClassName}
          errorClassName={props.errorClassName}
          validation={props.validation}
        >
          {focus && props.focusPrefix ? props.focusPrefix : props.prefix}
          {props.children ? (
            props.children
          ) : (
            <input
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={props.onKeyDown}
              // ref={inputRef as any}
              onClick={() => props.onClick && props.onClick()}
              className={cx(
                `w-full bg-transparent text-sm text-[var(--input-text-color)] placeholder:text-[var(--input-placeholder-color)] focus:outline-none ${
                  isDisable ? 'select-none' : ''
                } ${props.inputClassName}`,
                `${focus ? props.inputFocusClass : ''}`
              )}
              style={props.inputStyle}
              type={props.type || 'text'}
              inputMode={props.inputmode}
              placeholder={props.placeholder}
              value={isDisable ? '' : props.value}
              onFocus={() => {
                if (!isDisable) setFocus(true);
              }}
              onBlur={() => {
                if (!isDisable) setFocus(false);
              }}
              onChange={(event: any) => {
                if (!isDisable) props.onChange && props.onChange(event);
              }}
              readOnly={readonly}
            />
          )}
          {props.suffix}
        </InputSection>
        {props.outerSuffix}
      </div>
      {props.validation === false && (
        <div
          className={cx(
            'text-left text-[var(--input-invalidation-text-color)] text-sm leading-5 pt-1',
            props.errorMessageClassName
          )}
        >
          {props.errorMessage}
        </div>
      )}
    </div>
  );
};

export type InputValue<T> = {
  data: T;
  isValidation?: boolean;
  errorMessage?: string;
};

export const Input = renderByUVersion(
  {
    u1: BaseInput,
    wild777bet: BaseInput,
    u2: BaseInput,
  },
  BaseInput
);
