import {AppLocalStorage} from "../../../persistant/localstorage";
import {environment} from "../../../../environments/environment";
import {IUserInfo} from "../../../persistant/IUserInfo";
import {AppLocalStorageKey} from "../../../persistant/AppLocalStorageKey";
import { ENV_AVATAR_COUNT } from "apps/gambling/src/assets/constant/uVersionTable";
import cx from "../../utils/cx";

export const Avatar = (props: {
    onClickToPopupUserInfoStatusPopover?: () => void;
    big?: boolean;
    className?: string;
}) => {
    const userInfo: IUserInfo = JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}');

    const avatarCount: number | undefined = ENV_AVATAR_COUNT[`${environment.uVersion}`];
    const avatarPosition = Number(userInfo.avatar || 1) % avatarCount;
    const userAvatar: number = avatarPosition === 0 ? avatarCount : avatarPosition;

    return (
      <div
        className={"relative"}
        onClick={(e) => {
            // 避免冒泡事件觸發到其他 event
            e.stopPropagation();
            props.onClickToPopupUserInfoStatusPopover && props.onClickToPopupUserInfoStatusPopover()
        }}
      >
        <img
          className={cx("rounded-full",
            ["w-[52px] h-[52px] min-w-[52px] min-h-[52px]}", !props.big],
            ["w-[82px] h-[82px]", !!props.big],
            props.className
          )}
          alt="avatar"
          src={`assets/${environment.uVersion}/${environment.mVersion}/avatar_${userAvatar || 1}.png`}
        />
      </div>
    )
}
