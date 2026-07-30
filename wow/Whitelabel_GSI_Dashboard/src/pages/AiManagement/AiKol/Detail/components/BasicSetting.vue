<script setup lang="ts">
  import { Kol } from "src/api/response.type"

  import { ref } from "vue"

  import KolDetailDialog from "./KolDetailDialog.vue"

  const props = withDefaults(
    defineProps<{
      isCadenceShow?: boolean
      isIdShow?: boolean
      isShowGeneratePostBtn?: boolean
      isShowHardDoNot?: boolean
      list?: Kol[]
    }>(),
    {
      list: () => [],
      isIdShow: true,
      isCadenceShow: true,
      isShowHardDoNot: true,
      isShowGeneratePostBtn: false
    }
  )

  const defaultKolInfo = {
    name: "Sarah Chen",
    locale: "en_MY", // 語言地區
    timezone: "Asia/Kuala_Lumpur", // 時區
    nationality: "Malaysia", // 國籍
    // 姿勢偏好、服裝風格、場景偏好
    visual: {
      body_info: { height: 180, weight: 50, age: 20, gender: "male" },
      body_description: [],
      clothing_styles: ["casual", "street"],
      scenes_pref: ["gym", "cafe"],
      poses_pref: ["selfie", "finger-heart", "catwalk", "drinking-coffee", "jumping"]
    },
    life: {
      traits: ["extrovert", "optimistic", "creative"],
      speech_style: ["playful", "literary", "emoji"],
      catchphrases: []
    },
    // 文案語調、照片主題
    content_style: {
      caption_tones: ["sweet", "cool"],
      photo_topics: ["selfie", "food", "pet", "cafe"]
    }
  }

  const kolInfo = ref<any>({})

  const selected = ref<number>(0)

  const dialogVisible = ref(false)

  const changeSelected = (step: number) => {
    const len = props.list.length
    if (len === 0) return

    let next = selected.value + step

    if (next < 0) {
      next = 0
    } else if (next >= len) {
      next = len - 1
    }

    selected.value = next
    kolInfo.value = props.list ? props.list[selected.value] : defaultKolInfo
  }

  const openDialog = (i: number) => {
    selected.value = i
    kolInfo.value = props.list ? props.list[i] : defaultKolInfo
    dialogVisible.value = true
  }

  defineExpose({
    openDialog
  })
</script>

<template>
  <div class="w-full flex-1">
    <div class="flex flex-col gap-2">
      <section class="w-full">
        <div class="grid grid-cols-5 gap-5">
          <div v-for="(item, i) in props.list" :key="i" class="border- cursor-pointer" @click="openDialog(i)">
            <div class="relative overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg">
              <q-img
                :src="item.preview_image_url"
                loading="lazy"
                class="aspect-square w-full rounded-[.625rem] border-[1px] border-gray-400 object-cover shadow-lg"
              >
              </q-img>
              <div
                class="absolute bottom-[1px] left-0 flex w-full flex-col items-center gap-1 rounded-b-xl bg-gradient-to-b from-black/10 to-black/90 py-2 font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white"
              >
                <p v-if="props.isIdShow">ID: {{ item.id }}</p>
                <p>{{ item.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <KolDetailDialog
      :is-id-show="isIdShow"
      :kol-info="kolInfo"
      v-model:visible="dialogVisible"
      :is-cadence-show="isCadenceShow"
      :is-show-hard-do-not="isShowHardDoNot"
      :is-show-generate-post-btn="isShowGeneratePostBtn"
      :selected="selected"
      :max-length="props.list.length"
      @change-selected="changeSelected"
    />
  </div>
</template>
<style lang="scss" scoped></style>
