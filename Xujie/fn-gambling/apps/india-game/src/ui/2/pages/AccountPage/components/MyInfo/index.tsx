import Avatar from '@components/Avatar';
import Icon from '@components/Icon';
import RedDot from '@components/RedDot';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { useMode2InviteEarnStore } from '@libs/mode2/zustand/page/invitePageStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import useAccountPageAction from '@libs/mode2/action/accountPageAction/useAccountPageAction';
import {
  handleAccountPageCopyClick,
  handleAccountPageShowModalClick,
} from '@libs/mode2/action/accountPageAction/acitonType';
import {
  AccountPageModalTitleTypes,
  useAccountPageStore,
} from '@libs/mode2/zustand/page/accountPageStore';
import { AccountModal } from './AccountDetailModal';

// TODO i18n
export const MyInfo = () => {
  const { handleAccountPageClick } = useAccountPageAction();
  const nickname = useAccountPageStore((state) => state.nickname);
  const realPhone = useUserProfileStore((state) => state.realPhone);
  const referralInfo = useMode2InviteEarnStore((state) => state.referralInfo);
  const gender = useAccountPageStore((state) => state.gender);

  const titleClassName =
    'py-3 px-5 border-b border-[var(--transparent-white-10)]';
  const rowClassName =
    FLEX_ITEMS_CENTER +
    ' px-5 py-3 box-border border-b border-[var(--transparent-white-10)] justify-between bgi-text-[var(--base-2-variant2)] cursor-pointer';
  const rightClassName = FLEX_ITEMS_CENTER + ' bgi-text-[var(--grayscale-100)]';
  const iconRightClassName = 'w-4 h-4 ml-2';

  return (
    <div className="my-3 box-border text-base bgi-text-[var(--grayscale-100)] h-full bgi-[var(--background-dark)]">
      <div className="">
        <div className={cx(titleClassName)}>User info</div>
        <div className={cx(rowClassName)}>
          <div className="">Avatar</div>
          <div className={cx(rightClassName)}>
            <Avatar className="w-10 h-10 rounded-full" isShowVIP={false} />
            <Icon name="ic_arrow_right_3" className={cx(iconRightClassName)} />
          </div>
        </div>
        <div
          className={cx(rowClassName)}
          onClick={() => {
            handleAccountPageClick({
              actionName: handleAccountPageShowModalClick,
              payload: { value: AccountPageModalTitleTypes.NICKNAME },
            });
          }}
        >
          <div className="">Nickname</div>
          <div className={cx(rightClassName)}>
            <span>{nickname}</span>
            <Icon name="ic_arrow_right_3" className={cx(iconRightClassName)} />
          </div>
        </div>
        <div
          className={cx(rowClassName)}
          onClick={() => {
            handleAccountPageClick({
              actionName: handleAccountPageShowModalClick,
              payload: { value: AccountPageModalTitleTypes.GENDER },
            });
          }}
        >
          <div className="">Gender</div>
          <div className={cx(rightClassName)}>
            <span>{gender}</span>
            <Icon name="ic_arrow_right_3" className={cx(iconRightClassName)} />
          </div>
        </div>
        <div className={cx(rowClassName)}>
          <div className="">My invitation code</div>
          <div
            className={cx(rightClassName)}
            onClick={() => {
              handleAccountPageClick({
                actionName: handleAccountPageCopyClick,
                payload: { value: referralInfo.code },
              });
            }}
          >
            <span>{referralInfo.code}</span>
            <Icon name="ic_copy_2" className={cx(iconRightClassName)} />
          </div>
        </div>
      </div>

      <div className="">
        <div className={cx(titleClassName)}>Other</div>
        <div className={cx(rowClassName)}>
          <div className="">Bind phone number</div>
          <div className={cx(rightClassName)}>
            <span>{realPhone}</span>
            {!realPhone ? (
              <div className="relative">
                <RedDot className="w-2 h-2 absolute left-0 top-0" />
                <Icon
                  name="ic_arrow_right_3"
                  className={cx(iconRightClassName)}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div
          className={cx(rowClassName)}
          onClick={() => {
            handleAccountPageClick({
              actionName: handleAccountPageShowModalClick,
              payload: { value: AccountPageModalTitleTypes.PASSWORD },
            });
          }}
        >
          <div className="">Login password</div>
          <div className={cx(rightClassName)}>
            <span>Not link</span>
            <div className="relative">
              <RedDot className="w-2 h-2 absolute left-0 top-0" />
              <Icon
                name="ic_arrow_right_3"
                className={cx(iconRightClassName)}
              />
            </div>
          </div>
        </div>
        <div
          className={cx(rowClassName)}
          onClick={() => {
            handleAccountPageClick({
              actionName: handleAccountPageShowModalClick,
              payload: { value: AccountPageModalTitleTypes.INVITE_CODE },
            });
          }}
        >
          <div className="">Bind invitation code</div>
          <div className={cx(rightClassName)}>
            <span>{referralInfo.code ? referralInfo.code : 'Not link'}</span>
            {!referralInfo.code ? (
              <div className="relative">
                <RedDot className="w-2 h-2 absolute left-0 top-0" />
                <Icon
                  name="ic_arrow_right_3"
                  className={cx(iconRightClassName)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <AccountModal />
    </div>
  );
};
