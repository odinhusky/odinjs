import cx from '@commonUtils/cx';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import { formatMoney } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import MarqueeScrollVertical from '@components/MarqueeScrollVertical';
import { useRef } from 'react';

const InviteWheelMarquee = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeText = useInviteWheelPageStoreStore(
    (state) => state.marqueeText
  );

  const mixMarqueeList = marqueeText.map((item, index) => ({
    id: `${index}_${item.name}`,
    broadcastText: `${item.name} ${t('wins')} ${formatMoney({
      value: item.winAmount,
      includeDecimal: true,
    })}`,
    action: () => {},
  }));
  return (
    <div
      className={cx(
        'h-auto bgi-[var(--linear-1)] max-w-[60%]',
        'text-sm font-normal bgi-text-[var(--grayscale-100)]'
      )}
    >
      <MarqueeScrollVertical
        ref={containerRef}
        marqueeList={mixMarqueeList}
        marqueeUnitStyle={{ color: 'var(--grayscale-100)' }}
      />
    </div>
  );
  // return (
  //   <div
  //     className={cx(
  //       'h-auto bgi-[var(--linear-1)] max-w-[60%]',
  //       'text-sm font-normal bgi-text-[var(--grayscale-100)]'
  //     )}
  //   >
  //     <div className="bgi-border-t-[var(--linear-3)] " />
  //
  //     <div className="px-4 py-1.5 flex w-full gap-2 justify-center items-center">
  //       <Icon
  //         className="w-4 h-4 "
  //         name="ic_volume"
  //         color="var(--state-success-main)"
  //       />
  //       <Marquee speed={30} autoFill={true}>
  //         {marqueeText.map((item, index) => {
  //           return (
  //             <div
  //               key={index}
  //               className={cx(
  //                 'scroll-item',
  //                 'inline-block',
  //                 'pr-5',
  //                 'transition-colors',
  //                 'duration-1000'
  //               )}
  //             >
  //               {item.name} {t('wins')} {formatMoney(item.winAmount, true)}
  //             </div>
  //           );
  //         })}
  //       </Marquee>
  //     </div>
  //
  //     <div className="bgi-border-b-[var(--linear-3)] " />
  //   </div>
  // );
};

export default InviteWheelMarquee;
