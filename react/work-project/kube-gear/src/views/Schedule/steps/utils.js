import { get, map } from 'lodash';
import { getUserNfs } from 'utils/api';

export async function listUserNfsNames(user) {
  const userNfsInfo = await getUserNfs(user);
  return map(userNfsInfo, info => get(info, 'name'));
}

export function createUniqueName(usedNames, namePrefix, startindex, counter) {
  if (counter) {
    const findIndex = [...usedNames]
      .filter(item => item.includes('Task_role'))
      .sort()
      .reverse()
      .find(item => item.includes('Task_role'))
      .split('_')[2];
    const index = Number(findIndex);
    const namesArr = [];
    for (let i = 1; i <= counter; i++) {
      namesArr.push(`${namePrefix}_${index + i}`)
    }
    return namesArr;
  } else {
    let index = startindex;
    let name = `${namePrefix}_${index++}`;
    while (usedNames.find(usedName => usedName === name)) {
      name = `${namePrefix}_${index++}`;
    }
    return [name, index];
  }
}
