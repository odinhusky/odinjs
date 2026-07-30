<template>
  <q-tr>
    <template v-for="col in columns" :key="col.name">
      <q-th v-if="col.sortable && showSortIcon" class="th-sortable" @click="emit('sortUpdate', col.field)">
        {{ col.label }}
        <q-icon v-if="col.field === orderType" :name="sortType ? 'arrow_drop_down' : 'arrow_drop_up'" class="active" />
        <q-icon v-else name="arrow_drop_up" />
      </q-th>
      <q-th v-else>
        {{ col.label }}
      </q-th>
    </template>
  </q-tr>
</template>

<script lang="ts" setup>
  import { CustomQTableProps } from "quasar"
  import { PropType, defineProps } from "vue"

  const emit = defineEmits(["sortUpdate"])

  const props = defineProps({
    columns: {
      type: Object as PropType<CustomQTableProps["columns"]>,
      required: true,
      default: () => {}
    },
    orderType: {
      type: String,
      required: true,
      default: ""
    },
    sortType: {
      type: Number,
      required: true,
      default: ""
    },
    showSortIcon: {
      type: Boolean,
      required: false,
      default: true
    }
  })
</script>

<style scoped lang="scss">
  .q-tr {
    .th-sortable {
      cursor: pointer;
      .q-icon {
        opacity: 0.6;
        &.active {
          opacity: 1;
        }
      }
      &:hover {
        .q-icon {
          opacity: 1;
        }
      }
    }
  }
</style>
