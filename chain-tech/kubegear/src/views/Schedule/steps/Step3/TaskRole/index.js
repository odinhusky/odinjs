import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
// import GlobalContext from 'layouts/Main/GlobalContext';
import ScheduleContext from '../../../ScheduleContext';

// ^ Material-ui Components(Functions)
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

// ? Self-packed Components || Functions
import Content from './Content';
import { generateDefaultTaskName, generateTaskName } from 'common/commonMethods'
import { TaskRoleSchema } from '../../../model/JobTaskRoleSchema';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  isEmpty
  // isNil,
  // cloneDeep
} from 'lodash';
import { validate } from 'joi-browser';

/**
 * @author odin
 * @level views/Schedule/CreateSchedule/Step3/TaskRole
 * @component TaskRole
 * @prop {object} data -- 要修改的 data
 * @prop {number} dataId -- 要修改的 data ID
 * @prop {object} jobTaskRoles -- step2 選擇模板後的資料內容
 * @prop {function} setJobTaskRoles -- 父層 CreateSchedule 定義的 setState 方法
 * @prop {function} setErrorMessage -- 紀錄錯誤訊息的函式
 * @prop {object} defaultJobTaskRolesUnit -- 預設的 taskRoles 內容
 * @prop {object} thisVgLimitedResourceObj -- 目前這個使用者被限制的資源數量列表
 * @prop {boolean} isCustomize -- Step2 是否選擇自定義
 * @description Step3 Component 中的 TaskRole 內容配置
*/
const TaskRole = ({
  jobTaskRoles,
  setJobTaskRoles,
  setErrorMessage,
  defaultJobTaskRolesUnit
  // isCustomize
}) => {

  // $ init data
  const { t } = useTranslation();

  // # state
  const [selectedTabName, setSelectedTabName] = useState(Object.keys(jobTaskRoles)[0]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [orderIdArr, setOrderIdArr] = useState([]);
  const [tabsName, setTabsName] = useState([]);

  // const [resourceFirstResourceValue, setResourceFirstResourceValue] = useState({});

  // = styles
  const { classes } = useContext(ScheduleContext);

  // & handled data
  const currentTaskRoleName = !isEmpty(jobTaskRoles) ? Object.keys(jobTaskRoles)[selectedIdx] : '';

  // - methods
  /**
   * @author odin
   * @description 新增一個 TaskRole(新增預設名稱 | 選到新的 TaskRole 上 | 新增 orderIdArr)
  */
  const handleAddItem = () => {
    const newTaskName = generateTaskName(tabsName)
    const { id } = generateDefaultTaskName(orderIdArr)

    const newTaskRole = {
      ...defaultJobTaskRolesUnit,
      name: newTaskName
    }

    const newJobTaskRoles = { ...jobTaskRoles, [newTaskName]: newTaskRole }
    const newSelectedIdx = Object.keys(newJobTaskRoles).length - 1;

    // 設定內容
    setOrderIdArr(prev => [...prev, id])
    setSelectedTabName(newTaskName)
    setSelectedIdx(newSelectedIdx)
    setJobTaskRoles(newJobTaskRoles)
  }

  /**
   * @author odin
   * @param {object} e -- 該元素的 event 參數
   * @param {string} name -- 該 TaskRole 目前的名稱
   * @description 移除 taskRole 的標籤，並且 selected 的標籤改為刪除掉的標籤的右邊一個，如果沒有右邊的標籤就改為左邊的(跟 google 頁籤一樣的行為模式)
  */
  const handleRemoveTabItem = (e, name) => {
    e.stopPropagation();

    let oldSelectedIndex = 0

    const removedItems = Object.entries(jobTaskRoles).reduce((acc, [taskRoleName, taskRole], index) => {
      if (taskRoleName === name) {
        oldSelectedIndex = index
        return { ...acc }
      } else {
        return {
          ...acc,
          [taskRoleName]: taskRole
        }
      }
    }, {})

    const removedOrderArr = [...orderIdArr]
    removedOrderArr.splice(oldSelectedIndex, 1)

    const newSelectedIndex = removedOrderArr.length === oldSelectedIndex ? oldSelectedIndex - 1 : oldSelectedIndex

    setSelectedIdx(newSelectedIndex)
    setSelectedTabName(Object.keys(removedItems)[newSelectedIndex])
    setJobTaskRoles(removedItems)
    setOrderIdArr(removedOrderArr)
  }

  /**
   * @author odin
   * @description 確認是否有重複的命名，來出現對應的錯誤提示字串
   * @return {string}
  */
  const checkDupName = () => {
    if (!isEmpty(jobTaskRoles)) return;
    if (Object.keys(jobTaskRoles).map(name => name).filter((item, idx) => idx !== Number(selectedIdx))
      .includes(selectedTabName)) return t('duplicateName')

    const TEXT_FILED_REGX = /^[a-zA-Z][a-zA-Z0-9]*$/;
    if (!TEXT_FILED_REGX.test(selectedTabName)) return `${t('stringFormatIs')}${t('enSpace')}${t('taskRoleNameInvalid')}`;
    return ''
  }

  /**
   * @author odin
   * @param {string} field -- 單一個 taskrole 的 keyName
   * @param {any} value -- 該 keyName 的值
   * @description 內容改變的時候對應的資料結構內容也改變
  */
  const contentOnChange = (field, value) => {
    setJobTaskRoles(prev => {
      const res = { ...prev }
      // const currentTaskRoleName = Object.keys(res)[selectedIdx]
      res[currentTaskRoleName] = { ...res[currentTaskRoleName], [field]: value }

      return res
    });
  }

  /**
   * @author odin
   * @param {object} updateContents -- 要改變的 key/value
   * @description 內容改變的時候對應的資料結構內容也改變
  */
  // const contentsOnChange = (updateContents) => {
  //   setJobTaskRoles(prev => {
  //     const res = { ...prev }
  //     res[currentTaskRoleName] = { ...res[currentTaskRoleName], ...updateContents };

  //     return res
  //   })
  // }

  const contentNameOnChange = (name) => {
    setJobTaskRoles(prev => {
      const copy = Object.entries({ ...prev })
      const content = copy[selectedIdx][1]
      content.name = name

      return {
        ...copy.slice(0, selectedIdx).reduce((acc, [name, details]) => ({ ...acc, [name]: details }), {}),
        [name]: content,
        ...copy.slice(selectedIdx + 1).reduce((acc, [name, details]) => ({ ...acc, [name]: details }), {})
      }
    })
  }

  // * hooks
  useEffect(() => {
    const initOrderArr = Object.keys(jobTaskRoles).map((item, index) => index + 1)

    setOrderIdArr(initOrderArr)
  }, []);

  useEffect(() => {
    setTabsName(Object.keys(jobTaskRoles));
  }, [jobTaskRoles]);

  return (
    <div className={`${classes.taskRoleOutline}`}>
      <Tabs
        aria-label="tabs"
        indicatorColor="primary"
        scrollButtons="on"
        value={selectedIdx}
        variant="scrollable"
      >
        {
          Object.entries(jobTaskRoles).map(([taskRoleName, taskRole], idx) => {
            const { error: TaskRoleErr } = validate(taskRole, TaskRoleSchema)
            const hasError = TaskRoleErr
            return (
              <div
                className={`
                  ${classes.flex_center}
                  ${classes.pos_rel}
                  ${classes.bg_white}
                  ${classes.tabBorder}
                  ${classes.h_72px}
                `}
                key={idx}
                onClick={() => {
                  setSelectedTabName(taskRoleName)
                  setSelectedIdx(idx)
                }}
              >
                <div className={`${classes.flex_align_center} ${classes.px_10}`}>
                  {
                    taskRoleName !== selectedTabName && hasError &&
                      <IconButton
                        children={<Icon>info</Icon>}
                        className={`${classes.pos_abs} ${classes.infoIconPosition} ${classes.mb_0} ${classes.fz_12} ${classes.textRed}`}
                      />
                  }
                  <Tab
                    classes={{ wrapper: classes.iconLabelWrapper }}
                    className={`${selectedIdx === idx ? classes.activeTab : ''}`}
                    icon={
                      Object.entries(jobTaskRoles).length > 1
                        ?
                        <IconButton
                          children={<Icon>close</Icon>}
                          className={`${classes.mb_0}`}
                          component="div"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveTabItem(e, taskRole.name)
                          }}
                        />
                        :
                        null
                    }
                    label={taskRoleName}
                    value={idx}
                  />
                </div>
              </div>
            )
          })
        }
        <div className={`${classes.flex_align_center}`}>
          <IconButton
            children={<Icon>add</Icon>}
            className={`${classes.addTabIcon}`}
            component="div"
            onClick={handleAddItem}
          />
        </div>
      </Tabs>

      <Content
        checkDupName={checkDupName}
        contentNameOnChange={contentNameOnChange}
        contentOnChange={contentOnChange}
        currentTaskRole={jobTaskRoles[Object.keys(jobTaskRoles)[selectedIdx]]}
        jobTaskRoles={jobTaskRoles}
        selectedIdx={selectedIdx}
        selectedTabName={selectedTabName}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

TaskRole.propTypes = {
  jobTaskRoles: PropTypes.object,
  setJobTaskRoles: PropTypes.func,
  setErrorMessage: PropTypes.func,
  defaultJobTaskRolesUnit: PropTypes.object,
  isCustomize: PropTypes.bool
}

export default TaskRole;