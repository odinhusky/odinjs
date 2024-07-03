import t from "apps/gambling/src/assets/constant/lang";
import { environment } from "../../../../../../environments/environment";
import { twMerge } from "tailwind-merge";

type ICaptcha = {
  imgSrc: string | null;
  onClickCaptcha: () => void;
  isLoading: boolean;
  className?: string;
  captchaClassName?: string;
  reloadBtnClassName?: string;
  textClassName?: string;
  iconClassName?: string;
  text?:string
}

const ReloadButton = (props: ICaptcha) => {
  return (
    <div className={twMerge(
      "w-[90px] h-10",
      "flex items-center justify-center bg-[var(--state-success-main)] cursor-pointer",
      props.className,
      props.reloadBtnClassName
    )}
      onClick={() => {
        props.onClickCaptcha();
      }}>
      <img src={`assets/${environment.uVersion}/icon_reload.png`} className={twMerge("w-[18px] h-[18px] mr-[6px]", props.iconClassName)} alt={t['Reload']} />
      <div className={twMerge("text-sm font-bold text-white", props.textClassName)}>{props.text || t['Reload']}</div>
    </div>
  )
}

const CaptchaImg = (props: ICaptcha) => {
  return (
    <img
      className={twMerge("w-[90px] h-[50px] cursor-pointer", props.className, props.captchaClassName)}
      src={props.imgSrc!}
      onClick={() => {
        props.onClickCaptcha();
      }}
    />
  )
}
export const Captcha = (props: ICaptcha) => {
  return props.imgSrc ? <CaptchaImg {...props} /> : <ReloadButton {...props} />
}
