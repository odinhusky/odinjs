import { memo } from 'react';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { cx } from '@libs/commonUtils';
import { handleLuckyWheelActionClick } from '@mode2/action/actionTypes';
import { Icon } from '@components/Icon';

// interface LottieIconProps {
//   className?: string;
//   autoplay?: boolean;
//   loop?: boolean;
//   speed?: number;
//   name: string;
//   isActive?: boolean;
//   onClick?: () => void;
// }
//
// const LottieIcon = ({
//   className,
//   autoplay = false,
//   loop = false,
//   speed = 1,
//   name,
//   isActive = false,
//   onClick,
// }: LottieIconProps) => {
//   const src = getImgUrl(EResourceLevel.LOTTIE_ICON, name);
//   return (
//     <DotLottieReact
//       onClick={onClick}
//       className={cx('items-center', className)}
//       key={'item.id'}
//       src={src}
//       segment={isActive ? [1, 1] : undefined}
//       autoplay={autoplay}
//       loop={loop}
//       speed={speed}
//       dotLottieRefCallback={(instance) =>
//         console.log('@@@===>instance', instance)
//       }
//       style={{ width: '100%', height: '100%' }}
//     />
//   );
// };

export const LuckyWheelButton = memo(() => {
  const { handleHeaderClick } = useHeaderAction();

  // return (
  //   <LottieIcon
  //     autoplay={true}
  //     loop={true}
  //     className={cx(
  //       'w-[80px] h-[54px]',
  //       'font-bold bgi-text-[var(--base-1-main)] text-[13px] whitespace-nowrap',
  //       'cursor-pointer'
  //     )}
  //     name={'lucky_wheel_test2'}
  //     onClick={() => {
  //       console.log('@@@===> click');
  //       handleHeaderClick({
  //         actionName: handleLuckyWheelActionClick,
  //       });
  //     }}
  //   />
  // );
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
      <Icon name={'ic_lucky_wheel'} className={'w-[80px] h-[54px]'} />
    </div>
  );
});

export default LuckyWheelButton;
