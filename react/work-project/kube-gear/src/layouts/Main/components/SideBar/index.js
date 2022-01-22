import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from '../../GlobalContext';
import $ from 'jquery';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SideBar = ({ userInfo }) => {
  const { locale, isXdfsEnabled } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [userPrivilegeInfo, setUserPrivilegeInfo] = useState([]);
  const [treedata, setTreedata] = useState([]);

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
          isShow: !isXdfsEnabled
        },
        {
          key: 'glusterfs',
          title: t('glusterfs'),
          className: 'data-management--glusterfs',
          iconName: 'fa-object-group',
          href: '/glusterfs-item-list',
          isShow: !isXdfsEnabled
        },
        {
          key: 'xdfs',
          title: t('xdfs'),
          className: 'data-management--xdfs',
          iconName: 'fa-object-group',
          href: '/xdfs-item-list',
          isShow: isXdfsEnabled
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
          isShow: true
        },
        {
          key: 'JobManage',
          title: `${t('job')}${t('enSpace')}${t('management')}`,
          className: 'model-management--models',
          iconName: 'fa-tasks',
          href: '/job-detail',
          isShow: true
        },
        {
          key: 'Schedule',
          title: `${t('sideBar.schedule-arrangement')}`,
          className: 'model-training--schedule',
          iconName: 'far fa-calendar-check',
          href: '/schedule',
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
  }, [userPrivilegeInfo, locale, isXdfsEnabled]);

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
                            id={`sidebar-menu--${sub.className}`}
                            key={sub.className}
                            style={sub.isShow ? {} : { display: 'none' }}
                          >
                            {
                              sub.external ?
                                <a
                                  href={sub.href}
                                  target="_blank"
                                >
                                  <i
                                    className={`fa ${sub.iconName}`}
                                    style={sub?.adjustIconWidth ? { width: '14px' } : {}}
                                  />
                                  <span>{sub.title}</span>
                                </a>
                                :
                                <Link to={sub.href}>
                                  <i
                                    className={`fa ${sub.iconName}`}
                                    style={sub?.adjustIconWidth ? { width: '14px' } : {}}
                                  />
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
