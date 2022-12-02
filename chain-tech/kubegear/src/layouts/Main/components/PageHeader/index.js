import React, {
  useContext,
  useState,
  useEffect,
  useMemo
} from 'react';

// ^ Redux
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';
import { selectIsShowGuide, selectCurrentStep, changeGuideShow } from 'layouts/Main/features/guide/guideSlice';

// # API
import { deleteToken } from 'utils/api';

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { resetUserInfoState } from '../../features/userinfo/userinfoSlice'
import SwitchLangButton from './SwitchLangButton';
import Notification from './Notification';
import BaseMuiIcon from 'components/BaseMuiIcon';

// ^ Plugins
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { theme } from 'theme';
import $ from 'jquery';
import { isEmpty } from 'lodash';
import cookies from 'js-cookie';
import { useLocation } from 'react-router-dom'

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme)
  }});

import styled from 'styled-components';

const StyledLink = styled(Link)`
  background-color: ${theme.themePageHeaderPrimary};
  &:hover, &:active {
    background-color: ${theme.themePageHeaderPrimaryHover};
  }
`;

const StyledNav = styled.nav`
  background-color: ${theme.themePageHeaderPrimary};
`;

const StyledToggleButton = styled.a`
  .open & {
    background-color: ${theme.themePageHeaderPrimaryHover} !important;
  }
  &:hover {
    background-color: ${theme.themePageHeaderPrimaryHover} !important;
  }
`;

const resetSidebar = () => {
  $('.treeview-menu > li').removeClass('active')
}

