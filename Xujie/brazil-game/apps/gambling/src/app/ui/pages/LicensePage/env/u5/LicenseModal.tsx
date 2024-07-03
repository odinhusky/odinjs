import { WatermarkPhoto } from "../../../../components/WatermarkPhoto"
import { environment } from "../../../../../../environments/environment"
import { Modal } from "antd"
const LicenseModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className="relative w-full"
      onClick={(event) => {
        event.stopPropagation()
      }}
    >
      <button
        className="absolute z-10 -right-2.5 -top-2.5 w-10 h-10 rounded-full flex justify-center items-center bg-[var(--grayscale-50)] shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]"
        onClick={onClose}

      >
        <img
          className="w-[24px] h-[24px] hover:opacity-80"
          src={`assets/${environment.uVersion}/icon_close.png`}
          alt="close"
        />
      </button>
      <div className="rounded-lg overflow-hidden">
        <div className="w-full h-full">
          <WatermarkPhoto
            className="w-full"
            src={`assets/license/license.jpeg`}
            content={`${environment.platformGroup} (CC)`}
            row={8}
          />
        </div>
      </div>
    </div>
  )
}
export const showLicenseModal = () => {
  const modal = Modal.info({
    className:'!max-w-[564px] !w-[80vw]',
    maskClosable: true,   
    modalRender: () => (
      <div style={{ pointerEvents: "auto" }}>
        <LicenseModal onClose={() => modal.destroy()} />
      </div>
    ),
  })
}
