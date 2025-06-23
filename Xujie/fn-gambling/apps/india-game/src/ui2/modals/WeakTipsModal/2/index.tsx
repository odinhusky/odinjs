import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { WeakTipsModalProps } from '../WeakTipsModalProps';

export const WeakTipsModal = ({
  isShow,
  title,
  content,
  primaryBtnText,
  onPrimaryBtnClick,
  secondaryBtnText,
  onSecondaryBtnClick,
}: WeakTipsModalProps) => {
  return isShow ? (
    <BaseModal>
      <div
        className={cx(
          'w-[304px] phone:max-w-[400px] phone:w-full',
          'bgi-[var(--grayscale-100)]',
          'rounded-lg',
          'p-4',
          FLEX_COL,
          'gap-2',
          'relative'
        )}
      >
        <div className={cx('w-full', FLEX_CENTER)}>
          <div className={cx(FLEX_ITEMS_CENTER, 'gap-2')}>
            <Icon
              className={cx('w-6 h-6')}
              name="ic_notice"
              color="var(--base-1-main)"
            />

            <h4
              className={cx(
                'm-0',
                'block',
                'bgi-text-[var(--base-1-main)]',
                'text-lg',
                'font-semibold'
              )}
            >
              {capitalize(title)}
            </h4>
          </div>
        </div>

        <article
          className={cx(
            'block',
            'w-full',
            'bgi-text-[var(--grayscale-50)]',
            'text-sm',
            'text-center'
          )}
        >
          {content}
        </article>

        <div className={cx('w-full', FLEX_ITEMS_CENTER, 'gap-2')}>
          <BaseSecondaryBtn
            className={cx(
              'h-8 bgi-[var(--linear-8)]',
              'hover:bgi-[var(--linear-8)] active:bgi-[var(--linear-8)]'
            )}
            classNameText={cx('bgi-text-[var(--grayscale-100)]', 'text-base')}
            children={secondaryBtnText}
            onClick={onSecondaryBtnClick}
          />

          <BasePrimaryBtn
            className={cx('h-8')}
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
