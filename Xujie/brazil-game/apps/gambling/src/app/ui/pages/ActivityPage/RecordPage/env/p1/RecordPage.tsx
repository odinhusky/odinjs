import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {renderByRWD} from "../../../../../utils/renderByRWD";
import {MobileRecordPage} from "./device/MobileRecordPage";
import {DesktopRecordPage} from "./device/DesktopRecordPage";

export const recordStatusMap = {
  true: {
    title: 'Sucesso',
    color: '#16FF8F'
  },
  false: {
    title: 'Não recebido',
    color: '#FF9000'
  }
}


export const RecordPage = () => {
  const device = useBreakpoint()

  return renderByRWD({
    mobile: <MobileRecordPage />,
    tablet: <DesktopRecordPage />,
    desktop: <DesktopRecordPage />,
  }, device)
}