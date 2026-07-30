<template>
  <HeaderTitleBack v-if="isDown.phone" titleI18n="member.kyc.kyc_record" variant="green-member">
    <div class="profile-container h5" v-if="step === 1">
      <div>
        <div class="top-area">
          <p class="label">
            <span class="title">{{ $t("member.kyc.kyc_status") }}:</span>
            <span>{{ $t(KYC_VERIFIED.I18nKeys[kycStatus]) }}</span>
          </p>
          <q-btn flat class="top-btn" :disabled="!canGoToStep2" @click="goStep(2)">{{
            $t("member.kyc.kyc_verify")
          }}</q-btn>
        </div>
        <div class="profile-table" style="position: relative">
          <!-- Method 1: Skeleton Loading (recommended for better UX) -->
          <div v-if="isLoading" class="profile-table-loading">
            <div class="profile-table-row-skeleton" v-for="n in 3" :key="n">
              <div class="skeleton-header">
                <q-skeleton type="text" width="80px" height="16px" />
                <q-skeleton type="text" width="60px" height="16px" />
                <q-skeleton type="text" width="100px" height="16px" />
              </div>
              <div class="skeleton-content">
                <q-skeleton type="text" width="120px" height="14px" />
                <q-skeleton type="text" width="80px" height="14px" />
                <q-skeleton type="text" width="150px" height="14px" />
              </div>
            </div>
          </div>

          <!-- Actual data when not loading -->
          <template v-else-if="kycState.list && kycState.list.length > 0">
            <ul class="profile-table-row" v-for="(itemData, key) in kycState.list" :key="key">
              <li>
                <span>{{ columns[0].label }}</span>
                <span>{{ itemData.number }}</span>
              </li>
              <div class="divider"></div>
              <li>
                <span>{{ columns[1].label }}</span>
                <span>{{ $t(KYC_TOTAL_STATUS_CODE.I18nKeys[itemData.status as KYC_STATUS_CODE.Enums]) }}</span>
              </li>
              <div class="divider"></div>
              <li>
                <span>{{ columns[2].label }}</span>
                <span>{{ itemData.comment }}</span>
              </li>
            </ul>
          </template>

          <!-- No data state -->
          <div v-else class="no-data-container">
            <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
            <span>{{ $t("tableHeader.no_data") }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-container h5" v-else-if="step === 2">
      <q-form ref="formRef" class="profile-body">
        <div class="profile-row w-full flex flex-direction-column flex-wrap gap-4">
          <p class="profile-title">{{ `KYC ${$t("menu.profile")}` }}</p>
          <!-- 手機自訂欄位 -->
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="userKycInfoForm.profile.first_name"
              dense
              :placeholder="`${$t('member.kyc.first_name')}`"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star"></p>
            <q-input
              v-model="userKycInfoForm.profile.middle_name"
              dense
              :placeholder="$t('member.kyc.middle_name')"
              bottom-slots
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="userKycInfoForm.profile.last_name"
              dense
              :placeholder="$t('member.kyc.last_name')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-select
              v-model="userKycInfoForm.profile.nationality"
              :options="NATIONAL.Dropdown.value"
              :label="$t('member.register.nationality')"
              :rules="[Rules.required()]"
              emit-value
              map-options
              dense
              clearable
            >
            </q-select>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="userKycInfoForm.profile.date_of_birth"
              dense
              :placeholder="$t('member.register.birthdate')"
              readonly
              :rules="[Rules.required()]"
            >
              <q-menu>
                <q-date
                  :options="dateOptions"
                  v-model="userKycInfoForm.profile.date_of_birth"
                  mask="YYYY-MM-DD"
                  minimal
                  color="primary"
                  :rules="[Rules.required()]"
                />
              </q-menu>
            </q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="userKycInfoForm.profile.place_of_birth"
              dense
              :placeholder="$t('member.register.place_of_birth')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-select
              v-model="userKycInfoForm.profile.document_type"
              :options="ID_TYPE.Dropdown.value"
              :label="$t('member.kyc.type_of_id')"
              :rules="[Rules.required()]"
              emit-value
              map-options
              dense
              clearable
              bottom-slots
            >
            </q-select>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <!-- <q-input v-model="userInfoForm2.name" dense :placeholder="$t('member.register.source_of_income')"></q-input> -->
            <q-select
              v-model="userKycInfoForm.profile.source_of_income"
              :options="SOURCE_INCOME.Dropdown.value"
              :label="$t('member.register.source_of_income')"
              :rules="[Rules.required()]"
              emit-value
              map-options
              dense
              clearable
              bottom-slots
            >
            </q-select>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-select
              v-model="userKycInfoForm.profile.nature_of_work"
              :options="NATURE_OF_WORK.Dropdown.value"
              :label="$t('member.register.nature_of_work')"
              :rules="[Rules.required()]"
              emit-value
              map-options
              dense
              clearable
              bottom-slots
            >
            </q-select>
          </div>
        </div>
        <div
          v-for="(address, index) in userKycInfoForm.addresses"
          :key="index"
          class="profile-row w-full flex flex-direction-column flex-wrap gap-4"
        >
          <p class="profile-title">
            {{ index === 0 ? `${$t("member.register.currentAddress")}` : `${$t("member.register.permanent_address")}` }}
            <q-checkbox
              v-if="index === 1"
              class="same-as-checkbox"
              v-model="sameAsPresentAddress"
              size="xs"
              :label="$t('common.btn.sameAsCurrentAddress')"
            >
            </q-checkbox>
          </p>
          <!-- PC自訂欄位 -->
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="address.city"
              dense
              :placeholder="$t('member.kyc.region_state_city')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="address.postal_code"
              dense
              :placeholder="$t('member.kyc.post_code')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="address.address_line_1"
              dense
              :placeholder="$t('member.kyc.street_address')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="address.floor"
              dense
              :placeholder="$t('member.kyc.unit_floor')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
        </div>
        <div class="profile-tip">
          <p>Please note that profile information cannot be changed once KYC is approvied.</p>
        </div>
        <div class="btn-submit-container">
          <q-btn type="submit" unelevated color="primary" @click="validateAndGoToStep3">{{
            $t("member.membershipManagement.nextStep")
          }}</q-btn>
        </div>
      </q-form>
    </div>
    <div class="profile-container h5" v-else-if="step === 3">
      <p class="id_type_title m-3">{{ userKycInfoForm.profile.document_type }}</p>
      <div class="upload_area" v-for="(imgitem, index) in formData.imgs" :key="index">
        <div class="kyc_upload">
          <p class="id_type_title mb-2">
            <span class="required-star" v-if="showRequiredStar(imgitem.side)">*</span>
            {{ $t(`${ID_FACE.I18nKeys[ID_FACE.Enums[imgitem.side]]}`) }}
          </p>
          <div class="uploadImg">
            <div class="uploadWrap" v-if="formData.imgs[index].imgs === ''">
              <PreviewImage
                :parentImage="imgitem.imgs"
                :side="imgitem.side"
                :aspectRatio="'212/120'"
                :max-file-size="10485760"
                @update:modelValue="updateListImgUrl($event, index)"
                @update:imgFile="setUploadFile($event)"
                :outputType="'url'"
              />
            </div>
            <div class="uploadWrap" v-else>
              <div class="photoWrap">
                <img :src="formData.imgs[index].imgs" class="identityPhoto" />
                <svg
                  class="id-delete css-5oc719"
                  style="height: 20px; width: 20px; cursor: pointer"
                  viewBox="0 0 24 24"
                  @click="removePic(imgitem.side, index)"
                >
                  <circle cx="12" cy="12" r="10" fill="#F23C3B"></circle>
                  <circle cx="12" cy="12" r="7.714" fill="#fff"></circle>
                  <path
                    d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2.983 14.46l-1.395-1.387 3.051-3.07-3.07-3.05 1.395-1.396 3.07 3.051 3.05-3.07 1.396 1.388-3.05 3.069 3.069 3.05-1.387 1.396-3.07-3.05-3.05 3.069z"
                    fill="#F23C3B"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-submit-container px-3">
        <q-btn unelevated color="primary" type="submit" @click="handleSubmit">{{ $t("common.btn.submit") }}</q-btn>
      </div>
    </div>
    <div class="profile-container h5" v-else-if="step === 4">
      <div class="profile-body">
        <div class="finish-container" :class="cx(FLEX_CENTER)">
          <img :src="finishImg" />
        </div>
      </div>
      <div class="btn-submit-container px-3">
        <q-btn unelevated color="primary" @click="goStep(1)">{{ $t("member.membershipManagement.complete") }}</q-btn>
      </div>
    </div>
  </HeaderTitleBack>

  <!--第1步驟-->
  <div v-else class="kyc-pc">
    <div v-if="step === 1" class="profile-container pc">
      <div class="profile-header">
        <q-btn flat class="profile-header-title hide-hover" :to="{ name: 'memberProfile' }">
          <q-icon name="arrow_back" class=""></q-icon>
          {{ $t("member.kyc.kyc_record") }}
        </q-btn>
      </div>

      <div class="profile-body">
        <div class="top-area">
          <q-btn flat class="top-btn" :disabled="!canGoToStep2" @click="goStep(2)">{{
            $t("member.kyc.kyc_verify")
          }}</q-btn>
          <p class="label">
            <span class="title">{{ $t("member.kyc.kyc_status") }}:</span>
            <span>{{ $t(KYC_VERIFIED.I18nKeys[kycStatus]) }}</span>
          </p>
        </div>
        <div class="profile-table">
          <q-table
            :rows="kycState.list"
            :columns="columns"
            row-key="id"
            :loading="isLoading"
            hide-pagination
            wrap-cells
            flat
          >
            <template #body="props">
              <q-tr>
                <q-td class="custom-td" key="number" :props="props" width="15%">
                  <span>{{ props.row.number }}</span>
                </q-td>
                <q-td class="custom-td" key="status" :props="props" width="15%">
                  <span>{{ $t(KYC_TOTAL_STATUS_CODE.I18nKeys[props.row.status as KYC_STATUS_CODE.Enums]) }}</span>
                </q-td>
                <q-td class="custom-td" key="comment" :props="props" width="15%">
                  <span>{{ props.row.comment }}</span>
                </q-td>
              </q-tr>
            </template>
            <template #no-data>
              <div class="no-data-container">
                <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
                <span>{{ $t("tableHeader.no_data") }}</span>
              </div>
            </template>
          </q-table>
        </div>
      </div>
    </div>
    <div v-if="step === 2" class="profile-container pc">
      <div class="profile-header">
        <q-btn flat class="profile-header-title hide-hover" :to="{ name: 'memberProfile' }">
          <q-icon name="arrow_back" class=""></q-icon>
          {{ $t("member.kyc.kyc_record") }}
        </q-btn>
      </div>
      <!-- <div>{{ needCountryCodePhone }}</div> -->
      <q-form ref="formRef" class="profile-body">
        <div class="profile-row w-full flex flex-direction-column flex-wrap gap-4">
          <p class="profile-title">{{ `KYC ${$t("menu.profile")}` }}</p>
          <!-- PC自訂欄位 -->
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="userKycInfoForm.profile.first_name"
              dense
              :placeholder="$t('member.kyc.first_name')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star"></p>
            <q-input
              v-model="userKycInfoForm.profile.middle_name"
              dense
              :placeholder="$t('member.kyc.middle_name')"
              :rules="[]"
              bottom-slots
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="userKycInfoForm.profile.last_name"
              dense
              :placeholder="$t('member.kyc.last_name')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-select
              v-model="userKycInfoForm.profile.nationality"
              :options="NATIONAL.Dropdown.value"
              :label="$t('member.register.nationality')"
              :rules="[Rules.required()]"
              emit-value
              map-options
              dense
              clearable
            >
            </q-select>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="userKycInfoForm.profile.date_of_birth"
              dense
              :placeholder="$t('member.register.birthdate')"
              :rules="[Rules.required()]"
              readonly
            >
              <q-menu>
                <q-date
                  :options="dateOptions"
                  v-model="userKycInfoForm.profile.date_of_birth"
                  mask="YYYY-MM-DD"
                  minimal
                  color="primary"
                />
              </q-menu>
            </q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="userKycInfoForm.profile.place_of_birth"
              dense
              :placeholder="$t('member.register.place_of_birth')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-select
              v-model="userKycInfoForm.profile.document_type"
              :options="ID_TYPE.Dropdown.value"
              :label="$t('member.kyc.type_of_id')"
              :rules="[Rules.required()]"
              emit-value
              map-options
              dense
              clearable
            >
            </q-select>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <!-- <q-input v-model="userInfoForm2.name" dense :placeholder="$t('member.register.source_of_income')"></q-input> -->
            <q-select
              v-model="userKycInfoForm.profile.source_of_income"
              :options="SOURCE_INCOME.Dropdown.value"
              :label="$t('member.register.source_of_income')"
              :rules="[Rules.required()]"
              emit-value
              map-options
              dense
              clearable
            >
            </q-select>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-select
              v-model="userKycInfoForm.profile.nature_of_work"
              :options="NATURE_OF_WORK.Dropdown.value"
              :label="$t('member.register.nature_of_work')"
              :rules="[Rules.required()]"
              emit-value
              map-options
              dense
              clearable
            >
            </q-select>
          </div>
        </div>
        <div
          v-for="(address, index) in userKycInfoForm.addresses"
          :key="index"
          class="profile-row w-full flex flex-direction-column flex-wrap gap-4"
        >
          <p class="profile-title">
            {{ index === 0 ? `${$t("member.register.currentAddress")}` : `${$t("member.register.permanent_address")}` }}
            <q-checkbox
              v-if="index === 1"
              class="same-as-checkbox"
              v-model="sameAsPresentAddress"
              size="xs"
              :label="$t('common.btn.sameAsCurrentAddress')"
            >
            </q-checkbox>
          </p>
          <!-- PC自訂欄位 -->
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="address.city"
              dense
              :placeholder="$t('member.kyc.region_state_city')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="address.postal_code"
              dense
              :placeholder="$t('member.kyc.post_code')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="address.address_line_1"
              dense
              :placeholder="$t('member.kyc.street_address')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
          <div class="input-container">
            <p class="required-star">*</p>
            <q-input
              v-model="address.floor"
              dense
              :placeholder="$t('member.kyc.unit_floor')"
              :rules="[Rules.required()]"
            ></q-input>
          </div>
        </div>
        <div class="profile-tip">
          <p>Please note that profile information cannot be changed once KYC is approvied.</p>
        </div>
        <div class="btn-submit-container">
          <q-btn type="submit" unelevated color="primary" @click="validateAndGoToStep3">{{
            $t("member.membershipManagement.nextStep")
          }}</q-btn>
        </div>
      </q-form>
    </div>
    <div v-if="step === 3" class="profile-container pc">
      <div class="profile-header">
        <q-btn flat class="profile-header-title hide-hover" :to="{ name: 'memberProfile' }">
          <q-icon name="arrow_back" class=""></q-icon>
          {{ $t("member.kyc.kyc_record") }}
        </q-btn>
      </div>
      <div class="kyc_upload">
        <p class="id_type_title mb-10">{{ userKycInfoForm.profile.document_type }}</p>

        <div class="upload_area" v-for="(imgitem, index) in formData.imgs" :key="index">
          <p class="id_type_title mb-2">
            <span class="required-star" v-if="showRequiredStar(imgitem.side)">*</span>
            {{ $t(`${ID_FACE.I18nKeys[ID_FACE.Enums[imgitem.side]]}`) }}
          </p>
          <div class="uploadImg">
            <div class="uploadWrap" v-if="formData.imgs[index].imgs === ''">
              <PreviewImage
                :parentImage="imgitem.imgs"
                :side="imgitem.side"
                :aspectRatio="'212/120'"
                :max-file-size="10485760"
                @update:modelValue="updateListImgUrl($event, index)"
                @update:imgFile="setUploadFile($event)"
                :outputType="'url'"
              />
            </div>
            <div class="uploadWrap" v-else>
              <div class="photoWrap">
                <img :src="formData.imgs[index].imgs" class="identityPhoto" />
                <svg
                  class="id-delete css-5oc719"
                  style="height: 20px; width: 20px; cursor: pointer"
                  viewBox="0 0 24 24"
                  @click="removePic(imgitem.side, index)"
                >
                  <circle cx="12" cy="12" r="10" fill="#F23C3B"></circle>
                  <circle cx="12" cy="12" r="7.714" fill="#fff"></circle>
                  <path
                    d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2.983 14.46l-1.395-1.387 3.051-3.07-3.07-3.05 1.395-1.396 3.07 3.051 3.05-3.07 1.396 1.388-3.05 3.069 3.069 3.05-1.387 1.396-3.07-3.05-3.05 3.069z"
                    fill="#F23C3B"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="btn-submit-container">
          <q-btn :disabled="uploadFile.size < 3" unelevated color="primary" type="submit" @click="handleSubmit">{{
            $t("common.btn.submit")
          }}</q-btn>
        </div>
      </div>
    </div>
    <div v-if="step === 4" class="profile-container pc">
      <div class="profile-header">
        <q-btn flat class="profile-header-title hide-hover" :to="{ name: 'memberProfile' }">
          <q-icon name="arrow_back" class=""></q-icon>
          {{ $t("member.kyc.kyc_record") }}
        </q-btn>
      </div>
      <!-- <div>{{ needCountryCodePhone }}</div> -->
      <div class="profile-body">
        <div class="finish-container" :class="cx(FLEX_CENTER)">
          <img :src="finishImg" />
        </div>
        <div class="btn-submit-container">
          <q-btn unelevated color="primary" @click="goStep(1)">{{ $t("member.membershipManagement.complete") }}</q-btn>
        </div>
      </div>
    </div>
  </div>

  <!--end-->
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed, defineAsyncComponent } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useApi } from "src/common/hooks/useApi"
import * as userInfoApi from "src/api/userInfo"
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useS3Upload } from "src/common/composables/useS3Upload"
const PreviewImage = defineAsyncComponent(() => import("./components/PreviewImage.vue"))
import { useKyc } from "src/common/composables/useKyc"
import { useLogo } from "src/common/composables/useLogo"
// import { dateformat } from "src/common/utils/dayjsUtils"
import { useRule } from "src/common/hooks/useRule"
import { cx } from "src/common/utils/cx"
import { FLEX_CENTER } from "src/common/utils/constants/styles"
import {
  ID_FACE,
  KYC_TOTAL_STATUS_CODE,
  SOURCE_INCOME,
  NATURE_OF_WORK,
  ID_TYPE,
  S3_STORAGE_CATEGORY,
  KYC_VERIFIED,
  NATIONAL
} from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const Rules = useRule()
const { userKycInfoForm, isKycEnabled, setMemberCenterKyc } = useUserInfo()
const { kycState, columns, getUserKycRecord, isLoading } = useKyc()
const { uploadSingleFile } = useS3Upload()
const { isDown } = useMediaQuery()
const { getWideLogo } = useLogo()
const router = useRouter()
const { t } = useI18n()
const $q = useQuasar()
const { finishImg } = useSiteImg()
const kycStatus = ref(KYC_VERIFIED.Enums.VERIFICATION_STATUS_NOT_STARTED)

