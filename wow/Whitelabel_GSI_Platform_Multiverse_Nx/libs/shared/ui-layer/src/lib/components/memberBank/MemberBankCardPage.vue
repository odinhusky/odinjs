<script setup lang="ts">
import { useMemberBankCard } from "../../composables/useMemberBankCard"
import { MEMBER_ASIDE_KEYS } from "../../constants/memberAside"
import { toMemberBankCardAddRoute, toMemberBankCardEditRoute } from "../../constants/routePath"

const route = useRoute()

const { mobileContentVisible, handleAsideSelect, handleBackToAside } = useMemberAsideNavigation(
  MEMBER_ASIDE_KEYS.BANK_CARD
)

const {
  cards,
  selectedType,
  typeOptions,
  canEditBankCard,
  isLoadingBankCards,
  isDeletingBankCard,
  isDeleteDialogVisible,
  pendingDeleteCardName,
  isVirtualType,
  initializeListPage,
  handleSearch,
  closeDeleteDialog,
  openDeleteDialog,
  confirmDelete
} = useMemberBankCard()

const goToAddPage = () => {
  navigateTo(toMemberBankCardAddRoute())
}

const goToEditPage = (id: number) => {
  navigateTo(toMemberBankCardEditRoute(id))
}

const getRoutePaymentTypeId = (): number | undefined => {
  const source = Array.isArray(route.query.payment_type_id)
    ? route.query.payment_type_id[0]
    : route.query.payment_type_id
  if (typeof source !== "string" && typeof source !== "number") return undefined

  const paymentTypeId = Number(source)
  return Number.isFinite(paymentTypeId) && paymentTypeId > 0 ? paymentTypeId : undefined
}

onMounted(async () => {
  await initializeListPage(getRoutePaymentTypeId())
})
</script>

<template>
  <MemberContainer
    header-title="會員中心"
    content-title="提款資訊"
    :show-aside="true"
    :mobile-content-visible="mobileContentVisible"
    :disable-content-max-width="true"
    @back="handleBackToAside"
  >
    <template #aside>
      <MemberAsideInfo :active-key="MEMBER_ASIDE_KEYS.BANK_CARD" @select="handleAsideSelect" />
    </template>

    <div class="w-full h-full min-h-0 flex flex-col gap-3">
      <div class="w-full flex items-end gap-2 phone:flex-col phone:items-stretch">
        <div class="w-[220px] phone:w-full">
          <BaseSelect
            :model-value="selectedType"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            @update:model-value="selectedType = Number($event)"
          />
        </div>

        <BaseBtn class="w-[128px] phone:w-full" theme="secondary" size="lg" @click="handleSearch"> 搜尋 </BaseBtn>

        <BaseBtn
          v-if="canEditBankCard"
          class="ml-auto w-[140px] phone:hidden"
          size="xl"
          theme="primary"
          @click="goToAddPage"
        >
          新增銀行卡
        </BaseBtn>
      </div>

      <div
        v-if="isLoadingBankCards"
        class="flex-1 min-h-0 flex items-center justify-center text-[var(--text-text-primary)]"
      >
        Loading...
      </div>

      <div v-else-if="cards.length === 0" class="flex-1 min-h-0">
        <NoData type="card">
          <template #action>
            <BaseBtn v-if="canEditBankCard" size="xl" class="w-[160px]" @click="goToAddPage"> 新增資訊 </BaseBtn>
          </template>
        </NoData>
      </div>

      <div v-else class="flex-1 min-h-0 overflow-y-auto pr-0.5">
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,308px),1fr))] gap-3">
          <template v-for="card in cards" :key="card.id">
            <VirtaulBankCard
              v-if="isVirtualType(card.payment_type_id)"
              :card="card"
              :mode="MEMBER_BANK_CARD_MODE_OBJ.ACTION"
              @edit="goToEditPage"
              @delete="openDeleteDialog"
            />

            <BankCard
              v-else
              :card="card"
              :mode="MEMBER_BANK_CARD_MODE_OBJ.ACTION"
              @edit="goToEditPage"
              @delete="openDeleteDialog"
            />
          </template>
        </div>
      </div>

      <div v-if="canEditBankCard" class="hidden phone:block w-full mt-auto pb-1">
        <BaseBtn class="w-full" size="xl" @click="goToAddPage"> 新增銀行卡 </BaseBtn>
      </div>
    </div>

    <DeleteBankCardConfirmDialog
      :visible="isDeleteDialogVisible"
      :card-name="pendingDeleteCardName"
      :deleting="isDeletingBankCard"
      @close="closeDeleteDialog"
      @confirm="confirmDelete"
    />
  </MemberContainer>
</template>
