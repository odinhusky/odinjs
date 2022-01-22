import React, { useState, useContext } from 'react';

import BaseTable from 'components/BaseTable';
import { CommandBarButton } from 'components/BaseButton';
import Context from './Context';
import { toast } from 'react-toastify';
import ConfirmModal from 'components/ConfirmModal';
import { useTranslation } from 'react-i18next';
import Ordering from '../Ordering';

import { deleteGlusterfsDetail } from 'utils/api';
import { formatBytes } from 'utils';
import { KB, GB } from 'constant';

function Table() {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteName, setDeleteName] = useState('');
  const {
    filterListByName,
    getData,
    isLoading,
    pagination,
    setModifyGlusterfsDetailModal,
    setUpdateName,
    setOrdering,
    ordering
  } = useContext(Context);

  const onDelete = () => {
    deleteGlusterfsDetail(deleteName)
      .then(() => {
        getData();
      })
      .catch(err => {
        const msg = err.data.message ? err.data.message : err.toString();
        toast.error(msg);
      });
  };

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

  const nameColumn = applySortProps({
    key: 'name',
    name: t('name'),
    fieldName: 'name',
    minWidth: 80,
    maxWidth: 100,
    isResizable: true,
    onRender: glusterfsInfo => {
      return (
        <>{glusterfsInfo.name}</>
      );
    }
  })

  const volumeColumn = {
    key: 'volume',
    name: `${t('enSpace')}${t('volumeGlusterFS')}`,
    fieldName: 'volume',
    minWidth: 150,
    maxWidth: 150,
    isResizable: true,
    // isMultiline: true,
    onRender: glusterfsInfo => {
      return (
        <>{glusterfsInfo.volume}</>
      );
    }
  }

  const sizeColumn = applySortProps({
    key: 'size',
    name: t('space'),
    fieldName: 'size',
    minWidth: 80,
    maxWidth: 100,
    isResizable: true,
    onRender: glusterfsInfo => {
      const sizeConvetToGB = formatBytes(glusterfsInfo.size * GB);
      return (
        <>
          {sizeConvetToGB}
        </>
      );
    }
  })

  const usedColumn = applySortProps({
    key: 'used',
    name: t('used'),
    fieldName: 'used',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: glusterfsInfo => {
      const usedSpaceConvetToGB = formatBytes(glusterfsInfo.used * KB);
      return (
        <>
          {usedSpaceConvetToGB}
        </>
      );
    }
  })

  const allocatedColumn = applySortProps({
    key: 'allocated',
    name: t('allocatable'),
    fieldName: 'allocated',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: glusterfsInfo => {
      const canSplitSpaceConvertToGB = formatBytes(glusterfsInfo.available * KB);
      return (
        <>
          {canSplitSpaceConvertToGB}
        </>
      );
    }
  })

  const statusColumn = {
    key: 'status',
    name: t('status'),
    fieldName: 'status',
    minWidth: 120,
    maxWidth: 200,
    isResizable: true,
    onRender: glusterfsInfo => {
      let { errorMessage } = glusterfsInfo;
      if (typeof(status) === 'object') {
        errorMessage = JSON.stringify(errorMessage);
      }
      return (
        <>
          {
            errorMessage ?
              <div
                style={{
                  padding: '10px 20px',
                  background: '#FDE7E9',
                  width: '100%',
                  color: '#DD4B39'
                }}
              >
                {errorMessage}
              </div>
              :
              <div
                style={{
                  padding: '10px 20px',
                  background: '#D6F8C5',
                  width: '100%',
                  color: '#008756'
                }}
              >
                {t('normal')}
              </div>
          }
        </>
      );
    }
  }

  const actionColumn = {
    key: 'action',
    name: t('Operations'),
    fieldName: 'action',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    onRender: glusterfsInfo => {
      const modifiedItems = [
        {
          key: 'delete',
          text: t('delete'),
          iconProps: { iconName: 'Delete' },
          onClick: () => {
            setShowDeleteModal(true);
            setDeleteName(glusterfsInfo.name)
          }
        }
      ];
      return (
        <>
          <CommandBarButton
            iconProps={{
              iconName: 'Edit'
            }}
            menuProps={{
              items: modifiedItems
            }}
            onClick={() => {
              setUpdateName(glusterfsInfo.name);
              setModifyGlusterfsDetailModal(true);
            }}
            split
            text={t('Edit')}
          />
        </>
      );
    }
  }

  const columns = [
    nameColumn,
    volumeColumn,
    sizeColumn,
    usedColumn,
    allocatedColumn,
    statusColumn,
    actionColumn
  ];

  return (
    <div>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading}
        items={pagination.apply(ordering.apply(filterListByName))}
        setKey="glusterfs"
        shimmerLines={10}
      />
      <ConfirmModal
        confrimText={t('delete')}
        content={t('sureDeleteUser', { name: deleteName })}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteName('');
        }}
        onConfirm={onDelete}
        title={`${t('delete')}${t('enSpace')}${t('glusterfs')}`}
      />
    </div>
  );
}

export default Table;