export type ImageItem = {
  id: number
  member_id: number
  side: string
  imgs: string
  file: File | null
}
const uploadFile = new Map<string, File>()
const formData = reactive({
  imgs: [
    {
      id: -1,
      member_id: 0,
      side: "FRONT",
      imgs: "",
      file: null
    },
    {
      id: -1,
      member_id: 0,
      side: "BACK",
      imgs: "",
      file: null
    },
    {
      id: -1,
      member_id: 0,
      side: "SELFIE",
      imgs: "",
      file: null
    }
  ] as ImageItem[]
})

const sameAsPresentAddress = ref(false)
const minAge = ref(21)
const step = ref(1)
const formRef = ref(null)

function goStep(num: number) {
  step.value = num
}

const minSelectableDate = computed(() => {
  const today = new Date()
  const minDate = new Date(today)
  minDate.setFullYear(today.getFullYear() - minAge.value)
  // 格式化为 YYYY/MM/DD 格式
  const year = minDate.getFullYear()
  const month = String(minDate.getMonth() + 1).padStart(2, "0")
  const day = String(minDate.getDate()).padStart(2, "0")
  return `${year}/${month}/${day}`
})

// 日期选择限制函数
const dateOptions = (date: string) => {
  // 如果 minAge 为 0，则不限制日期选择范围
  if (minAge.value === 0) {
    return true
  }
  return date <= minSelectableDate.value
}

