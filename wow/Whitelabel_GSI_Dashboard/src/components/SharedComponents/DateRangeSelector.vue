<template>
  <div>
    <q-input v-model="dateRangeLabel" dense outlined :label="$t('common.select_date')" @click="toggleDatepicker">
      <template #prepend>
        <q-icon name="calendar_today" class="cursor-pointer" @click="toggleDatepicker" />
        <q-popup-proxy
          ref="qPopupProxy"
          cover
          transition-show="scale"
          transition-hide="scale"
          class="custom-parent-menu"
        >
          <q-date v-model="dateRange" range @input="handleDateInput" />
          <div class="row q-mt-md custom-range">
            <div class="custom-menu">
              <q-btn flat :label="$t('common.yesterday')" @click="setYesterday" />
              <q-btn flat :label="$t('common.today')" @click="setToday" />
              <q-btn flat :label="$t('common.these_two_days')" @click="set2daysAgo" />
              <q-btn flat :label="$t('common.these_three_days')" @click="set3daysAgo" />
              <q-btn flat :label="$t('common.this_week')" @click="setThisWeek" />
              <q-btn flat :label="$t('common.last_week')" @click="setLastWeek" />
              <q-btn flat :label="$t('common.this_month')" @click="setThisMonth" />
              <q-btn flat :label="$t('common.last_month')" @click="setLastMonth" />
            </div>
          </div>
        </q-popup-proxy>
      </template>
    </q-input>
  </div>
</template>

<script>
  export default {
    name: "DateRangePicker",
    props: {
      value: {
        type: Object,
        default: () => ({ from: "", to: "" })
      }
    },
    data() {
      return {
        dateRange: { ...this.value },
        dateRangeLabel: "",
        showDatepicker: false
      }
    },
    watch: {
      value(val) {
        this.dateRange = { ...val }
        this.updateDateRangeLabel()
      },
      "dateRange.from": function (newVal, oldVal) {
        if (newVal && this.dateRange.to) {
          this.confirmSelection()
        }
      },
      "dateRange.to": function (newVal, oldVal) {
        if (newVal && this.dateRange.from) {
          this.confirmSelection()
        }
      }
    },
    methods: {
      setToday() {
        const today = new Date()
        this.setDateRange(today, today)
        this.hideDatepicker()
      },
      setYesterday() {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        this.setDateRange(yesterday, yesterday)
        this.hideDatepicker()
      },
      set2daysAgo() {
        const today = new Date()
        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
        this.setDateRange(twoDaysAgo, today)
        this.hideDatepicker()
      },
      set3daysAgo() {
        const today = new Date()
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        this.setDateRange(threeDaysAgo, today)
        this.hideDatepicker()
      },
      clearSelection() {
        this.setDateRange("", "")
        this.hideDatepicker()
      },
      setDateRange(from, to) {
        this.dateRange = {
          from: this.formatDate(from),
          to: this.formatDate(to)
        }
        this.updateDateRangeLabel()
      },
      formatDate(date) {
        return date instanceof Date ? date.toISOString().substring(0, 10) : ""
      },
      updateDateRangeLabel() {
        this.dateRangeLabel =
          this.dateRange.from && this.dateRange.to
            ? `${this.dateRange.from} ${this.$t("pagination.to")} ${this.dateRange.to}`
            : ""
      },
      confirmSelection() {
        this.updateDateRangeLabel()
        this.$emit("input", this.dateRange) // Emit the selected range
        this.hideDatepicker()
      },
      // Add methods for 'This Week', 'Last Week', 'This Month', 'Last Month'...
      toggleDatepicker() {
        this.$refs.qPopupProxy.show()
      },
      hideDatepicker() {
        this.$refs.qPopupProxy.hide() // Explicitly hide the popup
      },
      handleDateInput(value) {
        // If both from and to dates are selected, confirm the selection
        if (value && value.from && value.to) {
          this.confirmSelection()
        }
      },
      setThisWeek() {
        let start = new Date()
        let end = new Date()

        // Set to the first day of this week
        start.setDate(start.getDate() - start.getDay())

        // Set to the last day of this week
        end.setDate(end.getDate() - end.getDay() + 6)

        this.setDateRange(start, end)
      },

      setLastWeek() {
        let start = new Date()
        let end = new Date()

        // Set to the first day of last week
        start.setDate(start.getDate() - start.getDay() - 7)

        // Set to the last day of last week
        end.setDate(end.getDate() - end.getDay() - 1)

        this.setDateRange(start, end)
      },

      setThisMonth() {
        let start = new Date()
        let end = new Date()

        // Set to the first day of this month
        start.setDate(1)

        // Set to the last day of this month
        end.setMonth(end.getMonth() + 1)
        end.setDate(0)

        this.setDateRange(start, end)
      },

      setLastMonth() {
        let start = new Date()
        let end = new Date()

        // Set to the first day of last month
        start.setMonth(start.getMonth() - 1)
        start.setDate(1)

        // Set to the last day of last month
        end.setMonth(end.getMonth())
        end.setDate(0)

        this.setDateRange(start, end)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .custom-range {
    margin: 1.5em 1em;
    width: 260px;
    & > .custom-menu {
      /* flex-direction: column;
      align-items: flex-start;
      display: flex;
*/
      & > button {
        padding: 10px 6px;
        box-shadow: rgba(99, 99, 99, 0.07) 0px 1px 0px 0px;
        //padding-right: 2.5em;

        & > span {
          text-align: center !important;
          font-size: 13px;
        }
      }
    }
  }

  .custom-parent-menu {
    display: flex !important;
    flex-direction: row-reverse;
  }

  ::v-deep(.q-field--dense .q-field__label) {
    font-size: 14px;
    top: 10px !important;
  }

  ::v-deep(.q-field__control),
  ::v-deep(.q-field__marginal) {
    height: unset !important;
  }
  ::v-deep(.q-field__control) {
    border: 1px solid #c2c2ca;
    // border-radius: 6px;
    padding: 0;
  }
  ::v-deep(.q-field__prepend) {
    padding-right: 10px;
    padding-left: 8px;
    color: #6e39cb;
    opacity: 0.5;
  }
  ::v-deep(.q-field--labeled.q-field--dense .q-field__native) {
    padding-top: 9px;
  }
</style>
