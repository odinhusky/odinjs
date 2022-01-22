/* eslint-disable react/no-multi-comp */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import BaseTable from 'components/BaseTable';
import { BaseLink } from 'components/BaseLink';
import { useTranslation } from 'react-i18next';
import { Label, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import Context from '../../../Context';
import Ordering from '../../../Ordering';
import { formatBytes } from 'utils';
import { GB } from 'constant'
import { IconButton } from 'components/BaseButton';
import GlobalContext from 'layouts/Main/GlobalContext';
import EditModal from './EditModal';

const Table = ({ isLoading, fsList }) => {
  const { t } = useTranslation();
  const { ordering, setOrdering, isNFS } = useContext(Context);
  const { userInfo } = useContext(GlobalContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNfs, setSelectedNfs] = useState({});

  const onColumnClick = (event, column) => {
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

  const applySortProps = column => {
    column.isSorted = ordering.field === column.key;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = onColumnClick;
    return column;
  }

  const columns = [
    applySortProps({
      key: 'name',
      name: t('name'),
      fieldName: 'name',
      minWidth: 150,
      maxWidth: 150,
      isResizable: true,
      onRender: nfsInfo => (
        <BaseLink to={`/${isNFS ? 'fs-item-list' : 'glusterfs-item-list'}/${nfsInfo.name}`}>
          {nfsInfo.name}
        </BaseLink>
      )
    }),
    applySortProps({
      key: 'nfsDisk',
      name: isNFS ? t('mountArea') : t('volumeGlusterFS'),
      fieldName: 'nfsDisk',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: nfsInfo => (
        <Label>
          {isNFS ? nfsInfo.nfsDisk : nfsInfo.volume}
        </Label>
      )
    }),
    applySortProps({
      key: 'size',
      name: `${t('space')}`,
      fieldName: 'size',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: nfsInfo => (
        <Label>
          {formatBytes(nfsInfo.size * GB)}
        </Label>
      )
    }),
    applySortProps({
      key: isNFS ? 'available' : 'available2',
      name: `${t('allocatable')}`,
      fieldName: 'available',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: nfs =>
        nfs.used || nfs.used === 0
          ? <Label>{ formatBytes((nfs.size - nfs.used / 1048576) * GB) }</Label>
          : <div style={{ display: 'flex' }}>
            <Spinner size={SpinnerSize.small} />
          </div>
    }),
    {
      key: 'setting',
      name: t('setting'),
      fieldName: 'setting',
      minWidth: 100,
      maxWidth: 100,
      onRender(item) {
        const isEditable = (userInfo.privileges && (userInfo.privileges.includes('ADMIN') || userInfo.privileges.includes('NFS')))
          || item.users.includes(userInfo.username)
        return (
          isEditable &&
          <IconButton
            iconProps={{ iconName: 'Settings' }}
            onClick={() => {
              setSelectedNfs(item);
              setIsEditModalOpen(true);
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
        enableShimmer={isLoading}
        items={fsList}
        setKey="nfs"
        shimmerLines={10}
      />
      <EditModal
        isOpen={isEditModalOpen}
        nfs={selectedNfs}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  )
}

Table.propTypes = {
  fsList: PropTypes.array,
  isLoading: PropTypes.bool
}

export default Table