import React from 'react';
import './index.scss';
import { InputHTMLAttributes, useState } from 'react';
import { cx } from '@libs/commonUtils';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { useTranslation } from 'react-i18next';
import renderI18N from '@libs/commonUtils/renderI18N';
// import { preventZoom } from '@libs/mode2/utils';

const inputLimitTransfer = (props: InputProps) => {
  return {
    ...props,
    // inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined;
    // 依照 props.type 給不同 inputMode ，會直接影響手機軟件盤出現樣式
    inputMode:
      props.type === 'number' ? ('numeric' as const) : ('text' as const),
    // type == number， 由 onInput 控制限制輸入條件，改寫 type:'text'，不給 'number' 給 'number' 有些數學符號，會計符號等等...，會打破限制 [+-*/,] 等等
    type:
      props.type === 'number'
        ? 'text'
        : props.type === 'no_rules_password'
        ? 'password'
        : props.type === 'en_name'
        ? 'text'
        : props.type || 'text',

    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        props.type === 'number' &&
        (event?.key === 'e' || event?.key === 'E')
      ) {
        event?.preventDefault();
      }
    },
    onInput: (event: React.FormEvent<HTMLInputElement>) => {
      if (event?.currentTarget?.value) {
        const value = event.currentTarget.value;
        if (props.type === 'password') {
          //只允许输入字母和数字
          event.currentTarget.value = value.replace(/[^a-zA-Z0-9]/g, '');
        } else if (props.type === 'number') {
          //只允许输入数字
          event.currentTarget.value = value.replace(/[^0-9]/g, '');
        } else if (props.type === 'en_name') {
          event.currentTarget.value = value.replace(/[^a-z|A-Z\s]/g, '');
        } else if (props.type === 'en_alnum_with_space') {
          event.currentTarget.value = value.replace(/[^a-zA-Z0-9\s]/g, '');
        } else if (props.type !== 'text') {
          //不只允许中文字
          event.currentTarget.value = value.replace(/[\u4e00-\u9fa5]/g, '');
        }

        // 最大長度限制
        if (props.maxLength && props.maxLength > 0) {
          event.currentTarget.value = String(event.currentTarget.value).slice(
            0,
            props.maxLength
          );
        }
      }

      props.onInput?.(event);
    },
    onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Check if the key is not a digit
      if (props.type === 'number') {
        if (!/^\d$/.test(event.key)) {
          event.preventDefault();
        }
      }
    },
  };
};

export type InputType =
  | 'text'
  | 'password'
  | 'number'
  | 'no_rules_password'
  | 'en_name'
  | 'en_alnum_with_space';

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'prefix' | 'placeholder'
  > {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  outerSuffix?: React.ReactNode;
  type?: InputType;
  placeholder?: I18NContent;
  error?: Error | undefined;
  value?: string;
  onChange?: (value: string) => void;
  prefixNum?: string;
  prefixClassName?: string;
  prefixRegionClassName?: string;
  maxLength?: number;
  minLength?: number;

  styles?: {
    container?: string;
    containerDiv?: string;
    inputBox?: string;
    input?: string;
    inputPrefix?: string;
  };
}

const BaseInput = (inputProps: InputProps) => {
  const { t } = useTranslation();
  const [focus, setFocus] = useState(false);
  const {
    prefix,
    suffix,
    outerSuffix,
    type,
    placeholder,
    error,
    value = '',
    onChange,
    styles,
    ...props
  } = inputLimitTransfer(inputProps);
  return (
    <div className={cx('mode-input', styles?.container)}>
      <div
        className={cx(
          'input-container-div',
          {
            'bgi-[var(--grayscale-15)]': props?.disabled === true,
            'bgi-[var(--grayscale-30)]': props?.disabled !== true,
          },
          styles?.containerDiv
        )}
      >
        <div
          className={cx(
            `input-box ${error ? 'error' : focus ? 'focus' : ''}`,
            styles?.inputBox
          )}
        >
          {prefix && (
            <div className={cx('input-prefix', styles?.inputPrefix)}>
              {prefix}
            </div>
          )}
          <input
            type={type || 'text'}
            {...props}
            className={styles?.input}
            onWheel={(e) => e.currentTarget.blur()}
            placeholder={placeholder ? renderI18N(placeholder, t) : undefined}
            value={value}
            onFocus={(event) => {
              props.onFocus?.(event);
              setFocus(true);
              // preventZoom(true);
            }}
            onBlur={(event) => {
              props.onBlur?.(event);
              setFocus(false);
              // preventZoom(false);
            }}
            onChange={(event) => {
              onChange?.(event.target.value);
            }}
            onInput={(event) => {
              props.onInput?.(event);
            }}
            onKeyPress={(event) => {
              props.onKeyPress?.(event);
            }}
            onKeyDown={(event) => {
              props.onKeyDown?.(event);
            }}
          />
          {suffix && <div className="input-suffix">{suffix}</div>}
        </div>
      </div>
      {outerSuffix}
    </div>
  );
};

export default BaseInput;
