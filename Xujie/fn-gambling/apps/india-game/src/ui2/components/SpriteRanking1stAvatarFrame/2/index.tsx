import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import SpriteAnimator from '@mode2/components/SpriteAnimator';
import { scaleRankingValue } from '@commonUtils/components/rankingPage/index';
import { SpriteRanking1stAvatarFrameProps } from '../SpriteRanking1stAvatarFrameProps';

export const SpriteRanking1stAvatarFrame = ({
  isModalMode,
}: SpriteRanking1stAvatarFrameProps) => {
  return (
    <div>
      <SpriteAnimator
        sprite={getImgUrl(EResourceLevel.V, 'sprite_jackpot_frame_1st_2x')}
        width={scaleRankingValue({ isModalMode, value: 152 })}
        height={scaleRankingValue({ isModalMode, value: 135 })}
        frameCount={7}
      />
    </div>
  );
};

export default SpriteRanking1stAvatarFrame;
