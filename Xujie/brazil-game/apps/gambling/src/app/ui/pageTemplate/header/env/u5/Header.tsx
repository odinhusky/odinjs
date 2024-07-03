import styled from 'styled-components';
import React, { useState } from 'react';
import { UserMoneyStatusSection } from '../../UserMoneyStatusSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { Avatar } from '../../../../components/Avatar/';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { IUserInfo } from '../../../../../persistant/IUserInfo';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { NotificationAnimationIcon } from '../../../../components-bs/Icons/animation/NotificationAnimationIcon';
import { IHeader } from '../../types/IHeader';
import { appSlice } from '../../../../../reduxStore/appSlice';
import useBreakpoint from '../../../hooks/useBreakpoint';
import { MenuSmallLogo } from '../../../../components-bs/Logos/env/u2/MenuSmallLogo';
import { renderByRWD } from '../../../../utils/renderByRWD';
import { MenuLogo } from '../../../../components-bs/Logos/MenuLogo';
import { MenuMediumLogo } from '../../../../components-bs/Logos/env/u2/MenuMediumLogo';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { Button } from '../../../../components-bs/Buttons/env/u2/Button';
import { environment } from '../../../../../../environments/environment';
import cx from 'classnames';
import { Input } from '../../../../components-bs/Inputs/Input';
import { SearchOutlined } from '@ant-design/icons';
import { CacheImage } from '../../../../components/image/CacheImage';
import { IconTooltip } from '../../../../components/Tooltips/IconTooltip';
import { SHADOW } from 'apps/gambling/src/assets/constant/style';

const DirectionIcon = styled.img<{
  active?: boolean;
}>`
  height: 8px;
  width: 12px;
  transform: rotate(${(props) => (props.active ? 180 : 0)}deg);
`;

const SearchSection = () => {
  const dispatch = useDispatch();

  return (
    <div
      className="w-[40px] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)] flex flex-row p-1 justify-center items-center rounded-lg"
      onClick={() => dispatch(appSlice.actions.setShowGameSearchModal(true))}
    >
      {/*<img*/}
      {/*  src={searchSVGICON}*/}
      {/*  alt="MagnifyingGlass"*/}
      {/*  id="MagnifyingGlass"*/}
      {/*  className="w-[32px] h-[32px]"*/}
      {/*/>*/}
    </div>
  );
};

const GameSearchSection = () => {
  const dispatch = useDispatch();
  return (
    <div
      className={cx(
        'grow-0 md:min-w-[160px] lg:min-w-[480px] justify-center flex-1'
      )}
      onClick={() => dispatch(appSlice.actions.setShowGameSearchModal(true))}
    >
      {/*NOTICE: refactor me*/}
      <Input
        disable={true}
        pureContainer={true}
        className={cx(
          'rounded-full mx-2 h-10 md:h-12',
          'border-0 bg-[var(--grayscale-30)]',
          'var(--linear-1-main)',
          SHADOW
        )}
        inputStyle={{ fontSize: '16px' }}
        inputClassName={
          'leading-6 placeholder:text-[var(--grayscale-70)] text-white md:pl-[10px] lg:px-[10px]'
        }
        placeholder={'Procurar'}
        suffix={<SearchOutlined className={cx('text-xl mr-2', 'text-white')} />}
      />
    </div>
  );
};

