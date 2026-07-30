<template>
  <Announcement
    id="announcement-dialog-wrapper"
    class="custom-announcement-wrapper"
    :enable-advanced-announcement-filters="true"
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
        navTypeWrapper: '!bg-[var(--tab-bg-03)]',
        sidebarActiveTab: '!bg-gradient-to-r !from-[var(--tab-bg-01)] !to-[var(--tab-bg-02)]',
        sidebarTabText: '!text-[var(--tab-text-01)]',
        menuItem: '!text-[var(--btn-border-02)] !bg-[var(--bg-08)]',
        menuItemActive: '!bg-gradient-to-r !from-[var(--btn-bg-01)] !to-[var(--btn-bg-02)] !text-[var(--btn-text-05)]',
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
@import "app/template/set_r023/assets/css/_variable.scss";

.custom-announcement-wrapper {
  .announcement-filter-bar {
    background-color: var(--bg-04);
  }

  .mobile-announcement-item svg {
    display: none !important;
  }

  .sidebar-pagination,
  .mobile-pagination {
    .q-pagination__content,
    .q-pagination__middle {
      gap: 0.5rem;
    }

    .q-btn {
      min-height: 2rem;
      min-width: 2rem;
      border-radius: 0.25rem;
      background: var(--bg-pagination, var(--bg-08)) !important;
      color: var(--text-pagination-enabled, var(--tab-text-01)) !important;
      font-weight: 700;
      margin: 0;

      &::before {
        box-shadow: none !important;
      }

      &[aria-current="true"] {
        background: var(--bg-10, var(--btn-bg-01)) !important;
        color: var(--text-pagination-focused, var(--btn-text-05)) !important;
      }

      &.disabled {
        background: var(--bg-pagination, var(--bg-08)) !important;
        color: var(--icon-01) !important;
        opacity: 1 !important;
      }
    }

    .q-pagination__middle button[aria-current="true"] {
      background: var(--bg-10, var(--btn-bg-01)) !important;
      color: var(--text-pagination-focused, var(--btn-text-05)) !important;
    }
  }
}

