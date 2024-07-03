import {useEffect, useRef, useState} from "react";
import Slider, {Settings} from "react-slick";
import {GetPunchInConfigResponse} from "../../../../../../external/PunchInEndpoint";


export const useDailySignInPage = (currentVIP: number, signInAllConfig: GetPunchInConfigResponse['data']['signInAllConfig'], slidesToShow: number, signInTotalDays?: number) => {
  const [selectedVIP, setSelectedVIP] = useState(1);
  const [centerIndex, setCenterIndex] = useState<number>()

  const sliderRef = useRef<Slider>(null);

  const vipConfig = signInAllConfig?.find(
    (config) =>
      config.identifier.split('::')[2].replace('V', '') ===
      `${selectedVIP}`
  )
  const dayConfigs: { days: number, cashback: number }[] = JSON.parse(vipConfig?.value || '[]');

  useEffect(()=> {
    setSelectedVIP(currentVIP === 0? 1: currentVIP)
  }, [currentVIP])

  useEffect(() => {
    sliderRef?.current?.slickGoTo((centerIndex || 0) < Math.floor(slidesToShow / 2) ? dayConfigs.length - Math.floor(slidesToShow / 2) + (centerIndex || 0) : (centerIndex || 0) - Math.floor(slidesToShow / 2), true)
  }, [centerIndex, sliderRef?.current]);

  useEffect(() => {
    if(selectedVIP > currentVIP) {
      setCenterIndex(0)
    }else {
      if(signInTotalDays || signInTotalDays === 0){
        if(signInTotalDays !== 0){
          setCenterIndex(signInTotalDays === dayConfigs.length ? 0: signInTotalDays)
        }else {
          setCenterIndex(0)
        }
      }
    }

  }, [signInTotalDays, selectedVIP]);

  return {
    sliderRef,
    centerIndex,
    setCenterIndex,
    selectedVIP,
    setSelectedVIP,
    dayConfigs
  }
}