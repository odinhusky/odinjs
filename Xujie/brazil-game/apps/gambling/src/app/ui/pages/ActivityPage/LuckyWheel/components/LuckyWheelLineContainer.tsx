import cx from 'apps/gambling/src/app/ui/utils/cx';
import LuckyWheelBtn from './LuckyWheelBtn';
import React, { ReactNode } from 'react';
import { environment } from 'apps/gambling/src/environments/environment';
import U7BorderDiv from '../../../../components/U7BorderDiv';

interface LuckyWheelLineContainerProps {
  label: ReactNode;
  btnLabel: ReactNode;
  containerClass?: string;
  labelClass?: string;
  btnClass?: string;
  onClick?: <T>(arg?: T) => void;
  wrapperClass?: string; // U7 的時候給予 class 重塑樣式用的
}

export const LuckyWheelLineContainer = ({
  label = '',
  containerClass = '',
  labelClass = '',
  btnClass = '',
  btnLabel = '',
  onClick = () => {},
  wrapperClass = '',
}: LuckyWheelLineContainerProps) => {
  const Wrapper = environment.uVersion === 'u7' ? U7BorderDiv : React.Fragment;

  return (
    <Wrapper className={wrapperClass}>
      <div
        className={cx(
          'bg-[var(--transparente-20)]',
          'p-3 tab:px-5',
          'rounded-lg',
          'items-center justify-between',
          'tab:flex',
          'mb-2',
          containerClass
        )}
      >
        <span
          className={cx('block', 'text-base leading-6 font-medium', labelClass)}
        >
          {label}
        </span>

        <LuckyWheelBtn
          className={cx('mt-3 tab:mt-0', btnClass)}
          children={btnLabel}
          onClick={onClick}
        />
      </div>
    </Wrapper>
  );
};

export default LuckyWheelLineContainer;
