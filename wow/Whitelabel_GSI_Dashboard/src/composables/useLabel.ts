export function useLabel() {
  /**
   * 根據 value 從 options 陣列中找到對應的 label
   * @param value 欲查找的值
   * @param options 包含 label/value 的選項陣列
   * @returns label 或原始 value
   */
  const getLabel = (
    value: string,
    options: { label: string; value: string }[],
  ): string => {
    if (!options) return value;
    const found = options?.find((opt) => opt.value === value);
    return found ? found.label : value;
  };

  return { getLabel };
}
