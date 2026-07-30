<template>
  <SubPage :action-label-i18n-key="message" class="q-pt-xs" :custom-back-func="onBackTo" />
  <div class="q-pa-md q-pt-sm" style="padding-top: 0">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12 q-pb-lg">
        <div class="table-white-bg">
          <p class="text-subtitle2">{{ $t("table_header.kol_analysis") }}({{ analysis_info.kol.account }})</p>
          <q-markup-table square separator="none" class="q-mt-md">
            <thead>
              <tr>
                <th>{{ $t("table_header.account") }}</th>
                <th>{{ $t("table_header.followers_count") }}</th>
                <th>{{ $t("table_header.posts_count") }}</th>
                <th>{{ $t("table_header.reach") }}</th>
                <th>{{ $t("table_header.impressions") }}</th>
                <th>{{ $t("table_header.engagement_rate") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ analysis_info.kol.account }}</td>
                <td>{{ moneyFormat(analysis_info.kol.following) }}</td>
                <td>{{ moneyFormat(analysis_info.kol.posts) }}</td>
                <td>{{ moneyFormat(analysis_info.reach_count) }}</td>
                <td>{{ moneyFormat(analysis_info.impression) }}</td>
                <td>{{ analysis_info.engagement_rate }}%</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
      <div class="col-12 col-md-12 q-pb-lg">
        <div class="table-white-bg">
          <p class="text-subtitle2">
            {{ $t("table_header.post_performance_analysis") }}({{ analysis_info.kol.account }})
          </p>
          <q-markup-table square separator="none" class="q-mt-md">
            <thead>
              <tr>
                <th>{{ $t("table_header.date") }}</th>
                <th>{{ $t("table_header.post_likes") }}</th>
                <th>{{ $t("table_header.number_of_comments") }}</th>
                <th>{{ $t("table_header.reach") }}</th>
                <th>{{ $t("table_header.operate") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, keys) in posts" :key="keys">
                <td>{{ parseDate(item.date) }}</td>
                <td>{{ moneyFormat(item.like_count) }}</td>
                <td>{{ moneyFormat(item.comment_count) }}</td>
                <td>{{ moneyFormat(item.reach_count) }}</td>
                <td>
                  <q-btn flat fab-mini color="blue cursor-pointer" @click="onView(item.url)">
                    {{ $t("btn.view_post") }} </q-btn
                  ><!--<q-btn flat fab-mini color="red cursor-pointer" @click="onDelete(item.post_id)">
                  {{ $t("btn.delete_post") }}
                </q-btn>-->
                </td>
              </tr>
            </tbody>
            <!-- 查無資料 -->
            <template v-if="!posts.length">
              <tr>
                <td colspan="5" class="text-center">{{ $t("common.no_data") }}</td>
              </tr>
              <!-- <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div> -->
            </template>
          </q-markup-table>
        </div>
      </div>
      <div class="col-12 col-md-12 q-pb-lg">
        <div class="table-white-bg">
          <p class="text-subtitle2">{{ $t("table_header.kol_message_center") }}({{ analysis_info.kol.account }})</p>
          <q-markup-table square separator="none" class="q-mt-md">
            <thead>
              <tr>
                <th>{{ $t("table_header.follower_account") }}</th>
                <th>{{ $t("table_header.ai_replies") }}</th>
                <th>{{ $t("table_header.follower_messages") }}</th>
                <th>{{ $t("table_header.chat_bot_cost") }}</th>
                <th>{{ $t("table_header.operate") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, keys) in chats" :key="keys">
                <td>{{ item.username }}</td>
                <td>{{ moneyFormat(item.kol_message_count) }}</td>
                <td>{{ moneyFormat(item.user_message_count) }}</td>
                <td>US {{ moneyFormat(item.cost) }}</td>
                <td>
                  <q-btn flat fab-mini color="blue cursor-pointer" @click="onChat(item)">
                    {{ $t("btn.message_details") }}
                    <span v-if="item.status === 'unread'" style="color: red" class="q-ml-sm">(NEW)</span>
                  </q-btn>
                </td>
              </tr>
            </tbody>
            <!-- 查無資料 -->
            <template v-if="!chats.length">
              <tr>
                <td colspan="5" class="text-center">{{ $t("common.no_data") }}</td>
              </tr>
              <!-- <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div> -->
            </template>
          </q-markup-table>
        </div>
      </div>
    </div>
  </div>
  <dialog-comp
    v-model="viewDialog"
    :hide-scrolly="true"
    :configs="dialogConfigs.view"
    :loading="viewLoading"
    max-width="62.5rem"
  >
    <template #label>
      <div class="bold h4-bold grey" style="height: 62px; padding: 20px">{{ $t("btn.message_details") }}</div>
      <div style="border: 1px solid rgba(229, 229, 229, 1)"></div>
    </template>
    <template #mainContent>
      <q-page class="row q-pa-md" style="height: 655px; max-height: 778px; min-height: 655px">
        <div class="col-8 q-pr-md">
          <q-scroll-area
            ref="scrollAreaRef"
            :thumb-style="thumbStyle"
            class="q-pa-sm bg-grey-2"
            style="height: 100%; border-radius: 8px"
          >
            <div class="q-mb-md" ref="chatScrollInner">
              <q-chat-message
                v-for="message in chatMessages"
                :text="[message.content]"
                :sent="message.sender_type === 'user'"
                :received="message.sender_type === 'kol'"
                :avatar="message.sender_type === 'kol' ? memberAvatar : undefined"
                :bg-color="message.sender_type === 'kol' ? 'grey-4' : 'blue-1'"
              />
            </div>
          </q-scroll-area>
        </div>

        <div class="col-4" style="border-left: 1px solid #ccc; padding-left: 16px">
          <!--<div
            class="text-caption q-mb-sm items-center"
            style="font-size: 14px; color: gray; display: flex; justify-content: center"
          >
            2025-05-05 12:45
          </div>-->
          <q-card
            class="q-pa-md items-center text-center"
            style="width: 100%; background-color: rgba(239, 247, 255, 1); box-shadow: none"
          >
            <q-avatar size="64px" class="q-mx-auto q-mb-sm" rounded>
              <img src="~assets/images/common/member.webp" />
            </q-avatar>
            <div class="h7-bold" style="color: rgba(8, 110, 255, 1)">
              {{ dialogData.view.follower_account }}
            </div>
          </q-card>
          <q-card
            class="q-mt-md q-pa-sm"
            style="border: 1px solid #b3e5fc; background-color: white; border-radius: 8px; box-shadow: none"
          >
            <div class="q-pa-sm">
              <div class="text-body2 q-mb-xs">
                {{ $t("table_header.total_messages") }}：{{ dialogData.view.total_message_count }}
              </div>
              <div class="text-body2 q-mb-xs">
                {{ $t("table_header.ai_replies") }}：{{ dialogData.view.kol_message_count }}
              </div>
              <div class="text-body2 q-mb-xs">
                {{ $t("table_header.follower_messages") }}：{{ dialogData.view.user_message_count }}
              </div>
              <div class="text-body2">{{ $t("table_header.chat_bot_cost") }}：US {{ dialogData.view.cost }}</div>
            </div>
          </q-card>
        </div>
      </q-page>
    </template>
  </dialog-comp>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("table_header.delete_post") }}</div>
    </template>
  </dialog-comp>

  <!-- 依老闆需求，檢視貼文改以右下角滑出的 iframe 區塊顯示 -->
  <Transition name="iframe-slide">
    <div v-if="showIframePanel" class="iframe-slide-panel">
      <div class="iframe-panel-header">
        <span class="iframe-panel-title">{{ $t("btn.view_post") }}</span>
        <q-btn flat round dense icon="close" @click="closeIframePanel" class="iframe-panel-close" />
      </div>
      <div class="iframe-panel-content">
        <!-- Instagram 嵌入 -->
        <div v-if="isInstagramPost" class="instagram-embed-wrapper">
          <blockquote
            class="instagram-media"
            :data-instgrm-permalink="iframeUrl"
            data-instgrm-version="14"
            ref="instagramEmbed"
          >
            <div class="loading-placeholder">
              <q-spinner-dots size="40px" color="primary" />
              <p>{{ $t("common.instagram_onload") }}</p>
            </div>
          </blockquote>
        </div>
        <!-- 其他網站使用 iframe -->
        <iframe v-else-if="iframeUrl" :src="iframeUrl" frameborder="0" class="iframe-content" allowfullscreen></iframe>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
  import type * as Response from "@/api/response.type"
  import { onMounted, ref, reactive, computed, nextTick, onUnmounted } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { getKolDetail, deleteKolPost, updateKolNewStatu } from "@/api/ai"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { usePermission } from "@/hook/usePermission"
  import memberAvatar from "@/assets/images/common/member.webp"
  const { t } = useI18n()
  const { moneyFormat, parseDate } = useCommon()
  const router = useRouter()
  const route = useRoute()

  const $q = useQuasar()

  const { permission } = usePermission()

  const isLoading = ref(false)
  const showIframePanel = ref(false)
  const iframeUrl = ref("")
  const isInstagramPost = computed(() => {
    return iframeUrl.value.includes("instagram.com")
  })
  const instagramEmbed = ref(null)
  const thumbStyle = {
    right: "0px",
    borderRadius: "5px",
    backgroundColor: "#6332C4",
    width: "5px",
    opacity: 1
  }
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    view: {
      type: DialogType.VIEW,
      useActions: false
    },
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRemove
    }
  })

  const dialogData = reactive<{
    remove: {
      id?: number
    }
    view: {
      chatData: any[]
      follower_account: string
      total_message_count: number | string
      kol_message_count: number | string
      user_message_count: number | string
      cost: number | string
    }
  }>({
    remove: { id: 0 },
    view: {
      chatData: [],
      follower_account: "",
      total_message_count: 0,
      kol_message_count: 0,
      user_message_count: 0,
      cost: 0
    }
  })

  const analysis_info = ref<Response.AiKolAnalysisInfo["analysis_info"]>({
    kol: {
      account: "",
      followers: 0,
      following: 0,
      posts: 0
    },
    reach_count: 0,
    impression: 0,
    engagement_rate: 0
  })
  const posts = ref<Response.AiKolAnalysisInfo["posts"]>([])
  const chats = ref<Response.AiKolAnalysisInfo["chats"]["individual"]>([])
  const chatMessages = ref<Response.AiKolAnalysisInfo["message"]>([])

  const message = computed(() => {
    return analysis_info.value.kol.account
  })

  let tiimer: any

  onMounted(async () => {
    getDetail()
    tiimer = setInterval(getDetail, 5000)
  })

  onUnmounted(() => {
    clearInterval(tiimer)
  })
  function onBackTo() {
    router.push({
      name: "AiKolOverview"
    })
  }
  const scrollAreaRef = ref(null)
  let kolId = ref("")

  async function getDetail() {
    const id = route.params.id as string
    const res = await getKolDetail(id)
    if (res.code === 0) {
      analysis_info.value = res.data.analysis_info
      posts.value = res.data.posts
      chats.value = res.data.chats.individual
      /* await nextTick()
      setTimeout(() => {
        if (scrollAreaRef.value) {
          scrollAreaRef.value.setScrollPosition("vertical", 9999)
        }
      }, 300)*/
      if (kolId.value !== "") {
        const result: any = chats.value.find((item: any) => item.id === kolId.value)
        const kolRoles = new Set(["KOL"])
        chatMessages.value = result.chat.map((item: { role: string }) => ({
          ...item,
          sender_type: kolRoles.has(item.role) ? "kol" : "user"
        }))
        dialogData.view.follower_account = result.username
        dialogData.view.kol_message_count = moneyFormat(result.kol_message_count)
        dialogData.view.user_message_count = moneyFormat(result.user_message_count)
        dialogData.view.cost = moneyFormat(result.cost)
        dialogData.view.total_message_count = moneyFormat(result.total_message_count)
      }
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }

  async function onView(url: string) {
    // const res = await getKolPost(id)
    // if (res.code === 0) {
    //   popup.location.href = res.data.post_url
    // } else {
    //   if (popup) {
    //     popup.close()
    //   }
    //   $q.notify({
    //     type: "negative",
    //     message: res.msg,
    //     position: "top",
    //     timeout: 1000
    //   })
    // }
    iframeUrl.value = url
    showIframePanel.value = true

    // 如果是 Instagram 貼文，載入嵌入腳本
    if (url.includes("instagram.com")) {
      await loadInstagramEmbedScript()
    }
  }

  function closeIframePanel() {
    showIframePanel.value = false
    iframeUrl.value = ""
  }

  // 載入 Instagram 嵌入腳本
  async function loadInstagramEmbedScript() {
    return new Promise((resolve) => {
      // 檢查是否已經載入過腳本
      if (window.instgrm) {
        // 如果已經載入，重新處理嵌入
        setTimeout(() => {
          window.instgrm?.Embeds.process()
          resolve(true)
        }, 100)
        return
      }

      // 如果腳本還沒載入，創建並載入
      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]')
      if (!existingScript) {
        const script = document.createElement("script")
        script.src = "https://www.instagram.com/embed.js"
        script.async = true
        script.onload = () => {
          setTimeout(() => {
            if (window.instgrm) {
              window.instgrm.Embeds.process()
            }
            resolve(true)
          }, 100)
        }
        document.head.appendChild(script)
      } else {
        resolve(true)
      }
    })
  }
  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading,
    closeDialog: closeRemove
  } = useDialog()

  function onDelete(id: number) {
    dialogData.remove.id = id
    openRemoveDialog(id)
  }
  async function handleRemove() {
    openRemoveLoading()

    const res = await deleteKolPost(dialogData.remove.id!)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      closeRemoveLoading()
      closeRemove()
      getDetail()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }
  const { dialog: viewDialog, openDialog: openViewDialog, loading: viewLoading } = useDialog()

  async function onChat(item: any) {
    kolId.value = item.id
    const kolRoles = new Set(["KOL"])
    chatMessages.value = item.chat.map((item: { role: string }) => ({
      ...item,
      sender_type: kolRoles.has(item.role) ? "kol" : "user"
    }))
    dialogData.view.follower_account = item.username
    dialogData.view.kol_message_count = moneyFormat(item.kol_message_count)
    dialogData.view.user_message_count = moneyFormat(item.user_message_count)
    dialogData.view.cost = moneyFormat(item.cost)
    dialogData.view.total_message_count = moneyFormat(item.total_message_count)
    openViewDialog()

    await nextTick()
    setTimeout(() => {
      if (scrollAreaRef.value) {
        scrollAreaRef.value.setScrollPosition("vertical", 9999)
      }
    }, 300)

    const res = await updateKolNewStatu(item.id)
    if (res.code === 0) {
      getDetail()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }

    /*const res = await getKolMessage(item.chat_id)
      if (res.code === 0) {
        chatMessages.value = res.data.messages

        openViewDialog()
      } else {
        $q.notify({
          type: "negative",
          message: res.msg,
          position: "top",
          timeout: 1000
        })
      }*/
  }
