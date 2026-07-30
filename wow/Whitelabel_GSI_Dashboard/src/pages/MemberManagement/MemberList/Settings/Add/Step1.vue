<template>
  <q-card class="no-shadow bg-transparent add_card">
    <q-form @submit="onSubmit">
      <q-card-section>
        <div class="row q-col-gutter-lg">
          <template v-for="item in memberColumnList" :key="item.column_name" class="q-mb-md">
            <!-- 國碼+號碼 -->
            <template
              v-if="
                needCountryCodePhone &&
                (item.column_name === MEMBER_COLUMN_NAME.Enums.COUNTRY ||
                  item.column_name === MEMBER_COLUMN_NAME.Enums.PHONE)
              "
            >
              <template v-if="item.column_name === MEMBER_COLUMN_NAME.Enums.PHONE">
                <div class="col-6 row no-wrap">
                  <SelectColumn
                    :hide-bottom-space="true"
                    v-if="columnCountryCode"
                    v-model="memberAddForm[columnCountryCode.column_name]"
                    :item="columnCountryCode"
                    class="col-4 q-mr-sm"
                  />
                  <InputColumn
                    :hide-bottom-space="true"
                    v-model="memberAddForm[item.column_name]"
                    :item="item"
                    class="col-8"
                    style="max-width: 207px"
                  />
                </div>
              </template>
            </template>
            <div v-else-if="item.column_name === MEMBER_COLUMN_NAME.Enums.REF_ACCOUNT" class="col-6">
              <RefAccountColumn :hide-bottom-space="true" v-model="memberAddForm[item.column_name]" :item="item" />
            </div>
            <div v-else-if="item.type === INPUT_TYPE.Enums.INPUT" class="col-6">
              <InputColumn :hide-bottom-space="true" v-model="memberAddForm[item.column_name]" :item="item" />
            </div>
            <div v-else-if="item.type === INPUT_TYPE.Enums.SELECT" class="col-6">
              <SelectColumn :hide-bottom-space="true" v-model="memberAddForm[item.column_name]" :item="item" />
            </div>
            <div v-else-if="item.type === INPUT_TYPE.Enums.DATE" class="col-6">
              <DateColumn :hide-bottom-space="true" v-model="memberAddForm[item.column_name]" :item="item" />
            </div>
          </template>
          <!-- 起停用 -->
          <div class="col-6">
            <span>{{ $t("table_header.enable_or_disable") }}</span>
            <div class="q-mt-sm">
              <q-btn-toggle
                class="btn_toggle_style"
                v-model="memberAddForm.enabled"
                :options="[
                  { label: $t('common.enable'), value: true },
                  { label: $t('common.disable'), value: false }
                ]"
                toggle-color="primary"
                unelevated
                rounded
              />
            </div>
          </div>

          <!-- 凍結 -->
          <div class="col-6">
            <span style="display: block">{{ $t("table_header.status") }}</span>
            <div class="q-mt-sm">
              <q-btn-toggle
                v-model="memberAddForm.block"
                :hide-bottom-space="true"
                class="btn_toggle_style"
                toggle-color="primary"
                unelevated
                rounded
                map-options
                :options="[
                  { label: $t('common.un_frozen'), value: false },
                  { label: $t('common.frozen'), value: true }
                ]"
              />
            </div>
          </div>
          <!-- <div class="col-6">
          <q-select
            v-model="form.member_level"
            outlined
            :options="dropdownData.memberLevelList"
            map-options
            emit-value
            :label="$t('table_header.member_level')"
          />
        </div> -->
          <div class="col-12"></div>
        </div>
      </q-card-section>

      <q-card-section align="center">
        <q-btn color="main-color" type="submit" class="edit_btns">{{ $t("btn.next_step") }}</q-btn>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue"
  import { useStepper } from "@/hook/useStepper"
  import { useMember } from "src/composables/useMember"
  import { MEMBER_COLUMN_TYPE, MEMBER_COLUMN_NAME, INPUT_TYPE } from "src/utils/constants"
  import InputColumn from "src/pages/MemberManagement/MemberList/components/InputColumn.vue"
  import SelectColumn from "src/pages/MemberManagement/MemberList/components/SelectColumn.vue"
  import DateColumn from "src/pages/MemberManagement/MemberList/components/DateColumn.vue"
  import RefAccountColumn from "src/pages/MemberManagement/MemberList/components/RefAccountColumn.vue"

  const { nextPrevStep } = useStepper()
  const { memberAddForm, memberColumnList, needCountryCodePhone, columnCountryCode, handleGetMemberColumn } =
    useMember()

  function onSubmit() {
    nextPrevStep(true)
  }

  onMounted(async () => {
    await handleGetMemberColumn(MEMBER_COLUMN_TYPE.Enums.REGISTER)
    // await store.getMemberLevel()
    // store.memberLevel.forEach((level) => {
    //   dropdownData.memberLevelList.push({
    //     label: level.label,
    //     value: level.value
    //   })
    // })
  })
</script>

<style lang="scss" scoped>
  .img_tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 12px;
    }
  }
  .left-btn,
  .right-btn {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .vel-modal {
    ::v-deep(.vel-img-wrapper) {
      cursor: grab !important;
      &:active {
        cursor: grabbing !important;
      }
    }
    ::v-deep(.vel-toolbar) {
      background-color: transparent;
      .toolbar-btn {
        background-color: transparent;
        .vel-icon {
          width: 40px;
          height: 40px;
        }
      }
      .toolbar-btn__resize {
        display: none;
      }
    }
    ::v-deep(.btn__close) {
      width: 33px;
      height: 33px;
      background-color: rgba($color: #fff, $alpha: 0.2);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 1;
      .vel-icon {
        width: 18px;
        height: 18px;
      }
    }
  }
</style>