type IUserStatusSection = {
  onClickToOpenNotificationDrawer: () => void;
};
const UserStatusSection = (props: IUserStatusSection) => {
  const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo)
    ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '')
    : {};

  const openUserInfoStatusPopover = useSelector(
    (state: RootState) => state.ui.openUserInfoStatusPopover
  );
  const messageCount = useSelector(
    (state: RootState) => state.app.messageCount
  );
  const vip_level = useSelector((state: RootState) => state.app.vip_level);

  const dispatch = useDispatch();

  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const [isHoverAvatar, setIsHoverAvatar] = useState(false);
  return (
    <>
      <section
        className="flex items-center justify-end cursor-pointer ml-2 mr-1 md:ml-4 md:mr-2 gap-1 md:gap-4"
        // onClick={() => {
        //   dispatch(uiSlice.actions.setUserInfoStatusPopover(!openUserInfoStatusPopover))
        // }}
        onMouseOver={() => {
          // console.log("onMouseOver")
          // props.onClickToPopupUserInfoStatusPopover();
        }}
        onMouseOut={() => {
          // console.log("onMouseOut")
        }}
        onMouseLeave={() => {
          // console.log("onMouseLeave")
          // NOTICE: StatusPopover 不能有 mash div 佔滿全部螢幕，不然會導致 over out leave 瞬間連續觸發
          // props.onClickToPopupUserInfoStatusPopover();
        }}
      >
        <div
          className={cx(
            'h-10 w-10 md:w-12 md:h-12 flex relative justify-center items-center rounded-full bg-[var(--grayscale-30)]'
          )}
          onClick={() => {
            dispatch(appSlice.actions.setShowTelegramDetailContactModal(true));
          }}
        >
          <IconTooltip
            id="telegram-tooltip"
            className={'p-2'}
            tooltipStyle={{
              background: 'var(--grayscale-40)',
              borderRadius: '8px',
              padding: '4px 8px',
              width: '100px',
              height: '28px',
            }}
            icon={
              <CacheImage
                alt={'telegram'}
                src={`assets/${environment.uVersion}/${environment.mVersion}/icon_telegram.png`}
                className={
                  'size-6 md:w-7 md:h-7 justify-center hover:opacity-70'
                }
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden';
                  e.currentTarget.style.width = '0px';
                }}
              />
            }
            content="Contate-nos"
          />
        </div>

        <div
          className={cx(
            'h-10 w-10 md:w-12 md:h-12 flex relative justify-center rounded-full bg-[var(--grayscale-30)]'
          )}
          onClick={() => {
            props.onClickToOpenNotificationDrawer();
          }}
        >
          <NotificationAnimationIcon
            className={cx(
              // w-[30px] h-[36px] min-w-[30px] min-h-[36px]
              'w-6 h-6',
              'md:w-7 md:h-7'
            )}
            badgeBgColor="var(--state-warn-main)"
            messageCount={messageCount}
          />
        </div>

        {isDesktop && (
          <IconTooltip
            id="avatar-tooltip"
            tooltipStyle={{
              background: 'var(--grayscale-40)',
              borderRadius: '8px',
              padding: '4px 8px',
              width: 'auto',
              height: 'auto',
            }}
            place="bottomRight"
            offset={8}
            afterHide={() => {
              setIsHoverAvatar(false);
            }}
            icon={
              <div
                className={cx(
                  'h-12 w-12',
                  'flex relative justify-center items-center',
                  'rounded-full bg-[var(--grayscale-30)]',
                  `${isHoverAvatar ? '' : 'shadow-[0px_4px_4px_0px_#26212C]'}`
                )}
                onMouseOver={() => {
                  setIsHoverAvatar(true);
                }}
                onMouseOut={() => {
                  setIsHoverAvatar(false);
                }}
                onClick={() => {
                  dispatch(
                    uiSlice.actions.setUserInfoStatusPopover(
                      !openUserInfoStatusPopover
                    )
                  );
                }}
              >
                {isHoverAvatar ? (
                  <CacheImage
                    alt={'Hovered Avatar Icon'}
                    src={`assets/${environment.uVersion}/${environment.mVersion}/icon_avatar.png`}
                    className={
                      'size-6 md:w-7 md:h-7 justify-center hover:opacity-70'
                    }
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden';
                      e.currentTarget.style.width = '0px';
                    }}
                  />
                ) : (
                  <Avatar className={cx('w-12 h-12 !rounded-full')} />
                )}
              </div>
            }
            content={`LV:${vip_level} \nID:${user.user_id}`}
          />
        )}

        {isMobile ? (
          <div
            className={cx(
              'h-10 w-10 md:w-12 md:h-12 flex relative justify-center items-center rounded-full bg-[var(--grayscale-30)]'
            )}
            onClick={() =>
              dispatch(appSlice.actions.setShowGameSearchModal(true))
            }
          >
            <SearchOutlined className={cx('text-xl', 'text-white pb-1')} />
          </div>
        ) : null}
      </section>
    </>
  );
};

type IUserMoneyStatusSection = {
  onClickToOpenNotificationDrawer: () => void;
};

const UserMoneyStatusSectionItem = (props: IUserMoneyStatusSection) => {
  return (
    <section className={'flex flex-row justify-end items-center w-full'}>
      <div className="flex-1 md:flex-none">
        <UserMoneyStatusSection />
      </div>

      <UserStatusSection
        onClickToOpenNotificationDrawer={props.onClickToOpenNotificationDrawer}
      />
    </section>
  );
};

