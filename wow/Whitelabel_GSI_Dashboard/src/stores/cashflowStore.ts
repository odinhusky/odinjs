import { defineStore } from "pinia"
import type * as Request from "@/api/request.type"

const defaultQuickAmounts: string[] = ["500", "1000", "5000", "10000", "50000"]

export const useCashFlowStore = defineStore("cashFlowStore", {
  state: () => {
    return {
      gatewayItem: {} as Request.GatewayItemDetail
    }
  },
  actions: {
    initGatewayItem() {
      this.gatewayItem = {
        name: "",
        type: 1,
        display: false,
        deposit: true,
        withdraw: false,
        currency: 0,
        remark: "",
        deposit_min: "0.00",
        deposit_max: "0.00",
        withdraw_min: "0.00",
        withdraw_max: "0.00",
        audit_rate: "1.00",
        fee_type: 1,
        fee_amount: "0.00",
        fee_rate: "0.00",
        usdt_rate: "1",
        bank_name: "",
        bank_account: "",
        qrcode_image_id: 0,
        qrcodeImgUrl: "",
        qrcodeImgFile: undefined,
        logo_image_id: 0,
        logoImgUrl: "",
        logoImgFile: undefined,
        crypto_info: { wallet_address: "", chain: "", image_id: 0 },
        crypto: 1,
        extra_remark: [],
        quick_amounts: [...defaultQuickAmounts],
        support_method_type: 1
      }
    }
  },
  persist: true
})
