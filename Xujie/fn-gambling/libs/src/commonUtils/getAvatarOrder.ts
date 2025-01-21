export const getAvatarOrder = (order: number): number => {
  const totalAvatars = Number(import.meta.env['VITE_AVATAR_NUMBER']) || 16; // 本地資源數量

  const normalizedIndex =
    ((((order - 1) % totalAvatars) + totalAvatars) % totalAvatars) + 1;
  return normalizedIndex;
};

export default getAvatarOrder;
