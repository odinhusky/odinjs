import get from 'lodash/get';
import sortKeys from 'sort-keys';

type RemoveDuplicateOptions<T> = {
  /**
   * 資料陣列，待進行去重處理的資料。
   * 這裡的 T 表示資料的類型，可以是物件、數字、字串等基本型別。
   */
  data: T[];

  /**
   * 一組 key 欄位名稱，僅當資料是物件時使用。
   * 用來選擇哪些欄位作為比對依據，這些欄位的值會經過 JSON.stringify 進行比較。
   * 如果提供，將只比較這些欄位的值來決定是否有重複。
   * 範例：`['id', 'name']` 表示會根據 `id` 和 `name` 欄位的值進行去重。
   * 如果這個欄位不提供，則會根據全物件進行比對。
   */
  keyFields?: string[];

  /**
   * 自定義的 key 選擇器函式，用來從物件中選擇唯一的 key 進行去重。
   * 範例：`(item) => item.id + item.name` 這樣可以將 `id` 和 `name` 組合成一個唯一的 key 來進行比較。
   * 如果同時提供了 `keyFields` 和 `keySelector`，則 `keySelector` 會優先使用。
   */
  keySelector?: (item: T) => string;

  /**
   * 是否將整個物件進行比對來判定去重。
   * 如果設定為 `true`，將會對整個物件進行 JSON.stringify 比對。
   * 這個選項的優先度高於 `keyFields` 和 `keySelector`，如果設為 `true`，則會忽略其他選項。
   * 默認值為 `false`。
   */
  matchAll?: boolean;

  /**
   * 是否使用 Set 來優化效能，特別是當資料為原始類型（例如字串、數字）時。
   * 如果設為 `true`，會直接用 Set 處理去重，這對基本型別資料效能最佳。
   * 若資料為物件型別，這個選項會被忽略，依然會根據 `keyFields` 或 `keySelector` 進行比對。
   * 默認值為 `false`。
   */
  useSet?: boolean;
};

function isPrimitive(value: unknown): boolean {
  return (
    value === null || (typeof value !== 'object' && typeof value !== 'function')
  );
}

export function removeDuplicates<T>(options: RemoveDuplicateOptions<T>): T[] {
  const { data, keyFields, keySelector, matchAll, useSet } = options;

  // ✅ 如果明確表示資料是 primitive，直接用 Set 效能最佳
  if (useSet) {
    return Array.from(new Set(data));
  }

  const seen = new Set<string>();

  return data.filter((item) => {
    let key: string;

    if (isPrimitive(item)) {
      key = JSON.stringify(item); // 直接比對 primitive 類型的資料
    } else if (matchAll === true) {
      key = JSON.stringify(
        typeof item === 'object'
          ? sortKeys(item as object, { deep: true })
          : item
      ); // 預設情況下，深度比對整個物件
    } else if (typeof keySelector === 'function') {
      key = keySelector(item); // 使用自定義的 keySelector
    } else if (Array.isArray(keyFields) && keyFields.length > 0) {
      key = keyFields
        .map((path) => JSON.stringify(get(item, path))) // 使用 keyFields 進行比對
        .join('|');
    } else {
      key = JSON.stringify(
        typeof item === 'object'
          ? sortKeys(item as object, { deep: true })
          : item
      ); // 預設情況下，深度比對整個物件
    }

    if (seen.has(key)) {
      return false; // 如果已經遇過該 key，則過濾掉
    }
    seen.add(key);
    return true; // 否則將該項目添加到結果中
  });
}

export default removeDuplicates;
