import React, {
  // useState,
  useEffect,
  useContext,
  memo
} from 'react';

// ? context
import Context from './context';

// ^ Material-ui Components(Functions)
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { Content } from './Content';
import { BaseTooltip } from 'components/BaseTooltip';

// ? Self-packed Components || Functions
// import { getFormClassNames, getTabFromStyle } from './form-style';
// import Card from 'components/Card';
// import { TooltipIcon } from './controls/tooltip-icon';
// import {PROTOCOL_TOOLTIPS} from '../utils/constants';
// import { taskRolesSchema, prerequisitesSchema } from '../models/protocol-schema';
// const TAB_ITEM_KEY_PREFIX = 'tabItem-';
// const tabFormStyle = getTabFromStyle();
import { JobTaskRole } from '../models/job-task-role';
import { createUniqueName } from '../utils/utils';

// ^ Plugins
import {
  isNil,
  isEqual
  // isArray
} from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import { validate } from 'joi-browser';

const HEADER_PREFIX = 'taskrole';
let taskRoleSeq = 1;

function generateUniqueTaskName(taskRoles, curIndex) {
  const usedNames = taskRoles
    .map(taskRole => taskRole.name)
    .filter((_, index) => index < curIndex);
  const [newName, updateIndex] = createUniqueName(usedNames, HEADER_PREFIX, taskRoleSeq);
  taskRoleSeq = updateIndex;
  return newName;
}

export const TaskRoles = memo(({
  advanceFlag,
  jobTaskRoles,
  setJobTaskRolesAfterCheck
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    classes,
    selectedIdx,
    setSelectedIdx
  } = useContext(Context);

  // # states

  // - methods
  /**
   * @author odin
   * @param {array} jobTaskRoles -- 更新前的 taskRolesItems(由 jobTaskRoles 處理後的資料格式)
   * @description 更新且回傳最新 taskRole 的 index
   * @return {number}
  */
  const addItem = jobTaskRoles => {
    const taskRoleName = generateUniqueTaskName(
      jobTaskRoles,
      jobTaskRoles.length,
    );
    const updatedJobTaskRoles = [
      ...jobTaskRoles,
      new JobTaskRole({ name: taskRoleName, commands: 'sleep infinity' })
    ];

    setJobTaskRolesAfterCheck(updatedJobTaskRoles);
    return updatedJobTaskRoles.length - 1;
  };

  /**
   * @author odin
   * @description 新增一個 jobTaskRole
  */
  const _onItemAdd = () => {
    const newSelectedIndex = addItem(jobTaskRoles);

    setSelectedIdx(newSelectedIndex);
  }

  /**
   * @author odin
   * @param {array} jobTaskRoles -- 更新前的 taskRolesItems(由 jobTaskRoles 處理後的資料格式)
   * @param {number} itemIndex -- 要刪除的 item 的 index
   * @description 刪除特定的 items，回傳要 active 的 item 的 index
   * @return {number}
  */
  const deleteItem = (jobTaskRoles, itemIndex) => {
    if (jobTaskRoles.length === 1) {
      return 0;
    }

    const updatedItems = jobTaskRoles.filter((_, index) => index !== itemIndex);
    setJobTaskRolesAfterCheck(updatedItems);

    // TODO: use other policy to update index
    return 0;
  };

  /**
   * @author odin
   * @param {object} event -- 原生點擊事件的物件
   * @param {number} itemIndex -- 要刪除的該 jobTaskRole index
   * @description 刪除特定的 jobTaskRole
  */
  const _onItemDelete = (event, itemIndex) => {
    event.stopPropagation();
    if(isNil(itemIndex) || isNil(deleteItem)) return;

    const newSelectedIndex = deleteItem(jobTaskRoles, itemIndex);

    setSelectedIdx(newSelectedIndex);
  };

  /**
   * @author odin
   * @param {object} jobTaskRole -- 單一個 jobTaskRole 物件
   * @param {number} index -- 該 jobTaskRole index
   * @description 更新 jobTaskRoles
  */
  const onContentChange = (jobTaskRole, index) => {
    const willUpdatedJobTaskRoles = [...jobTaskRoles];
    willUpdatedJobTaskRoles[index] = jobTaskRole;

    setJobTaskRolesAfterCheck(willUpdatedJobTaskRoles);
  };

  // * hooks
  useEffect(() => {
    if (!isNil(jobTaskRoles)) {
      setSelectedIdx(0);
    }
  }, []);

  return (
    <div className={`${classes.minH_0} ${classes.pt_20}`}>
      <div className={`${classes.flex_align_center} ${classes.tabFormContainer}`}>
        <div className={`${classes.fz_18} ${classes.pr_8}`}>
          {t('task')}{t('enSpace')}{t('setting')}
        </div>
        <BaseTooltip
          arrow
          onClick={() => {}}
          title={t('toolTipsTaskRole')}
        >
          <IconButton
            aria-label="info"
            children={<Icon className={`${classes.fz_18}`}>info_outlined</Icon>}
            className={classes.p_0}
          />
        </BaseTooltip>
      </div>
      <Toolbar
        className={classes.toolbar}
        disableGutters
      >
        <Tabs
          aria-label="tabs"
          indicatorColor="primary"
          onChange={(e, value) => {
            setSelectedIdx(value);
          }}
          scrollButtons="on"
          value={selectedIdx}
          variant="scrollable"
        >

          {
            jobTaskRoles.map((item, idx) => (
              <Tab
                classes={{
                  wrapper: classes.iconLabelWrapper
                }}
                icon={
                  <IconButton
                    children={<Icon>close</Icon>}
                    className={`${classes.mb_0}`}
                    component="div"
                    onClick={(event) => {
                      event.stopPropagation()
                      _onItemDelete(event, idx)
                    }}
                  />
                }
                key={`${item.name}${idx}`}
                label={item.name}
                value={idx}
              />
            ))}

          {/* 新增另一個任務設置的 ＋ 按鈕 */}
          <div className={`${classes.flex_align_center}`}>
            <IconButton
              children={<Icon>add</Icon>}
              component="div"
              onClick={_onItemAdd}
            />
          </div>

        </Tabs>
      </Toolbar>

      <div className={`${classes.tabFormContentContainer}`}>
        {!isNil(selectedIdx) && (
          <Content
            advanceFlag={advanceFlag}
            currentTaskRole={jobTaskRoles[selectedIdx]}
            onContentChange={(updateRole) => onContentChange(updateRole, selectedIdx)}
            selectedIdx={selectedIdx}
          />
        )}
      </div>

    </div>
  )
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});

TaskRoles.propTypes = {
  advanceFlag: PropTypes.bool,
  jobTaskRoles: PropTypes.array,
  setJobTaskRolesAfterCheck: PropTypes.func
}
