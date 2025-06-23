import BasePrimaryBtn from '@components/BasePrimaryBtn';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import {
  FLEX_CENTER,
  FLEX_COL,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import { handleFeedBackPageInBoxMessageReceiveSuccessModalBtnClick } from '@mode2/action/actionTypes';
import useFeedBackPageActions from '@libs/mode2/action/feedBackPageAction/useFeedBackPageActions';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import { useTranslation } from 'react-i18next';

export const InboxReceiveModal = () => {
  const { t } = useTranslation();
  const { handleFeedBackPageClick } = useFeedBackPageActions();
  const isShowReceiveModal = useMode2FeedBackPageInBoxStore(
    (state) => state.isShowReceiveModal
  );
  const totalReward = useMode2FeedBackPageInBoxStore(
    (state) => state.totalReward
  );

  return isShowReceiveModal ? (
    <BaseModal className="!bgi-[var(--transparent-gray-90)]">
      <div
        className={cx(
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'w-screen',
          'text-xs',
          FLEX_CENTER,
          FLEX_COL,
          'relative'
        )}
      >
        <img
          src={getImgUrl(EResourceLevel.V, 'mail_cash_backgound')}
          alt=""
          className={cx('w-screen h-60', 'absolute top-0 left-0 -z-10')}
        />
        <div
          className={cx(
            'text-[32px] leading-9',
            'bgi-text-[var(--base-1-variant3)]'
          )}
        >
          Congratulations
        </div>

        <div
          className={cx(
            'w-[113px] mt-9',
            FLEX_CENTER,
            FLEX_COL,
            'bgi-[var(--base-1-40)] rounded-md'
          )}
        >
          <Icon
            // name="ic_mail_deposit_bous_default"
            name="ic_my_bonus_rewards_1"
            className="w-16 h-16 pt-1.5"
          />
          <p className="mt-1.5 text-lg font-medium bgi-text-[var(--base-1-main)]">
            ₹{totalReward}
          </p>
          <p className="pb-1 bgi-text-[var(--base-1-main)]">
            {t('deposit_history_deposit_amount')}
          </p>
        </div>
        <BasePrimaryBtn
          children={'Confirm'}
          className={cx(
            'w-[166px] h-[46px] mt-[58px] !bg-shadow-[var(--button-shadow-50)]'
          )}
          classNameText="text-lg"
          onClick={() => {
            handleFeedBackPageClick({
              actionName:
                handleFeedBackPageInBoxMessageReceiveSuccessModalBtnClick,
            });
          }}
        />
      </div>
    </BaseModal>
  ) : null;
};

export default InboxReceiveModal;
