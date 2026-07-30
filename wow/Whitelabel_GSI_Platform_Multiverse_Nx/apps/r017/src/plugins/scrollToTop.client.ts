export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  })
})
