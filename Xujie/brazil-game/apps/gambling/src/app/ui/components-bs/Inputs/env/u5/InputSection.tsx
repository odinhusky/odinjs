import styled from "styled-components";
import { tcx } from "../../../../utils/tcx";

export const InputSection = styled.a.attrs((props) => ({
  className: tcx("p-2.5 md:py-2 md:px-2.5 lg:p-2.5 border-solid border border-[var(--grayscale-40)] rounded-lg bg-[var(--grayscale-30)]", props.className),
})) <{
  focus?: boolean;
  validation?: boolean;
  className?: string;
  focusStyle?: string;
  errorStyle?: string
}>`
  display: flex;
  flex-direction: row;
  transition: all .4s;

  ${(props) => props.focus && props.validation !== false &&`
  border: 2px solid var(--state-warn-main); ${props.focusStyle}
  `}
  ${(props) => props.validation === false && `
    border-color: var(--state-error-main); ${props.errorStyle}
  `}

`
