import cx from '../../app/ui/utils/cx';

export const FULL = 'w-full h-full';
export const FLEX_CENTER = 'flex justify-center items-center';
export const FLEX_ITEMS_CENTER = 'flex items-center';
export const FLEX_JUSTIFY_CENTER = 'flex items-center';
export const FLEX_COL = 'flex flex-col';
export const FLEX_END_CENTER = 'flex justify-end items-center';

export const X_CENTER = 'left-1/2 -translate-x-[50%]';
export const XY_CENTER =
  'left-1/2 -translate-x-[50%] top-1/2 -translate-y-[50%]';

export const MODAL_Z_INDEX = 'z-[1005]';
export const MODAL_FIX = 'fixed left-0 top-0 right-0 bottom-0';
export const MODAL_MASK = 'bg-[rgba(0,0,0,0.65)]';

export const SHADOW = 'shadow-[0px_4px_4px_0px_#26212C]';

// Versions Classes

export const U7_MODAL_TITLE_FONT = cx(
  'font-bold text-[var(--grayscale-100)]',
  'text-base leading-5',
  'tab:text-lg tab:leading-6'
);

export const U7_TEXT_FONT = cx(
  'font-medium text-[var(--grayscale-100)]',
  'text-sm leading-[18px]',
  'tab:text-base tab:leading-5'
);

export const U7_MT_SPACING = cx('mt-4 tab:mt-5 tablet:mt-8');

export const U7_MB_SPACING = cx('mb-4 tab:mb-5 tablet:mb-8');
