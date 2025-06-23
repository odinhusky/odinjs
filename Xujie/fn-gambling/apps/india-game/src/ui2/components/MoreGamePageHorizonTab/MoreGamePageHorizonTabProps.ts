import { MoreGamePageTabType } from '@libs/mode2/@types/moreGamePageTabType';
import {
  ActionClickPayloadMap,
  HandleMoreGamePageClickProps,
} from '@mode2/action/moreGamesAction/useMoreGamePageActions';

export const horizonTabs = [
  MoreGamePageTabType.ALL,
  MoreGamePageTabType.HOT,
  MoreGamePageTabType.RECENT,
];

export interface MoreGamePageHorizonTabProps {
  handleMoreGamePageAction: <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleMoreGamePageClickProps<T>) => void;
}
