import { WatermarkPhoto } from "../../../../components/WatermarkPhoto"
import { environment } from "../../../../../../environments/environment"
import { Modal } from "antd"
const LicenseModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className="relative w-full h-full max-w-[320px] mobile:max-w-[480px] tablet:max-w-[552px] m-auto"
      onClick={(event) => {
        event.stopPropagation()
      }}
    >
      <button
        className="
          absolute z-10 right-2 top-2 mobile:right-3 mobile:top-3 
          w-7 h-7 mobile:w-9 mobile:h-9 tablet:w-10 tablet:h-10 
          rounded-full flex justify-center items-center linear-5-button"
        onClick={onClose}
      >
        <img
          className="w-[21px] h-[21px] mobile:w-[27px] mobile:h-[27px] tablet:w-[30px] tablet:h-[30px]"
          src={`assets/${environment.uVersion}/icon_cross.png`}
          alt="close"
        />
      </button>
      <div className="">
        <div className="w-full h-full">
          <WatermarkPhoto
            className="rounded-xl"
            src={`assets/license/license.jpeg`}
            content={`${environment.platformGroup} (CC)`}
            row={12}
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
