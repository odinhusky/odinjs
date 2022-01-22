/* eslint-disable react/no-multi-comp */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import BaseTable from 'components/BaseTable';
import { useTranslation } from 'react-i18next';
import Ordering from '../../Ordering';
import { IconButton } from 'components/BaseButton'
import ConfirmModal from 'components/ConfirmModal';
import EditModal from './EditModal';
import { mergeStyles } from 'office-ui-fabric-react';
import { toast } from 'react-toastify';
import { inviteGroupMember } from 'utils/api';
import Context from '../../Context';

const Table = ({ isLoading, data, ordering, setOrdering, groupName, getData, resourceData }) => {
  const { isMenuLoading, getMenuData } = useContext(Context)
  const { t } = useTranslation();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const onDelete = (user) => {
    inviteGroupMember({
      user,
      group: groupName,
      inviteState: -1
    })
      .then(() => {
        getData()
        getMenuData()
      })
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
  }
  const onPass = (user) => {
    inviteGroupMember({
      user,
      group: groupName,
      inviteState: 1
    })
      .then(() => {
        getData()
        getMenuData()
      })
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
  }
  const applySortProps = column => {
    column.isSorted = ordering.field === column.key;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, column) => {
      const { field, descending } = ordering;
      if (field === column.key) {
        if (descending) {
          setOrdering(new Ordering());
        } else {
          setOrdering(new Ordering(field, true));
        }
      } else {
        setOrdering(new Ordering(column.key));
      }
    }
    return column;
  }

  const columns = [
    applySortProps({
      key: 'username',
      name: t('name'),
      fieldName: 'username',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true
    }),
    applySortProps({
      key: 'role',
      name: t('role'),
      fieldName: 'roles',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender(info) {
        return (
          <div className={mergeStyles({ display: 'flex', flexDirection: 'column' })}>
            {
              info.roles.map(role => <span key={role}>{role}</span>)
            }
          </div>
        )
      }
    }),
    applySortProps({
      key: 'virtualGroups',
      name: t('virtualCluster'),
      fieldName: 'virtualGroups',
      minWidth: 50,
      maxWidth: 100,
      isResizable: true,
      onRender(info) {
        return info.virtualGroups.join(', ')
      }
    }),
    applySortProps({
      key: 'jobLifeHour',
      name: `${t('lifeHour')}(${t('hour')})`,
      fieldName: 'jobLifeHour',
      minWidth: 140,
      maxWidth: 150,
      isResizable: true,
      onRender(info) {
        return info.jobLifeHour === -1 
          ? '∞' 
          : info.jobLifeHour === -2 ? t('defaultValue') : info.jobLifeHour
      }
    }),
    applySortProps({
      key: 'state',
      name: t('status'),
      fieldName: 'state',
      maxWidth: 100,
      isResizable: true,
      onRender(info) {
        const state = [1, 0, -1];
        const fontColors = ['green', 'orange', 'red'];
        const backgroundColors = ['#D6F8C5', '#FFF8EA', '#FDE7E9'];
        return (
          <div
            style={{
              display: 'flex',
              padding: '12px 10px',
              color: fontColors[state.indexOf(info.state)],
              background: backgroundColors[state.indexOf(info.state)]
            }}
          > 
            {
              info.state === null ? null :
                info.state === 1 ? t('verified') : info.state === 0 ? t('verifying') : t('denied')
            }
          </div>
        )
      }
    }),
    applySortProps({
      key: 'groupState',
      name: `${t('group2')}${t('enSpace')}${t('status')}`,
      fieldName: 'groupState',
      maxWidth: 100,
      isResizable: true,
      onRender(info) {
        const fontColors = ['#0070C6', '#FFA500', '#FF5974'];
        const backgroundColors = ['#C9F1FC', '#FFF8EA', '#FFE4DD'];
        const state = (() => {
          const { applyState, inviteState } = info
          if (applyState === 1 && inviteState === 1) {
            return 0
          } else if (applyState === 1 && inviteState === 0) {
            return 1
          } else {
            return 2
          }
        })()
        return (
          <div
            style={{
              display: 'flex',
              padding: '12px 10px',
              color: fontColors[state],
              background: backgroundColors[state]
            }}
          > 
            {
              state === 0 ? t('joined') :
                state === 1 ? t('applied') : t('invited')
            }
          </div>
        )
      }
    }),
    {
      key: 'editVirtuialGroup',
      name: t('edit'),
      fieldName: 'edit',
      minWidth: 50,
      maxWidth: 50,
      isResizable: false,
      onRender(info) {
        return (
          <IconButton
            className={mergeStyles({ background: 'none' })}
            iconProps={{ iconName: 'Edit' }}
            onClick={() => {
              setIsEditModalShow(true)
              setSelectedUser(info)
            }}
          />
        )
      }
    },
    {
      key: 'pass',
      name: t('passed'),
      fieldName: 'pass',
      minWidth: 50,
      maxWidth: 50,
      isResizable: false,
      onRender(info) {
        return (
          <IconButton
            className={mergeStyles({ background: 'none' })}
            disabled={!(info.applyState === 1 && info.inviteState === 0)}
            iconProps={{ iconName: 'UserFollowed' }}
            onClick={() => {
              setIsModalShow(true)
              setModalData({
                title: `${t('passed')}${t('enSpace')}${t('TeamMember')}`,
                content: t('surePassGroupMember', { name: info.username }),
                confrimText: t('passed'),
                method: () => onPass(info.username)
              })
            }}
          />
        )
      }
    },
    {
      key: 'delete',
      name: t('delete'),
      fieldName: 'delete',
      maxWidth: 100,
      isResizable: false,
      onRender(info) {
        return (
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            onClick={() => {
              setIsModalShow(true)
              setModalData({
                title: `${t('delete')}${t('enSpace')}${t('TeamMember')}`,
                content: t('sureDelete', { name: info.username }),
                confrimText: t('delete'),
                method: () => onDelete(info.username)
              })
            }}
          />
        )
      }
    }
  ];
  return (
    <>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading || isMenuLoading}
        items={ordering.apply(data)}
      />
      {
        isModalShow &&
        <ConfirmModal
          confrimText={modalData.confrimText}
          content={modalData.content}
          isOpen={isModalShow}
          onClose={() => setIsModalShow(false)}
          onConfirm={modalData.method}
          title={modalData.title}
        />
      }
      {
        isEditModalShow &&
        <EditModal
          getData={getData}
          groupName={groupName}
          isOpen={isEditModalShow}
          onClose={() => setIsEditModalShow(false)}
          resourceData={resourceData}
          selectedUser={selectedUser}
        />
      }
    </>
  )
}

Table.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  ordering: PropTypes.object,
  setOrdering: PropTypes.func,
  members: PropTypes.array,
  groupName: PropTypes.string,
  getData: PropTypes.func,
  resourceData: PropTypes.array
}

export default Table;