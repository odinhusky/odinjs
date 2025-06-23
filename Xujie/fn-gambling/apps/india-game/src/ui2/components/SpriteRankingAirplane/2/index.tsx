import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import SpriteAnimator from '@mode2/components/SpriteAnimator';
import { SpriteRankingAirplaneProps } from '../SpriteRankingAirplaneProps';
import { scaleRankingValue } from '@commonUtils/components/rankingPage/index';

export const SpriteRankingAirplane = ({
  isModalMode,
}: SpriteRankingAirplaneProps) => {
  return (
    <div>
      <SpriteAnimator
        sprite={getImgUrl(EResourceLevel.V, 'sprite_jackpot_plane')}
        width={scaleRankingValue({ isModalMode, value: 129 })}
        height={scaleRankingValue({ isModalMode, value: 72 })}
        frameCount={14}
      />
    </div>
  );
};

export default SpriteRankingAirplane;
