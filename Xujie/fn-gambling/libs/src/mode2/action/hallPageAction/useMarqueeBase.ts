import {
  BroadcastItemResult,
  BroadcastTypeResult,
} from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';

export const useMarqueeBase = () => {
  const { navToWalletPage, navToInvitePage, navToActivityPage } =
    useNavPageClick();
  const onHomeMarqueeAction = (item: BroadcastItemResult) => {
    switch (item.type) {
      case BroadcastTypeResult.WALLET:
        navToWalletPage();
        break;
      case BroadcastTypeResult.ACTIVITY:
        navToActivityPage();
        break;
      case BroadcastTypeResult.INVITE:
        navToInvitePage();
        break;
      case BroadcastTypeResult.UNKNOWN:
        break;
    }
  };

  return {
    onHomeMarqueeAction,
  };
};
