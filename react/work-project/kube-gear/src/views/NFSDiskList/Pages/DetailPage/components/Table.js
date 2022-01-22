/* eslint-disable react/no-multi-comp */
import React, { useState, useCallback, useContext } from 'react';
import { Stack, Label } from 'office-ui-fabric-react';
import { CommandBarButton } from 'components/BaseButton';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import BaseTable from 'components/BaseTable'
import ConfirmModal from 'components/ConfirmModal';

import Context from '../../../Context';
import Ordering from '../../../Ordering';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { deleteNfs } from 'utils/api';
import { toast } from 'react-toastify';
import { formatBytes } from 'utils';
import { KB, GB } from 'constant'

NfsTable.propTypes = {
  pagination: PropTypes.object,
  setShowSetNfsUserModal: PropTypes.func,
  ordering: PropTypes.object,
  setOrdering: PropTypes.func,
  keyword: PropTypes.string
};

export default function NfsTable({ setShowSetNfsUserModal, pagination, keyword, ordering, setOrdering }) {
  const { t } = useTranslation();
  const {
    nfsList,
    getAndSetNfsDiskInfo,
    setNfs,
    setNfsList,
    isLoadingNfsInfoRef,
    isLoading
  } = useContext(Context);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [selectedNfs, setSelectedNfs] = useState(false);

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

  const handleDelete = useCallback(
    () => {
      setIsDeleting(true);
      deleteNfs({ name: selectedNfs.name })
        .then(() => {
          setNfsList(nfsList.filter(n => n.name !== selectedNfs.name));
          getAndSetNfsDiskInfo(selectedNfs.nfsDisk);
          setIsDeleting(false);
          isLoadingNfsInfoRef.current = false;
        })
        .catch(err => {
          const msg = err.data ? err.data.message : err.message;
          toast.error(msg);
          setIsDeleting(false);
          isLoadingNfsInfoRef.current = false;
        });
    },
    [nfsList, selectedNfs]
  );

  const columns = [
    applySortProps({
      key: 'name',
      name: t('name'),
      fieldName: 'name',
      minWidth: 50,
      maxWidth: 150,
      isResizable: true,
      onRender: nfs => <Label>{nfs.name}</Label>
    }),
    applySortProps({
      key: 'nfsDisk',
      name: `${t('mountArea')}${t('enSpace')}${t('name')}`,
      fieldName: 'nfsDisk',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: nfs => <Label>{nfs.nfsDisk}</Label>
    }),
    applySortProps({
      key: 'size',
      name: `${t('space')}`,
      fieldName: 'size',
      minWidth: 100,
      maxWidth: 90,
      isResizable: true,
      onRender: nfs => <Label>{formatBytes(nfs.size * GB)}</Label>
    }),
    applySortProps({
      key: 'used',
      name: `${t('used')}`,
      fieldName: 'used',
      minWidth: 50,
      maxWidth: 120,
      isResizable: true,
      onRender: nfs =>
        nfs.used || nfs.used === 0
          ? <Label>{formatBytes((nfs.used * KB))}</Label>
          : <div>
            <Spinner size={SpinnerSize.small} />
          </div>
    }),
    applySortProps({
      key: 'available2',
      name: `${t('allocatable')}`,
      fieldName: 'available2',
      minWidth: 50,
      maxWidth: 120,
      isResizable: true,
      onRender: nfs => {
        return nfs.used || nfs.used === 0
          ? <Label>{formatBytes((nfs.available * KB))}</Label>
          : <div>
            <Spinner size={SpinnerSize.small} />
          </div>
      }
    }),
    {
      key: 'action',
      name: t('Operations'),
      fieldName: 'action',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: nfs => (
        <Stack
          horizontal
          horizontalAlign="space-between"
        >
          <Stack.Item>
            {isDeleting
              ? <Spinner size={SpinnerSize.large} />
              :
              <CommandBarButton
                iconProps={{ iconName: 'EditContact', styles: { root: { color: '#333333' } } }}
                menuProps={{
                  items: [
                    {
                      key: 'delete',
                      text: t('delete'),
                      iconProps: { iconName: 'Delete', styles: { root: { color: '#333333' } } },
                      onClick: () => {
                        setSelectedNfs(nfs);
                        setIsModalShow(true);
                      }
                    }
                  ]
                }}
                onClick={() => {
                  setNfs(nfs);
                  setShowSetNfsUserModal(true);
                }}
                split
                text={t('UserSetting')}
              />}
          </Stack.Item>
        </Stack>
      )
    }
  ];

  const renderData = ordering.apply(nfsList.filter(nfs => nfs.name.includes(keyword)))
  return (
    <>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading}
        items={pagination.apply(renderData)}
        setKey="nfs"
        shimmerLines={10}
      />
      <ConfirmModal
        confrimText={t('delete')}
        content={t('sureDelete', { name: selectedNfs.name })}
        isOpen={isModalShow}
        onClose={() => setIsModalShow(false)}
        onConfirm={handleDelete}
        title={`${t('delete')}${t('enSpace')}${t('NFS')}`}
      />
    </>
  );
}
