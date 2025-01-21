import {
  HandleMyPageClickProps,
  ActionClickPayloadMap,
} from '@mode2/action/myPageAction/useMyPageActions';

export interface IMyModifyModalProps {
  handleMyPageClick?: <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleMyPageClickProps<T>) => void;
  onClose?: () => void;
}
