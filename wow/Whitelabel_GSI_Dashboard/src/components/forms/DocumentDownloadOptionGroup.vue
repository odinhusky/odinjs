<template>
  <div>
    <div v-if="title" class="title-container q-mt-xs row q-col-gutter-md items-center">
      <div class="text-subtitle2 text-bold">{{ title }}</div>
    </div>
    <div class="q-mt-md row">
      <div class="col-4" v-for="item in adminGroup" :key="item.id">
        <q-btn flat fab-mini icon="expand_more" @click="toggleGroupOptions(item)"></q-btn>
        <div v-show="item.showGroupOptions">
          <q-checkbox
            v-if="!hideSelectAll"
            v-model="item.selectAll"
            :label="`${item.title}(${item.agent_code})`"
            :disable="readOnly"
            @update:model-value="toggleSelectAll(item)"
          />
          <div class="row q-ml-xl" v-for="agent in agentGroup[item.id]">
            <q-checkbox
              v-for="agentItem in agent.child"
              :key="agentItem.id"
              v-model="agentItem.groupValue"
              :label="agentItem.title"
              :val="agentItem.id"
              :disable="readOnly"
              :class="{ 'button-style': itemButtonStyle }"
              class="q-mr-lg w-100"
              @update:model-value="handleAgentItemChange(agentItem)"
            >
              <img v-if="openSelectIcon" :src="item.iconLink" />
            </q-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { watch, ref, computed, toRefs, defineEmits, onMounted, watchEffect } from "vue"
  import { QOptionGroupProps } from "quasar"
  import { useI18n } from "vue-i18n"
  import { getDocumentDownloadMasterList, getDocumentDownloadAgentList } from "@/api/documentDownload"

  type QOptionGroupOptions = QOptionGroupProps["options"]
  const props = defineProps({
    parentValue: {
      type: Array<any>,
      required: true,
      default: () => ({})
    },
    groupOptions: {
      type: Object as () => QOptionGroupOptions,
      required: true,
      default: () => ({})
    },
    selectAllLabel: {
      type: String,
      required: false,
      default: ""
    },
    itemButtonStyle: {
      type: Boolean,
      required: false,
      default: false
    },
    hideSelectAll: {
      type: Boolean,
      required: false,
      default: false
    },
    showSelecAllNextToTitle: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ""
    },
    readOnly: {
      type: [Boolean],
      required: false,
      default: () => false
    },
    openSelectIcon: {
      type: Boolean,
      required: false,
      default: ""
    },
    iconLink: {
      type: String,
      required: false,
      default: ""
    }
  })
  const { parentValue, groupOptions, selectAllLabel } = toRefs(props)
  const groupValue = ref(parentValue.value)
  const selectAll = ref(false)
  const selectAllRadio = ref("")
  const adminGroup = ref([])
  const agentGroup = ref([])
  const { t } = useI18n()
  onMounted(async () => {
    const { data: adminList } = await getDocumentDownloadMasterList()
    const { data: agentList } = await getDocumentDownloadAgentList()
    adminGroup.value = adminList.list.map((item) => {
      return { ...item, showGroupOptions: true }
    })
    agentGroup.value = restructureList(agentList.list)
  })

  function restructureList(list: any[]) {
    const restructuredList: any[] = []
    list.forEach((item) => {
      const parentId = item.parent_id
      const parentIndex = restructuredList.findIndex((entry) => entry[parentId])
      if (parentIndex !== -1) {
        restructuredList[parentIndex][parentId].child.push({
          id: item.id,
          agent_code: item.agent_code,
          title: item.title,
          groupValue: ref(false)
        })
      } else {
        const parentObj: any = {}
        parentObj[parentId] = {
          parent_id: parentId,
          child: [
            {
              id: item.id,
              agent_code: item.agent_code,
              title: item.title,
              groupValue: ref(false)
            }
          ]
        }
        restructuredList.push(parentObj)
      }
    })

    return restructuredList
  }
  const toggleSelectAll = (item: any) => {
    const agents = agentGroup.value[item.id][item.id]
    if (agents) {
      agents.child.map((agentItem: any) => {
        agentItem.groupValue = item.selectAll
      })
    }
    emit("update:parentValue", agentGroup.value)
  }

  const toggleGroupOptions = (item) => {
    item.showGroupOptions = !item.showGroupOptions
  }

  const emit = defineEmits(["update:parentValue"])
  const handleAgentItemChange = () => {
    emit("update:parentValue", agentGroup.value)
  }
</script>

<style lang="scss" scoped>
  @import "../../css/_variable.sass";
  ::v-deep(.button-style) {
    margin-top: 1.25rem;
    .q-checkbox__inner {
      display: none;
    }
    .q-checkbox__label {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      border: 0.0625rem solid #3f3c4433;
      padding: 0.5rem 32px;
      border-radius: 62.4375rem;
      img {
        margin-right: 0.5rem;
      }
    }
    &[aria-checked="true"] {
      .q-checkbox__label {
        border-color: $mainColor;
        border-width: 0.125rem;
      }
    }
  }
  ::v-deep(.q-btn--fab-mini) {
    width: 10px;
    min-width: 10px;
  }

  .w-100 {
    width: 100%;
  }
</style>
