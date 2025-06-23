import { cx } from '@libs/commonUtils';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import Form from '@mode2/components/Form';
import Input from '@mode2/components/Input';
import { InputProps } from 'antd';
import { Rule } from 'antd/es/form';
import { useTranslation } from 'react-i18next';
import './index.scss';
import { useState } from 'react';
import { RepeatFormInput } from './RepeatFormInput';
import type { FormItemProps } from 'antd/es/form';
import { InputType } from '@libs/components/Input';

export interface FormInputProps
  extends Pick<InputProps, 'onInput' | 'type' | 'maxLength'> {
  label: I18NContent; // 欄位 title
  name: string; // input 的欄位名稱，決定最後 value 的欄位 keyName
  isRequired?: boolean;
  rules?: Rule[] | undefined;
  validator: (value: string) => Promise<void> | undefined;
  placeholder?: I18NContent;
  tip?: I18NContent;
  isVisible?: boolean; // 是否看得見，但欄位還是存在在表單中
  isDisabled?: boolean; // 是否 disabled
  classNameObj?: {
    container?: string;
  };
  repeatProps?: RepeatFormInputProps;
  formItemProps?: FormItemProps;
}

export interface RepeatFormInputProps extends FormInputProps {
  triggerDisplay?: 'focus' | 'validator';
  repeatValue: string;
  validatorRepeat: (value: string) => Promise<void> | undefined;
}

export const FormInput = ({
  label,
  name,
  validator,
  isRequired,
  tip,
  isVisible = true,
  isDisabled = false,
  placeholder,
  classNameObj,
  repeatProps,
  formItemProps = {},
  ...props
}: FormInputProps) => {
  const { t } = useTranslation();

  const [isDisplayRepeatInput, setDisplayRepeatInput] = useState(false);

  const [isFocus, setFocus] = useState(false);
  const [isValidator, setValidator] = useState(true);

  const [repeatValue, setRepeatValue] = useState('');

  return (
    <div className={cx(classNameObj?.container)}>
      <Form.Item
        className={'kyc_input'}
        label={
          <span
            className={cx('bgi-text-[var(--grayscale-100)] text-sm', 'mb-1')}
          >
            {typeof label === 'string'
              ? label
              : t(label.i18nKey, label?.i18nOption)}
          </span>
        }
        name={name}
        labelCol={{ span: 24 }} // label 佔滿一整行
        wrapperCol={{ span: 24 }} // Input 佔滿一整行
        getValueFromEvent={(args) => {
          if (typeof args === 'string' && repeatProps) {
            setRepeatValue(args);
          }
          validator(args)
            ?.then(() => {
              if (repeatProps && repeatProps?.triggerDisplay === 'validator') {
                setDisplayRepeatInput(true);
              }
              setValidator(true);
            })
            .catch(() => {
              setValidator(false);
            });
          return args;
        }}
        rules={
          isRequired
            ? [
                {
                  required: true,
                  validator: (_, value: string) => validator(value),
                },
              ]
            : []
        }
        style={{
          visibility: isVisible ? 'visible' : 'hidden',
          height: isVisible ? 'auto' : '0px',
          opacity: isVisible ? 1 : 0,
          marginBottom: isVisible ? '0px' : '24px',
        }} // 使用 visibility: hidden 來控制可見性
        {...formItemProps}
      >
        <Input
          disabled={isDisabled}
          placeholder={placeholder}
          {...props}
          type={props.type as InputType}
          onFocus={(e) => {
            setFocus(true);
            if (repeatProps && repeatProps?.triggerDisplay === 'focus') {
              setDisplayRepeatInput(true);
            }
          }}
          onBlur={() => {
            setFocus(false);
          }}
          styles={{
            containerDiv: cx('bgi-border-[var(--base-2-variant2)] rounded-sm', {
              'bgi-border-[var(--state-error-main2)]': !isValidator,
              'bgi-border-[var(--state-success-main2)]': isFocus && isValidator,
            }),
          }}
        />
      </Form.Item>

      {repeatProps && isDisplayRepeatInput ? (
        <RepeatFormInput {...repeatProps} repeatValue={repeatValue} />
      ) : null}
    </div>
  );
};

export default FormInput;
