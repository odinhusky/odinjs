import { environment } from "../../../../../../environments/environment"
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation"
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate"
import { PageContainer } from "../../../../components-bs/PageContainer"
import { WatermarkPhoto } from "../../../../components/WatermarkPhoto"
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import { showLicenseModal } from "./LicenseModal"
import { twMerge } from "tailwind-merge"

export const LicensePage = () => {
  const { isMobile, isTablet } = useBreakpoint()
  const { onClickToIndex } = usePageNavigate()
  return (
    <PageContainer>
      <BackNavigation onClick={() => onClickToIndex()} />
      {/*Banner*/}
      <div className="tablet:mt-8 mt-3 w-full flex justify-end items-center bg-[var(--grayscale-30)] relative rounded-2xl overflow-hidden">
        <img
          src={`assets/${environment.uVersion}/${
            environment.mvVersion
          }/internal_banner_license${
            isMobile ? "_m" : isTablet ? "_t" : ""
          }.png`}
          alt="banner"
          id="banner"
          className="w-2/3"
        />

        <div
          className=" tablet:leading-[48px] mobile:leading-8 leading-5 text-start shadow-te font-extrabold text-white absolute left-3 mobile:left-6 tablet:left-12 top-1/2 -translate-y-1/2"
          style={{
            textShadow: `${
              isMobile ? "2px 2px" : "6px 6px"
            } 2px var(--grayscale-20)`,
          }}
        >
          <div className="text-base sm:text-3xl tablet:text-5xl">
            Licença De Curaçao
          </div>
          <div className="max-mobile:w-full text-sm  sm:text-xl tablet:text-4xl mt-3">
            {environment.platformName} – Cassino Responsável
          </div>
        </div>
      </div>

      <div className="bg-[var(--grayscale-20)] rounded-lg mt-3 mobile:mt-5 tablet:mt-8 p-8 max-mobile:p-4">
        <div className="bg-[var(--grayscale-30)] rounded-lg px-5 py-3 text-sm leading-5 tablet:text-base tablet:leading-6 ">
          <div
            className="relative w-[338px] max-sm:w-full mx-auto rounded-xl overflow-hidden"
            onClick={showLicenseModal}
          >
            <WatermarkPhoto
              className="w-full rounded-lg mx-auto"
              src={`assets/license/license.jpeg`}
              content={`${environment.platformGroup} (CC)`}
              row={8}
            />

            <div
              className={twMerge(
                "linear-4-button",
                "cursor-pointer absolute right-0 bottom-0 w-12 h-12 flex justify-center items-center rounded-tl-xl rounded-br-xl"
              )}
            >
              <img
                className="w-6 h-6"
                src={`assets/${environment.uVersion}/icon_search.png`}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="mt-3 text-white text-left mobile:mt-5 tablet:mt-8 bg-[var(--grayscale-10)] rounded-lg px-5 py-3 text-sm leading-5 tablet:text-base tablet:leading-6">
          A Licença de Jogos de Curaçao é uma das licenças de jogos eletrônicos
          mais populares do mundo. Os principais fornecedores de software são
          licenciados pelo Conselho de Controle de Jogos de Curaçao. Uma licença
          abrange todos os jogos, como cassinos online, caça-níqueis, apostas
          esportivas e jogos eletrônicos. Atletismo, loterias e jogos de
          habilidade e azar. Esta agência de licenciamento é apoiada pelo
          governo de Curaçao e foi criada para garantir que todas as operadoras
          cumpram a estrutura regulatória e o código de conduta. A seguir está a
          descrição da licença da plataforma ({environment.platformName}). Por
          favor, não roube e infratores será processado.
        </div>
      </div>
    </PageContainer>
  )
}
