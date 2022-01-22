import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Refresh } from '@material-ui/icons';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';
import { PrimaryButton, DefaultButton, IconButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BaseLink from 'components/BaseLink';
import BasePaper from 'components/BaseMuiPaper';

import Ordering from '../../Ordering'
import Context from '../../Context';
import CreateModal from './CreateModal';
import GlobalContext from 'layouts/Main/GlobalContext'
import ConfirmModal from 'components/ConfirmModal';
import EditModal from './EditModal';

import style from '../scss/index.module.scss';
import { deleteGroup } from 'utils/api';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  },
  iconClearMarginLeft: {
    marginLeft: 0
  }
}))

const SubGroup = ({ group }) => {
  const { isMenuLoading, getMenuData, setSelectedItem } = useContext(Context);
  const { userInfo, setUserInfo } = useContext(GlobalContext);
  const classes = useStyles();
  const groupData = !isEmpty(group.children) ? group.children : []
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [ordering, setOrdering] = useState(new Ordering());
  const [modalData, setModalData] = useState({});
  const [isModalShow, setIsModalShow] = useState(false);
  const [isConfirmModalShow, setIsConfirmModalShow] = useState(false);
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const applySortProps = column => {
    column.isSorted = ordering.field === column.id;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, column) => {
      const { field, descending } = ordering;
      if (field === column) {
        if (descending) {
          setOrdering(new Ordering());
        } else {
          setOrdering(new Ordering(field, true));
        }
      } else {
        setOrdering(new Ordering(column));
      }
    }
    return column;
  }

  const onDelete = name => {
    deleteGroup(name)
      .then(() => {
        if (userInfo.leaderGroups && userInfo.leaderGroups.includes(name)) {
          setUserInfo(prev => ({ ...prev, leaderGroups: prev.leaderGroups.filter(group => group !== name) }))
        } else {
          getMenuData();
        }
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
  }

  return (
    <div className={style.container}>
      <div className={style.topBar}>
        <div>
          <PrimaryButton
            children={`${t('add')}${t('enSpace')}${t('SubTeam')}`}
            classes={{
              root: classes.marginRight10,
              startIcon: classes.iconClearMarginLeft
            }}
            onClick={() => setIsModalShow(true)}
            startIcon={<Icon>add</Icon>}
          />
          <DefaultButton
            children={t('refresh')}
            disabled={isMenuLoading}
            onClick={getMenuData}
            startIcon={<Refresh />}
          />
        </div>
        <div>
          <MuiAutocomplete
            classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
            value={keyword}
          />
        </div>
      </div>
      {
        isMenuLoading
          ?
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </div>
          :
          isEmpty(groupData)
            ? <p style={{ padding: 20 }}>{`${t('SubTeam')}${t('enSpace')}${t('isEmpty')}`}</p>
            :
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <BasePaper
                columns={[
                  applySortProps({
                    id: 'name',
                    key: 'name',
                    label: t('name')
                  }),
                  applySortProps({
                    id: 'leaders',
                    key: 'leaders',
                    label: t('TeamLeader'),
                    onTableCellRender: (info) => {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {info.leaders.map(leader =>
                            <span
                              key={leader}
                              style={{ padding: '2px 0' }}
                            >
                              {leader}
                            </span>
                          )}
                        </div>
                      )
                    }
                  }),
                  applySortProps({
                    id: 'users',
                    key: 'users',
                    label: t('TeamMember'),
                    onTableCellRender: (info) => {
                      const userData = info.users;
                      return (
                        <>
                          {
                            isEmpty(info.users)
                              ? <span>{userData.length}</span>
                              :
                              <Tooltip
                                title={
                                  userData.length > 0
                                    ? userData.map(user => <div key={user}>{user}</div>)
                                    : ''
                                }
                              >
                                <div>
                                  {userData.length}
                                </div>
                              </Tooltip>
                          }
                        </>
                      )
                    }
                  }),
                  applySortProps({
                    id: 'resources',
                    key: 'resources',
                    label: t('resourceList'),
                    onTableCellRender: (info) => {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {
                            isEmpty(info.resources)
                              ? <span>-</span>
                              :
                              info.resources.map(resource =>
                                <BaseLink
                                  key={resource}
                                  style={{ padding: '2px 0 !important' }}
                                  to={`/resource-manage?selectedItem=${resource}`}
                                >{resource}</BaseLink>
                              )
                          }
                        </div>
                      )
                    }
                  }),
                  applySortProps({
                    id: 'children',
                    key: 'children',
                    label: t('SubTeamList'),
                    onTableCellRender: (info) => {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {
                            isEmpty(info.children)
                              ? <span>-</span>
                              : info.children.map(child =>
                                <Link
                                  key={child.name}
                                  onClick={() => {
                                    setSelectedItem(child.name)
                                  }}
                                  style={{ padding: '2px 0 !important', cursor: 'pointer' }}
                                >
                                  {child.name}
                                </Link>
                              )
                          }
                        </div>
                      )
                    }
                  }),
                  {
                    id: 'edit',
                    key: 'edit',
                    label: t('Edit'),
                    onTableCellRender: (info) => {
                      return (
                        <IconButton
                          children={<Icon>drive_file_rename_outline</Icon>}
                          onClick={() => {
                            setIsEditModalShow(true)
                            setSelectedGroup(info)
                          }}
                        />
                      )
                    }
                  },
                  {
                    id: 'delete',
                    key: 'delete',
                    label: t('delete'),
                    onTableCellRender: (info) => {
                      return (
                        <IconButton
                          children={<Icon>delete_outline</Icon>}
                          onClick={() => {
                            setIsConfirmModalShow(true)
                            setModalData({
                              title: `${t('delete')}${t('enSpace')}${t('SubTeam')}`,
                              content: t('sureDelete', { name: info.name }),
                              confrimText: t('delete'),
                              method: () => onDelete(info.name)
                            })
                          }}
                        />
                      )
                    }
                  }
                ]}
                labelRowsPerPage={t('labelRowsPerPage')}
                ordering={ordering}
                page={page}
                rows={ordering.apply(groupData.filter(item => item.name.includes(keyword)))}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
      }
      {
        isModalShow &&
        <CreateModal
          groupName={group.name}
          isOpen={isModalShow}
          onClose={() => setIsModalShow(false)}
        />
      }
      {
        isEditModalShow &&
        <EditModal
          group={selectedGroup}
          isOpen={isEditModalShow}
          onClose={() => setIsEditModalShow(false)}
        />
      }
      {
        isConfirmModalShow &&
        <ConfirmModal
          confrimText={modalData.confrimText}
          content={modalData.content}
          isOpen={isConfirmModalShow}
          onClose={() => setIsConfirmModalShow(false)}
          onConfirm={modalData.method}
          title={modalData.title}
        />
      }
    </div>
  );
};

SubGroup.propTypes = {
  group: PropTypes.object
};

export default SubGroup;