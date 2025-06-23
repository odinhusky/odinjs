import cx from '@libs/commonUtils/cx';
import { IPwa } from '..';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';
import Icon from '@components/Icon';

interface BeforeInstallPromptEvent extends Event {
  // 这里应该包含事件的具体属性和方法
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaButtons = ({
  tiem,
  timeDown,
  setTimeDown,
  success,
  deferredPromptRef,
  pwaInit,
}: IPwa) => {
  const showToast = useToastStore((state) => state.showToast);
  const isDisabled = timeDown;
  // 安装是否成功
  return (
    <div className="flex flex-col mt-[22px]">
      {success || pwaInit ? (
        <button
          className={cx(
            'flex flex-col items-center justify-center',
            'bgi-[#FF9B05] rounded-lg py-2 px-4',
            'shandow-[0px_4px_4px_0px_#0000001A]',
            'active:bgi-[#E08702]'
          )}
          onClick={() => {
            // TODO 开启
            showToast(
              'Please open it from the desktop or from the application menu.'
            );
          }}
        >
          Play
        </button>
      ) : (
        <button
          className={cx(
            'flex flex-col items-center justify-center',
            'bgi-[#FF9B05] rounded-lg py-2 px-4',
            'shandow-[0px_4px_4px_0px_#0000001A]',
            'active:bgi-[#E08702]',
            {
              'bgi-[#BFBFBF] pointer-events-none': isDisabled,
            }
          )}
          onClick={() => {
            // 安装
            if (!deferredPromptRef?.current) {
              return console.log('deferredPrompt is null');
            }
            (deferredPromptRef.current as BeforeInstallPromptEvent).prompt();
            (
              deferredPromptRef.current as BeforeInstallPromptEvent
            ).userChoice.then((choiceResult: { outcome: string }) => {
              if (choiceResult.outcome === 'accepted') {
                // 接受安装
                setTimeDown && setTimeDown(true);
              } else if (choiceResult.outcome === 'dismissed') {
                // 取消安装
              }
              deferredPromptRef.current = null;
            });
          }}
          disabled={isDisabled}
        >
          <div
            className={cx('flex text-[#FFE608] text-sm font-bold', {
              'text-[#8B8B8B]': isDisabled,
            })}
          >
            <Icon name="ic_rapid" color={isDisabled ? '#8B8B8B' : '#FFE608'} />
            Rapid Install
          </div>
          <div className="text-xs font-medium">{`Download within ${tiem}s`}</div>
        </button>
      )}
      <div className="flex gap-5 text-[13px] text-[#FF9B05] font-medium m-auto mt-[18px]">
        <button
          className="flex gap-1 items-center"
          onClick={() => {
            // TODO 分享
          }}
        >
          <Icon className="w-3 h-3" name="ic_share" />
          share
        </button>
        <button
          className="flex gap-1 items-center"
          onClick={() => {
            // TODO 收藏
          }}
        >
          <Icon className="w-3 h-3" name="ic_tag" />
          Add to wishlist
        </button>
      </div>
    </div>
  );
};
