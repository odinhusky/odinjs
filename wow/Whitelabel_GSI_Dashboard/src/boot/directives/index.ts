import { defineBoot } from "#q-app/wrappers"
import { directivesTypes } from "./types"

export default defineBoot(({ app }) => {
  // 註冊指令
  directivesTypes.forEach((element) => {
    app.directive(element.name, element.directive)
  })
})
