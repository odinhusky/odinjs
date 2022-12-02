import React, {
  // useState,
  // useEffect,
  useContext
  // useCallback
} from 'react';
// % context
import ScheduleContext from '../../../ScheduleContext';
// ^ Material-ui Components(Functions)
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import DockerInfo from './DockerInfo';
import PortList from './PortList'
import AtLeastNum from './AtLeastNum'
import {
  FormTextField,
  CommandInput
} from '../Form';
import SelectResource from './SelectResource'

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  isEmpty
  // isNil
} from 'lodash';

/**
 * @author odin
 * @level views/Schedule/CreateSchedule/Step3/TaskRole/Content
 * @component Content
 * @prop {number} dataId -- 要修改的 data ID
 * @prop {function} checkDupName -- 確認是否有重複的命名，來出現對應的錯誤提示字串
 * @prop {object} currentTaskRole -- 目前的 taskRole，由模板而來的資料
 * @prop {function} contentOnChange -- 變更目前這個 taskRole 的方法，不包含改變任務名稱
 * @prop {function} setErrorMessage -- 紀錄錯誤訊息的函式
 * @prop {number} selectedResourceNum -- 目前選擇的資源數量
 * @prop {function} setSelectedResourceNum -- 修改 目前選擇的資源數量 Func.
 * @prop {number} selectedIdx -- 目前選擇的 tab 的 index 數
 * @description Step3 Component 中，每一個 TaskRole 的配置內容
*/
const Content = ({
  checkDupName,
  currentTaskRole,
  contentOnChange,
  contentNameOnChange,
  setErrorMessage,
  selectedIdx
}) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const PORT_LABEL_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  // # states

  // ? context
  const { classes, spacingClass } = useContext(ScheduleContext);

  // - methods
  /**
   * @author odin
   * @param {object} k8sResource -- 包含當前的cpu gpu memoryMB 的三個屬性
   * @description 修改 jobTaskRole 中當前的 k8sResource 屬性的方法
  */
  const handleResourceUpdate = (k8sResource) => {
    contentOnChange('k8sResource', k8sResource);
  };

  // * hooks
  /**
   * @author odin
   * @param {object} data -- 包含 vg, skuType, sku, skuNum 四個值
   * @description 設定目前這個 taskRole 應該要顯示得資源資料，並且送入 <SelectResource> 中
  */
  // useEffect(() => {

  //   if(
  //     !isNil(currentTaskRole) &&
  //     !isNil(currentTaskRole.hivedScheduler.skuType)
  //   ) {
  //     // 選了模板自動填入模板預設的值

  //     const {
  //       vg,
  //       skuType,
  //       sku,
  //       skuNum
  //     } = currentTaskRole.hivedScheduler

  //     const value = {
  //       vg,
  //       skuType,
  //       sku,
  //       skuNum
  //     }

  //     setResourceValue(value)
  //   } else if(isNil(currentTaskRole.hivedScheduler.skuType)){
  //     // 如果是新增的一個 taskRole，就會是空的
  //     setResourceValue({
  //       vg: null,
  //       skuType: null,
  //       sku: null,
  //       skuNum: 1
  //     })
  //   }
  // }, [currentTaskRole])


  return (
    <div className={`${classes.contentContainer}`}>
      <div className={`${spacingClass} ${classes.flexInputTotal}`}>
        <FormTextField
          className={`${classes['width_6/7']}`}
          error={checkDupName()}
          helperText={checkDupName()}
          label={t('taskRoleName')}
          onChange={(name) => {
            contentNameOnChange(name)
          }}
          value={currentTaskRole?.name}
        />
      </div>

      <div className={`${spacingClass} ${classes.flexInputTotal}`}>
        <div className={`${classes['width_6/7']}`}>
          <CommandInput
            onChange={t => {
              contentOnChange('commands', t)
            }}
            title={t('command')}
            value={currentTaskRole?.commands}
          />
        </div>
      </div>

      <div className={`${spacingClass} ${classes.flexInputTotal}`}>
        <div className={`${classes['width_6/7']}`}>
          <SelectResource
            currentTaskRole={currentTaskRole}
            handleResourceUpdate={handleResourceUpdate}
            selectedIdx={selectedIdx}
          />
        </div>
      </div>

      <div className={`${spacingClass} ${classes.flexInputTotal}`}>
        <DockerInfo
          data={currentTaskRole?.dockerInfo}
          isTablet={isTablet}
          onChange={contentOnChange}
        />
      </div>

      {/* 端口列表 */}
      <div className={`${spacingClass} ${classes.flexInputTotal}`}>
        <PortList
          keyField="key"
          keyName={t('portName')}
          name="Port List"
          onChange={v => contentOnChange('ports', v)}
          onValidateKey={val => {
            if (!PORT_LABEL_REGEX.test(val)) {
              return `${t('stringFormatIs')} ^[a-zA-Z_][a-zA-Z0-9_]*$`;
            }
          }}
          onValidateValue={val => {
            let int = val;
            if (typeof val === 'string') {
              int = parseInt(val, 10);
            }
            if (int < 0 || isNaN(int)) {
              return `${t('fillInAnInteger')}`;
            }
          }}
          setErrorMessage={setErrorMessage}
          value={currentTaskRole.ports}
          valueField="value"
          valueName={t('portNumber')}
        />
      </div>

      {/* 至少容許失敗 | 至少要求成功區塊 */}
      {
        !isEmpty(currentTaskRole?.completion) &&
            <div className={`${spacingClass} ${classes.flexInputTotal}`}>
              <AtLeastNum
                completionObj={currentTaskRole?.completion}
                onChange={contentOnChange}
              />
            </div>
      }
    </div>
  );
};

Content.propTypes = {
  checkDupName: PropTypes.func,
  currentTaskRole: PropTypes.object,
  contentOnChange: PropTypes.func,
  contentNameOnChange: PropTypes.func,
  setErrorMessage: PropTypes.func,
  thisVgLimitedResourceObj: PropTypes.object,
  selectedIdx: PropTypes.number
}

export default Content;