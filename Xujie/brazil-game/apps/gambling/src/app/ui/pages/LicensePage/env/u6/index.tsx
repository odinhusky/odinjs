import { environment } from "../../../../../../environments/environment"
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation"
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate"
import { PageContainer } from "../../../../components-bs/PageContainer"
import { WatermarkPhoto } from "../../../../components/WatermarkPhoto"
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import { showLicenseModal } from "./LicenseModal"

export const LicensePage = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const { onClickToIndex } = usePageNavigate()
  return (
    <PageContainer>
      <div className="text-[var(--grayscale-100)] w-full space-y-3 mobile:space-y-4 tablet:space-y-6">
        { !isDesktop &&
            <BackNavigation
                className="tablet:mb-5 mobile:mb-4 mb-3"
            />
        }

        {/*Banner*/}
        <div className="w-full flex justify-center items-center relative">
          <div className="">
            <img
              src={`assets/${environment.uVersion}/${environment.mvVersion
                }/internal_banner_license${isMobile ? "_m" : isTablet ? "_t" : ""
                }.png`}
              alt="banner"
              id="banner"
              className="w-full h-full"/** */
            />
          </div>

          <div
            className="
              text-start absolute right-[32%] left-4 mobile:left-8 tablet:left-16 top-1/2 -translate-y-1/2"
            style={{ textShadow: `0px ${isMobile ? '2px' : '4px'} 4px rgba(0,0,0,0.25)` }}
          >
            <div className="tablet:text-[56px] tablet:leading-[64px] mobile:text-4xl text-xl font-bold tablet:font-black">Licença De Curaçao</div>
            <div className=" tablet:text-[40px] tablet:leading-[56px] mobile:text-3xl text-xl font-medium">{environment.platformName} – Cassino Responsável</div>
          </div>
        </div>


        <div className="bg-[var(--grayscale-30)] rounded-xl py-4 px-5 mobile:py-6 mobile:px-9 tablet:py-7 tablet:px-12 space-y-4 mobile:space-y-5 tablet:space-y-9">
          {/*标题  */}
          <div className="space-y-2 mobile:space-y-3">
            <div className="w-full text-center">
              <div className="text-base mobile:text-lg tablet:text-2xl font-bold tablet:font-medium mt-3">Licença De Curaçao</div>
              <div className="text-base mobile:text-lg mt-2">{environment.platformName} – Cassino Responsável</div>
              <div className="bg-[var(--grayscale-70)] w-full h-0.5 mt-6">
              </div>

            </div>
          </div>
          {/*  */}
          <div className="
              flex flex-col tablet:flex-row 
              gap-3 mobile:gap-6 tablet:gap-[72px]"
          >
            <div className="flex flex-col flex-1 space-y-4 tablet:space-y-8">
              <div className="flex flex-none justify-center tablet:justify-start w-full">
                <img
                  src={`assets/${environment.uVersion}/SimpleLogov.png`}
                  alt="logo"
                  className="h-10 mobile:h-12"
                />
              </div>

              <div className="w-full text-start text-[var(--grayscale-90)] text-sm mobile:text-base">
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
            
            <div
              className="relative w-full max-w-[304px] mobile:max-w-[338px] mx-auto"
              onClick={showLicenseModal}
            >
              <WatermarkPhoto
                className="rounded-xl"
                src={`assets/license/license.jpeg`}
                content={`${environment.platformGroup} (CC)`}
                row={12}
              />

              <div className="
                absolute right-0 bottom-0 linear-1-button flex justify-center items-center 
                w-9 h-9 mobile:w-10 mobile:h-10 tablet:w-12 tablet:h-12 
                rounded-[9px] mobile:rounded-[10px] tablet:rounded-xl"
              >
                <img
                  className="w-[27px] h-[27px] mobile:w-[30px] mobile:h-[30px] tablet:w-9 tablet:h-9 "
                  src={`assets/${environment.uVersion}/icon_search.png`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    </PageContainer>
  )
}
