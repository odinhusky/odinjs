<template>
  <q-table :rows="tableData" :columns="tableColumn">
    <template #body-cell-Action="props">
      <slot name="action" :row="props.row"></slot>
    </template>
  </q-table>
</template>

<script setup></script>
