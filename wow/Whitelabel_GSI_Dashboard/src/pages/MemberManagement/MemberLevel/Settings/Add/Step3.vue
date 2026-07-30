<template>
  <!-- 目前沒有使用到 -->
  <q-card class="no-shadow bg-transparent">
    <!-- 存款方式設置 -->
    <q-card-section align="center" style="max-width: 43.75rem" class="q-mx-auto">
      <div class="col-12 col-md-6 q-mb-md">
        <div class="text-bold q-mb-md text-left">{{ $t("common.deposit_method_settings") }}</div>

        <!-- 銀行卡 -->
        <div class="col-12">
          <SelectAllOptionGroup
            :parentValue="dataModel.depositSettings.bankList"
            :group-options="bankList"
            :selectAllLabel="$t('table_header.bank_card')"
            :itemButtonStyle="true"
            @update:parentValue="handelBankCardTags"
          />
        </div>

        <!-- 電子錢包 -->
        <div class="col-12">
          <SelectAllOptionGroup
            :parentValue="dataModel.depositSettings.electronWalletList"
            :group-options="electronWalletList"
            :selectAllLabel="$t('table_header.electronic_wallet')"
            :itemButtonStyle="true"
            @update:parentValue="handelElectronicWalletTags"
          />
        </div>

        <!-- 第三方支付 -->
        <div class="col-12">
          <SelectAllOptionGroup
            :parentValue="dataModel.depositSettings.thirdPayList"
            :group-options="thirdPayList"
            :selectAllLabel="$t('table_header.third_party_payment')"
            :itemButtonStyle="true"
            @update:parentValue="handelThirdPaymentTags"
          />
        </div>
      </div>
    </q-card-section>

    <!-- 取款方式設置 -->
    <q-card-section align="center" style="max-width: 43.75rem" class="q-mx-auto">
      <div class="col-12 col-md-6 q-mb-md">
        <div class="text-bold q-mb-md text-left">{{ $t("common.withdrawal_method_settings") }}</div>

        <!-- 銀行卡 -->
        <div class="col-12">
          <SelectAllOptionGroup
            :parentValue="dataModel.withdrawSettings.bankList"
            :group-options="bankList"
            :selectAllLabel="$t('table_header.bank_card')"
            :itemButtonStyle="true"
            @update:parentValue="handelWithdrawBankCardTags"
          />
        </div>

        <!-- 電子錢包 -->
        <div class="col-12">
          <SelectAllOptionGroup
            :parentValue="dataModel.withdrawSettings.electronWalletList"
            :group-options="electronWalletList"
            :selectAllLabel="$t('table_header.electronic_wallet')"
            :itemButtonStyle="true"
            @update:parentValue="handelWithdrawElectronicWalletTags"
          />
        </div>

        <!-- 第三方支付 -->
        <div class="col-12">
          <SelectAllOptionGroup
            :parentValue="dataModel.withdrawSettings.thirdPayList"
            :group-options="thirdPayList"
            :selectAllLabel="$t('table_header.third_party_payment')"
            :itemButtonStyle="true"
            @update:parentValue="handelWithdrawThirdPaymentTags"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section align="center">
      <q-btn color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md" color="main-color" :loading="isLoading" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from "vue"
  import { useQuasar } from "quasar"
  import { storeToRefs } from "pinia"
  import { useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useStepper } from "@/hook/useStepper"
  import { useForm } from "@/hook/useForm"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { useMemberLevelStore } from "@/stores/memberLevel"
  import { addMemberLevelSettings } from "@/api/memberLevel"
  import type * as Request from "@/api/request.type"
  const memberLevelStore = useMemberLevelStore()
  const { memberLevelItem: form } = storeToRefs(memberLevelStore)
  const { convertValuesToNumber } = useForm()
  const bankList = computed(() => [
    {
      label: "銀行1",
      value: 1
    },
    {
      label: "銀行2",
      value: 2
    },
    {
      label: "銀行3",
      value: 3
    },
    {
      label: "銀行4",
      value: 4
    },
    {
      label: "銀行5",
      value: 5
    },
    {
      label: "銀行6",
      value: 6
    },
    {
      label: "銀行7",
      value: 7
    }
  ])
  const electronWalletList = computed(() => [
    {
      label: "銀行1",
      value: 1
    },
    {
      label: "銀行2",
      value: 2
    },
    {
      label: "銀行3",
      value: 3
    },
    {
      label: "銀行4",
      value: 4
    },
    {
      label: "銀行5",
      value: 5
    },
    {
      label: "銀行6",
      value: 6
    },
    {
      label: "銀行7",
      value: 7
    }
  ])
  const thirdPayList = computed(() => [
    {
      label: "銀行1",
      value: 1
    },
    {
      label: "銀行2",
      value: 2
    },
    {
      label: "銀行3",
      value: 3
    },
    {
      label: "銀行4",
      value: 4
    },
    {
      label: "銀行5",
      value: 5
    },
    {
      label: "銀行6",
      value: 6
    },
    {
      label: "銀行7",
      value: 7
    }
  ])

  const dataModel = reactive<{
    depositSettings: {
      bankList: number[]
      electronWalletList: number[]
      thirdPayList: number[]
    }
    withdrawSettings: {
      bankList: number[]
      electronWalletList: number[]
      thirdPayList: number[]
    }
  }>({
    depositSettings: {
      bankList: [],
      electronWalletList: [],
      thirdPayList: []
    },
    withdrawSettings: {
      bankList: [],
      electronWalletList: [],
      thirdPayList: []
    }
  })

  const handelBankCardTags = (value: number[]) => {
    dataModel.depositSettings.bankList = value
  }
  const handelElectronicWalletTags = (value: number[]) => {
    dataModel.depositSettings.electronWalletList = value
  }
  const handelThirdPaymentTags = (value: number[]) => {
    dataModel.depositSettings.thirdPayList = value
  }
  const handelWithdrawBankCardTags = (value: number[]) => {
    dataModel.withdrawSettings.bankList = value
  }
  const handelWithdrawElectronicWalletTags = (value: number[]) => {
    dataModel.withdrawSettings.electronWalletList = value
  }
  const handelWithdrawThirdPaymentTags = (value: number[]) => {
    dataModel.withdrawSettings.thirdPayList = value
  }

  const { nextPrevStep } = useStepper()

  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()

  onMounted(() => {
    console.log("step3")
  })

  const isLoading = ref(false)

  async function onSubmit() {
    isLoading.value = true
    const withdrawCount = convertValuesToNumber(form.value.withdraw_count)
    const payload: Request.AddMemberLevel = {
      img: form.value.img,
      titles: form.value.titles,
      valid_bet_amount: form.value.valid_bet_amount,
      promotion_bonus: form.value.promotion_bonus,
      birthday_bonus: form.value.birthday_bonus,
      deposit_amount: form.value.deposit_amount,
      remark: form.value.remark,
      // 晉級計算方式
      promotion_type: form.value.level_up_tags,
      // 每日取款次數
      withdraw_count: form.value.ratio
    }
    console.log(payload)
    return
    const { code, msg } = await addMemberLevelSettings(payload)
    if (code === 0) {
      nextPrevStep(true)
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
    }
  }
</script>
