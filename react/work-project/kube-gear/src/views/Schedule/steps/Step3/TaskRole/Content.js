import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import ScheduleContext from '../../../ScheduleContext';

// ^ Material-ui Components(Functions)
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import DockerInfo from './DockerInfo';
import SelectResource from '../../../components/SelectResource'
import PortList from './PortList'
import AtLeastNum from './AtLeastNum'
import {
  FormTextField,
  CommandInput
} from '../Form';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, isNil } from 'lodash';

/**
 * @author odin
 * @level views/Schedule/CreateSchedule/Step3/TaskRole/Content
 * @component Content
 * @prop {number} dataId -- 要修改的 data ID
 * @prop {function} checkDupName -- 確認是否有重複的命名，來出現對應的錯誤提示字串
 * @prop {function} setJobTaskRoles -- 父層 CreateSchedule 定義的 setState 方法
 * @prop {object} selectedVgObj -- 最外層選擇的集群物件
 * @prop {array} resOptions -- 目前選擇資源可以選擇的資源選項
 * @prop {object} currentTaskRole -- 目前的 taskRole，由模板而來的資料
 * @prop {function} contentOnChange -- 變更目前這個 taskRole 的方法，不包含改變任務名稱
 * @prop {function} contentOnChange -- 變更目前這個 taskRole 的方法，可以一次修改多個 key: value
 * @prop {function} contentOnChange -- 變更目前這個 taskRole 名稱的方法
 * @prop {function} setErrorMessage -- 紀錄錯誤訊息的函式
 * @prop {object} selectedResourceObj -- 目前選中資源選項的物件
 * @prop {function} setSelectedResourcesObj -- 修改 目前選中資源選項的物件 Func.
 * @prop {number} selectedResourceNum -- 目前選擇的資源數量
 * @prop {function} setSelectedResourceNum -- 修改 目前選擇的資源數量 Func.
 * @prop {object} thisVgLimitedResourceObj -- 目前這個使用者被限制的資源數量列表
 * @description Step3 Component 中，每一個 TaskRole 的配置內容
*/
const Content = ({
  dataId,
  checkDupName,
  selectedVgObj,
  resOptions,
  currentTaskRole,
  contentOnChange,
  contentsOnChange,
  contentNameOnChange,
  setErrorMessage,
  thisVgLimitedResourceObj
}) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const PORT_LABEL_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  // # states
  const [resourceValue, setResourceValue] = useState({
    vg: null,
    skuType: null,
    sku: null,
    skuNum: 1
  });

  // = styles
  const { classes, spacingClass } = useContext(ScheduleContext);

  // * hooks
  /**
   * @author odin
   * @param {object} data -- 包含 vg, skuType, sku, skuNum 四個值
   * @description 設定目前這個 taskRole 應該要顯示得資源資料，並且送入 <SelectResource> 中
  */
  useEffect(() => {
    if(
      !isNil(currentTaskRole) &&
      !isNil(currentTaskRole.hivedScheduler.skuType)
    ) {

      const {
        vg,
        skuType,
        sku,
        skuNum
      } = currentTaskRole.hivedScheduler

      const value = {
        vg,
        skuType,
        sku,
        skuNum
      }

      setResourceValue(value)
    } else if(isNil(currentTaskRole.hivedScheduler.skuType)){
      // 如果是新增的一個 taskRole，就會是空的
      setResourceValue({
        vg: null,
        skuType: null,
        sku: null,
        skuNum: 1
      })
    }
  }, [currentTaskRole])


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
        <SelectResource
          activeStep={2}
          classNameObj={{
            container: `${classes.justify_start}`,
            resource: `${classes.flexFrontInput} ${classes.pr_10}`,
            number: `${classes.flexBackInput} ${classes.pl_10}`,
            remain: ` ${classes.flexEndSection} ${classes.pl_20} ${classes.d_none}`
          }}
          dataId={dataId}
          isShowRemain={false}
          onChange={(keyName, data) => {contentOnChange(keyName, data)}}
          onChangeMulti={contentsOnChange}
          resOptions={resOptions}
          resourceValue={resourceValue}
          selectedVgObj={selectedVgObj}
          thisVgLimitedResourceObj={thisVgLimitedResourceObj}
        />
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
  dataId: PropTypes.number,
  checkDupName: PropTypes.func,
  setJobTaskRoles: PropTypes.func,
  selectedVgObj: PropTypes.object,
  resOptions: PropTypes.array,
  currentTaskRole: PropTypes.object,
  contentOnChange: PropTypes.func,
  contentsOnChange: PropTypes.func,
  contentNameOnChange: PropTypes.func,
  setErrorMessage: PropTypes.func,
  thisVgLimitedResourceObj: PropTypes.object
}

export default Content;