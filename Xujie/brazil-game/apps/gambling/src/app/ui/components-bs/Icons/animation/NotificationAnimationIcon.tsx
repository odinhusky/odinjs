import {environment} from "../../../../../environments/environment";
import { MsgCountBadge } from "../../../components/MessageCountBadge";
import React from "react";
import styled from "styled-components";
import cx from "classnames";

const Notification = styled.button`
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: 2px solid currentColor;
    border-radius: inherit;
    opacity: 0;
    transition: opacity .2s ease-in-out;
  }
`

export type INotificationAnimationIcon = {
  messageCount: number;
  className?: string;
  badgeBgColor?: string;
}
export const NotificationAnimationIcon = (props: INotificationAnimationIcon) => {
  return (
    <Notification>
      <img
        className={cx('hover:opacity-70', props.className)}
        alt={"notification"}
        src={`assets/${environment.uVersion}/${environment.mVersion}/icon_notification.png`}
      />
      {props.messageCount !== 0 && <MsgCountBadge bgColor={props.badgeBgColor}>{props.messageCount}</MsgCountBadge>}
    </Notification>
  )
}
