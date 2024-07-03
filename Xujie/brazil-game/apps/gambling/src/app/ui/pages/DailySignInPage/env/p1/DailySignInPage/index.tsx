import React, { useRef, useState } from "react";
import { useAllowLoginRouterRules } from "../../../../../router/hooks/useAllowLoginRouterRules";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import { CurrentLevelButton, OtherLevelButton } from "../../../../VIPGradePage";
import { environment } from "../../../../../../../environments/environment";
import { tcx } from "../../../../../utils/tcx";
import cx from "classnames";
import styled from "styled-components";
import { PMobileDailySignInPage } from "./MobileDailySignInPage";
import { Notice } from "../Notice";
import { Footer } from "../Footer";
import { GetPunchInConfigResponse } from "../../../../../../external/PunchInEndpoint";
import { PageContainer } from "../../../../../components-bs/PageContainer";
import { useScrollSelectFixCenter } from "../../../../../hooks/useScrollSelectFixCenter";
import { formatLocaleMoney } from "../../../../../utils/format";
import { twMerge } from "tailwind-merge";

const PLevelList = ({
                     currentLevel,
                     currentSelectedLevel,
                     setCurrentSelectedLevel,
                     startLevel = 0,
                   }: {
  startLevel?: number;
  currentLevel: number;
  currentSelectedLevel: number;
  setCurrentSelectedLevel: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { isMobile } = useBreakpoint();

  const vips: number[] = [];

  for (let i = startLevel; i <= 25; i += 1) {
    vips.push(i);
  }

  const [initialPageX, setInitialPageX] = useState(0);

  const { scrollWrapperRef } = useScrollSelectFixCenter(currentSelectedLevel, false)

  const handleMouseDown = (e: any) => {
    setInitialPageX(e.pageX);
  };

  const handleMouseUp = (e: any) => {
    setInitialPageX(0);
  };

  const handleMouseMove = (e: any) => {
    if (initialPageX !== 0 && scrollWrapperRef.current !== null) {
      const leftOrRight = initialPageX - e.pageX;
      scrollWrapperRef.current.scrollLeft += leftOrRight;
      setInitialPageX(e.pageX);
    }
  };


  return (
    <section
      className={'vip-tab-items flex flex-row overflow-y-scroll relative mt-10'}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={scrollWrapperRef}
    >
      {vips.map((numberValue, index) => {
        const isReachLevel = numberValue === currentSelectedLevel
        const LevelButton = isReachLevel ? CurrentLevelButton : OtherLevelButton;
        const vipIcon = isReachLevel
          ? `assets/${environment.uVersion}/icon_vip_box_open.png`
          : `assets/${environment.uVersion}/icon_vip_box_open.png`;
        return (
          <LevelButton
            className={tcx('mr-3 p-2 text-3xl rounded-xl', ['p-1 pr-2 text-base rounded-lg', isMobile])}
            key={index}
            onClick={() => {
              setCurrentSelectedLevel(numberValue);
            }}
          >
            <img
              className='w-9 h-9'
              alt={isReachLevel ?"king" : "lock"}
              src={currentLevel >= numberValue
                ? vipIcon
                : `assets/${environment.uVersion}/icon_vip_box_close.png`
              }
            />
            <span className={'text-[#fff] font-bold'}>LV{numberValue}</span>
          </LevelButton>
        );
      })}
    </section>
  );
};

const Daily = styled.div<{
  disable: boolean;
}>`
  ${(props) => !props.disable && `
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACuCAYAAADQ3SQfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ4OCwgMjAyMC8wNy8xMC0yMjowNjo1MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFFODU2NkFCNkE2QjExRUU5NTdCRjRFRkNBM0JERTg2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFFODU2NkFDNkE2QjExRUU5NTdCRjRFRkNBM0JERTg2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUU4NTY2QTk2QTZCMTFFRTk1N0JGNEVGQ0EzQkRFODYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUU4NTY2QUE2QTZCMTFFRTk1N0JGNEVGQ0EzQkRFODYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5qtyfYAAACbElEQVR42uzYO0qjURjH4ZgEBccFeJnpBF2AFu4igzesprZ1QHcgaKGWrmCYGRkvCxELLS0svGwg4BgQfI+cD0IIiOZ0Pg/8QcJn8/Ij0QzNbP+o9TEca+UtxCbza3xe7dht7CJ2EjuLdXofavb5xe+x3di0G9JlLDabtxa7jm3Fjrsfqnf93Ijt5AfExFtSI/9yM41+71DbsU134p2qZra636GWxMSAUS1VQaU/tvfdhAEdpJZSUMuxr+7BgKZiK/X81QCU0EpBzbsDhcyloMbdgUImUlAj7kAhw3U3oCRBISgEhaBAUAgKQYGgEBSCQlAgKASFoEBQCApBgaAQFIJCUCAoBIWgQFAICkGBoBAUgkJQICgEhaBAUAgKQYGgEBSCQlAgKASFoEBQCApBgaAQFIJCUCAoBIWgQFAICkGBoBAUgkJQICgEhaBAUAgKQSEoJ0BQCApBgaAQFIICQSEoBIWgQFAICkGBoBAUggJBISgEhaBAUAgKQYGgEBSCAkEhKASFoEBQCApBgaAQFIICQSEoBIWgQFAICkGBoBAUggJBISgEhaBAUAgKQYGgEBSCglqtWR8dcQXKBdX4Iih85CEoBAWCQlAICgSFoBAUggJBISgEBYJCUAgKBIWgEBSCAkEhKAQFgkJQCAp6g2o7A4V0UlD37kAhDymoS3egkPMU1Kk7UMhpCurIxx4FpIaOUlBPsQ33YEA/Y/+rrw3+xPbchA9K7fyuvjaobMYO3YZ3Oszt1HqDeo6tx1ZjN+7EG25yK+u5nVfNPg/+zf/5LcZasYXYN/f79B5jd7Gr2FnsV6zT+9CLAAMAqy8zpX+5V0QAAAAASUVORK5CYII=") center center no-repeat;
  `};
  margin-top: auto;
`;

const DailyDia = styled.div`
  height: 30px;
  line-height: 30px;
`;

const days: number[] = [];

for (let i = 1; i <= 7; i += 1) {
  days.push(i);
}

export const DayList = (props: {
  currentSelectedLevel: number;
  signInAllConfig: {
    identifier: string;
    value: string;
  }[];
  className?: string;
  itemClassName?: string;
  signInConfig?: GetPunchInConfigResponse['data']['signInConfig'];
  signInTotalDays: GetPunchInConfigResponse['data']['signInTotalDays'];
  todayIsSignIn: GetPunchInConfigResponse['data']['todayIsSignIn'];
  vipLevel: GetPunchInConfigResponse['data']['vipLevel'];
}) => {
  const { signInAllConfig, currentSelectedLevel } = props;
  const vipConfig = signInAllConfig.find(
    (config) =>
      config.identifier.split('::')[2].replace('V', '') ===
      `${currentSelectedLevel}`
  );

  const dayConfigs = JSON.parse(vipConfig?.value || '[]');

  return (
    <section
      className={cx(
        'mt-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6',
        props.className
      )}
    >
      {days.map((day, index) => {
        const config = dayConfigs.find(
          (dayConfig: any) => dayConfig.days === day
        );
        const disable = currentSelectedLevel === props.vipLevel && index + 1 <= props.signInTotalDays;
        return (
          <div
            key={index}
            className={cx(
              'flex-col',
              props.itemClassName,
            )}
          >
            <DailyDia
              className={'bg-[#58DCC7] mb-2 w-full rounded-lg text-lg text-[#006D79] text-center'}
            >
              Dia{day}
            </DailyDia>

            <div className={twMerge('bg-[#008B8D] rounded-t-2xl pt-3 px-2 pb-[5px]', disable && 'bg-gradient-to-b from-[#FE6060] to-[#FFA24D] border-t border-l border-r border-[#FBFF3F]')}>
              <img alt={'money'} src={`assets/${environment.uVersion}/gold${disable?'-check': ''}.png`} />
            </div>
            <div className={twMerge("flex-grow flex flex-col justify-center items-center bg-[#006D79] rounded-b-2xl py-1", disable && 'bg-[#FF6360] border-b border-l border-r border-[#FBFF3F]' )}>
              <span className="text-white font-bold">R${formatLocaleMoney(config?.cashback || 0)}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

interface IPernambucanaDailySignInPageProps {
  onClickToSignIn: () => void
  currentLevel: number
  signInConfig?: GetPunchInConfigResponse['data']['signInConfig']
  signInAllConfig: GetPunchInConfigResponse['data']['signInAllConfig']
  signInTotalDays: GetPunchInConfigResponse['data']['signInTotalDays']
  todayIsSignIn: GetPunchInConfigResponse['data']['todayIsSignIn']
  vipLevel: GetPunchInConfigResponse['data']['vipLevel']
  currentSelectedLevel: number
  setCurrentSelectedLevel: React.Dispatch<React.SetStateAction<number>>
}

const PDailySignInPage = ({
  onClickToSignIn,
  currentLevel,
  signInConfig,
  signInAllConfig,
  signInTotalDays,
  todayIsSignIn,
  vipLevel,
  currentSelectedLevel,
  setCurrentSelectedLevel
}: IPernambucanaDailySignInPageProps) => {
  const { isMobile } = useBreakpoint();

  if(isMobile) {
    return (
      <PMobileDailySignInPage
        currentLevel={currentLevel}
        signInAllConfig={signInAllConfig || []}
        signInConfig={signInConfig}
        onClickToSignIn={onClickToSignIn}
        signInTotalDays={signInTotalDays}
        todayIsSignIn={todayIsSignIn}
        vipLevel={vipLevel}
        currentSelectedLevel={currentSelectedLevel}
        setCurrentSelectedLevel={setCurrentSelectedLevel}
      />
    )
  }

  return (
    <PageContainer>
      <div className='relative'>
        <img alt="banner" src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_checkin.png`} />
        <div className='absolute left-10 top-1/2 -translate-y-1/2 font-bold text-[4vw] text-[#f5c40e] leading-[4vw]'>
          <div>CHECK-IN TODOS OS DIAS</div>
          <div>O DINHEIRO NÃO PARA!</div>
        </div>
      </div>

      <div className="bg-[rgba(1,62,66,0.8)] mt-7 rounded-lg border border-[#16FF8F] py-[60px] px-[67px]">
      <div className="bg-gradient-to-b from-[#1EE59E] to-[#E2FD97] text-transparent text-center w-full font-bold" style={{ fontSize: '40px' }}>BONUS DE LOGIN VIP</div>

        <PLevelList
          startLevel={1}
          currentLevel={vipLevel || 0}
          currentSelectedLevel={currentSelectedLevel}
          setCurrentSelectedLevel={setCurrentSelectedLevel}
        />

        <DayList
          currentSelectedLevel={currentSelectedLevel}
          signInAllConfig={signInAllConfig || []}
          signInConfig={signInConfig}
          signInTotalDays={signInTotalDays || 0}
          todayIsSignIn={todayIsSignIn || false}
          vipLevel={vipLevel || 0}
        />

        <Notice />

        <Footer
          onClickToSignIn={onClickToSignIn}
          todayIsSignIn={todayIsSignIn || false}
          vipLevel={vipLevel || 0}
          setCurrentSelectedLevel={setCurrentSelectedLevel}
        />
      </div>
    </PageContainer>
  )
}

export default PDailySignInPage;
