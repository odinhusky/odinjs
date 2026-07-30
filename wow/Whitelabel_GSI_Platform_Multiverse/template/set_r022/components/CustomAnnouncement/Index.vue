<template>
  <Announcement
    id="announcement-dialog-wrapper"
    class="custom-announcement-wrapper"
    :enable-advanced-announcement-filters="true"
    :style-class="{
      allContentStyleClass: {
        header: '!bg-[var(--bg-05)] rounded-t-[1.5rem]',
        dialogTitle: '!text-[var(--secondary-01)]',
        body: 'rounded-b-[1.5rem]',
        bodyNav: '!bg-[var(--tab-bg-05)]',
        bodyContent: '!bg-[var(--bg-05)]',
        allIcon: '!fill-[var(--icon-02)]',
        closeIconBtn: '!text-[var(--icon-01)]',
        arrowIconClass: '!fill-[var(--icon-01)]',
        navTypeWrapper: '!bg-[var(--primary-06)]',
        sidebarActiveTab: '!bg-[var(--card-bg-02)]',
        sidebarTabText: '!text-[var(--tab-text-01)]',
        detailTitle: '!text-[var(--text-02)]',
        detailBody: '!text-[var(--text-02)]',
        checkboxWrapper: '!bg-[var(--bg-11)]',
        emptyAnnouncement: '!text-[var(--text-02)]'
      },
      singleContentStyleClass: {
        header: '!bg-[var(--bg-05)]',
        dialogTitle: '!text-[var(--secondary-01)]',
        bodyContent: '!bg-[var(--bg-05)]',
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
@import "app/template/set_r022/assets/css/_variable.scss";

.custom-announcement-wrapper {
  --card-bg-01: #f6f7f8;
  --card-bg-02: #d4f1fe;
  --ann-checkbox-bg-active: var(--q-primary, var(--primary-01));
  --ann-checkbox-icon: #ffffff;
  --bg-pagination: #ffffff;
  --text-pagination-enabled: #025be8;
  --text-pagination-focused: #ffffff;

  .announcement-filter-bar {
    background-color: var(--bg-05) !important;
    border-bottom: 1px solid #ffffff1a !important;
  }

  .sidebar-list {
    border: 1px solid #ffffff1a !important;
  }

  .sidebar-item.sidebar-item--advanced {
    background: var(--card-bg-01, #f6f7f8);
  }

  .sidebar-item.sidebar-item--advanced.active {
    background: var(--card-bg-02, #d4f1fe) !important;
  }

  .sidebar-type-tag {
    background: #025be8 !important;
    color: #ffffff !important;
  }

  .announcement-checkbox-wrapper {
    .q-checkbox {
      .q-checkbox__inner.q-checkbox__inner--truthy {
        color: var(--ann-checkbox-bg-active, var(--q-primary, var(--primary-01))) !important;

        .q-checkbox__bg,
        .q-checkbox__svg {
          background: var(--ann-checkbox-bg-active, var(--q-primary, var(--primary-01))) !important;
        }

        .q-checkbox__svg {
          color: var(--ann-checkbox-icon, #ffffff) !important;
        }
      }
    }
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
        background: var(--bg-10, #6c7890) !important;
        color: var(--text-pagination-focused, #ffffff) !important;
      }

      &.disabled {
        background: var(--bg-pagination, var(--bg-08)) !important;
        color: var(--icon-01) !important;
        opacity: 1 !important;
      }
    }

    .q-pagination__middle button[aria-current="true"] {
      background: var(--bg-10, #6c7890) !important;
      color: var(--text-pagination-focused, #ffffff) !important;
    }
  }
}

.body--light {
  .custom-announcement-wrapper {
    .dialog-header,
    .quick-filter-tab--active,
    .filter-search-btn {
      background: #025be8 !important;
    }

    .dialog-header {
      .dialog-title {
        color: #ffffff !important;
      }

      .q-icon {
        color: #ffffff !important;
      }
    }

    .filter-search-btn {
      color: #ffffff !important;

      .q-btn__content {
        color: #ffffff !important;
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

    .announcement-checkbox-wrapper {
      .q-checkbox__label {
        color: #000000 !important;
      }

      .q-checkbox__inner {
        .q-checkbox__bg {
          border: 1px solid #dcdfe6 !important;
        }

        &.q-checkbox__inner--truthy {
          .q-checkbox__bg {
            border: 0 !important;
          }
        }
      }
    }
  }
}

.body--dark {
  .custom-announcement-wrapper {
    --card-bg-01: #0d2533;
    --card-bg-02: #6c7890;
    --bg-pagination: #0b283a;
    --text-pagination-enabled: #2d7eff;
    --text-pagination-focused: #ffffff;

    .sidebar-type-tag {
      background: var(--btn-bg-01, #2d7eff) !important;
      color: #ffffff !important;
    }

    .select-announcement-type-toolbar,
    .filter-date-range-input,
    .keyword-input,
    .advanced-date-range-input,
    .advanced-keyword-input,
    .select-announcement-type {
      .q-field__control {
        border: 1px solid #d2d2d240 !important;
      }
    }

    .quick-filter-segmented {
      border: 1px solid #d2d2d240 !important;
    }

    .announcement-detail-pc,
    .announcement-list-h5,
    .sidebar-wrapper {
      background: var(--bg-05) !important;
    }

    .sidebar-pagination,
    .mobile-pagination {
      .q-btn {
        background: var(--bg-pagination, #0b283a) !important;
        color: var(--text-pagination-enabled, #2d7eff) !important;

        &[aria-current="true"] {
          background: linear-gradient(90deg, #2d7eff 0%, #b7d0de 100%) !important;
          color: var(--text-pagination-focused, #ffffff) !important;
        }

        &.disabled {
          background: var(--bg-pagination, #0b283a) !important;
          color: var(--text-pagination-enabled, #2d7eff) !important;
        }
      }

      .q-pagination__middle button[aria-current="true"] {
        background: linear-gradient(90deg, #2d7eff 0%, #b7d0de 100%) !important;
        color: var(--text-pagination-focused, #ffffff) !important;
      }
    }
  }
}

.announcement-type-menu-popup {
  background: var(--bg-08);
  border: 1px solid var(--bg-line-02, #e0e0e0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);

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

.body--light .announcement-type-menu-popup {
  background: #ffffff;

  .q-item {
    background: #ffffff;
    color: #6c7890;
  }

  .q-item.q-item--active,
  .q-item.q-item--focused {
    background: linear-gradient(90deg, #025be8 0%, #025be8 100%);
    color: #ffffff;
  }
}

.body--dark .announcement-type-menu-popup {
  background: #0d2533;
  border: 2px solid #215a78;
  border-radius: 2px;
  box-shadow: 0px 0px 4px 0px #ffffff40;

  .q-item {
    background: #0d2533;
    color: #ffffff;
  }

  .q-item.q-item--active,
  .q-item.q-item--focused {
    background: linear-gradient(90deg, #2d7eff 0%, #1677ff 100%);
    color: #ffffff;
  }
}
</style>
