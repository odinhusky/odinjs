import React from 'react';
import Form from '@libs/mode2/components/Form';
import Input from '@libs/mode2/components/Input';
import { Rule } from 'antd/es/form';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { InputProps } from '../Input';
import { useTranslation } from 'react-i18next';

type TInput = 'styles' | 'maxLength' | 'suffix' | 'prefix' | 'type';
interface IFormInputProps extends Pick<InputProps, TInput> {
  name: string;
  title?: I18NContent; // Form.Item.Label
  value?: string;
  placeholder: I18NContent;
  required: boolean;
  isShowStar: boolean;
  onChange: (value: string) => void;
  onValidator?: (rule: Rule, value: string) => Promise<void>;
  classNameObj?: {
    title?: string;
    point?: string;
  };
}

const FormInput = (props: IFormInputProps) => {
  const { t } = useTranslation();

  const { name, title, onValidator } = props;

  return (
    <Form.Item
      className="m-0"
      name={name}
      rules={
        props.required
          ? [
              {
                validator: onValidator
                  ? onValidator
                  : (_, value) => {
                      if (!value) {
                        return Promise.reject(
                          t('toast_password_cannot_be_empty')
                        );
                      }
                      if (value.length < 4) {
                        return Promise.reject(t('toast_password_hint'));
                      }
                      return Promise.resolve();
                    },
              },
            ]
          : []
      }
    >
      <div>
        {title ? (
          <div
            className={cx(
              'text-base font-semibold',
              'mb-1',
              'bgi-text-[var(--grayscale-100)]',
              props?.classNameObj?.title
            )}
          >
            {renderI18N(title, t)}
            {props.isShowStar ? (
              <span
                className={cx(
                  'bgi-text-[var(--state-error-main)]',
                  props?.classNameObj?.point
                )}
              >
                *
              </span>
            ) : null}
          </div>
        ) : null}

        <Input
          // 需要時再添加
          placeholder={props.placeholder}
          onChange={props.onChange}
          styles={props.styles}
          value={props.value}
          prefix={props.prefix}
          suffix={props.suffix}
          type={props.type}
          maxLength={props.maxLength}
        />
      </div>
    </Form.Item>
  );
};
export default FormInput;
