import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import SpriteAnimator from '@mode2/components/SpriteAnimator';

export const SpriteRanking2ndAvatarFrame = ({
  isModalMode,
}: {
  isModalMode: boolean;
}) => {
  return (
    <div>
      <SpriteAnimator
        sprite={getImgUrl(EResourceLevel.V, 'sprite_jackpot_frame_2nd_2x')}
        width={isModalMode ? 116 * 0.78571429 : 116}
        height={isModalMode ? 103.3 * 0.78571429 : 103.3}
        frameCount={7}
      />
    </div>
  );
};

export default SpriteRanking2ndAvatarFrame;
