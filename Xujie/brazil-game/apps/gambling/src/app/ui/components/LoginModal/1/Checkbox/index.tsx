import { ReactNode } from "react"
import './index.scss';
interface ICheckboxProps {
  checked?: boolean
  children?: ReactNode
  className?:string
  onChange?:(value:boolean)=>void
}
const Checkbox = ({ checked,onChange, children,className }: ICheckboxProps) => {
  return (
    <div className={`mode-checkbox ${className}`}>
      <div className="checkbox-wrapper-46">
        <input type="checkbox" id="cbx-46" className="inp-cbx" checked={checked} onChange={(e)=>{
            onChange?.(e.target.checked)
        }}/>
        <label htmlFor="cbx-46" className="cbx">
          <span className="icon-check">
            <svg viewBox="0 0 12 10" height="10px" width="12px">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </svg>
          </span>
        
        </label>
      </div>
      <div>{children}</div>
    </div>
  )
}
export default Checkbox