// const LogoBaseContainer = () => {
//   return (
//     <img
//       className={"w-[300px] h-[96px] relative top-[12px] left-[-30px]"}
//       src={LogoContainerImg}
//     />
//   )
// }

const RWDLogo = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { onClickToIndex } = usePageNavigate();
  return (
    <>
      {renderByRWD(
        {
          mobile: (
            <div
              className={'cursor-pointer w-[40px] mr-2'}
              onClick={() => onClickToIndex()}
            >
              <MenuSmallLogo className={cx('h-10 w-10')} />
            </div>
          ),
          tablet: (
            <div
              className={'cursor-pointer flex items-center h-full gap-2'}
              onClick={() => onClickToIndex()}
            >
              <MenuMediumLogo className={cx('h-[48px] w-[48px]')} />
              <div
                className={
                  'text-center text-white font-bold leading-6 text-base'
                }
              >
                {environment.platformName}
              </div>
            </div>
          ),
          desktop: (
            <div
              className={'cursor-pointer flex items-center h-full gap-2'}
              onClick={() => onClickToIndex()}
            >
              <MenuLogo />
              <div
                className={
                  'text-center text-white font-bold leading-6 text-base'
                }
              >
                {environment.platformName}
              </div>
            </div>
          ),
        },
        {
          isMobile,
          isTablet,
          isDesktop,
        }
      )}
    </>
  );
};

const UserActionSection = () => {
  const dispatch = useDispatch();
  return (
    <div className="flex justify-end mr-4">
      <Button
        className={cx(
          'linear-4-button',
          'text-sm md:text-base lg:text-xl py-2.5 px-4 md:py-2 lg:py-1.5 mr-3 rounded-full'
        )}
        onClick={() => {
          // props.onClickUserLoginStatusDrawer()
          dispatch(appSlice.actions.showLoginDrawerOrModal(true));
          dispatch(appSlice.actions.setLoginUIStatusType('login'));
        }}
        text={'Entrar'}
      />

      <Button
        className={cx(
          'linear-1-button',
          'text-sm md:text-base lg:text-xl py-2.5 px-4 md:py-2 lg:py-1.5 rounded-full'
        )}
        onClick={() => {
          // props.onClickUserLoginStatusDrawer()

          dispatch(appSlice.actions.showLoginDrawerOrModal(true));
          dispatch(appSlice.actions.setLoginUIStatusType('register'));
        }}
        text={'Cadastre-Se'}
      />
    </div>
  );
};
export const Header = (props: IHeader) => {
  const dispatch = useDispatch();
  const devices = useBreakpoint();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  return (
    <header
      className={cx(
        'h-18 md:h-20',
        'bg-tab',
        'px-2 md:px-4',
        'py-2 md:py-0',
        'flex flex-row justify-between items-center',
        props.className
      )}
    >
      {renderByRWD(
        {
          mobile: (
            <div
              className={'flex flex-row justify-between items-center w-full'}
            >
              <RWDLogo />

              {!isLogin ? (
                <UserActionSection />
              ) : (
                <div className={'flex flex-row flex-1'}>
                  <UserMoneyStatusSectionItem
                    onClickToOpenNotificationDrawer={
                      props.onClickToOpenNotificationDrawer
                    }
                  />
                </div>
              )}
            </div>
          ),
          tablet: (
            <div
              className={'flex flex-row justify-between items-center w-full'}
            >
              <RWDLogo />
              <GameSearchSection />
              {!isLogin ? (
                <UserActionSection />
              ) : (
                <div className={'flex flex-row'}>
                  <UserMoneyStatusSectionItem
                    onClickToOpenNotificationDrawer={
                      props.onClickToOpenNotificationDrawer
                    }
                  />
                </div>
              )}
            </div>
          ),
          desktop: (
            <div className={'grid grid-cols-3 items-center w-full'}>
              <div>
                <RWDLogo />
              </div>

              <div className="flex justify-center w-full">
                <GameSearchSection />
              </div>

              <div>
                {!isLogin ? (
                  <UserActionSection />
                ) : (
                  <div className={'flex flex-row'}>
                    <UserMoneyStatusSectionItem
                      onClickToOpenNotificationDrawer={
                        props.onClickToOpenNotificationDrawer
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ),
        },
        devices
      )}
    </header>
  );
};
