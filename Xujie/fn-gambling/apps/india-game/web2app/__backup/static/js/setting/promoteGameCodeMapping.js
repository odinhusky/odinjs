/**
 * 依照 adsetname (game code) 找出對照表 的遊戲名稱 (game name)
 * @param gameCode
 * @returns {Promise<*|string|null>}
 */
async function loadPromoteGameCodeMapping(adsetname) {
  console.log('@@@===>loadPromoteGameCodeMapping');
  try {
    const response = await fetch(`/game-adjust/promoteGameCodeMapping.json`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonData = await response.json();
    return jsonData[adsetname] ? jsonData[adsetname] : '';
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null; // 或者根據需求返回其他值
  }
}
