import React, {
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';

// # API
import {
  getGlusterfsVolume,
  getGlusterfsVolumeWhichCanBind,
  deleteGlustersVolume
} from 'utils/api';

// ? context
import Context from './components/Context';
import GlusterFSContext from '../../GlusterFSContext';

// ^ Material-ui Components(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import MuiDropdown from 'components/BaseMuiDropdown';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BasePaper from 'components/BaseMuiPaper';
import ConfirmModal from 'components/ConfirmModal';
import Link from 'components/BaseLink';
import { BaseStatusBadge } from 'components/BaseBadge';
import Ordering from './Ordering';
import { formatBytes } from 'utils';
import { KB } from 'constant';
import CreateNativeVolumeModal from './components/CreateNativeVolumeModal';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/GlusterFSRoute/GlusterFS
 * @component GlusterFS
 * @description GlusterFS list page
*/
export default function GlusterFS({ match }) {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(GlusterFSContext);

  // # states
  const [isLoading, setIsLoading] = useState(false);
  const [glusterfsList, setGlusterfsList] = useState([]);
  const [filterListByName, setFilterListByName] = useState([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [volumeCanBind, setVolumeCanBind] = useState([]);
  const [deleteGlusterfs, setDeleteGlusterfs] = useState([]);
  const [ordering, setOrdering] = useState(new Ordering());
  const [keyword, setKeyword] = useState('');
  const [selectedKey, setSelectedKey] = useState(0);
  const [selectedValue, setSelectedValue] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // - methods
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
    deleteGlustersVolume(deleteGlusterfs.name)
      .then(() => {
        toast.success(`${t('unbind')}${t('enSpace')}${t('success')}`)
        getData();
      })
      .catch(err => {
        const msg = err?.data?.message ? err?.data?.message : err.toString();
        toast.error(msg);
      });
  }, [deleteGlusterfs]);

  const getData = useCallback(() => {
    setIsLoading(true);
    Promise.all([getGlusterfsVolume(), getGlusterfsVolumeWhichCanBind()])
      .then(([list, volume]) => {
        setGlusterfsList(list);
        setVolumeCanBind(volume);
        setIsLoading(false);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }, []);


  // & handled data
  const context = {
    getData,
    volumeCanBind
  };

  // * hooks
  useEffect(getData, []);

  useEffect(() => {
    setFilterListByName(() => {
      const filterListByName = glusterfsList.filter(data =>
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
  }, [glusterfsList, keyword, selectedKey])

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
              root: classes.mr_10,
              startIcon: classes.ml_0
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
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
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
      {
        isLoading
          ? <></>
          :
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <BasePaper
              columns={[
                applySortProps({
                  id: 'name',
                  key: 'name',
                  label: t('name'),
                  onTableCellRender: glusterfsInfo => {
                    return (
                      <Link
                        to={`${match.path}/${glusterfsInfo.name}`}
                      >
                        {glusterfsInfo.name}
                      </Link>
                    );
                  }
                }),
                applySortProps({
                  id: 'source',
                  key: 'source',
                  label: `${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`,
                  onTableCellRender: glusterfsInfo => glusterfsInfo.source
                }),
                applySortProps({
                  id: 'size',
                  key: 'size',
                  label: t('space'),
                  onTableCellRender: glusterfsInfo => {
                    const sizeConvetToGB = formatBytes(glusterfsInfo.size * KB);
                    return (<>{sizeConvetToGB}</>);
                  }
                }),
                applySortProps({
                  id: 'used',
                  key: 'used',
                  label: t('used'),
                  onTableCellRender: glusterfsInfo => {
                    const usedSpaceConvetToGB = formatBytes(glusterfsInfo.used * KB);
                    return (<>{usedSpaceConvetToGB}</>);
                  }
                }),
                applySortProps({
                  id: 'allocatable',
                  key: 'allocatable',
                  label: t('available'),
                  onTableCellRender: glusterfsInfo => {
                    const canSplitSpaceConvertToGB = formatBytes(glusterfsInfo.available * KB);
                    return (<>{canSplitSpaceConvertToGB}</>);
                  }
                }),
                applySortProps({
                  id: 'allocated',
                  key: 'allocated',
                  label: t('allocated'),
                  onTableCellRender: glusterfsInfo => {
                    const splitedSpaceConvertToGB = formatBytes(glusterfsInfo.request * KB);
                    return (<>{splitedSpaceConvertToGB}</>);
                  }
                }),
                applySortProps({
                  id: 'available',
                  key: 'available',
                  label: t('allocatable'),
                  onTableCellRender: glusterfsInfo => {
                    const splitedSpaceConvertToGB = formatBytes((glusterfsInfo.request - glusterfsInfo.used) * KB);
                    return (<>{splitedSpaceConvertToGB}</>);
                  }
                }),
                applySortProps({
                  id: 'status',
                  key: 'status',
                  label: t('status'),
                  onTableCellRender: glusterfsInfo =>{
                    let { errorMessage } = glusterfsInfo;
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
                  onTableCellRender: glusterfsInfo => {
                    const name = glusterfsInfo.name;
                    return (
                      <DefaultButton
                        children={`${t('unbind')}`}
                        data={name}
                        onClick={() => {
                          setDeleteGlusterfs(glusterfsInfo)
                          setShowDeleteModal(true)
                        }}
                        startIcon={<Icon>link_off</Icon>}
                        value={name}
                      />
                    );
                  }
                }
              ]}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={ordering.apply(filterListByName)}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
      }
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
          content={t('sureUnbindGlusterFS', { name: deleteGlusterfs.name })}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={onDelete}
          title={`${t('unbind')}${t('enSpace')}${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
        />
      }
    </Context.Provider>
  );
}

GlusterFS.propTypes = {
  match: PropTypes.object
}
