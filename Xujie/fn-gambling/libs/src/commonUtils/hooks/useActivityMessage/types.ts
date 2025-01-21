export enum EMessageType {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  CLOSE = 'CLOSE',
}
export type IActivityMessage =
  | ITestMessage
  | ISuccessMessage
  | IFailMessage
  | ICloseMessage;

export interface ITestMessage {
  type: 'test';
  data: {
    message: string;
  };
}

export interface ISuccessMessage {
  type: EMessageType.SUCCESS;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface IFailMessage {
  type: EMessageType.FAIL;
  data: {
    message: string;
  };
}

export interface ICloseMessage {
  type: EMessageType.CLOSE;
}
