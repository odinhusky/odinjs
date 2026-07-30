<template>
  <q-card class="no-shadow no-border table-pagination-wrap bg-unset">
    <q-card-actions class="q-py-md q-px-none">
      <div class="float-left-pagination">
        <span>{{ `共${props.totalSize}条` }}</span>
        <q-select
          dense
          outlined
          style="min-width: 100px"
          :model-value="props.pageSize"
          :options="pageSizeOption"
          class="float-right"
          label="条/頁"
          @update:modelValue="(num: number) => emits('update:pageSize', num)"
        />
      </div>
      <div class="float-right-pagination">
        <q-pagination
          :model-value="props.page"
          :min="1"
          :max="Math.ceil(props.totalSize / props.pageSize)"
          :max-pages="6"
          direction-links
          outline
          @update:modelValue="(num: number) => emits('update:page', num)"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
  const props = defineProps({
    page: {
      type: Number,
      default: () => 1
    },
    pageSize: {
      type: Number,
      default: () => 10
    },
    totalSize: {
      type: Number,
      default: () => 0
    }
  })
  const emits = defineEmits(["update:page", "update:pageSize", "update:totalSize"])

  const pageSizeOption = [10, 20, 50, 100]
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
</style>
