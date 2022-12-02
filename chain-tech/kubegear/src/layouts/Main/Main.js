import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

// ^ Redux
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';
import { getResourceUnit, selectResourceUnit } from 'layouts/Main/features/resourceunit/resourceunitSlice';
import { selectIsShowGuide, changeGuideShow } from 'layouts/Main/features/guide/guideSlice';

// # API
import {
  getCustomizedSystemParam,
  getUserNotices,
  getUserAllLimitedVgResource,
  getCanSplitGpu
} from 'utils/api';

// ? context
import GlobalContext from './GlobalContext';

// ? Self-packed Components || Functions
import { PageHeader, SideBar } from './components';
import { GuideFlow } from '../GuideFlow';

// ? Utils
import { formatBytes } from 'utils';
import { MB } from 'constant';

// ? style
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.scss';

// ^ plugins
import PropTypes from 'prop-types';
import { isEmpty, find, isNull, isUndefined } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'

/**
 * @author Ben
 * @level layouts/Main
 * @component Main
 * @description Main Component
*/
const Main = ({ children }) => {

  // $init data
  const defaultUser = cookies.get('user');
  const location = useLocation();
  const path = location.pathname;
  const guideObj = cookies.get('guideObj');
  const { t } = useTranslation();
  const needGuideList = ['/entry']

  // ^ Redux
  const dispatch = useDispatch();
  const { userInfo, locale, resourceUnit, isShowGuide } = useSelector(state => ({
    userInfo: selectUserInfo(state),
    locale: state.locale,
    resourceUnit: selectResourceUnit(state),
    isShowGuide: selectIsShowGuide(state)
  }));
  const { admin: isAdmin } = userInfo;

  // # states
  const [systemSetting, setSystemSetting] = useState([]);
  const [systemSettingUrl, setSystemSettingUrl] = useState('');

  // Notication
  const [noticeList, setNoticeList] = useState([]);
  const [socketClient, setSocketClient] = useState(null);

  // 資源對照表相關
  const [selfLimitResourceObj, setSelfLimitResourceObj] = useState({});

  // 是否可以切顯卡(gpu)
  const [canSplitGPU, setCanSplitGPU] = useState(false);

  // - methods
  /**
   * @author odin
   * @param {string} guideObj -- 從 cookie 拿回來的 引導物件
   * @param {path} string -- 目前的 url 路徑
   * @description 判斷該路徑有沒有需要引導，以及是否已經引導過，如果引導過就不再另外開啟引導
  */
  const initGuide = (guideObj, path) => {
    if(!isUndefined(path) && needGuideList.includes(path)) {
      if(!isUndefined(guideObj)) {
        const guideObjParsed = JSON.parse(guideObj)
        const hasGuided = guideObjParsed[path]

        if(!hasGuided) {
          dispatch(changeGuideShow(true))
          cookies.set('guideObj', JSON.stringify({
            ...guideObjParsed,
            [path]: true
          }))
        }
      } else {
        dispatch(changeGuideShow(true))
        cookies.set('guideObj', JSON.stringify({
          [path]: true
        }))
      }
    }
  }

  const getUserLimitedVgResource = async (user) => {
    try {
      const limitResources = await getUserAllLimitedVgResource(user)
      if (!isEmpty(limitResources)) {
        setSelfLimitResourceObj(limitResources)
      }
    } catch (err) {
      toast.error.apply()
    }
  }

  /**
   * @author odin
   * @description 取得使用者資料
  */
  const getSystemSetting = async () => {
    try {
      const systemSettingReq = await getCustomizedSystemParam()
      if(systemSettingReq && !isEmpty(systemSettingReq)){
        setSystemSetting(systemSettingReq);

        setSystemSettingUrl(!isEmpty(find(systemSettingReq, el => el.key === 'helper')) ? find(systemSettingReq, el => el.key === 'helper').value : 'https://hackmd.io/@KubeGear/BJn_Dncz9');
      }
    } catch (err) {
      const msg = err.data ? err.data.message : err.toString();
      toast.error(msg);
    }
  }

  /**
   * @author odin
   * @description 取得個人通知列表
  */
  const getNotices = async () => {
    const { username } = userInfo;

    try {
      const list = await getUserNotices(username)

      if(list && !isEmpty(list)){
        setNoticeList(list);
      }

    } catch (err) {
      const msg = err?.data ? err?.data?.message : err?.toString();
      toast.error(msg);
    }
  }

  /**
   * @author odin
   * @description 取得目前環境是否能夠切割顯卡(gpu)
  */
  const getCanSplitGpuFn = async () => {
    try {
      const result = await getCanSplitGpu()

      setCanSplitGPU(result.canSplitGpu);
    } catch (err) {
      const msg = err?.data ? err?.data?.message : err?.toString();
      toast.error(msg);
    }
  }

  /**
   * @author odin
   * @param {string} vgName -- 特定的集群名稱
   * @param {string} cellName -- 該集群內的 cell 名稱
   * @param {number} limitedNumber -- 非必填，從 API 拿來的限制數量
   * @param {array} canUseVgList -- 非必填，預設是登入者可以使用的 叢集列表，可以傳入不同人的 叢集列表
   * @description 取得該資源的詳細資訊
   * @returns {object}
  */
  const getResource = useCallback((
    vgName,
    cellName,
    limitedNumber = 0,
    canUseVgList
  ) => {
    if(!isEmpty(resourceUnit) && !isEmpty(canUseVgList)){

      let usedNumber = 0;
      const vgObj = canUseVgList.find(item => item.name === vgName)

      const { cells, usedCells } = vgObj
      const {
        number: totalNumber,
        resourceUnit: cellUnitType
      } = cells[cellName]

      const { cpu, gpu, memory } = resourceUnit[cellUnitType]

      if(!isNull(usedCells) && !isEmpty(usedCells)) {
        usedNumber = usedCells[vgName]
      }

      const remainNumber = totalNumber - usedNumber

      return {
        vgName,
        cellName,
        unit: { cpu, gpu, memory },
        unitStr: `${gpu} GPU, ${cpu} CPU, ${formatBytes(memory * MB)} ${t('Memory')}`,
        used: {
          cpu: cpu * usedNumber,
          gpu: gpu * usedNumber,
          memory: memory * usedNumber,
          number: usedNumber,
          str: `${gpu * usedNumber} GPU, ${cpu * usedNumber} CPU, ${formatBytes(memory * MB * usedNumber)} ${t('Memory')}`
        },
        remain: {
          cpu: cpu * remainNumber,
          gpu: gpu * remainNumber,
          memory: memory * remainNumber,
          number: remainNumber,
          str: `${gpu * remainNumber} GPU, ${cpu * remainNumber} CPU, ${formatBytes(memory * MB * remainNumber)} ${t('Memory')}`
        },
        total: {
          cpu: cpu * totalNumber,
          gpu: gpu * totalNumber,
          memory: memory * totalNumber,
          number: totalNumber,
          str: `${gpu * totalNumber} GPU, ${cpu * totalNumber} CPU, ${formatBytes(memory * MB * totalNumber)} ${t('Memory')}`

        },
        limit: {
          cpu: limitedNumber ? cpu * limitedNumber : 0,
          gpu: limitedNumber ? gpu * limitedNumber : 0,
          memory: limitedNumber ? memory * limitedNumber : 0,
          number: limitedNumber ? limitedNumber : 0,
          str: limitedNumber ? `${gpu * limitedNumber} GPU, ${cpu * limitedNumber}CPU, ${formatBytes(memory * MB * limitedNumber)} ${t('Memory')}` : `0 GPU, 0 CPU, 0 ${t('Memory')}`
        }
      }
    } else {
      return {
        vgName,
        cellName,
        unit: {},
        unitStr: '',
        used: {
          cpu: 0,
          gpu: 0,
          memory: 0,
          number: 0,
          str: `0 GPU, 0 CPU, 0 ${t('Memory')}`
        },
        remain: {
          cpu: 0,
          gpu: 0,
          memory: 0,
          number: 0,
          str: `0 GPU, 0 CPU, 0 ${t('Memory')}`
        },
        total: {
          cpu: 0,
          gpu: 0,
          memory: 0,
          number: 0,
          str: `0 GPU, 0 CPU, 0 ${t('Memory')}`
        },
        limited:{
          cpu: 0,
          gpu: 0,
          memory: 0,
          number: 0,
          str: `0 GPU, 0 CPU, 0 ${t('Memory')}`
        }
      }
    }

  }, [resourceUnit])

  const getUnitsByKeyAndResourceUnitObject = (key, unitsObj) => {
    if (isEmpty(unitsObj[key])) return { cpuUnit: 0, gpuUnit: 0, memoryUnit: 0 }
    const { cpu: cpuUnit, gpu: gpuUnit, memory: memoryUnit } = unitsObj[key];
    return {
      cpuUnit,
      gpuUnit: gpuUnit === null ? 0 : gpuUnit,
      memoryUnit
    }
  }

  /**
   * @author elvis
   * @param {object} jobConfig -- 特定的集群名稱
   * @param {object} vgInfos -- canUseVgList 原本拿到的陣列轉成物件
   * @description 取得該模板每個 taskRole 的單位數量
   * @returns {object}
  */
  const getResourceUnitCount = useCallback((jobConfig, vgInfos) => {
    const { defaults, extras, taskRoles } = jobConfig;
    const { virtualCluster } = defaults;
    const { virtualGroup, hivedScheduler } = extras;

    return Object.entries(taskRoles).reduce((acc, [taskRoleName, parameters]) => {

      const { resourcePerInstance } = parameters;
      const { cpu, gpu, memoryMB } = resourcePerInstance;
      if (!hivedScheduler || !vgInfos[virtualGroup]) {
        return { ...acc }
      }
      const vgObj = vgInfos[virtualGroup];
      const { cells: vgTotleCells } = vgObj;
      const pinnedOrVirtual = hivedScheduler.taskRoles[taskRoleName].skuType
        ? 'virtual'
        : 'pinned'

      const skuType = hivedScheduler.taskRoles[taskRoleName].skuType || hivedScheduler.taskRoles[taskRoleName].pinnedCellId;
      const selectedCellKey = `${virtualCluster}.${pinnedOrVirtual}.${skuType}`;
      const { resourceUnit: unitName } = vgTotleCells[selectedCellKey];
      const { cpuUnit, gpuUnit, memoryUnit } = getUnitsByKeyAndResourceUnitObject(unitName, resourceUnit);

      const count = Math.max(
        cpuUnit === 0 ? 0 : cpu / cpuUnit,
        gpuUnit === 0 ? 0 : gpu / gpuUnit,
        memoryUnit === 0 ? 0 : memoryMB / memoryUnit
      )
      const sku = pinnedOrVirtual === 'pinned' ? 'pinnedCellId' : 'skuType'
      const resourceName = `${virtualCluster}.${pinnedOrVirtual}.${skuType}`

      return {
        ...acc,
        [taskRoleName]: {
          vc: virtualCluster,
          sku,
          skuType,
          count,
          unitName,
          cpuUnit,
          gpuUnit,
          memoryUnit,
          resourceName
        }
      }
    }, {})
  }, [resourceUnit])

  function doesImageFileExist(urlToFile) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', urlToFile, false);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(!xhr.getResponseHeader('Content-Type').startsWith('text/html'));
        } else {
          reject(false);
        }
      }
      xhr.onerror = function () {
        reject(false);
      };
      xhr.send();
    })
  }

  const asyncIsFileExist = async (urlToFile) => {
    try {
      return await doesImageFileExist(urlToFile)
    } catch (err) {
      return false
    }
  }

  /**
   * @author odin
   * @description Component data initialization
  */
  const initData = () => {
    dispatch(getUserInfo(defaultUser));
    dispatch(getResourceUnit());

    getUserLimitedVgResource(defaultUser);
    getSystemSetting();
    getCanSplitGpuFn();
  }

  // & handled data
  const contextValue = {
    userInfo,
    isAdmin,
    noticeList,
    setNoticeList,
    getUserInfo,
    locale,
    systemSettingUrl,
    systemSetting,
    setSystemSetting,
    socketClient,
    setSocketClient,
    // - 是否能夠設定 gpu 使用百分比
    canSplitGPU,
    // - 資源轉換有關
    resourceUnit,
    getResource,
    getResourceUnitCount,
    asyncIsFileExist,
    selfLimitResourceObj,
    // - redux 相關
    dispatch,
    useSelector
  }

  // * hooks
  /**
   * @author odin
   * @description componentDidMount
  */
  useEffect(() => {
    initData();
    initGuide();
  }, [])

  /**
   * @author odin
   * @description componentDidMount
  */
  useEffect(() => {
    initGuide(guideObj, path);
  }, [guideObj, path])

  /**
   * @author odin
   * @description socketClient 以及 locale 變動且不為 null 時，重新取得 Notice 列表的資料並且更新
  */
  useEffect(() => {
    if ((!isNull(socketClient) && locale)) {
      getNotices()
    }
  }, [socketClient, locale])

  return (
    <GlobalContext.Provider value={contextValue}>
      <PageHeader />
      <SideBar userInfo={userInfo} />
      <ToastContainer
        containerId="mainToast"
        position="top-center"
        style={{
          zIndex: 10000000 // bigger than modal
        }}
      />
      <div className="content-wrapper">
        {children}
      </div>

      {
        // 引導頁
        isShowGuide &&
          <GuideFlow
            isAdmin={isAdmin}
            isShow={isShowGuide}
            locale={locale}
          />
      }
    </GlobalContext.Provider>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
