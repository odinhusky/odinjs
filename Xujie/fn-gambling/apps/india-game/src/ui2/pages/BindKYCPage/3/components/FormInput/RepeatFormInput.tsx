import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Form from '@mode2/components/Form';
import { cx } from '@libs/commonUtils';
import Input from '@mode2/components/Input';
import { RepeatFormInputProps } from './index';
import { InputType } from '@libs/components/Input';

export const RepeatFormInput = ({
  label,
  name,
  isRequired,
  validatorRepeat,
  repeatValue,
  isVisible = true,
  isDisabled = false,
  placeholder,
  formItemProps = {},
  ...props
}: RepeatFormInputProps) => {
  const { t } = useTranslation();
  const [isFocus, setFocus] = useState(false);
  const [isValidator, setValidator] = useState(true);

  return (
    <Form.Item
      className={'kyc_input mt-3'}
      label={
        <span className={cx('bgi-text-[var(--grayscale-100)] text-sm', 'mb-1')}>
          {typeof label === 'string'
            ? label
            : t(label.i18nKey, label?.i18nOption)}
        </span>
      }
      name={name}
      labelCol={{ span: 24 }} // label 佔滿一整行
      wrapperCol={{ span: 24 }} // Input 佔滿一整行
      getValueFromEvent={(args) => {
        validatorRepeat(args)
          ?.then(() => {
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
                validator: (_, value: string) => validatorRepeat(value),
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
        onFocus={(e) => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
        {...props}
        type={props.type as InputType}
        styles={{
          containerDiv: cx('bgi-border-[var(--base-2-variant2)] rounded-sm', {
            'bgi-border-[var(--state-error-main2)]': !isValidator,
            'bgi-border-[var(--state-success-main2)]': isFocus && isValidator,
          }),
        }}
      />
    </Form.Item>
  );
};
