/**
 * 确保目标元素在容器的水平滚动范围内可见。
 * @param container - 包含目标元素的容器元素
 * @param target - 需要确保可见的目标元素
 */
export const handleScrollToElementLeft = (
  container: HTMLElement | null,
  target: HTMLElement | null
): void => {
  if (!container || !target) return;

  const containerLeft = container.scrollLeft;
  const containerRight = containerLeft + container.clientWidth;

  const targetLeft = target.offsetLeft;
  const targetRight = targetLeft + target.offsetWidth;

  // 检查目标是否完全可见
  if (targetLeft < containerLeft) {
    // 目标在左侧，滚动到目标的左边缘
    container.scrollLeft = targetLeft;
  } else if (targetRight > containerRight) {
    // 目标在右侧，滚动到目标的右边缘
    container.scrollLeft = targetRight - container.clientWidth;
  }
};

export default handleScrollToElementLeft;