async function getUserKycStatus() {
  const apiFunc = userInfoApi.getKycStatus
  const { status, data } = await useApi(apiFunc)

  if (status) kycStatus.value = data.status
}

const showRequiredStar = (side: string) => {
  switch (ID_FACE.Enums[side]) {
    case ID_FACE.Enums.FRONT:
    case ID_FACE.Enums.SELFIE:
      return true

    case ID_FACE.Enums.BACK:
      switch (userKycInfoForm.profile.document_type) {
        case ID_TYPE.Enums.POLICE_CLEARANCE:
        case ID_TYPE.Enums.PH_NBI_CLEARANCE:
          return false

        default:
          return true
      }
  }
}

const canGoToStep2 = computed(() => {
  switch (kycStatus.value) {
    case KYC_VERIFIED.Enums.VERIFICATION_STATUS_NOT_STARTED:
    case KYC_VERIFIED.Enums.VERIFICATION_STATUS_REJECTED:
      return true

    default:
      return false
  }
})

async function validateAndGoToStep3() {
  if (formRef.value) {
    const isValid = await formRef.value.validate()
    if (isValid) {
      goStep(3)
    } else {
      errorMsg(t("common.validate.verificationError"))
    }
  }
}
function errorMsg(msg: string) {
  $q.notify({
    type: "negative",
    message: t(msg),
    position: "top",
    timeout: 1000
  })
}