</script>

<style scoped>
  @import "@/css/ai.scss";

  .iframe-slide-panel {
    position: fixed;
    bottom: 1.25rem;
    right: 2.5rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    overflow: hidden;
    border: 1px solid #e0e0e0;
  }

  /* Vue Transition 動畫 */
  .iframe-slide-enter-active,
  .iframe-slide-leave-active {
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .iframe-slide-enter-from {
    transform: translateY(100%);
  }

  .iframe-slide-enter-to {
    transform: translateY(0);
  }

  .iframe-slide-leave-from {
    transform: translateY(0);
  }

  .iframe-slide-leave-to {
    transform: translateY(100%);
  }

  .iframe-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    min-height: 48px;
  }

  .iframe-panel-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .iframe-panel-close {
    color: #666;
  }

  .iframe-panel-close:hover {
    background-color: #e0e0e0;
  }

  .iframe-panel-content {
    height: calc(100% - 48px);
    width: 100%;
    overflow-y: auto;
  }

  .iframe-content {
    width: 100%;
    height: 100%;
    border: none;
  }

  .instagram-embed-wrapper {
    height: 100%;
    padding: 16px;
    overflow-y: auto;
  }

  .instagram-embed-wrapper .instagram-media {
    margin: 0 auto !important;
    max-width: 100% !important;
  }

  .loading-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #666;
  }

  .loading-placeholder p {
    margin-top: 12px;
    font-size: 14px;
  }
</style>
