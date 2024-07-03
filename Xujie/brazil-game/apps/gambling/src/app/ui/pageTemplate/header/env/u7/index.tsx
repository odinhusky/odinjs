import cx from 'classnames';
import { UserMoneyStatusSection } from '../../UserMoneyStatusSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { IUserInfo } from '../../../../../persistant/IUserInfo';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { NotificationAnimationIcon } from '../../../../components-bs/Icons/animation/NotificationAnimationIcon';
import { IHeader } from '../../types/IHeader';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { appSlice } from '../../../../../reduxStore/appSlice';
import { CacheImage } from '../../../../components/image/CacheImage';
import { environment } from '../../../../../../environments/environment';
import useBreakpoint from '../../../hooks/useBreakpoint';
import { Avatar } from '../../../../components/Avatar';
import { useEffect, useState } from 'react';
import { InputValue } from '../../../../components-bs/Inputs/Input';
import { useSearchGames } from '../../../../hooks/useSearchGames';
import { X_CENTER } from 'apps/gambling/src/assets/constant/style';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';

export const Header = (props: IHeader) => {
  const user: IUserInfo = JSON.parse(
    AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}'
  );

  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const messageCount = useSelector(
    (state: RootState) => state.app.messageCount
  );
  const vip_level = useSelector((state: RootState) => state.app.vip_level);

  const currentUserVipLevel = vip_level || user.vip_level;
  const { openUserInfoStatusPopover, openMenuDrawer } = useSelector(
    (state: RootState) => state.ui
  );
  const { onClickToProfile, onClickGameItem } = usePageNavigate();
  const dispatch = useDispatch();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const [searchInput, setSearchInput] = useState<InputValue<string>>({
    data: '',
    isValidation: true,
    errorMessage: '',
  });
  const [drawerVisible, setDrawerVisible] = useState(0);
  const [isFocus, setIsFocus] = useState(0);
  const { searchResults, handleSearchGames } = useSearchGames(searchInput.data);
  useEffect(() => {
    handleSearchGames(searchInput.data);
  }, [searchInput.data]);

  return (
    <header
      className={cx(
        'z-[1001] sticky top-[0]',
        'flex flex-row justify-between items-center relative',
        'tablet:px-20 mobile:px-8 px-4 mobile:py-3 py-[10px]',
        'mobile:px-9',
        'tablet:px-12',
        'bg-header',
        'shadow-[0px_4px_20px_0px_#00000080]',
        'gap-2'
      )}
    >
      <div className="flex gap-2 items-center">
        {/* 移动端菜单 */}
        <div
          className="mobile:w-10 mobile:h-10 w-[30px] h-[30px] rounded-lg bg-[var(--transparent-white-10)] p-2 block tablet:hidden cursor-pointer"
          onClick={() => {
            // TODO 抽屉
            dispatch(uiSlice.actions.setOpenMenuDrawer(!openMenuDrawer));
          }}
        >
          <img
            className="h-full"
            alt="logo"
            src={`assets/${environment.uVersion}/icon_menu.png`}
          />
        </div>
        {/* 余额 */}
        {isLogin &&
          ((location.pathname !== PageOrModalPathEnum.GameHallPage &&
            isMobile) ||
            isTablet) && (
            <div className="myDiv">
              <UserMoneyStatusSection
                className="gap-1 tablet:hidden flex mobile:h-10 h-[30px] rounded-full 
            bg-[linear-gradient(91.12deg,#291650_2.13%,#533188_96.22%)]
            shadow-[0px_0px_4px_0px_#A974FF99_inset] w-full ml-0 "
                textClassName="truncate"
              />
            </div>
          )}
        {/* 搜索框 */}
        {((location.pathname === PageOrModalPathEnum.GameHallPage &&
          isMobile) ||
          isTablet ||
          isDesktop) && (
          <div className="relative mobile:h-10 h-[30px]">
            <div
              className={cx(
                'relative flex gap-2 mobile:w-80 w-auto mobile:h-10 h-[30px]',
                'mobile:bg-[var(--grayscale-20)] bg-[var(--grayscale-25)] mobile:hover:bg-[var(--grayscale-25)] hover:bg-[var(--grayscale-40)]',
                'border-solid border border-transparent rounded-full p-2 justify-center items-center',
                {
                  ' border-[var(--grayscale-40)]':
                    isFocus || drawerVisible == 1,
                }
              )}
            >
              <img
                className={cx('h-full', {
                  'brightness-200': drawerVisible === 1 || isFocus === 1,
                })}
                alt="logo"
                src={`assets/${environment.uVersion}/icon_search.png`}
              />
              <input
                placeholder="Procurar"
                className="w-full h-full text-base text-[var(--grayscale-100)] font-medium bg-transparent 
              outline-none placeholder:text-base placeholder:font-medium placeholder:text-[var(--grayscale-70)]"
                onChange={(e) => {
                  setSearchInput({
                    data: e.target.value,
                    isValidation: true,
                    errorMessage: '',
                  });
                  setDrawerVisible(e.target.value == '' ? 0 : 1);
                }}
                onFocus={(e) => {
                  setIsFocus(1);
                }}
                onBlur={(e) => {
                  setIsFocus(0);
                }}
              />
            </div>
            {/* 搜索信息 */}
            {searchResults.length > 0 ? (
              <div
                className={cx(
                  'absolute max-h-[216px] overflow-scroll overscroll-y-contain top-14',
                  'bg-[var(--grayscale-10)] shadow-[0px_4px_4px_0px_#00000040] rounded',
                  {
                    hidden: drawerVisible === 0,
                    'btn-header-main border-solid border border-[var(--grayscale-30)]':
                      isMobile,
                  }
                )}
              >
                {searchResults.map((data: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="group relative flex gap-2 text-base text-[var(--grayscale-100)] w-80 h-12 items-center font-medium cursor-pointer"
                      onClick={() => {
                        // 选中直接进入游戏
                        onClickGameItem(data);
                        setDrawerVisible(0);
                      }}
                    >
                      <div className="absolute w-full h-full bg-[var(--grayscale-100)] opacity-10 group-hover:block hidden" />
                      <img
                        className="h-3/4 rounded pl-2"
                        src={`${environment.s3URLImages}/${data.gameId}-small.png`}
                        alt="gameIcon"
                      />
                      {data.name}
                    </div>
                  );
                })}
              </div>
            ) : (
              ''
            )}
          </div>
        )}
      </div>

      <div
        className={cx('flex mobile:gap-3 gap-2 justify-center items-center', {
          'flex-row-reverse mobile:flex-row': !isLogin,
        })}
      >
        {!isLogin && (
          // 登录注册按钮
          <div
            className={cx(
              'flex-1 flex justify-end',
              'font-bold text-[var(--grayscale-100)]',
              'gap-x-2 h-[30px]',
              'mobile:gap-x-3 mobile:h-9',
              'tablet:h-9'
            )}
          >
            <button
              className="border-popup-button bg-linear-6-main text-sm mobile:w-[120px] w-[100px] mobile:h-10 h-[30px] rounded-full p-[1px] font-bold"
              onClick={() => {
                dispatch(appSlice.actions.showLoginDrawerOrModal(true));
                dispatch(appSlice.actions.setLoginUIStatusType('login'));
              }}
            >
              {'Entrar'}
            </button>
            <button
              className="border-popup-button bg-linear-6-main text-sm mobile:w-[120px] w-[100px] mobile:h-10 h-[30px] rounded-full p-[1px] font-bold"
              onClick={() => {
                dispatch(appSlice.actions.showLoginDrawerOrModal(true));
                dispatch(appSlice.actions.setLoginUIStatusType('register'));
              }}
            >
              {'Registro'}
            </button>
          </div>
        )}

        {/* 搜索游戏按钮, 只在手机端显示 且 在游戏大厅不显示  */}
        {isMobile && isLogin && location.pathname !== PageOrModalPathEnum.GameHallPage && (
          <div
            className={
              'group bg-[var(--grayscale-25)] active:bg-[var(--grayscale-40)] p-[9px] rounded-full cursor-pointer'
            }
            onClick={() => {
              if (isDesktop) {
                dispatch(uiSlice.actions.setUserInfoStatusPopover(false));
              }
              dispatch(appSlice.actions.setShowGameSearchModal(true));
            }}
          >
            <CacheImage
              className={cx(
                'mx-auto my-auto w-3 h-3 group-hover:brightness-200'
              )}
              alt="info"
              src={`assets/${environment.uVersion}/icon_search.png`}
            />
          </div>
        )}

        {/* 客服 */}
        <div
          className="btn-header group relative mobile:w-10 mobile:h-10 w-[30px] h-[30px] rounded-full shadow-[0px_0px_4px_0px_#FFFFFF80_inset] p-1"
          onClick={() => {
            if (isDesktop) {
              dispatch(uiSlice.actions.setUserInfoStatusPopover(false));
            }
            dispatch(appSlice.actions.setShowTelegramDetailContactModal(true));
          }}
        >
          <img
            className="mx-auto my-auto "
            src={`assets/${environment.uVersion}/icon_custom_service.png`}
            alt="custom_service"
          />
          <div
            className={cx(
              X_CENTER,
              'bg-popup1 absolute w-[86px] h-8 text-xs rounded-lg text-[var(--grayscale-80)] leading-8',
              'shadow-[0px_4px_4px_0px_#00000040,0px_0px_4px_0px_#FFFFFF80_inset] text-center top-11 hidden group-hover:block group-active:block'
            )}
          >
            Contate-nos
          </div>
        </div>
        {isLogin && (
          <>
            {/* 用户头像信息 */}
            <div
              className="btn-header relative group mobile:w-10 mobile:h-10 w-[30px] h-[30px] rounded-full shadow-[0px_0px_4px_0px_#FFFFFF80_inset] p-1 tablet:block hidden cursor-pointer"
              onClick={() => {
                isDesktop
                  ? dispatch(
                      uiSlice.actions.setUserInfoStatusPopover(
                        !openUserInfoStatusPopover
                      )
                    )
                  : onClickToProfile();
              }}
            >
              <CacheImage
                className={cx(
                  'mx-auto my-auto'
                  // openUserInfoStatusPopover ? 'rotate-180' : 'rotate-0'
                )}
                alt="info"
                src={`assets/${environment.uVersion}/icon_info.png`}
              />
              <div
                className={cx(
                  X_CENTER,
                  'bg-popup1 absolute text-xs rounded-lg text-[var(--grayscale-80)] p-2 whitespace-nowrap',
                  'shadow-[0px_4px_4px_0px_#00000040,0px_0px_4px_0px_#FFFFFF80_inset] text-center top-11 hidden group-hover:block group-active:block'
                )}
              >
                Informação do usuário
              </div>
            </div>
            {/* 通知 */}
            <div
              className={
                'relative btn-header relative group mobile:w-10 mobile:h-10 w-[30px] h-[30px] rounded-full shadow-[0px_0px_4px_0px_#FFFFFF80_inset] p-1 cursor-pointer'
              }
              onClick={() => {
                if (isDesktop) {
                  dispatch(uiSlice.actions.setUserInfoStatusPopover(false));
                }
                props.onClickToOpenNotificationDrawer();
              }}
            >
              <NotificationAnimationIcon
                className={cx('object-cover mx-auto my-auto hover:opacity-100')}
                messageCount={messageCount}
                badgeBgColor="#ED3434"
              />
              <div
                className={cx(
                  X_CENTER,
                  'bg-popup1 absolute text-xs rounded-lg text-[var(--grayscale-80)] p-2 whitespace-nowrap',
                  'shadow-[0px_4px_4px_0px_#00000040,0px_0px_4px_0px_#FFFFFF80_inset] text-center top-11 hidden group-hover:block group-active:block'
                )}
              >
                Notificar
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
