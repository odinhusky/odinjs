import WeakTipsModal from '@modals/WeakTipsModal';
import { I18NContent } from '@mode2/@types/i18nType';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/Icon';
import renderI18N from '@commonUtils/renderI18N';
import { InitialValuesTypes } from '@/zustand/kyc/useKycDisplayStore';
import InfoHint from '@components/InfoHint';

const ConfirmItem = ({
  prefixIcon,
  title,
  content,
}: {
  prefixIcon: string;
  title: I18NContent;
  content: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full flex justify-start items-start gap-2">
      {prefixIcon ? (
        <Icon className="w-[18px] h-[18px]" name={prefixIcon} />
      ) : null}

      <div className="font-medium">
        <p className="bgi-text-[var(--base-2-variant1)] text-sm">
          {renderI18N(title, t)}
        </p>
        <p className="bgi-text-[var(--grayscale-100)] text-base mt-1">
          {content}
        </p>
      </div>
    </div>
  );
};
const ConfirmInfo = (props: BindKYCConfirmProps) => {
  const { t } = useTranslation();
  const items = [
    {
      prefixIcon: 'ic_member_outline',
      title: {
        i18nKey: 'withdrawal_bank_account_account_holder_name_linked',
      },
      content: props?.values?.realName || '',
    },
    {
      prefixIcon: 'ic_account_number',
      title: { i18nKey: 'withdrawal_bank_account_account_number_linked' },
      content: props?.values?.bankCode || '',
    },
    {
      prefixIcon: 'ic_ifsc',
      title: { i18nKey: 'withdrawal_bank_account_ifsc_linked' },
      content: props?.values?.ifsc || '',
    },
  ];
  return (
    <div>
      <div className="bgi-border-[var(--transparent-white-20)] rounded-lg border py-6 px-5">
        {items.map((item, index) => {
          return <ConfirmItem key={index} {...item} />;
        })}
      </div>
      <InfoHint
        hintText={t('withdrawal_bank_account_confirm_again_notice')}
        classNameObj={{
          containerClass: 'mt-8',
          iconClass: 'w-5 h-5',
        }}
      />
    </div>
  );
};

export interface BindKYCConfirmProps {
  isShow: boolean;
  values?: InitialValuesTypes;
  onPrimaryCallback?: () => void;
  onSecondaryCallback?: () => void;
  onCloseCallback?: () => void;
}

export const BindKYCConfirmModal = (props: BindKYCConfirmProps) => {
  const { t } = useTranslation();
  return (
    <WeakTipsModal
      isShow={props.isShow}
      isShowClose={true}
      isShowDivider={true}
      title={t('withdrawal_bank_account_confirm_again_title')}
      content={<ConfirmInfo {...props} />}
      primaryBtnText={t('withdrawal_bank_account_confirm_again_confirm_button')}
      onPrimaryBtnClick={() => {
        props.onPrimaryCallback?.();
      }}
      secondaryBtnText={t(
        'withdrawal_bank_account_confirm_again_cancel_button'
      )}
      onSecondaryBtnClick={() => {
        props.onSecondaryCallback?.();
      }}
      onClose={() => {
        props.onCloseCallback?.();
      }}
    />
  );
};

export default BindKYCConfirmModal;
