import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import BreadCrumbs from 'components/BreadCrumbs';
import ConfirmModal from 'components/ConfirmModal';
import { DefaultButton, PrimaryButton, SplitButton } from 'components/BaseButton';
import BasePaper from 'components/BaseMuiPaper';
import { BaseStatusBadge } from 'components/BaseBadge';

import Context from './components/Context';
import GlobalContext from 'layouts/Main/GlobalContext';
import Ordering from './Ordering';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

import ModifyXdfsDetailModal from './components/ModifyXdfsDetailModal';
import AddXdfsDetailModal from './components/AddXdfsDetailModal';
import { getXdfsDetailsVolume, getUserList, getXdfsVolume, deleteXdfsDetail } from 'utils/api';
import { formatBytes } from 'utils';
import { KB, GB } from 'constant';

import styles from './index.module.scss';

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

export default function GlusterDetailsFS({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const { userInfo } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [xdfsList, setXdfsList] = useState([]);
  const [xdfsVolume, setXdfsVolume] = useState([]);
  const [filterListByName, setFilterListByName] = useState([]);

  const [volumeDetail, setVolumeDetail] = useState([]);

  const [showAddXdfsDetailModal, setAddXdfsDetailModal] = useState(false);

  const [showModifyXdfsDetailModal, setModifyXdfsDetailModal] = useState(false);
  const [updateName, setUpdateName] = useState();
  const [userList, setUserList] = useState([]);

  const [ordering, setOrdering] = useState(new Ordering());
  const [keyword, setKeyword] = useState('');
  const [selectedKey, setSelectedKey] = useState(0);
  const [selectedValue, setSelectedValue] = useState([])

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteName, setDeleteName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onDelete = () => {
    deleteXdfsDetail(deleteName)
      .then(() => {
        getData();
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => {
        const msg = err?.data?.message ? err.data.message : err.toString();
        toast.error(msg);
      });
  };

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

  const getData = useCallback(() => {
    setIsLoading(true);
    const searchVolumeName = match.params.path;
    getXdfsDetailsVolume(searchVolumeName)
      .then(json=> setXdfsList(json))
      .catch(err => toast.error(err?.data?.message ? err.data.message : err?.status))
      .finally(() => setIsLoading(false))
  }, []);

  const getUser = useCallback(() => {
    userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER') && 
    getUserList()
      .then(jsonData => setUserList(jsonData.map(item => item.username)))
      .catch(err => toast.error(err?.data ? err.data?.message : err.toString()));
  }, [userInfo]);

  const getVolume = useCallback(() => {
    getXdfsVolume()
      .then(json => setXdfsVolume(json))
      .catch(err => toast.error(err?.message ? err.message : err.toString()));
  }, []);

  const context = {
    getData,
    userList,
    isLoading,
    updateName
  };

  useEffect(() => {
    setFilterListByName(() => {
      const filterListByName = xdfsList.filter(userInfo =>
        userInfo.name.includes(keyword)
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

  useEffect(() => {
    if (!isEmpty(xdfsVolume)) {
      const foundData = xdfsVolume.find(el => el.name === match.params.path)
      if (isEmpty(foundData)) {
        history.push('/xdfs');
        return
      }
      setVolumeDetail({
        name: foundData.name,
        available: foundData.available
      })
    }
  }, [match.params.path, xdfsVolume])

  useEffect(getData, []);
  useEffect(getVolume, []);
  useEffect(getUser, [userInfo]);

  return (
    <Context.Provider value={context}>
      <BreadCrumbs />
      <div className={styles.topBar}>
        <div className={styles.marginRight15}>
          {`${t('volumeGlusterFS')}： ${volumeDetail.name !== undefined ? volumeDetail.name : '' }`}
        </div>
        <div className={styles.text}>
          {`${t('available')}： `}
          {volumeDetail.available ? formatBytes(volumeDetail.available * KB) : <CircularProgress />}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
        <div>
          <PrimaryButton
            children={`${t('add')}${t('enSpace')}${t('xdfs')}`}
            classes={{
              root: classes.marginRight10,
              startIcon: classes.iconClearMarginLeft
            }}
            disabled={error !== null ? true : false}
            onClick={() => setAddXdfsDetailModal(true)}
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
            classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
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
          <Link
            to={'/xdfs'}
          >
            <DefaultButton
              children={`${t('back')}`}
              startIcon={<Icon>arrow_back</Icon>}
            />
          </Link>
        </div>
      </div>
      {/* <div className={styles.wrapper}> */}
      <BasePaper
        columns={[
          applySortProps({
            id: 'name',
            key: 'name',
            label: t('name'),
            onTableCellRender: xdfsInfo => (xdfsInfo.name)
          }),
          {
            id: 'volume',
            key: 'volume',
            label: `${t('enSpace')}${t('volumeGlusterFS')}`,
            onTableCellRender: xdfsInfo => (xdfsInfo.volume)
          },
          applySortProps({
            id: 'size',
            key: 'size',
            label: t('space'),
            onTableCellRender: xdfsInfo => {
              const sizeConvertToGB = formatBytes(xdfsInfo.size * GB);
              return (sizeConvertToGB);
            }
          }),
          applySortProps({
            id: 'used',
            key: 'used',
            label: t('used'),
            onTableCellRender: xdfsInfo => {
              const usedSpaceConvertToGB = formatBytes(xdfsInfo.used * KB);
              return (usedSpaceConvertToGB);
            }
          }),
          applySortProps({
            id: 'allocated',
            key: 'allocated',
            label: t('allocatable'),
            onTableCellRender: xdfsInfo => {
              const canSplitSpaceConvertToGB = formatBytes(xdfsInfo.available * KB);
              return (<>{canSplitSpaceConvertToGB}</>);
            }
          }),
          {
            id: 'status',
            key: 'status',
            label: t('status'),
            onTableCellRender: xdfsInfo => {
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
          },
          {
            id: 'action',
            key: 'action',
            label: t('Operations'),
            onTableCellRender: xdfsInfo => {
              const options = [
                {
                  id: 'delete',
                  key: 'delete',
                  label: t('delete'),
                  icon: <Icon style={{ marginRight: '10px' }}>delete</Icon>,
                  handleItemclick: () => {
                    setShowDeleteModal(true);
                    setDeleteName(xdfsInfo.name)
                  }
                }
              ];
              return (
                <>
                  <SplitButton
                    onClick={() => {
                      setUpdateName(xdfsInfo.name);
                      setModifyXdfsDetailModal(true);
                    }}
                    options={options}
                    startIcon={<Icon>edit</Icon>}
                    text={t('Edit')}
                  />
                </>
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
      {/* </div> */}
      {
        showAddXdfsDetailModal &&
        <AddXdfsDetailModal
          isOpen={showAddXdfsDetailModal}
          onClose={() => setAddXdfsDetailModal(false)}
          setError={setError}
        />
      }
      {
        showModifyXdfsDetailModal &&
        <ModifyXdfsDetailModal
          isOpen={showModifyXdfsDetailModal}
          onClose={() => setModifyXdfsDetailModal(false)}
          setError={setError}
        />
      }
      {
        showDeleteModal &&
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
      }
    </Context.Provider>
  );
}

GlusterDetailsFS.propTypes = {
  match: PropTypes.object
}
