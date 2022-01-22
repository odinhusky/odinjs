import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Header from 'components/Header';

import { DefaultButton, SplitButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import BasePaper from 'components/BaseMuiPaper';
import BaseStatusBadge from 'components/BaseBadge/BaseStatusBadge';
import StorageChart from './components/StorageChart';
import ProjectInfo from './components/ProjectInfo';
import ConfirmModal from 'components/ConfirmModal';
import LoadingDialog from 'components/LoadingDialog';

import Ordering from './components/Ordering';
import { formatBytes } from 'utils';

import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';

import {
  getNodeState,
  getNodeDockerImages,
  getNodeDockerStorage,
  postNodeDockerImagesPrune,
  deleteNodeDockerImage
} from 'utils/api';

import moment from 'moment';
import { isEmpty, isNull } from 'lodash';
import { toast } from 'react-toastify';

import indexStyles from './index.module.scss';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  formControl: {
    minWidth: 120,
    maxWidth: 150,
    fullWidth: true,
    '& .Mui-focused':{
      top: 0
    }
  },
  selectIcon: {
    top: '25%'
  },
  labelChange: {
    top: -10
  },
  labelChangeHasValue: {
    top: 0
  }
}))

const ImagePage = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const classes = useStyles();

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isConfirmModalShow, setIsConfirmModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [ipAddressOptions, setIpAddressOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedIp, setSelectedIp] = useState('');
  const [images, setImages] = useState([]);
  const [filterImages, setFilterImages] = useState([]);
  const [imagesStatus, setImagesStatus] = useState({ total: 0, unused: 0, using: 0 });
  const [keyword, setKeyword] = useState('');
  const [storageInfos, setStorageInfos] = useState({ size: 0, available: 0, used: 0 });
  const [selectedKey, setSelectedKey] = useState();
  const [modalData, setModalData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const [ordering, setOrdering] = useState(new Ordering());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const getImages = async () => {
    setIsDataLoading(true)
    try {
      const result = await getNodeDockerImages({ ip: selectedIp })
      const storages = await getNodeDockerStorage({ ip: selectedIp })
      setImages(result)
      setStorageInfos(storages)
      const calcImagesStatus = result.reduce((ans, { usedContainers }) => {
        const { total, using, unused } = ans;
        return isNull(usedContainers)
          ?
          {
            ...ans,
            total: total + 1,
            using: using + 1
          }
          :
          {
            ...ans,
            total: total + 1,
            unused: unused + 1
          }
      }, { total: 0, unused: 0, using: 0 })
      setImagesStatus(calcImagesStatus)
      setSelectedRows([])
      setIsDataLoading(false)
    } catch (err) {
      toast.error(err?.data?.message ? err.data.message : err.toString())
      setIsDataLoading(true)
    }
  }

  useEffect(() => {
    setIsDataLoading(true)
    getNodeState()
      .then(res => {
        const { items } = res;
        if (!isEmpty(items)) {
          const result = items.map(item => {
            const { status } = item;
            const { addresses } = status;
            return {
              key: addresses.find(item => item.type === 'InternalIP').address,
              text: addresses.find(item => item.type === 'InternalIP').address
            }
          })
          setIpAddressOptions(result)
        }
      })
      .catch(err => toast.error(err?.data?.message ? err.data.message : err.toString()))
      .finally(() => setIsDataLoading(false))
  }, [])

  useEffect(() => {
    const ip = query.get('ip');
    if (!isEmpty(ipAddressOptions) && ip) {
      setSelectedIp(ip)
    }
  }, [ipAddressOptions])

  useEffect(() => {
    if (selectedIp !== '') {
      getImages(selectedIp)
    }
  }, [selectedIp])

  useEffect(() => {
    setFilterImages(() => {
      const listsArray = ordering.apply(images.filter(item => item.name.includes(keyword)));
      switch(selectedKey) {
        case 'all':
        default:
          return listsArray;
        case 'unused':
          return listsArray.filter(({ usedContainers }) => isNull(usedContainers));
        case 'using':
          return listsArray.filter(({ usedContainers }) => !isNull(usedContainers));
      }
    })
  }, [selectedKey, keyword, images, ordering])

  const columns = [
    applySortProps({
      id: 'name',
      key: 'name',
      label: t('name')
    }),
    applySortProps({
      id: 'tag',
      key: 'tag',
      label: t('tag')
    }),
    applySortProps({
      id: 'usedContainers',
      key: 'usedContainers',
      label: t('status'),
      onTableCellRender: info => {
        const { usedContainers } = info;
        const defineStatus = ['unused', 'using'];
        const defineStyles = {
          unused: { color: '#FFFFFF', backgroundColor: '#B1B5B8' },
          using: { color: '#558B2F', backgroundColor: '#F1F8E9' }
        }
        return (
          <BaseStatusBadge
            children={isNull(usedContainers) ? t('unused') : t('using')}
            customStatus={defineStatus}
            customStyles={defineStyles}
            status={isNull(usedContainers) ? 'unused' : 'using'}
          />
        )
      }
    }),
    applySortProps({
      id: 'id',
      key: 'id',
      label: `${t('image')} Id`
    }),
    applySortProps({
      id: 'size',
      key: 'size',
      label: t('size'),
      onTableCellRender: info => formatBytes(info.size)
    }),
    applySortProps({
      id: 'created',
      key: 'created',
      label: t('createTime'),
      onTableCellRender: info => {
        return moment(new Date(info.created * 1000)).fromNow()
      }
    })
  ]

  return (
    <>
      {
        isDeleting
          ?
          <LoadingDialog
            isOpen={isDeleting}
            subText={t('wait')}
            title={'Loading'}
          />
          :
          <>
            <Header
              headerPath={[
                {
                  title: t('routeName.hardware-image'),
                  link: 'hardware'
                }
              ]}
            />
            <div className={indexStyles.topBar}>
              <div className={indexStyles.left}>
                <MuiDropdown
                  list={ipAddressOptions}
                  maxWidth={150}
                  onChange={(e) => {
                    const value = e.target.value
                    setSelectedIp(value)
                  }}
                  text={`${t('select')}${t('enSpace')}${t('node')}`}
                  value={selectedIp}
                />

                <DefaultButton
                  children={t('refresh')}
                  disabled={isDataLoading}
                  onClick={() => {
                    getImages(selectedIp)
                  }}
                  startIcon={<Refresh />}
                />

                <SplitButton
                  classNameObj={{
                    menuPaper: `${classes.w_auto}`
                  }}
                  disabled={isDataLoading || selectedRows.length === 0}
                  onClick={() => {
                    setModalData({
                      title: `${t('delete')}${t('enSpace')}${t('image')}`,
                      confrimText: `${t('delete')}${t('enSpace')}${t('image')}`,
                      content: t('sureDelete', { name: selectedRows.map(row => row.name).join(', ') }),
                      method: () => {
                        setIsDeleting(true)
                        Promise.all(
                          selectedRows.map(item => {
                            return deleteNodeDockerImage({
                              ip: selectedIp,
                              image: item.tag !== '<none>' ? `${item.name}:${item.tag}` : item.id
                            })
                          })
                        )
                          .then(() => {
                            toast.success(`${t('delete')}${t('enSpace')}${t('success')}`)
                            getImages(selectedIp)
                          })
                          .catch(err => {
                            toast.error(err?.data?.message ? err.data.message : err.toString())
                            getImages(selectedIp)
                          })
                          .finally(() => setIsDeleting(false))
                      }
                    })
                    setIsConfirmModalShow(true)
                  }}
                  options={[
                    {
                      id: 'removeAllNoneImage',
                      label: t('removeAllNoneImage'),
                      icon: <Icon>delete_outline</Icon>,
                      handleItemclick: () => {
                        setIsDeleting(true)
                        postNodeDockerImagesPrune({ ip: selectedIp }, true)
                          .then(() => {
                            toast.success(`${t('delete')}${t('enSpace')}${t('success')}`)
                            getImages(selectedIp)
                          })
                          .catch(err => toast.error(err?.data?.message ? err.data.message : err.toString()))
                          .finally(() => setIsDeleting(false))
                      }
                    },
                    {
                      id: 'removeAllUnusedImage',
                      label: t('removeAllUnusedImage'),
                      icon: <Icon>delete_outline</Icon>,
                      handleItemclick: () => {
                        setIsDeleting(true)
                        postNodeDockerImagesPrune({ ip: selectedIp }, false)
                          .then(() => {
                            toast.success(`${t('delete')}${t('enSpace')}${t('success')}`)
                            getImages(selectedIp)
                          })
                          .catch(err => toast.error(err?.data?.message ? err.data.message : err.toString()))
                          .finally(() => setIsDeleting(false))
                      }
                    }
                  ]}
                  startIcon={<Icon>delete_outline</Icon>}
                  text={`${t('delete')}${t('enSpace')}${t('tag')}`}
                />
              </div>

              <div className={indexStyles.right}>
                <MuiAutocomplete
                  disabled={isDataLoading}
                  onInputChange={(e, value) => setKeyword(value)}
                  placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
                  value={keyword}
                />
                <MuiDropdown
                  disabled={isDataLoading}
                  list={[
                    { text: t('All'), key: 'all', optionkey: 'all' },
                    { text: t('using'), key: 'using', optionkey: 'using' },
                    { text: t('unused'), key: 'unused', optionkey: 'unused' }
                  ]}
                  onChange={(e, child) => {
                    const result = e.target.value;
                    setSelectedStatus(result)
                    setSelectedKey(child.props.optionkey);
                  }}
                  text={`${t('select')}${t('enSpace')}${t('status')}`}
                  value={selectedStatus}
                />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                marginBottom: 16
              }}
            >
              <StorageChart
                info={storageInfos}
              />
              <ProjectInfo
                info={imagesStatus}
              />
            </div>
            <div className={indexStyles.wrapper}>
              <BasePaper
                columns={columns}
                itemChecked
                itemCheckedAllChange={(e, checked, rows) => {
                  const rowsIdArray = rows.map(item => item.id)
                  setSelectedRows(prev => {
                    return checked
                      ? [...[...prev].filter(selected => !rowsIdArray.includes(selected.id)), ...rows]
                      : [...prev].filter(selected => !rowsIdArray.includes(selected.id))
                  })
                }}
                itemCheckedChange={(e, checked, row) => {
                  setSelectedRows(prev => {
                    return checked
                      ? [...prev, row]
                      : [...prev].filter(selected => selected.id !== row.id)
                  })
                }}
                itemCheckedData={selectedRows}
                labelRowsPerPage={t('labelRowsPerPage')}
                ordering={ordering}
                page={page}
                rows={filterImages}
                rowsPerPage={rowsPerPage}
                selectionMode={0}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
          </>
      }
      {
        isConfirmModalShow &&
        <ConfirmModal
          confrimText={modalData.confrimText}
          content={modalData.content}
          isOpen={isConfirmModalShow}
          onClose={() => setIsConfirmModalShow(false)}
          onConfirm={modalData.method}
          title={modalData.title}
        />
      }
    </>
  );
}

ImagePage.propTypes = {

}

export default ImagePage;