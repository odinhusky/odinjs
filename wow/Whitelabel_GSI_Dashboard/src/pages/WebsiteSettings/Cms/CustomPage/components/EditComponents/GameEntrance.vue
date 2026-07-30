<template>
  <!-- 列數 -->
  <div class="flex flex-col gap-5">
    <q-card-section class="game-entrance-row">
      <h3 class="game-entrance-row-title">{{ $t("cms.number_of_rows") }}</h3>
      <q-input
        v-model="props.entrance.payload.row_num"
        dense
        outlined
        class="cms-form-input no-spinner"
        :placeholder="$t('common.please_enter_content')"
        lazy-rules
        :rules="[Rules.required()]"
        hide-bottom-space
        @update:model-value="
          (val) => {
            if (val && typeof val === 'string') props.entrance.payload.row_num = Number(val?.replace(/\D/g, ''))
          }
        "
      ></q-input>
    </q-card-section>
    <!-- 每列數量 -->
    <q-card-section class="game-entrance-row">
      <h3 class="game-entrance-row-title">{{ $t("cms.items_per_row") }}</h3>
      <q-input
        v-model="props.entrance.payload.row_show"
        dense
        outlined
        class="cms-form-input no-spinner"
        :placeholder="$t('common.please_enter_content')"
        lazy-rules
        :rules="[Rules.required()]"
        hide-bottom-space
        @update:model-value="
          (val) => {
            if (val && typeof val === 'string') props.entrance.payload.row_show = Number(val?.replace(/\D/g, ''))
          }
        "
      ></q-input>
    </q-card-section>
    <!-- 呈現方式 -->
    <q-card-section class="game-entrance-row">
      <h3 class="game-entrance-row-title">{{ $t("cms.display_mode") }}</h3>
      <q-select
        v-model="props.entrance.payload.game_type_entrance_type"
        :options="gameTypeEntranceTypeList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
      >
      </q-select>
    </q-card-section>
    <!-- 類型 -->
    <q-card-section class="game-entrance-row">
      <h3 class="game-entrance-row-title">{{ $t("cms.type") }}</h3>
      <q-select
        v-model="props.entrance.payload.game_type_id"
        :options="currentGameTypeList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
        @update:model-value="handleGameTypeV2"
      >
      </q-select>
    </q-card-section>
    <!-- 集成id -->
    <q-card-section
      v-show="props.entrance.payload.game_type_entrance_type === GAME_TYPE.ENTRANCE_TYPE.GAME_LIST"
      class="game-entrance-row"
    >
      <h3 class="game-entrance-row-title">{{ $t("table_header.supplier") }}</h3>
      <q-select
        v-model="props.entrance.payload.product_integration_id"
        :options="productIntegrationList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
      >
      </q-select>
    </q-card-section>
    <!-- 產品 -->
    <q-card-section
      v-show="props.entrance.payload.game_type_entrance_type === GAME_TYPE.ENTRANCE_TYPE.GAME_LIST"
      class="game-entrance-row"
    >
      <h3 class="game-entrance-row-title">{{ $t("cms.product") }}</h3>
      <q-select
        v-model="entrance.payload.product_code"
        :options="filterProductList"
        dense
        options-dense
        outlined
        map-options
        emit-value
        class="cms-form-input"
      >
        <template #before-options>
          <q-input
            v-model="productKeyword"
            dense
            outlined
            class="search-input q-mt-sm q-mx-sm"
            :placeholder="$t('common.search')"
          >
            <template v-slot:prepend> <q-icon name="search" /> </template
          ></q-input>
        </template>
        <template v-slot:no-option>
          <q-input
            v-model="productKeyword"
            dense
            outlined
            class="search-input q-mt-sm q-mx-sm"
            :placeholder="$t('common.search')"
          >
            <template v-slot:prepend> <q-icon name="search" /> </template
          ></q-input>
          <q-item>
            <q-item-section class="text-grey"> {{ $t("common.no_result") }} </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>
  </div>
</template>

