import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {renderByRWD} from "../../../../../utils/renderByRWD";
import {MobileRecordPage} from "./device/MobileRecordPage";
import {DesktopRecordPage} from "./device/DesktopRecordPage";


export const recordStatusMap = {
  true: {
    title: 'Sucesso',
    color: 'var(--secondary-main)'
  },
  false: {
    title: 'Não recebido',
    color: 'var(--state-warn-main)'
  }
}

export const RecordPage = () => {
  const device = useBreakpoint();

  return renderByRWD({
    mobile: <MobileRecordPage />,
    tablet: <DesktopRecordPage />,
    desktop: <DesktopRecordPage />,
  }, device)
}