const PageHeader = () => {

  // $ init data
  const {
    productVersion,
    isShowVersionLog
  } = window.ENV
  const location = useLocation();
  const path = location.pathname;
  const { t } = useTranslation();
  const history = useHistory();
  const isSmallTablet = useMediaQuery('(max-width: 1024px)');

  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%'
  };

  const baseMuiIconStyle = {
    marginRight: 6,
    width: 20
  };

  const firstMuiIconStyle = {
    marginRight: 5,
    width: 14
  };

  // = styles
  const classes = useStyles();

  // ? context
  const {
    isAdmin,
    systemSettingUrl,
    socketClient,
    asyncIsFileExist,
    dispatch,
    useSelector
  } = useContext(GlobalContext);

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);
  const isShowGuide = useSelector(selectIsShowGuide);
  const currentStep = useSelector(selectCurrentStep);

  // # states
  const [isNotifycationDropdownOpen, setIsNotifycationDropdownOpen] = useState(false);
  const [hasNoRead, setHasNoRead] = useState(false);
  const [lostConnect, setLostConnect] = useState(false);
  const [svgMiniExist, setSvgMiniExist] = useState(false);
  const [svgExist, setSvgExist] = useState(false);

  useEffect(() => {
    asyncIsFileExist('/assets/img/trademark/pageHeaderIcon.svg')
      .then(res => setSvgExist(res))
    asyncIsFileExist('/assets/img/trademark/pageHeaderIconMini.svg')
      .then(res => setSvgMiniExist(res))
  }, [])

  useEffect(() => {
    if (isNotifycationDropdownOpen) {
      const dropdown = $('.notification-dropdown')
      $(window).on('click', (e) => {
        if (!dropdown.is(e.target) && dropdown.has(e.target).length == 0) {
          setIsNotifycationDropdownOpen(false)
        }
      })

      return () => $(window).off('click')
    }
  }, [isNotifycationDropdownOpen])

  // - methods
  /**
   * @author odin
   * @description 根據現在的路徑來判斷要不要顯示開啟引導的按鈕
   * @returns {boolean}
  */
  const isShowOpenGuide = () => {
    switch(path) {
      case '/entry':
        return true;
      default:
        return false;
    }
  }

  /**
   * @author odin
   * @description 點擊引導的選項就打開引導頁面，並且如果這時候側欄有收合的話就把它打開避免引導的定位跑掉
  */
  const handleGuideShow = (e) => {
    e.preventDefault();
    const hasCollapse = $('body').hasClass('sidebar-collapse');

    // 判斷是否要展開側欄
    if(hasCollapse) {
      $('body').removeClass('sidebar-collapse');
    }

    // 開啟引導模式
    dispatch(changeGuideShow(true));
  }

  const handleLogout = async() => {
    try {
      await deleteToken(cookies.get('token'))
      cookies.remove('user');
      cookies.remove('token');
      cookies.remove('admin');
      socketClient.deactivate();
      history.push('/')
      dispatch(resetUserInfoState())
    } catch (_) {
      // ! do nothing
      _;
    }
  }

  const checkPrivilege = useMemo(() => (allow => {
    if (isEmpty(userInfo.privileges)) return false

    return userInfo.privileges.some(role => allow.includes(role))
  }), [userInfo.privileges]);

  const hasGroup = !isEmpty(userInfo.leaderGroups) || checkPrivilege(['ADMIN']);

  const menuData = useMemo(() => ([
    {
      icon: 'fas fa-user-cog',
      name: `${t('topBar.users')}`,
      isShow: checkPrivilege(['ADMIN', 'USER']) || hasGroup,
      children: [
        {
          icon: 'fas fa-user',
          name: `${t('User')}${t('enSpace')}${t('management')}`,
          link: '/user-manage',
          isShow: checkPrivilege(['ADMIN', 'USER'])
        },
        {
          icon: 'fas fa-users',
          name: `${t('group2')}${t('enSpace')}${t('management')}`,
          link: '/group-manage',
          isShow: hasGroup
        },
        {
          icon: 'far fa-user',
          name: `${t('role')}${t('enSpace')}${t('management')}`,
          link: '/role-list',
          isShow: checkPrivilege(['ADMIN'])
        },
        {
          icon: 'far fa-list-alt',
          name: `${t('routeName.loginlog')}`,
          link: '/loginlog',
          isShow: checkPrivilege(['ADMIN'])
        }
      ]
    },
    {
      icon: 'fas fa-project-diagram',
      name: `${t('topBar.resource-configuration')}`,
      isShow: checkPrivilege(['VIRTUAL_CLUSTER', 'ADMIN']) || checkPrivilege(['ADMIN']) || checkPrivilege(['ADMIN', 'KEY']),
      children: [
        {
          icon: 'fas fa-sitemap',
          name: `${t('resource')}${t('enSpace')}${t('management')}`,
          link: '/resource-manage',
          isShow: checkPrivilege(['ADMIN'])
        },
        {
          icon: 'fas fa-chart-pie',
          name: `${t('group')}${t('enSpace')}${t('management')}`,
          link: '/virtual-groups',
          isShow: checkPrivilege(['VIRTUAL_CLUSTER', 'ADMIN'])
        },
        {
          icon: 'far fa-hdd',
          name: `${t('node')}${t('enSpace')}${t('management')}`,
          link: '/cluster-view/hardware',
          isShow: checkPrivilege(['ADMIN'])
        },
        {
          icon: 'fas fa-chart-line',
          name: `${t('report')}${t('enSpace')}${t('Analysis')}`,
          link: '/cluster-report',
          isShow: checkPrivilege(['ADMIN'])
        },
        {
          icon: 'fas fa-key',
          name: `${t('license')}${t('enSpace')}${t('management')}`,
          link: '/license-list',
          isShow: checkPrivilege(['ADMIN', 'KEY'])
        }
      ]
    },
    {
      icon: 'fas fa-warehouse',
      name: `${t('topBar.storage')}`,
      isShow: checkPrivilege(['ADMIN', 'NFS']),
      children: [
        {
          icon: 'fas fa-inbox',
          name: `${t('NFS')}${t('enSpace')}${t('management')}`,
          link: '/nfs-disk-list',
          isShow: checkPrivilege(['ADMIN', 'NFS'])
        },
        {
          icon: 'fas fa-object-group',
          name: `${t('glusterfs')}${t('enSpace')}${t('management')}`,
          link: '/glusterfs',
          isShow: checkPrivilege(['ADMIN', 'GLUSTERFS'])
        }
      ]
    },
    {
      icon: 'task',
      name: `${t('topBar.admin-management')}`,
      isShow: checkPrivilege(['JOB']) || hasGroup,
      isMuiIcon: true,
      children: [
        {
          icon: 'fas fa-tasks',
          name: `${t('job')}${t('enSpace')}${t('management')}`,
          link: '/job-detail',
          isShow: checkPrivilege(['ADMIN', 'JOB'])
        },
        {
          icon: 'queue',
          name: `${t('routeName.queue-manage')}`,
          link: '/queue-manage',
          isMuiIcon: true,
          isShow: checkPrivilege(['ADMIN'])
        },
        {
          icon: 'far fa-calendar-check',
          name: `${t('schedule')}${t('enSpace')}${t('management')}`,
          link: '/schedule-manage',
          isShow: checkPrivilege(['ADMIN'])
        }
        // {
        //   icon: 'fas fa-columns',
        //   name: `${t('template')}${t('enSpace')}${t('management')}`,
        //   link: '/template-manage',
        //   isShow: true
        // }
      ]
    }
  ]), [t, checkPrivilege]);

  return (
    <header
      className={`
        main-header
        ${(isShowGuide === true
          && (isAdmin ? currentStep === 7 : currentStep === 6)
          && isSmallTablet === false) && classes.guideShowZIndex}
      `}
    >
      <StyledLink
        className="logo logo-link"
        to="/entry"
      >
        <span className="logo-mini">
          {
            svgMiniExist
              ?
              <img
                className="main-logo-icon"
                src="/assets/img/trademark/pageHeaderIconMini.svg"
              />
              :
              svgExist
                ?
                <img
                  className="main-logo-icon"
                  src="/assets/img/trademark/pageHeaderIcon.svg"
                />
                :
                <></>
          }
        </span>
        <span className="logo-lg">
          {
            svgExist &&
            <>
              <img
                className="main-logo-icon"
                src="/assets/img/trademark/pageHeaderIcon.svg"
              />
              {productVersion && <div className="logo-lg-version">{productVersion}</div>}
            </>
          }
        </span>
      </StyledLink>
      <StyledNav
        className="navbar navbar-static-top"
        role="navigation"
      >
        <StyledToggleButton
          className="sidebar-toggle"
          data-toggle="push-menu"
          onClick={() => {
            $('body').toggleClass('sidebar-collapse');
          }}
          role="button"
        >
          <i className="fas fa-bars" />
        </StyledToggleButton>
        <div className="navbar-custom-menu">
          <ul
            className="nav navbar-nav"
            id="navbar"
          >
            {/* 使用者、資源、儲存、管理 */}
            {
              menuData.map(firstMenu => (
                firstMenu && !firstMenu.link ?
                  <li
                    className="dropdown"
                    key={firstMenu.name}
                    style={{ display: firstMenu.isShow ? 'block' : 'none' }}
                  >
                    <StyledToggleButton
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                      href="#"
                      onClick={() => setIsNotifycationDropdownOpen(false)}
                      style={linkStyle}
                    >
                      {
                        firstMenu.isMuiIcon ? (
                          <BaseMuiIcon
                            children={firstMenu.icon}
                            style={firstMuiIconStyle}
                          />
                        ) : (
                          <i
                            className={firstMenu.icon}
                            style={firstMuiIconStyle}
                          />
                        )
                      }
                      <span className="hidden-xs hidden-sm"> {firstMenu.name}</span>
                    </StyledToggleButton>
                    <ul className="dropdown-menu">
                      {
                        firstMenu.children.map(item => (
                          item.isShow &&
                            <li key={item.name}>
                              <Link
                                onClick={() => resetSidebar()}
                                style={linkStyle}
                                to={item.link}
                              >
                                {
                                  item.isMuiIcon ? (
                                    <BaseMuiIcon
                                      children={item.icon}
                                      style={baseMuiIconStyle}
                                    />
                                  ) : (
                                    <i className={item.icon} />
                                  )
                                }
                                {item.name}
                              </Link>
                            </li>
                        ))
                      }
                    </ul>
                  </li>
                  :
                  <li
                    className="dropdown"
                    key={firstMenu.name}
                    onClick={() => history.push(firstMenu.link)}
                    style={{
                      display: firstMenu.isShow ? 'block' : 'none'
                    }}
                  >
                    <StyledToggleButton
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                      href="#"
                      style={linkStyle}
                    >
                      {
                        firstMenu.isMuiIcon ? (
                          <BaseMuiIcon
                            children={firstMenu.iconName}
                            style={baseMuiIconStyle}
                          />
                        ) : (
                          <i className={firstMenu.icon} />
                        )
                      }
                      <span className="hidden-xs"> {firstMenu.name}</span>
                    </StyledToggleButton>
                  </li>
              ))
            }

            {/* 通知 */}
            <li className="dropdown">
              <StyledToggleButton
                className="dropdown-toggle"
                data-toggle="dropdown"
                href="#"
                onClick={() => setIsNotifycationDropdownOpen(prev => !prev)}
              >
                <i className="far fa-bell" />
                {
                  hasNoRead && !lostConnect &&
                  <i className="notice-circle" />
                }
                {
                  lostConnect &&
                  <div className="notice-disconnect" />
                }
                <span className="hidden-xs hidden-sm"> {t('notification')}</span>
              </StyledToggleButton>
              <Notification
                closeDropDown={() => setIsNotifycationDropdownOpen(false)}
                isNotifycationDropdownOpen={isNotifycationDropdownOpen}
                lostConnect={lostConnect}
                setHasNoRead={setHasNoRead}
                setLostConnect={setLostConnect}
                userInfo={userInfo}
              />
            </li>

            {/* 語系切換 */}
            <SwitchLangButton
              setIsNotifycationDropdownOpen={setIsNotifycationDropdownOpen}
            />

            {/* 個人資訊 */}
            <li className="dropdown">
              <StyledToggleButton
                className="dropdown-toggle"
                data-toggle="dropdown"
                href="#"
              >
                <i className="fa fa-user-circle" />
                <span className="hidden-xs"> {t('welcome')}, {userInfo.username} </span>
              </StyledToggleButton>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    onClick={() => resetSidebar()}
                    to="/user-info"
                  >
                    <i className="far fa-user-circle" />
                    {t('userInfo')}
                  </Link>
                </li>

                {/* 顯示導覽頁 */}
                {
                  isShowOpenGuide() &&
                  <li>
                    <a
                      href="#"
                      onClick={(e) => { handleGuideShow(e) }}
                    >
                      <i className="fa fa-info-circle" />
                      {t('guide.guide')}
                    </a>
                  </li>
                }
                {
                  checkPrivilege(['SYSTEM', 'ADMIN']) &&
                  <li>
                    <Link
                      onClick={() => resetSidebar()}
                      to="/system-setting"
                    >
                      <i className="fas fa-cog" />
                      {t('system')}{t('enSpace')}{t('setting')}
                    </Link>
                  </li>
                }
                <li>
                  <a
                    href={systemSettingUrl}
                    target="_blank"
                  >
                    <i className="fa fa-question-circle" />
                    {t('support')}
                  </a>
                </li>
                {
                  isShowVersionLog &&
                  <li>
                    <Link
                      onClick={() => resetSidebar()}
                      to="/version-log"
                    >
                      <i className="fas fa-book" />
                      {t('version')}{t('enSpace')}{t('log')}
                    </Link>
                  </li>
                }

                <li>
                  <a
                    href="#"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt" />
                    {t('logout')}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </StyledNav>
    </header>
  );
};

PageHeader.propTypes = {
  userInfo: PropTypes.object,
  systemSettingUrl: PropTypes.string
}

export default PageHeader;
