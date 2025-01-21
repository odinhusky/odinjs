import { FormInput } from '../FormInput';
import FormTitle from '../FormTitle';
import { useKycDisplayStore } from '@/zustand/kyc/useKycDisplayStore';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';

interface BindKYCPersonalInfoProps {
  isShowTitle: boolean;
  validator: {
    phone: (value: string) => Promise<void> | undefined;
    username: (value: string) => Promise<void> | undefined;
  };
  isShow?: boolean;
}

export const BindKYCPersonalInfo = ({
  isShowTitle,
  validator,
  isShow = true,
}: BindKYCPersonalInfoProps) => {
  const isDisablePhoneInput = useKycDisplayStore(
    (state) => state.isDisablePhoneInput
  );

  return (
    <div
      className={cx('relative', {
        'invisible h-[0px] opacity-0 z-[-1]': !isShow,
      })}
    >
      {isShowTitle ? (
        <FormTitle title={{ i18nKey: 'leftnav_personal_information' }} />
      ) : null}

      <div className={cx(FLEX_COL, 'gap-4 mobile:gap-5 tablet:gap-6')}>
        {/* Mobile Phone */}
        <FormInput
          type="number"
          maxLength={9}
          label={{ i18nKey: 'account_personal_info_input_title_mobile' }}
          name="phone"
          isRequired={true}
          placeholder={{
            i18nKey: 'mobile must be 9 digits',
          }}
          prefix={
            <div className={cx()}>
              <span className={cx('bgi-text-[var(--grayscale-100)] text-base')}>
                03
              </span>
            </div>
          } // TODO I18N
          validator={validator.phone}
          tip={{ i18nKey: 'account_personal_info_input_mobile_notice' }}
          isDisabled={isDisablePhoneInput}
        />

        {/* Username */}
        <FormInput
          label={{ i18nKey: 'account_personal_info_username' }}
          name="userName"
          isRequired={true}
          placeholder={{
            i18nKey: 'account_personal_info_input_hint_only_fill_and_english',
          }}
          classNameObj={{
            input: cx('!pl-0'),
          }}
          validator={validator.username}
          type={'en_name'}
        />
      </div>
    </div>
  );
};

export default BindKYCPersonalInfo;
