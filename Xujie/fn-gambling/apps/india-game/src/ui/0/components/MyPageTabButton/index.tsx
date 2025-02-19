import { memo } from 'react';
import { I18NContent } from '@libs/mode2/@types/i18nType';

interface MyPageTabButtonProps {
  btnText: I18NContent;
  iconUrl: string;
  onClick: () => void;
}

export const MyPageTabButton = memo((props: MyPageTabButtonProps) => {
  return null;
});

export default MyPageTabButton;
