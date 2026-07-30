<template>
  <q-card class="bg-transparent no-shadow no-border" bordered>
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="col-md-3 col-sm-12 col-xs-12 flex"
          style="align-items: stretch"
        >
          <q-item :style="`background-color: ${item.color1}`" class="q-pa-none" style="flex: 1">
            <q-item-section
              v-if="iconPosition === 'left'"
              side
              :style="`background-color: ${item.color2}`"
              class="q-pa-lg q-mr-none text-white"
            >
              <q-icon :name="item.icon" color="white" size="24px" />
            </q-item-section>
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{ item.value }}</q-item-label>
              <q-item-label>{{ item.title }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="iconPosition === 'right'" side class="q-mr-md text-white">
              <q-icon :name="item.icon" color="white" size="44px" />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import { defineComponent, computed } from "vue"
  import { useI18n } from "vue-i18n"

  export default defineComponent({
    name: "CardSocial",
    props: {
      iconPosition: {
        required: false,
        default: "left"
      }
    },
    computed: {
      items: function () {
        const { t } = useI18n()
        return this.iconPosition === "left"
          ? [
              {
                title: t("reward_type.today_bet"),
                icon: "bar_chart",
                value: "200",
                color1: "#5064b5",
                color2: "#3e51b5"
              },
              {
                title: t("reward_type.today_winlose"),
                icon: "bar_chart",
                value: "500",
                color1: "#f37169",
                color2: "#f34636"
              },
              {
                title: t("reward_type.yesterday_bet"),
                icon: "bar_chart",
                value: "50",
                color1: "#ea6a7f",
                color2: "#ea4b64"
              },
              {
                title: t("reward_type.yesterday_winlose"),
                icon: "bar_chart",
                value: "1020",
                color1: "#a270b1",
                color2: "#9f52b1"
              }
            ]
          : [
              {
                title: "Monthly Income",
                icon: "fas fa-dollar-sign",
                value: "$ 20k",
                color1: "#546bfa",
                color2: "#3e51b5"
              },
              {
                title: "Weekly Sales",
                icon: "fas fa-chart-bar",
                value: "20",
                color1: "#3a9688",
                color2: "#3e51b5"
              },
              {
                title: "New Customers",
                icon: "fas fa-chart-line",
                value: "321",
                color1: "#7cb342",
                color2: "#3e51b5"
              },
              {
                title: "Active Users",
                icon: "person",
                value: "82",
                color1: "#f88c2b",
                color2: "#3e51b5"
              }
            ]
      }
    }
  })
</script>
