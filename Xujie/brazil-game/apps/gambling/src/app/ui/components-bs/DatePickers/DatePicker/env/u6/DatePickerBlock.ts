import cx from "../../../../../utils/cx";
import styled from "styled-components";


export const DatePickerBlock = styled.div.attrs<{
    className?: string;
}>(props => ({
    className: cx('w-full', props.className)
}))`
    padding: 10px 16px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid var(--grayscale-80);
    border-radius: 8px;
    box-sizing: border-box;
    background: var(--grayscale-20);
`
