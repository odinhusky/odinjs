import * as Response from "src/api/response.type"

// 社群平台關鍵字
const SOCIAL_KEYWORDS = ["line", "telegram", "ig", "fb", "discord", "wechat", "whatsapp"]

/**
 * 檢查是否包含帳號相關資訊
 * 包含：會員帳號、推薦碼、UID、手機號碼
 */
export function containsAccountInfo(content: string, accountInfo: Response.AccountInfo): boolean {
  const lower = content.toLowerCase()

  // accountInfo 有 account, phone, invite_code, uid
  const userAccount = accountInfo?.account?.toLowerCase()
  const userPhone = accountInfo?.phone
  const inviteCode = accountInfo?.invite_code
  const userUid = accountInfo?.uid?.toString()

  // 檢查帳號
  if (userAccount && lower.includes(userAccount)) {
    return true
  }

  // 檢查手機號碼
  if (userPhone && content.includes(userPhone)) {
    return true
  }

  // 檢查推薦碼
  if (inviteCode && lower.includes(inviteCode.toLowerCase())) {
    return true
  }

  // 檢查 UID
  if (userUid && userUid.length > 3 && content.includes(userUid)) {
    return true
  }

  return false
}

/**
 * 檢查是否包含個人資訊
 * 包含：LINE、FB、IG、Discord等
 */
export function containsSocialKeyword(content: string): boolean {
  const lower = content.toLowerCase()

  // 社群平台關鍵字
  for (const keyword of SOCIAL_KEYWORDS) {
    if (lower.includes(keyword)) {
      return true
    }
  }

  return false
}

/**
 * 檢查是否包含電話資訊
 * 包含：0909641025 或 +886909641025
 */
export function containsPhoneNumber(content: string): boolean {
  // 電話格式
  const phonePatterns = [
    /09\d{8}/, // 台灣手機 (09 開頭 + 8位數字)
    /\+\d{1,3}[\s-]?\d{7,12}/ // 國際電話 (+ 開頭，限制長度)
  ]

  for (const pattern of phonePatterns) {
    if (pattern.test(content)) {
      return true
    }
  }

  return false
}

/**
 * 檢查是否包含個人資訊
 * 包含：電話、LINE、FB、IG、Discord、地址等
 */
export function containsPersonalInfo(content: string): boolean {
  // 電話格式
  if (containsPhoneNumber(content)) {
    return true
  }

  // 社群平台關鍵字
  if (containsSocialKeyword(content)) {
    return true
  }

  return false
}

/**
 * 檢查是否包含域名格式
 */
export function containsDomain(content: string): boolean {
  const lower = content.toLowerCase()

  // 域名格式（如 123.com, abc.com.tw）
  const domainRegex = /[a-z0-9-]+\.[a-z]{2,}(\.[a-z]{2,})?/i
  return domainRegex.test(lower)
}

/**
 * 判斷四個數字是否連續升或降
 */
function isConsecutive(nums: number[]): boolean {
  if (nums.length !== 4) {
    return false
  }

  return (
    (nums[0] + 1 === nums[1] && nums[1] + 1 === nums[2] && nums[2] + 1 === nums[3]) ||
    (nums[0] - 1 === nums[1] && nums[1] - 1 === nums[2] && nums[2] - 1 === nums[3])
  )
}

/**
 * 檢查是否有連續 4 個字母（順序、倒序或相同）
 */
export function has4ConsecutiveLetters(s: string): boolean {
  const lower = s.toLowerCase()
  let count = 1

  for (let i = 1; i < lower.length; i++) {
    const curr = lower[i]
    const prev = lower[i - 1]

    if (/[a-z]/.test(curr) && /[a-z]/.test(prev)) {
      const diff = curr.charCodeAt(0) - prev.charCodeAt(0)
      if (diff === 1 || diff === -1 || diff === 0) {
        count++
      } else {
        count = 1
      }
    } else {
      count = 1
    }

    if (count >= 4) {
      return true
    }
  }

  return false
}

/**
 * 檢查是否有連續 4 個數字（升序或降序）
 */
export function has4ConsecutiveDigits(s: string): boolean {
  const digits: number[] = []

  for (const ch of s) {
    if (/\d/.test(ch)) {
      digits.push(parseInt(ch))
    } else {
      digits.length = 0 // 遇到非數字就重置
    }

    if (digits.length >= 4) {
      const last4 = digits.slice(-4)
      if (isConsecutive(last4)) {
        return true
      }
    }
  }

  return false
}

/**
 * 只允許文字、數字、空格（禁止特殊符號）
 * 使用 Unicode 屬性來匹配各種語言的字母
 */
export function containsNotOnlyLettersNumbersSpace(content: string): boolean {
  const allowedRegex = /^[\p{L}\p{N} ]+$/u
  if (!allowedRegex.test(content)) {
    return true
  }

  return false
}
