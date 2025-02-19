import { memo } from 'react';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { cx } from '@libs/commonUtils';
import { handleLuckyWheelActionClick } from '@mode2/action/components/header/actionType';
import { EResourceLevel, getImgUrl } from '@mode2/utils';

export const LuckyWheelButton = memo(() => {
  const { handleHeaderClick } = useHeaderAction();
  return (
    <div
      className={cx(
        'w-[80px] h-[54px]',
        'font-bold bgi-text-[var(--base-1-main)] text-[13px] whitespace-nowrap',
        'cursor-pointer'
      )}
      onClick={() => {
        handleHeaderClick({
          actionName: handleLuckyWheelActionClick,
        });
      }}
    >
      <img
        alt={'img_lucky_wheel'}
        src={getImgUrl(EResourceLevel.V, 'img_lucky_wheel')}
      />
    </div>
  );
});

export default LuckyWheelButton;
