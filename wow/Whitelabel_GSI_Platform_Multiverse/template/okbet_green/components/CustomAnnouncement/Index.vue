<template>
  <Announcement
    id="announcement-dialog-wrapper"
    class="custom-announcement-wrapper"
    :enable-advanced-announcement-filters="enableAdvancedAnnouncementFilters"
    :style-class="announcementStyleClass"
  />
</template>

<script lang="ts" setup>
import Announcement from "app/src/common/components/Announcement/Index.vue"

const enableAdvancedAnnouncementFilters = true

const announcementStyleClass = {
  allContentStyleClass: {
    header: "!bg-[var(--dialog-bg)] rounded-t-[1.5rem]",
    dialogTitle: "!text-[var(--dialog-text-02)]",
    body: "rounded-b-[1.5rem]",
    bodyNav: "!bg-[var(--tab-bg-05)]",
    bodyContent: "!bg-[var(--bg-04)]",
    allIcon: "!fill-[var(--icon-02)]",
    closeIconBtn: "!text-[var(--dialog-text-02)]",
    arrowIconClass: "!fill-[var(--icon-01)]",
    navTypeWrapper: "!bg-[var(--tab-bg-03)]",
    sidebarActiveTab: "!bg-gradient-to-r !from-[var(--tab-bg-01)] !to-[var(--tab-bg-02)]",
    menuItem: "!text-[var(--tab-text-01)]",
    menuItemActive: "!text-[var(--btn-text-05)]",
    sidebarTabText: "!text-[var(--tab-text-01)]",
    detailTitle: "!text-[var(--text-02)]",
    detailBody: "!text-[var(--text-02)]",
    checkboxWrapper: "!bg-[var(--bg-08)]",
    emptyAnnouncement: "!text-[var(--text-02)]"
  },
  singleContentStyleClass: {
    header: "!bg-[var(--dialog-bg)]",
    dialogTitle: "!text-[var(--dialog-text-02)]",
    bodyContent: "!bg-[var(--bg-04)]",
    closeIconBtn: "!text-[var(--dialog-text-02)]",
    detailTitle: "!text-[var(--text-02)]",
    detailBody: "!text-[var(--text-02)]",
    emptyAnnouncement: "!text-[var(--text-02)]"
  }
}
</script>

<style lang="scss">
@import "app/template/okbet_green/assets/css/_variable.sass";

