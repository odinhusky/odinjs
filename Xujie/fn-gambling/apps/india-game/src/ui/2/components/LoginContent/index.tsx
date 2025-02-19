import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { cx, useBreakPoint } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { LoginFormType } from '@mode2/zustand/loginStore';
import { useEffect, useMemo, useState } from 'react';
import { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import sdkUtils from '@mode2/utils/sdk';
import { useTranslation } from 'react-i18next';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@libs/mode2/zustand/components/customerServiceListStore';
import { ManufacturerList } from '@components/ManufacturerList';
import { useFooterStore } from '@libs/mode2/zustand/components/footerStore';
import Icon from '@components/Icon';
import { useStatisticsPlayerMutation } from '@libs/mode2/external/api';
import RollNumber from '@libs/mode2/components/RollNumber';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';

export const LoginContent = (props: ILoginModalProps) => {
  const { isMobile } = useBreakPoint();
  const { t } = useTranslation();

  // 是否顯示 註冊贈金廣告
  const isDisplayRegisterReward = usePlatformDynamicConfigStore(
    (state) => state.isDisplayRegisterReward
  );

  const usageScenariosList = useCustomerServiceListStore(
    (state) => state.usageScenariosList
  );

  const serviceList = useMemo(() => {
    return (
      usageScenariosList.find(
        (item) => item.scenarios === CustomerServiceScenarios.LOGIN
      )?.customerServiceList || []
    );
  }, [usageScenariosList]);

  return (
    <>
      {isMobile ? null : (
        <Icon
          className={cx(
            'w-6 h-6 p-1 border border-[var(--grayscale-100)] rounded-full cursor-pointer',
            'absolute right-3 top-3 cursor-pointer',
            'opacity-70'
          )}
          name={'ic_close'}
          onClick={props.onClose}
        />
      )}
      <div className="overflow-auto">
        <div className={cx('mobile:pt-6 pt-10', props.className)}>
          {/* 註冊 赠金 廣告*/}
          {isDisplayRegisterReward && props.type === LoginFormType.REGISTER ? (
            <img
              className={cx('my-4 rounded-lg', { 'mb-4 -mt-4': isMobile })}
              alt={'register_banner'}
              src={getImgUrl(EResourceLevel.V, 'register_banner')}
            />
          ) : null}

          <div className="bgi-text-[var(--state-warn-main)] text-xl font-medium text-center">
            {t('help_center_customer_support_welcome_to_gamename', {
              productName: sdkUtils.productName(),
            })}
          </div>

          <div className="flex items-center justify-center">
            <hr className="w-full opacity-20" />
            <div
              className="flex gap-[2px] text-xs bgi-text-[var(--transparent-white-70)]
                    px-2 my-3 mx-auto items-center text-center"
            >
              {t('sign_in_or')}
            </div>
            <hr className="w-full opacity-20" />
          </div>
          <div>
            {props.type === LoginFormType.LOGIN && <LoginForm {...props} />}
            {props.type === LoginFormType.REGISTER && (
              <RegisterForm {...props} />
            )}
          </div>
        </div>
        <div className="w-80 mx-auto px-4">
          <div
            className={cx(
              'flex justify-center',
              ['mt-6', LoginFormType.LOGIN],
              ['mt-4 max-mobile:mt-3', LoginFormType.REGISTER]
            )}
          >
            {serviceList.map((item) => (
              <div
                className="flex flex-col gap-4 items-center flex-1 justify-center"
                key={item.label}
              >
                <BasePrimaryBtn
                  className={cx(
                    'w-auto h-auto',
                    'rounded-full',
                    'animate-heartBeatIcon'
                  )}
                  onClick={item.onActionClick}
                  children={
                    <img
                      className={cx(
                        'w-full h-full rounded-full object-contain',
                        'p-2',
                        isMobile ? 'w-12 h-12' : 'w-14 h-14'
                      )}
                      src={getImgUrl(EResourceLevel.SHARED, item.icon)}
                      alt={item.label}
                    />
                  }
                />

                <span className="bgi-text-[var(--grayscale-70)] text-xs mobile:text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {props.type === LoginFormType.LOGIN && <Footer />}
      </div>
    </>
  );
};
const Footer = () => {
  const copyrightInfo = useFooterStore((state) => state.copyrightInfo);
  const { t } = useTranslation();
  const [triggerStatisticsPlayer, { data }] = useStatisticsPlayerMutation();
  const [statistics, setStatistics] = useState({
    register: 0,
    win: 0,
  });

  useEffect(() => {
    triggerStatisticsPlayer({});
  }, []);
  useEffect(() => {
    if (!data?.Body) return;
    setStatistics({
      register: data.Body.Register || 0,
      win: data.Body.Win || 0,
    });

    const intervalId = setInterval(() => {
      setStatistics((pre) => ({
        register: pre.register + Math.floor(Math.random() * 6) + 1,
        win: pre.win + Math.floor(Math.random() * 3) + 1,
        time: 0,
      }));
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [data]);

  return (
    <>
      <div className="w-80 mx-auto px-4">
        <div className="flex justify-center my-6">
          <div className="flex-1 flex flex-col items-center border-r-2 border-[var(--transparent-20)] gap-3">
            <div className="flex gap-2 items-center">
              <Icon
                name="ic_user"
                color="var(--base-1-main)"
                className="w-5 h-5"
              />
              <span className="bgi-text-[var(--grayscale-100)] text-xl font-medium">
                {statistics.register ? (
                  <RollNumber number={statistics.register} />
                ) : (
                  '--'
                )}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Icon
                name="ic_game_player"
                color="var(--base-1-main)"
                className="w-5 h-5"
              />
              <span className="bgi-text-[var(--base-1-main)] text-sm font-medium">
                {t('sign_in_game_player')}
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="flex gap-2 items-center">
              <Icon
                name="ic_user"
                color="var(--base-1-main)"
                className="w-5 h-5"
              />
              <span className="bgi-text-[var(--grayscale-100)] text-xl font-medium">
                {statistics.win ? <RollNumber number={statistics.win} /> : '--'}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Icon
                name="ic_game_player"
                color="var(--base-1-main)"
                className="w-4 h-4"
              />
              <span className="bgi-text-[var(--base-1-main)] text-sm font-medium">
                {t('sign_in_winner')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--grayscale30)] bgi-[var(--grayscale-10)] py-3 px-6 mobile:mx-9">
        <ManufacturerList
          sceneFrom={'modal'}
          styles={{
            img: '!h-4',
          }}
        />
        <div className={'text-xs mt-5 text-center'}>{copyrightInfo}</div>
      </div>
    </>
  );
};
