import cx from "../../../../../utils/cx";
import styled from "styled-components";


export const DatePickerBlock = styled.div.attrs<{
    className?: string;
}>(props => ({
    className: cx('w-full', props.className)
}))`
    padding: 0px 8px;
    color: var(--grayscale-70);
    font-size: 14px;
    font-weight: 500;
    //border: 0px solid var(--grayscale-80);
    //border-radius: 8px;
    box-sizing: border-box;
    //background: var(--grayscale-20);
`
