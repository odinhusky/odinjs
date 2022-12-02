import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

// # API
import { getVg, getResource, deleteResourceVirtualGroup } from 'utils/api';

// ? context
import VirtualGroupContext from './VirtualGroupContext';

// ^ Material-ui Components(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import Filter from './Filter';
import Ordering from './Ordering';
import { MB } from 'constant';
import { formatBytes } from 'utils';
import ModifyModal from './components/ModifyModal';
import UserSettingModal from './components/UserSettingModal';
import { BaseLink } from 'components/BaseLink';
import { DefaultButton, SplitButton } from 'components/BaseButton';
import BreadCrumbs from 'components/BreadCrumbs';
import MuiDropdown from 'components/BaseMuiDropdown';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import ConfirmModal from 'components/ConfirmModal';
// import { BaseTooltip } from 'components/BaseTooltip';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'
import virtualGroupStyle from './virtualGroupStyle'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...virtualGroupStyle(theme)
}))

// ^ plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty, get, cloneDeep } from 'lodash';

const VirtualGroup = () => {

  // $ init data
  const { t } = useTranslation();

  // = classes
  const classes = useStyles();

  // # states
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

  // 點選編輯後，欲編輯的叢集的物件資料
  const [originModifyGroupSelectedData, setOriginModifyGroupSelectedData] = useState({});

  // 透過 originModifyGroupSelectedData 計算出各個資源的最大值(denominatorCells)，並且包含所有 originModifyGroupSelectedData 的 key: value
  const [modifyGroupData, setModifyGroupData] = useState();

  const [originUserSettingGroupSelectedData, setOriginUserSettingGroupSelectedData] = useState({});
  const [isModifyGroupModalShow, setIsModifyGroupModalShow] = useState(false);
  const [isUserSettingModalShow, setIsUserSettingModalShow] = useState(false);
  const [userSettingVgCells, setUserSettingVgCells] = useState(false);

  // - methods
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

        const list = vgInfos.map((vgInfo) => {
          const { cells, usedCells } = vgInfo;

          // get 是 lodash 的函式，用於取出物件的值，如果為 falsy 則套用第三個參數的預設值
          const totalResource = {
            cpu: get(cells, 'cpu.number', 0),
            gpu: get(cells, 'gpu.number', 0),
            memory: get(cells, 'memory.number', 0)
          };

          const usedResource =  {
            cpuUsed: get(usedCells, 'cpu', 0),
            gpuUsed: get(usedCells, 'gpu', 0),
            memoryUsed: get(usedCells, 'memory', 0)
          };

          return { ...vgInfo, totalResource, usedResource }
        })

        setVGInfoList(list);
      })
      .catch(err => {
        toast.error(err?.data ? err.data?.message : err?.message);
      })
  }

  const getResourceData = (name = 'system') => {
    setIsLoading(true)
    getResource(name)
      .then(res => {
        setTreeData([res])
      })
      .catch(err => {
        toast.error(err?.data ? err.data?.message : err?.message)
      })
  }

  /**
   * @author odin
   * @description 取得叢集資料以及資源資料
  */
  const getData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([getVgData(), getResourceData()])
    setIsLoading(false);
  }, [getVgData, getResourceData, setIsLoading]);

  const findModifyResourceSelectedData = (data) => {
    const findActive = data.find(element => element.name === originModifyGroupSelectedData.resource)
    if (!isEmpty(findActive)) {
      return findActive
    } else {
      const findChildren = data.flatMap(item => item.children)
      return !isEmpty(findChildren) ? findModifyResourceSelectedData(findChildren) : {}
    }
  }

  // * hooks
  /**
   * @author odin
   * @description 透過點選的叢集資料，來推出該叢集各個資源應該要有的最大值(denominator)為多少
  */
  useEffect(() => {
    if (!isEmpty(originModifyGroupSelectedData)) {
      (() => {
        const data = cloneDeep(originModifyGroupSelectedData);
        const parentData = findModifyResourceSelectedData(treeData);

        // console.log('parentData', parentData);

        const { cells, usedCells } = parentData

        const totalCells = {}

        // 計算出父層節點的 total cells
        for (const [key, details] of Object.entries(cells)) {
          const { number } = details;
          totalCells[key] = number
        }

        // 計算出父層節點的 total cells - used = remain
        const remainCells = Object.entries(totalCells).reduce((acc, [key, number]) => {
          const usedNumber = usedCells[key] || 0;
          const count = number - usedNumber
          acc[key] = count;

          return acc;
        }, {})

        // console.log('remainCells', remainCells);

        // 計算出要編輯的節點的 cells 的各個資源，並且防止有缺 cpu gpu memory gpuMemoryPercentage 任一個 key 值
        const preHandleDataCells = Object.entries(data.cells).reduce((acc, [key, { number }])=> {
          return {
            ...acc,
            [key]: acc[key] + number
          }

        }, { cpu: 0, gpu: 0, memory: 0, gpuMemoryPercentage: 0 });

        // console.log('preHandleDataCells', preHandleDataCells);

        // 計算出要成為分母上限的值
        const denominatorCells = Object.entries(remainCells).reduce((acc, [key, number]) => {
          const newAcc = { ...acc }

          return {
            ...newAcc,
            [key]: newAcc[key] + number
          }
        }, { ...preHandleDataCells })

        // console.log('denominatorCells', denominatorCells);

        const result = {
          ...data,
          denominatorCells
        }

        setModifyGroupData(result)
      })()
    }
  }, [originModifyGroupSelectedData]);

  useEffect(() => {
    if (!isModifyGroupModalShow) {
      setOriginModifyGroupSelectedData({})
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

  // & handled data
  const context = {
    classes,
    getData,
    filter,
    setIsModifyGroupModalShow,
    setModifyGroupData,
    modifyGroupData,
    originModifyGroupSelectedData
  };

  return (
    <VirtualGroupContext.Provider value={context}>
      <div
        className={`
          ${classes.container}
          ${classes.pos_rel}
          ${classes.p_20}
          ${classes.pt_0}
        `}
      >
        <BreadCrumbs />
        <div className={classes.topBar}>
          <div>
            <DefaultButton
              children={t('refresh')}
              disabled={isLoading}
              onClick={getData}
              startIcon={<Refresh />}
            />
          </div>
          <div className={`${classes.d_flex}`}>
            <MuiAutocomplete
              classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
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
        <div className={`${classes.wrapperPaper}`}>
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
              // {
              //   id: 'unit',
              //   label: `${t('total')}${t('enSpace')}${t('unit')}`,
              //   onTableCellRender: (data) => {
              //     const { usedCells, cells } = data;
              //     const totalNum = Object.values(cells).reduce((prev, current) => prev + current.number, 0)
              //     return (
              //       <BaseTooltip
              //         title={
              //           totalNum > 0
              //             ?
              //             <div>
              //               {
              //                 Object.entries(cells).map(([key, details]) => {
              //                   const usedNum = usedCells[key] !== undefined ? usedCells[key] : 0;
              //                   return (
              //                     <div
              //                       key={key}
              //                       style={{ padding: 4 }}
              //                     >
              //                       {details.name}: {t('usePcs', { num: usedNum })} - {t('totalPcs', { num: details.number })}
              //                     </div>
              //                   )
              //                 })
              //               }
              //             </div>
              //             : ''
              //         }
              //       >
              //         <div style={{ backgroundColor: '#E6E9F1', textAlign: 'center', cursor: 'pointer', borderRadius: 4, height: 36, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              //           <div>{totalNum}</div>
              //         </div>
              //       </BaseTooltip>
              //     )
              //   }
              // },
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
                id: 'virtualClusterMode',
                key: 'virtualClusterMode',
                label: t('mode'),
                onTableCellRender: data => {
                  let showWord = 'immediately';

                  if(data.schedulable === true) showWord = 'schedule';
                  if(data.queueable === true) showWord = 'queue';

                  return (
                    <div>{t(showWord)}</div>
                  );
                }
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
                                setOriginModifyGroupSelectedData(data)
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
            getData={getData}
            isOpen={isModifyGroupModalShow}
            modifyGroupData={modifyGroupData}
            onClose={() => setIsModifyGroupModalShow(false)}
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
          />
        }
      </div>
    </VirtualGroupContext.Provider>
  );
};

export default VirtualGroup;
