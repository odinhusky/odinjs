import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { UserLoginForm } from '../../forms/UserLoginForm';
import { UserRegisterForm } from '../../forms/UserRegisterForm';
import { UserForgetPasswordForm } from '../../forms/UserForgetPasswordForm';
import { LoginModalLogo } from '../../../Logos/LoginModalLogo';
import { IUserLoginStatusSection } from '../../types';
import { TabItem } from '../../../TabItem/env/u2/TabItem';
import { Tabs } from '../../../../components/Tabs';
import { ArrowLeft } from '../../../Icons/ArrowLeft';
import { ILoginUIStatusType } from '../../../../../reduxStore/appSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import 'animate.css';

export const UserLoginStatusSection = (props: IUserLoginStatusSection) => {
  const loginUIStatusType = useSelector(
    (rootState: RootState) => rootState.app.loginUIStatusType
  );
  const [switchToLoginOrRegister, setSwitchToLoginOrRegister] =
    useState<ILoginUIStatusType>(loginUIStatusType);

  const [isCloseAnimation, setIsCloseAnimation] = useState(false);

  useEffect(() => {
    if (isCloseAnimation) {
      let timeout = setTimeout(() => {
        setSwitchToLoginOrRegister('forget');
      }, 600);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isCloseAnimation]);

  return (
    <div className={'flex flex-col'}>
      {switchToLoginOrRegister !== 'forget' && (
        <section className={'flex flex-col justify-center items-center mb-5'}>
          <LoginModalLogo />
        </section>
      )}
      {switchToLoginOrRegister !== 'forget' && (
        <section
          className={
            'mb-5 flex justify-center items-center bg-[var(--grayscale-20)]'
          }
        >
          <Tabs className="w-full bg-[var(--grayscale-30)]">
            <TabItem
              className={cx({
                'bg-[var(--grayscale-30)]': switchToLoginOrRegister !== 'login',
              })}
              name={'Entrar'}
              active={switchToLoginOrRegister === 'login'}
              onClick={() => {
                setSwitchToLoginOrRegister('login');
              }}
            />
            <TabItem
              className={cx({
                'bg-[var(--grayscale-30)]':
                  switchToLoginOrRegister !== 'register',
              })}
              name={'Cadastre-Se'}
              active={switchToLoginOrRegister === 'register'}
              onClick={() => {
                setSwitchToLoginOrRegister('register');
              }}
            />
          </Tabs>
        </section>
      )}

      {switchToLoginOrRegister === 'forget' && (
        <section className={'mb-3 md:mb-5 flex justify-start items-center'}>
          <button
            onClick={() => {
              setSwitchToLoginOrRegister('login');
              setIsCloseAnimation(false);
            }}
            className={cx(
              'text-white',
              'text-base md:text-lg lg:text-2xl leading-6 md:leading-7 lg:leading-8',
              'flex flex-row justify-center items-center'
            )}
          >
            <ArrowLeft className={'mr-2'} />
            <span>Esqueça a senha</span>
          </button>
        </section>
      )}

      {switchToLoginOrRegister === 'login' ? (
        <div
          className={cx('animate__animated animate__faster', {
            animate__fadeOutLeft: isCloseAnimation,
          })}
        >
          <UserLoginForm
            confirmToLogin={() => {
              props.confirmToLogin();
            }}
            openNotificationWithIcon={props.openNotificationWithIcon}
            onSwitchToForgetPassword={() => {
              setIsCloseAnimation(true);
            }}
          />
        </div>
      ) : switchToLoginOrRegister === 'register' ? (
        <div>
          <UserRegisterForm
            confirmToRegister={() => {
              props.confirmToLogin();
            }}
            openNotificationWithIcon={props.openNotificationWithIcon}
          />
        </div>
      ) : (
        <div
          className={cx('animate__animated animate__faster', {
            animate__fadeInRight: isCloseAnimation,
          })}
        >
          <UserForgetPasswordForm
            confirmToRegister={() => {
              props.confirmToLogin();
            }}
            openNotificationWithIcon={props.openNotificationWithIcon}
          />
        </div>
      )}
    </div>
  );
};
