<template>
  <q-dialog v-model="modalOpen">
    <q-card class="modal-card card bg-card">
      <q-bar class="bg-card header">
        <div class="text-h6">新增/編輯總代</div>
        <q-space />
        <q-btn icon="close" class="closebtn" @click="modalOpen = false" />
      </q-bar>

      <q-card-section class="">
        <q-form class="q-gutter-md">
          <div class="grid-2fr">
            <div class="custom-form-container">
              <q-item-label class="form-label">總代ID</q-item-label>
              <q-input v-model="agentName" class="custom-form-control" filled />
            </div>

            <div class="custom-form-container">
              <q-item-label class="form-label">*總代帳號</q-item-label>
              <q-input v-model="agentName" class="custom-form-control" filled />
            </div>

            <div class="custom-form-container">
              <q-item-label class="form-label">*密碼</q-item-label>
              <q-input v-model="agentName" class="custom-form-control" filled />
            </div>

            <div class="custom-form-container">
              <q-item-label class="form-label">*確認密碼</q-item-label>
              <q-input v-model="agentName" class="custom-form-control" filled />
            </div>
          </div>

          <div class="grid-3fr">
            <div class="custom-form-container">
              <q-item-label class="form-label">啟/停用</q-item-label>
              <q-input v-model="agentName" class="custom-form-control" filled />
            </div>

            <div class="custom-form-container">
              <q-item-label class="form-label">*帳號狀態</q-item-label>
              <q-input v-model="agentName" class="custom-form-control" filled />
            </div>

            <div class="custom-form-container">
              <q-item-label class="form-label">*二次驗證綁定</q-item-label>
              <q-input v-model="agentName" class="custom-form-control" filled />
            </div>
          </div>
          <div class="custom-form-container" style="background: white">
            <q-item-label class="form-label">總代資訊</q-item-label>
            <div class="grid-2fr" style="padding: 15px">
              <div>
                <q-item-label>總代名稱</q-item-label>
                <q-input v-model="agentName" filled />
              </div>

              <div>
                <q-item-label>聯絡人</q-item-label>
                <q-input v-model="agentName" filled />
              </div>

              <div>
                <q-item-label>手機</q-item-label>
                <q-input v-model="agentName" filled />
              </div>

              <div>
                <q-item-label>Email</q-item-label>
                <q-input v-model="agentName" filled />
              </div>

              <div>
                <q-item-label>Remark</q-item-label>
                <q-input v-model="agentName" filled />
              </div>
            </div>
          </div>

          <div class="custom-form-container">
            <q-item-label class="form-label">可開幣別</q-item-label>
            <q-select
              v-model="selectedCurrency"
              dense
              outlined
              :options="currencies"
              class="custom-form-control"
              multiple
              use-chips
            />
          </div>

          <div class="custom-form-container">
            <q-item-label class="form-label">產品設定</q-item-label>
            <q-select
              v-model="selectedCurrency"
              dense
              outlined
              :options="currencies"
              class="custom-form-control"
              multiple
              use-chips
            />
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn label="Confirm" color="primary" />
            <q-btn label="Back" flat />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref } from "vue"
  import { QDialog, QCard, QCardSection, QBar, QSpace, QBtn, QInput, QSelect, QForm } from "quasar"

  const modalOpen = ref(true) // set to false to close modal by default
  const agentName = ref("")
  const selectedCurrency = ref(null)

  const currencies = ["USD", "EUR", "GBP"] // Add more currencies as needed
</script>

<style scoped>
  .modal-card {
    max-width: 900px !important;
    width: 900px;
    /* Adjust width as necessary */
  }

  .form-label {
    background: #e9e9e9;
    margin: 0;
    padding: 10px;
  }

  .q-dialog {
    max-width: 900px;
  }

  .q-bar {
    padding: 10px;
  }

  .q-btn {
    min-width: 100px;
    /* Adjust button width as necessary */
  }

  .custom-form-control {
    background: white !important;
    border-radius: 10px !important;
    padding: 1em;
  }

  .custom-form-container {
    border: 1px solid lightgray;
    box-shadow: 0px 3px 6px #4a54605f;
  }

  .text-caption {
    margin: 10px 0;
  }

  .card {
    padding: 2.7em;
    border-radius: 4%;
  }

  .bg-card {
    background: #f5f6ff;
  }

  .header {
    padding: 1em;
    margin-bottom: 16px;
    color: #553b85;
  }

  .closebtn {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #0d0df8;
    border: 3px solid;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 800;
    min-width: unset !important;
    margin: 10px;
    padding: 5px;
  }

  @media (min-width: 752px) {
    .grid-2fr {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      font-weight: 500;
    }

    .grid-3fr {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
      font-weight: 500;
    }
  }
</style>
