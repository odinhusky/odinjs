import Vue from 'vue';
import VueRouter from 'vue-router';

// View Components Layout
import Layout from '@/layout/Layout.vue';
import LayoutLogin from '@/layout/LayoutLogin.vue';
// import LayoutWithoutFooter from '@/layout/LayoutWithoutFooter.vue';

// Containers
import AppIndex from '@/components/AppIndex.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/:lang(cn|tw|en)?',
    component: {
      render: h => h('router-view'),
    },
    children: [
      {
        path: '/',
        component: Layout,
        children: [
          {
            path: '',
            name: 'index',
            component: AppIndex,
          },
        ],
      },
      {
        path: 'login',
        component: LayoutLogin,
        children: [
          {
            path: '',
            name: 'login',
            component: () => import('@/components/AppLogin.vue'),
          },
        ],
      },
      {
        path: 'teacher-login',
        component: LayoutLogin,
        children: [
          {
            path: '',
            name: 'teacher-login',
            component: () => import('@/components/AppLoginTeacher.vue'),
          },
        ],
      },
      {
        path: 'forget-password',
        component: LayoutLogin,
        children: [
          {
            path: '',
            name: 'forget-password',
            component: () => import('@/components/AppLoginForgetPwd.vue'),
          },
        ],
      },
      {
        path: 'verify-phone-step1',
        component: LayoutLogin,
        children: [
          {
            path: '',
            name: 'verify-phone-step1',
            component: () =>
              import('@/components/AppLoginVerifyPhoneStep1.vue'),
          },
        ],
      },
      {
        path: 'verify-phone-step2',
        component: LayoutLogin,
        children: [
          {
            path: '',
            name: 'verify-phone-step2',
            component: () =>
              import('@/components/AppLoginVerifyPhoneStep2.vue'),
          },
        ],
      },
      {
        path: 'verify-phone-fail',
        component: LayoutLogin,
        children: [
          {
            path: '',
            name: 'verify-phone-fail',
            component: () => import('@/components/AppLoginVerifyPhoneFail.vue'),
          },
        ],
      },
      {
        path: 'signup',
        component: LayoutLogin,
        children: [
          {
            path: '',
            name: 'signup',
            component: () => import('@/components/AppLoginSignup.vue'),
          },
        ],
      },
      {
        path: 'course',
        component: Layout,
        children: [
          {
            path: '',
            name: 'course',
            component: () => import('@/components/AppCourse.vue'),
          },
        ],
      },
      {
        path: 'my-account',
        // name: 'MyAccount',
        component: Layout,
        children: [
          {
            path: '',
            name: 'my-account',
            component: () => import('@/components/AppMyAccount.vue'),
          },
        ],
      },
      {
        path: 'browse',
        component: Layout,
        children: [
          {
            path: '',
            name: 'browse',
            component: () => import('@/components/AppBrowse.vue'),
          },
        ],
      },
      {
        path: '/enroll',
        component: Layout,
        children: [
          {
            path: '',
            name: 'enroll',
            component: () => import('@/components/AppEnroll.vue'),
          },
        ],
      },
      {
        path: 'purchase',
        component: Layout,
        children: [
          {
            path: '',
            name: 'purchase',
            component: () => import('@/components/AppPurchase.vue'),
          },
        ],
      },
    ],
  },
  // 404
  {
    path: '*',
    component: () => import('@/components/Error404.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
