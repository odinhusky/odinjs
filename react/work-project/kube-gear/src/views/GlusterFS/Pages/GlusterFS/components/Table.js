import React, { useState, useContext, useCallback } from 'react';
import { SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';

import PropTypes from 'prop-types';
import Context from './Context';
import BaseTable from 'components/BaseTable';
import Link from 'components/BaseLink';
import { DefaultButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Ordering from '../Ordering';

import { deleteGlustersVolume } from 'utils/api';
import { formatBytes } from 'utils';
import { KB } from 'constant';

function Table({ match }) {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { 
    filterListByName, 
    isLoading, 
    getData, 
    pagination, 
    setDeleteGlusterfs, 
    deleteGlusterfs,
    setOrdering,
    ordering
  } = useContext(Context);

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
  
  const onDelete = useCallback(() => {
    deleteGlustersVolume(deleteGlusterfs.name)
      .then(() => {
        getData();
      })
      .catch(err => {
        const msg = err.data.message ? err.data.message : err.toString();
        toast.error(msg);
      });
  }, [deleteGlusterfs]);
  
  const nameCloumn = applySortProps({
    key: 'name',
    name: t('name'),
    fieldName: 'name',
    minWidth: 80,
    maxWidth: 100,
    isResizable: true,
    onRender: glusterfsInfo => {
      return (
        <>
          <Link
            to={`${match.path}/${glusterfsInfo.name}`}
          >
            {glusterfsInfo.name}
          </Link>
        </>
      );
    }
  });

  const nativeGlusterFSCloumn = applySortProps({
    key: 'source',
    name: `${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`,
    fieldName: 'source',
    minWidth: 150,
    maxWidth: 300,
    isResizable: true,
    // isMultiline: true,
    onRender: glusterfsInfo => {
      return (
        <>{glusterfsInfo.source}</>
      );
    }
  });

  const sizeCloumn = applySortProps({
    key: 'size',
    name: t('space'),
    fieldName: 'size',
    minWidth: 80,
    maxWidth: 100,
    isResizable: true,
    onRender: glusterfsInfo => {
      const sizeConvetToGB = formatBytes(glusterfsInfo.size * KB);
      return (
        <>
          {sizeConvetToGB}
        </>
      );
    }
  });

  const usedCloumn = applySortProps({
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
  });

  const allocatableColumn = applySortProps({
    key: 'allocatable',
    name: t('available'),
    fieldName: 'allocatable',
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
  });

  const allocatedColumn = applySortProps({
    key: 'allocated',
    name: t('allocated'),
    fieldName: 'allocated',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: glusterfsInfo => {
      const splitedSpaceConvertToGB = formatBytes(glusterfsInfo.request * KB);
      return (
        <>
          {splitedSpaceConvertToGB}
        </>
      );
    }
  });

  const availableColumn = applySortProps({
    key: 'available',
    name: t('allocatable'),
    fieldName: 'available',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: glusterfsInfo => {
      const splitedSpaceConvertToGB = formatBytes((glusterfsInfo.request - glusterfsInfo.used) * KB);
      return (
        <>
          {splitedSpaceConvertToGB}
        </>
      );
    }
  });

  const statusColumn = applySortProps({
    key: 'status',
    name: t('status'),
    fieldName: 'status',
    minWidth: 120,
    maxWidth: 200,
    isResizable: true,
    onRender: glusterfsInfo =>{
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
  });

  const actionColumn = {
    key: 'action',
    name: t('Operations'),
    fieldName: 'action',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    onRender: glusterfsInfo => {
      const name = glusterfsInfo.name;
      return (
        <>
          <DefaultButton
            data={name}
            iconProps={{ iconName: 'RemoveLink' }}
            onClick={() => {
              setDeleteGlusterfs(glusterfsInfo)
              setShowDeleteModal(true)
            }}
            text={`${t('unbind')}`}
            value={name}
          />
        </>
      );
    }
  };

  const columns = [
    nameCloumn,
    nativeGlusterFSCloumn,
    sizeCloumn,
    allocatedColumn,
    allocatableColumn,
    usedCloumn,
    availableColumn,
    statusColumn,
    actionColumn
  ];

  return (
    <div>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading}
        items={pagination.apply(ordering.apply(filterListByName))}
        selectionMode={SelectionMode.none}
        setKey="glusterfs"
        shimmerLines={10}
      />
      {
        showDeleteModal &&
        <ConfirmModal
          confrimText={t('unbind')}
          content={t('sureUnbindGlusterFS', { name: deleteGlusterfs.name })}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={onDelete}
          title={`${t('unbind')}${t('enSpace')}${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
        />
      }
    </div>
  );
}

Table.propTypes = {
  match: PropTypes.object
}

export default Table;
