import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import BreadCrumbs from 'components/BreadCrumbs';
import MuiDropdown from 'components/BaseMuiDropdown';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BasePaper from 'components/BaseMuiPaper';
import ConfirmModal from 'components/ConfirmModal';
import Link from 'components/BaseLink';
import { BaseStatusBadge } from 'components/BaseBadge';

import Context from './components/Context';
import Ordering from './Ordering';

import { getXdfsVolume, getXdfsVolumeWhichCanBind, deleteXdfsVolume } from 'utils/api';
import { formatBytes } from 'utils';
import { KB } from 'constant';

import CreateNativeVolumeModal from './components/CreateNativeVolumeModal';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

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

export default function Xdfs({ match }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [xdfsList, setXdfsList] = useState([]);
  const [filterListByName, setFilterListByName] = useState([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [volumeCanBind, setVolumeCanBind] = useState([]);
  const [deleteXdfs, setDeleteXdfs] = useState([]);
  const [ordering, setOrdering] = useState(new Ordering());
  const [keyword, setKeyword] = useState('');
  const [selectedKey, setSelectedKey] = useState(0);
  const [selectedValue, setSelectedValue] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item, index) => ({
      key: index,
      text: item.name,
      data: item.data,
      ...item
    }));
  };

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
    deleteXdfsVolume(deleteXdfs.name)
      .then(() => {
        toast.success(`${t('unbind')}${t('enSpace')}${t('success')}`)
        getData();
      })
      .catch(err => {
        const msg = err?.data?.message ? err?.data?.message : err.toString();
        toast.error(msg);
      });
  }, [deleteXdfs]);

  const getData = useCallback(() => {
    setIsLoading(true);
    Promise.all([getXdfsVolume(), getXdfsVolumeWhichCanBind()])
      .then(([list, volume]) => {
        setXdfsList(list);
        setVolumeCanBind(volume);
      })
      .catch(err => toast.error(err?.data ? err.data?.message : err?.message))
      .finally(() => setIsLoading(false))
  }, []);

  useEffect(getData, []);

  const context = {
    getData,
    volumeCanBind
  };

  useEffect(() => {
    setFilterListByName(() => {
      const filterListByName = xdfsList.filter(data =>
        data.name.includes(keyword)
      );
      switch(selectedKey) {
        case 0:
        default:
          return filterListByName;
        case 1:
          return filterListByName.filter(info => info.errorMessage === null);
        case 2:
          return filterListByName.filter(info => info.errorMessage !== null);
      }
    })
  }, [xdfsList, keyword, selectedKey])

  return (
    <Context.Provider value={context}>
      <BreadCrumbs />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <div>
          <PrimaryButton
            children={`${t('bind')}${t('enSpace')}${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
            classes={{
              root: classes.marginRight10,
              startIcon: classes.iconClearMarginLeft
            }}
            onClick={() => setShowCreateUserModal(true)}
            startIcon={<Icon>add</Icon>}
          />
          <DefaultButton
            children={t('refresh')}
            onClick={() => getData()}
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
          <MuiDropdown
            list={addDropDownOptionKeys([
              { name: t('allShow'), data: { icon: '6PointStar' }, color: '#001EF5', optionkey: 0 },
              { name: t('normal'), data: { icon: 'CheckMark' }, color: '#008756', optionkey: 1 },
              { name: t('error'), data: { icon: 'Cancel' }, color: '#DD4B39',  optionkey: 2 }
            ])}
            maxWidth={150}
            onChange={(e, child) => {
              setSelectedValue([e.target.value]);
              setSelectedKey(child.props.optionkey)
            }}
            onRenderOption={(data) => {
              return (
                <div style={{ color: data.color, display: 'flex', alignItems: 'center' }}>
                  <div>{data.name}</div>
                </div>
              )
            }}
            text={`${t('select')}${t('enSpace')}${t('status')}`}
            value={selectedValue}
          />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <BasePaper
          columns={[
            applySortProps({
              id: 'name',
              key: 'name',
              label: t('name'),
              onTableCellRender: xdfsInfo => {
                return (
                  <Link
                    to={`${match.path}/${xdfsInfo.name}`}
                  >
                    {xdfsInfo.name}
                  </Link>
                );
              }
            }),
            applySortProps({
              id: 'source',
              key: 'source',
              label: `${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`,
              onTableCellRender: xdfsInfo => xdfsInfo.source
            }),
            applySortProps({
              id: 'size',
              key: 'size',
              label: t('space'),
              onTableCellRender: xdfsInfo => {
                const sizeConvetToGB = formatBytes(xdfsInfo.size * KB);
                return (<>{sizeConvetToGB}</>);
              }
            }),
            applySortProps({
              id: 'used',
              key: 'used',
              label: t('used'),
              onTableCellRender: xdfsInfo => {
                const usedSpaceConvetToGB = formatBytes(xdfsInfo.used * KB);
                return (<>{usedSpaceConvetToGB}</>);
              }
            }),
            applySortProps({
              id: 'allocatable',
              key: 'allocatable',
              label: t('available'),
              onTableCellRender: xdfsInfo => {
                const canSplitSpaceConvertToGB = formatBytes(xdfsInfo.available * KB);
                return (<>{canSplitSpaceConvertToGB}</>);
              }
            }),
            applySortProps({
              id: 'allocated',
              key: 'allocated',
              label: t('allocated'),
              onTableCellRender: xdfsInfo => {
                const splitedSpaceConvertToGB = formatBytes(xdfsInfo.request * KB);
                return (<>{splitedSpaceConvertToGB}</>);
              }
            }),
            applySortProps({
              id: 'available',
              key: 'available',
              label: t('allocatable'),
              onTableCellRender: xdfsInfo => {
                const splitedSpaceConvertToGB = formatBytes((xdfsInfo.request - xdfsInfo.used) * KB);
                return (<>{splitedSpaceConvertToGB}</>);
              }
            }),
            applySortProps({
              id: 'status',
              key: 'status',
              label: t('status'),
              onTableCellRender: xdfsInfo =>{
                let { errorMessage } = xdfsInfo;
                if (typeof(status) === 'object') {
                  errorMessage = JSON.stringify(errorMessage);
                }
                const defineStatus = ['error', 'normal'];
                const defineStyles = {
                  error: { color: '#DD4B39', backgroundColor: '#FDE7E9' },
                  normal: { color: '#008756', backgroundColor: '#D6F8C5' }
                }
                return (
                  <BaseStatusBadge
                    children={errorMessage ? errorMessage : t('normal')}
                    customStatus={defineStatus}
                    customStyles={defineStyles}
                    status={errorMessage ? 'error' : 'normal'}
                  />
                );
              }
            }),
            {
              id: 'action',
              key: 'action',
              label: t('Operations'),
              onTableCellRender: xdfsInfo => {
                const name = xdfsInfo.name;
                return (
                  <DefaultButton
                    children={`${t('unbind')}`}
                    data={name}
                    onClick={() => {
                      setDeleteXdfs(xdfsInfo)
                      setShowDeleteModal(true)
                    }}
                    startIcon={<Icon>link_off</Icon>}
                    value={name}
                  />
                );
              }
            }
          ]}
          isLoading={isLoading}
          labelRowsPerPage={t('labelRowsPerPage')}
          ordering={ordering}
          page={page}
          rows={ordering.apply(filterListByName)}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      {
        showCreateUserModal &&
        <CreateNativeVolumeModal
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
        />
      }
      {
        showDeleteModal &&
        <ConfirmModal
          confrimText={t('unbind')}
          content={t('sureUnbindGlusterFS', { name: deleteXdfs.name })}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={onDelete}
          title={`${t('unbind')}${t('enSpace')}${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
        />
      }
    </Context.Provider>
  );
}

Xdfs.propTypes = {
  match: PropTypes.object
}
