/* eslint-disable react/no-multi-comp */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import BaseTable from 'components/BaseTable';
import { useTranslation } from 'react-i18next';
import Ordering from '../../Ordering';
import { IconButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import GlobalContext from 'layouts/Main/GlobalContext';
import { updateGroup } from 'utils/api';
import { toast } from 'react-toastify';

const Table = ({ isLoading, data, ordering, setOrdering, groupName, getData, leaders, disabledDeleteBtnList, selectedItem }) => {
  const { t } = useTranslation();
  const { userInfo } = useContext(GlobalContext)
  const [isModalShow, setIsModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const onDelete = () => {
    const formData = {
      name: groupName,
      leaders: leaders.filter(item => item.username !== selectedUser).map(item => item.username)
    }
    updateGroup(formData)
      .then(() => getData())
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
      minWidth: 10,
      maxWidth: 100,
      isResizable: true
    }),
    applySortProps({
      key: 'role',
      name: t('role'),
      fieldName: 'roles',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender(info) {
        return info.roles.join(', ')
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
            {info.state === 1 ? t('verified') : info.state === 0 ? t('verifying') : t('denied')}
          </div>
        )
      }
    }),
    {
      key: 'delete',
      name: t('delete'),
      fieldName: 'delete',
      maxWidth: 100,
      isResizable: false,
      onRender(info) {
        const user = userInfo.username;
        if (user !== info.username) {
          return (
            <IconButton
              iconProps={{ iconName: 'Delete' }}
              onClick={() => {
                setSelectedUser(info.username);
                setIsModalShow(true)
              }}
            />
          )
        } else {
          return (
            <IconButton
              disabled={disabledDeleteBtnList.includes(selectedItem)}
              iconProps={{ iconName: 'Delete' }}
              onClick={() => {
                setSelectedUser(info.username);
                setIsModalShow(true)
              }}
            />
          )
        }
      }
    }
  ];
  return (
    <>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading}
        items={ordering.apply(data)}
      />
      {
        isModalShow &&
        <ConfirmModal
          confrimText={t('delete')}
          content={t('sureDelete', { name: selectedUser })}
          isOpen={isModalShow}
          onClose={() => setIsModalShow(false)}
          onConfirm={onDelete}
          title={`${t('delete')}${t('enSpace')}${t('TeamLeader')}`}
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
  leaders: PropTypes.array,
  groupName: PropTypes.string,
  getData: PropTypes.func,
  disabledDeleteBtnList: PropTypes.array,
  selectedItem: PropTypes.string
}

export default Table;