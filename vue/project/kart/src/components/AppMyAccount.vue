<template>
  <div class="root myaccount_root" :class="rootClassObj">
    <main class="main-10">
      <div class="myaccount_title_box">
        <img
          src="@/assets/img/v2/myaccount/myid@2x.png"
          class="myaccount_title_img"
        />
        <p class="myaccount_title">{{ $t('myaccount.title') }}</p>
      </div>

      <!-- 個人設定內容(學生) -->
      <div class="myaccount_settings" v-if="loginType === 'student'">
        <div class="myaccount_tab_line">
          <button class="myaccount_tab profile_tab">
            {{ $t('myaccount.info.mysetting') }}
          </button>
        </div>

        <!-- 餘課數 -->
        <div class="arrange-box1 myaccount_box_unit remiaing_lessions">
          <div class="arrange-lead1 myaccount_box_title">
            {{ $t('myaccount.remaining.remaining_course2') }}
          </div>

          <!-- 計數顯示 -->
          <div class="arrange-content1 myaccount_box_content">
            <!-- 直播數 -->
            <div class="myaacount_remaining_unit">
              <h6 class="myaccount_remaining_title">
                {{ $t('myaccount.info.live_point') }}
              </h6>
              <div class="myaccount_remaining_content">
                <span class="myaccount_remaining_point">{{
                  remaining.points
                }}</span>
                <span class="myaccount_remaining_unit">{{
                  $t('myaccount.remaining.course_unit')
                }}</span>
              </div>
            </div>

            <!-- 一對一 -->
            <div class="myaacount_remaining_unit">
              <h6 class="myaccount_remaining_title">
                {{ $t('myaccount.info.onetoone_point') }}
              </h6>
              <div class="myaccount_remaining_content">
                <span class="myaccount_remaining_point">{{
                  remaining.individual_points
                }}</span>
                <span class="myaccount_remaining_unit">{{
                  $t('myaccount.remaining.course_unit')
                }}</span>
              </div>
            </div>

            <!-- 訂閱到期日 -->
            <div class="myaacount_remaining_unit">
              <h6 class="myaccount_remaining_title">
                {{ $t('myaccount.info.expired_at') }}
              </h6>
              <div class="myaccount_remaining_content">
                <span class="myaccount_remaining_expired_date">{{
                  loginUserSubscribedExpiredAt
                    ? loginUserSubscribedExpiredAt
                    : $t('myaccount.info.not_subscribed')
                }}</span>
              </div>
            </div>
          </div>

          <!-- 連到別頁去的連結 -->
          <div class="myaccount_links myaccount_link_to_pages">
            <!-- 購買堂數 -->
            <router-link
              :to="{
                name: 'purchase',
                params: { lang: this.$route.params.lang },
              }"
              class="trans-btn myaccount_link purchase_lession_link"
              >{{ $t('myaccount.links.purchase_lession') }}</router-link
            >

            <!-- 購買紀錄 -->
            <button
              class="trans-btn myaccount_link purchase_record_link"
              @click.prevent="purchaseRecordLightbox.openOrNot = true"
            >
              {{ $t('myaccount.links.purchase_record') }}
            </button>

            <!-- 報名清單 -->
            <router-link
              :to="{
                name: 'enroll',
                params: { lang: this.$route.params.lang },
              }"
              class="trans-btn myaccount_link enrolled_list_link"
              >{{ $t('myaccount.links.enrolled_list') }}</router-link
            >
          </div>
        </div>

        <!-- 個人資料 -->
        <div class="arrange-box1 myaccount_box_unit profile">
          <div class="arrange-lead1 myaccount_box_title">
            {{ $t('myaccount.info.profile') }}
          </div>

          <!-- 個人資料靜態顯示內容 -->
          <div class="arrange-content1 myaccount_box_content">
            <!-- 手機 -->
            <div class="arrange-box2 profile_group cellphone_data">
              <h6 class="arrange-lead2 profile_lead">
                {{ $t('myaccount.profile.cellphone') }}
              </h6>
              <div class="arrange-content2">
                <span class="profile_content">{{
                  loginUserFullCellphone
                }}</span>
              </div>
            </div>

            <!-- 姓名 -->
            <div class="arrange-box2 profile_group name_data">
              <h6 class="arrange-lead2 profile_lead">
                {{ $t('myaccount.profile.name') }}
              </h6>
              <div class="arrange-content2">
                <span class="profile_content">{{ loginUserName }}</span>
              </div>
            </div>

            <!-- 等級 -->
            <div class="arrange-box2 profile_group level_data">
              <h6 class="arrange-lead2 profile_lead">
                {{ $t('myaccount.profile.level') }}
              </h6>
              <div class="arrange-content2">
                <span class="profile_content">{{
                  loginUserLevel === 'normal'
                    ? $t('role.standard')
                    : loginUserLevel
                }}</span>
              </div>
            </div>

            <!-- 學院 -->
            <div
              class="arrange-box2 profile_group college_data"
              v-if="loginUserIsAcademy"
            >
              <h6 class="arrange-lead2 profile_lead">
                {{ $t('myaccount.profile.college') }}
              </h6>
              <div class="arrange-content2">
                <span class="profile_content">{{
                  loginUserIsAcademy ? $t('role.college_student') : ''
                }}</span>
              </div>
            </div>

            <!-- Email -->
            <div class="arrange-box2 profile_group email_data">
              <h6 class="arrange-lead2 profile_lead">
                {{ $t('myaccount.profile.email') }}
              </h6>
              <div class="arrange-content2">
                <span class="profile_content">{{ loginUserEmail }}</span>
              </div>
            </div>

            <!-- 生日 -->
            <div class="arrange-box2 profile_group birthday_data">
              <h6 class="arrange-lead2 profile_lead">
                {{ $t('myaccount.profile.birthday') }}
              </h6>
              <div class="arrange-content2">
                <span class="profile_content">{{ loginUserBirthday }}</span>
              </div>
            </div>

            <!-- 性別 -->
            <div class="arrange-box2 profile_group gender_data">
              <h6 class="arrange-lead2 profile_lead">
                {{ $t('myaccount.profile.gender') }}
              </h6>
              <div class="arrange-content2 gender-content">
                <!-- 男 -->
                <div class="gender-control disabled-input">
                  <input
                    type="radio"
                    name="gender_input"
                    class="gender-input"
                    v-model="activeGender"
                    id="gender_input_male"
                    value="male"
                  />
                  <label
                    for="gender_input_male"
                    class="gender-label gender_radio_label"
                    >{{ $t('gender.male') }}</label
                  >
                </div>

                <!-- 女 -->
                <div class="gender-control disabled-input">
                  <input
                    type="radio"
                    name="gender_input"
                    class="gender-input"
                    v-model="activeGender"
                    id="gender_input_female"
                    value="female"
                  />
                  <label
                    for="gender_input_female"
                    class="gender-label gender_radio_label"
                    >{{ $t('gender.female') }}</label
                  >
                </div>

                <!-- 其他 -->
                <div class="gender-control disabled-input">
                  <input
                    type="radio"
                    name="gender_input"
                    class="gender-input"
                    v-model="activeGender"
                    id="gender_input_other"
                    value="none"
                  />
                  <label
                    for="gender_input_other"
                    class="gender-label gender_radio_label"
                    >{{ $t('gender.other') }}</label
                  >
                </div>
              </div>
            </div>

            <!-- 密碼 -->
            <div class="arrange-box2 profile_group password_data">
              <h6 class="arrange-lead2 profile_lead">
                {{ $t('myaccount.profile.password') }}
              </h6>
              <div class="arrange-content2">
                <span class="profile_content"></span>
              </div>
            </div>
          </div>

          <!-- 功能性修改連結 -->
          <div class="myaccount_links myaccount_link_to_modify">
            <!-- 修改個人資料 -->
            <button
              class="trans-btn myaccount_link edit_profile_link"
              @click.prevent="editProfileLightbox.openOrNot = true"
            >
              {{ $t('myaccount.links.edit_profile') }}
            </button>

            <!-- 修改密碼 -->
            <button
              class="trans-btn myaccount_link change_password_link"
              @click.prevent="editPasswordLightbox.openOrNot = true"
            >
              {{ $t('myaccount.links.change_password') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 個人設定內容(老師)) -->
      <div class="myaccount_settings" v-if="loginType === 'teacher'">
        <div class="myaccount_tab_line">
          <button class="myaccount_tab profile_tab">
            {{ $t('myaccount.links.change_password') }}
          </button>
        </div>

        <div class="myaccount_box_unit d-block">
          <!-- 新密碼 -->
          <div
            class="password_form_group"
            :class="{ error: teacher.error.password }"
          >
            <label class="password_label" for="new_password">
              <img
                class="password_label_img"
                src="@/assets/img/myaccount/icon_key.png"
              />
              <!-- <span class="password_label_text">{{
                $t('myaccount.password.new_password')
              }}</span> -->
            </label>
            <div class="change_password_control">
              <input
                id="new_password"
                v-model="teacher.password"
                class="change_password_input new_password"
                type="password"
                :placeholder="$t('myaccount.password.enter_new_password')"
              />
              <img
                class="password_error_img"
                src="@/assets/img/login/icon_err@2x.png"
              />
            </div>
          </div>

          <!-- 確認密碼 -->
          <div
            class="password_form_group"
            :class="{ error: teacher.error.password_confirmation }"
          >
            <label class="password_label" for="confirm_password">
              <img
                class="password_label_img"
                src="@/assets/img/myaccount/icon_key.png"
              />
              <!-- <span class="password_label_text">{{
                $t('myaccount.password.repeat_password')
              }}</span> -->
            </label>
            <div class="change_password_control">
              <input
                id="confirm_password"
                v-model="teacher.password_confirmation"
                class="change_password_input confirm_password"
                type="password"
                :placeholder="$t('myaccount.password.repeat_password')"
              />
              <img
                class="password_error_img"
                src="@/assets/img/login/icon_err@2x.png"
              />
            </div>
          </div>

          <!-- 儲存 -->
          <div class="change_password_save_box">
            <button
              class="kart-btn kart-sub change_password_save"
              @click.prevent="requestEditTeacherPassword"
            >
              {{ $t('myaccount.info.save') }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 燈箱 -->
    <template v-if="loginType === 'student'">
      <!-- 修改 個人資料 的燈箱 -->
      <AppLightBox
        v-model="editProfileLightbox.openOrNot"
        :classname="editProfileLightbox.classname"
        :is-show-cancel="editProfileLightbox.isShowCancel"
      >
        <template>
          <div class="edit_content">
            <!-- Title -->
            <h5 class="edit_profile_title">
              {{ $t('myaccount.links.edit_profile') }}
            </h5>

            <!-- 要修改的個人資料內容 -->
            <div class="edit_container">
              <!-- 手機 -->
              <div class="arrange-box2 profile_group">
                <h6 class="arrange-lead2 profile_lead">
                  {{ $t('myaccount.profile.cellphone') }}
                </h6>
                <div class="arrange-content2">
                  <span class="profile_content">{{
                    loginUserFullCellphone
                  }}</span>
                </div>
              </div>

              <!-- 姓名 -->
              <div class="arrange-box2 profile_group">
                <h6 class="arrange-lead2 profile_lead">
                  {{ $t('myaccount.profile.name') }}
                </h6>
                <div class="arrange-content2 edit_name">
                  <input
                    type="text"
                    v-model="editProfileLightbox.data.name"
                    name="edit_name_input"
                    class="kart-input edit_profile_input edit_name_input"
                    :class="{ error: error.name }"
                  />
                </div>
              </div>

              <!-- 等級 -->
              <div class="arrange-box2 profile_group">
                <h6 class="arrange-lead2 profile_lead">
                  {{ $t('myaccount.profile.level') }}
                </h6>
                <div class="arrange-content2 edit_level">
                  <span class="profile_content">{{
                    loginUserLevel === 'normal'
                      ? $t('role.standard')
                      : loginUserLevel
                  }}</span>
                </div>
              </div>

              <!-- 訂閱到期日 -->
              <div class="arrange-box2 profile_group">
                <h6 class="arrange-lead2 profile_lead">
                  {{ editExpiredLeadingText }}
                </h6>
                <div class="arrange-content2 edit_expired_at">
                  <span class="profile_content">{{
                    loginUserSubscribedExpiredAt
                      ? loginUserSubscribedExpiredAt
                      : $t('myaccount.info.not_subscribed')
                  }}</span>
                </div>
              </div>

              <!-- Email -->
              <div class="arrange-box2 profile_group">
                <h6 class="arrange-lead2 profile_lead">
                  {{ $t('myaccount.profile.email') }}
                </h6>
                <div class="arrange-content2 edit_email">
                  <input
                    type="text"
                    v-model="editProfileLightbox.data.email"
                    name="edit_email_input"
                    class="kart-input edit_profile_input edit_email_input"
                    :class="{ error: error.email }"
                  />
                </div>
              </div>

              <!-- 生日 -->
              <div class="arrange-box2 profile_group">
                <h6 class="arrange-lead2 profile_lead">
                  {{ $t('myaccount.profile.birthday') }}
                </h6>
                <div class="arrange-content2 edit_birthday">
                  <input
                    type="text"
                    v-model="editProfileLightbox.data.birthday"
                    name="edit_birthday_input"
                    class="kart-input edit_profile_input edit_birthday_input"
                    :placeholder="$t('placeholder.birthday')"
                    :class="{ error: error.birthday }"
                  />
                </div>
              </div>

              <!-- 性別 -->
              <div class="arrange-box2 profile_group">
                <h6 class="arrange-lead2 profile_lead">
                  {{ $t('myaccount.profile.gender') }}
                </h6>

                <div class="arrange-content2 edit_gender">
                  <!-- 男 -->
                  <div class="gender-control">
                    <input
                      type="radio"
                      name="gender_input"
                      class="gender-input edit_gender_input"
                      v-model="editProfileLightbox.data.gender"
                      id="edit_gender_input_male"
                      value="male"
                    />
                    <label
                      for="edit_gender_input_male"
                      class="gender-label gender_radio_label"
                      >{{ $t('gender.male') }}</label
                    >
                  </div>

                  <!-- 女 -->
                  <div class="gender-control">
                    <input
                      type="radio"
                      name="gender_input"
                      class="gender-input edit_gender_input"
                      v-model="editProfileLightbox.data.gender"
                      id="edit_gender_input_female"
                      value="female"
                    />
                    <label
                      for="edit_gender_input_female"
                      class="gender-label gender_radio_label"
                      >{{ $t('gender.female') }}</label
                    >
                  </div>

                  <!-- 其他 -->
                  <div class="gender-control">
                    <input
                      type="radio"
                      name="gender_input"
                      class="gender-input edit_gender_input"
                      v-model="editProfileLightbox.data.gender"
                      id="edit_gender_input_other"
                      value="none"
                    />
                    <label
                      for="edit_gender_input_other"
                      class="gender-label gender_radio_label"
                      >{{ $t('gender.other') }}</label
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 按鈕們 -->
            <div class="btn-group">
              <!-- 取消按鈕 -->
              <button
                class="kart-btn kart-gray edit_lightbox_btn cancel_edit_mode"
                @click.prevent="editProfileLightbox.openOrNot = false"
              >
                {{ $t('system_message.cancel') }}
              </button>

              <!-- 確認按鈕 -->
              <button
                class="kart-btn kart-sub edit_lightbox_btn confirm_edit_change"
                @click.prevent="requestEditProfile"
              >
                {{ $t('system_message.confirm') }}
              </button>
            </div>
          </div>
        </template>
      </AppLightBox>

      <!-- 修改 密碼 的燈箱 -->
      <AppLightBox
        v-model="editPasswordLightbox.openOrNot"
        :classname="editPasswordLightbox.classname"
        :is-show-cancel="editPasswordLightbox.isShowCancel"
      >
        <template>
          <div class="edit_content">
            <!-- Title -->
            <h5 class="edit_profile_title">
              {{ $t('myaccount.password.change_password') }}
            </h5>

            <!-- 要修改的個人資料內容 -->
            <div class="edit_container">
              <!-- 密碼 -->
              <div class="arrange-box2 profile_group">
                <input
                  type="password"
                  v-model="editPasswordLightbox.data.password"
                  name="edit_name_input"
                  class="kart-input edit_password_input edit_password_input"
                  :class="{ error: error.password }"
                  :placeholder="$t('placeholder.password')"
                />
              </div>

              <!-- 密碼確認 -->
              <div class="arrange-box2 profile_group">
                <input
                  type="password"
                  v-model="editPasswordLightbox.data.password_confirmation"
                  name="password_confirm"
                  class="kart-input edit_password_input edit_password_confirm_input"
                  :class="{ error: error.password_confirm }"
                  :placeholder="$t('placeholder.passwordconfirm')"
                />
              </div>
            </div>

            <!-- 按鈕們 -->
            <div class="btn-group">
              <!-- 取消按鈕 -->
              <button
                class="kart-btn kart-gray edit_lightbox_btn cancel_edit_mode"
                @click.prevent="editPasswordLightbox.openOrNot = false"
              >
                {{ $t('system_message.cancel') }}
              </button>

              <!-- 確認按鈕 -->
              <button
                class="kart-btn kart-sub edit_lightbox_btn confirm_edit_change"
                @click.prevent="requestEditPassword"
              >
                {{ $t('system_message.confirm') }}
              </button>
            </div>
          </div>
        </template>
      </AppLightBox>

      <!-- 購買清單的燈箱 -->
      <AppLightBox
        v-model="purchaseRecordLightbox.openOrNot"
        :classname="purchaseRecordLightbox.classname"
        :is-show-cancel="purchaseRecordLightbox.isShowCancel"
      >
        <template>
          <div class="w-100 h-100 overflow-y-auto">
            <div class="purchase_record_content">
              <!-- 沒有紀錄要顯示的文字 -->
              <span
                v-if="purchaseRecordLightbox.purchaseRecordList.length === 0"
                class="no_purchase_record"
                >{{ $t('myaccount.info.no_purchase_record') }}</span
              >

              <!-- 購買紀錄的內容 -->
              <div class="purchase_record_container">
                <!-- 表格 -->
                <table class="purchase_record_table d-mobile-none mb-4 w-100">
                  <thead>
                    <!-- 銷售日期 -->
                    <th class="purchase_record_th">
                      {{ $t('myaccount.order.sale_date') }}
                    </th>
                    <!-- 銷售單號 -->
                    <th class="purchase_record_th">
                      {{ $t('myaccount.order.sale_id') }}
                    </th>
                    <!-- 銷售品項 -->
                    <th class="purchase_record_th">
                      {{ $t('myaccount.order.item_name') }}
                    </th>
                    <!-- 購買堂數 -->
                    <th class="purchase_record_th">
                      {{ $t('myaccount.order.courses_number') }}
                    </th>
                    <!-- 銷售金額 -->
                    <th class="purchase_record_th">
                      {{ $t('myaccount.order.sale_price') }}
                    </th>
                    <!-- 訂單狀態 -->
                    <th class="purchase_record_th">
                      {{ $t('myaccount.order.order_status') }}
                    </th>
                  </thead>

                  <tbody>
                    <tr
                      v-for="record in purchaseRecordLightbox.purchaseRecordList"
                      :key="record.id"
                    >
                      <!-- 銷售日期 -->
                      <td class="purchase_record_td">
                        {{ record.created_at | formatDate }}
                      </td>
                      <!-- 銷售單號 -->
                      <td class="purchase_record_td">{{ record.uuid }}</td>
                      <!-- 銷售品項 -->
                      <td class="purchase_record_td">{{ record.name }}</td>
                      <!-- 購買堂數 -->
                      <td class="purchase_record_td">{{ record.spec }}</td>
                      <!-- 銷售金額 -->
                      <td class="purchase_record_td">
                        {{ record.sale_price }}
                      </td>
                      <!-- 訂單狀態 -->
                      <td class="purchase_record_td">
                        {{ record.status_text }}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- mobile 會顯示的內容 -->
                <div
                  class="purchase_record_unit_container d-none d-mobile-block mb-4 w-100"
                >
                  <div
                    v-for="record in purchaseRecordLightbox.purchaseRecordList"
                    :key="record.id"
                    class="purchase_record_unit"
                  >
                    <!-- 銷售日期 -->
                    <span class="purchase_record_line">
                      {{ $t('myaccount.order.sale_date') }} :
                      {{ record.created_at | formatDate }}
                    </span>

                    <!-- 銷售單號 -->
                    <span class="purchase_record_line">
                      {{ $t('myaccount.order.sale_id') }} : {{ record.uuid }}
                    </span>
                    <!-- 銷售品項 -->
                    <span class="purchase_record_line">
                      {{ $t('myaccount.order.item_name') }} : {{ record.name }}
                    </span>
                    <!-- 購買堂數 -->
                    <span class="purchase_record_line">
                      {{ $t('myaccount.order.courses_number') }} :
                      {{ record.spec }}
                    </span>
                    <!-- 銷售金額 -->
                    <span class="purchase_record_line">
                      {{ $t('myaccount.order.sale_price') }} :
                      {{ record.sale_price }}
                    </span>
                    <!-- 訂單狀態 -->
                    <span class="purchase_record_line">
                      {{ $t('myaccount.order.order_status') }} :
                      {{ record.status_text }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 按鈕們 -->
            <div class="btn-group">
              <!-- 取消按鈕 -->
              <button
                class="kart-btn kart-gray purchase_record_btn cancel_edit_mode"
                @click.prevent="purchaseRecordLightbox.openOrNot = false"
              >
                {{ $t('system_message.cancel') }}
              </button>

              <!-- 前往購買堂數的按鈕 -->
              <router-link
                class="kart-btn kart-sub purchase_record_btn go_purchase_page"
                :to="{
                  name: 'purchase',
                  params: { lang: this.$route.params.lang },
                }"
              >
                {{ $t('myaccount.links.purchase_lession') }}
              </router-link>
            </div>
          </div>
        </template>
      </AppLightBox>
    </template>
  </div>
</template>

<script>
// Resources
import {
  checkEmail,
  checkIsEmpty,
  checkDateFormat,
} from '@/plugins/checker.js';
import {
  studentRemainingPath,
  studentChangeSettingPath,
  studentChangePasswordPath,
  fetchPurchaseRecordListPath,
  teacherChangePasswordPath,
} from '@/store/ajax-path.js';
import { axiosSuccessHint } from '@/plugins/utility.js';
import commonMixinObj from '@/mixins/common.js';

// Component
import AppLightBox from '@/components/AppLightBox.vue';

export default {
  name: 'AppMyAccount',
  components: {
    AppLightBox,
  },
  mixins: [commonMixinObj],
  props: {
    // i18nLanguage: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    return {
      remaining: {
        // 直播餘課數
        points: 0,
        // 一對一餘課數
        individual_points: 0,
      },
      // 畫面上選定的性別是 male | female | none
      activeGender: '',
      teacher: {
        password: '',
        password_confirmation: '',
        error: {
          password: false,
          password_confirmation: false,
        },
      },
      // 編輯個人資料的燈箱
      editProfileLightbox: {
        openOrNot: false,
        classname: 'edit_profile_lightbox',
        isShowCancel: false,
        data: {
          name: '',
          email: '',
          birthday: '',
          gender: '',
        },
      },
      // 編輯個人資料的燈箱
      editPasswordLightbox: {
        openOrNot: false,
        classname: 'edit_password_lightbox',
        isShowCancel: false,
        data: {
          password: '',
          password_confirmation: '',
        },
      },
      // 購買紀錄資料的燈箱
      purchaseRecordLightbox: {
        openOrNot: false,
        classname: 'purchase_record_lightbox',
        isShowCancel: false,
        // 購買清單列表
        purchaseRecordList: [],
      },
      // input 的 error
      error: {
        name: false,
        email: false,
        birthday: false,
        password: false,
        password_confirmation: false,
      },
    };
  },
  created() {
    // 頁面元件初始化
    this.init();
  },
  computed: {
    /**
     * @author odin
     * @description 頁面元件初始化
     * @return {string} 回傳燈箱中 訂閱到期日 的 leading text
     */
    editExpiredLeadingText() {
      let leadingText = '';

      switch (this.i18n) {
        case 'tw':
          leadingText = `${this.$t('myaccount.info.expired_at').slice(0, 2)}:`;
          break;
        case 'cn':
          leadingText = `${this.$t('myaccount.info.expired_at').slice(0, 2)}:`;
          break;
        case 'en':
          leadingText = `${this.$t('myaccount.info.expired_at')}`;
          break;
      }

      return leadingText;
    },
  },
  methods: {
    /**
     * @author odin
     * @description 頁面元件初始化
     */
    init() {
      // 關閉 notify
      this.$bus.$emit('notify:off');

      if (this.loginType === 'student') {
        // 取得剩餘課堂
        this.fetchRemainingCourse();
        // 取得購買清單
        this.fetchPurchaseRecordList();
        // 放置 gender
        this.handleGender();
        // 放置燈箱的初始值
        this.handleEditProfileLightboxInitValue();
      }
    },

    /**
     * @author odin
     * @description 清空老師修改密碼相關內容
     */
    resetEditTeacherPassword() {
      this.teacher.password = '';
      this.teacher.password_confirmation = '';
      this.teacher.error.password = false;
      this.teacher.error.password_confirmation = false;
    },

    /**
     * @author odin
     * @description 判斷性別的data
     */
    handleGender() {
      this.activeGender =
        this.loginUserGender === '' ? 'none' : this.loginUserGender;
    },

    /**
     * @author odin
     * @description 處理 修改個人資料燈箱內的資料初始狀態
     */
    handleEditProfileLightboxInitValue() {
      // 姓名
      this.editProfileLightbox.data.name = this.loginUserName;
      this.editProfileLightbox.data.email = this.loginUserEmail;
      this.editProfileLightbox.data.birthday = this.loginUserBirthday;
      this.editProfileLightbox.data.gender =
        this.loginUserGender === '' ? 'none' : this.loginUserGender;
    },

    /**
     * @author odin
     * @param {object} res ajax 回傳成功的內容
     * @description 處理 購物車內的課程物件
     */
    handleRemainingCoursesData(res) {
      console.log('remainingRes', res);
      const remaingData = res.data.data;

      this.remaining.points = remaingData.points;
      this.remaining.individual_points = remaingData.individual_points;
    },

    /**
     * @author odin
     * @param {object} res ajax 回傳成功的內容
     * @description 處理 購物清單的資料
     */
    handlePurchaseRecordListData(res) {
      this.purchaseRecordLightbox.purchaseRecordList = res.data.data;
    },

    /**
     * @author odin
     * @description 驗證資料是否正確
     */
    validationEditProfile() {
      // 檢查 姓名
      if (!checkIsEmpty(this.editProfileLightbox.data.name)) {
        console.log('Name Validation Pass');
        // 錯誤提示
        this.error.name = false;
      } else {
        // 錯誤提示
        this.error.name = true;
        return false;
      }

      // 檢查 email
      if (
        checkEmail(this.editProfileLightbox.data.email) &&
        !checkIsEmpty(this.editProfileLightbox.data.email)
      ) {
        console.log('Email Validation Pass');
        // 錯誤提示
        this.error.email = false;
      } else {
        // 錯誤提示
        this.error.email = true;

        return false;
      }

      // 檢查 生日
      if (!checkDateFormat(this.editProfileLightbox.data.birthday)) {
        // 錯誤提示
        this.error.birthday = true;
        return false;
      } else if (checkIsEmpty(this.editProfileLightbox.data.birthday)) {
        // 錯誤提示
        this.error.birthday = true;

        return false;
      } else {
        console.log('Birthday Validation Pass');

        // 錯誤提示
        this.error.birthday = false;
      }

      // 都通過檢查
      return true;
    },

    /**
     * @author odin
     * @description 驗證資料是否正確
     */
    validationEditPassword() {
      // 檢查 密碼
      if (checkIsEmpty(this.editPasswordLightbox.data.password)) {
        // 錯誤提示
        this.error.password = true;
        this.error.password_confirm = false;

        return false;
      } else if (
        checkIsEmpty(this.editPasswordLightbox.data.password_confirm)
      ) {
        // 錯誤提示
        this.error.password = false;
        this.error.password_confirm = true;

        return false;
      } else if (
        this.editPasswordLightbox.data.password !==
        this.editPasswordLightbox.data.password_confirm
      ) {
        // 錯誤提示
        this.error.password = true;
        this.error.password_confirm = true;

        return false;
      } else {
        console.log('Password/Password-Confirm Validation Pass');
        // 錯誤提示
        this.error.password = false;
        this.error.password_confirm = false;
      }

      return true;
    },

    /**
     * @author odin
     * @description 驗證資料是否正確
     */
    validationEditTeacherPassword() {
      // 檢查 密碼
      if (checkIsEmpty(this.teacher.password)) {
        // 錯誤提示
        this.teacher.error.password = true;
        this.teacher.error.password_confirmation = false;

        return false;
      } else if (checkIsEmpty(this.teacher.password_confirmation)) {
        // 錯誤提示
        this.teacher.error.password = false;
        this.teacher.error.password_confirmation = true;

        return false;
      } else if (this.teacher.password !== this.teacher.password_confirmation) {
        // 錯誤提示
        this.teacher.error.password = true;
        this.teacher.error.password_confirmation = true;

        return false;
      } else {
        console.log('Password/Password-Confirm Validation Pass');
        // 錯誤提示
        this.teacher.error.password = false;
        this.teacher.error.password_confirmation = false;
      }

      return true;
    },

    /**
     * @author odin
     * @description 確認要修改的個人資料格式是否正確，沒錯的話就打API
     */
    async requestEditProfile() {
      // 開啟 loading
      this.$bus.$emit('loading:on');
      console.log('requestEditProfile');

      const allPass = this.validationEditProfile();

      console.log('allPass', allPass);

      if (allPass) {
        try {
          const res = await this.axios({
            url: studentChangeSettingPath,
            method: 'put',
            headers: {
              Authorization: this.loginToken,
            },
            data: {
              name: this.editProfileLightbox.data.name,
              email: this.editProfileLightbox.data.email,
              gender: this.editProfileLightbox.data.gender,
              birthday: this.editProfileLightbox.data.birthday,
            },
          });

          if (res.data.data || res.data.status) {
            console.log('requestEditProfile Success');
            console.log('requestEditProfile res => ', res);

            // 更新 store 資料
            this.$store.dispatch('updateUserData', res.data.data);
            // 關閉燈箱
            this.editProfileLightbox.openOrNot = false;
            // 提示成功訊息
            this.$bus.$emit(
              'notify:message',
              this.$t('system_message.change_info_success'),
            );

            setTimeout(() => {
              // 重新整理
              this.reload();
            }, 1000);
          }
        } catch (err) {
          console.log(
            'requestEditProfile axios error response => ',
            err.response,
          );
          console.log(
            'requestEditProfile axios error response message=> ',
            err.response.data.message,
          );

          // 燈箱顯示
          this.$bus.$emit('notify:message', err.response.data.message || err);
        }
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description 確認要修改的個人資料格式是否正確，沒錯的話就打API
     */
    async requestEditPassword() {
      // 開啟 loading
      this.$bus.$emit('loading:on');
      console.log('requestEditPassword');

      const allPass = this.validationEditPassword();

      console.log('allPass', allPass);

      if (allPass) {
        try {
          const res = await this.axios({
            url: studentChangePasswordPath,
            method: 'put',
            headers: {
              Authorization: this.loginToken,
            },
            data: {
              password: this.editPasswordLightbox.data.password,
              password_confirmation: this.editPasswordLightbox.data
                .password_confirmation,
            },
          });

          if (res.data.data || res.data.status) {
            console.log('requestEditPassword Success');
            console.log('requestEditPassword res => ', res);

            // 關閉燈箱
            this.editPasswordLightbox.openOrNot = false;

            // 提示成功訊息
            this.$bus.$emit(
              'notify:message',
              this.$t('system_message.change_password_success'),
            );
          }
        } catch (err) {
          console.log(
            'requestEditPassword axios error response => ',
            err.response,
          );
          console.log(
            'requestEditPassword axios error response message=> ',
            err.response.data.message,
          );

          // 燈箱顯示
          this.$bus.$emit('notify:message', err.response.data.message || err);
        }
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description 確認要修改的個人資料格式是否正確，沒錯的話就打API
     */
    async requestEditTeacherPassword() {
      // 開啟 loading
      this.$bus.$emit('loading:on');
      console.log('requestEditTeacherPassword');

      const allPass = this.validationEditTeacherPassword();

      console.log('allPass', allPass);

      if (allPass) {
        try {
          const res = await this.axios({
            url: teacherChangePasswordPath,
            method: 'put',
            headers: {
              Authorization: this.loginToken,
            },
            data: {
              password: this.teacher.password,
              password_confirmation: this.teacher.password_confirmation,
            },
          });

          if (res.data.data || res.data.status) {
            console.log('requestEditTeacherPassword Success');
            console.log('requestEditTeacherPassword res => ', res);

            // 清空內容
            this.resetEditTeacherPassword();

            // 提示成功訊息
            this.$bus.$emit(
              'notify:message',
              this.$t('system_message.change_password_success'),
            );
          }
        } catch (err) {
          console.log(
            'requestEditPassword axios error response => ',
            err.response,
          );
          console.log(
            'requestEditPassword axios error response message=> ',
            err.response.data.message,
          );

          // 燈箱顯示
          this.$bus.$emit('notify:message', err.response.data.message || err);
        }
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description 取得這個使用者的剩餘課程
     */
    async fetchRemainingCourse() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: studentRemainingPath,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchRemainingCourse', res);

          // 資料處理
          this.handleRemainingCoursesData(res);
        }
      } catch (err) {
        const message = err.response.data.message;

        // 修改密碼成功
        if (message) {
          // 燈箱顯示
          this.$bus.$emit('notify:message', message);
        }
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },

    /**
     * @author odin
     * @description 取得這個使用者的剩餘課程
     */
    async fetchPurchaseRecordList() {
      // 開啟 loading
      this.$bus.$emit('loading:on');

      try {
        const res = await this.axios({
          url: fetchPurchaseRecordListPath,
          method: 'get',
          headers: {
            Authorization: this.loginToken,
          },
        });

        if (res.data.data || res.data.status) {
          axiosSuccessHint('fetchPurchaseRecordList', res);

          // 資料處理
          this.handlePurchaseRecordListData(res);
        }
      } catch (err) {
        const message = err.response.data.message;

        // 修改密碼成功
        if (message) {
          // 燈箱顯示
          this.$bus.$emit('notify:message', message);
        }
      }

      // 關閉 loading
      this.$bus.$emit('loading:off');
    },
  },
};
</script>
