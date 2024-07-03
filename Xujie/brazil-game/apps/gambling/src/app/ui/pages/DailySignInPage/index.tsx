import React, {useEffect, useRef, useState} from 'react';

import { useLazyGetPunchInConfigQuery, usePostPunchInMutation } from "../../../external";
import useBreakpoint from '../../pageTemplate/hooks/useBreakpoint';
import {useAllowLoginRouterRules} from '../../router/hooks/useAllowLoginRouterRules';
import {CurrentLevelButton, OtherLevelButton} from '../VIPGradePage';
import {environment} from "../../../../environments/environment";
import {tcx} from "../../utils/tcx";

import {renderByUVersion} from "../../utils/renderByUVersion";
import PDailySignInPage from './env/p1/DailySignInPage';
import WDailySignInPage from "./env/wild/DailySignInPage";
import CocoDailySignInPage from "./env/u1/DailySignInPage";
import RioDailySignInPage from "./env/u2"
import U5DailySignInPage from "./env/u5"
import U6DailySignInPage from "./env/u6"
import U7DailySignInPage from "./env/u7"
import { useAutoUpdateBalance } from "../../hooks/useAutoUpdateBalance";
import { useScrollSelectFixCenter } from "../../hooks/useScrollSelectFixCenter";
import { notification } from "antd";
import {GetPunchInConfigResponse} from "../../../external/PunchInEndpoint";

export interface IDailySignInPageProps {
  onClickToSignIn: () => Promise<boolean>
  currentVIP: GetPunchInConfigResponse['data']['vipLevel']
  signInAllConfig: GetPunchInConfigResponse['data']['signInAllConfig']
  todayIsSignIn: GetPunchInConfigResponse['data']['todayIsSignIn']
  signInTotalDays?: GetPunchInConfigResponse['data']['signInTotalDays'];
  isFromActivity?: boolean;
}

const days: number[] = [];

for (let i = 1; i <= 7; i += 1) {
  days.push(i);
}

export const LevelList = ({
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
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: any) => {
    setInitialPageX(e.pageX);
  };

  const handleMouseUp = (e: any) => {
    setInitialPageX(0);
  };

  const handleMouseMove = (e: any) => {
    if (initialPageX !== 0 && contentRef.current !== null) {
      const leftOrRight = initialPageX - e.pageX;
      contentRef.current.scrollLeft += leftOrRight;
      setInitialPageX(e.pageX);
    }
  };


  return (
    <section
      className={'vip-tab-items flex-no-wrap mb-4 flex flex-row overflow-auto ml-4'}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={contentRef}
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
                className='w-7 h-6'
                alt={isReachLevel ?"king" : "lock"}
                src={currentLevel >= numberValue
                  ? vipIcon
                  : `assets/${environment.uVersion}/icon_vip_box_close.png`
                }
              />
              <span className={'text-[#fff] font-bold'}>VIP{numberValue}</span>
            </LevelButton>
          );
      })}
    </section>
  );
};


