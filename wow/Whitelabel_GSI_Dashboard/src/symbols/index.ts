import { InjectionKey } from "vue"
import { type EventBus } from "quasar"
import { Events } from "@/boot/eventbus/types"

export const EventBusKey: InjectionKey<EventBus<Events>> = Symbol("eventbus")
