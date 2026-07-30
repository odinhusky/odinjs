import { post } from "@/utils/request"

export type LoginData = {
  username: string
  password: string
  agent_code?: string
  otp_code: string
}

export type LoginRes = {
  agentID: number
  roleID: number
  userID: number
  accessToken: string
}

export const login = (options?: { agentCode?: string }) => (params: LoginData) =>
  post<LoginRes>("/user/login", params, {
    name: "login",
    needToken: false,
    headers: {
      AgentCode: options?.agentCode || undefined
    }
  })
