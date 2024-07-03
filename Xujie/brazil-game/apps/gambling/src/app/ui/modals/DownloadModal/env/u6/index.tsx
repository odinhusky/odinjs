import styled from "styled-components";
import QRCode from "react-qr-code";
import { environment } from "../../../../../../environments/environment";
import cx from "classnames";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import { BaseModal } from "../../../BaseModal";
import { Button } from "../../../../components-bs/Buttons/env/u2/Button";

export type IInitialChargeModal = {
  close: () => void;
};

export const DownloadModal = (props: IInitialChargeModal) => {
  const { onClickToOpenDownload, downloadUrl } = usePageNavigate();

  const handleDownload = () => {
    onClickToOpenDownload();
  };

  return (
    <BaseModal
      onClose={() => {
        props.close();
      }}
    >
      <div
        className="bg-linear-6-main relative flex flex-col gap-4 text-[var(--grayscale-100)] w-10/12 mobile:w-[360px] 
          py-6 px-4 tablet:py-10 tablet:px-9 mobile:p-8 rounded-xl min-w-[180px] justify-center items-center"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div
          className="linear-5-button absolute w-7 tablet:w-10 mobile:w-9 h-7 tablet:h-10 mobile:h-9 top-[2.5%] right-[3.5%] rounded-full cursor-pointer"
          onClick={() => {
            props.close();
          }}
        >
          <img
            src={`assets/${environment.uVersion}/ic_close_noBorder.png`}
            className="w-1/2 h-1/2"
            alt="close"
          />
        </div>
        <QRCode
          className="bg-[var(--grayscale-100)] w-40 mobile:w-60 h-40 mobile:h-60 rounded-lg mobile:rounded-2xl p-2 mobile:p-4"
          value={downloadUrl}
        />
        <div className="text-sm font-medium text-center">
          Ao digitalizar o código QR, você podejogar jogos de
          clienteinstantaneamente e sem problemas.
        </div>
        <Button
          className="linear-1-button text-sm tablet:text-base w-full h-9 tablet:w-[226px] tablet:h-12 rounded-lg font-bold"
          onClick={() => handleDownload()}
          text={"Baixar Android"}
        />
      </div>
    </BaseModal>
  );
};
