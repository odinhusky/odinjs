export interface HandleGlobalScrollParams {
  target?: string; // 標示是從哪裡調用的 可以給 IndexClick, EventClick....
  callback: <T>(arg?: T) => void; // 要執行的 callback
}

/**
 * @author odin
 * @description 為了埋點或統一管理做的 scroll function
 */
export const handleGlobalScroll = ({
  target,
  callback,
}: HandleGlobalScrollParams) => {
  if (target) console.log('@@ Mode2 handleGlobalScroll target=>', target);

  if (callback instanceof Function) callback();
};

export default handleGlobalScroll;
