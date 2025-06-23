import {
  ActionClickPayloadMap,
  HandleMoreGamePageClickProps,
} from '@mode2/action/moreGamesAction/useMoreGamePageActions';

export interface MoreGamePageVerticalTabProps {
  isShow?: boolean;
  handleMoreGamePageAction: <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleMoreGamePageClickProps<T>) => void;
}
