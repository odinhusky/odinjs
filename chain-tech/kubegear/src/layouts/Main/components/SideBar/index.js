import React, { useState, useEffect, useContext } from 'react';


// ? context
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import BaseMuiIcon from 'components/BaseMuiIcon';

// ? styles
import './index.scss';

// ^ Plugins
import { Link } from 'react-router-dom';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';


const SideBar = ({ userInfo }) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%'
  };

  const baseMuiIconStyle = {
    width: 14,
    marginRight: 8
  };

  // ? context
  const { useSelector } = useContext(GlobalContext)

  // ^ redux
  const locale = useSelector(state => state.locale);

  // # states
  const [userPrivilegeInfo, setUserPrivilegeInfo] = useState([]);
  const [treedata, setTreedata] = useState([]);

  // & handled data
  const menuData = [
    // {
    //   key: 'dataLabeling',
    //   id: 'data-labeling',
    //   title: `${t('data')}${t('enSpace')}${t('labeling')}`,
    //   iconName: 'fa-tag',
    //   child: [
    //     {
    //       key: 'dataSet',
    //       title: `${t('data')}${t('enSpace')}${t('set')}`,
    //       className: 'data-labeling--data-sets',
    //       iconName: 'fa-tags',
    //       href: '/todo'
    //     },
    //     {
    //       key: 'teamLabeling',
    //       title: `${t('data')}${t('enSpace')}${t('labeling')}`,
    //       className: 'data-labeling--teams-labeling',
    //       iconName: 'fa-share-alt',
    //       href: '/data-labeling'
    //     }
    //   ]
    // },
    {
      key: 'dataManage',
      id: 'data-management',
      title: `${t('data')}${t('enSpace')}${t('management')}`,
      iconName: 'fa-database',
      child: [
        {
          key: 'NFS',
          title: t('NFS'),
          className: 'data-management--document-management',
          iconName: 'fa-inbox',
          href: '/fs-item-list',
          adjustIconWidth: true,
          isShow: true
        },
        {
          key: 'glusterfs',
          title: t('glusterfs'),
          className: 'data-management--glusterfs',
          iconName: 'fa-object-group',
          href: '/glusterfs-item-list',
          isShow: true
        }
      ]
    },
    {
      key: 'DevelopEnvironment',
      id: 'develop-environment',
      title: `${t('sideBar.develop-environment')}`,
      iconName: 'fa-cube',
      child: [
        {
          key: 'ImageManage',
          title: `${t('sideBar.repositories')}`,
          className: 'devlop-environment--repository',
          iconName: 'fa-cubes',
          href: '/repository',
          isShow: true
        },
        {
          key: 'TemplateManage',
          title: `${t('sideBar.template')}`,
          className: 'devlop-environment--template-manage',
          iconName: 'fa-columns',
          href: '/template-manage',
          isShow: true
        }
      ]
    },
    {
      key: 'ModelTraining',
      id: 'model-training',
      title: `${t('model')}${t('enSpace')}${t('training')}`,
      iconName: 'fa-space-shuttle',
      adjustIconWidth: true,
      child: [
        {
          key: 'SubmitJob',
          title: `${t('sideBar.job-submission')}`,
          className: 'model-training--submit-job',
          iconName: 'fa-plus-circle',
          href: '/job-submit',
          adjustIconWidth: true,
          isShow: true
        },
        {
          key: 'JobManage',
          title: `${t('job')}${t('enSpace')}${t('management')}`,
          className: 'model-management--models',
          iconName: 'fa-tasks',
          href: '/job-detail',
          adjustIconWidth: true,
          isShow: true
        },
        {
          key: 'ManageQueue',
          title: `${t('routeName.queue-manage')}`,
          className: 'model-management--queue',
          iconName: 'queue',
          href: '/queue-manage',
          isMuiIcon: true,
          isShow: true
        },
        {
          key: 'Schedule',
          title: `${t('sideBar.schedule-arrangement')}`,
          className: 'model-training--schedule',
          iconName: 'far fa-calendar-check',
          href: '/schedule',
          adjustIconWidth: true,
          isShow: true
        }
      ]
    }
    // {
    //   key: 'ModelManage',
    //   id: 'model-management',
    //   title: `${t('model')}${t('enSpace')}${t('management')}`,
    //   iconName: 'fa-chart-area',
    //   child: [
    //     {
    //       key: 'Model',
    //       title: t('model'),
    //       className: 'model-management--models',
    //       iconName: 'fab fa-modx',
    //       href: '/todo'
    //     },
    //     {
    //       key: 'CompressTransform',
    //       title: `${t('compress')}${t('enSpace')}${t('transform')}`,
    //       className: 'model-management--compress-transform',
    //       iconName: 'fa-exchange-alt',
    //       href: '/todo'
    //     }
    //   ]
    // }
  ];

  // - methods
  const authorized = menuDate => {
    const { admin: isAdmin } = userInfo;
    const flag = isAdmin;
    if (flag) {
      return menuData;
    } else {
      if (userPrivilegeInfo !== undefined && userPrivilegeInfo.length > 0) {
        return menuDate.map(item => {
          if (item.key === 'ModelTraining') {
            const arr = item.child.filter(childItem => {
              switch (childItem.key) {
                case 'SubmitJob':
                  return userPrivilegeInfo.some(childItem => childItem === 'JOB');
                case 'JobManage':
                  return userPrivilegeInfo.some(childItem => childItem === 'JOB');
                case 'ManageQueue':
                  return userPrivilegeInfo.some(childItem => childItem === 'JOB');
                case 'Schedule':
                  return userPrivilegeInfo.some(childItem => childItem === 'JOB');
                default:
                  return false;
              }
            });
            return {
              ...item,
              child: [...arr]
            };
          } else {
            return item;
          }
        });
      } else if (userInfo.state === 0) {
        // 待審批的帳號沒有menu
        return []
      } else if (userPrivilegeInfo !== undefined && userPrivilegeInfo.length === 0) {
        return menuDate.filter(item => {
          return item.key !== 'ModelTraining';
        });
      }
    }
  };

  // * hooks
  useEffect(() => {
    // TODOS: Maybe doesn't need jquery
    const treeviewEvent = function() {
      const windowWidth = $('body').width()
      if ($('body').hasClass('sidebar-collapse') && windowWidth > 767) return;
      if ($(this).parent('.treeview').hasClass('menu-open')) {
        $(this).parent('.treeview').toggleClass('menu-open');
        $(this).next().slideUp('fast');
      } else {
        $('.treeview').removeClass('menu-open');
        $('.treeview').find('.treeview-menu').slideUp('fast');
        $(this).parent('.treeview').toggleClass('menu-open');
        $(this).next().slideDown('fast');
      }
    }
    $('.sidebar-menu').on('click', '.treeview > a', treeviewEvent)
    return () => {
      $('.sidebar-menu').off('click', '.treeview > a', treeviewEvent)
    }
  }, []);

  useEffect(() => {
    const LinkEvent = function() {
      $('.treeview-menu > li').removeClass('active')
      $(this).addClass('active')
    }
    $('.sidebar-menu').on('click', '.treeview-menu > li', LinkEvent)
    return () => {
      $('.sidebar-menu').off('click', '.treeview-menu > li', LinkEvent)
    }
  }, []);

  useEffect(() => {
    if (userInfo.privileges)
      setUserPrivilegeInfo(userInfo.privileges)
  }, [userInfo])

  useEffect(() => {
    setTreedata(authorized(menuData));
  }, [userPrivilegeInfo, locale]);

  return (
    <aside className="main-sidebar">
      <section className="sidebar">
        <ul
          className="sidebar-menu"
          data-widget="tree"
        >
          {
            treedata && treedata.map(item => {
              if (item.child.length)
                return (
                  <li
                    className="treeview"
                    id={`sidebar-menu--${item.id}`}
                    key={item.id}
                  >
                    <a href="#">
                      <i
                        className={`fa ${item.iconName}`}
                        style={item?.adjustIconWidth ? { width: '14px' } : {}}
                      />
                      <span>{item.title}</span>
                      <span className="pull-right-container">
                        <i className="fa fa-angle-left pull-right" />
                      </span>
                    </a>
                    <ul className="treeview-menu">
                      {
                        item.child.map(sub => (
                          <li
                            className="treeview-menu-li"
                            id={`sidebar-menu--${sub.className}`}
                            key={sub.className}
                            style={sub.isShow ? {} : { display: 'none' }}
                          >
                            {
                              sub.external ?
                                <a
                                  href={sub.href}
                                  style={linkStyle}
                                  target="_blank"
                                >
                                  {
                                    sub.isMuiIcon ? (
                                      <BaseMuiIcon
                                        children={sub.iconName}
                                        style={baseMuiIconStyle}
                                      />
                                    ) : (
                                      <i
                                        className={`fa ${sub.iconName}`}
                                        style={sub?.adjustIconWidth ? { width: '14px' } : {}}
                                      />
                                    )
                                  }
                                  <span>{sub.title}</span>
                                </a>
                                :
                                <Link
                                  style={linkStyle}
                                  to={sub.href}
                                >
                                  {
                                    sub.isMuiIcon ? (
                                      <BaseMuiIcon
                                        children={sub.iconName}
                                        style={baseMuiIconStyle}
                                      />
                                    ) : (
                                      <i
                                        className={`fa ${sub.iconName}`}
                                        style={sub?.adjustIconWidth ? { width: '14px' } : {}}
                                      />
                                    )
                                  }
                                  <span>{sub.title}</span>
                                </Link>
                            }
                          </li>
                        ))
                      }
                    </ul>
                  </li>
                );
            })
          }
        </ul>
      </section>
    </aside>
  );
};

SideBar.propTypes = {
  userInfo: PropTypes.object
}

export default SideBar;
