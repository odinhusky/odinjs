import { cx } from '@libs/commonUtils';
import Modal from '@mode2/components/Modal';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/Icon';
import { formatMoney } from '@mode2/utils';
import sdkUtils from '@mode2/utils/sdk';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useInviteWheelRuleModalStore } from '@mode2/zustand/page/inviteWheelPageStore';
import { useEffect, useState } from 'react';

const rules = [
  {
    i18nKey: 'spin_and_share_wheel_rules_1',
    i18nOption: { value: formatMoney(500) },
  },
  {
    i18nKey: 'spin_and_share_wheel_rules_2',
  },
  {
    i18nKey: 'spin_and_share_wheel_rules_3',
  },
  {
    i18nKey: 'spin_and_share_wheel_rules_4',
  },
  {
    i18nKey: 'spin_and_share_wheel_rules_5',
  },
  {
    i18nKey: 'spin_and_share_wheel_rules_6',
  },
  {
    i18nKey: 'spin_and_share_wheel_rules_7',
    i18nOption: { productName: sdkUtils.productName() },
  },
];

export const InviteWheelRuleModal = () => {
  const { t } = useTranslation();

  const isDisplay = useInviteWheelRuleModalStore((state) => state.isDisplay);
  const dismissInviteWheelRuleModal = useInviteWheelRuleModalStore(
    (state) => state.dismissInviteWheelRuleModal
  );

  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(isDisplay);
    }, 0);
  }, [isDisplay]);

  return show ? (
    <Modal className={'p-4'}>
      <div
        className={cx(
          'w-full h-full max-w-[408px] max-h-[420px] m-4',
          'bgi-border-[var(--base-1-main)]',
          'border-[3px] rounded-[12px]',
          'font-medium text-lg ',
          'bgi-text-[var(--grayscale-100)]',
          'bgi-[var(--base-2-variant11)]',
          'shadow-lg'
          // {
          //   'animate__animated animate__fadeInUp ': isDisplay,
          //   'animate__animated animate__fadeOutDown': !isDisplay,
          // }
        )}
      >
        <div className="flex justify-between p-4">
          <p>{t('earn_invite_rewards_rules_page_title')}</p>
          <Icon
            className={'w-6 h-6 cursor-pointer'}
            name={'ic_close'}
            onClick={() => {
              dismissInviteWheelRuleModal();
            }}
          />
        </div>
        <div className={'w-full h-px bgi-[var(--transparent-white-10)]'} />

        <div
          className={cx(
            'p-4 h-full max-h-[320px] overflow-y-auto',
            'font-normal text-sm'
          )}
        >
          {rules.map((item, index) => {
            return (
              <p key={index} className={cx('numbered-item')}>
                {renderI18N(item, t)}
              </p>
            );
          })}
        </div>
      </div>
    </Modal>
  ) : null;
};

export default InviteWheelRuleModal;
