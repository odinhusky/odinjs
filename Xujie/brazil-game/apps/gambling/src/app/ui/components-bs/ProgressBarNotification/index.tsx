import React from "react";
import * as ReactDOM from "react-dom/client";
import { renderByUVersion } from "../../utils/renderByUVersion";
import { ProgressBarNotification as ProgressBarNotification } from "./env/default";
import { ProgressBarNotification as U6ProgressBarNotification } from "./env/u6/index";

export type TProps = {
  message?: string;
  onClose?: () => void;
  isOpen: boolean;
  duration?: number;
  isDesktop?: boolean;
  isSuccess?: boolean; //是否成功，默认为true(成功)
};

let container: HTMLElement | null =
  document.getElementById("BarNotifyContainer");
if (!container) {
  container = document.createElement("div");
  container.id = "BarNotifyContainer";
  document.body.appendChild(container);
}
let root = ReactDOM.createRoot(container);

const createNotification = (props: TProps) => {
  root.render(
    <React.StrictMode>
      {renderByUVersion(
        {
          u6: <U6ProgressBarNotification {...props} />,
        },
        <ProgressBarNotification {...props} />
      )}
    </React.StrictMode>
  );
};

export default createNotification;
