<template>
  <q-dialog>
    <q-card class="custom-modal" style="width: 450px">
      <!--<div class="title text-h6 q-px-lg q-py-md">權限內容</div>-->
      <!-- -<q-space />
        <q-btn icon="close" flat round dense v-close-popup /> -->
      <div class="q-px-lg">
        <div class="one-col-grid input-col-grid">
          <div class="custom-box-label">{{ $t("menu.account_management") }}</div>

          <div class="flex-column">
            <div class="custom-box">
              {{ $t("menu.backoffice_account") }}
              <div class="custom-edit">
                <span class="btn_green">{{ $t("common.available_to_view") }}</span
                ><span class="btn_red">{{ $t("common.not_editable") }}</span>
              </div>
            </div>
            <div class="custom-box">
              {{ $t("menu.permission_setting") }}
              <div class="custom-edit">
                <span class="btn_green">{{ $t("common.available_to_view") }}</span
                ><span class="btn_red">{{ $t("common.not_editable") }}</span>
              </div>
            </div>
            <div class="custom-box">
              {{ $t("menu.user_action_log") }}
              <div class="custom-edit">
                <span class="btn_green">{{ $t("common.available_to_view") }}</span
                ><span class="btn_red">{{ $t("common.not_editable") }}</span>
              </div>
            </div>
          </div>
          <div class="custom-box-label">{{ $t("menu.product") }}</div>
          <div class="flex-column">
            <div class="custom-box">
              {{ $t("menu.product_switch") }}
              <div class="custom-edit">
                <span class="btn_red">{{ $t("common.not_viewable") }}</span
                ><span class="btn_red">{{ $t("common.not_editable") }}</span>
              </div>
            </div>
            <div class="custom-box">
              {{ $t("menu.game_entrance_settings") }}
              <div class="custom-edit">
                <span class="btn_green">{{ $t("common.available_to_view") }}</span
                ><span class="btn_red">{{ $t("common.not_editable") }}</span>
              </div>
            </div>
            <div class="custom-box">
              {{ $t("menu.product_maintenance_settings") }}
              <div class="custom-edit">
                <span class="btn_red">{{ $t("common.not_viewable") }}</span
                ><span class="btn_red">{{ $t("common.not_editable") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <q-card-section style="width: 300px">
        <div>
          <p class="q-mb-sm">帳號管理</p>
          <div class="q-mb-sm q-pa-xs bg-gray">
            總代帳號管理-<a>查看</a>/<a>編輯</a>
          </div>
          <div class="q-mb-sm q-pa-xs bg-gray">
            權限設定-<a>查看</a>/<a>編輯</a>
          </div>
          <div class="q-mb-sm q-pa-xs bg-gray">
            操作紀錄-<a>查看</a>/<a>編輯</a>
          </div>
        </div>
        <div>
          <p class="q-mb-sm">帳號管理</p>
          <div class="q-mb-sm q-pa-xs bg-gray">
            代帳號管理-<a>查看</a>/<a>編輯</a>
          </div>
          <div class="q-mb-sm q-pa-xs bg-gray">
            權限設定-<a>查看</a>/<a>編輯</a>
          </div>
        </div>
      </q-card-section> -->
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { defineComponent } from "vue"

  export default defineComponent({
    name: "PermissionDialog",
    setup() {
      return {}
    }
  })
</script>
<style lang="scss" scoped>
  .custom-modal {
    width: 700px;
    background: #f5f6ff;
    border-radius: 12px;
  }

  .custom-modal .title {
    color: #553b85;
  }

  .custom-modal label {
    color: #505050;
  }

  :deep(.q-card) {
    background: #eaebf8;
    border-radius: 8px !important;
  }

  .one-col-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 24px;
    margin-top: 24px;
  }

  .custom-card-title {
    background: #553b85;
    color: #f5f6ff;
  }

  .custom-input {
    min-width: 100%;
  }

  :deep(.q-field--outlined .q-field__control) {
    height: 40px;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    border: 1px solid #c2c2ca;
    border-radius: 6px;
  }

  .custom-label {
    color: black;
  }

  .custom-box-label {
    font-family: Noto Sans TC;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
  }

  .custom-box {
    border: none;
    border-radius: 0px;
    margin-bottom: 4px;
    padding: 2px 8px;
    text-align: left;
    cursor: pointer;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 15px;
    border-bottom: 1px solid #c2c2ca;
  }
  .custom-box:last-child {
    border-bottom: none;
  }
  .custom-edit {
    display: inline-block;
    float: right;
    span {
      margin-right: 8px;
    }
  }
  .btn_green {
    color: #26bf94;
  }
  .btn_red {
    color: #ff4343;
  }
</style>
