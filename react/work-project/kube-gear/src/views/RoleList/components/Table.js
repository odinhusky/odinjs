/* eslint-disable react/no-multi-comp */
import React, { useContext, useCallback, useState } from 'react';
import BaseTable from 'components/BaseTable';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IconButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import Context from '../Context';
import { useTranslation } from 'react-i18next';
import { deleteRole } from 'utils/api';
import { toast } from 'react-toastify';
import Ordering from '../Ordering';

function Table() {
  const { t } = useTranslation();
  const {
    isLoading,
    setIsLoading,
    roleList,
    pagination,
    getData,
    designateUpdateUser,
    setDesignateUpdateUser,
    setIsEditModalShow,
    filter,
    ordering,
    setOrdering
  } = useContext(Context);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onEdit = roleInfo => {
    setDesignateUpdateUser(roleInfo);
    setIsEditModalShow(true);
  };

  const onDelete = useCallback(() => {
    setIsLoading(true);
    deleteRole({ name: designateUpdateUser.name })
      .then(() => {
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
        getData();
      })
      .catch(err => {
        const msg = err.data ? err.data.message : err.message;
        toast.error(msg);
      })
      .finally(() => setIsLoading(false))
  }, [designateUpdateUser]);

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
      key: 'name',
      name: t('role'),
      fieldName: 'name',
      minWidth: 200,
      maxWidth: 200,
      isResizable: true,
      onRender: roleInfo => (
        <Label>
          {roleInfo.name}
        </Label>
      )
    }),
    applySortProps({
      key: 'roles',
      name: t('privilege'),
      fieldName: 'roles',
      minWidth: 500,
      maxWidth: 500,
      isResizable: true,
      onRender: roleInfo => (
        <Label>
          {roleInfo.privileges.join(', ')}
        </Label>
      )
    }),
    {
      key: 'Edit',
      name: t('Edit'),
      fieldName: 'Edit',
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender: roleInfo => (
        <IconButton
          disabled={roleInfo.name === '总管理员'}
          iconProps={{ iconName: 'Edit' }}
          onClick={() => {
            onEdit(roleInfo);
          }}
        />
      )
    },
    {
      key: 'delete',
      name: t('delete'),
      fieldName: 'delete',
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender: roleInfo => (
        <IconButton
          disabled={roleInfo.name === '总管理员'}
          iconProps={{ iconName: 'Delete' }}
          onClick={() => {
            if (roleInfo.name === 'admin') return;

            setShowDeleteModal(true);
            setDesignateUpdateUser(roleInfo)
          }}
        />
      )
    }
  ];

  return (
    <>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading}
        items={pagination.apply(filter.apply(ordering.apply(roleList)))}
        setKey="roleInfo"
        shimmerLines={10}
      />
      <ConfirmModal
        confrimText={t('delete')}
        content={t('sureDelete', { name: designateUpdateUser.name })}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDelete}
        title={`${t('delete')}${t('enSpace')}${t('role')}`}
      />
    </>
  );
}

export default Table;
