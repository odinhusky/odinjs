import React, { useContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { SplitButton } from 'components/BaseButton';
import BasePaper from 'components/BaseMuiPaper';
import Link from 'components/BaseLink';
import ConfirmModal from 'components/ConfirmModal';

import Context from '../../../Context.js';
import Ordering from '../../../Ordering';

import { KB } from 'constant';
import { formatBytes } from 'utils';
import { syncNfsDisk, deleteNfsDisk } from 'utils/api';

const Table = ({ match, keyword }) => {
  const { t } = useTranslation();
  const { nfsDiskList, getNfsDiskList } = useContext(Context);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [ordering, setOrdering] = useState(new Ordering);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDisk, setSelectedDisk] = useState({});
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [isConfirmModalShow, setIsConfirmModalShow] = useState(false);

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

  const onDelete = useCallback(() => {
    setIsDeleting(true);
    deleteNfsDisk(selectedDisk.name)
      .then(() => {
        getNfsDiskList();
        setIsDeleting(false);
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => {
        const msg = err.data.message ? err.data.message : err.toString();
        toast.error(msg);
        setIsDeleting(false);
      });
  }, [selectedDisk]);


  const onSync = useCallback(async nfsDisk => {
    setShowSyncDialog(true);
    try {
      await syncNfsDisk(nfsDisk.name);
      setShowSyncDialog(false);
    } catch (err) {
      setShowSyncDialog(false);
      const msg = err.data.message ? err.data.message : err.toString();
      toast.error(msg);
    }
  });

  const columns = [
    applySortProps({
      id: 'name',
      key: 'name',
      label: t('name'),
      onTableCellRender: nfsDisk =>
        <Link to={`${match.path}/${nfsDisk.name}`}>
          {nfsDisk.name}
        </Link>
    }),
    applySortProps({
      id: 'host',
      key: 'host',
      label: t('host'),
      onTableCellRender: nfsDisk => <div>{nfsDisk.host}</div>
    }),
    {
      id: 'path',
      key: 'path',
      label: t('path'),
      onTableCellRender: nfsDisk => <div>{nfsDisk.path}</div>
    },
    applySortProps({
      id: 'space',
      key: 'space',
      label: t('space'),
      onTableCellRender: nfsDisk =>
        nfsDisk.used || nfsDisk.used === 0
          ? <div>{formatBytes(nfsDisk.size * KB)}</div>
          : '-'
    }),
    applySortProps({
      id: 'request',
      key: 'request',
      label: `${t('allocated')}`,
      onTableCellRender: nfsDisk =>
        nfsDisk.used || nfsDisk.used === 0
          ? <div>{formatBytes((nfsDisk.request * KB))}</div>
          : '-'
    }),
    applySortProps({
      id: 'available',
      key: 'available',
      label: `${t('available')}`,
      onTableCellRender: nfsDisk =>
        nfsDisk.used || nfsDisk.used === 0
          ? <div>{formatBytes((nfsDisk.available * KB))}</div>
          : '-'
    }),
    applySortProps({
      id: 'used',
      key: 'used',
      label: `${t('used')}`,
      onTableCellRender: nfsDisk =>
        nfsDisk.used || nfsDisk.used === 0
          ? <div>{formatBytes(nfsDisk.used * KB)}</div>
          : '-'
    }),
    applySortProps({
      id: 'allocatable',
      key: 'allocatable',
      label: `${t('allocatable')}`,
      onTableCellRender: nfsDisk =>
        nfsDisk.used || nfsDisk.used === 0
          ? <div>{formatBytes((nfsDisk.available - nfsDisk.used) * KB)}</div>
          : '-'
    }),
    {
      id: 'action',
      key: 'action',
      label: t('Operations'),
      onTableCellRender: nfsDisk =>
        isDeleting
          ? <CircularProgress />
          :
          <SplitButton
            onClick={() => {
              onSync(nfsDisk);
            }}
            options={[{
              id: 'delete',
              label: t('delete'),
              handleItemclick: () => {
                setSelectedDisk(nfsDisk)
                setIsConfirmModalShow(true)
              },
              icon: <Icon style={{ marginRight: '10px' }}>delete</Icon>
            }]}
            startIcon={<Icon>autorenew</Icon>}
            text={t('sync')}
          />
    }
  ];

  return (
    <>
      <BasePaper
        columns={columns}
        labelRowsPerPage={t('labelRowsPerPage')}
        ordering={ordering}
        page={page}
        rows={ordering.apply(nfsDiskList.filter(disk => disk.name.includes(keyword)))}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />
      {
        isConfirmModalShow &&
        <ConfirmModal
          confrimText={t('delete')}
          content={t('sureDelete', { name: selectedDisk.name })}
          isOpen={isConfirmModalShow}
          onClose={() => setIsConfirmModalShow(false)}
          onConfirm={onDelete}
          title={`${t('delete')}${t('enSpace')}${t('NFS')}`}
        />
      }
      <Dialog
        aria-labelledby="responsive-dialog-title"
        fullScreen={fullScreen}
        onClose={() => setShowSyncDialog(false)}
        open={showSyncDialog}
      >
        <DialogTitle id="responsive-dialog-title">{t('syncing')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('wait')}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

Table.propTypes = {
  match: PropTypes.object,
  pagination: PropTypes.object,
  keyword: PropTypes.string,
  ordering: PropTypes.object,
  setOrdering: PropTypes.func
}

export default Table;