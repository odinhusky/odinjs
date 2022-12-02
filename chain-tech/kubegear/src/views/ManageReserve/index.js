import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo
} from 'react';

// # API
import {
  getJobQueue,
  deleteJobQueue,
  moveBeforeJobQueue
} from 'utils/api';

// ? context
import ManageReserveContext from './ManageReserveContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Components(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import theme from 'theme/palette';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// ? Self-packed Components || Functions
import Filter from './Filter';
import { MB } from 'constant';
import { formatBytes } from 'utils';
import { PrimaryButton, DefaultButton, SplitButton } from 'components/BaseButton';
import BreadCrumbs from 'components/BreadCrumbs';
import MuiDropdown from 'components/BaseMuiDropdown';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import BasePaper from 'components/BaseMuiPaper';
import ConfirmModal from 'components/ConfirmModal';
import { BaseTooltip } from 'components/BaseTooltip';
import { BaseTextBadge } from 'components/BaseBadge'
import BaseMuiIcon from 'components/BaseMuiIcon';

import {
  addDropDownOptionKeys,
  proxyGetCanUseVgList
} from 'common/commonMethods'

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'
import manageReserveStyle from './manageReserveStyle'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...manageReserveStyle(theme)
}))

// ^ plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  isEmpty,
  isNil,
  get,
  cloneDeep
} from 'lodash';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';

