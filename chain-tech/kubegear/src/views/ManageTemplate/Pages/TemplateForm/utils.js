export function createUniqueName(usedNames, namePrefix, startindex) {
  let index = startindex;
  let name = `${namePrefix}${index++}`;
  while (usedNames.find(usedName => usedName === name)) {
    name = `${namePrefix}${index++}`;
  }
  return [name, index];
}