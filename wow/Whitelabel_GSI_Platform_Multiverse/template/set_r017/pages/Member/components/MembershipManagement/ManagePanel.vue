<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    :rows="memberManagementStore.manageRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.manageColumns"
    row-key="id"
    hide-pagination
    flat
    class="manage-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <div class="manage-top">
        <div class="manage-search-card">
          <div class="member-agent-info">
            <div class="member-agent-info-label">{{ $t("member.membershipManagement.subordinateMember") }}</div>
            <div class="member-agent-info-account">
              {{
                memberManagementStore.showSubordinateMemberAccount?.account ?? memberManagementStore.memberAgentAccount
              }}
            </div>
          </div>

          <q-form @submit.prevent="memberManagementStore.handlerSearchSubordinateMember" class="search-form">
            <div class="search-form-row manage-search-row">
              <template v-if="!memberManagementStore.showSubordinateMemberAccount?.account">
                <div class="search-item manage">
                  <div class="search-item-label manage">{{ $t("menu.userAccount") }}</div>
                  <q-input
                    v-model="memberManagementStore.memberAccount"
                    :placeholder="$t('placeholder.pleaseEnterUserAccount')"
                    dense
                    standout="text-black"
                    class="search-item-input account manage"
                  />
                </div>

                <div class="search-item manage">
                  <div class="search-item-label manage">{{ $t("member.profile.affiliate") }}</div>
                  <q-input
                    v-model="memberManagementStore.recommenderAccount"
                    :placeholder="$t('placeholder.pleaseEnterReferral')"
                    dense
                    standout="text-black"
                    class="search-item-input account manage"
                  />
                </div>
              </template>

              <div v-else class="search-item manage">
                <div class="search-item-label manage">
                  {{ $t("member.membershipManagement.subordinateMemberAccount") }}
                </div>
                <q-input
                  v-model="memberManagementStore.searchSubordinateMemberAccount"
                  :placeholder="$t('placeholder.pleaseEnterSubordinateMemberAccount')"
                  dense
                  standout="text-black"
                  class="search-item-input account manage"
                />
              </div>

              <SearchButton :action="memberManagementStore.handlerSearchSubordinateMember" />
            </div>
          </q-form>
        </div>

        <div class="manage-toolbar">
          <q-btn
            v-if="!memberManagementStore.showSubordinateMemberAccount?.account"
            :label="$t('common.btn.addSubordinate')"
            unelevated
            class="agent-center-outline-btn"
            @click="memberManagementStore.showAddSubordinateStatus = true"
          />

          <q-btn
            v-else
            :label="$t('common.btn.back')"
            icon="chevron_left"
            unelevated
            class="agent-center-outline-btn"
            @click="memberManagementStore.handlerBackSubordinateMember()"
          />

          <div v-if="isCredit" class="quota-text">
            {{ $t("collaboration.remaining_agent_amount") }}：
            <span>{{ moneyFormat(memberManagementStore.remainQuotaAmount) }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props">
          <span>{{ props.row.member_account }}</span>
        </q-td>
        <q-td key="level" :props="props">
          <span>{{ props.row.hierarchy_level }}</span>
        </q-td>
        <q-td key="register_date" :props="props">
          <span>{{ memberManagementStore.parseDate(props.row.register_date) }}</span>
        </q-td>
        <q-td key="last_login_date" :props="props">
          <span>{{ memberManagementStore.parseDate(props.row.last_login_date) }}</span>
        </q-td>
        <q-td key="balance" :props="props">
          <span>{{ moneyFormat(props.row.balance) }}</span>
        </q-td>
        <q-td v-if="isCredit" key="remain_quota_amount" :props="props">
          <span>{{ moneyFormat(props.row.remain_quota_amount) }}</span>
        </q-td>
        <q-td key="actions" :props="props" class="manage-actions-cell">
          <div class="desktop-operation-icons">
            <template v-if="isCredit">
              <span
                v-for="(option, index) in memberManagementStore.operationOptions"
                :key="index"
                class="operation-icon-btn"
                :class="option.value === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add ? 'is-add' : 'is-minus'"
                :title="option.label"
                @click="
                  memberManagementStore.handlerClickOperation(
                    props.row.member_account,
                    props.row.member_id,
                    option.value,
                    props.row.is_member_agent,
                    props.row.balance,
                    props.row.remain_quota_amount
                  )
                "
              >
                <q-icon
                  :name="option.value === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add ? 'add_circle' : 'remove_circle'"
                />
              </span>
            </template>

            <span
              v-if="props.row.is_downline_search_available"
              class="operation-icon-btn is-view"
              :title="$t('member.membershipManagement.viewSubordinateMember')"
              @click="
                memberManagementStore.handlerClickOperation(
                  props.row.member_account,
                  props.row.member_id,
                  MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.ViewSubordinate,
                  props.row.is_member_agent
                )
              "
            >
              <q-icon name="visibility" />
            </span>

            <span
              v-if="props.row.is_direct_downline"
              class="operation-icon-btn is-edit"
              :title="$t('common.btn.edit')"
              @click="
                memberManagementStore.handlerClickOperation(
                  props.row.member_account,
                  props.row.member_id,
                  MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Edit,
                  props.row.is_member_agent
                )
              "
            >
              <q-icon name="edit" />
            </span>
          </div>
        </q-td>
      </q-tr>
    </template>

    <template #no-data>
      <div class="agent-center-empty">
        <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
        <span>{{ $t("tableHeader.noData") }}</span>
      </div>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <div class="manage-top">
      <div class="manage-search-card">
        <div class="member-agent-info">
          <div class="member-agent-info-label">{{ $t("member.membershipManagement.subordinateMember") }}</div>
          <div class="member-agent-info-account">
            {{
              memberManagementStore.showSubordinateMemberAccount?.account ?? memberManagementStore.memberAgentAccount
            }}
          </div>
        </div>

        <q-form @submit.prevent="memberManagementStore.handlerSearchSubordinateMember" class="search-form">
          <div class="search-form-row manage-search-row">
            <template v-if="!memberManagementStore.showSubordinateMemberAccount?.account">
              <div class="search-item manage">
                <div class="search-item-label manage">{{ $t("menu.userAccount") }}</div>
                <q-input
                  v-model="memberManagementStore.memberAccount"
                  :placeholder="$t('placeholder.pleaseEnterUserAccount')"
                  dense
                  standout="text-black"
                  class="search-item-input account manage"
                />
              </div>

              <div class="search-item manage">
                <div class="search-item-label manage">{{ $t("member.profile.affiliate") }}</div>
                <q-input
                  v-model="memberManagementStore.recommenderAccount"
                  :placeholder="$t('placeholder.pleaseEnterReferral')"
                  dense
                  standout="text-black"
                  class="search-item-input account manage"
                />
              </div>
            </template>

            <template v-else>
              <div class="search-item manage">
                <div class="search-item-label manage">
                  {{ $t("member.membershipManagement.subordinateMemberAccount") }}
                </div>
                <q-input
                  v-model="memberManagementStore.searchSubordinateMemberAccount"
                  :placeholder="$t('placeholder.pleaseEnterSubordinateMemberAccount')"
                  dense
                  standout="text-black"
                  class="search-item-input account manage"
                />
              </div>
            </template>

            <SearchButton :action="memberManagementStore.handlerSearchSubordinateMember" />
          </div>
        </q-form>
      </div>

      <div class="manage-toolbar">
        <q-btn
          v-if="!memberManagementStore.showSubordinateMemberAccount?.account"
          :label="$t('common.btn.addSubordinate')"
          unelevated
          class="agent-center-outline-btn"
          @click="memberManagementStore.showAddSubordinateStatus = true"
        />

        <q-btn
          v-else
          :label="$t('common.btn.back')"
          icon="chevron_left"
          unelevated
          class="agent-center-outline-btn"
          @click="memberManagementStore.handlerBackSubordinateMember()"
        />

        <div v-if="isCredit" class="quota-text">
          {{ $t("collaboration.remaining_agent_amount") }}：
          <span>{{ moneyFormat(memberManagementStore.remainQuotaAmount) }}</span>
        </div>
      </div>
    </div>

    <q-list v-if="memberManagementStore.manageRows?.length">
      <q-expansion-item
        v-for="data in memberManagementStore.manageRows"
        :key="getManageRowKey(data)"
        :model-value="expandedManageKeys.includes(getManageRowKey(data))"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
        hide-expand-icon
        class="expansion-item"
        @update:model-value="(expanded) => updateExpandedManageKey(expanded, getManageRowKey(data))"
      >
        <template v-slot:header="{ expanded, toggle }">
          <q-item-section class="expansion-header">
            <div class="manage-mobile-card-summary">
              <div class="manage-mobile-summary-item">
                <div class="text-gray">{{ data.member_account }}</div>
                <div class="manage-mobile-summary-label">{{ $t("menu.account") }}</div>
              </div>
              <div class="manage-mobile-summary-item text-right">
                <div class="manage-mobile-summary-value-row">
                  <div class="manage-mobile-summary-value-group">
                    <div class="text-gray">
                      {{ moneyFormat(data.remain_quota_amount) }}
                    </div>
                    <div class="manage-mobile-summary-label">{{ $t("tableHeader.balance") }}</div>
                  </div>
                  <button type="button" class="manage-mobile-toggle-btn" @click.stop="toggle">
                    <q-icon :name="expanded ? 'expand_less' : 'expand_more'" />
                  </button>
                </div>
              </div>
            </div>
            <div class="manage-mobile-card-actions">
              <div class="manage-mobile-actions-inner">
                <div>{{ $t("tableHeader.operating") }}</div>
                <div class="manage-mobile-icon-row">
                  <div
                    v-if="data.is_downline_search_available"
                    class="operating-btn operation-icon-btn is-view"
                    :title="$t('member.membershipManagement.viewSubordinateMember')"
                    @click.stop="
                      memberManagementStore.handlerClickOperation(
                        data.member_account,
                        data.member_id,
                        MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.ViewSubordinate,
                        data.is_member_agent
                      )
                    "
                  >
                    <q-icon name="visibility" />
                  </div>

                  <div
                    v-if="data.is_direct_downline"
                    class="operating-btn operation-icon-btn is-edit"
                    :title="$t('common.btn.edit')"
                    @click.stop="
                      memberManagementStore.handlerClickOperation(
                        data.member_account,
                        data.member_id,
                        MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Edit,
                        data.is_member_agent
                      )
                    "
                  >
                    <q-icon name="edit" />
                  </div>

                  <div
                    v-if="isCredit"
                    class="operating-btn operation-icon-btn is-more"
                    :title="$t('tableHeader.operating')"
                  >
                    <q-icon name="more_horiz" />
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <span>{{ $t("tableHeader.level") }}</span>
                <span class="text-right">{{ data.hierarchy_level }}</span>
              </div>
              <div class="expansion-detail-item">
                <span>{{ $t("tableHeader.registerTime") }}</span>
                <span class="text-right">{{ memberManagementStore.parseDate(data.register_date) }}</span>
              </div>
              <div class="expansion-detail-item">
                <span>{{ $t("tableHeader.lastLoginTime") }}</span>
                <span class="text-right">{{ memberManagementStore.parseDate(data.last_login_date) }}</span>
              </div>
              <div class="expansion-detail-item">
                <span>{{ $t("common.btn.point") }}</span>
                <span class="text-right">{{ moneyFormat(data.balance) }}</span>
              </div>
              <div v-if="isCredit" class="expansion-detail-item expansion-detail-operation">
                <span>{{ $t("tableHeader.operating") }}</span>
                <div class="manage-mobile-detail-icons">
                  <div
                    v-for="(option, optionIndex) in memberManagementStore.operationOptions"
                    :key="optionIndex"
                    class="operating-btn operation-icon-btn"
                    :class="option.value === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add ? 'is-add' : 'is-minus'"
                    :title="option.label"
                    @click.stop="
                      memberManagementStore.handlerClickOperation(
                        data.member_account,
                        data.member_id,
                        option.value,
                        data.is_member_agent,
                        data.balance,
                        data.remain_quota_amount
                      )
                    "
                  >
                    <q-icon
                      :name="
                        option.value === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add ? 'add_circle' : 'remove_circle'
                      "
                    />
                  </div>

                  <div
                    v-if="data.is_downline_search_available"
                    class="operating-btn operation-icon-btn is-view"
                    :title="$t('member.membershipManagement.viewSubordinateMember')"
                    @click.stop="
                      memberManagementStore.handlerClickOperation(
                        data.member_account,
                        data.member_id,
                        MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.ViewSubordinate,
                        data.is_member_agent
                      )
                    "
                  >
                    <q-icon name="visibility" />
                  </div>

                  <div
                    v-if="data.is_direct_downline"
                    class="operating-btn operation-icon-btn is-edit"
                    :title="$t('common.btn.edit')"
                    @click.stop="
                      memberManagementStore.handlerClickOperation(
                        data.member_account,
                        data.member_id,
                        MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Edit,
                        data.is_member_agent
                      )
                    "
                  >
                    <q-icon name="edit" />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div v-else class="agent-center-empty">
      <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
      <span>{{ $t("tableHeader.noData") }}</span>
    </div>
  </div>

  <!-- pagination -->
  <div v-if="memberManagementStore.totalPage" class="pagination">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="memberManagementStore.totalPage"
      @update:model-value="memberManagementStore.handleChangePage"
      direction-links
      flat
      active-design="flat"
      color="deep-grey"
      active-color="blue-8"
      icon-prev="chevron_left"
      icon-next="chevron_right"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { MEMBER_AGENT_QUOTA_BALANCE_TYPE } from "src/common/utils/constants"
import { useMemberManagement } from "src/stores/useMemberManagement"
import SearchButton from "./SearchButton.vue"

const { isCredit: envIsCredit } = useEnv()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const { orderImg } = useSiteImg()
const memberManagementStore = useMemberManagement()
const isCredit = computed(() => envIsCredit.value)
const expandedManageKeys = ref<string[]>([])

const getManageRowKey = (row: { member_id?: number; member_account?: string }) =>
  String(row.member_id ?? row.member_account ?? "")

const updateExpandedManageKey = (expanded: boolean, key: string) => {
  if (expanded) {
    if (!expandedManageKeys.value.includes(key)) {
      expandedManageKeys.value = [...expandedManageKeys.value, key]
    }
    return
  }

  expandedManageKeys.value = expandedManageKeys.value.filter((currentKey) => currentKey !== key)
}
</script>

<style lang="scss" scoped>
@import "app/template/set_r017/assets/css/membershipManagement.scss";
</style>
