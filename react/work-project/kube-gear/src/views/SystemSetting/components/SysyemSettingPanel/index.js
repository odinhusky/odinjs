import React, {
  useState,
  useEffect,
  useContext
} from 'react'

// # API
import {
  getResource,
  setCustomizedSystemParam
} from 'utils/api';

// ? context
import SystemSettingContext from '../../SystemSettingContext';

// ^ Material-ui Components(Functions)
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { BaseRadio, BaseCheckbox } from 'components/BaseMuiInput';

// ? Self-packed Components || Functions
import BaseVerticalTabPanel from 'components/BaseVerticalTabAndPanel/BaseVerticalTabPanel';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton } from 'components/BaseButton';
import HourRadioGroup from '../HourRadioGroup'

import {
  arrToObj,
  objToArr,
  transferBoolean,
  filterObjPropertyByKey,
  hasOwn
} from 'common/commonMethods';

import rules from 'common/commonValidation'

// ^ plugins
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEmpty, isUndefined } from 'lodash';

/**
 * @author odin
 * @level views/SystemSetting/BaseVerticalTabPanelContainer/SysyemSettingPanel
 * @component SysyemSettingPanel
 * @description System Setting tab
*/
export default function SysyemSettingPanel({
  currentTabIndex,
  systemSetting,
  setSystemSetting,
  history
}) {

  // $ init data
  const { t } = useTranslation();

  // 要用到的預設值
  const emptySystemSetting = {
    helper: 'http://',  // 支援
    jobLifeHour: '-1', // 作業使用時長限制
    isJobNeedVerify: false, // 作業是否要審批 預設不用
    canMultipleLogin: true, // 是否可以重複登入 預設可以
    allowRegister: true, // 是否允許註冊 預設可以
    jumpServerHost: '', // 堡壘機的 proxy_host
    jumpServerPort: '', // 堡壘機的 port
    cpuIdleThreshold: '-1',
    cpuIdleWarnTime: '15',
    cpuIdleStopTime: '30',
    gpuIdleThreshold: '-1',
    gpuIdleWarnTime: '15',
    gpuIdleStopTime: '30'
    // limitResourceEnabled: false
    // limitResourceCpu: 16,
    // limitResourceMemory: 8092,
    // limitResourceStorage: 5
    // limitResourceGpu: {}
  }

  const systemSettingDefaultErrorMsg = {
    helper: ''  // 支援
    // jobLifeHour: '', // 作業使用時長限制 // ! 不需要檢查，DebounceRestrictNumInput 這個 component 會自動過濾數值輸入的內容，可以帶空值跟範圍內的數值
  }

  // 要從 後端資料 (systemSetting) 中過濾出來的 property
  // 檢查是否跟後端送來的資料有差異的keyName
  const keyNameArray = [
    'jobLifeHour',
    'helper',
    'isJobNeedVerify',
    'canMultipleLogin',
    'allowRegister',
    'jumpServerHost',
    'jumpServerPort',
    'cpuIdleThreshold',
    'cpuIdleWarnTime',
    'cpuIdleStopTime',
    'gpuIdleThreshold',
    'gpuIdleWarnTime',
    'gpuIdleStopTime'
  ]

  // <BaseRadio> 的個別設定
  const radiosList = [
    { id: 0, value: true, label: t('yes') },
    { id: 1, value: false, label: t('no') }
  ];

  // & handled data

  // 將傳過來得資料作轉換
  const defaultSystemSetting = arrToObj(systemSetting)

  // 試著取出從 API 來的資料進行判斷，沒有的話就預設為空物件
  const { userLimitResource } = defaultSystemSetting
  const resources =
    (!isUndefined(userLimitResource) && !isEmpty(userLimitResource))
      ? JSON.parse(userLimitResource)
      : {}

  // 過濾本頁用得到的key:value
  const filteredSystemSetting = filterObjPropertyByKey(defaultSystemSetting, keyNameArray)

  // 跟預設值做合併
  const concatSystemSetting = { ...emptySystemSetting, ...filteredSystemSetting }

  // # states
  const [systemSettingformData, setSystemSettingFormData] = useState(concatSystemSetting);
  const [systemSettingErrorMsg, setSystemSettingErrorMsg] = useState(systemSettingDefaultErrorMsg);
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);

  // 作業時長的物件
  const [jobLifeHourObj, setJobLifeHourObj] = useState({
    keyName: 'jobLifeHour',
    // 要顯示的副標題
    label: 'setJobTimeLimit',
    // 副標題的單位
    labelUnit: 'time',
    option: -1,
    // 初始值為 -9 作為判斷的依據
    value: -9,
    // 是否為jobLifeHour
    isjobTimeHour: true,
    // 內層 input 的 label 的 keyName
    inputLabel: 'hour'
  })

  // 從API拿到的資源分配資料表
  const [systemResource, setSystemResource] = useState({})

  // = style
  const { classes } = useContext(SystemSettingContext);

  // - methods

  /**
   * @author odin
   * @description 清除錯誤提示，有可能在後續會有動態的資源分佈欄位，需要做到錯誤提示，所以不是直接用 systemSettingDefaultErrorMsg 來清除錯誤
  */
  const clearErrorMsg = () => {
    const nowErrorMsg = { ...systemSettingErrorMsg }
    const nowErrorMsgArr = objToArr(nowErrorMsg)
    const newErrorMsgArr = nowErrorMsgArr.map((item) => ({
      key: item.key,
      value: ''
    }))
    const newErrorMsgObj = arrToObj(newErrorMsgArr)

    setSystemSettingErrorMsg(newErrorMsgObj)
  }


  /**
   * @author odin
   * @description 將作業時長的資料抽出來另外存取，並且處理為想要的格式
   * # option => radio 操作的行為的 value: 0 為自定義 | -1 為無限制
   * # value => 實際上要傳送給後端的值，有可能的範圍是 -1 ~ 無限制
  */
  const dealJobLifeHour = () => {
    // 取出傳來的 || 預設的 作業時長
    const { jobLifeHour } = systemSettingformData
    // radio 操作的行為的 value
    const option = +jobLifeHour !== -1 ? 0 : -1
    // 實際上要傳送給後端的值
    const value = option === -1 ? 0 : +jobLifeHour

    // 設定初始值
    setJobLifeHourObj((obj) => ({
      ...obj,
      option,
      value
    }))
  }

  /**
   * @author odin
   * @param {number} val -- 後端傳過來的數值
   * @description 透過後端傳過來的數值來決定前端的操作狀態 option 的值為何， 0或其他數值 為自定義 | -1 為無限制
   * @return {number} 0 || -1
  */
  const handleOption = (val) => {
    let option = null

    if(val === -1) {
      option = -1
    } else if(val >= 0) {
      option = 0
    } else {
      option = -1
    }

    return option
  }

  /**
   * @author odin
   * @param {number} val -- 後端傳過來的數值
   * @description 透過後端傳過來的數值來決定前端要顯示以及要傳給後端的值為何， 0或其他數值 為自定義 | -1 為無限制
   * @return {number} 0 || -1
  */
  const handleHourValue = (val) => {
    let value = null

    if(val === -1) {
      value = 0
    } else {
      value = val
    }

    return value
  }

  /**
   * @author odin
   * @param {number} option -- radio的行為值 0為自定義 | -1 為無限制
   * @param {number|string} value -- 自定義的值，有可能是空字串或是0~上限的數字
   * @description 透過後端傳過來的數值來決定前端要顯示以及要傳給後端的值為何， 0或其他數值 為自定義 | -1 為無限制
   * @return {number|string} '' 或是 0~上限值的數字
  */
  const handleOptionAndValueToAPIValue = (option, value) => {
    if(option === -1) {
      return -1
    } else if(option === 0) {
      return value
    }
  }

  /**
   * @author odin
   * @param {object} resourceObj -- {
   * -  [keyName]: {
   * -    inputLabel: "Upperlimit"
   * -    isjobTimeHour: false
   * -    keyName: "cpu.pinned.NODE-103-cpu"
   * -    number: 1
   * -    option: 0
   * -    value: ""
   * -  },
   * - ...
   * - }
   * @description 將各自的物件的 key 以及 value抽出來再轉成物件
   * @return {object} 
   * # {
   * #   [keyName]: 1
   * #   [keyName2]: 2
   * #   ...
   * # }
  */
  const handledUserLimitResource = (resourceObj) => {
    const result = {}

    Object.entries(resourceObj).forEach(([key, val]) => {
      result[key] = handleOptionAndValueToAPIValue(val.option, val.value)
    })

    return result
  }

  /**
   * @author odin
   * @description 取得系統配置的 cells 列表，來決定畫面上要有幾筆資源配置
  */
  const getSystemResource = async () => {
    try {
      const sysResReq = await getResource('system')

      if(!isEmpty(sysResReq)) {
        // 取得系統配置的 cells 列表
        const { cells } = sysResReq
        const handledFormCells = {}

        Object.entries(cells).map(([key, val]) => {

          // 判斷從 resources 中有沒有拿到對應的 key 的 value，有的話就針對該 value 做 option 以及 value 的處理
          const hasOwnOrNot = hasOwn(resources, key)
          const hourValue = hasOwnOrNot ? resources[key] : -1

          // 各自對這兩個值做處理
          const option = handleOption(hourValue)
          const value = handleHourValue(hourValue)

          // 設定 showData
          handledFormCells[key] = {
            // 如果沒有 label 的話，就是用 keyName X number 當成副標題
            keyName: key,
            option,
            value,
            // 是否為jobLifeHour
            isjobTimeHour: false,
            // 該資源的數量，同時也是上限值
            number: val.number,
            // 內層 input 的 label 的 keyName
            inputLabel: 'amount'
          }
        })

        // 設定處理完的資料
        setSystemResource(handledFormCells)
      }
    } catch (err) {
      const msg = err.data ? err?.data?.message : err.toString();
      toast.error(msg)
    }
  }

  /**
   * @author odin
   * @description 將資料格式作轉換，並且送給後端
  */
  const submitSystemSetting = () => {
    const userLimitResource = handledUserLimitResource(systemResource)

    const formDataObj = {
      ...systemSettingformData,
      userLimitResource: JSON.stringify(userLimitResource)
    }

    // 轉換為陣列形式，其中的 value 值要做 JSON.stringify 的處理
    const formData = objToArr(formDataObj);

    setCustomizedSystemParam(formData)
      .then((res) => {
        setSystemSetting(res)
        toast.success(t('success'), {
          onClose: () => {
            // re-render component
            history.go(0)
          }
        })
      })
      .catch(err => (toast.error(err.data ? err.data.message : err.message)))
  }

  // * hooks
  /**
   * @author odin
   * @type useEffect hook
   * @description 資料初始化
  */
  useEffect(() => {
    // 取得 系統的資源分配
    getSystemResource()

    // 針對作業時長限制的資料做初始化(如果有得到API傳來的時數就用該時數)
    dealJobLifeHour()
  }, [])

  /**
   * @author odin
   * @type useEffect hook
   * @description 切換頁籤的時候消除錯誤的提示
  */
  useEffect(() => {
    clearErrorMsg()
  }, [currentTabIndex])

  /**
   * @author odin
   * @type useEffect hook
   * @description 當 jobLifeHourObj 的 value 改變時，同步更新到 systemSettingformData 之中觸發樓下的 Effect 進行檢查
  */
  useEffect(() => {
    const { jobLifeHour } = systemSettingformData
    const { value, option } = jobLifeHourObj
    const apiValue = handleOptionAndValueToAPIValue(option, value)

    if(+jobLifeHour !== apiValue && value !== -9) {
      setSystemSettingFormData((obj) => ({
        ...obj,
        jobLifeHour: apiValue
      }))
    }
  }, [jobLifeHourObj])

  /**
   * @author odin
   * @type useEffect hook
   * @description 檢查 disable 的條件
   * -- 1. 檢查後端是否有傳來我們需要的資料(每一個)
   * -- 2. 檢查欄位有沒有變動，跟傳過來的資料做對比(每一個)
   * -- 3. 檢查是否有錯誤訊息
   * 如果有滿足其中一項，就 disabled 送出按鈕
  */
  useEffect(() => {
    // -- 1. 檢查我們要用到的keyName是否有傳來，如果沒有的話代表是初次使用這套系統，還是讓他可以送出

    const checkArr = keyNameArray.map(keyName => (hasOwn(systemSettingformData, keyName)))
    const isAllDataInDB = checkArr.indexOf(false) !== -1 ? false : true;
    if (isAllDataInDB === false) {
      setIsDisabledSubmit(false)
      return
    }

    // -- 2. 檢查欄位有沒有變動，跟傳過來的資料做對比(到這一步就確定一定要用到的keyName都有了)
    // 檢查其他欄位
    const isValueChangeArr = keyNameArray.map(keyName => {

      // 如果是 jobLifeHour 就先轉換成數字再進行比較
      if(['jobLifeHour', 'cpuIdleThreshold', 'cpuIdleWarnTime', 'cpuIdleStopTime', 'gpuIdleThreshold', 'gpuIdleWarnTime', 'gpuIdleStopTime'].includes(keyName)) {
        return (
          +systemSettingformData[keyName] === +concatSystemSetting[keyName]
        )
      } else {
        return (
          systemSettingformData[keyName] === concatSystemSetting[keyName]
        )
      }
    });

    const isSomeValueChange = isValueChangeArr.includes(false) ? true : false;

    // 檢查用戶設置配額的設定
    const isResourceSettingChangeArr = Object.entries(systemResource).map(([key, val]) =>{
      // API 傳來的 值
      const apiValue = resources[key] ? resources[key] : -9
      const resultValue = handleOptionAndValueToAPIValue(val.option, val.value)

      if(apiValue === -9) {
        // 初始沒有資料的狀態
        return true
      } else if(apiValue !== -9 && apiValue === resultValue) {
        // 有資料但是資料都沒變動
        return false
      } else if(apiValue !== -9 && apiValue !== resultValue) {
        // 有資料但是資料有變動
        return true
      }
    })
    const isResourceSettingChange = isResourceSettingChangeArr.includes(true) ? true : false

    // 都沒有變動就 disable 儲存按鈕
    if (isSomeValueChange === false && isResourceSettingChange === false) {
      setIsDisabledSubmit(true)
      return
    }

    // -- 3. 檢查欄位是否填寫正確數字

    const needCheckKeysArray = ['jobLifeHour', 'cpuIdleThreshold', 'cpuIdleWarnTime', 'cpuIdleStopTime', 'gpuIdleThreshold', 'gpuIdleWarnTime', 'gpuIdleStopTime']
    const needCheckFieldValueArray = Object.entries(systemSettingformData).filter(([key]) => needCheckKeysArray.includes(key)).map(([, value]) => (value))

    const checkHasNumber = (value) => ((value !== '') && Number.isInteger(+value))

    const isAllFieldHasNumberType = needCheckFieldValueArray.every(checkHasNumber)
    if (!isAllFieldHasNumberType) {
      setIsDisabledSubmit(true)
      return
    }

    // -- 4. 檢查是否有錯誤訊息
    const hasError = Object.values(systemSettingErrorMsg).some(v => v)
    setIsDisabledSubmit(hasError)


  }, [systemSettingformData, systemSettingErrorMsg, systemResource])

  return (
    <BaseVerticalTabPanel
      className={classes.tabPanelWidthLimit}
      index={0}
      value={currentTabIndex}
    >
      {/* Modify Form */}
      <div className={classes.modifyFormContainer}>

        {/* 支援 */}
        <div className={`${classes.modifyFormCtrl}`}>
          <MuiAutocomplete
            classes={{ root: `${classes.h_auto} ${classes.col_6} ${classes.muiAutocompleteCtrl}` }}
            onInputChange={(e, helper) => {
              // 更新 state
              setSystemSettingFormData(systemSettingformData => ({ ...systemSettingformData, helper }));

              // 檢查欄位並置放錯誤訊息
              const checkField = rules.required(helper, t);
              setSystemSettingErrorMsg(prev => ({ ...prev, helper: checkField }))
            }}
            placeholder={t('support')}
            required
            textFieldProps={{
              error: systemSettingErrorMsg.helper ? true : false,
              helperText: systemSettingErrorMsg.helper
              // className: `${classes.unlimitWidthInput}`
            }}
            value={systemSettingformData.helper}
          />
        </div>

        {/* 審核作業 */}
        <div className={`${classes.modifyFormCtrl} ${classes.mb_0}`}>
          <FormControl
            className={`${classes.rowRadioGroup}`}
            component="div"
          >
            <FormLabel
              className={`${classes.rowRadioGroupLabel} ${classes.mb_6}`}
              component="div"
            >
              {t('autoExecutionWithoutApproved')}
            </FormLabel>

            <RadioGroup
              aria-label="position"
              defaultValue="top"
              name="position"
              onChange={(e) => {
                const isJobNeedVerify = transferBoolean(e.target.value);
                // 更新 state
                setSystemSettingFormData(systemSettingformData => ({ ...systemSettingformData, isJobNeedVerify }));
              }}
              row
              value={systemSettingformData.isJobNeedVerify}
            >
              {
                radiosList.map(radio => (
                  <BaseRadio
                    key={radio.id}
                    label={radio.label}
                    radioProps={{
                      color: 'primary',
                      className: classes.radioRoot
                    }}
                    value={radio.value}
                  />
                ))
              }
            </RadioGroup>
          </FormControl>
        </div>

        <div className={classes.modifyFormCtrl}>
          <FormControl
            component="div"
          >
            {/* 重複登入 */}
            <BaseCheckbox
              checkboxProps={{
                color: 'primary',
                name: 'canMultipleLogin',
                className: classes.checkboxRoot,
                checked: systemSettingformData.canMultipleLogin,
                onChange: (e, v) => {
                  const value = transferBoolean(v);

                  setSystemSettingFormData(systemSettingformData => ({ ...systemSettingformData, 'canMultipleLogin': value }));
                }
              }}
              label={t('canMultipleLogin')}
            />

            {/* 開放註冊 */}
            <BaseCheckbox
              checkboxProps={{
                color: 'primary',
                name: 'allowRegister',
                className: classes.checkboxRoot,
                checked: systemSettingformData.allowRegister,
                onChange: (e, v) => {
                  const value = transferBoolean(v);

                  setSystemSettingFormData(systemSettingformData => ({ ...systemSettingformData, 'allowRegister': value }));
                }
              }}
              label={t('allowRegister')}
            />
          </FormControl>
        </div>

        {/* 設置作業使用時長限制 */}
        <HourRadioGroup
          setFunc={setJobLifeHourObj}
          showData={jobLifeHourObj}
        />

        {/* 設置用戶配額 */}
        {
          !isEmpty(systemResource) && (
            <div className={`${classes.resourceSettingContainer}`}>
              <div className={`${classes.settingTitle}`}>{t('settingUserConfig')}</div>

              <div className={`${classes.settingContent}`}>

                {
                  Object.entries(systemResource).map(([key, val]) => (
                    <HourRadioGroup
                      key={key}
                      setFunc={setSystemResource}
                      showData={val}
                    />
                  ))
                }

              </div>
            </div>
          )
        }

        {/* 閥值設定 */}
        <div className={`${classes.thresholdBox}`}>
          <div>{t('systemSettingThresholdTitle')}</div>
          <div className={`${classes.flex_align_center} ${classes.thresholdRow4}`}>
            <BaseTextField
              className={'item'}
              label={t('systemSettingThreshold', { name: 'CPU' })}
              onChange={(e) => {
                const cpuIdleThreshold = e.target.value;
                setSystemSettingFormData(prev => ({ ...prev, cpuIdleThreshold }))
              }}
              value={systemSettingformData.cpuIdleThreshold}
            />
            <BaseTextField
              className={'item'}
              label={t('systemSettingStopJobsNotify')}
              onChange={(e) => {
                const cpuIdleWarnTime = e.target.value;
                setSystemSettingFormData(prev => ({ ...prev, cpuIdleWarnTime }))
              }}
              value={systemSettingformData.cpuIdleWarnTime}
            />
            <BaseTextField
              className={'item'}
              label={t('systemSettingStopJobs')}
              onChange={(e) => {
                const cpuIdleStopTime = e.target.value;
                setSystemSettingFormData(prev => ({ ...prev, cpuIdleStopTime }))
              }}
              value={systemSettingformData.cpuIdleStopTime}
            />
          </div>
          <div className={`${classes.flex_align_center} ${classes.thresholdRow4}`}>
            <BaseTextField
              className={'item'}
              label={t('systemSettingThreshold', { name: 'GPU' })}
              onChange={(e) => {
                const gpuIdleThreshold = e.target.value;
                setSystemSettingFormData(prev => ({ ...prev, gpuIdleThreshold }))
              }}
              value={systemSettingformData.gpuIdleThreshold}
            />
            <BaseTextField
              className={'item'}
              label={t('systemSettingStopJobsNotify')}
              onChange={(e) => {
                const gpuIdleWarnTime = e.target.value;
                setSystemSettingFormData(prev => ({ ...prev, gpuIdleWarnTime }))
              }}
              value={systemSettingformData.gpuIdleWarnTime}
            />
            <BaseTextField
              className={'item'}
              label={t('systemSettingStopJobs')}
              onChange={(e) => {
                const gpuIdleStopTime = e.target.value;
                setSystemSettingFormData(prev => ({ ...prev, gpuIdleStopTime }))
              }}
              value={systemSettingformData.gpuIdleStopTime}
            />
          </div>
        </div>

        {/* 堡壘機 */}
        <div className={`${classes.resourceSettingContainer}`}>
          <div className={`${classes.settingTitle}`}>{t('jumpServer')}</div>

          <div className={`${classes.settingContent} ${classes.border_none} ${classes.p_0} ${classes.flex_align_center}`}>

            {/* 堡壘機 Host Name */}
            <div className={`${classes.modifyFormCtrl} ${classes.col_3} ${classes['largeAlpha:col_6']} ${classes.mr_20} ${classes.mb_0}`}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.w_full} ${classes.muiAutocompleteCtrl}` }}
                onInputChange={(e, jumpServerHost) => {
                  // 更新 state
                  setSystemSettingFormData(systemSettingformData => ({ ...systemSettingformData, jumpServerHost }))
                }}
                placeholder={t('jumpHostName')}
                textFieldProps={{
                  className: `${classes.unlimitWidthInput}`
                }}
                value={systemSettingformData.jumpServerHost}
              />
            </div>

            {/* 堡壘機 Port */}
            <div className={`${classes.modifyFormCtrl} ${classes.col_3} ${classes['largeAlpha:col_6']} ${classes.mb_0}`}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.w_full} ${classes.muiAutocompleteCtrl}` }}
                onInputChange={(e, jumpServerPort) => {
                  // 更新 state
                  setSystemSettingFormData(systemSettingformData => ({ ...systemSettingformData, jumpServerPort }))
                }}
                placeholder={t('jumpHostPort')}
                textFieldProps={{
                  className: `${classes.unlimitWidthInput}`
                }}
                value={systemSettingformData.jumpServerPort}
              />
            </div>

          </div>
        </div>

        {/* 提交按鈕 */}
        <PrimaryButton
          children={t('save')}
          disabled={isDisabledSubmit}
          onClick={submitSystemSetting}
        />
      </div>
    </BaseVerticalTabPanel>
  )
}

SysyemSettingPanel.propTypes = {
  currentTabIndex: PropTypes.number.isRequired,
  systemSetting: PropTypes.array.isRequired,
  setSystemSetting: PropTypes.func.isRequired,
  history: PropTypes.object
};