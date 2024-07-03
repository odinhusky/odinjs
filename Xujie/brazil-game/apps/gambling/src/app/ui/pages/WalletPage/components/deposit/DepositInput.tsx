import { renderByUVersion } from "../../../../utils/renderByUVersion";
import { DepositInput as PDepositInput } from "../../env/p1/tabsContent/deposit/DepositInput";
import { DepositInput as WDepositInput } from "../../env/wild/tabsContent/deposit/DepositInput"
import { DepositInput as CDepositInput } from "../../env/u1/tabsContent/deposit/DepositInput";
import { DepositInput as RDepositInput } from "../../env/u2/tabsContent/deposit/DepositInput";
import { DepositInput as U5DepositInput } from "../../env/u5/DepositInput";
import { DepositInput as U6DepositInput } from "../../env/u6/DepositInput";
import { DepositInput as U7DepositInput } from "../../env/u7/DepositInput";

import { InputValue } from "../../../../components-bs/Inputs/Input";

export interface IDepositInput {
  inputValue: InputValue<string>;
  setInputValue: React.Dispatch<React.SetStateAction<InputValue<string>>>;
  onChange?: (event: any) => void;
  extraDepositBonus?: string;
  isShowInputTag?: boolean;
  minimunValue?: number;
  maximunValue?: number;
}
export const DepositInput = (props: IDepositInput) => {

  return renderByUVersion({
    "wild777bet": (<WDepositInput {...props} />),
    "p1": (<PDepositInput {...props} />),
    "u1": (<CDepositInput {...props} />),
    "u2": (<RDepositInput {...props} />),
    "u5": (<U5DepositInput {...props} />),
    "u6": (<U6DepositInput {...props} />),
    "u7": (<U7DepositInput {...props} />)
  }, (
    <PDepositInput {...props} />
  ))

}
