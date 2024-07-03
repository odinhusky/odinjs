// 將陣列中重複的資料移除，包含物件，不限層數
export const removeDuplicates = <T>(arr: T[]): T[] => {
  const seen = new Set();
  return arr.filter(item => {
    const serializedItem = JSON.stringify(item);
    return seen.has(serializedItem) ? false : seen.add(serializedItem);
  });
};

export default removeDuplicates;