import cx from 'classnames';
import { useState } from 'react';
import { UserLoginForm } from '../../forms/UserLoginForm';
import { UserRegisterForm } from '../../forms/UserRegisterForm';
import { UserForgetPasswordForm } from '../../forms/UserForgetPasswordForm';
import { IUserLoginStatusSection } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { WebsiteLogo } from '../../../../pageTemplate/header/env/p1/components/WebsiteLogo';
import { ILoginUIStatusType } from '../../../../../reduxStore/appSlice';

export const UserLoginStatusSection = (props: IUserLoginStatusSection) => {
  const loginUIStatusType = useSelector(
    (rootState: RootState) => rootState.app.loginUIStatusType
  );
  const [switchToLoginOrRegister, setSwitchToLoginOrRegister] =
    useState<ILoginUIStatusType>(loginUIStatusType);

  return (
    <div>
      <section className={'mb-2 flex justify-center items-center'}>
        {switchToLoginOrRegister !== 'forget' && (
          <div className="flex pb-2 justify-center" style={{ width: '350px' }}>
            <button
              onClick={() => {
                setSwitchToLoginOrRegister('login');
              }}
              className={cx('font-bold pb-2 px-1 mr-6', {
                // "border-b-short": switchToLoginOrRegister === "login", // 新增的类
              })}
            >
              <span
                className={cx('pb-2', {
                  'text-[var(--main-secondary-main)]':
                    switchToLoginOrRegister === 'login',
                  'text-white': switchToLoginOrRegister !== 'login',
                  'border-b-2': switchToLoginOrRegister === 'login',
                  'border-b-solid': switchToLoginOrRegister === 'login',
                  'border-b-[var(--main-secondary-main)]':
                    switchToLoginOrRegister === 'login',
                })}
              >
                Entrar
              </span>
            </button>

            <button
              onClick={() => {
                setSwitchToLoginOrRegister('register');
              }}
              className={cx('font-bold pb-2 px-1', {})}
            >
              <span
                className={cx('pb-2', {
                  'text-[var(--main-secondary-main)]':
                    switchToLoginOrRegister === 'register',
                  'text-white': switchToLoginOrRegister !== 'register',
                  'border-b-2': switchToLoginOrRegister === 'register',
                  'border-bottom-width-2':
                    switchToLoginOrRegister === 'register',
                  'border-b-solid': switchToLoginOrRegister === 'register',
                  'border-b-[var(--main-secondary-main)]':
                    switchToLoginOrRegister === 'register',
                })}
              >
                Cadastre-Se
              </span>
            </button>
          </div>
        )}

        {switchToLoginOrRegister === 'forget' && (
          <button
            onClick={() => {
              setSwitchToLoginOrRegister('register');
            }}
            className={cx('font-bold pb-2', {
              'text-[var(--main-secondary-main)]':
                switchToLoginOrRegister === 'forget',
            })}
          >
            Esqueça A Senha?
          </button>
        )}
      </section>

      {switchToLoginOrRegister === 'login' ? (
        <div className={''}>
          <section className={'flex flex-col justify-center items-center mb-4'}>
            <div className={'mb-2'}>
              <WebsiteLogo className={'w-[200px]'} />
            </div>
          </section>
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
