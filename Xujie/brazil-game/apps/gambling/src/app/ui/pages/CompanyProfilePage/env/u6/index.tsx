import { environment } from "../../../../../../environments/environment";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";
import { PageContainer } from "../../../../components-bs/PageContainer";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import cx from "../../../../utils/cx";

const companyProfileList = [{
  title: "2023",
  subTitle: "Novo Território no Brasil",
  description: "Investimos 2 bilhões de dólares no Brasil, adquirindo bancos digitais relacionados à rede, obtendo licenças para cassinos online. Em apenas seis meses, nos tornamos uma das três principais empresas no setor de transações de jogos.",
}, {
  title: "2021",
  subTitle: "Nova Direção no Brasil",
  description: "Investimos em setores relacionados à internet no Brasil para fortalecer ainda mais as raízes de nossos empreendimentos e buscar novos desenvolvimentos em mercados emergentes e regiões geográficas.",
}, {
  title: "2015",
  subTitle: "Destino em Singapura",
  description: "Com a abertura do resort, nosso investimento representou a maior despesa para um resort desse tipo. A icônica estrutura tornou-se uma das principais atrações arquitetônicas de Singapura, influenciando significativamente a imagem da cidade como um principal destino global para conferências e férias.",
}, {
  title: "2012",
  subTitle: "Expansão em Macau",
  description: "Após anos de crescimento em Macau, inauguramos nosso resort integrado avançado em 2012. Atualmente, operamos cinco resorts principais em Macau, alguns dos quais incluem várias marcas de hotéis.",
}, {
  title: "2001",
  subTitle: "Fundação da Empresa",
  description: "Fundamos nossa empresa em 2001, com um histórico sólido de impacto positivo nas regiões em que operamos. Nos destacamos por inovação no desenvolvimento e promoção de produtos que impulsionam as indústrias de turismo e jogos offline.",
}]



type IItem = {
  title: string;
  subTitle: string;
  description: string;
  className?: string;
}
const Item = (props: IItem) => {
  return (
    <div className={cx('relative mb-4 flex justify-end', props.className)}>
      <div className={cx(
        "w-[45px] h-8 mobile:w-[57px] mobile:h-10 tablet:w-[62px] tablet:h-[52px]",
        "text-base mobile:text-lg tablet:text-xl font-medium bg-[#161F34] shrink-0",
        "mr-4 tablet:mr-9 flex items-center justify-center relative z-[11]"
      )}>{props.title}</div>
      <div className=" px-4 py-3 mobile:py-4 box-border rounded-lg bg-[var(--grayscale-40)] z-10">
        <div className={cx(
          "text-sm font-medium mb-2",
        )}>
          {props.subTitle}
        </div>
        <div className={cx(
          "text-sm tablet:text-base text-[var(--grayscale-90)]",
        )}>
          {props.description}
        </div>
      </div>
    </div>
  )
}

export const CompanyProfilePage = () => {
	const { onClickToIndex } = usePageNavigate();
	const { isMobile, isTablet, isDesktop } = useBreakpoint();
  
  return (
    <PageContainer className="pt-3 mobile:pt-5 tablet:pt-10">
      {
        isDesktop ? <></> : <BackNavigation className="mb-3 tablet:mb-7" onClick={() => onClickToIndex()} />
      }
      <div className="text-white text-left">
        <div className={cx(
          "mb-3 mobile:mb-4 tablet:mb-6",
          "w-full  text-white",
          "flex items-center",
        )}>
          <img src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_company_profile${isMobile ? '_m' : isTablet ? '_t' : ''}.png`} alt="company_profile" />
          <div className={cx("absolute z-10", "pl-4 mobile:pl-8 tablet:pl-16 box-border",  `w-[calc(100%_-_136px)]`)}>
            <div className={cx(
              "text-xl mobile:text-4xl tablet:text-[56px] tablet:leading-[64px]",
              "mb-1 mobile:mb-2 tablet:mb-1",
              "font-bold tablet:font-black shadow-[0px_2px_4px_0px_rgba(0, 0, 0, 0.25)]",
            )}>
              Sobre Nós
            </div>

            <div className={cx(
              "text-xl mobile:text-3xl tablet:text-[40px] w-full",
              "font-bold mobile:font-medium",
              "shadow-[0px_2px_4px_0px_rgba(0, 0, 0, 0.25)]"
            )}>
              Turismo e Jogos para uma Nova Geração
            </div>
          </div>
        </div>
      <div   
       className='rounded-xl overflow-hidden tablet:pb-10 mobile:pb-8 pb-4 px-5 mobile:px-9 tablet:px-12'
        style={{   
          background: `url(assets/${environment.uVersion}/bg_about_company.png) 48% center /cover`,
      }}>
        <div
          className="py-4 mobile:py-8 tablet:py-10"
        >
          <div className="py-6 px-4 tablet:p-10 border border-[var(--transparente-20)] rounded-xl relative">
            {
              companyProfileList.map((item, i) => (
                <Item
                  className={cx(i == companyProfileList.length - 1 ? "mb-0" : "")}
                  key={i}
                  title={item.title}
                  subTitle={item.subTitle}
                  description={item.description}
                />
              ))
            }
            <div className={
              cx(
                "w-1 absolute top-[24px] tablet:top-10 left-[35px] mobile:left-[42px] tablet:left-[70px] z-10 h-full",
              )}>
              <div className="w-1 h-[calc(100%_-_48px)] tablet:h-[calc(100%_-_80px)]" style={{ background: 'linear-gradient(270deg, #4483E2 0%, #1CCE58 100%)' }}></div>
              <div className="w-5 h-5 -mt-5 -ml-2 rounded-full bg-linear-1-main"></div>
            </div>
          </div>

        </div>

        <div className={cx("rounded-xl py-3 px-4 mobile:p-6 tablet:px-10 box-border mt-4 mobile:mt-5 tablet:mt-9 bg-[var(--grayscale-40)]",
        )}>
          <div className={cx(
            "text-base tablet:text-2xl font-bold tablet:font-medium",
            "pb-3 mobile:pb-4 text-center",
          )}>
            Licenciamento Legal da Empresa
          </div>

          <div className={cx(
            "text-sm tablet:text-base text-white font-normal tablet:font-medium text-center mobile:text-left",
          )}>
            {environment.platformName}, a nova versão foi lançada em agosto, e no primeiro dia de operação, o volume de transações de recarga ultrapassou 5 milhões de reais.
            <br />
            {environment.platformName} é operado pela Inbet Online Ltd (Registro Comercial de Curaçao nº 158191, Emancipatie Boulevard Dominico F. "Don" Martina 52, Curaçao), de acordo com a licença principal de jogos #5517/JAZ. Conforme declaração de política da empresa,
            {environment.platformName} opera sob a sublicença CIL. Sob a sublicença CIL,
            {environment.platformName} é operado em conformidade com as leis de Curaçao. A Inbet Online Ltd está sujeita a obrigações de combate à lavagem de dinheiro, conforme estabelecido pela legislação de Curaçao.
          </div>
        </div>
      </div>


      </div>
    </PageContainer>
  )
}
