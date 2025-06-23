import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import Icon from '@components/Icon';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import usePopPageStore from '@mode2/zustand/page/PopPage';
import usePopPageAction from '@mode2/action/popPageAction/usePopPageAction';
import {
  handlepopPageRegitsterSuccessModalCloseIconClick,
  handlepopPageRegitsterSuccessModalDownLoadAppBtnClick,
  handlepopPageRegitsterSuccessModalPlayInBrowserBtnClick,
} from '@libs/mode2/action/actionTypes';

// TODO Odin I18N
export const PopPageRegisterSucessModal = () => {
  const isShowPopPageRegitsterSuccessModal = usePopPageStore(
    (state) => state.isShowPopPageRegitsterSuccessModal
  );

  const { handlePopPageClick } = usePopPageAction();

  return isShowPopPageRegitsterSuccessModal ? (
    <BaseModal className="bgi-[var(--transparent-gray-90)]">
      <div
        className={cx(
          'w-[90%] max-w-[408px] p-4 box-border rounded-xl bgi-[var(--base-2-variant9)] border border-[var(--base-1-main)]'
        )}
      >
        <div
          className={cx(
            'pb-3',
            'flex justify-between items-center',
            'border-b border-[var(--transparent-white-10)]'
          )}
        >
          <div className="text-lg font-medium bgi-text-[var(--grayscale-100)]">
            Get Set to Play!
          </div>
          <button
            onClick={() => {
              handlePopPageClick({
                actionName: handlepopPageRegitsterSuccessModalCloseIconClick,
              });
            }}
          >
            <Icon name="ic_close" className="w-6 h-6" />
          </button>
        </div>

        <div className={cx('my-8', 'w-full')}>
          <span className={cx('bgi-text-[var(--grayscale-100)] text-sm')}>
            For the best experience, we recommend downloading the app. Or
            continue playing in your browser.
          </span>
        </div>

        <div className={cx(FLEX_ITEMS_CENTER, 'gap-4')}>
          <BaseSecondaryBtn
            className={cx('py-[2px]')}
            onClick={() => {
              handlePopPageClick({
                actionName:
                  handlepopPageRegitsterSuccessModalPlayInBrowserBtnClick,
              });
            }}
            children={'Play in Browser'}
          />

          <BasePrimaryBtn
            className={cx('py-[2px]')}
            onClick={() => {
              handlePopPageClick({
                actionName:
                  handlepopPageRegitsterSuccessModalDownLoadAppBtnClick,
              });
            }}
            children={
              <div
                className={cx(
                  FLEX_CENTER,
                  FLEX_COL,
                  'text-sm',
                  'bgi-text-[var(--base/2/variant5)]'
                )}
              >
                <div>Download App</div>
                <div>(Recommended)</div>
              </div>
            }
          />
        </div>
      </div>
    </BaseModal>
  ) : null;
};

export default PopPageRegisterSucessModal;
