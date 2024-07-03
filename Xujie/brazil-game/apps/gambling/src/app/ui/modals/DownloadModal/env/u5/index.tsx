import styled from "styled-components";
import QRCode from 'react-qr-code';
import { environment } from "../../../../../../environments/environment";
import cx from "classnames";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import { BaseModal } from "../../../BaseModal";
import { Button } from "../../../../components-bs/Buttons/env/u2/Button";

export type IInitialChargeModal = {
  close: () => void;
}

const Container = styled.div`
  background-size: 100% 100%;
`;

export const DownloadModal = (props: IInitialChargeModal) => {
  const { onClickToOpenDownload, downloadUrl } = usePageNavigate();

  const handleDownload = () => {
    onClickToOpenDownload();
  }

  return (
    <BaseModal
      onClose={() => {
        props.close();
      }}
    >

      <Container
        className={cx(
          "relative",
          "rounded-2xl border-solid ",
          'bg-linear-5-main',
          "flex flex-col items-center",
          "text-center text-white",
          "w-[264px] lg:w-[304px] h-auto"
        )}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className={"flex justify-end w-full absolute top-[-8px] right-[-8px]"}>
          <div className={cx(
            "linear-5-button",
            "rounded-full", "w-[40px] h-[40px]  flex justify-center items-center cursor-pointer"
          )}
            onClick={() => {
              props.close();
            }}
          >
            <img src={`assets/${environment.uVersion}/icon_close.png`} className="w-[24px] h-[24px]" alt="close" />
          </div>
        </div>
        <section>
          <div className="flex justify-center">
            <QRCode className="w-[200px] lg:w-[240px] h-[200px] lg:h-[240px] p-2 mb-4 lg:mb-5 mt-8 bg-white box-border rounded-lg" value={downloadUrl} />
          </div>
          <div className="text-white mx-8 mb-4 lg:mb-5 text-sm">
            Ao digitalizar o código QR, você podejogar jogos de clienteinstantaneamente e sem problemas.
          </div>
          <div className="flex justify-center">
            <Button
              className={cx(
                'state-info-button shadow-none text-sm lg:text-base py-2.5 lg:py-3 rounded-full mb-8 w-[200px] lg:w-[240px] font-bold'
              )}
              onClick={() => handleDownload()}
              text={'Baixar Android'}
            />

          </div>

        </section>
      </Container>
    </BaseModal>
  )
}




