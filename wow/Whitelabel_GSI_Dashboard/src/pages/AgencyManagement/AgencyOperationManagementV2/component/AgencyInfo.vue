<template>
  <div>
    <q-card-section class="q-pt-s">
      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.agent_ID") }}</div>
          <q-input
            v-model="form.agent_id"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_agent_id')"
          />
        </div>

        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.agent_account") }}</div>
          <q-input
            v-model="form.agency_account_number"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_agency_account_number')"
          />
        </div>
      </div>
      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.password") }}</div>
          <q-input
            v-model="form.password"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_password')"
          />
        </div>
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.confirm_password") }}</div>
          <q-input
            v-model="form.confirm_password"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_confirm_your_password')"
          />
        </div>
      </div>

      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.agent_name") }}</div>
          <q-input
            v-model="form.agent_name"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_password')"
          />
        </div>

        <div class="col-4">
          <div class="q-pb-xs">{{ $t("common.contact_person") }}</div>
          <q-input
            v-model="form.contact_person"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_contact_person')"
          />
        </div>
      </div>

      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.phone_number") }}</div>
          <q-input
            v-model="form.phone"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_phone')"
          />
        </div>

        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.email") }}</div>
          <q-input
            v-model="form.email"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_email')"
          />
        </div>
      </div>

      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-8">
          <div class="q-pb-xs">{{ $t("table_header.remark") }}</div>
          <q-input
            v-model="form.remark"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_content')"
            type="textarea"
          />
        </div>
      </div>
      <div class="row flex-center q-col-gutter-xl q-pb-lg q-pl-xl">
        <div class="col-3">
          <div class="q-ml-md q-mt-md">{{ $t("query_params.status") }}</div>
          <q-card class="q-mt-md bg-transparent">
            <q-card-actions align="left">
              <q-toggle
                v-model="form.enable_or_disable"
                :color="form.enable_or_disable ? 'positive' : 'negative'"
                :false-value="0"
                :true-value="1"
                keep-color
                stack-label
                :label="form.enable_or_disable ? $t('common.enable') : $t('common.disable')"
              />
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-3">
          <div class="text-left q-pl-sm q-pb-sm">{{ $t("query_params.account_status") }}</div>
          <q-btn-toggle
            v-model="form.status"
            toggle-color="main-color"
            :options="[
              { label: $t('common.un_frozen'), value: 0 },
              { label: $t('common.frozen'), value: 1 }
            ]"
          />
        </div>
        <!-- <div class="col-3">
          <div class="text-left q-pl-sm q-pb-sm">{{ $t("table_header.second_verification") }}</div>
          <q-btn-toggle
            v-model="form.verify_binding"
            toggle-color="main-color"
            :options="[
              { label: $t('common.binding'), value: 0 },
              { label: $t('common.unbind'), value: 1 }
            ]"
          />
        </div> -->
      </div>
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from "vue"
  import type { AgencyManagementAddInfoItem } from "@/api/response.type"
  const form = reactive<AgencyManagementAddInfoItem>({
    id: 0,
    agent_id: "",
    agency_account_number: "",
    confirm_password: "",
    agent_name: "",
    password: "",
    contact_person: "",
    phone: "",
    email: "",
    remark: "",
    enable_or_disable: 0,
    verify_binding: 0,
    status: 0
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  .tab-container {
    border-bottom: 1px solid #999;
    .q-tab--active {
      color: $mainColor;
    }
  }
  .q-tab-panels {
    background-color: transparent !important;
  }
  .edit-input {
    border: 1px solid #666;
    border-radius: 5px;
    padding: 1px 10px;
  }
  .preview-image {
    margin-top: 10px;
    height: 150px;
    overflow: auto;
    img {
      width: 100%;
      height: auto;
    }
  }
  ::v-deep(.q-field__control) {
    background-color: transparent !important;
  }
  .audit-multiple-container {
    border: 1px solid #999;
    .q-btn {
      height: 40px;
      background-color: #f3f4ff;
    }
    .audit-multiple {
      border-left: 1px solid #999;
      border-right: 1px solid #999;
      ::v-deep(input.q-field__input) {
        text-align: center;
      }
    }
  }
</style>
