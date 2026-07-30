import { DateTime } from "luxon"
import type { ChartData, ChartOptions } from "chart.js"
import type { Ref } from "vue"
import type { MemberSummaryLike } from "./types"
import { buildDateListByRange } from "./dateHelpers"

const toPositiveNumber = (value: unknown) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? Math.max(numeric, 0) : 0
}

export const useSummaryDisplayComputed = (
  memberSummary: Ref<MemberSummaryLike | null | undefined>,
  selectedDateRange: Ref<[string, string]>
) => {
  const summaryCards = computed(() => {
    const data = memberSummary.value

    return [
      { key: "bet_count", label: "注單量", value: data?.bet_count ?? 0 },
      { key: "bet_amount", label: "投注金額", value: data?.bet_amount ?? "0" },
      { key: "valid_bet", label: "有效金額", value: data?.valid_bet ?? "0" },
      { key: "prize", label: "派彩", value: data?.prize ?? "0" },
      { key: "profit", label: "盈虧", value: data?.profit ?? "0" },
      { key: "bonus", label: "活動獎金", value: data?.bonus ?? "0" }
    ]
  })

  const depositAmount = computed(() => toPositiveNumber(memberSummary.value?.deposit))
  const withdrawAmount = computed(() => toPositiveNumber(memberSummary.value?.withdraw))
  const hasDoughnutValue = computed(() => depositAmount.value + withdrawAmount.value > 0)

  const doughnutData = computed<ChartData<"doughnut">>(() => {
    return {
      labels: ["存款", "出金"],
      datasets: [
        {
          data: hasDoughnutValue.value ? [depositAmount.value, withdrawAmount.value] : [100, 0],
          backgroundColor: ["#36A2FF", "#8DE3FF"],
          borderColor: ["transparent", "transparent"],
          borderWidth: 0,
          hoverOffset: 0
        }
      ]
    }
  })

  const doughnutOptions = computed<ChartOptions<"doughnut">>(() => {
    return {
      cutout: "72%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      }
    }
  })

  const lineMetrics = computed(() => {
    const metrics = memberSummary.value?.metrics || []
    if (metrics.length > 0) {
      return metrics
    }

    return buildDateListByRange(selectedDateRange.value).map((date) => ({
      date,
      deposit: "0",
      withdraw: "0"
    }))
  })

  const lineData = computed<ChartData<"line">>(() => {
    return {
      labels: lineMetrics.value.map((item) => {
        const dt = DateTime.fromISO(item.date, { setZone: true })
        return dt.isValid ? dt.toFormat("yyyy-MM-dd") : item.date
      }),
      datasets: [
        {
          label: "存款",
          data: lineMetrics.value.map((item) => toPositiveNumber(item.deposit)),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.22)",
          fill: true,
          tension: 0.36,
          pointRadius: 2,
          pointHoverRadius: 4
        },
        {
          label: "出金",
          data: lineMetrics.value.map((item) => toPositiveNumber(item.withdraw)),
          borderColor: "#9CE3FF",
          backgroundColor: "rgba(156, 227, 255, 0.18)",
          fill: true,
          tension: 0.36,
          pointRadius: 2,
          pointHoverRadius: 4
        }
      ]
    }
  })

  const lineOptions = computed<ChartOptions<"line">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: "#ffffff",
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: "circle"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#d1d5db"
          },
          grid: {
            color: "rgba(255,255,255,0.06)"
          }
        },
        y: {
          beginAtZero: true,
          min: 0,
          ticks: {
            color: "#d1d5db"
          },
          grid: {
            color: "rgba(255,255,255,0.08)",
            borderDash: [4, 4]
          }
        }
      }
    }
  })

  return {
    summaryCards,
    depositAmount,
    withdrawAmount,
    doughnutData,
    doughnutOptions,
    lineData,
    lineOptions
  }
}