<script setup lang="ts">
  import { PropType, defineProps, onMounted, computed, watch, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useCms } from "src/composables/useCms"
  import { useRule } from "src/hook/useRule"
  import { useQueryStore, DropdownType } from "src/stores/queryStore"
  import { GAME_TYPE } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import { getProductV2Dropdown } from "@/api/productV2"

  const { t } = useI18n()
  const Rules = useRule()
  const queryStore = useQueryStore()
  const { gameTypeEntranceTypeList, productIntegrationList, handleIntegrationList } = useCms()

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem> | null,
      required: true,
      default: () => {
        return null
      }
    }
  })

  const singleEntryList = computed(() =>
    queryStore.gameTypeListV2
      .filter((e) => GAME_TYPE.Category[e.value as GAME_TYPE.Enums] === GAME_TYPE.ENTRANCE_TYPE.SINGLE_ENTRY)
      .map((e) => ({
        label: t(GAME_TYPE.I18nKeys[e.value as GAME_TYPE.Enums]),
        value: e.value as GAME_TYPE.Enums
      }))
  )
  const gameEntryList = computed(() =>
    queryStore.gameTypeListV2
      .filter((e) => GAME_TYPE.Category[e.value as GAME_TYPE.Enums] === GAME_TYPE.ENTRANCE_TYPE.GAME_LIST)
      .map((e) => ({
        label: t(GAME_TYPE.I18nKeys[e.value as GAME_TYPE.Enums]),
        value: e.value as GAME_TYPE.Enums
      }))
  )

  const currentGameTypeList = computed(() => {
    return props.entrance.payload.game_type_entrance_type === GAME_TYPE.ENTRANCE_TYPE.SINGLE_ENTRY
      ? singleEntryList.value
      : gameEntryList.value
  })

  async function handleGameTypeEntranceTypeValue() {
    const list =
      props.entrance.payload.game_type_entrance_type === GAME_TYPE.ENTRANCE_TYPE.SINGLE_ENTRY
        ? singleEntryList.value
        : gameEntryList.value

    props.entrance.payload.game_type_id = list.length > 0 ? list[0].value : undefined

    if (props.entrance.payload.game_type_entrance_type === GAME_TYPE.ENTRANCE_TYPE.GAME_LIST) {
      await handleIntegrationList()
      props.entrance.payload.product_integration_id = productIntegrationList.value.length
        ? productIntegrationList.value[0].value
        : undefined

      await getProductListV2()
      return
    }

    props.entrance.payload.product_integration_id = undefined
    props.entrance.payload.product_code = undefined
  }

  // 產品列表
  const cloneProductDropdown = ref<any[]>([])
  const productKeyword = ref("")
  const productList = ref<DropdownType[]>([])
  const filterProductList = computed(() => {
    if (productKeyword.value) {
      const keyword = productKeyword.value.toLowerCase()
      return productList.value.filter((product) => product.label.toLowerCase().includes(keyword))
    }
    return productList.value
  })
  async function getProductListV2() {
    if (props.entrance.payload.game_type_entrance_type === GAME_TYPE.ENTRANCE_TYPE.SINGLE_ENTRY) {
      props.entrance.payload.product_integration_id = undefined
      props.entrance.payload.product_code = undefined
      productList.value.length = 0
      return
    }

    const game_type = props.entrance.payload.game_type_id
    const integration_id = props.entrance.payload.product_integration_id

    if (cloneProductDropdown.value.length <= 0) {
      const { data } = await getProductV2Dropdown()
      if (!data || !data.length) {
        productList.value.length = 0
        return
      }
      cloneProductDropdown.value = data
    }

    const fliterDate = cloneProductDropdown.value.filter(
      (item: { game_type_id: number; integration_id: number }) =>
        item.game_type_id === game_type && item.integration_id === integration_id
    )

    productList.value = fliterDate.map((e: { product_name: string; product_code: string }) => {
      return {
        label: e.product_name,
        value: e.product_code
      }
    })

    if (!props.entrance.payload.product_code && fliterDate.length) {
      props.entrance.payload.product_code = fliterDate[0].product_code
    }
  }

  async function handleGameTypeV2() {
    props.entrance.payload.product_code = undefined
    await getProductListV2()
  }

  watch(
    () => props.entrance.payload.game_type_entrance_type,
    (newVal) => {
      handleGameTypeEntranceTypeValue()
    }
  )

  onMounted(async () => {
    if (!queryStore.gameTypeListV2.length) {
      await queryStore.getGameTypeListV2()
    }
    if (props.entrance.payload.game_type_entrance_type === GAME_TYPE.ENTRANCE_TYPE.GAME_LIST) {
      await handleIntegrationList()
      await getProductListV2()
    }
  })
</script>

<style lang="scss" scoped>
  @import "../../../../../../css//_variable.sass";
  @import "../../../../../../css/cms.scss";
  @import "../../../../../../css/dragTable.scss";

  .game-entrance-row {
    @apply px-1 py-0 flex flex-col gap-1.5;
    .game-entrance-row-title {
      color: var(--neutral-10, #000);
      /* H7-regular */
      font-family: "NotoSansTC";
      font-size: 14px;

      font-weight: 400;
      line-height: 17px;
    }
    .q-input,
    .q-select {
      width: 100%;
    }
  }
</style>
