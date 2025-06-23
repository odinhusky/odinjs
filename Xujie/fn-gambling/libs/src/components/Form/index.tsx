import React from 'react';
import cx from '@commonUtils/cx';
import { Form as BaseForm, FormProps as BaseFormProps } from 'antd';
import { PropsWithChildren } from 'react';
import debounce from 'lodash/debounce';
type FormProps<Values extends Record<string, unknown>> = PropsWithChildren<
  BaseFormProps<Values>
>;

function Form<Values extends Record<string, unknown>>({
  debounceTimer = 500,
  ...props
}: FormProps<Values> & {
  debounceTimer?: number;
}) {
  const { className, onFinish, onFinishFailed, ...rest } = props;

  const handleFinish = debounce(
    (props: Values) => onFinish?.(props),
    debounceTimer
  );
  const handleFinishFailed = debounce((errorInfo) => {
    onFinishFailed?.(errorInfo);
  }, debounceTimer);
  return (
    <BaseForm<Values>
      className={cx('mode-form', className)}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      {...rest}
    />
  );
}

Form.useForm = BaseForm.useForm;
Form.useFormInstance = BaseForm.useFormInstance;
Form.useWatch = BaseForm.useWatch;
Form.Item = BaseForm.Item;
Form.List = BaseForm.List;
Form.ErrorList = BaseForm.ErrorList;
Form.Provider = BaseForm.Provider;

export default Form;
export type { FormProps };
