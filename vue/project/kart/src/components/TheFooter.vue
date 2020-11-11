<template>
  <div class="root footer_body" :class="rootClassObj">
    <div class="main-10 footer_body_container">
      <!-- footer logo -->
      <section class="logo_section">
        <a class="footer_logo" @click.prevent="goToIndexJudge">
          <img src="../assets/img/footer/logo_with_text@2x.png" />
        </a>
      </section>

      <!-- detal -->
      <section class="detail_section">
        <!-- KEI Art learning 聯絡我們 -->
        <div class="detail_set">
          <div class="set_left">
            <img
              src="../assets/img/footer/icon_wechat@2x.png"
              class="left_icon"
            />
            <span class="left_text">{{ $t('footer.name') }}</span>
          </div>
          <div class="set_right">
            <a href="#" class="detail_text contact_us" @click.prevent="">
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
              class="detail_text contact_us"
              @click.prevent=""
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

      <!-- QR and App -->
      <section class="qr_app_section">
        <!-- QR -->
        <div class="qr_box">
          <img
            src="../assets/img/footer/icon_wechatqrcode@2x.png"
            class="qr_img"
          />
          <span class="qr_description">{{ $t('footer.foucs_wechat') }}</span>
        </div>

        <!-- APP -->
        <div class="app_box">
          <!-- IOS -->
          <a href="#" class="app_download download_ios_app" @click.prevent="">
            <img
              class="app_img"
              src="../assets/img/footer/icon_appstore@2x.png"
            />
          </a>
          <!-- GooglePlay -->
          <a
            href="#"
            class="app_download download_googleplay_app"
            @click.prevent=""
          >
            <img
              class="app_img"
              src="../assets/img/footer/icon_googleplay@2x.png"
            />
          </a>
        </div>
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
