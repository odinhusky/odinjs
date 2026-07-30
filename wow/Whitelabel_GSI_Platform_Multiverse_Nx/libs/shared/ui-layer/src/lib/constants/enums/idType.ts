import { computed } from "vue"

export enum ID_TYPE_ENUMS {
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

export const ID_FRONTEND_LABEL: Record<string, string> = {
  [ID_TYPE_ENUMS.NATIONAL_ID]: "National ID",
  [ID_TYPE_ENUMS.PASSPORT]: "Passport",
  [ID_TYPE_ENUMS.DRIVERS_LICENSE]: "Driver's License",
  [ID_TYPE_ENUMS.SELFIE]: "Selfie",
  [ID_TYPE_ENUMS.PAYSLIP]: "Payslip",
  [ID_TYPE_ENUMS.TAX_ID]: "Tax Identification Number",
  [ID_TYPE_ENUMS.SOCIAL_SECURITY_CARD]: "Social Security System Card",
  [ID_TYPE_ENUMS.SENIOR_CITIZEN_CARD]: "Senior Citizen Card",
  [ID_TYPE_ENUMS.POLICE_CLEARANCE]: "Police Clearance Certificate",
  [ID_TYPE_ENUMS.POSTAL_ID]: "Postal ID",
  [ID_TYPE_ENUMS.VOTER_ID]: "Voter's ID",
  [ID_TYPE_ENUMS.SEAMANS_BOOK]: "Seaman's Book",
  [ID_TYPE_ENUMS.HEALTH_INSURANCE_CARD]: "Philhealth ID",
  [ID_TYPE_ENUMS.PH_PRC_ID]: "Professional Regulations Commission ID",
  [ID_TYPE_ENUMS.PH_BARANGAY_CERTIFICATION]: "Barangay Certification (with photo)",
  [ID_TYPE_ENUMS.PH_ACR_ICR]: "Alien Certificate of Registration/Immigrant Certificate of Registration",
  [ID_TYPE_ENUMS.PH_UMID]: "Unified Multi-Purpose ID (UMID)",
  [ID_TYPE_ENUMS.PH_OWWA_ID]: "Overseas Workers Welfare Administration ID",
  [ID_TYPE_ENUMS.PH_OFW_ID]: "Overseas Filipino Worker ID",
  [ID_TYPE_ENUMS.PH_NBI_CLEARANCE]: "National Bureau of Investigation Clearance",
  [ID_TYPE_ENUMS.PH_FIREARMS_LICENSE]: "Firearms License issued by the Philippine National Police",
  [ID_TYPE_ENUMS.PH_IBP_ID]: "Integrated Bar of the Philippines"
}

export const ID_DROPDOWN = computed(() => {
  return Object.keys(ID_TYPE_ENUMS).map((key) => ({
    label: ID_FRONTEND_LABEL[ID_TYPE_ENUMS[key as keyof typeof ID_TYPE_ENUMS]],
    value: ID_TYPE_ENUMS[key as keyof typeof ID_TYPE_ENUMS]
  }))
})
