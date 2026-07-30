import { MAIL_STATUS_ENUMS } from "@shared-lib/constants/enums/mailStatus"
import { MAIL_TYPE_ENUMS } from "@shared-lib/constants/enums/mailType"
import type { ResponseMailItem } from "@shared-lib/api/apiFunctions/mail_getMailList"

export const MEMBER_INBOX_MOCK_ROWS: ResponseMailItem[] = [
  {
    index: 1,
    id: 990001,
    mail_type: MAIL_TYPE_ENUMS.PROMOTION,
    mail_title: "佣金派發通知",
    mail_body: "親愛的會員您好，您本期佣金已完成派發，請至錢包查詢最新餘額。",
    status: MAIL_STATUS_ENUMS.ACTIVE,
    send_at: "2026-04-27 10:30:00"
  },
  {
    index: 2,
    id: 990002,
    mail_type: MAIL_TYPE_ENUMS.WINNING,
    mail_title: "中獎通知",
    mail_body: "恭喜您於活動中獲得獎勵，彩金已入帳，祝您遊戲愉快。",
    status: MAIL_STATUS_ENUMS.ACTIVE,
    send_at: "2026-04-26 13:15:00"
  },
  {
    index: 3,
    id: 990003,
    mail_type: MAIL_TYPE_ENUMS.PROMOTION,
    mail_title: "系統公告",
    mail_body: "平台將於今晚進行例行維護，期間部分功能可能暫時不可用。",
    status: MAIL_STATUS_ENUMS.COMPLETED,
    send_at: "2026-04-25 09:40:00"
  }
]
