import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {renderByRWD} from "../../../../../utils/renderByRWD";
import {MobileRecordPage} from "./device/MobileRecordPage";
import {DesktopRecordPage} from "./device/DesktopRecordPage";

export const recordStatusMap = {
  true: {
    title: 'Sucesso',
    color: 'var(--state-success-main)'
  },
  false: {
    title: 'Não recebido',
    color: 'var(--state-error-main)'
  }
}


export const RecordPage = () => {
  const device = useBreakpoint()

  return renderByRWD({
    mobile: <MobileRecordPage />,
    tablet: <MobileRecordPage />,
    desktop: <DesktopRecordPage />
  }, device)
}