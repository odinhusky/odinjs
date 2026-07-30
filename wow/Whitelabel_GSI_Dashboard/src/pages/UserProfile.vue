<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <q-card class="card-bg text-white no-shadow" bordered>
          <q-card-section class="text-h6">
            <div class="text-h6">修改個人資料</div>
            <div class="text-subtitle2">Complete your profile</div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section side>
                  <q-avatar size="100px">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                </q-item-section>
                <!-- <q-item-section>
                  <q-btn label="變更照片" class="text-capitalize" rounded color="info"
                         style="max-width: 120px"></q-btn>
                </q-item-section> -->
              </q-item>

              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input v-model="user_details.user_name" dark color="white" dense label="會員名稱" />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input v-model="user_details.email" dark color="white" dense label="會員代碼" />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input v-model="user_details.first_name" dark color="white" dense label="信箱" />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input v-model="user_details.city" dark color="white" dense label="城市" />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input v-model="user_details.post_code" dark color="white" dense label="代理代碼" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn class="text-capitalize bg-info text-white">更新</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <q-card class="card-bg text-white no-shadow" bordered>
          <q-card-section class="text-h6 q-pa-sm">
            <div class="text-h6">變更密碼</div>
          </q-card-section>
          <q-card-section class="q-pa-sm row">
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  v-model="password_dict.current_password"
                  type="password"
                  dark
                  dense
                  outlined
                  color="white"
                  round
                  label="當前密碼"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  v-model="password_dict.new_password"
                  type="password"
                  dark
                  dense
                  outlined
                  color="white"
                  round
                  label="新密碼"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  v-model="password_dict.confirm_new_password"
                  type="password"
                  dark
                  dense
                  outlined
                  round
                  color="white"
                  label="確認密碼"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn class="text-capitalize bg-info text-white">更新</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent } from "vue"

  export default defineComponent({
    name: "UserProfile",
    setup() {
      return {
        user_details: {},
        password_dict: {}
      }
    }
  })
</script>

<style scoped>
  .card-bg {
    background-color: #162b4d;
  }
</style>
