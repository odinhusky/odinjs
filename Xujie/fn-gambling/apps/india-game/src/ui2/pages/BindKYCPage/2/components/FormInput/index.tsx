import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { InputType } from '@libs/components/Input';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import Form from '@mode2/components/Form';
import Input from '@mode2/components/Input';
import { InputProps } from 'antd';
import { Rule } from 'antd/es/form';
import { useTranslation } from 'react-i18next';

interface FormInputProps
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
  ...props
}: FormInputProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(classNameObj?.container)}>
      <Form.Item
        label={
          <span
            className={cx(
              'bgi-text-[var(--grayscale-100)] font-bold text-base',
              'mb-1'
            )}
          >
            {typeof label === 'string'
              ? label
              : t(label.i18nKey, label?.i18nOption)}
          </span>
        }
        name={name}
        labelCol={{ span: 24 }} // label 佔滿一整行
        wrapperCol={{ span: 24 }} // Input 佔滿一整行
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
      >
        <Input
          disabled={isDisabled}
          placeholder={placeholder}
          {...props}
          type={props.type as InputType}
        />
      </Form.Item>

      {tip && isVisible ? (
        <div
          className={cx(
            'w-full',
            'text-sm',
            'bgi-text-[var(--state-warn-main)]'
            // 'mb-4 mobile:mb-5 tablet:mb-6'
          )}
        >
          {tip ? renderI18N(tip, t) : null}
        </div>
      ) : null}
    </div>
  );
};
