export function createUniqueName(usedNames, namePrefix, startindex) {
  let index = startindex;
  let name = `${namePrefix}_${index++}`;
  while (usedNames.find(usedName => usedName === name)) {
    name = `${namePrefix}_${index++}`;
  }
  return [name, index];
}