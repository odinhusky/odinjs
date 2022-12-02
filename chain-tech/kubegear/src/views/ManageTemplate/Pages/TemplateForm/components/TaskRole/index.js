import React, {
  useContext,
  useState,
  useEffect
} from 'react';

// ? context
import Context from '../../Context';

// ^ Material-ui Componets(Functions)
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

// ? Self-packed Components || Functions
import BasePanel from 'components/BasePanel';
import TooltipIcon from '../TooltipIcon';
import { createUniqueName } from '../../utils';
import { JobTaskRole } from '../../model/JobTaskRole';
import { TaskRoleSchema } from '../../model/JobTaskRoleSchema';
import { validate } from 'joi-browser';
import Content from './Content'

// ^ Plugin
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/TaskRole
 * @component TaskRole
 * @description TaskRole component
*/
const TaskRole = () => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    jobTaskRoles,
    setJobTaskRoles,
    classes
  } = useContext(Context);

  // # states
  const [selectedTab, setSelectedTab] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // - methods
  /**
   * @author odin
   * @param {string} currentTaskRoleName -- 目前在任務角色名稱中輸入的值
   * @description 檢查是否有重複，或是不符合規定
   * @return {string} Error Message
  */
  const dupNames = (currentTaskRoleName) => {
    if (!jobTaskRoles) return;
    if (Object.values(jobTaskRoles).map(item => item.name).filter((item, idx) => idx !== Number(selectedIdx))
      .includes(currentTaskRoleName)) return t('duplicateName')

    const TEXT_FILED_REGX = /^[a-zA-Z][a-zA-Z0-9]*$/;
    if (!TEXT_FILED_REGX.test(currentTaskRoleName)) return `${t('stringFormatIs')}${t('enSpace')}${t('taskRoleNameInvalid')}`;
    return ''
  }

  const handleAddItem = () => {
    let taskRoleName = generateUniqueTaskName(Object.keys(jobTaskRoles));

    while (Object.keys(jobTaskRoles).includes(taskRoleName)) {
      taskRoleName = generateUniqueTaskName(jobTaskRoles);
    }

    const newTaskRole = new JobTaskRole({ name: taskRoleName, commands: 'sleep infinity' })
    setJobTaskRoles(prev => ({ ...prev, [taskRoleName]: newTaskRole }))
    setSelectedTab(taskRoleName)
    setSelectedIdx(Object.keys(jobTaskRoles).length)
  }

  const handleRemoveTabItem = (e, name) => {
    e.stopPropagation();
    const removedItems = Object.entries(jobTaskRoles).reduce((acc, [taskRoleName, taskRole]) => {
      if (taskRoleName === name) return { ...acc }
      return {
        ...acc,
        [taskRoleName]: taskRole
      }
    }, {})

    setSelectedIdx(0)
    setSelectedTab(Object.keys(removedItems)[0])
    setJobTaskRoles(removedItems)
  }

  // * hooks
  useEffect(() => {
    if (
      !isEmpty(jobTaskRoles)
      && Object.keys(jobTaskRoles)[Number(selectedIdx)] !== selectedTab
    ) {
      setSelectedTab(Object.keys(jobTaskRoles)[Number(selectedIdx)])
    }
  }, [jobTaskRoles])

  const HEADER_PREFIX = 'taskrole';
  let taskRoleSeq = Object.keys(jobTaskRoles).length + 1;

  function generateUniqueTaskName(taskRoles) {
    const usedNames = taskRoles;
    const [newName, updateIndex] = createUniqueName(usedNames, HEADER_PREFIX, taskRoleSeq);
    taskRoleSeq = updateIndex;
    return newName;
  }

  return (
    <BasePanel
      className={`${classes.mt_20}`}
      title={
        <>
          <div className={`${classes.fz_18} ${classes.fw_bold}`}>{t('task')}{t('enSpace')}{t('setting')}</div>
          <TooltipIcon
            className={`${classes.ml_10}`}
            content={t('toolTipsTaskRole')}
          />
        </>
      }
    >
      <Toolbar
        className={classes.toolbar}
        disableGutters
      >
        <Tabs
          aria-label="tabs"
          indicatorColor="primary"
          scrollButtons="on"
          value={selectedIdx}
          variant="scrollable"
        >
          {
            Object.entries(jobTaskRoles).map(([taskRoleName, taskRole], idx) => {
              const { error: TaskRoleErr } = validate(taskRole, TaskRoleSchema);
              const hasError = TaskRoleErr;
              // console.log('taskRole', taskRole);
              // console.log('TaskRoleErr', TaskRoleErr);
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedTab(taskRoleName)
                    setSelectedIdx(idx)
                  }}
                  style={{ position: 'relative' }}
                >
                  <div className={`${classes.flex_align_center} ${classes.px_10}`}>
                    {
                      taskRoleName !== selectedTab && hasError &&
                      <IconButton
                        children={<Icon>info</Icon>}
                        style={{ position: 'absolute', top: 0, left: 7, fontSize: 10, color: 'red', marginBottom: 0 }}
                      />
                    }
                    <Tab
                      classes={{ wrapper: classes.iconLabelWrapper }}
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
                          <></>
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
              component="div"
              onClick={handleAddItem}
            />
          </div>
        </Tabs>
      </Toolbar>
      <Content
        dupNames={dupNames}
        selectedIdx={Number(selectedIdx)}
      />
    </BasePanel>
  );
};

export default TaskRole;