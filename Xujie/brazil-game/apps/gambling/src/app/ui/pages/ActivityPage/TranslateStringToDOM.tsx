import { useEffect, useRef } from "react";


type ITranslateStringToDOM = {
    htmlContext: string;
}
export const TranslateStringToDOM = (props: ITranslateStringToDOM) => {
    const { htmlContext } = props
    return <div dangerouslySetInnerHTML={{ __html: htmlContext }} />
}