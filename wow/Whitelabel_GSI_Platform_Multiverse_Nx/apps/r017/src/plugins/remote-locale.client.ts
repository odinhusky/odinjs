export default defineNuxtPlugin(() => {
  const { start } = useRemoteLocaleMessages()
  start()
})
