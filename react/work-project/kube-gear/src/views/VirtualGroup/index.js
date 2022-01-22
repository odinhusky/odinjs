import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

import { BaseLink } from 'components/BaseLink';
import { DefaultButton, SplitButton } from 'components/BaseButton';
import BreadCrumbs from 'components/BreadCrumbs';
import MuiDropdown from 'components/BaseMuiDropdown';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import ConfirmModal from 'components/ConfirmModal';

import { useSelector } from 'react-redux';
import { selectResourceUnit } from 'layouts/Main/features/resourceunit/resourceunitSlice';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import Filter from './Filter';

import { getVg, getResource, deleteResourceVirtualGroup } from 'utils/api';
import Ordering from './Ordering';
import Context from './Context';
import { MB } from 'constant';
import { formatBytes } from 'utils';

import ModifyModal from './components/ModifyModal';
import UserSettingModal from './components/UserSettingModal';

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
  },
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

const VirtualGroup = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const resourceUnits = useSelector(selectResourceUnit)

  const [VGInfoList, setVGInfoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [ordering, setOrdering] = useState(new Ordering());
  const [filter, setFilter] = useState(new Filter());
  const [selectedVgName, setSelectedVgName] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modifyGroupData, setModifyGroupData] = useState();
  const [originModifyResourceSelectedData, setOriginModifyResourceSelectedData] = useState({});
  const [originUserSettingGroupSelectedData, setOriginUserSettingGroupSelectedData] = useState({});
  const [isModifyGroupModalShow, setIsModifyGroupModalShow] = useState(false);
  const [isUserSettingModalShow, setIsUserSettingModalShow] = useState(false);
  const [userSettingVgCells, setUserSettingVgCells] = useState(false);

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

  const onDelete = () => {
    setShowDeleteModal(false);
    setModalContent('');
    setSelectedVgName('');
    setIsDeleting(true);
    deleteResourceVirtualGroup(selectedVgName)
      .then(() => {
        getData();
        setIsDeleting(false);
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => {
        setIsDeleting(false);
        toast.error(err.data.message);
      })
  };

  const getData = async () => {
    setIsLoading(true);
    await Promise.all([getVgData(), getResourceData()])
    setIsLoading(false);
  }

  const filterOption = () => {
    const set = new Set();
    const VGInfoListNotIncludeTotal = VGInfoList.filter(item => item.name !== 'total')
    const resourceList = Object.values(VGInfoListNotIncludeTotal)
      .map((item) => ({
        key: item.resource,
        text: item.resource === null ? `${t('default')}${t('resource')}` : `${item.resource}`,
        type: 'resource'
      }))
      .filter(item => !set.has(item.key) ? set.add(item.key) : false);

    return [
      { key: 'resource', text: t('resource'), type: '', itemType: 2 },
      { key: 'divider_1', text: '-', itemType: 0 },
      ...resourceList,
      { key: 'divider_3', text: '-', itemType: 0 },
      { key: 'reset', text: t('clearOption'), type: 'clear', itemType: 1, onClick: clearFilter }
    ];
  };

  const clearFilter = () => setSelectedResources([])

  const getVgData = () => {
    Promise.all([getVg()])
      .then(([vgInfos]) => {
        const list = []
        for (const vgInfo of vgInfos) {
          const { cells, usedCells } = vgInfo;
          const perTotalResource = []
          const perUsedResource = []

          // caculate pre resource and pre unit
          for (const key in cells) {
            const { resourceUnit: unit, number } = cells[key];
            perTotalResource.push({
              cpu: resourceUnits[unit].cpu * number,
              memory: resourceUnits[unit].memory * number,
              gpu: resourceUnits[unit].gpu === null ? 0 : resourceUnits[unit].gpu * number
            })
            if (usedCells[key] !== undefined) {
              perUsedResource.push({
                cpuUsed: resourceUnits[unit].cpu * usedCells[key],
                memoryUsed: resourceUnits[unit].memory * usedCells[key],
                gpuUsed: resourceUnits[unit].gpu === null ? 0 : resourceUnits[unit].gpu * usedCells[key]
              })
            }
          }

          const totalResource = perTotalResource.reduce((acc, cur) => {
            return {
              cpu: acc.cpu + cur.cpu,
              memory: acc.memory + cur.memory,
              gpu: acc.gpu + (cur.gpu === null ? 0 : cur.gpu)
            }
          }, { cpu: 0, memory: 0, gpu: 0 })

          const usedResource = perUsedResource.reduce((acc, cur) => {
            return {
              cpuUsed: acc.cpuUsed + cur.cpuUsed,
              memoryUsed: acc.memoryUsed + cur.memoryUsed,
              gpuUsed: acc.gpuUsed + cur.gpuUsed
            }
          }, { cpuUsed: 0, memoryUsed: 0, gpuUsed: 0 })

          list.push({ ...vgInfo, totalResource, usedResource })
        }
        setVGInfoList(list)
      })
      .catch(err => {
        toast.error(err.data ? err.data.message : err.message);
      })
  }

  const getResourceData = (name = 'system') => {
    setIsLoading(true)
    getResource(name)
      .then(res => {
        setTreeData([res])
      })
      .catch(err => {
        toast.error(err?.data ? err.data.message : err.message)
      })
  }

  const findModifyResourceSelectedData = (data) => {
    const findActive = data.find(element => element.name === originModifyResourceSelectedData.resource)
    if (!isEmpty(findActive)) {
      return findActive
    } else {
      const findChildren = data.flatMap(item => item.children)
      return !isEmpty(findChildren) ? findModifyResourceSelectedData(findChildren) : {}
    }
  }

  useEffect(() => {
    if (!isEmpty(originModifyResourceSelectedData)) {
      (() => {
        const data = { ...originModifyResourceSelectedData };
        const parentData = findModifyResourceSelectedData(treeData);

        const { cells, usedCells } = parentData
        const totalCells = {}

        // caculate total
        for (const [key, details] of Object.entries(cells)) {
          const { number } = details;
          totalCells[key] = number
        }

        // caculate remain
        const remainCells = Object.entries(totalCells).reduce((acc, [key, number]) => {
          const usedNumber = usedCells[key] || 0;
          const count = number - usedNumber
          if (count > 0) {
            acc[key] = count
          }
          return acc
        }, {})

        const updateParentData = { ...parentData, totalCells, remainCells }

        const mergeCells = Object.entries(remainCells).reduce((acc, [key, number]) => {
          const newAcc = { ...acc }
          if (newAcc[key]) {
            newAcc[key] = {
              ...newAcc[key],
              number: newAcc[key]['number'] + number
            }
            return { ...newAcc }
          } else {
            return { ...newAcc, [key]: updateParentData['cells'][key] }
          }
        }, data.cells)

        const result = {
          ...data,
          cells: mergeCells
        }

        setModifyGroupData(result)
      })()
    }
  }, [originModifyResourceSelectedData])

  useEffect(() => {
    if (!isModifyGroupModalShow) {
      setOriginModifyResourceSelectedData({})
      setModifyGroupData({})
    }
  }, [isModifyGroupModalShow])

  useEffect(() => {
    if (!isUserSettingModalShow) {
      setOriginUserSettingGroupSelectedData({})
    }
  }, [isUserSettingModalShow])

  useEffect(() => {
    setFilter(new Filter(searchText, selectedResources));
  }, [searchText, selectedResources])

  useEffect(() => {
    getData();
  }, [])

  const context = {
    getData,
    filter,
    setIsModifyGroupModalShow,
    setModifyGroupData,
    modifyGroupData,
    setOriginModifyResourceSelectedData,
    originModifyResourceSelectedData
  };

  return (
    <Context.Provider value={context}>
      <div
        className={styles.container}
        style={{ position: 'relative', padding: '0 20px 20px' }}
      >
        <BreadCrumbs />
        <div className={styles.topBar}>
          <div>
            <DefaultButton
              children={t('refresh')}
              disabled={isLoading}
              onClick={getData}
              startIcon={<Refresh />}
            />
          </div>
          <div style={{ display: 'flex' }}>
            <MuiAutocomplete
              classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
              onInputChange={(e, value) => setSearchText(value)}
              placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
              value={searchText}
            />
            <MuiDropdown
              list={filterOption()}
              maxWidth={150}
              multiple
              onChange={(e, child) => {
                if (child.props.type === 'clear') {
                  child.props.onClick()
                  return
                }
                const result = e.target.value.filter(item => item !== undefined)
                setSelectedResources(result);
              }}
              text={`${t('select')}${t('enSpace')}${t('resource')}`}
              value={selectedResources}
            />
          </div>
        </div>
        <div className={styles.wrapperPaper}>
          <BasePaper
            columns={[
              applySortProps({
                id: 'name',
                key: 'name',
                label: t('name'),
                onTableCellRender: data => {
                  if (data.name === 'total') {
                    return (
                      <div>
                        {t('pool')}
                      </div>
                    );
                  }
                  return (
                    <BaseLink to={`job-detail?vgName=${data.name}`}>
                      {data.name}
                    </BaseLink>
                  );
                }
              }),
              applySortProps({
                id: 'memoryUsed',
                key: 'memoryUsed',
                label: `${t('used')}${t('enSpace')}${t('memory')}`,
                onTableCellRender: data => (
                  <div>
                    {formatBytes(data.usedResource.memoryUsed * MB)}
                  </div>
                )
              }),
              applySortProps({
                id: 'memoryTotal',
                key: 'memoryTotal',
                label: `${t('total')}${t('enSpace')}${t('memory')}`,
                onTableCellRender: data => (
                  <div>
                    {formatBytes(data.totalResource.memory * MB)}
                  </div>
                )
              }),
              applySortProps({
                id: 'cpuUsed',
                key: 'cpuUsed',
                label: `${t('used')}${t('enSpace')}${t('CPU')}`,
                onTableCellRender: data => (
                  <div>
                    {data.usedResource.cpuUsed}
                  </div>
                )
              }),
              applySortProps({
                id: 'cpuTotal',
                key: 'cpuTotal',
                label: `${t('total')}${t('enSpace')}${t('CPU')}`,
                onTableCellRender: data => (<div>{data.totalResource.cpu}</div>)
              }),
              applySortProps({
                id: 'gpuUsed',
                label: `${t('used')}${t('enSpace')}${t('GPU')}`,
                onTableCellRender: data => (<div>{data.usedResource.gpuUsed}</div>)
              }),
              applySortProps({
                id: 'gpu',
                label: `${t('total')}${t('enSpace')}${t('GPU')}`,
                onTableCellRender: data => (<div>{data.totalResource.gpu}</div>)
              }),
              {
                id: 'unit',
                label: `${t('total')}${t('enSpace')}${t('unit')}`,
                onTableCellRender: (data) => {
                  const { usedCells, cells } = data;
                  const totalNum = Object.values(cells).reduce((prev, current) => prev + current.number, 0)
                  return (
                    <Tooltip
                      title={
                        totalNum > 0
                          ?
                          <div>
                            {
                              Object.entries(cells).map(([key, details]) => {
                                const usedNum = usedCells[key] !== undefined ? usedCells[key] : 0;
                                return (
                                  <div
                                    key={key}
                                    style={{ padding: 4 }}
                                  >
                                    {details.name}: {t('usePcs', { num: usedNum })} - {t('totalPcs', { num: details.number })}
                                  </div>
                                )
                              })
                            }
                          </div>
                          : ''
                      }
                    >
                      <div style={{ backgroundColor: '#c6ecde', textAlign: 'center', cursor: 'pointer' }}>{totalNum}</div>
                    </Tooltip>
                  )
                }
              },
              applySortProps({
                id: 'activeJobs',
                key: 'activeJobs',
                label: `${t('Jobs')}`,
                onTableCellRender: data => (<div>{data.activeJobs}</div>)
              }),
              applySortProps({
                id: 'resource',
                key: 'resource',
                label: t('resource'),
                onTableCellRender: data => (<div>{data.resource}</div>)
              }),
              applySortProps({
                id: 'schedulable',
                key: 'schedulable',
                label: t('schedulable'),
                onTableCellRender: data => (<div>{data.name !== 'total' ? t(data.schedulable ? 'yes' : 'no') : null}</div>)
              }),
              {
                id: 'action',
                label: t('Operations'),
                onTableCellRender: (data) => {
                  const { name } = data;
                  if (name === 'total') return;
                  const options = [
                    {
                      id: 'setting',
                      label: `${t('UserConfig')}`,
                      handleItemclick: () => {
                        setIsUserSettingModalShow(true);
                        setOriginUserSettingGroupSelectedData(data)
                        setUserSettingVgCells({ vg: data.name, cells: data.cells })
                      },
                      icon: <Icon>app_registration</Icon>
                    },
                    {
                      id: 'delete',
                      label: t('delete'),
                      handleItemclick: () => {
                        setSelectedVgName(name);
                        setModalContent(`${t('warning')}:\n
                        1. ${t('vgDelWarning1')}\n
                        2. ${t('vgDelWarning2')}\n

                        ${t('sureDelete', { name: name })}`);
                        setShowDeleteModal(true);
                      },
                      icon: <Icon style={{ marginRight: '10px' }}>delete</Icon>
                    }
                  ]
                  return (
                    <>
                      {
                        isDeleting
                          ? <CircularProgress />
                          :
                          <div>
                            <SplitButton
                              onClick={() => {
                                setIsModifyGroupModalShow(true)
                                setOriginModifyResourceSelectedData(data)
                              }}
                              options={options}
                              startIcon={<Icon>edit</Icon>}
                              text={t('Edit')}
                            />
                          </div>
                      }
                    </>
                  )
                }
              }
            ]}
            labelRowsPerPage={t('labelRowsPerPage')}
            ordering={ordering}
            page={page}
            rows={ordering.apply(filter.apply(VGInfoList))}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
        {
          isModifyGroupModalShow &&
          <ModifyModal
            isOpen={isModifyGroupModalShow}
            onClose={() => setIsModifyGroupModalShow(false)}
            resourceUnits={resourceUnits}
          />
        }
        {
          showDeleteModal &&
          <ConfirmModal
            confrimText={t('delete')}
            content={modalContent}
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={onDelete}
            title={`${t('delete')}${t('enSpace')}${t('group')}`}
          />
        }
        {
          isUserSettingModalShow &&
          <UserSettingModal
            data={userSettingVgCells}
            getRefreshData={getData}
            isOpen={isUserSettingModalShow}
            onClose={() => setIsUserSettingModalShow(false)}
            originUserSettingGroupSelectedData={originUserSettingGroupSelectedData}
            resourceUnits={resourceUnits}
          />
        }
      </div>
    </Context.Provider>
  );
};

export default VirtualGroup;
