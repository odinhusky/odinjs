import { Base64 } from 'js-base64';

export const getHtml = (str: string) => {
  return Base64.decode(str);
};

export default getHtml;
