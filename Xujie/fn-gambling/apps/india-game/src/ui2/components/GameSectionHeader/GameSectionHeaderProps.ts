import { I18NContent } from '@libs/mode2/@types/i18nType';
import { Swiper as SwiperClass } from 'swiper/types';

export interface GameSectionHeaderProps {
  iconSrc: string;
  title: I18NContent;
  amount: number;
  isShowAmount: boolean;
  isShowSlideBtn: boolean;
  swiperRef?: React.RefObject<SwiperClass | null>;
  onAmountClick: () => void;
}
