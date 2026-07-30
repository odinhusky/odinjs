<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn outline color="main-color" @click="openCallDialog">
            {{ $t("btn.call") }}
            <q-icon class="q-ml-xs" size="xs" name="call" />
          </q-btn>
        </div>

        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="id"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <!--語音助理-->
                <q-td key="voice_type" :props="props">
                  {{ props.row.voice_type }}
                </q-td>
                <!--電話-->
                <q-td key="to_number" :props="props">
                  {{ props.row.to_number }}
                </q-td>
                <!--撥出時間-->
                <q-td key="start_time" :props="props">
                  {{ genTimeFormat(props.row.start_time, "yyyy-MM-dd HH:mm:ss", false) }}
                </q-td>
                <!--意向標籤-->
                <q-td key="intent" :props="props">
                  {{ $t(getIntentI18nKey(props.row.intent)) }}
                </q-td>

                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini color="blue" @click="loadVoiceBotInfo(props.row)">
                    <q-icon class="q-mr-xs" size="xs" name="visibility" />
                  </q-btn>
                </q-td>
              </q-tr>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>

  <!-- 撥出彈窗 -->
  <dialog-comp v-model="callDialog" :configs="dialogConfigs.call" max-width="450px" persistent>
    <template #mainContent>
      <AIVoiceBot ref="AIVoiceBotRef" name="AIVoiceBot" :rules="[rules.required()]" v-model="voice_bot" />
      <audio ref="audioExample" :src="voice_bot?.example_voice_url" preload="metadata" />
      <q-btn
        color="main-color"
        class="full-width full-height q-mt-sm q-mb-md"
        :loading="playSpinShow"
        icon="arrow_right"
        :disable="!voice_bot?.example_voice_url"
        @click="audioExample?.play()"
        >{{ $t("btn.play") }}</q-btn
      >
      <div class="q-pa-md bg-grey-3 rounded-borders">
        <div class="col-12 row justify-between no-wrap q-gutter-xs">
          <q-select
            ref="countryCodeRef"
            class="col-3 required"
            dense
            outlined
            map-options
            emit-value
            :rules="[rules.required()]"
            v-model="countryCode"
            :options="columnCountryCode?.values"
            :label="countryCodeLabel"
          />
          <q-input
            ref="phoneNumberRef"
            class="col-9 required"
            outlined
            dense
            :rules="[rules.required()]"
            v-model="phone_number"
            :label="$t('table_header.phone_number')"
          />
        </div>
        <div class="row justify-between items-center q-mb-lg">
          <span class="line col-5"></span>
          <span class="col-2 separatorText">{{ $t("common.or") }}</span>
          <span class="line col-5"></span>
        </div>
        <div class="q-px-xl">
          <div class="row justify-between items-center">
            <div class="phone_btn" v-for="(num, index) in 9" :key="index" @click="phone_number += num">{{ num }}</div>
            <div class="phone_btn" @click="phone_number += '*'">＊</div>
            <div class="phone_btn" @click="phone_number += '0'">0</div>
            <div class="phone_btn" @click="phone_number += '#'">＃</div>
          </div>
          <div class="phone_btn q-mx-auto bg-primary" @click="call">
            <q-icon size="md" name="call" />
          </div>
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 詳情彈窗 -->
  <dialog-comp v-model="detailDialog" :configs="dialogConfigs.detail" max-width="1000px" persistent>
    <template #mainContent>
      <div class="detail_content row">
        <div class="detail_content_left col-8 row q-px-md">
          <!-- 音樂播放器 -->
          <audio
            ref="audio"
            :src="voiceBotInfo.audio_url"
            preload="metadata"
            @timeupdate="updateTime"
            @canplay="canplay"
          />
          <div id="controls" class="row items-center justify-between full-width q-mb-md">
            <q-btn :icon="isPlaying ? 'pause' : 'arrow_right'" color="primary" round @click="togglePlay"></q-btn>
            <div id="progressBar" class="col" @click="seek">
              <div id="progress" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <span class="text-primary" id="time">{{ formattedCurrentTime }} / {{ formattedDuration }}</span>
            <q-btn class="q-mr-xs" outline color="main-color" @click="downloadText">
              {{ $t("btn.download") }}
            </q-btn>
            <q-btn color="primary" :label="$t('btn.translate')">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item
                    v-for="lang in aiManagementStore.languageList.filter((l) => l.code !== voiceBotInfo.language)"
                    :key="lang.code"
                    clickable
                    v-close-popup
                    :class="{ 'bg-primary': transLangCode === lang.code, 'text-white': transLangCode === lang.code }"
                    @click="changeLanguage(lang.code)"
                  >
                    <q-item-section>{{ lang.name }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <div class="bg-grey-1 q-px-lg q-py-md full-width rounded-borders message_wrapper">
            <div
              class="row q-mb-sm"
              :class="{ 'justify-end': message.role === 'assistant', 'justify-start': message.role === 'user' }"
              v-for="(message, index) in messageList[0]"
              :key="index"
            >
              <div v-if="message.role === 'user'" class="bg-primary row items-center q-mr-sm justify-center avatar">
                <q-icon color="white" size="md" name="person" />
              </div>
              <div class="message" :class="{ 'bg-light-blue-1': message.role === 'assistant' }">
                <span>{{ message.content }}</span>
                <q-separator class="q-my-sm" v-if="transLangCode" />
                <span v-if="transLangCode">{{ messageList[1] ? messageList[1][index]?.content : "" }}</span>
              </div>
            </div>
          </div>
        </div>
        <q-separator vertical inset />
        <div class="detail_content_right col q-px-md column">
          <span class="text-weight-bold text-grey-8 q-mb-md">{{
            genTimeFormat(voiceBotInfo.start_time, "yyyy-MM-dd HH:mm:ss", false)
          }}</span>
          <div class="member_card column bg-light-blue-1 items-center q-pa-md rounded-borders">
            <div class="avatar_lg bg-primary row items-center justify-center q-mb-sm">
              <q-icon color="white" size="md" name="person" />
            </div>
            <span class="text-primary q-mb-sm">{{ voiceBotInfo.to_number }}</span>
            <div class="bg-white column items-center justify-center q-pa-sm rounded-borders full-width">
              <span class="text-grey-8 q-mb-sm">{{ $t("common.call_duration") }}</span>
              <span class="q-mb-md">{{ formatCallDuration }}</span>
              <span class="bg-grey-6 q-mb-sm full-width line"></span>
              <span class="text-grey-8 q-mb-sm self-start"
                >{{ $t("query_params.intent") }}: {{ $t(getIntentI18nKey(voiceBotInfo.intent)) }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import { useRouter } from "vue-router"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import { REWARD_TYPE, CURRENCY_TYPE } from "@/utils/constants"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getAIVoiceBotList, dialOut, getVoiceBotLanguageList } from "@/api/AIVoiceBot"
  import type { GetAIVoiceBotList } from "@/api/request.type"
  import type { VoiceBotInfoItem } from "@/api/response.type"
  import { useEnv } from "@/hook/useEnv"
  import { MEMBER_COLUMN_TYPE } from "@/utils/constants"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"
  import AIVoiceBot from "@/components/query/selects/AIVoiceBot.vue"
  import { useMember } from "@/composables/useMember"
  import { INTENT } from "@/utils/constants"
  import { useRule } from "@/hook/useRule"
  import { get } from "@/utils/request"
  import { useAiManagementStore } from "@/stores/aiManagementStore"

  const rules = useRule()
  const { columnCountryCode, handleGetMemberColumn } = useMember()

  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()

  const { t, locale } = useI18n()
  const agentCommissioStore = useAgentCommissionStore()

  const $q = useQuasar()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useIntent: true,
    customDateTimeLabelI18nKey: "query_params.creation_time",
    useTimePicker: true
  })

  const voice_bot = ref<{ voice_type: string; example_voice_url: string } | undefined>(undefined)
  const countryCode = ref("")
  const phone_number = ref("")

  const getAudio = () => {
    console.log(audio.value)
    audio.value?.play()
  }
  // 監測 audio 是否存在
  const audio = ref<HTMLAudioElement | null>(null)
  const audioExample = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)

  const formattedCurrentTime = computed(() => {
    return formatTime(currentTime.value)
  })
  const formattedDuration = computed(() => {
    return formatTime(duration.value)
  })
  const progressPercentage = computed(() => {
    return duration.value ? (currentTime.value / duration.value) * 100 : 0
  })
  const togglePlay = () => {
    if (isPlaying.value) {
      audio.value?.pause()
    } else {
      audio.value?.play()
    }
    isPlaying.value = !isPlaying.value
  }
  const canplay = () => {
    duration.value = audio.value?.duration ?? 0
  }
  const updateTime = () => {
    currentTime.value = audio.value?.currentTime ?? 0
    duration.value = audio.value?.duration ?? 0
    if (currentTime.value === duration.value) {
      isPlaying.value = false
    }
  }
  const seek = (event: MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const clickPosition = event.clientX - rect.left
    const totalWidth = rect.width
    const percentage = clickPosition / totalWidth
    if (audio.value) {
      audio.value.currentTime = percentage * duration.value
    }
  }
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const playSpinShow = ref(false)

  let { search, tableData, totalSize } = useSearch(getAIVoiceBotList)
  const { genTimeFormat } = useCommon()

  const countryCodeLabel = computed(() => {
    // 若 columnCountryCode 或 lang 尚未載入，回傳空字串
    if (!columnCountryCode.value?.lang) return ""
    // 只允許特定 key
    return columnCountryCode.value.lang[locale.value as keyof typeof columnCountryCode.value.lang] ?? ""
  })

  async function onSubmit(queryForm: GetAIVoiceBotList) {
    await search(queryForm)
  }

  // 使用 computed 將 voiceBotInfo.call_duration 轉換為 m 和 s
  const formatCallDuration = computed(() => {
    const seconds = Number(voiceBotInfo.value.call_duration)
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes || ""} ${minutes ? "m" : ""} ${secs || ""} ${secs ? "s" : ""}`
  })

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "voice_type",
      label: t("table_header.voice_bot_name"),
      field: "voice_type",
      sortable: false,
      align: "center"
    },
    {
      name: "to_number",
      label: t("table_header.phone_number"),
      field: "to_number",
      sortable: false,
      align: "center"
    },

    {
      name: "start_time",
      label: t("table_header.dial_out_time"),
      field: "start_time",
      sortable: false,
      align: "center"
    },
    {
      name: "intent",
      label: t("table_header.intent"),
      field: "intent",
      sortable: false,
      align: "center"
    },
    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    call: {
      dialogLabelI18nKey: "common.call",
      showLabelCloseBtn: true,
      type: DialogType.VIEW
    },
    detail: {
      dialogLabelI18nKey: "common.call_details",
      showLabelCloseBtn: true,
      type: DialogType.VIEW
    }
  })

  const { dialog: callDialog, openDialog: openCallDialog, closeDialog: closeCallDialog } = useDialog()

  const { dialog: detailDialog, openDialog: openDetailDialog, closeDialog: closeDetailDialog } = useDialog()

  const voiceBotInfo = ref<VoiceBotInfoItem>({
    voice_type: "",
    language: "",
    audio_url: "",
    text_url: {} as { [key: string]: string },
    to_number: "",
    call_id: "",
    start_time: "",
    end_time: "",
    call_duration: "",
    intent: ""
  })
  const messageList = ref<
    {
      role: string
      content: string
    }[][]
  >([])

  const aiManagementStore = useAiManagementStore()
  const transLangCode = ref("")

  const loadVoiceBotInfo = async (row: VoiceBotInfoItem) => {
    messageList.value = []
    transLangCode.value = ""
    voiceBotInfo.value = {
      voice_type: row.voice_type,
      language: row.language,
      audio_url: row.audio_url,
      text_url: row.text_url,
      to_number: row.to_number,
      call_id: row.call_id,
      start_time: row.start_time,
      end_time: row.end_time,
      call_duration: row.call_duration,
      intent: row.intent
    }
    duration.value = 0
    currentTime.value = 0
    // 取得此 url 的 json 檔
    const response = await fetch(row.text_url[row.language])
    const data = await response.json()
    messageList.value.push(
      data.map((item: any) => ({
        role: item.role,
        content: item.content
      }))
    )
    openDetailDialog()
  }

  const downloadText = async () => {
    const textUrl = transLangCode.value
      ? voiceBotInfo.value.text_url[transLangCode.value]
      : voiceBotInfo.value.text_url[voiceBotInfo.value.language]
    if (textUrl) {
      window.open(textUrl, "_blank")
    }
  }

  function getIntentI18nKey(status: string | number): string {
    return INTENT.I18nKeys[status as keyof typeof INTENT.I18nKeys] || "common.unknow"
  }

  const countryCodeRef = ref<{ validate: () => void; hasError: boolean } | null>(null)
  const phoneNumberRef = ref<{ validate: () => void; hasError: boolean } | null>(null)
  const AIVoiceBotRef = ref<{ validate: () => void; hasError: boolean } | null>(null)

  const call = async () => {
    console.log(countryCode.value)
    AIVoiceBotRef.value?.validate()
    countryCodeRef.value?.validate()
    phoneNumberRef.value?.validate()

    if (AIVoiceBotRef.value?.hasError || countryCodeRef.value?.hasError || phoneNumberRef.value?.hasError) {
      return $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.validate.verificationError"),
        position: "top"
      })
    }
    const response = await dialOut({
      voice_type: voice_bot?.value?.voice_type || "",
      to_number: countryCode.value + phone_number.value
    })
    console.log(response)
    if (response?.code === 0) {
      $q.notify({
        color: "green-5",
        textColor: "white",
        icon: "check",
        message: t("common.call_success"),
        position: "top"
      })
      voice_bot.value = undefined
      countryCode.value = ""
      phone_number.value = ""
      closeCallDialog()
    } else {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.call_failed"),
        position: "top"
      })
    }
  }

  const changeLanguage = async (langCode: string) => {
    transLangCode.value = transLangCode.value !== langCode ? langCode : ""
    if (!transLangCode.value) {
      messageList.value[1] = []
    } else if (transLangCode.value && voiceBotInfo.value.text_url[transLangCode.value]) {
      const response = await fetch(voiceBotInfo.value.text_url[transLangCode.value])
      const data = await response.json()
      messageList.value[1] = data.map((item: any) => ({
        role: item.role,
        content: item.content
      }))
    }
  }

  onMounted(async () => {
    await handleGetMemberColumn(MEMBER_COLUMN_TYPE.Enums.REGISTER)
    await aiManagementStore.getLanguageList()
  })
</script>
<style lang="scss" scoped>
  .required {
    :deep(.q-field__label) {
      &:after {
        content: " *";
        color: red;
      }
    }
  }

  .line {
    height: 1px;
    background-color: #595959;
  }

  .separatorText {
    text-align: center;
    color: #595959;
  }

  .phone_btn {
    font-size: 30px;
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    text-align: center;
    line-height: 80px;
    margin-bottom: 10px;
    user-select: none;
    cursor: pointer;
  }

  #progressBar {
    // width: 50%;
    margin-left: 8px;
    margin-right: 8px;
    height: 10px;
    background: #aaaaaa;
    cursor: pointer;
    border-radius: 5px;
  }
  #progress {
    height: 100%;
    background: #6332c4;
    width: 0;
    border-radius: 5px;
  }
  #controls {
    display: flex;
    align-items: center;
  }
  #time {
    margin: 0 10px;
  }

  .message_wrapper {
    height: 600px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 7px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #086eff;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background-color: #aaaaaa;
      border-radius: 10px;
    }
  }

  .message {
    font-size: 14px;
    color: #333333;
    background: #ebebeb;
    width: 400px;
    padding: 20px;
    border-radius: 10px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .avatar_lg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .table-container {
    padding: 1rem;
    border-radius: 10px 10px 0 0;
    background-color: #fff;
  }
</style>