.custom-announcement-wrapper {
  --dialog-bg: #457950;
  --dialog-text-02: #ffffff;
  --bg-04: #ffffff;
  --bg-08: #effff1;
  --tab-bg-05: #effff1;
  --tab-bg-03: #e7f8e9;
  --tab-bg-01: #1fab3d;
  --tab-bg-02: #457950;
  --tab-text-01: #000000;
  --text-02: #262626;
  --text-03: #ffffffc4;
  --icon-01: #00000078;
  --icon-02: #00000078;
  --neutral-100: #000000;
  --bg-line-01: #ffffff1a;
  --bg-line-02: #d2d2d23d;
  --bg-line-03: #00000078;
  --btn-bg-01: #1fab3d;
  --btn-bg-02: #457950;
  --btn-text-05: #ffffff;
  --tag-text-01: #ffffff;
  --bg-pagination: #effff1;
  --text-pagination-enabled: #1fab3d;
  --announcement-pagination-active-bg: linear-gradient(90deg, #1fab3d 0%, #457950 100%);
  --text-pagination-focused: #e7f8e9;

  .dialog-header {
    background: var(--dialog-bg, #457950) !important;
    background-color: var(--dialog-bg, #457950) !important;
  }

  .dialog-body,
  .body-content {
    background: var(--bg-04, #ffffff) !important;
    background-color: var(--bg-04, #ffffff) !important;
  }

  .announcement-filter-bar {
    display: block !important;
    background: var(--bg-04, #ffffff) !important;
    background-color: var(--bg-04, #ffffff) !important;
    border-color: var(--bg-line-02, #d2d2d23d) !important;
  }

  .quick-filter-segmented {
    background: var(--bg-04, #ffffff) !important;
    background-color: var(--bg-04, #ffffff) !important;
  }

  .quick-filter-tab {
    color: var(--tab-text-01, #000000) !important;
  }

  .quick-filter-tab--active {
    background: var(--announcement-pagination-active-bg) !important;
    color: var(--btn-text-05, #ffffff) !important;
  }

  .filter-search-btn {
    background: var(--announcement-pagination-active-bg) !important;
    background-color: var(--btn-bg-01, #1fab3d) !important;
    color: var(--btn-text-05, #ffffff) !important;
  }

  .select-announcement-type-toolbar,
  .filter-date-range-input,
  .keyword-input {
    .q-field__control {
      background: var(--bg-04, #ffffff) !important;
      background-color: var(--bg-04, #ffffff) !important;

      &::before,
      &::after {
        border-color: var(--bg-line-03, #00000078) !important;
      }
    }

    .q-field__native,
    .q-field__input {
      color: var(--text-02, #262626) !important;
    }

    .q-field__append,
    .q-field__prepend,
    .q-select__dropdown-icon,
    .q-icon {
      color: var(--icon-01, #00000078) !important;
    }
  }

  .announcement-detail-pc {
    .sidebar-item-header--detail {
      .sidebar-date {
        color: var(--text-02, #262626) !important;
      }
    }
  }

  .body-nav,
  .sidebar-wrapper {
    display: flex !important;
    background: var(--bg-04, #ffffff) !important;
    background-color: var(--bg-04, #ffffff) !important;
  }

  @media (max-width: 768px) {
    .dialog-body--advanced .body-nav {
      display: none !important;
    }
  }

  .sidebar-list {
    background: var(--bg-04, #ffffff) !important;
    background-color: var(--bg-04, #ffffff) !important;
    border-color: var(--bg-line-02, #d2d2d23d) !important;

    .sidebar-item.sidebar-item--advanced {
      background: var(--bg-04, #ffffff) !important;
      background-color: var(--bg-04, #ffffff) !important;
      border-bottom-color: var(--bg-line-02, #d2d2d23d) !important;

      .sidebar-type-tag {
        background: var(--btn-bg-01, #1fab3d) !important;
        background-color: var(--btn-bg-01, #1fab3d) !important;
        color: var(--tag-text-01, #ffffff) !important;
      }

      .sidebar-text,
      .sidebar-date {
        color: var(--text-02, #262626) !important;
      }

      &.active {
        background: var(--bg-08, #effff1) !important;
        background-color: var(--bg-08, #effff1) !important;
      }
    }
  }

  .mobile-announcement-item {
    background-color: var(--bg-08, #effff1) !important;

    &.active {
      background-color: var(--bg-08, #effff1) !important;

      .mobile-announcement-title,
      .mobile-announcement-date,
      .detail-body {
        color: var(--text-02, #262626) !important;
      }
    }
  }

  .sidebar-pagination,
  .mobile-pagination {
    display: flex !important;

    .q-pagination__content,
    .q-pagination__middle {
      gap: 0.5rem;
    }

    .q-btn,
    .q-pagination .q-btn.q-btn {
      min-height: 2rem;
      min-width: 2rem;
      border-radius: 0.25rem;
      background: var(--bg-pagination, #effff1) !important;
      color: var(--text-pagination-enabled, #1fab3d) !important;
      font-weight: 700;

      &::before {
        box-shadow: none !important;
      }

      &[aria-current="true"] {
        background: var(--announcement-pagination-active-bg) !important;
        color: var(--text-pagination-focused, #e7f8e9) !important;
      }

      &.disabled {
        background: var(--bg-pagination, #effff1) !important;
        color: #00000078 !important;
        opacity: 1 !important;
      }
    }

    .q-btn.q-btn--active,
    .q-btn.q-btn--standard[aria-current="true"],
    .q-pagination__middle button[aria-current="true"] {
      background: var(--announcement-pagination-active-bg) !important;
      color: var(--text-pagination-focused, #e7f8e9) !important;
    }
  }

  .announcement-checkbox-wrapper {
    .q-checkbox {
      .q-checkbox__inner {
        color: #00000078 !important;

        .q-checkbox__bg {
          border: 1px solid #00000078 !important;
          background-color: #ffffff;
        }

        .q-checkbox__svg {
          background-color: transparent !important;
          color: transparent !important;
        }

        &.q-checkbox__inner--truthy {
          color: #1fab3d !important;

          .q-checkbox__bg {
            background-color: #1fab3d !important;
            border-color: #1fab3d !important;
          }

          .q-checkbox__svg {
            background-color: transparent !important;
            color: #ffffff !important;
          }
        }
      }

      .q-checkbox__label {
        color: #000000 !important;
        font-weight: 700 !important;
        line-height: 1.75rem;
      }
    }
  }
}

.announcement-type-menu-popup {
  background-color: var(--bg-04);
  border: 1px solid var(--bg-line-02, #e0e0e0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);

  .q-item {
    min-height: 2.5rem;
    padding: 0.5rem 1rem;
    color: var(--text-02);
    background-color: var(--bg-04);
  }

  .q-item__label {
    color: var(--text-02);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
  }

  .q-item.q-item--active,
  .q-item.q-item--focused {
    background: linear-gradient(90deg, #1fab3d 0%, #457950 100%);

    .q-item__label {
      color: var(--btn-text-05);
    }
  }
}
</style>
