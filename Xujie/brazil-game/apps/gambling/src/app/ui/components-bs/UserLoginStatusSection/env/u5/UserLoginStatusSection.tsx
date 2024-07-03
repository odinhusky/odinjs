import cx from 'classnames';
import { useState } from 'react';
import { UserLoginForm } from '../../forms/UserLoginForm';
import { UserRegisterForm } from '../../forms/UserRegisterForm';
import { UserForgetPasswordForm } from '../../forms/UserForgetPasswordForm';
import { LoginModalLogo } from '../../../Logos/LoginModalLogo';
import { IUserLoginStatusSection } from '../../types';
import { TabItem } from '../../components/TabItem';
import { Tabs } from '../../../../components/Tabs';
import { ArrowLeft } from '../../../Icons/ArrowLeft';
import { ILoginUIStatusType } from '../../../../../reduxStore/appSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';

export const UserLoginStatusSection = (props: IUserLoginStatusSection) => {
  const loginUIStatusType = useSelector(
    (rootState: RootState) => rootState.app.loginUIStatusType
  );
  const [switchToLoginOrRegister, setSwitchToLoginOrRegister] =
    useState<ILoginUIStatusType>(loginUIStatusType);

  return (
    <div
      className={
        'flex flex-col px-5 md:px-8 lg:px-8 box-border bg-linear-4-main rounded-[20px]'
      }
    >
      {switchToLoginOrRegister === 'forget' ? (
        <section
          className={
            'mt-8 mb-3 md:mb-5 lg:mb-8 flex justify-start items-center'
          }
        >
          <button
            onClick={() => {
              setSwitchToLoginOrRegister('login');
            }}
            className={cx(
              'text-white',
              'text-base md:text-lg lg:text-2xl leading-6 md:leading-7 lg:leading-8',
              'flex flex-row justify-center items-center'
            )}
          >
            <ArrowLeft />
            <span>Esqueça a senha</span>
          </button>
        </section>
      ) : (
        <>
          <section
            className={
              'flex flex-col justify-center items-center mb-3 md:mb-5 lg:mb-8 pt-8'
            }
          >
            <LoginModalLogo />
          </section>
          <section
            className={
              'mb-3 md:mb-5 lg:mb-8 flex justify-center items-center h-auto'
            }
          >
            <Tabs
              className={cx('w-full rounded-lg bg-[var(--transparente-30)]')}
            >
              <TabItem
                key="login"
                className={cx({
                  'bg-[var(--state-info-main)]':
                    switchToLoginOrRegister == 'login',
                })}
                name={'Entrar'}
                active={switchToLoginOrRegister === 'login'}
                onClick={() => {
                  setSwitchToLoginOrRegister('login');
                }}
              />
              <TabItem
                key="register"
                className={cx({
                  'bg-[var(--state-info-main)]':
                    switchToLoginOrRegister == 'register',
                })}
                name={'Cadastre-Se'}
                active={switchToLoginOrRegister === 'register'}
                onClick={() => {
                  setSwitchToLoginOrRegister('register');
                }}
              />
            </Tabs>
          </section>
        </>
      )}

      {switchToLoginOrRegister === 'login' ? (
        <div className={''}>
          <UserLoginForm
            confirmToLogin={() => {
              props.confirmToLogin();
            }}
            openNotificationWithIcon={props.openNotificationWithIcon}
            onSwitchToForgetPassword={() => {
              setSwitchToLoginOrRegister('forget');
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
        <div>
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
