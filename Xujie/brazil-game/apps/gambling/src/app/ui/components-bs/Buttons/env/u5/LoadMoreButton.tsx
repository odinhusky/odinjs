import { Button } from "./Button"

export const LoadMoreButton = (props: { onClick: () => void }) => {
  return (
    <Button
      onClick={props.onClick}
      className="w-40 h-9 flex justify-center items-center text-xs md:text-sm lg:text-base text-white bg-linear-5-main font-medium"
      text={'Ver Mais'}
    />
  )
}
