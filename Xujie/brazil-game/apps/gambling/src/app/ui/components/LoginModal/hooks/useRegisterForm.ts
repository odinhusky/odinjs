import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { environment } from "apps/gambling/src/environments/environment"
import { IRegisterFormValues } from "../types"
import { usePageNavigate } from "../../../router/hooks/usePageNavigate"
import LoginModeContext from "../LoginModeContext"

const useRegisterForm = () => {
  const ref = useRef<any>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false)
  const refreshCaptcha = () => {
    setIsCaptchaLoading(true)
    axios
      .get(`${environment.captcha}?${new Date().getTime()}`, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        setImgSrc(
          `data:${res.headers["content-type"]};base64,${btoa(
            String.fromCharCode(...new Uint8Array(res.data))
          )}`
        )

        ref.current?.setFormValues({
          captcha: "",
        })
        if (res.headers["captcha-image-key"]) {
          const key = res.headers["captcha-image-key"]
          setCaptchaKey(key)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsCaptchaLoading(false)
      })
  }
  useEffect(() => {
    refreshCaptcha()
  }, [])

  const [isPolicyChecked, setIsPolicyChecked] = useState(true)
  const [captchaKey, setCaptchaKey] = useState("")
  const togglePolicyCheck = () => {
    setIsPolicyChecked(!isPolicyChecked)
  }

  const { onClickToPrivacyAgreement } = usePageNavigate()

  const {
    service,
    validator,
    onConfirmFail,
    runAnimate,
    animate,
  } = useContext(LoginModeContext)
  const onConfirm = (values: IRegisterFormValues) => {
    service
      ?.register?.({
        phone: values.phone,
        password: values.password,
        captcha: {
          code: values.captcha,
          key: captchaKey,
        },
      })
      .catch(() => {
        refreshCaptcha()
      })
  }
  useEffect(() => {
    runAnimate('showRegister')
  }, [])
  return {
    ref,
    // Captcha
    refreshCaptcha,
    captchaKey,
    imgSrc,
    isCaptchaLoading,
    // Policy
    isPolicyChecked,
    togglePolicyCheck,
    onClickToPrivacyAgreement: () => runAnimate("clickAgreement", onClickToPrivacyAgreement),
    animate,
    //LoginModeContext
    validator,
    onConfirm,
    onConfirmFail,
  }
}
export default useRegisterForm
