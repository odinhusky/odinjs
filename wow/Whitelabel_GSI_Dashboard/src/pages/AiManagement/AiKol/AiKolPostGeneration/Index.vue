<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper p-5">
      <q-form>
        <q-card-section class="q-pa-none">
          <div class="items-center mb-5">
            <div class="text-sm mb-1.5 flex items-center gap-1.5">
              {{ $t("ai_kol.select_one_KOL") }}
              <div class="rounded-full bg-[#F56C6C] w-1.5 h-1.5" />
            </div>
            <div class="w-full row items-center no-wrap">
              <q-select
                v-model="kolSendData.kol_id"
                :options="kolsData"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                class="w-full kol-select"
              >
                <template #selected>
                  <div v-if="kolSendData.kol_id" class="row items-center no-wrap q-gutter-sm">
                    <q-avatar size="32px">
                      <img :src="getSelectedKolImage()" :alt="getSelectedKolLabel()" @error="handleImageError" />
                    </q-avatar>
                    <span>{{ getSelectedKolLabel() }}</span>
                  </div>
                  <span v-else class="text-grey-6">{{ $t("table_header.please_select") }}</span>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps" class="kol-option-item">
                    <q-item-section avatar>
                      <q-avatar size="40px">
                        <img
                          :src="scope.opt.image || addAvatarDefault()"
                          :alt="scope.opt.label"
                          @error="handleImageError"
                        />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <div class="row bg-[#EFF7FF] p-5 rounded-[10px]">
            <div class="w-full grid grid-cols-2 gap-5">
              <div class="flex gap-2.5 items-center justify-center">
                <div class="text-[18px] font-bold text-[#535252]">{{ $t("edit_form.background") }}</div>
                <div class="flex flex-nowrap w-full gap-2.5 h-[14.25rem]">
                  <div class="flex-1">
                    <q-input
                      v-model="kolSendData.background.prompt"
                      outlined
                      type="textarea"
                      :placeholder="$t('edit_form.please_enter_background_prompt')"
                      class="textarea-fixed !pb-0"
                      maxlength="200"
                      counter
                    />
                  </div>
                  <div class="w-[12.5rem] flex-2 rounded-s overflow-hidden relative">
                    <PreviewImage
                      :parentImage="kolSendData.background.reference_image_url"
                      :defaultImage="aiKolPost()"
                      :aspectRatio="''"
                      @update:imgFile="(val) => setImage('background', val)"
                      :maxFileSize="52428800"
                    />
                    <div v-if="kolSendData.background.reference_image_url" class="absolute top-1 right-1">
                      <q-btn size="sm" class="q-mt-xs" color="red-5" icon="delete" @click="deleteImage('background')" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-2.5 items-center justify-center">
                <div class="text-[18px] font-bold text-[#535252]">{{ $t("edit_form.pose_action") }}</div>
                <div class="flex flex-nowrap w-full gap-2.5 h-[14.25rem]">
                  <div class="flex-1">
                    <q-input
                      v-model="kolSendData.pose.prompt"
                      outlined
                      type="textarea"
                      :placeholder="$t('edit_form.please_enter_pose_prompt')"
                      class="textarea-fixed !pb-0"
                      maxlength="200"
                      counter
                    />
                  </div>
                  <div class="w-[12.5rem] flex-2 rounded-s overflow-hidden relative">
                    <PreviewImage
                      :parentImage="kolSendData.pose.reference_image_url"
                      :defaultImage="aiKolPost()"
                      :aspectRatio="''"
                      @update:imgFile="(val) => setImage('pose', val)"
                      :maxFileSize="52428800"
                    />
                    <div v-if="kolSendData.pose.reference_image_url" class="absolute top-1 right-1">
                      <q-btn size="sm" class="q-mt-xs" color="red-5" icon="delete" @click="deleteImage('pose')" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-2.5 items-center justify-center">
                <div class="text-[18px] font-bold text-[#535252]">{{ $t("edit_form.outfit") }}</div>
                <div class="flex flex-nowrap w-full gap-2.5 h-[14.25rem]">
                  <div class="flex-1">
                    <q-input
                      v-model="kolSendData.clothing.prompt"
                      outlined
                      type="textarea"
                      :placeholder="$t('edit_form.please_enter_outfit_prompt')"
                      class="textarea-fixed !pb-0"
                      maxlength="200"
                      counter
                    />
                  </div>
                  <div class="w-[12.5rem] flex-2 rounded-s overflow-hidden relative">
                    <PreviewImage
                      :parentImage="kolSendData.clothing.reference_image_url"
                      :defaultImage="aiKolPost()"
                      :aspectRatio="''"
                      @update:imgFile="(val) => setImage('clothing', val)"
                      :maxFileSize="52428800"
                    />
                    <div v-if="kolSendData.clothing.reference_image_url" class="absolute top-1 right-1">
                      <q-btn size="sm" class="q-mt-xs" color="red-5" icon="delete" @click="deleteImage('clothing')" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-2.5 items-center justify-center">
                <div class="text-[18px] font-bold text-[#535252]">{{ $t("edit_form.facial_expression") }}</div>
                <div class="flex flex-nowrap w-full gap-2.5 h-[14.25rem]">
                  <div class="flex-1">
                    <q-input
                      v-model="kolSendData.facial_expression.prompt"
                      outlined
                      type="textarea"
                      :placeholder="$t('edit_form.please_enter_expression_prompt')"
                      class="textarea-fixed !pb-0"
                      maxlength="200"
                      counter
                    />
                  </div>
                  <div class="w-[12.5rem] flex-2 rounded-s overflow-hidden relative">
                    <PreviewImage
                      :parentImage="kolSendData.facial_expression.reference_image_url"
                      :defaultImage="aiKolPost()"
                      :aspectRatio="''"
                      @update:imgFile="(val) => setImage('facial_expression', val)"
                      :maxFileSize="52428800"
                    />
                    <div v-if="kolSendData.facial_expression.reference_image_url" class="absolute top-1 right-1">
                      <q-btn
                        size="sm"
                        class="q-mt-xs"
                        color="red-5"
                        icon="delete"
                        @click="deleteImage('facial_expression')"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="mt-5 mb-20 p-0" align="center">
          <q-btn color="main-color" class="edit_btns" @click="handlerPost">
            {{ $t("ai_kol.create_post") }}
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useImage } from "@/hook/useImage"
  import { useAIKol } from "src/composables/useAIKol"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useRoute } from "vue-router"

  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const { aiKolPost, addAvatarDefault } = useImage()
  const { getMyKols, createKolPost, uploadImageToGetUrl } = useAIKol()

  export type DropdownType = {
    label: string
    value: string | number
    image: string
  }
  const kolsData = ref<DropdownType[]>([])

  const kolSendData = reactive({
    kol_id: "",
    background: {
      prompt: "",
      reference_image_url: ""
    },
    pose: {
      prompt: "",
      reference_image_url: ""
    },
    clothing: {
      prompt: "",
      reference_image_url: ""
    },
    facial_expression: {
      prompt: "",
      reference_image_url: ""
    }
  })

  const getSelectedKolImage = () => {
    const selectedKol = kolsData.value.find((kol) => kol.value === kolSendData.kol_id)
    return selectedKol?.image || addAvatarDefault()
  }

  const getSelectedKolLabel = () => {
    const selectedKol = kolsData.value.find((kol) => kol.value === kolSendData.kol_id)
    return selectedKol?.label || ""
  }

  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    // 設置默認頭像
    img.src = addAvatarDefault()
  }

  const setImage = async (field: keyof typeof kolSendData, fileData: File | undefined) => {
    if (!fileData) return

    try {
      const res = await uploadImageToGetUrl(fileData)

      if (res?.code === 0 && res?.data?.file_url) {
        ;(kolSendData[field as keyof typeof kolSendData] as any).reference_image_url = res.data.file_url
      } else if (res?.code === 413) {
        $q.notify({
          type: "negative",
          message: t("ai_kol.image_size_exceeds_limit"),
          position: "top",
          timeout: 2000
        })
      }
    } catch (error) {
      console.error("Upload image error:", error)
    }
  }

  const deleteImage = (field: keyof typeof kolSendData) => {
    ;(kolSendData[field as keyof typeof kolSendData] as any).reference_image_url = ""
  }

  const resetForm = () => {
    kolSendData.kol_id = ""
    kolSendData.background = {
      prompt: "",
      reference_image_url: ""
    }
    kolSendData.pose = {
      prompt: "",
      reference_image_url: ""
    }
    kolSendData.clothing = {
      prompt: "",
      reference_image_url: ""
    }
    kolSendData.facial_expression = {
      prompt: "",
      reference_image_url: ""
    }
  }

  const handlerPost = async () => {
    if (!kolSendData.kol_id) {
      $q.notify({
        type: "negative",
        message: t("ai_kol.select_one_KOL"),
        position: "top",
        timeout: 1000
      })
      return
    }

    const res = await createKolPost(kolSendData)
    if (res.status === "QUEUED") {
      resetForm()

      $q.notify({
        type: "positive",
        message: t("ai_kol.post_schedule_created_successfully"),
        position: "top",
        timeout: 1000
      })
    } else {
      $q.notify({
        type: "negative",
        message: t("ai_kol.post_schedule_creation_failed"),
        position: "top",
        timeout: 1000
      })
    }
  }

  const getKolListData = async () => {
    const kolList = await getMyKols()
    kolsData.value = kolList?.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
        image: item.preview_image_url
      }
    })
  }

  onMounted(async () => {
    await getKolListData()
    const queryKolId = route.query?.kol_id
    if (queryKolId) {
      kolSendData.kol_id = queryKolId as string
    }
  })
</script>

<style scoped lang="scss">
  @import "@/css/ai.scss";
  .kol-select {
    :deep(.q-field__control) {
      height: 50px !important;

      &::before {
        border-color: #e5e5e5;
      }

      .q-field__append {
        height: 50px !important;
        color: #9e9e9e;
      }
    }
  }

  .kol-option-item {
    padding: 8px 16px;
    min-height: 56px;

    :deep(.q-item__section--avatar) {
      min-width: 48px;
    }

    :deep(.q-avatar) {
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
</style>
