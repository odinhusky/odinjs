<template>
  <q-dialog v-model="dialogModel" persistent class="interest-dialog-wrapper">
    <div class="interest-dialog-shell">
      <q-card class="interest-description-dialog">
        <q-card-section class="dialog-header">
          <span class="w-[33.6px]"></span>
          <span class="dialog-title">{{ content?.title || $t("interest.descriptionTitle") }}</span>
          <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
        </q-card-section>
        <q-card-section class="dialog-content">
          <div v-if="content?.image_path">
            <img :src="buildImageUrl(content.image_path)" alt="Activity Image" class="description-image w-[50%]" />
          </div>
          <div v-if="content?.description" v-html="content.description" class="description-detail" />
          <div v-else class="rules-content">
            <p class="rules-title">{{ $t("interest.rule_title") }}</p>
            <p>{{ $t("interest.rule_1") }}</p>
            <p>{{ $t("interest.rule_2") }}</p>
            <p>{{ $t("interest.rule_3") }}</p>
            <p>{{ $t("interest.rule_4") }}</p>
          </div>
        </q-card-section>
        <q-card-actions class="dialog-actions">
          <q-btn class="confirm-btn" :label="$t('common.btn.confirm')" v-close-popup />
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import type * as Response from "src/api/response.type"
import { useDynamicImage } from "src/common/composables/useDynamicImage"
import { PropType } from "vue"

type DescriptionContent = Response.GetInterestActivityDescriptionContent & {
  title?: string
}

const dialogModel = defineModel<boolean>({ required: true })
const { buildImageUrl } = useDynamicImage()

defineProps({
  content: {
    type: Object as PropType<DescriptionContent | null>,
    default: null,
  },
})
</script>

<style scoped lang="scss">
@import "./interest-dialog";
</style>
