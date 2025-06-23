import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import {
  FLEX_CENTER,
  FLEX_COL,
  FLEX_ITEMS_CENTER,
  XY_CENTER,
} from '@libs/constant/style';
import {
  handleRechargeRepeatTopUpBonusModalAddBtnClick,
  handleRechargeRepeatTopUpBonusModalCloseClick,
  handleRechargeRepeatTopUpBonusModalNoThanksBtnClick,
  handleRechargeRepeatTopUpBonusModalOptionItemClick,
} from '@libs/mode2/action/actionTypes';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import useRechargeRepeatTopUpBonusModalStore, {
  PayAddOnOption,
} from '@mode2/zustand/modal/RechargeRepeatTopUpBonusModal';
import useRechargeRepeatTopUpBonusModalAction from '@mode2/action/model/RechargeRepeatTopUpBonusModal/useRechargeRepeatTopUpBonusModalAction';
import { useRechargeRepeatTopUpBonusModalBase } from './useRechargeRepeatTopUpBonusModalBase';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';

interface RechargeRepeatTopUpBonusModalProps {}

const TotalPayAddOnInfo = () => {
  // 當前增值選項
  const currentPayAddOnOption = useRechargeRepeatTopUpBonusModalStore(
    (state) => state.currentPayAddOnOption
  );
  return (
    <div
      className={cx(
        'w-full',
        'border bgi-border-[var(--transparent-white-20)]',
        'rounded-md',
        'py-3 px-4',
        FLEX_ITEMS_CENTER,
        'gap-[6px]'
      )}
    >
      {/* top up */}
      <div className={cx(FLEX_COL, FLEX_CENTER, 'flex-1')}>
        <div className={cx('bgi-text-[var(--base-2-variant2)]', 'text-sm')}>
          You just topped up
        </div>

        <div className={cx('bgi-text-[var(--grayscale-100)]', 'text-2xl')}>
          {formatMoney({ value: currentPayAddOnOption?.amount  || 0})}
        </div>
      </div>

      {/* Icon */}
      <Icon name="ic_add_2" className="w-5 h-5 block" />

      {/* Add-on */}
      <div className={cx(FLEX_COL, FLEX_CENTER, 'flex-1')}>
        <div className={cx('bgi-text-[var(--base-2-variant2)]', 'text-sm')}>
          Add-on
        </div>

        <div className={cx('bgi-text-[var(--grayscale-100)]', 'text-2xl')}>
          {formatMoney({ value: currentPayAddOnOption?.addOnAmount || 0 })}
        </div>
      </div>
    </div>
  );
};

const PayAddOnButton = (item: PayAddOnOption) => {
  const { handleRechargeRepeatTopUpBonusModalClick } =
    useRechargeRepeatTopUpBonusModalAction();
  // 當前增值選項
  const currentPayAddOnOption = useRechargeRepeatTopUpBonusModalStore(
    (state) => state.currentPayAddOnOption
  );
  const isActive = item.indexKey === currentPayAddOnOption?.indexKey;
  return (
    <div
      className={cx(
        'relative w-full h-[60px]',
        FLEX_COL,
        'justify-end',
        'cursor-pointer'
      )}
      onClick={() => {
        handleRechargeRepeatTopUpBonusModalClick({
          actionName: handleRechargeRepeatTopUpBonusModalOptionItemClick,
          payload: {
            payAddOnOption: item,
          },
        });
      }}
    >
      <div
        className={cx(
          'w-full h-[52px]',
          'rounded-lg',
          FLEX_CENTER,
          'bgi-text-[var(--base-1-main)]',
          'text-xl',
          {
            'bgi-[var(--base-2-variant4)] border-[1.5px] bgi-border-[var(--base-1-variant1)]':
              isActive,
            'bgi-[var(--base-2-variant6)]': !isActive,
          }
        )}
      >
        {formatMoney({ value: item.addOnAmount })}
      </div>

      <div
        className={cx(
          'w-[50px] h-[20px]',
          'absolute top-0 right-0 z-10',
          'px-2 rounded-tl-lg rounded-br-lg',
          FLEX_CENTER,
          'text-xs bgi-text-[var(--grayscale-100)] font-normal',
          {
            'bgi-[var(--linear-3)]': isActive,
            'bgi-[var(--linear-4)]': !isActive,
          }
        )}
      >
        {`+${item.bonus}`}
      </div>
    </div>
  );
  // return null;
};

const PayAddOnOptionButtons = () => {
  const payAddOnOptions = useRechargeRepeatTopUpBonusModalStore(
    (state) => state.payAddOnOptions
  );
  return (
    // <div
    //   className={cx('w-full', 'overflow-x-auto', FLEX_ITEMS_CENTER, 'gap-3')}
    // >
    <div className="w-full grid grid-cols-3 gap-3 overflow-y-auto max-h-[120px] ">
      {/*<div className="grid grid-cols-3"></div>*/}
      {payAddOnOptions.map((item, index) => {
        return <PayAddOnButton key={index} {...item} />;
      })}
    </div>
  );
};

