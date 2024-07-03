import styled from "styled-components";
import { tcx } from "../../utils/tcx";

export const WithdrawButton = styled.button.attrs((props) => ({
  className: tcx('bg-medium w-full py-2 text-white rounded-md text-base font-bold', props.className)
}))<{
  className?: string;
}>`
  background: linear-gradient(-90deg,var(--button-withdraw-from),var(--button-withdraw-to));
`;
