import { environment } from "../../../../../environments/environment";
import cx from "classnames";

type ICloseICON = {
	className: string;
	onClick: (event: any) => void;
}

export const CloseICON = (props: ICloseICON) => {
	return (
		<div className={cx(props.className, "rounded-full", "w-[40px] h-[40px]  flex justify-center items-center cursor-pointer")}
			onClick={props.onClick}
		>
			<img src={`assets/${environment.uVersion}/icon_close.png`} className="w-[24px] h-[24px]" alt="close" />
		</div>
	)
}