type IDailySignInPage = {
  isFromActivity: boolean;
}
export const DailySignInPage = (props: IDailySignInPage ) => {
  useAllowLoginRouterRules();

  const [currentSelectedLevel, setCurrentSelectedLevel] = useState(1);

  useEffect(() => {
    setCurrentSelectedLevel(currentSelectedLevel)
  }, [currentSelectedLevel]);

  const [triggerGetSignInConfig, { data: signInConfig }] =
    useLazyGetPunchInConfigQuery();

  const [triggerPostPunchIn] = usePostPunchInMutation()

  const { updateBalance }= useAutoUpdateBalance({
    autoWindowFocusRefresh: false,
  });

  const [api, contextHolder] = notification.useNotification();


  // console.log("signInConfig", signInConfig);

  useEffect(() => {
    if(signInConfig?.data?.vipLevel) {
      setCurrentSelectedLevel(signInConfig?.data?.vipLevel);
    }
  }, [signInConfig?.data?.vipLevel ])

  const onClickToSignIn = () => {
    return triggerPostPunchIn(null).then((result) => {
        if('data' in result){
          if(result.data?.code === 200) {
            triggerGetSignInConfig(null);
            updateBalance();
            api.success({
              message: 'Check-in bem-sucedido',
            });
            return true
          }
          else {
            return false
          }
        }else {
          return false
        }
      }
    ).catch(()=> false)
  }

  useEffect(() => {
    triggerGetSignInConfig(null);
  }, []);

  return (
    <div>
      {contextHolder}
      {
        renderByUVersion({
            "wild777bet": (
              <WDailySignInPage
                onClickToSignIn={onClickToSignIn}
                signInConfig={signInConfig?.data?.signInConfig || []}
                signInAllConfig={signInConfig?.data?.signInAllConfig || []}
                signInTotalDays={signInConfig?.data?.signInTotalDays || 0}
                todayIsSignIn={signInConfig?.data?.todayIsSignIn || false}
                vipLevel={signInConfig?.data?.vipLevel || 0}
                currentSelectedLevel={currentSelectedLevel}
                setCurrentSelectedLevel={setCurrentSelectedLevel}
              />
            ),
            "p1": (
              <PDailySignInPage
                onClickToSignIn={onClickToSignIn}
                currentLevel={signInConfig?.data?.vipLevel || 0}
                signInConfig={signInConfig?.data?.signInConfig}
                signInAllConfig={signInConfig?.data?.signInAllConfig || []}
                signInTotalDays={signInConfig?.data?.signInTotalDays || 0}
                todayIsSignIn={signInConfig?.data?.todayIsSignIn || false}
                vipLevel={signInConfig?.data?.vipLevel || 0}
                currentSelectedLevel={currentSelectedLevel}
                setCurrentSelectedLevel={setCurrentSelectedLevel}
              />
            ),
            "u1": (
              <CocoDailySignInPage
                onClickToSignIn={onClickToSignIn}
                signInConfig={signInConfig?.data?.signInConfig || []}
                signInAllConfig={signInConfig?.data?.signInAllConfig || []}
                signInTotalDays={signInConfig?.data?.signInTotalDays || 0}
                todayIsSignIn={signInConfig?.data?.todayIsSignIn || false}
                vipLevel={signInConfig?.data?.vipLevel || 0}
                currentSelectedLevel={currentSelectedLevel}
                setCurrentSelectedLevel={setCurrentSelectedLevel}
                isFromActivity={props.isFromActivity}
              />
            ),
            "u2": (
              <RioDailySignInPage
                onClickToSignIn={onClickToSignIn}
                currentVIP={signInConfig?.data?.vipLevel || 0}
                signInAllConfig={signInConfig?.data?.signInAllConfig || []}
                todayIsSignIn={signInConfig?.data?.todayIsSignIn || false}
                signInTotalDays={signInConfig?.data?.signInTotalDays || 0}
              />
            ),
            "u5": (
              <U5DailySignInPage
                onClickToSignIn={onClickToSignIn}
                currentVIP={signInConfig?.data?.vipLevel || 0}
                signInAllConfig={signInConfig?.data?.signInAllConfig || []}
                todayIsSignIn={signInConfig?.data?.todayIsSignIn || false}
                signInTotalDays={signInConfig?.data?.signInTotalDays}
              />
            ),
            "u6": (
              <U6DailySignInPage
                onClickToSignIn={onClickToSignIn}
                currentVIP={signInConfig?.data?.vipLevel || 0}
                signInAllConfig={signInConfig?.data?.signInAllConfig || []}
                todayIsSignIn={signInConfig?.data?.todayIsSignIn || false}
                signInTotalDays={signInConfig?.data?.signInTotalDays}
                isFromActivity={props.isFromActivity}
              />
            ),
            "u7": (
              <U7DailySignInPage
                onClickToSignIn={onClickToSignIn}
                currentVIP={signInConfig?.data?.vipLevel || 0}
                signInAllConfig={signInConfig?.data?.signInAllConfig || []}
                todayIsSignIn={signInConfig?.data?.todayIsSignIn || false}
                signInTotalDays={signInConfig?.data?.signInTotalDays}
                isFromActivity={props.isFromActivity}
              />
            )
          },
          (
            <PDailySignInPage
              onClickToSignIn={onClickToSignIn}
              currentLevel={signInConfig?.data?.vipLevel || 0}
              signInConfig={signInConfig?.data?.signInConfig}
              signInAllConfig={signInConfig?.data?.signInAllConfig || []}
              signInTotalDays={signInConfig?.data?.signInTotalDays || 0}
              todayIsSignIn={signInConfig?.data?.todayIsSignIn || false}
              vipLevel={signInConfig?.data?.vipLevel || 0}
              currentSelectedLevel={currentSelectedLevel}
              setCurrentSelectedLevel={setCurrentSelectedLevel}
            />
          ))
      }
    </div>
  )
};