async function handleSubmit() {
  $q.loading.show()

  const img = formData.imgs.find((entry) => {
    if (showRequiredStar(entry.side) && entry.file === null) return true
    return false
  })

  if (img) {
    $q.loading.hide()
    errorMsg("error_message.pleaseUploadImg")
    return
  }

  let uploadFailed = false
  await Promise.all(
    formData.imgs.map(async (entry, key) => {
      const file = uploadFile.get(entry.side)
      if (!file) {
        return
      }

      const { status, data } = await uploadSingleFile({
        file,
        storage_category: S3_STORAGE_CATEGORY.Enums.kyc
      })

      if (status && data && "objectKey" in data) {
        userKycInfoForm.documents[key] = {
          type: userKycInfoForm.profile.document_type,
          side: entry.side,
          storage_key: data.objectKey
        }
      } else {
        uploadFailed = true
      }
    })
  )

  if (uploadFailed) {
    $q.loading.hide()
    errorMsg("error_msg.upload_failed")
    return
  }

  const { status } = await setMemberCenterKyc()
  $q.loading.hide()
  if (status) {
    goStep(4)
  }
}

const updateListImgUrl = (value: { imgs: string; file: File }, index: number) => {
  const imgData = formData.imgs[index]
  imgData.imgs = value.imgs
  imgData.file = value.file
}

