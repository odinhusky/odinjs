<template>
  <div class="dialog-overlay" role="dialog" aria-modal="true" @click.self="emitClose">
    <div class="dialog-container">
      <header :class="cx('dialog-header', getClass('header'))">
        <span :class="cx('dialog-title', getClass('dialogTitle'))">{{ t("menu.announcement") }}</span>

        <!-- 下面的 svg 的寫法在 STG 打包的時候 path 的 d 會被改寫，造成顯示不出來的問題 -->
        <q-icon
          name="close"
          size="20px"
          class="cursor-pointer"
          :class="cx('text-[var(--dialog-text-02)]', getClass('closeIconBtn'))"
          @click="emitClose"
        />
        <!-- <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="cx('cursor-pointer', getClass('closeIconBtn'))"
          @click="emitClose"
        >
          <path
            d="M10 11.2776L5.52852 15.749C5.36122 15.9163 5.14829 16 4.88973 16C4.63118 16 4.41825 15.9163 4.25095 15.749C4.08365 15.5817 4 15.3688 4 15.1103C4 14.8517 4.08365 14.6388 4.25095 14.4715L8.72243 10L4.25095 5.52852C4.08365 5.36122 4 5.14829 4 4.88973C4 4.63118 4.08365 4.41825 4.25095 4.25095C4.41825 4.08365 4.63118 4 4.88973 4C5.14829 4 5.36122 4.08365 5.52852 4.25095L10 8.72243L14.4715 4.25095C14.6388 4.08365 14.8517 4 15.1103 4C15.3688 4 15.5817 4.08365 15.749 4.25095C15.9163 4.41825 16 4.63118 16 4.88973C16 5.14829 15.9163 5.36122 15.749 5.52852L11.2776 10L15.749 14.4715C15.9163 14.6388 16 14.8517 16 15.1103C16 15.3688 15.9163 15.5817 15.749 15.749C15.5817 15.9163 15.3688 16 15.1103 16C14.8517 16 14.6388 15.9163 14.4715 15.749L10 11.2776Z"
            :class="cx('fill-[var(--dialog-text-02)]', getClass('closeIconBtn'))"
          />
        </svg> -->
      </header>

      <div :class="cx('dialog-body', getClass('bodyContent'))">
        <div class="body-content">
          <div class="announcement-detail" v-if="props.announcement">
            <h3 :class="cx('detail-title', getClass('detailTitle'))">{{ props.announcement.langDetail?.title }}</h3>
            <div
              :class="cx('detail-body', getClass('detailBody'))"
              v-html="props.announcement.langDetail?.content"
            ></div>
          </div>
          <div v-else :class="cx('announcement-empty', getClass('emptyAnnouncement'))">
            {{ t("announcement.empty") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import type * as Response from "src/api/response.type"
import get from "lodash/get"
import type { NestedStyle } from "src/common/components/Announcement/types/announcementTypes"
import { cx } from "app/src/common/utils/cx"

type Props = {
  announcement: Response.Announcement | null
  singleContentStyleClass?: NestedStyle
}

const props = withDefaults(defineProps<Props>(), {
  announcement: null,
  singleContentStyleClass: () => ({
    header: "",
    bodyContent: "",
    closeIconBtn: "",
    detailTitle: "",
    detailBody: ""
  })
})

// 取得外部傳來的樣式 class
const getClass = (key: string) => get(props.singleContentStyleClass, key, "")

const emit = defineEmits<{
  (event: "close"): void
}>()

const { t } = useI18n()

function emitClose() {
  emit("close")
}
</script>

<style scoped lang="scss">
.dialog-overlay {
  @apply fixed inset-0 flex items-center justify-center px-[1rem] py-[3.125rem] z-[5001] bg-[var(--bg-17)];
}

.dialog-container {
  @apply flex  flex-col w-full max-w-[41.25rem]  overflow-hidden rounded-[1.5rem];
  @apply h-[36.25rem] phone:h-[80%];
}

.dialog-header {
  @apply flex items-center justify-between py-4 px-5 bg-[var(--dialog-bg)];

  .dialog-title {
    @apply text-[1.25rem] leading-[1.6875rem] font-bold font-[NotoSans] text-[var(--dialog-text-02)];
  }
}

.dialog-body {
  @apply w-full h-full min-h-0;
  @apply flex phone:flex-col break-words;
}

.body-content {
  @apply flex flex-col flex-1 min-h-0  min-w-0;
  @apply phone:w-full;
  @apply h-full phone:h-auto;
}

.announcement-detail {
  @apply flex-1 p-5 flex flex-col gap-5 min-h-0 overflow-y-auto bg-[var(--bg-04)];

  .detail-title {
    @apply text-[1rem] leading-[1.125rem] font-bold text-center text-[var(--text-01)];
  }

  .detail-body {
    @apply text-sm text-[var(--text-01)];
  }
}

.announcement-empty {
  @apply flex flex-1 items-center justify-center p-5 text-base leading-[1.125rem] font-bold bg-[var(--bg-04)] text-[var(--text-01)];
}
</style>
