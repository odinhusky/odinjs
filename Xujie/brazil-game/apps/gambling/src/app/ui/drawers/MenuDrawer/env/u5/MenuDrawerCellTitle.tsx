import styled from "styled-components";
import cx from "classnames";

interface IMenuDrawerCellTitle {
  className?: string;
  title: string
}

export const StyledMenuDrawerCellTitle = styled.div.attrs<IMenuDrawerCellTitle>((props) => ({
  className: cx(props.className,
    'w-full flex flex-col py-2 pl-6 text-sm font-bold text-[var(--grayscale-100)]',
    {})
}))`
  color: var(--grayscale-100);
`

export const MenuDrawerCellTitle = (props: IMenuDrawerCellTitle) => {

  return (<StyledMenuDrawerCellTitle {...props}>
    {props.title}
  </StyledMenuDrawerCellTitle>)
}
