<template>
  <Announcement
    id="announcement-dialog-wrapper"
    class="custom-announcement-wrapper"
    :style-class="{
      allContentStyleClass: {
        header: '!bg-[var(--dialog-bg)] rounded-t-[1.5rem]',
        dialogTitle: '!text-[var(--secondary-01)]',
        body: 'rounded-b-[1.5rem]',
        bodyNav: '!bg-[var(--tab-bg-05)]',
        bodyContent: '!bg-[var(--bg-04)]',
        allIcon: '!fill-[var(--icon-02)]',
        closeIconBtn: '!text-[var(--icon-01)]',
        arrowIconClass: '!fill-[var(--icon-01)]',
        navTypeWrapper: '!bg-[var(--primary-06)]',
        sidebarActiveTab: '!bg-gradient-to-r !from-[var(--tab-bg-01)] !to-[var(--tab-bg-02)]',
        sidebarTabText: '!text-[var(--tab-text-01)]',
        detailTitle: '!text-[var(--text-02)]',
        detailBody: '!text-[var(--text-02)]',
        checkboxWrapper: '!bg-[var(--bg-11)]',
        emptyAnnouncement: '!text-[var(--text-02)]'
      },
      singleContentStyleClass: {
        header: '!bg-[var(--dialog-bg)]',
        dialogTitle: '!text-[var(--secondary-01)]',
        bodyContent: '!bg-[var(--bg-04)]',
        closeIconBtn: '!text-[var(--icon-01)]',
        detailTitle: '!text-[var(--text-02)]',
        detailBody: '!text-[var(--text-02)]',
        emptyAnnouncement: '!text-[var(--text-02)]'
      }
    }"
  />
</template>

<script lang="ts" setup>
import Announcement from "app/src/common/components/Announcement/Index.vue"
</script>

<style lang="scss">
@import "app/template/set_r032/assets/css/_variable.scss";
</style>