.body--light {
  .custom-announcement-wrapper {
    --card-bg-01: #f6f7f8;
    --card-bg-02: #d4f1fe;
    --bg-pagination: #ffffff;
    --text-pagination-enabled: #025be8;
    --text-pagination-focused: #ffffff;

    .dialog-header {
      background: #025be8 !important;

      .dialog-title {
        color: #ffffff !important;
      }

      .q-icon {
        color: #ffffff !important;
      }
    }

    .announcement-filter-bar,
    .announcement-list-h5 {
      background: #ffffff !important;
    }

    .announcement-detail-pc,
    .sidebar-wrapper {
      background: #ffffff !important;
    }

    .announcement-filter-bar {
      border: 0 !important;
    }

    .filter-search-btn,
    .advanced-search-button {
      color: #ffffff !important;

      .q-icon,
      .advanced-search-label {
        color: #ffffff !important;
      }
    }

    .select-announcement-type-toolbar,
    .filter-date-range-input,
    .keyword-input,
    .advanced-date-range-input,
    .advanced-keyword-input,
    .select-announcement-type {
      .q-field__control {
        background: var(--input-dropdown-bg-01, #ffffff) !important;
        border: 1px solid var(--input-dropdown-border-01, #d2d2d240) !important;
      }
    }

    .quick-filter-segmented {
      background: var(--input-dropdown-bg-01, #ffffff) !important;
      border: 1px solid var(--input-dropdown-border-01, #d2d2d240) !important;
    }

    .sidebar-item.sidebar-item--advanced,
    .mobile-announcement-item {
      background: #f6f7f8 !important;
      color: #64594f !important;

      .sidebar-text,
      .mobile-announcement-title {
        color: #64594f !important;
      }
    }

    .sidebar-item.sidebar-item--advanced.active,
    .mobile-announcement-item.active {
      background: #d4f1fe !important;
      color: #0d2245 !important;

      .sidebar-text,
      .mobile-announcement-title {
        color: #0d2245 !important;
      }
    }

    .sidebar-type-tag {
      background: var(--btn-bg-01, #025be8) !important;
      color: #ffffff !important;
    }

    .announcement-checkbox-wrapper {
      .q-checkbox__label {
        color: #000000 !important;
        font-weight: 700 !important;
      }

      .q-checkbox__inner {
        .q-checkbox__bg {
          border: 1px solid #dcdfe6 !important;
          border-radius: 2px !important;
        }
      }

      .q-checkbox__inner.q-checkbox__inner--truthy {
        color: #409eff !important;

        .q-checkbox__bg,
        .q-checkbox__svg {
          background: #409eff !important;
        }

        .q-checkbox__bg {
          border: 1px solid #dcdfe6 !important;
          border-radius: 2px !important;
        }

        .q-checkbox__svg {
          color: #ffffff !important;
        }
      }
    }

    .sidebar-pagination,
    .mobile-pagination {
      .q-btn {
        background: var(--bg-pagination, #ffffff) !important;
        color: var(--text-pagination-enabled, #025be8) !important;

        &[aria-current="true"] {
          background: linear-gradient(90deg, #025be8 0%, #6c7890 100%) !important;
          color: var(--text-pagination-focused, #ffffff) !important;
        }

        &.disabled {
          background: var(--bg-pagination, #ffffff) !important;
          color: var(--text-pagination-enabled, #025be8) !important;
        }
      }

      .q-pagination__middle button[aria-current="true"] {
        background: linear-gradient(90deg, #025be8 0%, #6c7890 100%) !important;
        color: var(--text-pagination-focused, #ffffff) !important;
      }
    }
  }
}

.body--dark {
  .custom-announcement-wrapper {
    --card-bg-01: #1c192e;
    --card-bg-02: #6420bc;
    --bg-pagination: #391461;
    --text-pagination-enabled: #ffffff;
    --text-pagination-focused: #ffffff;

    .dialog-header,
    .announcement-filter-bar,
    .announcement-detail-pc,
    .announcement-list-h5,
    .sidebar-wrapper {
      background: #3f266b !important;
    }

    .announcement-filter-bar {
      border-bottom: 1px solid var(--bg-line-01, #ffffff1a) !important;
    }

    .filter-search-btn,
    .advanced-search-button {
      color: #ffffff !important;

      .q-icon,
      .advanced-search-label {
        color: #ffffff !important;
      }
    }

    .select-announcement-type-toolbar,
    .filter-date-range-input,
    .keyword-input,
    .advanced-date-range-input,
    .advanced-keyword-input,
    .select-announcement-type {
      .q-field__control {
        background: #391461 !important;
        border: 1px solid var(--input-dropdown-border-01, #d2d2d240) !important;
      }
    }

    .quick-filter-segmented {
      background: #391461 !important;
      border: 1px solid var(--input-dropdown-border-01, #d2d2d240) !important;
    }

    .quick-filter-tab--active {
      color: #ffffff !important;
    }

    .sidebar-item.sidebar-item--advanced {
      background: var(--card-bg-01, #1c192e) !important;
    }

    .sidebar-item.sidebar-item--advanced.active {
      background: var(--card-bg-02, #6420bc) !important;
    }

    .sidebar-type-tag {
      color: #ffffff !important;
    }

    .announcement-checkbox-wrapper {
      .q-checkbox__label {
        color: #ffffff !important;
        font-weight: 700 !important;
      }

      .q-checkbox__inner.q-checkbox__inner--truthy {
        color: #409eff !important;

        .q-checkbox__bg,
        .q-checkbox__svg {
          background: #409eff !important;
        }

        .q-checkbox__bg {
          border: 0 !important;
        }

        .q-checkbox__svg {
          color: #ffffff !important;
        }
      }
    }

    .sidebar-pagination,
    .mobile-pagination {
      .q-btn {
        background: var(--bg-pagination, #391461) !important;
        color: var(--text-pagination-focused, #ffffff) !important;

        &[aria-current="true"] {
          background: var(--bg-10, #8d5bff) !important;
          color: var(--text-pagination-focused, #ffffff) !important;
        }

        &.disabled {
          background: var(--bg-pagination, #391461) !important;
          color: var(--text-pagination-focused, #ffffff) !important;
        }
      }

      .q-pagination__middle button[aria-current="true"] {
        background: var(--bg-10, #8d5bff) !important;
        color: var(--text-pagination-focused, #ffffff) !important;
      }
    }
  }
}

.announcement-type-menu-popup {
  border: 2px solid var(--bg-line-02, #d2d2d240);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  overflow: hidden;

  .q-item {
    color: var(--btn-text-05, #ffffff);
  }

  .q-item.q-item--active,
  .q-item.q-item--focused {
    background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%);
    color: var(--btn-text-05);
  }
}

.body--light .announcement-type-menu-popup {
  background: #ffffff;

  .q-item {
    background: #f6f7f8;
    color: #64594f;
  }

  .q-item.q-item--active,
  .q-item.q-item--focused {
    background: linear-gradient(90deg, #025be8 0%, #6c7890 100%);
    color: #ffffff;
  }
}

.body--dark .announcement-type-menu-popup {
  background: #1c192e;
  border: 2px solid #d2d2d240;
  border-radius: 2px;
  box-shadow: 0px 0px 4px 0px #ffffff40;

  .q-item {
    background: #1c192e;
    color: #ffffff;
  }

  .q-item.q-item--active,
  .q-item.q-item--focused {
    background: linear-gradient(90deg, #8d5bff 0%, #8d5bff 100%);
    color: #ffffff;
  }
}
</style>
