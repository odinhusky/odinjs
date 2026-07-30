import { useMeta } from "quasar"
import { getSiteLogo } from "@/api/common"
import { useFavicon } from "@vueuse/core"
import { useEnv } from "src/hook/useEnv"
import { ref } from "vue"

export function useMetaData() {
  const logoUrl = ref("")

  const getMetaData = async () => {
    const res = await getSiteLogo()
    const { envData } = useEnv()

    if (res.code === 0) {
      const { title, bo_ico, updated_time, bo_logo } = res.data

      // 設定 meta
      useMeta({
        title,
        meta: {
          description: { name: "description", content: title }
        }
      })

      // 設定 favicon
      if (bo_ico !== "") {
        useFavicon(`/${bo_ico}?updateTime=${updated_time}`, {
          baseUrl: envData().VITE_APP_BASE_API,
          rel: "icon"
        })
      }

      // 設定 logo url
      if (bo_logo !== "") {
        logoUrl.value = `${envData().VITE_APP_BASE_API}/${bo_logo}?updateTime=${updated_time}`
      }
    }

    return res
  }

  return {
    getMetaData,
    logoUrl
  }
}
