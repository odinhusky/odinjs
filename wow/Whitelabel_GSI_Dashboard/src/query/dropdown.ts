import { useQuery } from "@tanstack/vue-query"
import { computed } from "vue"
import { getMemberLevelList } from "@/api/memberLevel"
import { getMemberTagOptionList } from "@/api/member"
import { useLanguageStore } from "@/stores/languageStore"

type DropdownOption = {
  label: string
  value: number
}

export const dropdownKeys = {
  memberLevel: () => ["memberLevel", "dropdown"] as const,
  memberTag: () => ["memberTag", "dropdown"] as const
}

export function useMemberLevelDropdownQuery() {
  return useQuery({
    queryKey: dropdownKeys.memberLevel(),
    queryFn: async () => {
      const res = await getMemberLevelList()
      if (res.code !== 0) throw new Error(res.msg || "getMemberLevelList failed")
      return res.data || []
    }
  })
}

export function useMemberLevelDropdownOptions() {
  const languageStore = useLanguageStore()
  const query = useMemberLevelDropdownQuery()

  const options = computed<DropdownOption[]>(() => {
    const nowLang = String(languageStore.currentLanguageOption.backendKey || "").toLowerCase()
    return (query.data.value || []).map((e) => {
      const titles = (e?.titles || {}) as unknown as Record<string, string>
      const label = titles[nowLang] || Object.values(titles).find(Boolean) || ""
      return { label, value: e.id }
    })
  })

  return {
    ...query,
    options
  }
}

export function useMemberTagDropdownQuery() {
  return useQuery({
    queryKey: dropdownKeys.memberTag(),
    queryFn: async () => {
      const res = await getMemberTagOptionList()
      if (res.code !== 0) throw new Error(res.msg || "getMemberTagOptionList failed")
      return Array.isArray(res.data) ? res.data : []
    }
  })
}

export function useMemberTagDropdownOptions() {
  const query = useMemberTagDropdownQuery()

  const options = computed<DropdownOption[]>(() => {
    return (query.data.value || [])
      .filter((e: any) => e?.enabled === true)
      .map((e: any) => ({
        label: String(e?.name || ""),
        value: Number(e?.id || 0)
      }))
  })

  return {
    ...query,
    options
  }
}
