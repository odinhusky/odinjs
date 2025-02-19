import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';
import { capitalize } from 'lodash';

export interface WeakTipsModalProps {
  isShow: boolean;
  title: string;
  content: string;
  primaryBtnText: string;
  onPrimaryBtnClick?: VoidFunction;
  secondaryBtnText: string;
  onSecondaryBtnClick?: VoidFunction;
  onClose?: VoidFunction;
  isShowClose?: boolean;
  titlePosition?: 'start' | 'center';
  isShowDivider?: boolean;
  isSingleButton?: boolean;
}

export const WeakTipsModal = ({
  isShow,
  title,
  content,
  primaryBtnText,
  onPrimaryBtnClick,
  secondaryBtnText,
  onSecondaryBtnClick,
  isShowClose = false,
  titlePosition = 'center',
  isShowDivider = false,
  onClose,
  isSingleButton = false,
}: WeakTipsModalProps) => {
  return isShow ? (
    <BaseModal>
      <div
        className={cx(
          'relative',
          'max-w-[408px] w-full',
          FLEX_COL,
          'gap-8 p-8',
          'bgi-[var(--base-2-variant9)]',
          'bgi-border-[var(--base-1-main)] border rounded-xl',
          { 'p-4': isShowDivider }
        )}
      >
        <div className={cx('w-full relative', FLEX_CENTER)}>
          <div className={cx(FLEX_ITEMS_CENTER, 'gap-2 w-full')}>
            <h4
              className={cx(
                'm-0 block w-full',
                'text-center bgi-text-[var(--grayscale-100)] text-xl font-medium',
                { 'text-start': titlePosition === 'start' }
              )}
            >
              {capitalize(title)}
            </h4>
          </div>
          {isShowClose ? (
            <Icon
              className={cx('w-6 h-6 absolute -right-3 -top-3 cursor-pointer', {
                'right-0 top-0': isShowDivider,
              })}
              name={'ic_close'}
              onClick={onClose}
            />
          ) : null}

          {isShowDivider ? (
            <div className="absolute w-full -bottom-2 bgi-border-b-[var(--transparent-white-10)] border-b" />
          ) : null}
        </div>

        <article
          className={cx(
            'block w-full',
            'bgi-text-[var(--grayscale-100)]',
            'text-base text-center'
          )}
        >
          {content}
        </article>

        <div
          className={cx('w-full', FLEX_ITEMS_CENTER, 'gap-4', {
            'justify-center': isSingleButton,
          })}
        >
          {!isSingleButton ? (
            <BaseSecondaryBtn
              className={cx(
                'h-12'
                // 'hover:bgi-[var(--linear-8)] active:bgi-[var(--linear-8)]'
              )}
              classNameText={cx('', 'text-base')}
              children={secondaryBtnText}
              onClick={onSecondaryBtnClick}
            />
          ) : null}

          <BasePrimaryBtn
            className={cx('h-12', { 'w-1/2': isSingleButton })}
            classNameText={cx('text-base')}
            children={primaryBtnText}
            onClick={onPrimaryBtnClick}
          />
        </div>
      </div>
    </BaseModal>
  ) : null;
};

export default WeakTipsModal;
