import React, {
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';

// % context
import UserManageContext from '../UserManageContext';

// ^ Material-ui Componets(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

// ? Self-packed Components || Functions
import ConfirmModal from 'components/ConfirmModal';
import BaseStatusBadge from 'components/BaseBadge/BaseStatusBadge';
import { DefaultButton, SplitButton } from 'components/BaseButton';
import Ordering from '../utils/Ordering';
import BasePaper from 'components/BaseMuiPaper';

// ^ Plugins
import {
  isEmpty
} from 'lodash'
import { useTranslation } from 'react-i18next';
import { deleteUser } from 'utils/api';
import { toast } from 'react-toastify';

function Table() {

  // $ init data
  const { t } = useTranslation();

  // ? context
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
    columnList,
    combineGroupData,
    formatTimeString
  } = useContext(UserManageContext);

  // # states
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clickedUser, setClickedUser] = useState({});

  const [tableColumns, setTableColumns] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // & handled data
  const applySortProps = column => {
    column.isSorted = ordering.field === column.id;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, fieldID) => {

      const { field, descending } = ordering;

      if (field === fieldID) {
        if (descending) {
          setOrdering(new Ordering());
        } else {
          setOrdering(new Ordering(field, true));
        }
      } else {
        setOrdering(new Ordering(fieldID));
      }
    };
    return column;
  };

  const usernameColumn = applySortProps({
    id: 'username',
    key: 'username',
    label: t('Username'),
    labelKey: 'Username'
  });

  const jobNumberColumn = applySortProps({
    id: 'jobNumber',
    key: 'jobNumber',
    label: `${t('jobNumber')}/${t('studentNumber')}`,
    labelKey: 'jobNumber',
    onTableCellRender: userInfo => (
      <div>{userInfo.userCode}</div>
    )
  });

  const nameColumn = applySortProps({
    id: 'name',
    key: 'name',
    label: t('tableName'),
    labelKey: 'tableName'
    // width: '25%'
  });

  const mobileNumberColumn = applySortProps({
    id: 'mobileNumber',
    key: 'mobileNumber',
    label: t('mobileNumber'),
    labelKey: 'mobileNumber',
    onTableCellRender: userInfo => (
      <div>{userInfo.phone}</div>
    )
  });

  const noteColumn = {
    id: 'note',
    key: 'note',
    label: t('note'),
    labelKey: 'note',
    onTableCellRender: userInfo => (
      <div>{userInfo.description}</div>
    )
  };

  const group2Column = {
    id: 'group2',
    key: 'group2',
    label: t('group2'),
    labelKey: 'group2',
    onTableCellRender: userInfo => (
      combineGroupData(userInfo.leaderGroups, userInfo.userGroups).map(item => (
        <div key={item}>
          {item.name} <span>( {item.text} )</span>
        </div>
      ))
    )
  };

  const emailColumn = applySortProps({
    id: 'email',
    key: 'email',
    label: t('email'),
    labelKey: 'email',
    onTableCellRender: userInfo => (
      <div>{userInfo.email}</div>
    )
  });

  const jobUseTimeColumn = {
    id: 'jobUseTime',
    key: 'jobUseTime',
    label: t('jobUseTime'),
    labelKey: 'jobUseTime',
    onTableCellRender: userInfo => (
      <div>{formatTimeString(userInfo.totalUsedTime)}</div>
    )
  };

  const rolesColumn = applySortProps({
    id: 'roles',
    key: 'roles',
    label: t('role'),
    labelKey: 'role',
    // width: '25%',
    onTableCellRender: userInfo => getRolesText(userInfo)
  });

  const privilegeColumn = {
    id: 'privilege',
    key: 'privilege',
    label: t('privilege'),
    labelKey: 'privilege',
    onTableCellRender: userInfo => (
      isEmpty(userInfo.privileges)
        ? <div>N/A</div>
        : userInfo.privileges.map(v => <div key={v}>{v}</div>)
    )
  };

  const mountColumn = {
    id: 'mount',
    key: 'mount',
    label: t('mount'),
    labelKey: 'mount',
    onTableCellRender: userInfo => (
      isEmpty(userInfo.nfsList)
        ? <div>N/A</div>
        : userInfo.nfsList.map(v => <div key={v}>{v}</div>)
    )
  };

  const PhysicalGlusterFSColumn = {
    id: 'PhysicalGlusterFS',
    key: 'PhysicalGlusterFS',
    label: `${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`,
    labelKey: 'PhysicalGlusterFS',
    onTableCellRender: userInfo => (
      isEmpty(userInfo.glusterfsList)
        ? <div>N/A</div>
        : userInfo.glusterfsList.map(v => <div key={v}>{v}</div>)
    )
  };

  const virtualGroupsColumn = applySortProps({
    id: 'virtualGroups',
    key: 'virtualGroups',
    label: t('group'),
    labelKey: 'group',
    // width: '25%',
    onTableCellRender: userInfo => getVgsText(userInfo)
  });

  const stateColumn = applySortProps({
    id: 'state',
    key: 'state',
    label: t('status'),
    labelKey: 'status',
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
  }, ordering);

  const actionColumn = {
    id: 'action',
    key: 'action',
    label: t('Operations'),
    labelKey: 'Operations',
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
          icon: <Icon>delete_outline</Icon>,
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
  };

  /**
   * @author odin
   * @description 根據 labelKey，來決定要 return 哪一個 Column
   * @returns {Object}
  */
  const getInitColumn = str => {
    let column;
    switch(str) {
      case 'Username':
        column = usernameColumn
        break;
      case 'jobNumber':
        column = jobNumberColumn
        break;
      case 'tableName':
        column = nameColumn
        break;
      case 'mobileNumber':
        column = mobileNumberColumn
        break;
      case 'note':
        column = noteColumn
        break;
      case 'group2':
        column = group2Column
        break;
      case 'email':
        column = emailColumn
        break;
      case 'jobUseTime':
        column = jobUseTimeColumn
        break;
      case 'role':
        column = rolesColumn
        break;
      case 'privilege':
        column = privilegeColumn
        break;
      case 'mount':
        column = mountColumn
        break;
      case 'PhysicalGlusterFS':
        column = PhysicalGlusterFSColumn
        break;
      case 'group':
        column = virtualGroupsColumn
        break;
      case 'status':
        column = stateColumn
        break;
      case 'action':
        column = actionColumn
        break;
    }
    return column;
  };

  // 一開始預設所有的 columns
  const columns = [
    usernameColumn,
    jobNumberColumn,
    nameColumn,
    mobileNumberColumn,
    noteColumn,
    group2Column,
    emailColumn,
    jobUseTimeColumn,
    rolesColumn,
    privilegeColumn,
    mountColumn,
    PhysicalGlusterFSColumn,
    virtualGroupsColumn,
    stateColumn,
    actionColumn
  ];

  // - methods
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
        toast.error('Delete User API error =>', msg);
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

  // * hooks
  /**
   * @author odin
   * @description 1. 如果有 checked 是 true，就使用重新建構的欄位
  */
  useEffect(() => {
    if(isEmpty(columnList)) return;

    if(isEmpty(tableColumns)) {
      setTableColumns(columns);
      return;
    }

    setTableColumns(() => {
      const result = Object.entries(columnList).reduce((acc, [str, isCheck]) => {
        if(isCheck) {
          return [ ...acc, getInitColumn(str) ]
        } else {
          return [ ...acc ];
        }
      }, []);

      return result;
    });
  }, [columnList, ordering]);

  return (
    <>
      <BasePaper
        columns={tableColumns}
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
