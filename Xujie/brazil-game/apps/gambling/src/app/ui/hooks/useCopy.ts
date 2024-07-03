import { notification } from "antd";
import { appCopy } from "apps/gambling/src/app/ui/utils/appCopy";
import t from "apps/gambling/src/assets/constant/lang";

export const useCopy = () => {
  const [notice, contextHolder] = notification.useNotification();

  const copy = (copyText: string) => {
    appCopy(copyText || '');
    notice.success({
      message: t['Copied']
    })
  }

  // contextHolder 一定要放在被引用的 Component return 的內容裡
  // return (
  //   {contextHolder}
  //   ...
  // )
  return {
    copy,
    contextHolder
  }
}

export default useCopy;