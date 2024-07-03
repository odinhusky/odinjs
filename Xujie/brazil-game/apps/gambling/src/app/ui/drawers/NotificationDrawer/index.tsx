import React from 'react';
import {renderByUVersion} from "../../utils/renderByUVersion";

import {NotificationDrawer as CNotificationDrawer} from "./env/u1/NotificationDrawer";
import {NotificationDrawer as RNotificationDrawer} from "./env/u2/NotificationDrawer";
import {NotificationDrawer as PNotificationDrawer} from "./env/p1/NotificationDrawer";
import {default as U5NotificationDrawer} from "./env/u5";
import {default as U6NotificationDrawer} from "./env/u6";
import {default as U7NotificationDrawer} from "./env/u7";

export type INotificationDrawer = {
  closeDrawer: () => void;
};

export const NotificationDrawer = (props: INotificationDrawer) => {
  return (
    <>
      {renderByUVersion({
        "wild777bet": (
          <CNotificationDrawer closeDrawer={props.closeDrawer}/>
        ),
        "p1": (
          <PNotificationDrawer closeDrawer={props.closeDrawer}/>
        ),
        "u1": (
          <CNotificationDrawer closeDrawer={props.closeDrawer}/>
        ),
        "u2": (
          <RNotificationDrawer closeDrawer={props.closeDrawer}/>
        ),
        "u5": (
          <U5NotificationDrawer closeDrawer={props.closeDrawer}/>
        ),
        "u6": (
          <U6NotificationDrawer closeDrawer={props.closeDrawer}/>
        ),
        "u7": (
          <U7NotificationDrawer closeDrawer={props.closeDrawer}/>
        )
      }, (
        <CNotificationDrawer closeDrawer={props.closeDrawer}/>
      ))}
    </>
  )
};
