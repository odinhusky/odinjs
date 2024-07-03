// - Components
import { BackNavigation } from "apps/gambling/src/app/ui/components-bs/BackNavigation/BackNavigation";
import { PageContainer } from "apps/gambling/src/app/ui/components-bs/PageContainer";
import LuckyWheelLineContainer from "../../components/LuckyWheelLineContainer";
import LuckyWheelContainer from "../../components/LuckyWheelContainer";
import LuckyWheelRecords from "../../components/LuckyWheelRecords";
import LuckyWheelDescription from "../../components/LuckyWheelDescription";

// ? Constant
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import { ActivityPageRouter } from "../../..";

// # Transforms
import { useLuckyWheelConfigTransform } from "apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelConfigTransform";

// ^ Plugins
import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";
import cx from "apps/gambling/src/app/ui/utils/cx";
import t from "apps/gambling/src/assets/constant/lang";
import { appSlice } from "apps/gambling/src/app/reduxStore/appSlice";
import { useDispatch } from "react-redux";
import { usePageNavigate } from "apps/gambling/src/app/ui/router/hooks/usePageNavigate";
import { formatDenominatorValue, formatIntLocaleMoney } from "apps/gambling/src/app/ui/utils/format";

interface LuckyWheelU6Props {

}

export const LuckyWheelU6 = ({

}: LuckyWheelU6Props) => {

  const { isMobile } = useBreakpoint();
  const dispatch = useDispatch();
  const {
    content,
    dama,
    currentLuckyValue,
    luckValue,
    switchWheelBtns,
    wheelConfigs
  } = useLuckyWheelConfigTransform();
  const { onClickToActivity } = usePageNavigate();

  // = styles
  const layoutWidth = cx('max-w-[1200px]');
  const luckyWheelLineContainerClass = cx(
    'bg-[var(--grayscale-50)]',
    'flex',
    'text-sm leading-5',
    'tablet:text-base tablet:leading-6',
  );

  const labelClass = cx(
    'flex-1',
    'pr-2 tab:pr-0',
    'font-medium',
    'text-sm leading-5',
    'tablet:text-lg tablet:leading-7',
  );

  const btnClass = cx(
    'm-0',
    'w-auto'
  );

  return (
    <PageContainer
      className={cx(
        'text-white',
        'pb-[71px] tab:pb-[48px]',
        'tablet:px-5'  
      )}
    >
      <div className={cx(
        'w-full mx-auto',
        layoutWidth
      )}>
        <BackNavigation />
      </div>

      <div className={cx(
        FLEX_CENTER,
        'flex-col',
        'mt-4 tab:mt-5 tablet:mt-8'
      )}>
        <div className={cx(
          'w-full', layoutWidth,
          'rounded-lg',
          'mb-3 tab:mb-5'
        )}>
          <LuckyWheelLineContainer
            label={t['totalBetsOfLuckyWheel']}
            btnLabel={t['collectionRecords']}
            labelClass={labelClass}
            containerClass={cx(luckyWheelLineContainerClass, ' min-w-[148px]')}
            btnClass={cx(btnClass, 'w-[148px] tablet:w-auto')}
            onClick={() => {
              dispatch(appSlice.actions.setIsShowLuckyWheelLuckyValueDetailModal(true))
            }}
          />

          <LuckyWheelLineContainer
            label={
              <>
                {t['currentLuckyValueText']}
                <span> {formatIntLocaleMoney(currentLuckyValue)} </span>
                <br />
                {t['damaText']}
                <span> {t['moneyWithRSign'](formatDenominatorValue(dama | 0))} </span>
                {t['toGet']}
                <span> {formatIntLocaleMoney(luckValue)} </span>
                {t['luckValueText']}
              </>
            }
            labelClass={labelClass}
            containerClass={cx(luckyWheelLineContainerClass, 'mb-8 tab:mb-4')}
            btnClass={btnClass}
            btnLabel={t['Details']}
            onClick={() => {
              onClickToActivity({category: ActivityPageRouter.RECORD})
            }}
          />

          <LuckyWheelContainer
            switchWheelBtns={switchWheelBtns}
            wheelConfigs={wheelConfigs}
            currentLuckyValue={currentLuckyValue}
          />
        </div>

        <div className={cx(
          'w-full', layoutWidth, 
          'bg-[var(--grayscale-30)]',
          'rounded-lg',
          'p-3 tab:p-5'
        )}>
          <LuckyWheelRecords />
        </div>

        <div className={cx(
          'w-full', layoutWidth, 
          'bg-[var(--grayscale-30)]',
          'rounded-lg',
          'mt-3 tab:mt-4 tablet:mt-5'
        )}>
          <LuckyWheelDescription
            content={content}
            className={cx(
              'p-4 tab:py-8 tab:px-9',
              'pl-9 tab:pl-[60px]',
            )}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default LuckyWheelU6;