<template>
  <div class="q-py-md">
    <div class="row items-center">
      <div class="col">
        <div class="row items-center" style="color: rgba(83, 82, 82, 1)">
          {{
            $t("common.first_last_and_total", {
              first: (pageModel - 1) * perPageModel + 1,
              last: pageModel * perPageModel,
              total: total
            })
          }}
          <q-select
            v-model="perPageModel"
            :options="perPageList"
            dense
            outlined
            style="min-width: 100px; width: 175px"
            class="q-pl-md default-input"
            :display-value="`${$t('common.perpage_and_page', { perPage: perPageModel })}`"
          />
        </div>
      </div>
      <div>
        <div class="row justify-end">
          <q-pagination
            v-model="pageModel"
            :min="1"
            :max="totalPage"
            :max-pages="6"
            direction-links
            outline
            color="success2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  export const allowPerPageList = [20, 50, 100]
</script>

<script lang="ts" setup>
  // result interface
  export interface IPaginationResults {
    /** 當前頁碼 */
    page: number

    /** 每頁幾筆，預設為每頁 10 筆 */
    perPage: number
  }

  // setting interface
  export interface IPaginationSettings extends IPaginationResults {
    offset: number
    /** 總筆數 */
    total: number

    /** 頁碼變更時呼叫的 Function */
    onPagination: (value: { page: number; perPage: number }) => void
  }

  import { computed } from "vue"
  import { useI18n } from "vue-i18n"

  const props = defineProps({
    page: {
      type: [Number],
      required: true,
      default: 1
    },
    perPage: {
      type: [Number],
      required: true,
      default: 10
    },
    offset: {
      type: [Number],
      required: true,
      default: 0
    },
    total: {
      type: [Number],
      required: true,
      default: 0
    },
    onPagination: {
      type: [Function],
      required: true,
      default: (value: { page: number; perPage: number }) => {
        console.log(`function onPagination is not exists. now page: ${value.page}, perPage: ${value.perPage}`)
      }
    }
  })

  const { t } = useI18n()

  const perPageList = allowPerPageList

  const pageModel = computed({
    get() {
      return props.page
    },
    set(page: number) {
      props.onPagination &&
        props.onPagination({
          page,
          perPage: props.perPage
        })
    }
  })

  const perPageModel = computed({
    get() {
      return props.perPage
    },
    set(perPage: number) {
      props.onPagination &&
        props.onPagination({
          page: 1,
          perPage
        })
    }
  })

  // 總頁數
  const totalPage = computed(() => {
    // 若 total 為 0 時，預設總頁數為 1
    if (props.total <= 0) {
      return 1
    }
    return props.total % props.perPage > 0 ? Math.floor(props.total / props.perPage) + 1 : props.total / props.perPage
  })
</script>

<style lang="scss" scoped>
  ::v-deep(.q-field__control) {
    height: 40px;
  }

  ::v-deep(.q-field__label) {
    top: 0.7vw;
    font-size: 14px;
  }

  .label {
    margin-right: 1vw;
  }

  .table-pagination {
    ::v-deep(.q-field__control) {
      width: 100px;
    }

    span {
      margin: 0 1vw;
    }
  }

  .bg-unset {
    background: unset !important;
  }

  .float-left-pagination {
    float: left;
    width: 50%;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }

  .float-right-pagination {
    float: right;
    width: 50%;
    justify-content: flex-end;
    display: flex;
  }
  // ::v-deep(.q-field__control) {
  //   border-radius: 7px;
  // }
  ::v-deep(.q-btn--outline:before) {
    background: transparent !important;
    border: 0;
  }
  ::v-deep(.q-btn-item, .q-field__native) {
    color: rgba(83, 82, 82, 1);
  }
  ::v-deep(.q-field__native) {
    color: rgba(83, 82, 82, 1);
  }
  ::v-deep(.text-white) {
    color: white !important;
  }
</style>
