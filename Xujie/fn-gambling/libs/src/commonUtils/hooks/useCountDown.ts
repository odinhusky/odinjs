import { useOTPCountDownStore } from '@libs/mode2/zustand/components/OTPCountDownStore';

interface CountDownOptions {
  duration: number;
  key: string;
  onEnd?: VoidFunction;
}

class CountDownManager {
  private countDowns: Map<
    string,
    { intervalId: NodeJS.Timer | null; onEnd?: VoidFunction }
  > = new Map();

  // 訂閱
  public subscribe(options: CountDownOptions): void {
    const { key, duration = 60, onEnd } = options;

    if (this.countDowns.has(key)) {
      console.log(`[CountDownManager] subscribe key already exists: ${key}`);
      return;
    }

    this.countDowns.set(key, { intervalId: null, onEnd });

    this.loadSavedTime(key, duration);

    this.startCountDown(key);
  }

  // zustand
  private loadSavedTime(key: string, defaultDuration: number): void {
    const savedTime = useOTPCountDownStore.getState().countDowns[key];

    if (savedTime !== undefined && savedTime > 0) {
      useOTPCountDownStore.getState().setCountDownTime(key, savedTime);
    } else {
      useOTPCountDownStore.getState().setCountDownTime(key, defaultDuration);
    }
  }

  // 開啟定時器
  private startCountDown(key: string): void {
    const countDown = this.countDowns.get(key);
    if (!countDown) return;

    const updateTime = () => {
      const currentRemaining = useOTPCountDownStore.getState().countDowns[key];
      console.log('[CountDownManager] updateTime key', currentRemaining, key);
      if (currentRemaining <= 0) {
        clearInterval(countDown.intervalId!);
        countDown.onEnd?.();
        this.countDowns.delete(key);
        useOTPCountDownStore.getState().removeCountDownTime(key);
        return;
      }

      useOTPCountDownStore
        .getState()
        .setCountDownTime(key, currentRemaining - 1);
    };

    countDown.intervalId = setInterval(updateTime, 1000);
  }

  // // 獲取剩餘時間
  // public getRemainingTime(key: string): number | null {
  //   return useOTPCountDownStore.getState().countDowns[key] ?? null;
  // }
}

export const countDownManager = new CountDownManager();