const setUploadFile = (file: Map<string, File>) => {
  for (let [key, value] of file) {
    uploadFile.set(key, value)
  }

  console.log(uploadFile)
}

const removePic = (side: string, index: number) => {
  const imgData = formData.imgs[index]
  imgData.side = side
  imgData.imgs = ""
  imgData.file = null
}

onMounted(async () => {
  if (!isKycEnabled.value) {
    console.error("KYC is not available on this site.")
    router.push({ name: "memberProfile" })
  } else {
    await getUserKycStatus()
    await getUserKycRecord()
  }
})

// 监控 userKycInfoForm 的变化
watch(
  userKycInfoForm,
  (newValue) => {
    console.log("🔄 userKycInfoForm 数据变化:", newValue)
  },
  { deep: true }
)

watch(
  step,
  async (newValue) => {
    if (newValue === 4) await getUserKycRecord()
  },
  { deep: true }
)

watch(
  sameAsPresentAddress,
  (newValue) => {
    console.log("🔄 sameAsPresentAddress 数据变化:", newValue)
    if (newValue) {
      let address = JSON.parse(JSON.stringify(userKycInfoForm.addresses[0]))
      userKycInfoForm.addresses[1] = {
        type: "PERMANENT",
        postal_code: address.postal_code,
        city: address.city,
        address_line_1: address.address_line_1,
        floor: address.floor
      }
    } else {
      userKycInfoForm.addresses[1] = {
        type: "PERMANENT",
        postal_code: "",
        city: "",
        address_line_1: "",
        floor: ""
      }
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";
@import "app/template/okbet_green/assets/css/button.scss";
@import "app/template/okbet_green/assets/css/reports.scss";

:deep(.q-table__container) {
  padding: 2.5rem;
  border-color: $border-kyc-color;

  .q-table__top {
    padding: 0;
  }
}

// 上方驗證按鈕
.top-btn {
  @include btn-common;
  gap: 0;
  .q-icon {
    margin-right: 5px;
    font-size: 1.25rem;
  }
  img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}

.scontent {
  color: rgba($text-dark-color, 0.5);
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.stitle {
  font-size: 18px;
}
.required-star {
  color: $text-red;
  font-size: 16px;
  font-weight: bold;
  margin-left: 4px;
  line-height: 1;
  height: 3rem;
}
.profile-container.pc {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 70px 45px;
  .profile-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    max-height: 54px;
    @apply w-full flex justify-between items-center;
    .profile-header-title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-family: OpenSans;
      font-size: 40px;
      color: $primary-color;
      font-weight: 800;
      cursor: pointer;
      padding: 0;
      text-transform: none;
      font-weight: 800;
      .q-icon {
        font-size: 36px;
        margin-right: 12px;
      }
    }
    .btn-kyc {
      font-family: OpenSans;
      font-weight: 600;
      margin-left: 10px;
      background: none !important;
      border: 2px solid #457950;
      color: #457950 !important;
      line-height: 0;
    }
  }
  .btn-submit-container {
    @apply w-full flex justify-center items-center mb-3;
    .q-btn {
      width: 100%;
      height: 50px;
      text-transform: none;
      border-radius: 8px;
      background: $primary-color;
      color: $text-light-color;
      font-family: OpenSans;
      font-size: 16px;
      font-weight: 510;
      line-height: 19px;
      letter-spacing: 0em;
    }
  }
  .kyc_upload {
    width: 100%;
    margin-top: 10px;
    border: 2px solid $border-kyc-color;
    border-radius: 14px;
    padding: 20px 30px;
    font-size: 16px;
    position: relative;
    gap: 0.9375rem;
    .id_type_title {
      width: 100%;
      color: rgba(0, 0, 0, 0.8);
      font-family: "Noto Sans";
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    .input_area {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .kinput {
      margin-top: 20px;
      .q-field__control {
        border-radius: 8px;
        height: 84px;
        background: $background-light-color;
        padding: 0 22px;
        border: 0px;
      }
      .q-field__native {
        color: $text-dark-color !important;
      }
      .q-field__marginal {
        height: 84px;
        .q-icon {
          font-size: 30px;
          color: rgba($text-dark-color, 0.5) !important;
        }
      }
    }

    .guides {
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: start;
      justify-content: flex-start;
      font-size: 14px;
      line-height: 20px;
      font-weight: 600;
      color: $text-night-sky-color;
      gap: 8px;

      .guides_icon {
        color: $primary-color;
      }
    }
    .id_title {
      padding-top: 32px;
      color: $text-night-sky-color;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }
    .uploadImg {
      width: 100%;
      height: 265px;
      padding: 0px 20px;
      border: 1px dashed $border-sky-gray-color;
      background: $background-light-color;
      border-radius: 16px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: start;
      justify-content: flex-start;
      margin-bottom: 20px;
      .uploadWrap {
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
        .photoWrap {
          position: relative;
          .identityPhoto {
            width: 203px;
            height: 122px;
            border-radius: 8px;
            position: relative;
            z-index: 1;
          }
          .id-delete {
            height: 20px;
            width: 20px;
            cursor: pointer;
            position: absolute;
            right: -10px;
            top: -10px;
            z-index: 2;
          }
        }
        .preview-image {
          width: 100%;
          height: 100%;
          position: absolute;
        }
        .uploadBtn {
          display: inline-block;
          min-width: 118px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          border-radius: 6px;
          color: $text-light-color;
          background: $background-mint-green-color;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
  }

  .profile-table {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    // height: 100%;
    border-radius: 20px;
    .q-table__container {
      border: none;
      padding: 0;
    }
  }

  .profile-body {
    width: 100%;
    margin-top: 1.5625rem;
    border: 2px solid $border-kyc-color;
    border-radius: 14px;
    padding: 20px 30px;
    font-size: 16px;
    position: relative;
    display: flex;
    gap: 0.9375rem;
    flex-wrap: wrap;
    .top-area {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      .label {
        @apply mt-4 mx-2;
        font-size: 0.9rem;
        font-weight: 600;
        line-height: normal;
        .title {
          font-size: 0.9rem;
          color: $color-primary;
          margin-right: 1rem;
        }
      }
    }
    .finish-container {
      width: 100%;
      height: 100%;
      min-height: 630px;
    }
    .profile-row {
      .profile-title {
        width: 100%;
        color: rgba(0, 0, 0, 0.8);
        font-family: "Noto Sans TC";
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        .same-as-checkbox {
          font-size: 14px;
          font-weight: 400;
          line-height: normal;
          color: rgba(0, 0, 0, 0.8);
        }
      }
      .input-container {
        width: 48%;
        margin-bottom: 24px;
        font-family: "Segoe UI";
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-direction: row;
        &.long {
          width: 98%;
        }
        .q-input,
        .q-field {
          width: 100%;
        }
        :deep(.q-field__before) {
          padding-right: 14px;
        }
        :deep(.q-field--readonly) {
          .q-field__control {
            &:before {
              border-bottom-style: solid;
            }
          }
        }

        .select-placeholder {
          :deep(.q-field__inner) {
            .q-field__control {
              .q-field__native {
                span {
                  @apply text-gray-500;
                }
              }
            }
          }
        }
      }
    }
    .profile-tip {
      width: 100%;
      p {
        color: $text-danger-tertiary-color;
        font-family: "Noto Sans TC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }

    .custom-pagination {
      width: 100%;
    }
    .result {
      width: 100%;
      height: 100%;
      .result_content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 2rem 2rem;
        img {
          margin-bottom: 10px;
        }
        p {
          width: 400px;
          font-size: 16px;
          text-align: center;
          line-height: 33px;
          margin-bottom: 20px;
          color: $text-danger-tertiary-color !important;
        }
      }
    }
    .card {
      margin: 40px 0px 0px;
      width: 100%;
      min-height: 171px;
      border-bottom: 1px solid $border-pale-gray-color;
      display: flex;
      flex-direction: column;
      .title {
        height: 26px;
        line-height: 26px;
        font-size: 18px;
        font-weight: 600;
        color: $primary-color;
        margin-bottom: 19px;
        font-family: OpenSans;
        font-weight: 600;
      }
      .contentWrap {
        width: 100%;
        min-height: 100px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        .right {
          width: 162px;
        }
        .left {
          flex: 1 1 0%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: flex-start;
          .tip {
            display: flex;
            flex-wrap: wrap;
            color: $text-steel-blue-color;
            font-size: 14px;
            gap: 12px;
            li {
              font-family: OpenSans;
              font-weight: 400;
              width: 30%;
              list-style: disc;
              &::marker {
                color: $primary-color;
              }
            }
          }
          .name {
            font-size: 18px;
            font-family: Helvetica;
            color: $text-night-sky-color;
            font-weight: 700;
            margin-bottom: 16px;
          }
          .detail {
            width: 100%;

            .columnTip,
            .content {
              font-family: OpenSans;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
}

.profile-container.h5 {
  width: 100%;
  display: inline-grid;
  row-gap: 1rem;
  background-color: $background-light-color;
  @include phone-width {
    row-gap: 0.5rem;
  }

  .top-area {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    @apply my-2 px-2;
    .label {
      font-size: 0.9rem;
      font-weight: 600;
      line-height: normal;
      .title {
        font-size: 0.9rem;
        color: $color-primary;
        margin-right: 1rem;
      }
    }
  }

  .profile-table {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    border-top: 2px solid $border-kyc-color;
    border-bottom: 2px solid $border-kyc-color;
    padding: 0.8rem;
    width: 100%;

    .profile-table-row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      margin: 0.5rem 0;
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid $primary-color;
      background: $color-secondary;
      li {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        gap: 0.5rem;
      }
      .divider {
        width: 100%;
        height: 1px;
        background: $border-kyc-color;
      }
    }

    // Loading skeleton styles
    .profile-table-loading {
      width: 100%;
      .profile-table-row-skeleton {
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-radius: 8px;
        background: rgba($background-light-color, 0.5);

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          gap: 1rem;
        }

        .skeleton-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
      }
    }

    // No data container styles
    .no-data-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;

      img {
        max-width: 120px;
        margin-bottom: 1rem;
        opacity: 0.6;
      }

      span {
        color: rgba($text-dark-color, 0.6);
        font-size: 14px;
      }
    }
  }

  .profile-body {
    width: 100%;
    margin-top: 1.5625rem;
    border-top: 2px solid $border-kyc-color;
    padding: 20px 30px;
    font-size: 16px;
    position: relative;
    display: flex;
    gap: 0.9375rem;
    flex-wrap: wrap;
    .finish-container {
      width: 100%;
      height: 100%;
      min-height: 480px;
    }
    .profile-row {
      .profile-title {
        width: 100%;
        color: rgba(0, 0, 0, 0.8);
        font-family: "Noto Sans TC";
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        .same-as-checkbox {
          font-size: 14px;
          font-weight: 400;
          line-height: normal;
          color: rgba(0, 0, 0, 0.8);
        }
      }
      .input-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 24px;
        font-family: "Segoe UI";
        &.long {
          width: 98%;
        }
        .q-input,
        .q-field {
          width: 100%;
        }
        :deep(.q-field__before) {
          padding-right: 14px;
        }
        :deep(.q-field--readonly) {
          .q-field__control {
            &:before {
              border-bottom-style: solid;
            }
          }
        }

        .select-placeholder {
          :deep(.q-field__inner) {
            .q-field__control {
              .q-field__native {
                span {
                  @apply text-gray-500;
                }
              }
            }
          }
        }
      }
    }
    .profile-tip {
      width: 100%;
      p {
        color: $text-danger-tertiary-color;
        font-family: "Noto Sans TC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }

    .custom-pagination {
      width: 100%;
    }
    .result {
      width: 100%;
      height: 100%;
      .result_content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 2rem 2rem;
        img {
          margin-bottom: 10px;
        }
        p {
          width: 400px;
          font-size: 16px;
          text-align: center;
          line-height: 33px;
          margin-bottom: 20px;
          color: $text-danger-tertiary-color !important;
        }
      }
    }
    .card {
      margin: 40px 0px 0px;
      width: 100%;
      min-height: 171px;
      border-bottom: 1px solid $border-pale-gray-color;
      display: flex;
      flex-direction: column;
      .title {
        height: 26px;
        line-height: 26px;
        font-size: 18px;
        font-weight: 600;
        color: $primary-color;
        margin-bottom: 19px;
        font-family: OpenSans;
        font-weight: 600;
      }
      .contentWrap {
        width: 100%;
        min-height: 100px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        .right {
          width: 162px;
        }
        .left {
          flex: 1 1 0%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: flex-start;
          .tip {
            display: flex;
            flex-wrap: wrap;
            color: $text-steel-blue-color;
            font-size: 14px;
            gap: 12px;
            li {
              font-family: OpenSans;
              font-weight: 400;
              width: 30%;
              list-style: disc;
              &::marker {
                color: $primary-color;
              }
            }
          }
          .name {
            font-size: 18px;
            font-family: Helvetica;
            color: $text-night-sky-color;
            font-weight: 700;
            margin-bottom: 16px;
          }
          .detail {
            width: 100%;

            .columnTip,
            .content {
              font-family: OpenSans;
              font-weight: 400;
            }
          }
        }
      }
    }
  }

  .btn-submit-container {
    @apply w-full flex justify-center items-center mb-3;
    // padding: 0rem 1.5rem;
    .q-btn {
      width: 100%;
      height: 50px;
      text-transform: none;
      border-radius: 8px;
      background: $primary-color !important;
      color: $text-light-color;
      font-family: OpenSans;
      font-size: 16px;
      font-weight: 510;
      line-height: 19px;
      letter-spacing: 0em;
    }
  }
  .result {
    width: 100%;
    height: 100%;
    background-color: $background-pale-gray-color;
    .result_content {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: $background-light-color;
      box-shadow: rgba($box-shadow-deep-slate-color, 0.06) 0px 6rem 10rem;
      padding: 2rem 2rem 2rem;
      img {
        margin-bottom: 10px;
      }
      p {
        color: $text-danger-tertiary-color !important;
      }
    }
  }
  .id_type_title {
    width: 100%;
    color: rgba(0, 0, 0, 0.8);
    font-family: "Noto Sans TC";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .kyc_upload {
    width: 100%;
    margin-top: 10px;

    padding: 0px 12px;
    font-size: 16px;
    position: relative;
    gap: 0.9375rem;
    .input_area {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .kinput {
      margin-top: 20px;
      .q-field__control {
        border-radius: 8px;
        height: 84px;
        background: $background-light-color;
        padding: 0 22px;
        border: 0px;
      }
      .q-field__native {
        color: $text-dark-color !important;
      }

      .q-field__marginal {
        height: 84px;
        .q-icon {
          font-size: 30px;
          color: rgba($text-dark-color, 0.5) !important;
        }
      }
    }

    .guides {
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: start;
      justify-content: flex-start;
      font-size: 14px;
      line-height: 20px;
      font-weight: 600;
      color: $text-night-sky-color;
      gap: 8px;
    }
    .id_title {
      padding-top: 32px;
      color: $text-night-sky-color;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }
    .uploadImg {
      width: 100%;
      height: 265px;
      padding: 0px 28px;
      border: 1px dashed $border-sky-gray-color;
      background: $background-light-color;
      border-radius: 16px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: start;
      justify-content: flex-start;
      margin-bottom: 20px;
      .uploadWrap {
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
        .photoWrap {
          position: relative;
          .identityPhoto {
            width: 203px;
            height: 122px;
            border-radius: 8px;
            position: relative;
            z-index: 1;
          }
          .id-delete {
            height: 20px;
            width: 20px;
            cursor: pointer;
            position: absolute;
            right: -10px;
            top: -10px;
            z-index: 2;
          }
        }
        .preview-image {
          width: 100%;
          height: 100%;
          position: absolute;
        }
        .uploadBtn {
          display: inline-block;
          min-width: 118px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          border-radius: 6px;
          color: $text-light-color;
          background: $background-mint-green-color;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
  }

  .entryMainTitle {
    font-family: Helvetica;
    width: 100%;
    color: $text-deep-ocean-color;
    font-size: 15px;
    font-weight: 400;
    text-transform: capitalize;
    background: $background-light-color;
    padding: 1rem 1rem 0.2rem 1rem;
  }

  .info-container {
    padding: 1rem 1rem;
    background: $background-light-color;
    .info-container_main {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-flow: column;

      .stepBox {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-flow: column;
        margin-bottom: 0.8rem;
        .titleWrap {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          flex-flow: column;
          padding: 0 0.5rem;
          .step {
            font-family: Helvetica;
            font-weight: 400;
            color: $primary-color;
            font-size: 15px;
          }
          .stepTitle {
            font-family: Helvetica;
            font-size: 17px;
            font-weight: 700;
            color: $text-deep-ocean-color;
            text-transform: capitalize;
          }
        }
        .content {
          width: 100%;
          border-radius: 12px;
          background: $background-light-color;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.3rem;
          line-height: 13px;
          padding-top: 5px;
          .contentText {
            flex: 1 1 0%;
            width: 100%;
            height: 100%;
            font-size: 13px;
            color: $text-smoke-gray-color;
            font-weight: 400;
            text-transform: capitalize;
            display: flex;
            align-items: center;
            ul {
              margin-top: 0.5rem;
              display: flex;
              flex-direction: column;
              li {
                color: $text-deep-ocean-color;
                margin-left: 1.2rem;
                list-style: disc;
                margin-top: 0.2rem;
                &::marker {
                  color: $primary-color;
                }
              }
            }
            .columnContent {
              font-family: Helvetica;
              font-weight: 400;
              width: 100%;
              min-height: 95px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: flex-start;
              padding: 1rem 0.5rem;
            }
          }
          .contentImg {
            flex-shrink: 0;
            background: $background-pale-gray-color;
            border-radius: 10px;
            margin-left: 10px;
            img {
              display: block;
              margin: 0px;
            }
          }
        }
      }
    }
    .q-separator {
      margin-left: 1.75rem;
      margin-right: 1.75rem;
      height: 1px;
      background-color: $background-pale-gray-color;
      @include phone-width {
        margin-left: 14px;
        margin-right: 14px;
      }
    }
  }
}

.inbox-title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: $primary-color;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-transform: none;
  font-weight: 800;
}

.hide-hover {
  :deep(.q-focus-helper) {
    opacity: 0 !important;
    background-color: transparent !important;
  }
}

.q-focus-helper {
  height: unset !important;
}
</style>
