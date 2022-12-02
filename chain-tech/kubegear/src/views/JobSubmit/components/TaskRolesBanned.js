import React, {
// useContext
} from 'react';

// ? context
// import Context from './context';

// ? Self-packed Components || Functions
import { JobSubmitForm } from './TaskRoles';
import { JobTaskRole } from '../models/job-task-role';
import { createUniqueName } from '../utils/utils';

// ^ Plugins
import { isNil } from 'lodash';
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

// 被禁止了！！！(多餘的一層)
export const TaskRoles = React.memo(({
  onChange,
  advanceFlag
}) => {

  // ? context
  // const {  } = useContext(Context);

  // - methods
  /**
   * @author odin
   * @param {array} items -- 更新前的 taskRolesItems(由 jobTaskRoles 處理後的資料格式)
   * @description 如果更新 function 不為空的話，就更新 jobTaskRoles
   * @return {number}
  */
  const updateItems = items => {
    if (isNil(onChange)) {
      return;
    }
    onChange(items.map(item => item.content));
  };

  /**
   * @author odin
   * @param {array} items -- 更新前的 taskRolesItems(由 jobTaskRoles 處理後的資料格式)
   * @description 更新且回傳最新 taskRole 的 index
   * @return {number}
  */
  const addItem = items => {
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
    updateItems(updatedItems);
    return updatedItems.length - 1;
  };

  /**
   * @author odin
   * @param {array} items -- 更新前的 taskRolesItems(由 jobTaskRoles 處理後的資料格式)
   * @param {number} itemIndex -- 要刪除的 item 的 index
   * @description 刪除特定的 items，回傳要 active 的 item 的 index
   * @return {number}
  */
  const deleteItem = (items, itemIndex) => {
    if (items.length === 1) {
      return 0;
    }
    const updatedItems = items.filter((_, index) => index !== itemIndex);
    updateItems(updatedItems);

    // TODO: use other policy to update index
    return 0;
  };

  return (
    <>
      <JobSubmitForm
        addItem={addItem}
        advanceFlag={advanceFlag}
        deleteItem={deleteItem}
        updateItems={updateItems}
      />
    </>
  );
});

TaskRoles.propTypes = {
  jobTaskRoles: PropTypes.arrayOf(PropTypes.instanceOf(JobTaskRole)).isRequired,
  onChange: PropTypes.func,
  advanceFlag: PropTypes.bool
};
