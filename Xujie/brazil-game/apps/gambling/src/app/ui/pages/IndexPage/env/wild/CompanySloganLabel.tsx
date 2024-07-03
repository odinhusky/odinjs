import styled from "styled-components";
import {environment} from "../../../../../../environments/environment";

const CompanyLabel = styled.div`
  background-image: linear-gradient(0deg,#fff 0%,#2b3aff 100%);
  //background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`

export const CompanySloganLabel = () => {
  return (
    <div className={"p-2 pb-1 bg-[#020E29] font-[Heebo] leading-none"}>
      <CompanyLabel className={"font-[600]"}>{environment.platformName} ({environment.platformGroup}) {'>>'}</CompanyLabel>
      <div className={"text-sm text-[rgba(255,255,255,.8)]"}>merece a sua confiança</div>
    </div>
  )
}
