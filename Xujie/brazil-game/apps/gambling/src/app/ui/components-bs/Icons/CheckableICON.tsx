import { environment } from "../../../../environments/environment";

type ICheckableICON = {
  isChecked: boolean;
}
export const CheckableICON = (props: ICheckableICON) => {
  return (
    <img className="w-[24px] h-[24px]" src={`assets/${environment.uVersion}/ic_check_box_${props.isChecked ? 'checked' : 'unchecked'}.png`} alt="Checked" />
  )
}
