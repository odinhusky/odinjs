import copy from "copy-to-clipboard";

export const appCopy = (text?: string) => {
    if (text != undefined && text.length > 0) {
        copy(text);
        copy(text);
    }
}