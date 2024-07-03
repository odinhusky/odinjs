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
import { useEffect } from "react";
import { useLocation } from "react-router";
import { PageOrModalPathEnum } from "apps/gambling/src/app/ui/PageOrModalPathEnum";
import { formatDenominatorValue, formatIntLocaleMoney } from "apps/gambling/src/app/ui/utils/format";

interface LuckyWheelU1Props {

}

export const LuckyWheelU1 = ({

}: LuckyWheelU1Props) => {

  const { isMobile } = useBreakpoint();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    content,
    dama,
    currentLuckyValue,
    luckValue,
    switchWheelBtns,
    wheelConfigs,
    refetchConfig
  } = useLuckyWheelConfigTransform();
  const { onClickToActivity } = usePageNavigate();

  useEffect(() => {
    if(location.pathname === PageOrModalPathEnum.ActivityHallPage){
      refetchConfig();
    }
  }, [location.pathname])

  // = styles
  const layoutWidth = cx(
    'max-w-[900px]'
  );

  const luckyWheelLineContainerClass = cx(
    
  );

  const labelClass = cx(
    
  );

  const btnClass = cx(
    
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
          'bg-[var(--transparente-10)]',
          'rounded-lg',
          'p-3 tab:px-5',
          'mb-5 tab:mb-6'
        )}>
          <LuckyWheelLineContainer
            label={t['totalBetsOfLuckyWheel']}
            btnLabel={t['collectionRecords']}
            containerClass={cx(luckyWheelLineContainerClass)}
            labelClass={cx(labelClass)}
            btnClass={cx(btnClass)}
            onClick={() => {
              dispatch(appSlice.actions.setIsShowLuckyWheelLuckyValueDetailModal(true))
            }}
          />

          <LuckyWheelLineContainer
            label={
              <>
                {t['currentLuckyValueText']}
                <span className={cx('text-[var(--text-popup)]')}> {formatIntLocaleMoney(currentLuckyValue)} </span>
                <br />
                {t['damaText']}
                <span className={cx('text-[var(--text-popup)]')}> {t['moneyWithRSign'](formatDenominatorValue(dama | 0))} </span>
                {t['toGet']}
                <span className={cx('text-[var(--text-popup)]')}> {formatIntLocaleMoney(luckValue)} </span>
                {t['luckValueText']}
              </>
            }
            containerClass={cx(luckyWheelLineContainerClass, 'mb-8 tab:mb-4')}
            labelClass={cx(labelClass)}
            btnClass={cx(btnClass)}
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
          'bg-[var(--transparente-10)]',
          'rounded-lg',
          'p-3 tab:px-5'
        )}>
          <LuckyWheelRecords />

          <LuckyWheelDescription
            content={content}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default LuckyWheelU1;