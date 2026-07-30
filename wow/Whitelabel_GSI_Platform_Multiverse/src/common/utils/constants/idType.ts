import { computed } from "vue"

export enum Enums {
  // ID Types
  NATIONAL_ID = "NATIONAL_ID",
  PASSPORT = "PASSPORT",
  DRIVERS_LICENSE = "DRIVERS_LICENSE",
  SELFIE = "SELFIE",
  PAYSLIP = "PAYSLIP",
  TAX_ID = "TAX_ID",
  SOCIAL_SECURITY_CARD = "SOCIAL_SECURITY_CARD",
  SENIOR_CITIZEN_CARD = "SENIOR_CITIZEN_CARD",
  POLICE_CLEARANCE = "POLICE_CLEARANCE", // 沒有背面
  POSTAL_ID = "POSTAL_ID",
  VOTER_ID = "VOTER_ID",
  SEAMANS_BOOK = "SEAMANS_BOOK",
  HEALTH_INSURANCE_CARD = "HEALTH_INSURANCE_CARD",
  PH_PRC_ID = "PH_PRC_ID",
  PH_BARANGAY_CERTIFICATION = "PH_BARANGAY_CERTIFICATION",
  PH_ACR_ICR = "PH_ACR_ICR",
  PH_UMID = "PH_UMID",
  PH_OWWA_ID = "PH_OWWA_ID",
  PH_OFW_ID = "PH_OFW_ID",
  PH_NBI_CLEARANCE = "PH_NBI_CLEARANCE", // 沒有背面
  PH_FIREARMS_LICENSE = "PH_FIREARMS_LICENSE",
  PH_IBP_ID = "PH_IBP_ID"
}

export const FrontendLabel: Record<string, string> = {
  [Enums.NATIONAL_ID]: "National ID",
  [Enums.PASSPORT]: "Passport",
  [Enums.DRIVERS_LICENSE]: "Driver's License",
  [Enums.SELFIE]: "Selfie",
  [Enums.PAYSLIP]: "Payslip",
  [Enums.TAX_ID]: "Tax Identification Number",
  [Enums.SOCIAL_SECURITY_CARD]: "Social Security System Card",
  [Enums.SENIOR_CITIZEN_CARD]: "Senior Citizen Card",
  [Enums.POLICE_CLEARANCE]: "Police Clearance Certificate",
  [Enums.POSTAL_ID]: "Postal ID",
  [Enums.VOTER_ID]: "Voter's ID",
  [Enums.SEAMANS_BOOK]: "Seaman's Book",
  [Enums.HEALTH_INSURANCE_CARD]: "Philhealth ID",
  [Enums.PH_PRC_ID]: "Professional Regulations Commission ID",
  [Enums.PH_BARANGAY_CERTIFICATION]: "Barangay Certification (with photo)",
  [Enums.PH_ACR_ICR]: "Alien Certificate of Registration/Immigrant Certificate of Registration",
  [Enums.PH_UMID]: "Unified Multi-Purpose ID (UMID)",
  [Enums.PH_OWWA_ID]: "Overseas Workers Welfare Administration ID",
  [Enums.PH_OFW_ID]: "Overseas Filipino Worker ID",
  [Enums.PH_NBI_CLEARANCE]: "National Bureau of Investigation Clearance",
  [Enums.PH_FIREARMS_LICENSE]: "Firearms License issued by the Philippine National Police",
  [Enums.PH_IBP_ID]: "Integrated Bar of the Philippines"
}

export const Dropdown = computed(() => {
  return Object.keys(Enums).map((key) => ({
    label: FrontendLabel[Enums[key as keyof typeof Enums]],
    value: Enums[key as keyof typeof Enums]
  }))
})
