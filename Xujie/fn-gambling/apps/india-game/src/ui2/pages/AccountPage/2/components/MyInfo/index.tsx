import Avatar from '@components/Avatar';
import Icon from '@components/Icon';
import RedDot from '@components/RedDot';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import useAccountPageAction from '@libs/mode2/action/accountPageAction/useAccountPageAction';
import {
  handleAccountPageCopyClick,
  handleAccountPageShowBindPlayerPhoneModalClick,
  handleAccountPageShowModalClick,
} from '@mode2/action/actionTypes';
import { AccountPageModalTitleTypes } from '@libs/mode2/zustand/page/accountPageStore';
import { showMyModifyModal } from '@modals/MyModifyModal';
import useMyPageActions from '@libs/mode2/action/myPageAction/useMyPageActions';
import { useTranslation } from 'react-i18next';
import { maskNumbers } from '@libs/mode2/utils';

const Item = ({
  label,
  value,
  isShowIconRight,
  isShowRedDot,
  iconRightName,
  onClick,
}: {
  label: string;
  value: JSX.Element;
  isShowIconRight: boolean;
  isShowRedDot: boolean;
  iconRightName?: string;
  onClick?: () => void;
}) => {
  const rowClassName =
    FLEX_ITEMS_CENTER +
    ' px-5 py-3 box-border border-b border-[var(--transparent-white-10)] justify-between bgi-text-[var(--base-2-variant2)] cursor-pointer';
  const rightClassName = FLEX_ITEMS_CENTER + ' bgi-text-[var(--grayscale-100)]';
  const iconRightClassName = 'w-4 h-4 ml-2';
  const redDotClassName = 'w-2 h-2 absolute left-0 -top-3';

  return (
    <div className={cx(rowClassName)} key={label}>
      <div className="">{label}</div>
      <div
        className={cx(rightClassName)}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
      >
        {value}

        {!isShowRedDot && isShowIconRight ? (
          <Icon
            name={iconRightName || 'ic_arrow_right_3'}
            className={cx(iconRightClassName)}
          />
        ) : null}
        {isShowRedDot ? (
          <div className="relative">
            <RedDot className={cx(redDotClassName)} />
            <Icon name="ic_arrow_right_3" className={cx(iconRightClassName)} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const MyInfo = () => {
  const { t } = useTranslation();
  const { handleAccountPageClick } = useAccountPageAction();
  const { handleMyPageClick } = useMyPageActions();
  const displayUserName = useUserProfileStore((state) => state.displayUserName);
  const id = useUserProfileStore((state) => state.id);
  const realPhone = useUserProfileStore((state) => state.realPhone);
  const referralCode = useUserProfileStore((state) => state.referralCode);
  const bindReferralCode = useUserProfileStore(
    (state) => state.bindReferralCode
  );
  const gender = useUserProfileStore((state) => state.gender);
  const hasSetPassword = useUserProfileStore((state) => state.hasSetPassword);

  const titleClassName =
    'py-3 px-5 border-b border-[var(--transparent-white-10)]';

  const list = [
    {
      type: t('profile_my_info_user_info'),
      children: [
        {
          label: t('profile_my_info_avatar'),
          value: (
            <Avatar
              rootClassName="!w-10 !h-10"
              className="!w-10 !h-10 rounded-full"
              isShowVIP={false}
            />
          ),
          isShowIconRight: true,
          isShowRedDot: false,
          onClick: () => {
            showMyModifyModal({
              handleMyPageClick,
            });
          },
        },
        {
          label: 'Player ID',
          value: <span>{id.toString()}</span>,
          isShowIconRight: false,
          isShowRedDot: false,
        },
        {
          label: t('profile_my_info_nickname'),
          value: <span>{displayUserName}</span>,
          isShowIconRight: true,
          isShowRedDot: false,
          onClick: () => {
            handleAccountPageClick({
              actionName: handleAccountPageShowModalClick,
              payload: { value: AccountPageModalTitleTypes.NICKNAME },
            });
          },
        },
        {
          label: t('profile_my_info_gender'),
          value: <span>{gender}</span>,
          isShowIconRight: true,
          isShowRedDot: false,
          onClick: () => {
            handleAccountPageClick({
              actionName: handleAccountPageShowModalClick,
              payload: { value: AccountPageModalTitleTypes.GENDER },
            });
          },
        },
        {
          label: t('profile_my_info_my_invitation_code'),
          value: <span>{referralCode}</span>,
          isShowIconRight: true,
          isShowRedDot: false,
          iconRightName: 'ic_copy_2',
          onClick: () => {
            handleAccountPageClick({
              actionName: handleAccountPageCopyClick,
              payload: { value: referralCode },
            });
          },
        },
      ],
    },
    {
      type: t('profile_my_info_other'),
      children: [
        {
          label: t('profile_my_info_bind_phone_number'),
          value: (
            <span>
              {maskNumbers(realPhone) ||
                t('profile_my_info_bind_phone_number_unbound')}
            </span>
          ),
          isShowIconRight: !realPhone,
          isShowRedDot: !realPhone,
          onClick: () => {
            if (!realPhone) {
              handleAccountPageClick({
                actionName: handleAccountPageShowBindPlayerPhoneModalClick,
              });
            }
          },
        },
        {
          label: t('profile_my_info_login_password'),
          value: (
            <span>
              {hasSetPassword
                ? '*******'
                : t('profile_my_info_login_password_no_set')}
            </span>
          ),
          isShowIconRight: true,
          isShowRedDot: !hasSetPassword,
          onClick: () => {
            handleAccountPageClick({
              actionName: handleAccountPageShowModalClick,
              payload: { value: AccountPageModalTitleTypes.PASSWORD },
            });
          },
        },
        {
          label: t('profile_my_info_bind_invitation_code'),
          value: (
            <span>
              {bindReferralCode ||
                t('profile_my_info_bind_invitation_code_not_link')}
            </span>
          ),
          isShowIconRight: !bindReferralCode,
          isShowRedDot: !bindReferralCode,
          onClick: () => {
            if (!bindReferralCode) {
              handleAccountPageClick({
                actionName: handleAccountPageShowModalClick,
                payload: { value: AccountPageModalTitleTypes.INVITE_CODE },
              });
            }
          },
        },
      ],
    },
  ];

  return (
    <div className="my-3 box-border text-base bgi-text-[var(--grayscale-100)] h-full bgi-[var(--background-dark)]">
      {list.map((item) => {
        return (
          <div key={item.type}>
            <div className={cx(titleClassName)}>{item.type}</div>
            {item.children.map((item, index) => (
              <Item key={index} {...item} />
            ))}
          </div>
        );
      })}
    </div>
  );
};
