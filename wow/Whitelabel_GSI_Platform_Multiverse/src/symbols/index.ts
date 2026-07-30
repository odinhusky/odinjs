import { type EventBus } from "quasar"
import { Events } from "src/boot/eventbus/types"
import type { MemberMessengerRouteNames } from "src/common/utils/constants/memberMessenger"
import { InjectionKey } from "vue"

export const EventBusKey: InjectionKey<EventBus<Events>> = Symbol("eventbus")

export const MemberMessengerRouteNamesKey: InjectionKey<MemberMessengerRouteNames> = Symbol(
  "memberMessengerRouteNames"
)
