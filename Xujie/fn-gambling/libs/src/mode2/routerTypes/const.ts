import { BasePagePathObj } from './types';

//路由白名單
export const ROUTE_WHITE_LIST = [
  BasePagePathObj.HallPage,
  BasePagePathObj.GamePage,
  BasePagePathObj.GameLobbyPage,
  BasePagePathObj.PolicyPage,
  BasePagePathObj.FeedBackPage,
  BasePagePathObj.MoreGamePage,
  BasePagePathObj.PopPage,
  BasePagePathObj.ActivityPage,
  BasePagePathObj.ActivityRulePage,
  BasePagePathObj.WalletPage,
];

// Skip Clear Request Init Client Parameter Whitelist
export const SKIP_CLEAR_CLIENT_PARAMETER_ROUTE_WHITE_LIST = [
  BasePagePathObj.GamePage,
  BasePagePathObj.GameLobbyPage,
];
