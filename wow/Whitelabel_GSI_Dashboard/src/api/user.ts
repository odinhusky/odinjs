import Request from "../utils/request"

// keyword 為非必填條件

interface getUserInfo {
  page: number
  pageSize: number
  isEnabled: number
  roleId?: string | number
  accountOrName?: string
}

interface UserUpdate {
  isEnabled: boolean
  userId?: number
  roleIds: number[]
}

export const getRoleDropdownList = () => {
  return Request({
    url: "/v1/role/options",
    method: "get"
  })
}

export const getRolePermissionList = () => {
  return Request({
    url: "/v1/role/permissionOptions",
    method: "get"
  })
}

export const getUserList = (params: getUserInfo) => {
  const { isEnabled, offset, pageSize, roleId, accountOrName } = params
  let filterParams: getUserInfo = {
    page,
    pageSize,
    isEnabled
  }

  if (roleId !== "") {
    filterParams.roleId = roleId
  }
  if (accountOrName !== "") {
    filterParams.accountOrName = accountOrName
  }

  return Request({
    url: "/v1/user",
    method: "get",
    params: filterParams
  })
}

export const getUserPreview = (params: { roleIds: number[] }) => {
  return Request({
    url: `/v1/user/preview`,
    method: "get",
    params
  })
}

export const getUserDetail = (params: { id: number }) => {
  const { id } = params

  return Request({
    url: `/v1/user/${id}`,
    method: "get"
  })
}

export const addUser = (id = null, infoData: UserUpdate) => {
  let data: UserUpdate = {
    isEnabled: infoData.isEnabled,
    userId: infoData.userId,
    roleIds: infoData.roleIds
  }

  return Request({
    url: "/v1/user",
    method: "post",
    data
  })
}

export const updateUser = (id = null, infoData: UserUpdate) => {
  let data: UserUpdate = {
    isEnabled: infoData.isEnabled,
    roleIds: infoData.roleIds
  }

  return Request({
    url: `/v1/user/${id}`,
    method: "patch",
    data
  })
}

export const deleteRole = (id = null) => {
  return Request({
    url: `/v1/role/${id}`,
    method: "delete"
  })
}
