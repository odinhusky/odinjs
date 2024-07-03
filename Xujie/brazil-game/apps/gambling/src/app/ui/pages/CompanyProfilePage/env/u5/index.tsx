import { environment } from "../../../../../../environments/environment";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { twMerge } from "tailwind-merge";
import styled from "styled-components";
import { tcx } from "../../../../utils/tcx";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"

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
  imgUrl?: string;
  index: number;
}
const MobileItem = (props: IItem) => {
  return (
    <div className={twMerge('py-2 pr-2 box-border rounded-lg relative bg-[var(--grayscale-20)] flex justify-end', props.className)}>
      <div className="ml-7 p-2 box-border rounded-lg bg-[rgba(77,65,88,0.5)] z-10">
        <div className={twMerge(
          "text-base font-extrabold",
        )}> {props.title}
        </div>
        <div className={twMerge(
          "text-sm font-extrabold",
        )}>
          {props.subTitle}
        </div>
        <div className={twMerge(
          "text-sm text-[var(--grayscale-80)]",
        )}>
          {props.description}
        </div>
      </div>
      <img className="absolute top-0 right-0 rounded-lg h-full" src={`assets/${environment.uVersion}/${environment.mVersion}/company_profile_card_bg_m.png`} />
      <div className={
        twMerge(
          "absolute top-0 left-2",
          "w-3 h-[calc(100%_+_12px)]",
        )}>
        <div className="w-3 h-3 absolute top-[44%] z-10 rounded-full bg-[var(--state-success-main)]"></div>
        <Dashed className="w-1 h-full" index={props.index} />
      </div>
    </div >
  )
}
const Item = (props: IItem) => {
  return (
    <div className={twMerge('py-5 pr-5 mb-5 lg:mb-8 box-border rounded-lg relative bg-[var(--grayscale-20)] flex justify-end items-center', props.className)}>
      <div className={twMerge(
        "text-lg lg:text-xl ml-[60px] font-extrabold",
      )}> {props.title}
      </div>
      <div className="ml-5 lg:ml-10 px-3 py-4 box-border rounded-lg bg-[rgba(77,65,88,0.5)] z-10">
        <div className={twMerge(
          "text-base font-extrabold",
        )}>
          {props.subTitle}
        </div>
        <div className={twMerge(
          "text-sm lg:text-base text-[var(--grayscale-80)]",
        )}>
          {props.description}
        </div>
      </div>
      <img className="absolute top-0 right-0 rounded-lg h-full" src={props.imgUrl} />
      <div className={
        twMerge(
          "absolute top-0 left-5",
          "w-5 h-[calc(100%_+_20px)] lg:h-[calc(100%_+_32px)]",
        )}>
        <div className="w-5 h-5 absolute top-[calc(50%_-_20px)] lg:top-[calc(50%_-_26px)] z-10 rounded-full bg-[var(--state-success-main)]"></div>
        <Dashed className="w-1 h-full" index={props.index} styleName="left: 8px;" firstStyleName="height: 65%;" lastStyleName="height: 46%;" />
      </div>
    </div >
  )
}

export const Dashed = styled.div.attrs((props) => ({
  className: tcx("h-full", props.className)
})) <{
  index?: number;
  styleName?: string;
  firstStyleName?: string;
  lastStyleName?: string;
}>`
  &:before {
    content: "";
    width: 4px;
    height: 100%;
    position: absolute;
    left: 4px;
    bottom: 0;
    background: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 50%,
        #00C885 50%,
        #00C885 100%
    );
    background-size: 4px 14px;
    background-repeat: repeat-y;
    ${(props) => props.index == 0 && `height: 50%; ${props.firstStyleName}`}
    ${(props) => props.index == companyProfileList.length - 1 && `height: 50%; top: 0; bottom: 50%; ${props.lastStyleName}`}
    ${(props) => props.styleName ? props.styleName : "width: 4px;"}
  }
`;

