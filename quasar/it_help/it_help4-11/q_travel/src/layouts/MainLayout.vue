<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="q-pa-md">
        <q-toolbar-title>
          來去旅遊
          <h4 class="q-my-none text-subtitle1">Likey</h4>
        </q-toolbar-title>

        <div class="lt-sm">
          <q-btn
            flat
            dense
            icon="menu"
            aria-label="Menu"
            @click="rightDrawerOpen = !rightDrawerOpen"
          ></q-btn>
        </div>

        <div class="gt-xs">
          <q-btn flat class="q-mr-md">精選景點</q-btn>
          <q-btn flat class="q-mr-md">美食地圖</q-btn>
          <q-btn flat class="q-mr-md">夜宿曉行</q-btn>
          <q-btn flat class="q-mr-md">登入</q-btn>
          <q-btn flat class="q-mr-md">註冊</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" content-class="bg-grey-10" side="right">
      <q-list no-border link inset-delimiter dark>
        <q-list-header>來去旅遊</q-list-header>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="search"></q-icon>
          </q-item-section>
          <q-item-section>精選景點</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="map"></q-icon>
          </q-item-section>
          <q-item-section>美食地圖</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="flight"></q-icon>
          </q-item-section>
          <q-item-section>夜宿曉行</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="login"></q-icon>
          </q-item-section>
          <q-item-section>登入</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="assignment"></q-icon>
          </q-item-section>
          <q-item-section>註冊</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import EssentialLink from 'components/EssentialLink.vue'

export default {
  name: "MainLayout",
  components: {},
  data() {
    return {
      rightDrawerOpen: false
      // essentialLinks: linksData
    };
  }
};
</script>
