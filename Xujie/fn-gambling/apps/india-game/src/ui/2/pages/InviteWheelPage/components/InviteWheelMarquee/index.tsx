import cx from '@commonUtils/cx';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import Marquee from 'react-fast-marquee';
import Icon from '@components/Icon';
import { formatMoney } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import AffixHeaderBottomWrapper from '@mode2/components/AffixHeaderBottomWrapper';

const InviteWheelMarquee = () => {
  const { t } = useTranslation();
  const marqueeText = useInviteWheelPageStoreStore(
    (state) => state.marqueeText
  );
  return (
    <div className={'w-screen mobile:w-full'}>
      <AffixHeaderBottomWrapper
        affixContainerClass={'bgi-[var(--transparent-gray-90)]'}
      >
        <div
          className={cx(
            'h-auto bgi-[var(--linear-1)]',
            'text-xxs font-normal bgi-text-[var(--grayscale-100)]'
          )}
        >
          <div className="bgi-border-t-[var(--linear-3)] " />

          <div className="px-4 py-1.5 flex w-full gap-2 justify-center items-center">
            <Icon
              className="w-4 h-4 "
              name="ic_volume"
              color="var(--state-success-main)"
            />
            <Marquee speed={30} autoFill={true}>
              {marqueeText.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={cx(
                      'scroll-item',
                      'inline-block',
                      'pr-5',
                      'transition-colors',
                      'duration-1000'
                    )}
                  >
                    {item.name} {t('wins')} {formatMoney(item.winAmount, true)}
                  </div>
                );
              })}
            </Marquee>
          </div>

          <div className="bgi-border-b-[var(--linear-3)] " />
        </div>
      </AffixHeaderBottomWrapper>
    </div>
  );
};

export default InviteWheelMarquee;
