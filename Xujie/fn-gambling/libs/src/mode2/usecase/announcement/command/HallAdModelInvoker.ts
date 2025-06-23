import { IInvoker } from '@libs/design/commandPattern/IInvoker';
import { HallAdModelCommand } from '@mode2/usecase/announcement/command/HallAdModelCommand';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';

export class HallAdModelInvoker implements IInvoker<HallAdModelCommand> {
  private commandQueue: HallAdModelCommand[] = [];
  private fromSocketCommandQueue: HallAdModelCommand[] = [];

  constructor() {
    this.commandQueue = [];
    this.fromSocketCommandQueue = [];
  }

  /**
   * 若需要當前頁面立即 execute() 執行， immediately = true
   * immediately = false 則等待下一個觸發 execute()
   * @param command
   * @param immediately
   */
  addCommandFromSocket(
    command: HallAdModelCommand,
    immediately: boolean = false
  ): void {
    this.fromSocketCommandQueue.push(command);
    if (immediately) {
      useModalLayoutStore
        .getState()
        .verifyNextStep(`addCommandFromSocket{${command}}`);
    }
  }

  addCommand(command: HallAdModelCommand): void {
    this.commandQueue.push(command);
    useModalLayoutStore.getState().verifyNextStep(`addCommand${command}`);
  }

  addUnshiftCommandFromImmediate(
    command: HallAdModelCommand,
    immediately: boolean = false
  ): void {
    this.fromSocketCommandQueue.unshift(command);
    if (immediately) {
      useModalLayoutStore.getState().verifyNextStep(`addCommand${command}`);
    }
  }

  // addAll之前要sort orderId
  addAllCommand(commands: HallAdModelCommand[]): void {
    this.commandQueue = [];
    this.commandQueue.push(...commands);
  }

  executeNext(flag?: string): void {
    const socketCommand = this.fromSocketCommandQueue.shift();
    if (socketCommand) {
      socketCommand.execute();
      return;
    }
    const command = this.commandQueue.shift();
    if (command) {
      // this.cacheCommandQueue.add(command);
      command.execute();
    }
  }

  // 滾回剩餘沒顯示的
  remainingRollBack(): void {
    // this.commandQueue.push(...this.cacheCommandQueue);
    // this.cacheCommandQueue = new Set<HallAdModelCommand>();
  }

  // 刪除沒顯示的
  removeCache(uniqueId: string, andQueue: boolean = false): void {
    if (andQueue) {
      const cacheCommandQueue = this.commandQueue.filter(
        (item) => item.uniqueId != uniqueId
      );
      this.commandQueue = [];
      this.commandQueue.push(...cacheCommandQueue);

      const socketCacheCommandQueue = this.fromSocketCommandQueue.filter(
        (item) => item.uniqueId != uniqueId
      );
      this.fromSocketCommandQueue = [];
      this.fromSocketCommandQueue.push(...socketCacheCommandQueue);
    }
  }

  /**
   * 防呆，
   * 保留屬於 webSocket 來源，未消化的 commands
   * 並呼叫檢查是否要執行
   */
  clearAll(): void {
    // const webSocketCommands = this.commandQueue.filter(
    //   (item) => item.from === SourceFrom.WEB_SOCKET
    // );
    this.commandQueue = [];
    // this.cacheCommandQueue = new Set<HallAdModelCommand>();
    // this.commandQueue = [...webSocketCommands];
    // if (webSocketCommands) {
    //   useModalLayoutStore.getState().verifyNextStep(`clearAll`);
    // }
  }

  /**
   * websocket斷連後，清除來源屬於websocket的commands
   * 並呼叫檢查是否要執行
   */
  clearWebSocketCommands(): void {
    // this.fromSocketCommandQueue = this.fromSocketCommandQueue.filter(
    //   (item) => item.from !== SourceFrom.WEB_SOCKET
    // );
    // if (this.fromSocketCommandQueue.length > 0) {
    //   useModalLayoutStore.getState().verifyNextStep();
    // }
  }

  getAllCommands(): HallAdModelCommand[] {
    console.log(
      '[WebSocket Command Queue] getAllCommands',
      Array.from(this.commandQueue)
    );
    return Array.from(this.commandQueue);
  }
}

export default new HallAdModelInvoker();
