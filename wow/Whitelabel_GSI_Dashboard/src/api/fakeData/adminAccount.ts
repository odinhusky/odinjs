import * as Response from "@/api/response.type"

export const AdminAccountList: Response.GetAdminAccount = [
  {
    id: 1,
    member_account: "admin1",
    name: "測試員",
    update_time: 1685548800000,
    permission_level: "Admin",
    permission_content: 3,
    enable_or_disable: 0,
    status: 0,
    actions: 1,
    phone: "0911111111",
    email: "test@gmail.com",
    password: "",
    remark: "測試",
    verify_binding: 1
  },
  {
    id: 2,
    member_account: "admin2",
    name: "sam",
    update_time: 1685548800000,
    permission_level: "Admin",
    permission_content: 1,
    enable_or_disable: 1,
    status: 1,
    actions: 1,
    phone: "0911111111",
    email: "test@gmail.com",
    password: "",
    remark: "測試",
    verify_binding: 1
  },
  {
    id: 3,
    member_account: "admin3",
    name: "Eric",
    update_time: 1685548800000,
    permission_level: "Admin",
    permission_content: 3,
    enable_or_disable: 1,
    status: 1,
    actions: 1,
    phone: "0911111111",
    email: "test@gmail.com",
    password: "",
    remark: "測試",
    verify_binding: 0
  },
  {
    id: 4,
    member_account: "admin4",
    name: "mary",
    update_time: 1685548800000,
    permission_level: "Admin",
    permission_content: 5,
    enable_or_disable: 1,
    status: 1,
    actions: 1,
    phone: "0911111111",
    email: "test@gmail.com",
    password: "",
    remark: "測試",
    verify_binding: 0
  },
  {
    id: 5,
    member_account: "admin5",
    name: "tom",
    update_time: 1685548800000,
    permission_level: "Admin",
    permission_content: 3,
    enable_or_disable: 1,
    status: 1,
    actions: 1,
    phone: "0911111111",
    email: "test@gmail.com",
    password: "",
    remark: "測試",
    verify_binding: 0
  },
  {
    id: 6,
    member_account: "admin6",
    name: "brian",
    update_time: 1685548800000,
    permission_level: "Admin",
    permission_content: 5,
    enable_or_disable: 1,
    status: 1,
    actions: 1,
    phone: "0911111111",
    email: "test@gmail.com",
    password: "",
    remark: "測試",
    verify_binding: 0
  }
]

export const AdminAccountPermissionList: Response.GetAdminAccountPermission = [
  {
    id: 1,
    name: "admin",
    permission_content: 1,
    enable_or_disable: 1,
    actions: 1,
    remark: "測試"
  },
  {
    id: 2,
    name: "admin",
    permission_content: 1,
    enable_or_disable: 1,
    actions: 1,
    remark: ""
  },
  {
    id: 3,
    name: "admin",
    permission_content: 1,
    enable_or_disable: 1,
    actions: 1,
    remark: ""
  },
  {
    id: 4,
    name: "admin",
    permission_content: 1,
    enable_or_disable: 1,
    actions: 1,
    remark: ""
  }
]
