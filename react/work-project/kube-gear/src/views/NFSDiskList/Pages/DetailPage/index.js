import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import { PrimaryButton, DefaultButton, SplitButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';

import Header from 'components/Header';
import CreateModal from './components/CreateModal';
import SetUserModal from './components/SetUserModal';
import Ordering from '../../Ordering'

import Context from '../../Context';
import GlobalContext from 'layouts/Main/GlobalContext';

import { getUserList, deleteNfs } from 'utils/api';
import { formatBytes } from 'utils';
import { KB, GB } from 'constant';


const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  },
  iconClearMarginLeft: {
    marginLeft: 0
  }
}))

export const DetailPage = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { params } = useRouteMatch();
  const history = useHistory();
  const {
    nfsDisk,
    nfsDiskList,
    nfsList,
    setNfsDisk,
    getNfsList,
    isLoadingInfo,
    setNfsList,
    setNfs
  } = useContext(Context);
  const { userInfo } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [ordering, setOrdering] = useState(new Ordering());
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedNfs, setSelectedNfs] = useState(false);
  const [isConfirmShow, setIsConfirmShow] = useState(false);

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

  const handleDelete = useCallback(
    () => {
      setIsDeleting(true);
      deleteNfs({ name: selectedNfs.name })
        .then(() => {
          setNfsList(nfsList.filter(n => n.name !== selectedNfs.name));
          toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
          setIsDeleting(false);
        })
        .catch(err => {
          const msg = err.data ? err.data.message : err.message;
          toast.error(msg);
          setIsDeleting(false);
        });
    },
    [nfsList, selectedNfs]
  );

  useEffect(() => {
    if (!isEmpty(nfsDiskList)) {
      const foundData = nfsDiskList.find(el => el.name === params.path)
      if (foundData)
        setNfsDisk(foundData);
      else
        history.push('/not-found')
    }
  }, [params, nfsDiskList])

  useEffect(() => {
    if (userInfo.privileges && userInfo.privileges.some(item => item === 'ADMIN' || item === 'USER'))
      getUserList()
        .then(data => setUserList(data))
  }, [userInfo])

  return (
    <>
      <Header
        headerPath={[
          {
            title: t('NFS'),
            link: '/nfs-disk-list'
          },
          {
            title: nfsDisk.name,
            link: '#'
          }
        ]}
      />
      <div style={{ display: 'flex', marginBottom: 15 }}>
        <span style={{ marginRight: 15 }}>{`${t('mountArea')}： ${nfsDisk.name}`}</span>
        <span style={{ display: 'flex' }}>
          {`${t('available')}： `}
          {
            nfsDisk.available ? `${(nfsDisk.available / 1048576).toFixed(2)} GB`
              : <CircularProgress />
          }
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
        <div>
          <PrimaryButton
            children={`${t('add')}${t('enSpace')}NFS`}
            classes={{
              root: classes.marginRight10,
              startIcon: classes.iconClearMarginLeft
            }}
            onClick={() => setIsModalOpen(true)}
            startIcon={<Icon>add</Icon>}
          />
          <DefaultButton
            children={t('refresh')}
            disabled={isLoadingInfo}
            onClick={getNfsList}
            startIcon={<Refresh />}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <MuiAutocomplete
            classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
            value={keyword}
          />
          <Link to="/nfs-disk-list">
            <DefaultButton
              children={`${t('back')}`}
              startIcon={<Icon>arrow_back</Icon>}
            />
          </Link>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <BasePaper
          columns={[
            applySortProps({
              id: 'name',
              key: 'name',
              label: t('name'),
              onTableCellRender: nfs => <div>{nfs.name}</div>
            }),
            applySortProps({
              id: 'nfsDisk',
              key: 'nfsDisk',
              label: `${t('mountArea')}${t('enSpace')}${t('name')}`,
              onTableCellRender: nfs => <div>{nfs.nfsDisk}</div>
            }),
            applySortProps({
              id: 'size',
              key: 'size',
              label: `${t('space')}`,
              onTableCellRender: nfs => <div>{formatBytes(nfs.size * GB)}</div>
            }),
            applySortProps({
              id: 'used',
              key: 'used',
              label: `${t('used')}`,
              onTableCellRender: nfs =>
                nfs.used || nfs.used === 0
                  ? <div>{formatBytes((nfs.used * KB))}</div>
                  : <CircularProgress />
            }),
            applySortProps({
              id: 'available2',
              key: 'available2',
              label: `${t('allocatable')}`,
              onTableCellRender: nfs => {
                return nfs.used || nfs.used === 0
                  ? <div>{formatBytes((nfs.available * KB))}</div>
                  : <CircularProgress />
              }
            }),
            {
              id: 'action',
              key: 'action',
              label: t('Operations'),
              onTableCellRender: (nfs) => (
                isDeleting
                  ? <CircularProgress size={'2rem'} />
                  :
                  <SplitButton
                    onClick={() => {
                      setIsUserModalOpen(true)
                      setNfs(nfs);
                    }}
                    options={[{
                      id: 'delete',
                      label: t('delete'),
                      icon: <Icon style={{ marginRight: '10px' }}>delete</Icon>,
                      handleItemclick: () => {
                        setSelectedNfs(nfs);
                        setIsConfirmShow(true);
                      }
                    }]}
                    startIcon={<Icon>edit</Icon>}
                    text={t('Edit')}
                  />
              )
            }
          ]}
          labelRowsPerPage={t('labelRowsPerPage')}
          ordering={ordering}
          page={page}
          rows={ordering.apply(nfsList.filter(nfs => nfs.name.includes(keyword)))}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      {
        isModalOpen &&
        <CreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userList={userList}
        />
      }
      {
        isUserModalOpen &&
        <SetUserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          userList={userList}
        />
      }
      {
        isConfirmShow &&
        <ConfirmModal
          confrimText={t('delete')}
          content={t('sureDelete', { name: selectedNfs.name })}
          isOpen={isConfirmShow}
          onClose={() => setIsConfirmShow(false)}
          onConfirm={handleDelete}
          title={`${t('delete')}${t('enSpace')}${t('NFS')}`}
        />
      }
    </>
  )
}

export default DetailPage;
