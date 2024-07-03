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

interface LuckyWheelP1Props {

}

export const LuckyWheelP1 = ({

}: LuckyWheelP1Props) => {

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
  const layoutWidth = cx(
    'max-w-[900px]'
  );

  const luckyWheelLineContainerClass = cx(
    'bg-[var(--background-instruction-80)]',
    'border border-[var(--outline-secondary)]',
    'rounded-3xl',
    'flex',
    'text-sm leading-5',
    'tablet:text-lg tablet:leading-7',
  );

  const labelClass = cx(
    'text-xs leading-[14px]',
    'tablet:text-lg tablet:leading-[21px]',
  );

  const btnClass = cx(
    'm-0',
    'w-auto'
  );

  return (
    <PageContainer
      className={cx(
        'text-white',
        'pb-[71px] tab:pb-[48px]'  
      )}
    >
      <BackNavigation
        title={
          isMobile ? (
            <div className={"w-full text-center font-bold"}>
              {t['totalBetsOfLuckyWheel']}
            </div>
          ) : null
        }
      />

      <div className={cx(
        FLEX_CENTER,
        'flex-col',
        'mt-4 tab:mt-5 tablet:mt-8'
      )}>
        <div className={cx(
          'w-full', layoutWidth,
          'tab:bg-[var(--background-modal)]',
          'p-3 tab:p-5',
          'mb-5 tab:mb-6'
        )}>
          <LuckyWheelLineContainer
            label={t['totalBetsOfLuckyWheel']}
            btnLabel={t['collectionRecords']}
            labelClass={labelClass}
            containerClass={cx(luckyWheelLineContainerClass, ' min-w-[103px] tab:min-w-[135px]')}
            btnClass={btnClass}
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
          'bg-[var(--background-modal)]',
          'p-3 tab:p-5'
        )}>
          <LuckyWheelRecords />

          <LuckyWheelDescription
            content={content}
            className={cx(
              'rounded-3xl',
              'bg-[var(--background-instruction-80)]',
              'border border-[var(--outline-secondary)]',
            )}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default LuckyWheelP1;