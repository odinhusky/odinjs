import { GetVIPInfoResponse } from "../../../../external/UserEndpoint";
import { useEffect, useState } from "react";

export const useVIPGradePage = (currentLevel: number, userVIPScore?: GetVIPInfoResponse['data']['vip_score']) => {
  const [selectedVIP, setSelectedVIP] = useState(currentLevel);

  useEffect(() => {
    if(userVIPScore !== undefined) {
      if(userVIPScore === 0) {
        setSelectedVIP(0);
      }else {
        setSelectedVIP(currentLevel === 25 ? currentLevel : currentLevel + 1)
      }
    }
  }, [currentLevel, userVIPScore])

  return {
    selectedVIP,
    setSelectedVIP
  }
}