export const CompanyProfilePage = () => {
  const { isMobile, isTablet } = useBreakpoint()
  return (
    <PageContainer className="pt-3 md:pt-5 lg:pt-10">
      <div className="text-white text-left">
        <div className={twMerge(
          "pl-3 md:pl-6 lg:pl-12 pt-4 md:pt-[42px] lg:pt-[72px] box-border",
          "w-full h-[100px] md:h-[160px] lg:h-[240px] rounded-lg md:rounded-xl lg:rounded-[20px] bg-[var(--grayscale-30)] text-white",
          "relative"
        )}>
          <div className={twMerge(
            "text-base md:text-3xl lg:text-5xl",
            "font-extrabold shadow-[-3px_3px_2px_0px_rgba(51, 43, 59, 1)]",
          )}>
            Sobre Nós
          </div>

          <div className={twMerge(
            "text-sm md:text-xl lg:text-3xl mt-1 md:mt-3 w-[220px] md:w-full lg:w-full",
            "font-extrabold shadow-[-2px_0px_0px_2px_rgba(51, 43, 59, 1)] absolute z-10",
          )}>
            Turismo e Jogos para uma Nova Geração
          </div>
          <div className="absolute top-0 right-0">
            <img
              src={`assets/${environment.uVersion}/${environment.mvVersion
                }/internal_banner_company_profile${isMobile ? "_m" : isTablet ? "_t" : ""
                }.png`}
              alt="banner"
              id="banner"
              className="h-[100px] md:h-[160px] lg:h-[240px] rounded-lg"
            />
          </div>
        </div>

        <div className={"my-3 md:my-5 lg:my-8 shadow-[0px_4px_4px_0px_rgba(0, 0, 0, 0.25)]"}>
          {
            companyProfileList.map((item, i) => (
              isMobile ? <MobileItem key={i}
                className={"mb-3"}
                title={item.title}
                subTitle={item.subTitle}
                description={item.description}
                index={i}
              /> : <Item key={i}
                title={item.title}
                subTitle={item.subTitle}
                description={item.description}
                index={i}
                imgUrl={`assets/${environment.uVersion}/${environment.mVersion}/company_profile_card_bg${isTablet ? "_t" : ""}.png`}
              />
            ))
          }

        </div>

        <div className={twMerge("rounded-lg p-4 md:p-8 lg:p-8 box-border bg-[var(--grayscale-20)]",
        )}>
          <div className="rounded-lg p-3 md:px-5 lg:px-5 box-border bg-[var(--grayscale-10)] text-white text-left">
            <div className={twMerge(
              "text-sm lg:text-base font-extrabold",
              "pb-2 md:pb-3",
            )}>
              Licenciamento Legal da Empresa
            </div>

            <div className={twMerge(
              "text-sm lg:text-base font-normal",
              "text-[var(--grayscale-80)]",
            )}>
              {environment.platformName}, a nova versão foi lançada em agosto, e no primeiro dia de operação, o volume de transações de recarga ultrapassou 5 milhões de reais.
              <br />
              {environment.platformName} é operado pela Inbet Online Ltd (Registro Comercial de Curaçao nº 158191, Emancipatie Boulevard Dominico F. "Don" Martina 52, Curaçao), de acordo com a licença principal de jogos #5517/JAZ. Conforme declaração de política da empresa,
              {environment.platformName} opera sob a sublicença CIL. Sob a sublicença CIL,
              {environment.platformName} é operado em conformidade com as leis de Curaçao. A Inbet Online Ltd está sujeita a obrigações de combate à lavagem de dinheiro, conforme estabelecido pela legislação de Curaçao.
            </div>
            {/* <button className={twMerge(
              "text-sm py-2 lg:py-[10px] mt-2 md:mt-3 font-extrabold",
              "rounded-[100px] w-full md:w-[236px]",
              "text-white text-center bg-linear-4-main cursor-pointer",
              "shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]"
            )}>
              Verificar a Gaming Curaçao
            </button> */}
          </div>
        </div>


      </div>
    </PageContainer>
  )
}
