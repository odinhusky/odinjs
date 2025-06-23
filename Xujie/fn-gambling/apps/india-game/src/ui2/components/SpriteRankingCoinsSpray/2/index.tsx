import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import SpriteAnimator from '@mode2/components/SpriteAnimator';
import { SpriteRankingCoinsSprayProps } from '../SpriteRankingCoinsSprayProps';
import { scaleRankingValue } from '@commonUtils/components/rankingPage';

export const SpriteRankingCoinsSpray = ({
  isModalMode,
}: SpriteRankingCoinsSprayProps) => {
  return (
    <div>
      <SpriteAnimator
        sprite={getImgUrl(EResourceLevel.V, 'sprite_jackpot_spray_coins')}
        width={scaleRankingValue({ isModalMode, value: 480 })}
        height={scaleRankingValue({ isModalMode, value: 148 })}
        frameCount={8}
      />
    </div>
  );
};

export default SpriteRankingCoinsSpray;
