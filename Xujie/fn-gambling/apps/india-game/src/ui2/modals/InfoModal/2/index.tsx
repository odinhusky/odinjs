import Modal from '@mode2/components/Modal';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import React from 'react';
import {
  FLEX_CENTER,
  FLEX_COL,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@constant/style';
import { InfoModalProps } from '../InfoModalProps';

// TODO i18n

export const InfoModal = ({
  isShow,
  title,
  titleClassName,
  content,
  contentClassName,
  imgClassName,
  confirmBtnText,
  onConfirmClick,
}: InfoModalProps) => {
  return isShow ? (
    <Modal>
      <div
        id="Odin"
        className={cx(
          'w-screen h-screen',
          'relative flex flex-col bgi-[var(--bg-main)] w-full h-full',
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'flex-col justify-center items-center'
        )}
      >
        <div className={cx('w-full', FLEX_CENTER, 'flex-col')}>
          <div className={cx('relative w-full', FLEX_CENTER, 'mb-6')}>
            <img
              className={cx('w-[297px] h-[297px] m-auto', imgClassName)}
              alt={'withdrawal_success'}
              src={getImgUrl(EResourceLevel.V, 'withdrawal_success')}
            />
          </div>

          <div className={cx('w-full', FLEX_COL, 'gap-[6px]')}>
            {title ? (
              <h4
                className={cx(
                  'block m-0',
                  'text-xl',
                  'bgi-text-[var(--base-2-variant1)]',
                  'text-center',
                  titleClassName
                )}
              >
                {title}
              </h4>
            ) : null}

            {content ? (
              <p
                className={cx(
                  'block',
                  'w-full',
                  'text-sm font-medium bgi-text-[var(--base-2-variant1)] text-center',
                  contentClassName
                )}
              >
                {content}
              </p>
            ) : null}
          </div>

          <BasePrimaryBtn
            className={cx('font-medium mt-[124px] w-auto px-[50px] text-base')}
            debounceTimer={500}
            onClick={onConfirmClick}
            children={confirmBtnText ? confirmBtnText : 'Confirm'}
          />
        </div>
      </div>
    </Modal>
  ) : null;
};

export default InfoModal;
