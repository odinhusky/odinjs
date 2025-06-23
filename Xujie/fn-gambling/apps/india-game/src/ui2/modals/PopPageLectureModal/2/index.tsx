import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import Icon from '@components/Icon';
import usePopPageStore from '@mode2/zustand/page/PopPage';
import usePopPageAction from '@libs/mode2/action/popPageAction/usePopPageAction';
import { handlepopPageLecutreModalCloseIconClick } from '@libs/mode2/action/actionTypes';

// TODO Odin I18N
export const PopPageLectureModal = () => {
  const isShowPopPageLectureModal = usePopPageStore(
    (state) => state.isShowPopPageLectureModal
  );

  const { handlePopPageClick } = usePopPageAction();

  return isShowPopPageLectureModal ? (
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
            Your Reward Awaits
          </div>
          <button
            onClick={() => {
              handlePopPageClick({
                actionName: handlepopPageLecutreModalCloseIconClick,
              });
            }}
          >
            <Icon name="ic_close" className="w-6 h-6" />
          </button>
        </div>

        <div className={cx('mt-8', 'w-full')}>
          <span className={cx('bgi-text-[var(--grayscale-100)] text-sm')}>
            Your app is downloaded successfully! Don’t forget to open your
            Downloads folder or check your notification bar to install it to get
            the best experience.
          </span>
        </div>
      </div>
    </BaseModal>
  ) : null;
};

export default PopPageLectureModal;
