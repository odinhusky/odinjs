import React, {
  useState,
  useEffect,
  useContext } from 'react'

// # API
import { setCustomizedSystemParam } from 'utils/api';

// ? context
import SystemSettingContext from '../../SystemSettingContext';

// ^ Material-ui Componets(Functions)
import Typography from '@material-ui/core/Typography';

// ? Self-packed Components || Functions
import BaseVerticalTabPanel from 'components/BaseVerticalTabAndPanel/BaseVerticalTabPanel';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { PrimaryButton } from 'components/BaseButton';
import {
  arrToObj,
  objToArr,
  filterObjPropertyByKey,
  hasOwn
} from 'common/commonMethods';
import rules from 'common/commonValidation'
import path from 'assets/imagePath'

// ^ plugins
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/SystemSetting/BaseVerticalTabPanelContainer/DefaultImagePanel
 * @component DefaultImagePanel
 * @description System Setting tab
*/
export default function DefaultImagePanel({ currentTabIndex, systemSetting, setSystemSetting }) {

  // $ init data
  const { t } = useTranslation();

  // 要用到的預設值
  const emptyImageSetting = {
    caffeImage: path.caffe,
    kerasImage: path.keras,
    mxnetImage: path.mxnet,
    pytorchImage: path.pytorch,
    tensorflowImage: path.tensorflow,
    customDLImage: path.customDl,
    rapids: path.rapids,
    tensorrt: path.tensorrt,
    customMLImage: path.customMl
  }

  const systemImageDefaultErrorMsg = {
    caffeImage: '',
    kerasImage: '',
    mxnetImage: '',
    pytorchImage: '',
    tensorflowImage: '',
    rapids: '',
    tensorrt: ''
  }

  // 要從 後端資料(systemSetting) 中過濾出來的 property
  // 檢查是否跟後端送來的資料有差異的keyName
  const keyNameArray = [
    'caffeImage',
    'kerasImage',
    'mxnetImage',
    'pytorchImage',
    'tensorflowImage',
    'customDLImage',
    'rapids',
    'tensorrt',
    'customMLImage'
  ]

  // & handled data
  // 將傳過來得資料作轉換
  const defaultImageSetting = arrToObj(systemSetting)

  // 過濾本頁用得到的key:value
  const filteredImageSetting = filterObjPropertyByKey(defaultImageSetting, keyNameArray)

  // 跟預設值做合併
  const concatImageSetting = { ...emptyImageSetting, ...filteredImageSetting }

  // # states
  const [systemImageformData, setSystemImageFormData] = useState(concatImageSetting);
  const [systemImageErrorMsg, setSystemImageErrorMsg] = useState(systemImageDefaultErrorMsg)
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);

  // = style
  const { classes } = useContext(SystemSettingContext);

  // - methods
  const submitImageSetting = () => {
    const formData = objToArr(systemImageformData);

    setCustomizedSystemParam(formData)
      .then((res) => {
        setSystemSetting(res)
        toast.success(t('success'))
      })
      .catch(err => (toast.error(err.data ? err.data.message : err.message)))
  }

  // * hooks
  /**
   * @author odin
   * @type useEffect hook
   * @description 切換頁籤的時候消除錯誤的提示
  */
  useEffect(() => {
    setSystemImageErrorMsg(systemImageDefaultErrorMsg);
  }, [currentTabIndex])

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
    const checkArr = keyNameArray.map(keyName => (hasOwn(systemImageformData, keyName)))

    const isAllDataInDB = checkArr.indexOf(false) !== -1 ? false : true;

    if (isAllDataInDB === false) {
      setIsDisabledSubmit(false)
      return
    }

    // -- 2. 檢查欄位有沒有變動，跟傳過來的資料做對比(到這一步就確定一定要用到的keyName都有了)
    const isValueChangeArr = keyNameArray.map(keyName => (
      systemImageformData[keyName] === concatImageSetting[keyName]
    ));

    const isSomeValueChange = isValueChangeArr.indexOf(false) !== -1 ? true : false;

    if (isSomeValueChange === false) {
      setIsDisabledSubmit(true)
      return
    }

    // -- 3.檢查是否有錯誤訊息
    const hasError = Object.values(setSystemImageErrorMsg).some(v => v)

    setIsDisabledSubmit(hasError)

  }, [systemImageformData, setSystemImageErrorMsg])

  return (
    <BaseVerticalTabPanel
      className={classes.tabPanelWidthLimit}
      index={1}
      value={currentTabIndex}
    >
      <div className={`${classes.modifyFormContainer} ${classes.my_0}`}>

        {/* 深度學習 */}
        <div className={classes.imageContainer}>

          <div className={classes.imageTitle}>
            <Typography
              className={classes.imageTitleText}
              component="div"
              variant="h3"
            >
              {`${t('deep')}${t('enSpace')}${t('learning')}`}
            </Typography>
          </div>

          <div className={classes.imageContent}>

            {/* Caffe */}
            <div className={classes.modifyFormCtrl}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.col_6}` }}
                onInputChange={(e, caffeImage) => {
                  // 更新 state
                  setSystemImageFormData(systemImageformData => ({ ...systemImageformData, caffeImage }));

                  // 檢查欄位並置放錯誤訊息
                  const checkField = rules.required(caffeImage, t);
                  setSystemImageErrorMsg(prev => ({ ...prev, caffeImage: checkField }))
                }}
                placeholder="Caffe"
                required
                textFieldProps={{
                  error: systemImageErrorMsg.caffeImage ? true : false,
                  helperText: systemImageErrorMsg.caffeImage
                }}
                value={systemImageformData.caffeImage}
              />
            </div>

            {/* Keras */}
            <div className={classes.modifyFormCtrl}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.col_6}` }}
                onInputChange={(e, kerasImage) => {
                  // 更新 state
                  setSystemImageFormData(systemImageformData => ({ ...systemImageformData, kerasImage }));

                  // 檢查欄位並置放錯誤訊息
                  const checkField = rules.required(kerasImage, t);
                  setSystemImageErrorMsg(prev => ({ ...prev, kerasImage: checkField }))
                }}
                placeholder="Keras"
                required
                textFieldProps={{
                  error: systemImageErrorMsg.kerasImage ? true : false,
                  helperText: systemImageErrorMsg.kerasImage
                }}
                value={systemImageformData.kerasImage}
              />
            </div>

            {/* Mxnet */}
            <div className={classes.modifyFormCtrl}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.col_6}` }}
                onInputChange={(e, mxnetImage) => {
                  // 更新 state
                  setSystemImageFormData(systemImageformData => ({ ...systemImageformData, mxnetImage }));

                  // 檢查欄位並置放錯誤訊息
                  const checkField = rules.required(mxnetImage, t);
                  setSystemImageErrorMsg(prev => ({ ...prev, mxnetImage: checkField }))
                }}
                placeholder="Mxnet"
                required
                textFieldProps={{
                  error: systemImageErrorMsg.mxnetImage ? true : false,
                  helperText: systemImageErrorMsg.mxnetImage
                }}
                value={systemImageformData.mxnetImage}
              />
            </div>

            {/* Pytorch */}
            <div className={classes.modifyFormCtrl}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.col_6}` }}
                onInputChange={(e, pytorchImage) => {
                  // 更新 state
                  setSystemImageFormData(systemImageformData => ({ ...systemImageformData, pytorchImage }));

                  // 檢查欄位並置放錯誤訊息
                  const checkField = rules.required(pytorchImage, t);
                  setSystemImageErrorMsg(prev => ({ ...prev, pytorchImage: checkField }))
                }}
                placeholder="Pytorch"
                required
                textFieldProps={{
                  error: systemImageErrorMsg.pytorchImage ? true : false,
                  helperText: systemImageErrorMsg.pytorchImage
                }}
                value={systemImageformData.pytorchImage}
              />
            </div>

            {/* Tensorflow */}
            <div className={classes.modifyFormCtrl}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.col_6}` }}
                onInputChange={(e, tensorflowImage) => {
                  // 更新 state
                  setSystemImageFormData(systemImageformData => ({ ...systemImageformData, tensorflowImage }));

                  // 檢查欄位並置放錯誤訊息
                  const checkField = rules.required(tensorflowImage, t);
                  setSystemImageErrorMsg(prev => ({ ...prev, tensorflowImage: checkField }))
                }}
                placeholder="Tensorflow"
                required
                textFieldProps={{
                  error: systemImageErrorMsg.tensorflowImage ? true : false,
                  helperText: systemImageErrorMsg.tensorflowImage
                }}
                value={systemImageformData.tensorflowImage}
              />
            </div>

            {/* 自定義 */}
            <div className={classes.modifyFormCtrl}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.col_6}` }}
                onInputChange={(e, customDLImage) => {
                  // 更新 state
                  setSystemImageFormData(systemImageformData => ({ ...systemImageformData, customDLImage }));
                }}
                placeholder={t('Custom')}
                value={systemImageformData.customDLImage}
              />
            </div>
          </div>

        </div>

        {/* 機器學習 */}
        <div className={classes.imageContainer}>

          <div className={classes.imageTitle}>
            <Typography
              className={classes.imageTitleText}
              component="div"
              variant="h3"
            >
              {`${t('machine')}${t('enSpace')}${t('learning')}`}
            </Typography>
          </div>

          <div className={classes.imageContent}>
          
            {/* Rapids */}
            <div className={classes.modifyFormCtrl}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.col_6}` }}
                onInputChange={(e, rapids) => {
                  // 更新 state
                  setSystemImageFormData(systemImageformData => ({ ...systemImageformData, rapids }));

                  // 檢查欄位並置放錯誤訊息
                  const checkField = rules.required(rapids, t);
                  setSystemImageErrorMsg(prev => ({ ...prev, rapids: checkField }))
                }}
                placeholder="Rapids"
                required
                textFieldProps={{
                  error: systemImageErrorMsg.rapids ? true : false,
                  helperText: systemImageErrorMsg.rapids
                }}
                value={systemImageformData.rapids}
              />
            </div>

            {/* TensorRT */}
            <div className={classes.modifyFormCtrl}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.col_6}` }}
                onInputChange={(e, tensorrt) => {
                  // 更新 state
                  setSystemImageFormData(systemImageformData => ({ ...systemImageformData, tensorrt }));

                  // 檢查欄位並置放錯誤訊息
                  const checkField = rules.required(tensorrt, t);
                  setSystemImageErrorMsg(prev => ({ ...prev, tensorrt: checkField }))
                }}
                placeholder="TensorRT"
                required
                textFieldProps={{
                  error: systemImageErrorMsg.tensorrt ? true : false,
                  helperText: systemImageErrorMsg.tensorrt
                }}
                value={systemImageformData.tensorrt}
              />
            </div>

            {/* 自定義 */}
            <div className={`${classes.modifyFormCtrl} ${classes.mb_40}`}>
              <MuiAutocomplete
                classes={{ root: `${classes.h_auto} ${classes.col_6}` }}
                onInputChange={(e, customMLImage) => {
                  // 更新 state
                  setSystemImageFormData(systemImageformData => ({ ...systemImageformData, customMLImage }));
                }}
                placeholder={t('Custom')}
                value={systemImageformData.customMLImage}
              />
            </div>

            {/* 提交按鈕 */}
            <PrimaryButton
              children={t('save')}
              disabled={isDisabledSubmit}
              onClick={submitImageSetting}
            />
          </div>

        </div>

      </div>
    </BaseVerticalTabPanel>
  )
}

DefaultImagePanel.propTypes = {
  currentTabIndex: PropTypes.number.isRequired,
  systemSetting: PropTypes.array.isRequired,
  setSystemSetting: PropTypes.func.isRequired
};