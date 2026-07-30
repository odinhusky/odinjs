import { useI18n, useRouter } from "#imports"

// 證實在 Nuxt 環境中可以正常使用 useI18n 和 useRouter

export function useTestI18n(param?: number) {
  const { t, te } = useI18n()
  // const router = useRouter()

  // onMounted(() => {
  //   console.log("useTestI18n mounted with param:", param)
  //   router.go(param)
  // })

  return { t, te }
}
