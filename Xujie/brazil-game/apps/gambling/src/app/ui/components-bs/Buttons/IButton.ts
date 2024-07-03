import cx from '../../utils/cx';

export type IButton = {
  className?: string;
  onClick: () => void;
};

export const commonBtnClass = cx(
  'flex-1',
  'mr-2',
  'px-5 py-1',
  'text-[--var(white)]',
  'rounded-md'
);
