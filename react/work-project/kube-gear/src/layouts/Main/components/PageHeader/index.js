import React, { useContext, useState, useEffect } from 'react';
import { resetUserInfoState } from '../../features/userinfo/userinfoSlice'
import { useDispatch } from 'react-redux'
import cookies from 'js-cookie';
import SwitchLangButton from './SwitchLangButton';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { theme } from 'theme';
import $ from 'jquery';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import GlobalContext from 'layouts/Main/GlobalContext';
import Notification from './Notification';

import { deleteToken } from 'utils/api';

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

  const {
    productVersion
  } = window.ENV

  const { t } = useTranslation();
  const { userInfo, systemSettingUrl, socketClient, isXdfsEnabled, asyncIsFileExist } = useContext(GlobalContext);
  const history = useHistory();

  const [isNotifycationDropdownOpen, setIsNotifycationDropdownOpen] = useState(false);
  const [hasNoRead, setHasNoRead] = useState(false);
  const [lostConnect, setLostConnect] = useState(false);
  const [svgExist, setSvgExist] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    asyncIsFileExist('/assets/img/trademark/pageHeaderIcon.svg')
      .then(res => setSvgExist(res))
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

  const checkPrivilege = allow => {
    if (isEmpty(userInfo.privileges)) return false

    return userInfo.privileges.some(role => allow.includes(role))
  }

  const hasGroup = !isEmpty(userInfo.leaderGroups) || checkPrivilege(['ADMIN']);

  const menuData = [
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
      isShow: checkPrivilege(['ADMIN', 'NFS', 'GLUSTERFS']) || isXdfsEnabled,
      children: [
        {
          icon: 'fas fa-inbox',
          name: `${t('NFS')}${t('enSpace')}${t('management')}`,
          link: '/nfs-disk-list',
          isShow: !isXdfsEnabled && checkPrivilege(['ADMIN', 'NFS'])
        },
        {
          icon: 'fas fa-object-group',
          name: `${t('glusterfs')}${t('enSpace')}${t('management')}`,
          link: '/glusterfs',
          isShow: !isXdfsEnabled && checkPrivilege(['ADMIN', 'GLUSTERFS'])
        },
        {
          icon: 'fas fa-object-group',
          name: `${t('xdfs')}${t('enSpace')}${t('management')}`,
          link: '/xdfs',
          isShow: isXdfsEnabled && checkPrivilege(['ADMIN', 'NFS'])
        }
      ]
    },
    {
      icon: 'far fa-calendar-alt',
      name: `${t('topBar.schedule-system')}`,
      isShow: checkPrivilege(['JOB']) || hasGroup,
      children: [
        {
          icon: 'far fa-calendar-check',
          name: `${t('schedule')}${t('enSpace')}${t('management')}`,
          link: '/schedule-manage',
          isShow: hasGroup
        },
        {
          icon: 'fas fa-tasks',
          name: `${t('job')}${t('enSpace')}${t('management')}`,
          link: '/job-detail',
          isShow: checkPrivilege(['ADMIN', 'JOB'])
        }
        // {
        //   icon: 'fas fa-columns',
        //   name: `${t('template')}${t('enSpace')}${t('management')}`,
        //   link: '/template-manage',
        //   isShow: true
        // }
      ]
    }
  ]

  return (
    <header className="main-header">
      <StyledLink
        className="logo logo-link"
        to="/entry"
      >
        <span className="logo-mini">
          {
            svgExist &&
            <img
              className="main-logo-icon"
              src="/assets/img/trademark/pageHeaderIcon.svg"
            />
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
                    >
                      <i className={firstMenu.icon} />
                      <span className="hidden-xs hidden-sm"> {firstMenu.name}</span>
                    </StyledToggleButton>
                    <ul className="dropdown-menu">
                      {
                        firstMenu.children.map(item => (
                          item.isShow &&
                            <li key={item.name}>
                              <Link
                                onClick={() => resetSidebar()}
                                to={item.link}
                              >
                                <i className={item.icon} />
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
                    style={{ display: firstMenu.isShow ? 'block' : 'none' }}
                  >
                    <StyledToggleButton
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                      href="#"
                    >
                      <i className={firstMenu.icon} />
                      <span className="hidden-xs"> {firstMenu.name}</span>
                    </StyledToggleButton>
                  </li>
              ))
            }
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
            <SwitchLangButton
              setIsNotifycationDropdownOpen={setIsNotifycationDropdownOpen}
            />
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
                <li>
                  <Link
                    onClick={() => resetSidebar()}
                    to="/version-log"
                  >
                    <i className="fas fa-book" />
                    {t('version')}{t('enSpace')}{t('log')}
                  </Link>
                </li>
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
