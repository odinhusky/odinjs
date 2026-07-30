import { EventBus } from "quasar"
import { defineBoot } from "#q-app/wrappers"
import { EventBusKey } from "@/symbols"

import type { Events } from "@/boot/eventbus/types"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $eventbus: EventBus<Events>
  }
}

export default defineBoot(({ app }) => {
  const bus = new EventBus<Events>()

  // options
  app.config.globalProperties.$eventbus = bus

  // composition
  app.provide(EventBusKey, bus)
})
