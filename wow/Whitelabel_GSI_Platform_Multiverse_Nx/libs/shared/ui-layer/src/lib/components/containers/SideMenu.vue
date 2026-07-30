<script setup lang="ts">
const { collapsed, memberItems, dynamicItems, isItemActive, handleItemClick } = useSideMenu()
const { isDown } = useCustomBreakpoints()

const isPhoneCollapsed = computed(() => isDown.phone && collapsed.value)

const commonSectionClass = cx(
  FLEX_COL,
  "gap-2",
  "rounded-xl p-2",
  "bg-[linear-gradient(90deg,var(--sidebar-sidebar-sub-bg-left)_0%,var(--sidebar-sidebar-sub-bg-right)_100%)]"
)
</script>

<template>
  <aside
    :class="
      cx(
        'sticky top-[72px] h-[calc(100vh-72px)] shrink-0 overflow-y-auto transition-all duration-300',
        'bg-[var(--sidebar-sidebar-bg)] text-white',
        collapsed ? 'w-[70px]' : 'w-[270px]',
        !collapsed && 'phone:w-full',
        isPhoneCollapsed &&
          'phone:!w-0 phone:!min-w-0 phone:!px-0 phone:!pb-0 phone:!overflow-hidden phone:opacity-0 phone:pointer-events-none',
        'px-3 pb-5',
        SCROLLBAR_HIDDEN
      )
    "
  >
    <div class="space-y-3">
      <!-- 因 Sally 提的需求暫時隱藏 SideMenu 靜態區塊，邏輯保留 -->
      <!--
      <section v-if="dynamicItems.length" :class="cx(commonSectionClass)">
        <ActionListBtn
          v-for="item in memberItems"
          :key="item.key"
          :label="item.label"
          :icon="item.icon"
          :collapsed="collapsed"
          :active="isItemActive(item)"
          active-mode="row"
          :class-obj="{
            button: 'text-sm',
            text: 'text-sm leading-5'
          }"
          @click="handleItemClick(item)"
        />
      </section>
      -->

      <section :class="cx(commonSectionClass)">
        <ActionListBtn
          v-for="item in dynamicItems"
          :key="item.key"
          :label="item.label"
          :icon="item.icon"
          :icon-src="item.iconSrc"
          :collapsed="collapsed"
          :active="isItemActive(item)"
          active-mode="row"
          :class-obj="{
            button: 'text-sm',
            text: 'text-sm leading-5 uppercase'
          }"
          @click="handleItemClick(item)"
        />
      </section>
    </div>
  </aside>
</template>
