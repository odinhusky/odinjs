<template>
  <ModalBase
    v-model="modalShow"
    modal-class="modal_contact_custom"
    use-title
    :title="$t('menu.contact')"
    title-class="modal_title_top"
  >
    <div v-if="cmsContactUsList.length > 0" class="contact_wrapper">
      <div
        v-for="(cmsItem, cmsIndex) in cmsContactUsList"
        :key="cmsIndex"
        class="contact-bar cursor-pointer"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <div class="contact_wrap">
          <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="contact-img" contain />
          <div class="contact-text-wrapper">
            <span>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}：</span>
            <span>{{ cmsItem.Setting.contact_lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
          </div>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { useEntranceHandler } from "app/template/set_royalslot88/composables/useCms"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted,ref } from "vue"

import ModalBase from "./modalBase.vue"

const {
  cmsContactUsList,
} = useCms()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)

const openModal = async () => {
  modalShow.value = true
}

defineExpose({
  openModal,
})

onMounted(async () => {
  eventbus.on("openContactUs", (show: boolean) => {
    if (show) {
      openModal()
    }
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.modal_contact_custom {
  width: auto;
}

.contact-img {
  @apply max-w-[6.25rem] max-h-[6.25rem] mb-4;
  @include iphone-width {
    @apply max-w-[3.125rem] max-h-[3.125rem];
  }
}

.contact-text-wrapper {
  @apply mb-4 ml-4;
}
</style>
