<template>
  <q-dialog>
    <q-card class="custom-modal">
      <div class="title text-h6 q-px-lg q-py-md">新增/編輯帳號</div>
      <q-scroll-area class="q-px-lg" style="height: 450px; max-height: 450px; margin-right: 2px">
        <div class="two-col-grid">
          <q-card>
            <div class="custom-card-title q-pa-sm">帳號</div>
            <q-card-section>
              <q-input class="custom-input q-pb-sm" outlined />
              <div class="text-red">禁止輸入( ) / ' * #等特殊字元</div>
            </q-card-section>
          </q-card>
          <q-card class="col-4">
            <div class="custom-card-title q-pa-sm">修改密碼</div>
            <q-card-section>
              <q-input class="custom-input q-pb-sm" outlined />
              <div class="text-red">禁止輸入( ) / ' * #等特殊字元</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="three-col-grid">
          <q-card>
            <div class="custom-card-title q-pa-sm">啟/停用</div>
            <q-card-section>
              <q-input class="custom-input q-pb-sm" outlined />
            </q-card-section>
          </q-card>
          <q-card>
            <div class="custom-card-title q-pa-sm">帳號狀態</div>
            <q-card-section>
              <q-input class="custom-input q-pb-sm" outlined />
            </q-card-section>
          </q-card>
          <q-card>
            <div class="custom-card-title q-pa-sm">二次驗證綁定</div>
            <q-card-section>
              <q-input class="custom-input q-pb-sm" outlined />
            </q-card-section>
          </q-card>
        </div>

        <div class="q-pb-lg">
          <q-card>
            <div class="custom-card-title q-pa-sm">工單設定</div>
            <q-card-section>
              <div class="three-col-grid input-col-grid">
                <div>
                  <div>*類型</div>
                  <q-input class="custom-input q-pb-sm" outlined />
                </div>
                <div>
                  <div>*進度</div>
                  <q-input class="custom-input q-pb-sm" outlined />
                </div>
                <div>
                  <div>*Group</div>
                  <q-input class="custom-input q-pb-sm" outlined />
                </div>
                <div>
                  <div>*開發人員</div>
                  <q-input class="custom-input q-pb-sm" outlined />
                </div>
                <div>
                  <div>*評估人員</div>
                  <q-input class="custom-input q-pb-sm" outlined />
                </div>
                <div>
                  <div>*測試人員</div>
                  <q-input class="custom-input q-pb-sm" outlined />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="q-pb-lg">
          <q-card>
            <div class="custom-card-title q-pa-sm">Remark</div>
            <q-card-section>
              <q-input type="textarea" class="custom-input q-pb-sm" outlined />
            </q-card-section>
          </q-card>
        </div>

        <div class="q-pb-lg">
          <q-card>
            <div class="custom-card-title q-pa-sm">The Message For Customer</div>
            <q-card-section>
              <q-input type="textarea" class="custom-input q-pb-sm" outlined />
            </q-card-section>
          </q-card>
        </div>

        <div class="q-pb-sm">
          <q-card>
            <div class="custom-card-title q-pa-sm">Description</div>
            <q-card-section>
              <q-editor v-model="qeditor" :dense="$q.screen.lt.md" :toolbar="tools" :fonts="fonts" />
            </q-card-section>
          </q-card>
        </div>
      </q-scroll-area>
      <!-- <div class="q-pb-lg">
          <q-card class="col-12">
            <div class="custom-card-title q-pa-sm">帳號</div>
            <q-card-section>
              <div class="two-col-grid input-col-grid">
                <div class="flex-column">
                  <div class="custom-box-label">帳號管理</div>
                  <button class="custom-box">總代帳號管理-查看/編輯</button>
                  <button class="custom-box">總代帳號管理-查看/編輯</button>
                  <button class="custom-box">總代帳號管理-查看/編輯</button>
                </div>
                <div class="flex-column">
                  <div class="custom-box-label">統計報表</div>
                  <button class="custom-box">總代帳號管理-查看/編輯</button>
                  <button class="custom-box">總代帳號管理-查看/編輯</button>
                  <button class="custom-box">總代帳號管理-查看/編輯</button>
                </div>
                <div class="flex-column">
                  <div class="custom-box-label">代理管理</div>
                  <button class="custom-box">代帳號管理-查看/編輯</button>
                  <button class="custom-box">權限設定-查看/編輯</button>
                </div>
                <div class="flex-column">
                  <div class="custom-box-label">統計報表</div>
                  <button class="custom-box">工單查詢-查看</button>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div> -->

      <div class="button-grid q-px-lg q-py-md">
        <q-btn v-close-popup outline label="取消" class="button-cancel col-5" />
        <q-btn v-close-popup label="確定" class="button-submit col-5" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
  import { defineComponent, ref } from "vue"
  import { useQuasar } from "quasar"
  const qeditor = ref("")
  export default defineComponent({
    name: "ActionDialog",
    setup() {
      const $q = useQuasar()
      const tools = ref([
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: "only-icons",
            options: ["left", "center", "right", "justify"]
          },
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            options: ["left", "center", "right", "justify"]
          }
        ],
        ["bold", "italic", "strike", "underline", "subscript", "superscript"],
        ["token", "hr", "link", "custom_btn"],
        ["print", "fullscreen"],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: "no-icons",
            options: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "code"]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: "no-icons",
            options: ["size-1", "size-2", "size-3", "size-4", "size-5", "size-6", "size-7"]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: "no-icons",
            options: [
              "default_font",
              "arial",
              "arial_black",
              "comic_sans",
              "courier_new",
              "impact",
              "lucida_grande",
              "times_new_roman",
              "verdana"
            ]
          },
          "removeFormat"
        ],
        ["quote", "unordered", "ordered", "outdent", "indent"],

        ["undo", "redo"],
        ["viewsource"]
      ])
      const fonts = ref({
        arial: "Arial",
        arial_black: "Arial Black",
        comic_sans: "Comic Sans MS",
        courier_new: "Courier New",
        impact: "Impact",
        lucida_grande: "Lucida Grande",
        times_new_roman: "Times New Roman",
        verdana: "Verdana"
      })
      return {
        qeditor,
        tools,
        fonts
      }
    }
  })
</script>

<style scoped>
  .q-dialog__inner > div::-webkit-scrollbar {
    display: none;
  }

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

  .two-col-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  .three-col-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  @media screen and (max-width: 600px) {
    .two-col-grid,
    .three-col-grid {
      grid-template-columns: 1fr;
    }

    .input-col-grid {
      grid-template-columns: 1fr 1fr !important;
    }
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
  }

  .custom-label {
    color: black;
  }

  .custom-box-label {
    padding: 2px 8px;
    color: #553b85;
  }

  .custom-box {
    background: white;
    border: none;
    border-radius: 4px;
    margin-bottom: 4px;
    padding: 2px 8px;
    text-align: left;
    cursor: pointer;
  }

  .button-submit {
    background: #0d0df8;
    color: #aeaefd;
    border-radius: 8px;
  }

  .button-cancel {
    border: 1px solid #0d0df8;
    color: #0d0df8;
    border-radius: 8px;
  }

  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  :deep(.q-editor__toolbar-group) {
    display: flex;
  }

  :deep(.q-scrollarea__content) {
    position: unset !important;
  }

  :deep(.q-dialog__inner > div) {
    overflow: unset !important;
  }

  :deep(.q-dialog__inner--minimized > div) {
    max-height: none !important;
  }
</style>
