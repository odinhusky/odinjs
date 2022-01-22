import React, { useState, useCallback, useContext } from 'react';

// % context
import Context from '../utils/Context';

// ^ Material-ui Componets(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';


// ? Self-packed Components || Functions
import ConfirmModal from 'components/ConfirmModal';
import BasePaper from 'components/BaseMuiPaper';
import BaseStatusBadge from 'components/BaseBadge/BaseStatusBadge';
import { DefaultButton, SplitButton } from 'components/BaseButton';

import Ordering from '../utils/Ordering';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { deleteUser } from 'utils/api';
import { toast } from 'react-toastify';

function Table() {
  const { t } = useTranslation();
  const {
    getUserInfoList,
    filterUserInfoList,
    setShowViewUserModal,
    setShowEditUserModal,
    setShowApproveUserModal,
    setUserInfo,
    ordering,
    setOrdering,
    currentUser,
    isXdfsEnabled
  } = useContext(Context);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clickedUser, setClickedUser] = useState({});

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

  const usernameColumn = applySortProps({
    id: 'username',
    key: 'username',
    label: t('Username')
    // width: '25%'
  });

  const nameColumn = applySortProps({
    id: 'name',
    key: 'name',
    label: t('tableName')
    // width: '25%'
  });

  const rolesColumn = applySortProps({
    id: 'roles',
    key: 'roles',
    label: t('role'),
    // width: '25%',
    onTableCellRender: userInfo => getRolesText(userInfo)
  });

  const virtualGroupsColumn = applySortProps({
    id: 'virtualGroups',
    key: 'virtualGroups',
    label: t('group'),
    // width: '25%',
    onTableCellRender: userInfo => getVgsText(userInfo)
  });

  const stateColumn = applySortProps({
    id: 'state',
    key: 'state',
    label: t('status'),
    // width: '10%',
    onTableCellRender: userInfo => {
      const state = [1, 0, -1];
      const statusString = ['success', 'pend', 'fail']
      return (
        <BaseStatusBadge
          maxW={75}
          status={statusString[state.indexOf(userInfo.state)]}
        >
          {userInfo.state === 1 ? t('verified') : userInfo.state === 0 ? t('verifying') : t('denied')}
        </BaseStatusBadge>
      )
    }
  });

  const onDelete = useCallback(() => {
    setIsDeleting(true);
    deleteUser(clickedUser.username)
      .then(() => {
        getUserInfoList();
        setIsDeleting(false);
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => {
        const msg = err.data.message ? err.data.message : err.toString();
        alert(msg);
        setIsDeleting(false);
      });
  }, [clickedUser]);

  const onEdit = useCallback(userInfo => {
    // console.log ('onEdit', userInfo);
    setUserInfo(JSON.parse(JSON.stringify(userInfo)));
    setShowEditUserModal(true);
  }, []);

  const onApprove = useCallback(userInfo => {
    // console.log ('onApprove', userInfo);
    setUserInfo(JSON.parse(JSON.stringify(userInfo)));
    setShowApproveUserModal(true);
  }, []);

  const onView = useCallback(userInfo => {
    // console.log ('onView', userInfo);
    setUserInfo(userInfo);
    setShowViewUserModal(true);
  }, []);

  const getRolesText = userInfo => {
    let rolesText = '';
    for (let i = 0; i < userInfo.roles.length; i++) {
      rolesText += userInfo.roles[i];
      if (i !== userInfo.roles.length - 1) {
        rolesText += ', ';
      }
    }
    return rolesText;
  };

  const getVgsText = userInfo => {
    let vgsText = '';
    for (let i = 0; i < userInfo.virtualGroups.length; i++) {
      vgsText += userInfo.virtualGroups[i];
      if (i !== userInfo.virtualGroups.length - 1) {
        vgsText += ', ';
      }
    }
    return vgsText;
  };

  const columns = [
    usernameColumn,
    nameColumn,
    rolesColumn,
    virtualGroupsColumn,
    stateColumn,
    {
      id: 'action',
      key: 'action',
      label: t('Operations'),
      width: '15%',
      onTableCellRender: userInfo => {
        let modifiedItems = [
          {
            id: 'edit',
            label: t('modify'),
            icon: <Icon>edit</Icon>,
            handleItemclick: () => onEdit(userInfo)
          },
          {
            id: 'delete',
            label: t('delete'),
            icon: <Icon>delete</Icon>,
            handleItemclick: () => {
              setClickedUser(userInfo);
              setShowDeleteModal(true);
            }
          }
        ];
        if (userInfo.privileges.includes('ADMIN')) {
          modifiedItems = modifiedItems.filter(item => item.id !== 'delete');
        }
        if (userInfo.state === 0) {
          modifiedItems = modifiedItems.filter(item => item.id !== 'edit');
        }
        if (userInfo.state === -1) {
          modifiedItems = modifiedItems.filter(item => item.id === 'delete');
        }
        return (
          <>
            {
              isDeleting
                ? <CircularProgress />
                :
                (
                  currentUser.admin === 'true'
                  || (
                    !isXdfsEnabled &&
                    currentUser.privileges.includes('USER') &&
                    currentUser.privileges.includes('NFS') &&
                    currentUser.privileges.includes('GLUSTERFS')
                  )
                  || (
                    isXdfsEnabled &&
                    currentUser.privileges.includes('USER') &&
                    currentUser.privileges.includes('NFS')
                  )
                )
                  ?
                  userInfo.privileges.includes('ADMIN') && !currentUser.privileges.includes('ADMIN') ?
                    <DefaultButton
                      children={t('view')}
                      onClick={() => {
                        onView(userInfo)
                      }}
                      startIcon={<VisibilityOutlinedIcon />}
                    />
                    :
                    <SplitButton
                      onClick={() => {
                        userInfo.state !== 0
                          ? onView(userInfo)
                          : onApprove(userInfo);
                      }}
                      options={modifiedItems}
                      startIcon={userInfo.state !== 0 ? <VisibilityOutlinedIcon /> : <Icon>how_to_reg</Icon>}
                      text={userInfo.state !== 0 ? t('view') : t('Verify')}
                    />
                  :
                  <DefaultButton
                    children={t('view')}
                    onClick={() => {
                      onView(userInfo)
                    }}
                    startIcon={<VisibilityOutlinedIcon />}
                  />
            }
          </>
        );
      }
    }
  ];

  return (
    <>
      <BasePaper
        columns={columns}
        labelRowsPerPage={t('labelRowsPerPage')}
        ordering={ordering}
        page={page}
        rows={ordering.apply(filterUserInfoList || [])}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />
      {
        showDeleteModal &&
      <ConfirmModal
        confrimText={t('delete')}
        content={t('sureDelete', { name: clickedUser.username })}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDelete}
        title={`${t('delete')}${t('enSpace')}${t('User')}`}
      />
      }
    </>
  );
}

export default Table;
