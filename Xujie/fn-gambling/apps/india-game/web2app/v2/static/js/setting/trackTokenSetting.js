async function loadSettingByTrackToken(trackToken, defPackageName) {
  console.log('@@@===>loadSettingByTrackToken');
  try {
    const response = await fetch(
      `/game-adjust/${defPackageName}/settings.json`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData?.links?.filter((item) => trackToken === item.trackToken)[0];
    // return jsonData;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null; // 或者根據需求返回其他值
  }
}

async function loadDownloadDomainBySetting(defPackageName) {
  console.log('@@@===>loadDownloadDomainBySetting');
  try {
    const response = await fetch(
      `/game-adjust/${defPackageName}/settings.json`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData.downloadDomain || '';
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null; // 或者根據需求返回其他值
  }
}
