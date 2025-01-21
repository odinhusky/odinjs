export const getAvatarFrameOrder = (order: number): number => {
  const totalAvatarFrames =
    Number(import.meta.env['VITE_AVATAR_FRAME_NUMBER']) || 4; // 本地資源數量

  const normalizedIndex =
    ((((order - 1) % totalAvatarFrames) + totalAvatarFrames) %
      totalAvatarFrames) +
    1;
  return normalizedIndex;
};

export default getAvatarFrameOrder;
