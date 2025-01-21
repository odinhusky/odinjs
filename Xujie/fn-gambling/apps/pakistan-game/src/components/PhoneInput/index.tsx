import { useTranslation } from 'react-i18next';
import Input from '@mode2/components/Input';
import { useState } from 'react';
import { cx } from '@libs/commonUtils';
const PhoneInput = ({
  value,
  styles,
  prefix,
  prefixNum = '03',
  prefixClassName,
  prefixRegionClassName,
  maxLength = 9,
  ...props
}: Parameters<typeof Input>[0]) => {
  const { t } = useTranslation();
  const [showValue, setShowValue] = useState(
    value ? value.slice(2, value.length) : ''
  );

  return (
    <Input
      type="number"
      maxLength={maxLength}
      placeholder={{
        i18nKey: 'sign_up_input_hint_enter_your_mobile_phone',
      }}
      styles={{ inputPrefix: '!mr-6 relative', ...styles }}
      prefix={
        <div className='flex items-center justify-center'>
          <span className={cx('text-base font-medium', prefixClassName)}>{t('common_area_code')}</span>
          <span className={cx("bgi-text-[var(--grayscale-100)] absolute top-1/2 -translate-y-1/2 -right-7 text-base", prefixRegionClassName)}>
            {prefixNum}
          </span>
        </div>
      }
      {...props}
      value={showValue}
      onChange={(newVal) => {
        setShowValue(newVal);
        props.onChange?.(prefixNum + newVal);
      }}
    />
  );
};

export default PhoneInput;
