import React, { useContext, useMemo } from 'react';

// ? context
import Context from './context';

// ? Self-packed Components || Functions
import { TabFormMui } from './tab-form';
import { JobTaskRole } from '../models/job-task-role';
import { createUniqueName } from '../utils/utils';

// ^ Plugins
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

// ? constant
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

export const TaskRoles = React.memo(({ taskRoles, onChange, advanceFlag }) => {

  // ? context
  const { setErrorMessage } = useContext(Context);

  // - methods
  const _onItemChange = items => {
    if (onChange === undefined) {
      return;
    }
    onChange(items.map(item => item.content));
  };

  const _onItemAdd = items => {
    const taskRoleName = generateUniqueTaskName(
      items.map(item => item.content),
      items.length,
    );
    const updatedItems = [
      ...items,
      {
        headerText: taskRoleName,
        content: new JobTaskRole({ name: taskRoleName, commands: 'sleep infinity' })
      }
    ];
    _onItemChange(updatedItems);
    return updatedItems.length - 1;
  };

  const _onItemDelete = (items, itemIndex) => {
    if (items.length === 1) {
      return 0;
    }
    const updatedItems = items.filter((_, index) => index !== itemIndex);
    _onItemChange(updatedItems);

    // TODO: use other policy to update index
    return 0;
  };

  const items = taskRoles.map((item) => {
    let taskRoleName;
    if (!isEmpty(item.name)) {
      taskRoleName = item.name;
    }
    return { headerText: taskRoleName, content: item };
  });

  const dupNames = useMemo(() => {
    const nameCount = items.reduce((res, item) => {
      if (res[item.headerText] === undefined) {
        res[item.headerText] = 0;
      }
      res[item.headerText] += 1;
      return res;
    }, {});
    const res = Object.keys(nameCount)
      .filter(key => nameCount[key] > 1);

    if (res.length > 0) {
      setErrorMessage('TaskRole', `task role name '${res.join(',')}' is duplicated`);
    } else {
      setErrorMessage('TaskRole', '');
    }

    return res
  }, [taskRoles]);

  return (
    <>
      <TabFormMui
        advanceFlag={advanceFlag}
        dupNames={dupNames}
        items={items}
        onItemAdd={_onItemAdd}
        onItemDelete={_onItemDelete}
        onItemsChange={_onItemChange}
      />
      {/* <TabForm
        advanceFlag={advanceFlag}
        dupNames={dupNames}
        items={items}
        onItemAdd={_onItemAdd}
        onItemDelete={_onItemDelete}
        onItemsChange={_onItemChange}
      /> */}
    </>
  );
});

TaskRoles.propTypes = {
  taskRoles: PropTypes.arrayOf(PropTypes.instanceOf(JobTaskRole)).isRequired,
  onChange: PropTypes.func,
  advanceFlag: PropTypes.bool
};
