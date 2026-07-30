<script setup lang="ts">
import { useI18n } from "#imports"
import type { TransferInfo } from "@shared-lib/api/commonTypes/bankTypes"

interface ChannelItem extends TransferInfo {
  imgUrl: string
}

interface Props {
  channelList: ChannelItem[]
  selectedChannel: ChannelItem | null
  selectedGatewayId: number
  isLoadingDetail: boolean
  isChannelExpanded: boolean
  depositRangeText: string
  channelRangeMap: Record<number, string>
}

const props = defineProps<Props>()
const { t } = useI18n()

const getChannelRangeText = (channelId: number): string => props.channelRangeMap[channelId] || ""

const getSelectedRangeText = (): string => {
  if (!props.selectedChannel) return props.depositRangeText
  return props.depositRangeText || getChannelRangeText(Number(props.selectedChannel.id))
}

const emit = defineEmits<{
  (e: "toggle"): void
  (e: "select", id: number): void
}>()
</script>

<template>
  <div :class="cx(FLEX_COL, 'gap-2 deposit-channel-section')">
    <DepositDialogContentTitle>{{ t("bank_column.gateway") }}</DepositDialogContentTitle>

    <BasePlainBtn
      type="button"
      :class="
        cx(FLEX_ITEMS_CENTER, 'deposit-channel-summary', props.selectedChannel && 'deposit-channel-summary--selected')
      "
      @click="
        handleGlobalClick({
          target: 'depositChannelToggle',
          callback: () => emit('toggle')
        })
      "
    >
      <template v-if="props.selectedChannel">
        <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3 min-w-0')">
          <div class="deposit-channel-summary__logo">
            <BaseImage
              :src="props.selectedChannel.imgUrl"
              :default-src="'/images/default/default.webp'"
              :class-obj="{ image: 'w-full h-full object-contain' }"
            />
          </div>
          <span class="deposit-channel-summary__name">
            {{ props.selectedChannel.name }}
          </span>
        </div>
        <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2 shrink-0')">
          <span class="deposit-channel-summary__range">
            {{ getSelectedRangeText() }}
          </span>
          <BaseIcon
            name="mdi:chevron-down"
            size="18px"
            class="deposit-channel-summary__chevron"
            :class="props.isChannelExpanded ? 'rotate-180' : ''"
          />
        </div>
      </template>

      <template v-else>
        <span class="deposit-channel-summary__placeholder">{{ t("table_header.please_select") }}</span>
        <BaseIcon
          name="mdi:chevron-down"
          size="18px"
          class="deposit-channel-summary__chevron"
          :class="props.isChannelExpanded ? 'rotate-180' : ''"
        />
      </template>
    </BasePlainBtn>

    <div v-if="props.isChannelExpanded" class="deposit-channel-list">
      <div v-if="props.channelList.length === 0 && !props.isLoadingDetail" class="py-4">
        <NoData type="empty" :class-obj="{ root: 'min-h-[120px]' }" />
      </div>
      <div v-else class="deposit-channel-grid">
        <BasePlainBtn
          v-for="channel in props.channelList"
          :key="channel.id"
          type="button"
          :class="
            cx(
              FLEX_ITEMS_CENTER,
              'deposit-channel-card',
              props.selectedGatewayId === Number(channel.id) && 'deposit-channel-card--active'
            )
          "
          @click="
            handleGlobalClick({
              target: `depositChannelSelect_${channel.id}`,
              payload: channel.id,
              callback: (id) => emit('select', Number(id))
            })
          "
        >
          <div class="deposit-channel-card__logo">
            <BaseImage
              :src="channel.imgUrl"
              :default-src="'/images/default/default.webp'"
              :class-obj="{ image: 'w-full h-full object-contain' }"
            />
          </div>
          <div :class="cx(FLEX_COL, 'min-w-0 gap-1')">
            <span class="deposit-channel-card__name">
              {{ channel.name }}
            </span>
            <span v-if="getChannelRangeText(Number(channel.id))" class="deposit-channel-card__range">
              {{ getChannelRangeText(Number(channel.id)) }}
            </span>
            <span v-if="channel.remark" class="deposit-channel-card__remark">
              {{ channel.remark }}
            </span>
          </div>
        </BasePlainBtn>
      </div>
    </div>
  </div>
</template>
