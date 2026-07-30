import { defineStore } from "pinia"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { useQueryStore } from "@/stores/queryStore"
import { ANNOUNCEMENT_MEMBER_TYPE } from "@/utils/constants"
import { useSiteStore } from "@/stores/siteStore"
export const useMemberAnnouncement = defineStore("memberLevelStore", {
  state: () => {
    return {
      memberAnnouncementItem: {} as Request.AddMemberAnnouncement
    }
  },
  actions: {
    initMemberAnnouncementItem() {
      const siteStore = useSiteStore()
      this.memberAnnouncementItem = {
        type: ANNOUNCEMENT_MEMBER_TYPE.Enums.ACTIVE_MESSAGE,
        start_time: "",
        end_time: "",
        enable: 1,
        details: [],
        target_member_ids: [],
        show_member_ids: [],
        member_mode: "true",
        display_options: []
      }
      this.memberAnnouncementItem.details = siteStore.langList.map((lang: any) => ({
        lang: lang.label,
        title: "",
        content: "",
        image: "",
        image_path: ""
      }))
    }
  },
  persist: true
})
