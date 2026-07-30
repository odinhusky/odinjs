<template>
  <dialog-comp v-model="addDialog" :configs="dialogConfigs.add" width="500px">
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">
            {{ $t(`${dialogData.add.type === "add" ? "btn.add_times" : "btn.remove_times"}`) }}
          </div>
          <div class="q-pt-md">
            {{
              `${$t("query_params.issue")}：${genTimeFormat(currentIssue.start_time, "yyyy-MM-dd HH:mm:ss") || "-"} ~ ${
                genTimeFormat(currentIssue.end_time, "yyyy-MM-dd HH:mm:ss") || "-"
              }`
            }}
          </div>
        </div>

        <!--會員帳號-->
        <div class="col-12">
          <q-select
            v-model="dialogData.add.id"
            :options="accountOption"
            use-input
            emit-value
            map-options
            hide-selected
            fill-input
            input-debounce="600"
            @filter="filterAccount"
            @input-value="setAccount"
            @update:model-value="getMemberInfo('add')"
            :label="`* ${$t('query_params.member_account')}`"
            outlined
          />
        </div>

        <div class="col-12" v-if="dialogMemberData[0].id !== 0">
          {{ `${$t("common.current_times")}：` }}{{ currentIssue.max_spin_count - currentIssue.used_spin_count }}
        </div>

        <!-- 調整次數 -->
        <div class="col-12">
          <q-input
            v-model.trim="dialogData.add.spin_count"
            type="number"
            :min="1"
            class=""
            outlined
            :label="`* ${$t('edit_form.adjustment_times')}`"
          />
        </div>

        <!-- 備註 -->
        <div class="col-12">
          <q-input
            v-model.trim="dialogData.add.remark"
            type="textarea"
            class=""
            outlined
            :label="`${$t('table_header.remark')}`"
            rows="3"
          />
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { QTableProps } from "quasar"
  import { reactive, onMounted, onUnmounted, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { getMemberDetail } from "@/api/giftDetail"
  import { getMemberQuotaMemberSearch, getMemberTagList } from "@/api/member"
  import { putReferralWheelMemberSpinCount, getReferralWheel, getReferralWheelMember } from "@/api/referralWheel"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  const { genTimeFormat } = useCommon()
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useQueryStore } from "@/stores/queryStore"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"

  const { t } = useI18n()
  const $q = useQuasar()
  const eventbus = injectStrict(EventBusKey)

  const store = useQueryStore()
  const currentIssue = ref({
    id: 0,
    start_time: "",
    end_time: "",
    max_spin_count: 0,
    used_spin_count: 0
  })

  // 获取当期期数
  // const getCurrentIssue = async () => {
  //   try {
  //     const now = new Date().getTime()
  //     const params = {
  //       start: now
  //     }
  //     console.log("params", params)
  //     const res = await getReferralWheel(params)
  //     if (res?.data) {
  //       currentIssue.value = {
  //         id: res.data.id,
  //         start_time: res.data.start_time,
  //         end_time: res.data.end_time
  //       }
  //     }
  //   } catch (error) {
  //     console.error("获取当期期数失败:", error)
  //   }
  // }

  onMounted(async () => {
    // 获取当期期数
    // await getCurrentIssue()

    eventbus.on("handleEditInvitationRouletteTimesShow", (data) => {
      if (data.show) {
        onEditInvitationRouletteTimes(data.type)
        return
      }
    })
  })

  onUnmounted(() => {
    eventbus.off("handleEditInvitationRouletteTimesShow")
  })

  const dialogAccountColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "member_level",
      label: t("table_header.member_level"),
      field: "member_level",
      sortable: false,
      align: "center"
    },
    {
      name: "enable",
      label: t("table_header.enable_or_disable"),
      field: "enable",
      sortable: false,
      align: "center"
    },
    {
      name: "member_tag",
      label: t("table_header.member_tag"),
      field: "member_tag",
      sortable: false,
      align: "center"
    }
  ])

  interface Tag {
    id: number
  }
  const dialogMemberData = reactive([
    {
      id: 0,
      member_level: 0,
      enable: 0,
      member_tag: [] as Tag[],
      wallets: []
    }
  ])

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    add: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleAdd
    }
  })

  const dialogData = reactive({
    add: {
      id: 0,
      spin_count: 1,
      remark: "",
      type: "" as "add" | "remove"
    }
  })

  const {
    dialog: addDialog,
    openDialog: openAddDialog,
    loading: addLoading,
    openLoading: openAddLoading,
    closeLoading: closeAddLoading,
    closeDialog: closeAddDialog
  } = useDialog()

  // 监听弹窗关闭，初始化数据
  const resetCurrentIssue = () => {
    currentIssue.value = {
      id: 0,
      start_time: "",
      end_time: "",
      max_spin_count: 0,
      used_spin_count: 0
    }
  }

  async function onEditInvitationRouletteTimes(type: "add" | "remove") {
    // 根据类型设置不同的标题和配置
    dialogData.add.type = type
    dialogData.add.id = 0
    dialogData.add.spin_count = 1
    dialogData.add.remark = ""

    //會員詳細
    dialogMemberData[0].id = 0

    // 初始化 currentIssue
    currentIssue.value = {
      id: 0,
      start_time: "",
      end_time: "",
      max_spin_count: 0,
      used_spin_count: 0
    }

    openAddDialog()
  }

  async function handleAdd() {
    const sendData = {
      spin_count:
        dialogData.add.type === "remove" ? -Math.abs(dialogData.add.spin_count) : Math.abs(dialogData.add.spin_count),
      referral_wheel_id: currentIssue.value.id,
      remark: dialogData.add.remark
    }

    if (!dialogData.add.id) {
      errorMsg("error_msg.please_select_member_account")
      return
    }

    openAddLoading()
    const res = await putReferralWheelMemberSpinCount(dialogData.add.id, sendData)

    if (res?.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      closeAddLoading()
      closeAddDialog()
      resetCurrentIssue()
      // 通知弹窗已关闭
      eventbus.emit("handleEditInvitationRouletteTimesClose", { closed: true })
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
      closeAddLoading()
    }
  }

  const errorMsg = (msg: string) => {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 2000
    })
  }

  const accountOption = ref<
    {
      label: string
      value: number
    }[]
  >([])

  // 搜尋會員
  const getMember = async (name: string) => {
    const sendData = {
      type: 1,
      account: name + "%",
      offset: 0,
      size: 100
    }

    const { data } = await getMemberQuotaMemberSearch(sendData)

    accountOption.value.length = 0

    if (!data || !Object.keys(data).length || !data.list) return

    data.list.forEach((item: any) => {
      accountOption.value.push({
        label: item.account,
        value: item.id
      } as never)
    })
  }

  const filterAccount = (val: string, update: Function, abort: Function) => {
    const needle = val.trim().toLowerCase()

    if (needle === "") {
      accountOption.value.length = 0
      return
    }

    update(() => {
      getMember(needle)
    })
  }

  const selectedMember = ref<{ label: string; value: number } | undefined>(undefined)
  const setAccount = async (value: string) => {
    selectedMember.value = accountOption.value.find((item: { label: string; value: number }) => item.label === value)
    if (selectedMember.value !== undefined) {
      const res = await getMemberDetail(selectedMember.value["value"])
      Object.assign(memberData, res.data)

      dialogMemberData[0].id = memberData.id
      dialogMemberData[0].member_level = memberData.member_level
      dialogMemberData[0].enable = memberData.enabled
      dialogMemberData[0].wallets = memberData.wallets
    }
  }

  //取得該會員的詳細
  const memberData = reactive({ id: 0, member_level: 0, enabled: 0, labels: [], wallets: [] })

  const getMemberInfo = async (mode: string) => {
    resetCurrentIssue()
    const sendData = {
      member_account: selectedMember.value?.label,
      size: "10",
      page: "1"
    }

    const res = await getReferralWheelMember(sendData)
    console.log("res", res.data.data[0])
    if (res?.data?.current_wheel) {
      currentIssue.value.id = res.data.current_wheel.id
      currentIssue.value.start_time = res.data.current_wheel.start_time
      currentIssue.value.end_time = res.data.current_wheel.end_time
      currentIssue.value.max_spin_count = res.data.data[0].max_spin_count
      currentIssue.value.used_spin_count = res.data.data[0].used_spin_count
    }
  }
</script>
