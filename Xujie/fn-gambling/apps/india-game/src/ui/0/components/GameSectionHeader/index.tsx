import { Swiper as SwiperClass } from 'swiper/types';
import { I18NContent } from '@libs/mode2/@types/i18nType';

interface GameSectionHeaderProps {
  iconSrc: string;
  title: I18NContent;
  amount: number;
  isShowAmount: boolean;
  isShowSlideBtn: boolean;
  swiperRef?: React.RefObject<SwiperClass | null>;
  onAmountClick: () => void;
}

const GameSectionHeader = (props: GameSectionHeaderProps) => {
  return null;
};

export default GameSectionHeader;