/**
 * @author odin
 * @level views/ManageReserve Route
 * @component ManageReserve Route
 * @description ManageReserve Route page
*/
const ManageReserve = () => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();
  const overViewObj = {
    '0': 'waiting'
  };

  // ? context
  const { userInfo, isAdmin } = useContext(GlobalContext)

  // = classes
  const classes = useStyles();

  // # states
  const [selfCanUseVgList, setSelfCanUseVgList] = useState([]);
  const [canUseVg, setCanUseVg] = useState([]);
  // 選擇叢集(Vg dropdown)
  const [selectedVgObj, setSelectedVgObj] = useState({ name: '' });

  // 是否可以移動的 checkbox state
  const [canMove, setCanMove] = useState(true);

  // 所有的排隊作業
  const [allQueneJobs, setAllQueneJobs] = useState([]);

  // 由現在選擇的叢集過濾出來的排隊作業
  const [filteredQueneJobs, setFilteredQueneJobs] = useState([]);

  // 當前選擇的叢集過濾、處理後要顯示得資料
  const [showData, setShowData] = useState([]);

  // 總覽的狀態
  const [overViewState, setOverViewState] = useState({});

  // 搜尋功能
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(new Filter());

  // 刪除功能相關
  const [selectedJobName, setSelectedJobName] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 表單頁面限制
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // & Handled data
  const selfCanUseVgListMemo = useMemo(() => (selfCanUseVgList), [selfCanUseVgList]);
  const allQueneJobsMemo = useMemo(() => (allQueneJobs), [allQueneJobs]);
  const filteredQueneJobsMemo = useMemo(() => (filteredQueneJobs), [filteredQueneJobs]);
  const filterMemo = useMemo(() => (filter), [filter]);
  const showDataMemo = useMemo(() => (showData), [showData]);

  // - methods
  /**
   * @author odin
   * @description 設定要刪除的 Modal 提示
  */
  const handleDelete = jobName => {
    setSelectedJobName(jobName);
    setModalContent(t('confirmDeleteQueueJob', { jobName }));
    setShowDeleteModal(true);
  };

  /**
   * @author odin
   * @description 刪除特定的排隊作業
  */
  const onDelete = useCallback(() => {
    setShowDeleteModal(false);
    setModalContent('');
    setSelectedJobName('');
    setIsDeleting(true);
    deleteJobQueue(selectedJobName)
      .then(() => {
        getData();
        setIsDeleting(false);
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => {
        setIsDeleting(false);
        toast.error(err.data.message);
      })
  }, [selectedJobName]);

  /**
   * @author odin
   * @description 取得叢集資料以及排隊作業
  */
  const getData = useCallback(async () => {
    setIsLoading(true);
    const username = userInfo.username;

    try {
      // 取得叢集資料
      if(username) {
        proxyGetCanUseVgList(username, setSelfCanUseVgList)
      }

      // 取得排隊作業資料
      const jobQuene = await getJobQueue();

      setAllQueneJobs(jobQuene);
    } catch (err) {
    // } catch ({ message: msg }) {
      const msg = err.data.message
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * @author odin
   * @param {number} state -- 該作業的狀態
   * @description 根據不同的狀態給予不同的狀態背景色、文字顏色、文字內容
  */
  const getStateDetail = (state) => {
    let bgColor = '';
    let text = '';
    let textClass = '';

    switch (state) {
      // 等待中
      case 0:
        bgColor = `${theme.reserve.waiting.bg}`;
        text = t('waiting');
        textClass = `${classes.waitingStatusText}`
        break;
    }

    return {
      bgColor,
      text,
      textClass
    }
  };

  /**
   * @author odin
   * @param {string} selectedVgName -- Vg dropdown 選擇的 '叢集名稱'
   * @description 將該function傳入子component中，選擇不同的叢集時，帶入名稱，並且依照選擇的叢集重新取得資料渲染畫面
  */
  const handleVgDropdownChange = (selectedVgName) => {
    // 找出 選擇的Vg 物件
    const nowSelectedVgObj = canUseVg.find(item => item.name === selectedVgName);

    // 設定選擇的 Vg 並且 重新取得排程內容
    setSelectedVgObj(nowSelectedVgObj)
  };

  /**
   * @author odin
   * @param {array} filteredJobQuenesByVgName -- 用叢集名稱過濾後的排隊作業
   * @description 控制 react-beautiful-dnd 的 onDragUpdate 方法，拖曳結束後要做的事情
  */
  const handleDragEnd = useCallback(async (e) => {
    // console.log('canMove', canMove)
    // console.log('e', e)

    if(canMove) {
      // 處理移動工作
      const { source, destination } = e;

      // 如果目的地都沒變就跳出
      if (source.index === destination.index) return;

      // 找出目前過濾顯示的資料
      const filteredShowData = filter.apply(showData);
      const copyShowData = [ ...cloneDeep(filteredShowData) ];
      const totalLength = copyShowData.length;

      // 被移動的作業的名稱
      const movedJobName = copyShowData[source.index].jobName;
      const targetJobName = destination.index + 1 === totalLength
        ? null
        : source.index < destination.index
          ? copyShowData[destination.index + 1].jobName
          : copyShowData[destination.index].jobName;

      // 打 API 成功後重新取得排序過後的資料
      try {
        await moveBeforeJobQueue(movedJobName, targetJobName);
        getData();
      } catch (err) {
      // } catch ({ message: msg }) {
        const msg = err.data.message
        toast.error(msg);
      }

    } else {
      // 提示必須要勾選編輯順序(Draggable)才能修改順序
      toast.error(t('checkDraggableToDrag'))
    }
  }, [canMove, filterMemo, showDataMemo]);

  /**
   * @author odin
   * @param {array} filteredJobQuenesByVgName -- 用叢集名稱過濾後的排隊作業
   * @description 計算各個狀態的總數為多少
  */
  const handleOverView = (filteredJobQuenesByVgName) => {

    if(isEmpty(filteredJobQuenesByVgName)) return;

    const result = filteredJobQuenesByVgName.reduce((acc, { state }) => {
      const key = overViewObj[state];
      const prevValue = get(acc, key, 0);

      return {
        ...acc,
        [overViewObj[state]]: prevValue + 1
      }
    }, {});

    setOverViewState(result);
  };

  // * hooks
  /**
   * @author odin
   * @description 解決如果從其他頁面跳轉來提交作業的話，維持左側欄位的 highlight 在提交作業上
  */
  useEffect(() => {
    $('.treeview').removeClass('menu-open')
      .children('.treeview-menu').slideUp('fast')
      .children('.treeview-menu-li').removeClass('active');

    $('#sidebar-menu--model-training').addClass('menu-open')
      .children('.treeview-menu').slideDown('fast')
      .children('#sidebar-menu--model-management--queue').addClass('active');
  }, []);

  /**
   * @author odin
   * @description 一開始取得所有的資料
  */
  useEffect(() => {
    getData();
  }, []);

  /**
   * @author odin
   * @description 過濾可以排成的叢集，並且預設第一個叢集為預設值
  */
  useEffect(() => {
    // 過濾出可以排程的叢集
    const queueableData = selfCanUseVgList.filter(item => item.queueable !== false);

    // console.log('queueableData', queueableData);

    // 儲存結果到 state 上
    setCanUseVg(queueableData);

    // 預設第一個叢集為目前選擇的叢集
    if (!isEmpty(queueableData)) {
      const defaultVgObj = queueableData[0];

      // 設定選擇的 Vg 並且 重新取得排程內容
      setSelectedVgObj(defaultVgObj)
    }
  }, [selfCanUseVgListMemo]);

  /**
   * @author odin
   * @description 過濾排隊的作業
  */
  useEffect(() => {
    if(isNil(selectedVgObj.name)) return;

    const selectedVgName = selectedVgObj.name;
    const filteredJobQuenesByVgName = allQueneJobs.filter(({ virtualGroup }) => selectedVgName === virtualGroup);

    handleOverView(filteredJobQuenesByVgName);
    setFilteredQueneJobs(filteredJobQuenesByVgName);
  }, [allQueneJobsMemo, selectedVgObj.name]);

  /**
   * @author odin
   * @description 更新過濾器
  */
  useEffect(() => {
    setFilter(new Filter(searchText));
  }, [searchText]);

  /**
   * @author odin
   * @description 依照需要顯示的需求產生出排序好的顯示資料
  */
  useEffect(() => {
    const data = filteredQueneJobs.map((item, i) => {

      // state: 0 => 等待中
      const { jobName, user, message, virtualGroup, jobConfig, state } = item;

      const {
        totalCPU,
        totalGPU,
        totalMemoryMB,
        totalGPUMemoryPercentage
      } = Object.entries(cloneDeep(jobConfig.taskRoles)).reduce((acc, [, { resourcePerInstance }]) => {
        const thisCPU = get(resourcePerInstance, 'cpu', 0);
        const thisGPU = get(resourcePerInstance, 'gpu', 0);
        const thisMemoryMB = get(resourcePerInstance, 'memoryMB', 0);
        const thisGPUMemoryPercentage = get(resourcePerInstance, 'gpuMemoryPercentage', 100) * thisGPU;

        return {
          ...acc,
          totalCPU: acc.totalCPU += thisCPU,
          totalGPU: acc.totalGPU += thisGPU,
          totalMemoryMB: acc.totalMemoryMB += thisMemoryMB,
          totalGPUMemoryPercentage: acc.totalGPUMemoryPercentage += thisGPUMemoryPercentage
        }
      }, {
        totalCPU: 0,
        totalGPU: 0,
        totalMemoryMB: 0,
        totalGPUMemoryPercentage: 0
      });

      return {
        order: i + 1,
        jobName,
        virtualGroup,
        user,
        message,
        state,
        totalCPU,
        totalGPU,
        totalMemoryMB,
        totalGPUMemoryPercentage
      }
    });

    // console.log('data', data);

    setShowData(data);
  }, [filteredQueneJobsMemo]);

  // & handled data
  const context = {
    classes
  };

  return (
    <ManageReserveContext.Provider value={context}>
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
          <div className={`${classes.mr_auto} ${classes.flex_align_center}`}>
            <div>
              {/* 選擇集群 */}
              <MuiDropdown
              // className
                classNameObj={{
                  container: `${classes.mr_10}`
                }}
                list={addDropDownOptionKeys(canUseVg)}
                onChange={(e, option) => {
                // 帶入名稱，並且依照選擇的叢集重新取得資料渲染畫面
                  handleVgDropdownChange(option.props.value)
                }}
                onRenderOption={(data) => {
                  return (
                    <div className={`${classes.flex_align_center}`}>
                      <div>{data.name}</div>
                    </div>
                  )
                }}
                text={`${t('select')}${t('vitualCluster')}`}
                value={selectedVgObj.name}
              />
            </div>

            {/* 重新整理 */}
            <div className={`${classes.mr_10}`}>
              <DefaultButton
                children={t('refresh')}
                disabled={isLoading}
                onClick={() => { getData() }}
                startIcon={<BaseMuiIcon children="refresh" />}
              />
            </div>

            {/* 提交作業按鈕 */}
            <div className={`${classes.mr_10}`}>
              <PrimaryButton
                children={`${t('submit')}${t('enSpace')}${t('job')}`}
                onClick={() => history.push('/job-submit')}
                startIcon={<BaseMuiIcon children="add_circle" />}
              />
            </div>

            {/* 是否可以移動順序 */}
            {
              isAdmin && (
                <div className={`${classes.flex_align_center}`}>
                  <FormControlLabel
                    classes={{
                      label: `${classes.fz_16}`
                    }}
                    className={`${classes.m_0}`}
                    control={
                      <Switch
                        checked={canMove}
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        name="checkedA"
                        onChange={(e) => { setCanMove(e.target.checked)}}
                      />
                    }
                    label={`${t('draggable')}`}
                  />

                  <div>
                    <BaseTooltip
                      arrow
                      title={`${t('dragHint')}`}
                    >
                      <BaseMuiIcon
                        children={'info'}
                        className={`${classes.fz_18}`}
                        isIconButton
                      />
                    </BaseTooltip>
                  </div>
                </div>
              )
            }
          </div>

          {/* 搜尋文字 */}
          <div className={`${classes.d_flex}`}>
            <MuiAutocomplete
              classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
              onInputChange={(e, value) => setSearchText(value)}
              placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
              value={searchText}
            />
          </div>
        </div>

        <div className={`${classes.w_full} ${classes.flex_align_center}`}>
          {/* 各個狀態的總覽 */}
          <div className={`${classes.mb_20} ${classes.flex_align_center} ${classes.fz_16} ${classes.mr_auto}`}>
            <h5
              className={`
              ${classes.fz_16}
              ${classes.mr_20}
            `}
            >{t('overview')}</h5>

            <span className={`${classes.d_block} ${false && classes.mr_20}`}>{`${t('waiting')}: ${get(overViewState, 'waiting', 0)}`}</span>

            {/* <span className={`${classes.d_block} ${classes.mr_20}`}>{`${t('fail')}: ${1}`}</span>

          <span className={`${classes.d_block}`}>{`${t('total2')}: ${3}`}</span> */}
          </div>

          {/* 提示文字 */}
          <Link
            className={`${classes.fz_14}`}
            onClick={() => { history.push('/job-detail')}}
          >
            { t('cantFindJobHint') }
          </Link>
        </div>

        {/* 表格 */}
        <div className={`${classes.wrapperPaper}`}>
          <BasePaper
            columns={[
              {
                id: 'order',
                key: 'order',
                label: t('order'),
                width: 90,
                onTableCellRender: item => {
                  return (
                    <BaseTextBadge
                      baseTextBadgeClass={`${classes.minW_init}`}
                      children={item.order}
                    />
                  );
                }
              },
              {
                id: 'state',
                key: 'state',
                label: t('status'),
                width: 120,
                onTableCellRender: item => {
                  const { bgColor, text, textClass } = getStateDetail(item.state);

                  return (
                    <BaseTextBadge
                      baseTextBadgeClass={`${classes.minW_init}`}
                      bgColor={bgColor}
                      children={text}
                      textClass={textClass}
                    />
                  );
                }
              },
              {
                id: 'name',
                key: 'name',
                label: `${t('name')}`,
                onTableCellRender: item => (
                  <div
                    className={`
                    ${classes.maxW_200px}
                    ${classes.overflowHidden}
                    ${classes.whiteSpaceNowrap}
                    ${classes.textOverflowEllipsis}
                  `}
                  >
                    {item.jobName}
                  </div>
                )
              },
              {
                id: 'user',
                key: 'user',
                label: `${t('user')}`,
                onTableCellRender: item => (
                  <div>
                    {item.user}
                  </div>
                )
              },
              {
                id: 'virtualGroup',
                key: 'virtualGroup',
                label: `${t('virtualCluster')}`,
                onTableCellRender: item => (
                  <div>
                    {item.virtualGroup}
                  </div>
                )
              },
              {
                id: 'CPU',
                key: 'CPU',
                label: `${t('CPU')}`,
                onTableCellRender: item => (<div>{item.totalCPU}</div>)
              },
              {
                id: 'GPU',
                key: 'GPU',
                label: `${t('GPU')}`,
                onTableCellRender: item => (<div>{item.totalGPU}</div>)
              },
              {
                id: 'GPU Percentage',
                key: 'GPU Percentage',
                label: `${t('GPU Percentage')}`,
                onTableCellRender: item => (<div>{item.totalGPUMemoryPercentage}</div>)
              },
              {
                id: 'Memory',
                key: 'Memory',
                label: `${t('Memory')}`,
                onTableCellRender: item => (<div>{formatBytes(item.totalMemoryMB * MB)}</div>)
              },
              {
                id: 'Message',
                key: 'Message',
                label: `${t('Message')}`,
                onTableCellRender: item => {
                  const { message: msg } = item;

                  return (
                    <div className={`${classes.text_center}`}>
                      <BaseTooltip
                        arrow
                        title={msg}
                      >
                        <BaseMuiIcon
                          children={'message'}
                          isIconButton
                        />
                      </BaseTooltip>
                    </div>
                  )
                }
              },
              {
                id: 'action',
                label: t('Operations'),
                onTableCellRender: item => {
                  // const options = [
                  //   {
                  //     id: 'setting',
                  //     label: `${t('UserConfig')}`,
                  //     handleItemclick: () => {
                  //       setOriginUserSettingGroupSelectedData(data)
                  //       setUserSettingVgCells({ vg: data.name, cells: data.cells })
                  //     },
                  //     icon: <BaseMuiIcon>app_registration</BaseMuiIcon>
                  //   },
                  //   {
                  //     id: 'delete',
                  //     label: t('delete'),
                  //     handleItemclick: () => {
                  //       setSelectedJobName(name);
                  //       setModalContent(`${t('warning')}:\n
                  //       1. ${t('vgDelWarning1')}\n
                  //       2. ${t('vgDelWarning2')}\n

                  //       ${t('sureDelete', { name: name })}`);
                  //       setShowDeleteModal(true);
                  //     },
                  //     icon: <BaseMuiIcon className={`${classes.mr_10}`}>delete</BaseMuiIcon>
                  //   }
                  // ]
                  return (
                    <>
                      {
                        isDeleting
                          ? <CircularProgress />
                          :
                          <div>
                            <SplitButton
                              onClick={() => handleDelete(item.jobName)}
                              options={[]}
                              startIcon={<BaseMuiIcon>delete_outline</BaseMuiIcon>}
                              text={t('delete')}
                            />
                          </div>
                      }
                    </>
                  )
                }
              }
            ]}
            dragObj={{
              isDraggable: isAdmin,
              dragActions: {
                onDragEnd: handleDragEnd
              }
            }}
            labelRowsPerPage={t('labelRowsPerPage')}
            page={page}
            rows={filter.apply(showData)}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
        {
          showDeleteModal &&
          <ConfirmModal
            confrimText={t('delete')}
            content={modalContent}
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={onDelete}
            title={`${t('delete')}${t('enSpace')}${t('job')}`}
          />
        }
      </div>
    </ManageReserveContext.Provider>
  );
};

export default ManageReserve;
