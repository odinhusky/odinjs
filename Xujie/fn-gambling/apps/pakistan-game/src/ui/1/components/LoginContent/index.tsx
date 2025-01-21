import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useBreakPoint } from '@libs/commonUtils';
import { EResourceLevel } from '@mode2/utils';
import { LoginFormType } from '@mode2/zustand/loginStore';
import { useEffect, useMemo, useState } from 'react';
import useLoginForm, { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import sdkUtils from '@mode2/utils/sdk';
import { useTranslation } from 'react-i18next';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@libs/mode2/zustand/components/customerServiceListStore';
import { cx } from '@libs/commonUtils';
import { ManufacturerList } from '@components/ManufacturerList';
import { useFooterStore } from '@libs/mode2/zustand/components/footerStore';
import Icon from '@libs/mode2/components/Icon';
import { useStatisticsPlayerMutation } from '@libs/mode2/external/api';
import RollNumber from '@libs/mode2/components/RollNumber';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import useHeaderAction from '@libs/mode2/action/components/header/headerAction';
import { handlePrivacyPolicyLinkActionClick } from '@libs/mode2/action/components/header/actionType';

export const LoginContent = (props: ILoginModalProps) => {
  const { isMobile } = useBreakPoint();
  const { t } = useTranslation();

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
        <div
          className={cx(
            'w-6 h-6 p-1 border border-[var(--transparent-white-70)] rounded-full cursor-pointer',
            'absolute right-3 top-3 cursor-pointer',
            'opacity-70'
          )}
          onClick={props.onClose}
        >
          <Icon
            className="relative w-full"
            name="ic_close"
            color="var(--grayscale-100)"
          />
        </div>
      )}
      <div className="overflow-auto rounded-b-lg mobile:mt-10 mt-12 mobile:mx-0 -mx-4">
        <div className={cx('', props.className, 'mobile:px-6 px-4')}>
          <div className="bgi-text-[var(--state-warn-main)] text-xl font-medium text-center">
            {t('help_center_customer_support_welcome_to_gamename', {
              productName: sdkUtils.productName(),
            })}
          </div>
          <div className="mobile:mt-4 mt-3">
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
              ['mt-4 max-mobile:mt-3 pb-6', LoginFormType.REGISTER]
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
                    <Icon
                      className={cx(
                        'w-full h-full rounded-full object-contain',
                        'p-2',
                        'shadow-[0px_4px_4px_0px_#CCCCCC40_inset,0px_-4px_4px_0px_#33333340_inset]',
                        isMobile ? 'w-12 h-12' : 'w-14 h-14'
                      )}
                      level={EResourceLevel.SHARED}
                      name={item.icon}
                      color="var(--grayscale-100)"
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
        {props.type === LoginFormType.LOGIN && <Footer {...props} />}
      </div>
    </>
  );
};
const Footer = (props: ILoginModalProps) => {
  const { setPolicyCheck } = useLoginForm(props);
  const copyrightInfo = useFooterStore((state) => state.copyrightInfo);
  const { t } = useTranslation();
  const [triggerStatisticsPlayer, { data }] = useStatisticsPlayerMutation();
  const [statistics, setStatistics] = useState({
    register: 0,
    win: 0,
  });
  const { handleHeaderClick } = useHeaderAction();

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
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="flex gap-2 items-center">
              <Icon
                name="ic_user"
                color="var(--grayscale-100)"
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
            <div className="flex gap-1 items-center">
              <Icon
                name="ic_game_player"
                color="var(--grayscale-100)"
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
                color="var(--grayscale-100)"
                className="w-5 h-5"
              />
              <span className="bgi-text-[var(--grayscale-100)] text-xl font-medium">
                {statistics.win ? <RollNumber number={statistics.win} /> : '--'}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <Icon
                name="ic_winner"
                color="var(--grayscale-100)"
                className="w-5 h-5"
              />
              <span className="bgi-text-[var(--base-1-main)] text-sm font-medium">
                {t('sign_in_winner')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-6 bgi-[var(--grayscale-10)]
            bgi-text-[var(--grayscale-100)] text-xs font-medium
            bgi-border-[var(--base-1-main)] after:border-0 after:border-t after:top-0 after:left-0 after:right-0 after:bottom-0"
      >
        <div className="mx-4 mt-3 z-[1]">
          <span
            className=""
            onClick={() => {
              // TODO 关于我们
            }}
          >
            {t('footer_contact_us')}
          </span>
        </div>
        <div className="mx-4 z-[1]">
          <span
            className="underline cursor-pointer"
            onClick={() => {
              // 协议
              setPolicyCheck(true);
              handleHeaderClick({
                actionName: handlePrivacyPolicyLinkActionClick,
              });
            }}
          >
            {t('footer_privacy_policy')}
          </span>
        </div>
        <div className="mobile:px-9 px-6 pb-3">
          <ManufacturerList
            sceneFrom={'modal'}
            styles={{
              img: '!h-4',
            }}
          />
          <div
            className={
              'text-xs bgi-text-[var(--grayscale-50)] mt-5 font-normal text-center'
            }
          >
            {copyrightInfo}
          </div>
        </div>
      </div>
    </>
  );
};
