<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-xs">
      <div class="text-h6">{{ t("menu.cache_management") }}</div>
      <q-btn
        class="q-ml-md"
        dense
        no-caps
        flat
        color="grey"
        size="sm"
        :label="expandingAll ? t('btn.loading') : t('btn.expand_all')"
        :loading="expandingAll"
        @click="expandAll"
      />
    </div>
    <q-spinner v-if="loading" size="2em" class="q-mt-md" />
    <div v-else>
      <div v-for="master in masters" :key="master.id" class="q-mb-xs">
        <q-tree
          :ref="
            (el: any) => {
              if (el) treeRefs[master.id] = el
            }
          "
          :nodes="masterNodes[master.id] || []"
          node-key="agent_code"
          @lazy-load="({ node, done, fail }) => onLazyLoad(master.id, node, done, fail)"
        >
          <template v-slot:default-header="prop">
            <div class="row items-center full-width">
              <span class="q-mr-md" style="min-width: 80px; display: inline-block">{{ prop.node.label }}</span>
              <div class="row q-gutter-sm">
                <div class="row items-center">
                  <span class="text-caption q-mr-xs">Front end:</span>
                  <q-btn
                    dense
                    no-caps
                    color="primary"
                    size="sm"
                    :label="t('btn.clean_cache')"
                    :loading="clearingKey === `${prop.node.agent_code}-frontend`"
                    @click.stop="onClearCache(master.id, prop.node.agent_code, 'frontend')"
                  />
                </div>
                <div class="row items-center q-ml-lg">
                  <span class="text-caption q-mr-xs">Back office:</span>
                  <q-btn
                    dense
                    no-caps
                    color="primary"
                    size="sm"
                    :label="t('btn.clean_cache')"
                    :loading="clearingKey === `${prop.node.agent_code}-backend`"
                    @click.stop="onClearCache(master.id, prop.node.agent_code, 'backend')"
                  />
                </div>
              </div>
            </div>
          </template>
        </q-tree>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { getCacheMasters, getCacheAgents, clearCache, type CacheMaster, type CacheAgent } from "@/api/cacheManagement"

  const { t } = useI18n()
  const $q = useQuasar()

  const loading = ref(false)
  const masters = ref<CacheMaster[]>([])
  const masterNodes = ref<Record<number, any[]>>({})
  const clearingKey = ref("")
  const expandingAll = ref(false)
  const treeRefs = ref<Record<number, any>>({})

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function expandOneMaster(master: CacheMaster) {
    const tree = treeRefs.value[master.id]
    if (!tree) return
    try {
      const res = await getCacheAgents(master.id)
      if (res.code === 0 && res.data?.agents) {
        const children = buildTreeNodes(res.data.agents, true)
        const rootNode = masterNodes.value[master.id]?.[0]
        if (rootNode) {
          rootNode.children = children
          rootNode.lazy = false
        }
        tree.expandAll()
      } else if (res.code === 999) {
        const rootNode = masterNodes.value[master.id]?.[0]
        if (rootNode) {
          rootNode.lazy = false
        }
      }
    } catch {
      $q.notify({
        type: "negative",
        message: `${master.agent_code} ${t("message.error")}`,
        position: "top",
        timeout: 1000
      })
    }
  }

  async function expandAll() {
    expandingAll.value = true

    /** 節流設定一次取得的資料數 */
    const concurrency = 3

    for (let i = 0; i < masters.value.length; i += concurrency) {
      const batch = masters.value.slice(i, i + concurrency)
      await Promise.all(batch.map((master) => expandOneMaster(master)))
    }
    expandingAll.value = false
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.ctrlKey && e.shiftKey && e.key === "E") {
      e.preventDefault()
      if (!expandingAll.value) expandAll()
    }
  }

  function buildTreeNodes(agents: CacheAgent[], disableLazy = false): any[] {
    return agents.map((agent) => ({
      label: agent.agent_code,
      agent_code: agent.agent_code,
      children: agent.children?.length ? buildTreeNodes(agent.children, disableLazy) : [],
      lazy: disableLazy ? false : !agent.children?.length
    }))
  }

  async function fetchData() {
    loading.value = true
    const res = await getCacheMasters()
    if (res.code === 0 && res.data?.masters) {
      masters.value = res.data.masters
      masters.value.forEach((master) => {
        masterNodes.value[master.id] = [
          {
            label: master.agent_code,
            agent_code: master.agent_code,
            children: [],
            lazy: true
          }
        ]
      })
    }
    loading.value = false
  }

  async function onLazyLoad(masterId: number, node: any, done: (children: any[]) => void, fail: () => void) {
    const res = await getCacheAgents(masterId)
    if (res.code === 0 && res.data?.agents) {
      done(buildTreeNodes(res.data.agents))
    } else if (res.code === 999) {
      done([])
    } else {
      fail()
    }
  }

  async function onClearCache(masterId: number, agentCode: string, cacheType: "frontend" | "backend") {
    const master = masters.value.find((m) => m.id === masterId)
    const isRoot = master?.agent_code === agentCode

    if (isRoot) {
      $q.dialog({
        title: t("btn.tip"),
        message: t("message.confirm_clear_cache"),
        cancel: { label: t("btn.cancel"), color: "primary", flat: true },
        ok: { label: t("btn.confirm"), color: "primary" }
      }).onOk(() => {
        execClearCache(masterId, agentCode, cacheType, isRoot)
      })
    } else {
      execClearCache(masterId, agentCode, cacheType, isRoot)
    }
  }

  async function execClearCache(
    masterId: number,
    agentCode: string,
    cacheType: "frontend" | "backend",
    isRoot: boolean
  ) {
    clearingKey.value = `${agentCode}-${cacheType}`

    const res = await clearCache({
      master_id: masterId,
      cache_type: cacheType,
      target_agent_code: isRoot ? undefined : agentCode
    })

    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.success"),
        position: "top",
        timeout: 300
      })
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
    clearingKey.value = ""
  }

  onMounted(() => {
    fetchData()
    document.addEventListener("keydown", onKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener("keydown", onKeydown)
  })
</script>

<style lang="scss" scoped>
  // 讓根層節點也顯示跟子節點一樣的連接線
  :deep(.q-tree > .q-tree__node) {
    // 統一 padding，不論是 child 還是 parent
    padding: 0 0 3px 22px !important;

    // 垂直線
    &::after {
      display: block !important;
    }

    &:last-child::after {
      display: none !important;
    }

    // 水平 L 型連接線
    > .q-tree__node-header::before {
      display: block !important;
      left: -15px !important;
      width: 15px !important;
    }
  }

  :deep(.q-tree__node-header) {
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  }
</style>