const FooterButtons = () => {
  const { handleWalletPageClick } = useWalletPageActions();
  // 當前增值選項
  const currentPayAddOnOption = useRechargeRepeatTopUpBonusModalStore(
    (state) => state.currentPayAddOnOption
  );
  const totalAddOnAmount =
    (currentPayAddOnOption?.amount || 0) + (currentPayAddOnOption?.addOnAmount || 0);

  return (
    <div className={cx('w-full', FLEX_COL, 'gap-3')}>
      <BasePrimaryBtn
        className="h-[60px]"
        debounceTimer={500}
        children={
          <div
            className={cx(
              'bgi-text-[var(--base-2-variant5)]',
              'text-center',
              'font-medium'
            )}
          >
            <span className="text-xl block font-medium">
              Add {formatMoney({ value: currentPayAddOnOption?.addOnAmount || 0 })}{' '}
              More
            </span>

            <span className="text-xs block font-medium">
              Total recharge will be {formatMoney({ value: totalAddOnAmount })}
            </span>
          </div>
        }
        onClick={() => {
          handleWalletPageClick({
            actionName: handleRechargeRepeatTopUpBonusModalAddBtnClick,
            payload: {
              payAddOnOption: currentPayAddOnOption,
            },
          });
        }}
      />

      <BaseSecondaryBtn
        className="h-[60px]"
        debounceTimer={500}
        children={
          <div className={cx('text-center', 'font-medium', 'text-xl')}>
            No Thanks
          </div>
        }
        onClick={() => {
          handleWalletPageClick({
            actionName: handleRechargeRepeatTopUpBonusModalNoThanksBtnClick,
          });
        }}
      />
    </div>
  );
};

export const RechargeRepeatTopUpBonusModal = (
  props: RechargeRepeatTopUpBonusModalProps
) => {
  useRechargeRepeatTopUpBonusModalBase();
  const isShowRechargeRepeatTopUpBonusModal =
    useRechargeRepeatTopUpBonusModalStore(
      (state) => state.isShowRechargeRepeatTopUpBonusModal
    );

  const { handleRechargeRepeatTopUpBonusModalClick } =
    useRechargeRepeatTopUpBonusModalAction();

  return isShowRechargeRepeatTopUpBonusModal ? (
    <BaseModal>
      <div className={cx('relative', 'max-w-[408px] w-full h-fit')}>
        {/* 背景圖，撐開高度 */}
        <BaseCacheImg
          src={getImgUrl(EResourceLevel.V, 'bg_recharge_repeat_top_bonus')}
          className={cx('block', 'w-full')}
        />

        {/* Modal 本體 */}
        <div
          className={cx(
            'w-full max-w-[384px] min-h-[300px]',
            'box-border rounded-xl bgi-[var(--base-2-variant9)] border-[2px] border-[var(--base-1-main)]',
            'absolute',
            XY_CENTER,
            'bg-shadow-[var(--recharge-repeat-top-up-bonus-modal-glitter-shadow)]',
            'p-4'
          )}
        >
          {/* 關閉按鈕 */}
          <div className={cx('absolute right-4 top-4')}>
            <button
              onClick={() => {
                handleRechargeRepeatTopUpBonusModalClick({
                  actionName: handleRechargeRepeatTopUpBonusModalCloseClick,
                });
              }}
            >
              <Icon name="ic_close" className="w-6 h-6" />
            </button>
          </div>
          {/* 內容開始 */}
          <div className={cx('w-full', FLEX_COL, 'gap-3')}>
            {/* header 部分 */}
            <div className={cx('w-full', 'p-3', FLEX_COL, 'gap-1')}>
              <div className={cx('w-full', FLEX_CENTER)}>
                <BaseCacheImg
                  src={getImgUrl(EResourceLevel.V, 'popup_bonus_boost_title')}
                  className={cx('w-[284px]', 'mx-auto')}
                />
              </div>

              <p
                className={cx(
                  'inline-block',
                  'bgi-text-[var(--base-1-variant6)]',
                  'text-sm text-center'
                )}
              >
                Add a little more to unlock a big bonus boost! This exclusive
                offer might not show up every time. Don’t miss your only shot!{' '}
              </p>
            </div>

            {/* 金額區塊 */}
            <TotalPayAddOnInfo />

            {/* Add-on 選擇區塊 */}
            <div>
              <div
                className={cx('bgi-text-[var(--grayscale-100)]', 'text-base')}
              >
                Add-on
              </div>

              {/* 附加選項按鈕列表 */}
              <PayAddOnOptionButtons />
            </div>

            {/* 按鈕區塊 */}
            <FooterButtons />
          </div>
        </div>
      </div>
    </BaseModal>
  ) : null;
};

export default RechargeRepeatTopUpBonusModal;
