<template>
  <div class="test-websocket-chat">
    <q-page class="q-pa-md">
      <div class="row q-gutter-md">
        <!-- 控制面板 -->
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">WebSocket 聊天室測試</div>
            </q-card-section>

            <q-card-section>
              <div class="row q-gutter-sm">
                <q-btn
                  color="primary"
                  label="建立連線"
                  icon="power"
                  :disable="isConnected"
                  @click="connect"
                />
                <q-btn
                  color="negative"
                  label="中斷連線"
                  icon="power_off"
                  :disable="!isConnected"
                  @click="disconnect"
                />
                <q-btn
                  color="info"
                  label="請求歷史訊息"
                  icon="history"
                  :disable="!isConnected"
                  @click="requestHistory"
                />
              </div>

              <div class="q-mt-md">
                <div>連線狀態: <strong>{{ connectionState }}</strong></div>
                <div>訊息數量: <strong>{{ messages.length }}</strong></div>
                <div>未讀數量: <strong>{{ webSocketChatState.unreadCount }}</strong></div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 訊息列表 -->
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">訊息列表</div>
            </q-card-section>

            <q-card-section>
              <q-scroll-area style="height: 400px">
                <div
                  v-for="msg in messages"
                  :key="msg.message_id"
                  class="q-mb-md q-pa-sm bg-grey-2 rounded"
                >
                  <div class="text-weight-bold text-primary">{{ msg.sender }}</div>
                  <div v-if="msg.type === 'text'">{{ msg.content }}</div>
                  <div v-else-if="msg.type === 'image'">
                    <img
                      v-for="(img, idx) in msg.image_info_list"
                      :key="idx"
                      :src="img.full_path"
                      style="max-width: 200px"
                    />
                  </div>
                  <div class="text-caption text-grey">
                    {{ new Date(msg.timestamp).toLocaleString() }}
                  </div>
                </div>
              </q-scroll-area>
            </q-card-section>
          </q-card>
        </div>

        <!-- 發送訊息 -->
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">發送訊息</div>
            </q-card-section>

            <q-card-section>
              <q-input
                v-model="testMessage"
                label="訊息內容"
                outlined
                :disable="!isConnected"
              />
              <q-btn
                class="q-mt-sm"
                color="primary"
                label="發送"
                icon="send"
                :disable="!isConnected || !testMessage"
                @click="handleSendTest"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>

    <!-- 聊天室元件 -->
    <WebSocketChatroom />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWebSocketChat } from 'src/common/composables/useWebSocketChat'
import { useWebSocketChatStore } from 'src/stores/webSocketChatStore'
import WebSocketChatroom from 'src/common/components/WebSocketChatroom.vue'

const webSocketChatStore = useWebSocketChatStore()
const { webSocketChatState } = storeToRefs(webSocketChatStore)

const {
  isConnected,
  connectionState,
  messages,
  connect,
  disconnect,
  sendText,
  requestHistory
} = useWebSocketChat()

const testMessage = ref('')

function handleSendTest() {
  if (testMessage.value) {
    sendText(testMessage.value)
    testMessage.value = ''
  }
}
</script>

<style lang="scss" scoped>
.test-websocket-chat {
  .rounded {
    border-radius: 8px;
  }
}
</style>
