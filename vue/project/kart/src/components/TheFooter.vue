<template>
  <div class="root footer_body" :class="rootClassObj">
    <div class="main-11 footer_body_container">
      <!-- footer logo -->
      <section class="logo_section">
        <!-- <button class="footer_logo" @click.prevent="goToIndexJudge"> -->
        <button class="footer_logo" type="button" @click.prevent="">
          <!-- logo 圖片 -->
          <img
            class="footer_logo_img"
            src="../assets/img/v2/footer/icon_kartlogo@2x.png"
          />

          <!-- logo 文字 -->
          <div class="footer_logo_text_container">
            <span class="d-block footer_logo_title footer_logo_title1"
              >{{ $t('footer.title1') }}
            </span>

            <span class="d-block footer_logo_title footer_logo_title2"
              >{{ $t('footer.title2') }}
            </span>
          </div>
        </button>
      </section>

      <!-- detal -->
      <section class="detail_section">
        <!-- KEI Art learning 聯絡我們 -->
        <div class="detail_set">
          <div class="set_left">
            <!-- line icon -->
            <img
              v-if="i18n === 'tw'"
              src="../assets/img/v2/footer/line.png"
              class="left_icon"
            />
            <!-- wechat icon -->
            <img
              v-else
              src="../assets/img/footer/icon_wechat@2x.png"
              class="left_icon"
            />
            <span class="left_text">{{ $t('footer.social') }}</span>
          </div>
          <div class="set_right">
            <a
              href="mailto:kart88888@163.com"
              class="detail_text contact_us"
              @click.prevent=""
            >
              {{ $t('footer.contact_us') }}
            </a>
          </div>
        </div>

        <!-- +886 0912456789 商務合作 -->
        <div class="detail_set">
          <div class="set_left">
            <img
              src="../assets/img/footer/icon_phone@2x.png"
              class="left_icon"
            />
            <span class="left_text">{{ $t('footer.full_cellphone') }}</span>
          </div>
          <div class="set_right">
            <a
              href="https://reurl.cc/n0Y7k2"
              target="_blank"
              rel="noreferrer noopener nofollow"
              class="detail_text business_cooperation"
            >
              {{ $t('footer.business_cooperation') }}
            </a>
          </div>
        </div>

        <!-- aa@aa.com 聯絡我們 -->
        <div class="detail_set">
          <div class="set_left">
            <img
              src="../assets/img/footer/icon_mail@2x.png"
              class="left_icon"
            />
            <span class="left_text">{{ $t('footer.email') }}</span>
          </div>
          <div class="set_right">
            <!-- <a href="#" class="detail_text contact_us" @click.prevent="">
              招兵買馬
            </a> -->
          </div>
        </div>
      </section>

      <!-- QR -->
      <section class="qr_box">
        <img
          v-if="i18n === 'tw'"
          src="../assets/img/v2/footer/qr-l.png"
          class="qr_img"
        />
        <img
          v-else
          src="../assets/img/v2/footer/icon_wechatqrcode@2x.jpg"
          class="qr_img"
        />
        <span class="qr_description">{{ $t('footer.foucs_social') }}</span>
      </section>

      <!-- APP -->
      <section class="app_box">
        <!-- Huawei -->
        <a
          v-if="i18n === 'cn' || i18n === 'en'"
          href="appmarket://details?id=com.mejor.course"
          class="app_download download_huawei_app"
        >
          <img
            class="app_img"
            src="../assets/img/v2/footer/icon_huawei@2x.png"
          />
        </a>
        <!-- IOS -->
        <a
          href="https://itunes.apple.com/app/id1500544764"
          class="app_download download_ios_app"
        >
          <img
            class="app_img"
            src="../assets/img/footer/icon_appstore@2x.png"
          />
        </a>
        <!-- GooglePlay -->
        <a
          href="market://details?id=com.mejor.course"
          class="app_download download_googleplay_app"
          v-if="i18n === 'tw' || i18n === 'en'"
        >
          <img
            class="app_img"
            src="../assets/img/footer/icon_googleplay@2x.png"
          />
        </a>
      </section>
    </div>
  </div>
</template>

<script>
// Resources
import commonMixinObj from '@/mixins/common.js';

// components
// import Img from "@/components/Img.vue";

export default {
  name: 'TheFooter',
  components: {},
  mixins: [commonMixinObj],
  data() {
    return {
      data: 1,
    };
  },
  computed: {},
  created() {
    console.log(this.$route.params);
  },
  methods: {
    /**
     * @author odin
     * @description 處理點選 logo 回到的頁面
     */
    goToIndexJudge() {
      if (this.loginOrNot) {
        this.$router.push({
          name: 'course',
          params: { lang: this.$route.params.lang },
        });
      } else {
        this.$router.push({
          name: 'index',
          params: { lang: this.$route.params.lang },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
