import Form from '@libs/mode2/components/Form';
import Input from '@libs/mode2/components/Input';
import { FormValues } from '..';
import { FormInstance } from 'antd';
import { Rule } from 'antd/es/form';
import { t } from 'i18next';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';

interface IFormInputProps {
  name: string;
  title: I18NContent;
  value: string;
  placeholder: I18NContent;
  containerDiv?: string;
  onChange: (value: string) => void;
  onValidator?: (rule: Rule, value: string) => Promise<void>;
  form: FormInstance<FormValues>;
  classNameObj?: {
    title?: string;
    point?: string;
  };
}

const FormInput = (props: IFormInputProps) => {
  const {
    form,
    name,
    title,
    value,
    placeholder,
    containerDiv,
    onChange,
    onValidator,
  } = props;

  return (
    <Form.Item
      className="m-0  tablet:pb-6 mobile:pb-5 pb-4"
      name={name}
      rules={[
        {
          validator: onValidator
            ? onValidator
            : (_, value) => {
                if (!value) {
                  return Promise.reject(t('toast_password_cannot_be_empty'));
                }
                if (value.length < 4) {
                  return Promise.reject(t('toast_password_hint'));
                }
                return Promise.resolve();
              },
        },
      ]}
    >
      <>
        <div
          className={cx(
            'title',
            'text-base font-semibold leading-6',
            'mb-1',
            'bgi-text-[var(--grayscale-100)]',
            props?.classNameObj?.title
          )}
        >
          {renderI18N(title, t)}
          <span
            className={cx(
              'point',
              'bgi-text-[var(--state-error-main)]',
              props?.classNameObj?.point
            )}
          >
            *
          </span>
        </div>
        <Input
          type={name === 'currentPassword' ? 'no_rules_password' : 'password'}
          maxLength={name === 'currentPassword' ? undefined : 13}
          placeholder={placeholder}
          styles={{
            containerDiv: containerDiv,
          }}
          value={value}
          onChange={(e) => {
            onChange && onChange(e);
            form.setFieldsValue({ [name]: e });
          }}
        />
      </>
    </Form.Item>
  );
};
export default FormInput;
