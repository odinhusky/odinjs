import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import SpriteAnimator from '@mode2/components/SpriteAnimator';
import { SpriteRanking3rdAvatarFrameProps } from '../SpriteRanking3rdAvatarFrameProps';
import { scaleRankingValue } from '@libs/commonUtils/components/rankingPage';

export const SpriteRanking3rdAvatarFrame = ({
  isModalMode,
}: SpriteRanking3rdAvatarFrameProps) => {
  return (
    <div>
      <SpriteAnimator
        sprite={getImgUrl(EResourceLevel.V, 'sprite_jackpot_frame_3rd_2x')}
        width={scaleRankingValue({ isModalMode, value: 108 })}
        height={scaleRankingValue({ isModalMode, value: 96 })}
        frameCount={7}
      />
    </div>
  );
};

export default SpriteRanking3rdAvatarFrame;
