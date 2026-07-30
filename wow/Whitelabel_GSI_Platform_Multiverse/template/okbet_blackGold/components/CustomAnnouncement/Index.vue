<template>
  <Announcement
    id="announcement-dialog-wrapper"
    class="custom-announcement-wrapper"
    :enable-advanced-announcement-filters="true"
    :style-class="announcementStyleClass"
  />
</template>

<script lang="ts" setup>
import Announcement from "app/src/common/components/Announcement/Index.vue"

const baseContentStyleClass = {
  dialogTitle: "!text-[var(--secondary-01)]",
  bodyContent: "!bg-[var(--bg-04)]",
  closeIconBtn: "!text-[var(--icon-01)]",
  detailTitle: "!text-[var(--text-02)]",
  detailBody: "!text-[var(--text-02)]",
  emptyAnnouncement: "!text-[var(--text-02)]"
}

const announcementStyleClass = {
  allContentStyleClass: {
    ...baseContentStyleClass,
    header: "!bg-[var(--dialog-bg,#D2B27E)] rounded-t-[1.5rem]",
    body: "rounded-b-[1.5rem]",
    bodyNav: "!bg-[var(--tab-bg-05)]",
    allIcon: "!fill-[var(--icon-02)]",
    arrowIconClass: "!fill-[var(--icon-01)]",
    navTypeWrapper: "!bg-[var(--tab-bg-03)]",
    sidebarActiveTab: "!bg-[var(--card-bg-02)]",
    sidebarTabText: "!text-[var(--tab-text-01)]",
    checkboxWrapper: "!bg-[var(--bg-11)]"
  },
  singleContentStyleClass: {
    ...baseContentStyleClass,
    header: "!bg-[var(--dialog-bg,#D2B27E)]"
  }
}
</script>

<style lang="scss">
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/announcement-pagination.scss";

.announcement-type-menu-popup {
  background: var(--bg-08);
  border: 1px solid var(--bg-line-02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);

  .q-item {
    color: var(--tab-text-01);
    background: var(--bg-08);
  }

  .q-item.q-item--active,
  .q-item.q-item--focused {
    background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%);
    color: var(--btn-text-05);
  }
}

.custom-announcement-wrapper {
  --dialog-bg: var(--primary-01, #d2b27e);
  --announcement-field-bg: #141414;
  --announcement-field-border: #9fa0a1;

  .sidebar-list {
    .sidebar-item {
      background: var(--card-bg-01);

      &.active {
        background: var(--card-bg-02) !important;
      }
    }
  }

  .announcement-filter-bar {
    background-color: var(--bg-11, #252525) !important;
  }

  .announcement-filter-bar__inner {
    background: var(--bg-11, #252525) !important;
    background-color: var(--bg-11, #252525) !important;
  }

  .sidebar-wrapper,
  .announcement-detail-pc,
  .announcement-checkbox-wrapper,
  .announcement-list-h5 {
    background: #252525 !important;
    background-color: #252525 !important;
  }

  .mobile-announcement-item {
    border: 1px solid var(--bg-line-01, #efefef);
    border-radius: 12px;
  }

  .announcement-list-h5 .mobile-announcement-item.active {
    background: #292929 !important;
    background-color: #292929 !important;
  }

  .select-announcement-type-toolbar,
  .filter-date-range-input,
  .keyword-input {
    .q-field__control {
      background: var(--announcement-field-bg) !important;
      background-color: var(--announcement-field-bg) !important;

      &::after {
        border: 1px solid var(--announcement-field-border) !important;
      }
    }
  }

  .q-checkbox.q-checkbox--truthy,
  .q-checkbox .q-checkbox__inner--truthy {
    .q-checkbox__bg {
      background-color: #409eff !important;
      border: 1px solid #409eff !important;
    }

    .q-checkbox__svg {
      background: #409eff !important;
    }
  }
}
</style>
