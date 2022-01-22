import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import styles from '../../index.module.scss';
import BasePanel from 'components/BasePanel';
import TooltipIcon from '../TooltipIcon';
// import { Pivot, PivotItem } from 'office-ui-fabric-react';
import Context from '../../Context';
import { createUniqueName } from '../../utils';
import { JobTaskRole } from '../../model/JobTaskRole';
import { TaskRoleSchema } from '../../model/JobTaskRoleSchema';
import { validate } from 'joi-browser';
import Content from './Content';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import { isEmpty } from 'lodash';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: theme.palette.background.paper
  },
  iconLabelWrapper: {
    flexDirection: 'row-reverse',
    textTransform: 'none'
  }
}));

const TaskRole = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { jobTaskRoles, setJobTaskRoles } = useContext(Context);
  const [selectedTab, setSelectedTab] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // console.log('jobTaskRoles', jobTaskRoles)

  const checkDupName = () => {
    if (!jobTaskRoles) return;
    if (Object.keys(jobTaskRoles).map(name => name).filter((item, idx) => idx !== Number(selectedIdx))
      .includes(selectedTab)) return t('duplicateName')

    const TEXT_FILED_REGX = /^[a-zA-Z][a-zA-Z0-9]*$/;
    if (!TEXT_FILED_REGX.test(selectedTab)) return `${t('stringFormatIs')}${t('enSpace')}${t('taskRoleNameInvalid')}`;
    return ''
  }

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

  return (
    <BasePanel
      style={{ marginTop: 20 }}
      title={
        <>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>{t('task')}{t('enSpace')}{t('setting')}</div>
          <TooltipIcon
            content={t('toolTipsTaskRole')}
            style={{ marginLeft: 10 }}
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
              const { error: TaskRoleErr } = validate(taskRole, TaskRoleSchema)
              const hasError = TaskRoleErr
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedTab(taskRoleName)
                    setSelectedIdx(idx)
                  }}
                  style={{ position: 'relative' }}
                >
                  <div style={{ padding: '0 10px', display: 'flex', alignItems: 'center' }}>
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
                            component="div"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveTabItem(e, taskRole.name)
                            }}
                            style={{ marginBottom: 0 }}
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              children={<Icon>add</Icon>}
              component="div"
              onClick={handleAddItem}
            />
          </div>
        </Tabs>
      </Toolbar>
      <Content
        checkDupName={checkDupName}
        selectedIdx={Number(selectedIdx)}
      />
    </BasePanel>
  );
};

export default TaskRole;