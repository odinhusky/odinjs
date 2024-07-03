import { IButton } from "../../IButton"
import { twMerge } from "tailwind-merge";

export const QRcodeCopyButton = (props: IButton) => {
  return (
    <button
      className={twMerge(
        'text-white text-base py-1.5 px-5 md:py-3 md:px-8 rounded-xl md:rounded-lg',
        'bg-gradient-to-b from-[var(--secondary-main-from)] to-[var(--secondary-main-to)]',
        props.className
      )}
      onClick={props.onClick}
    >
      Copiar Código De Pix
    </button>
  )
}
