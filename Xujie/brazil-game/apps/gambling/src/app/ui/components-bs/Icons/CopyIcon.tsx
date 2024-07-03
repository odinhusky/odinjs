
import { notification } from "antd";
import { environment } from "../../../../environments/environment";
import cx from "classnames";
import { ReactElement } from "react";
import { CopyOutlined } from "@ant-design/icons";
import {appCopy} from "../../utils/appCopy";



interface ICopyIcon {
  copyText: any;
  icon?: ReactElement;
  className?: string;
  btnClassName?: string;
}

export const CopyIcon = (props: ICopyIcon) => {
  const { copyText, icon, className = '', btnClassName='' } = props;
  const [api, contextHolder] = notification.useNotification();

  const onClickToCopy = () => {
    appCopy(copyText);
    navigator.clipboard.writeText(copyText);
    api.success({
      message: 'Copiado!',
    });
  };
  return (
    <>
      <button className={cx('active:opacity-50 sm:hover:opacity-50 ',btnClassName)} onClick={onClickToCopy}>
        {icon ? icon : <CopyOutlined className={cx(`text-base flex justify-center items-center`, className)} />}
      </button>
      {contextHolder}
    </>
  )
}
