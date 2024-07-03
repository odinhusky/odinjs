import { useMemo } from "react"
import { environment } from "../../../../environments/environment"
import { PageOrModalPathEnum } from "../../PageOrModalPathEnum"
import { IUserInfo } from "../../../persistant/IUserInfo"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { appSlice } from "../../../reduxStore/appSlice"
import useBreakpoint from "../../pageTemplate/hooks/useBreakpoint"
import { usePageNavigate } from "../../router/hooks/usePageNavigate"
import { AppEnvironment } from "../../../device/appEnvironment"
import { AccountService } from "../../../service/AccountService"
// u9 新增 20240628

type IList = {
  text: string
  url: string
  path: string
}

type MyState = {
  userInfo: IUserInfo
  settingList: IList[]
  vipList: IList[]
  menuList: IList[]
}

export const useMyBase = () => {
  const dispatch = useDispatch()
  const { onClickToOpenDownload } = usePageNavigate()
  const { isDesktop, isTablet, isMobile } = useBreakpoint()
  const { userInfo } = AccountService()
  const navigate = useNavigate()

  const settingList: IList[] = [
    {
      text: "Carteira central",
      url: `assets/${environment.uVersion}/icon_wallet.png`,
      path: "",
    },
    {
      text: "Saque",
      url: `assets/${environment.uVersion}/icon_saque.png`,
      path: "",
    },
    {
      text: "Depósito",
      url: `assets/${environment.uVersion}/icon_deposit.png`,
      path: "",
    },
    {
      text: "Juros",
      url: `assets/${environment.uVersion}/icon_setting.png`,
      path: "",
    },
  ]

  const vipList: IList[] = [
    {
      text: "Detalhes da Conta",
      url: `assets/${environment.uVersion}/icon_account.png`,
      path: "",
    },
    {
      text: "Recordes de Apostas",
      url: `assets/${environment.uVersion}/icon_bet.png`,
      path: PageOrModalPathEnum.GameRecordPage,
    },
    {
      text: "Registro de Retiradas",
      url: `assets/${environment.uVersion}/icon_withdraw.png`,
      path: "",
    },
    {
      text: "Configura de Saque",
      url: `assets/${environment.uVersion}/icon_detail.png`,
      path: "",
    },
  ]

  const menuList: IList[] = [
    {
      text: "Convidar",
      url: `assets/${environment.uVersion}/icon_invite.png`,
      path: "",
    },
    {
      text: "Informações pessoais",
      url: `assets/${environment.uVersion}/icon_perfil.png`,
      path: PageOrModalPathEnum.SettingPage,
    },
    {
      text: "Rebate",
      url: `assets/${environment.uVersion}/icon_rebate.png`,
      path: "",
    },
    {
      text: "Suporte",
      url: `assets/${environment.uVersion}/icon_suporte.png`,
      path: "",
    },
    {
      text: "Baixar App",
      url: `assets/${environment.uVersion}/icon_domnload.png`,
      path: "",
    },
    {
      text: "Sair",
      url: `assets/${environment.uVersion}/icon_log_out.png`,
      path: "",
    },
  ]

  const uiState: MyState = useMemo(() => {
    return {
      userInfo,
      settingList,
      vipList,
      menuList,
    }
  }, [])

  const handleClick = (item: IList) => {
    if (item.text === "Baixar App") {
      onDownload()
    }
    if (item.text === "Sair") {
      dispatch(appSlice.actions.showMobileLogoutModal(true))
      return
    }
    if (!item.path) return console.log("path waiting")
    navigate(item.path)
  }

  const onRefresh = () => {
    console.log('onRefresh')
  }

  const onDownload = () => {
    if (AppEnvironment.isAndroid()) {
      onClickToOpenDownload()
    } else {
      dispatch(appSlice.actions.setShowiOSDownloadPopover(true))
    }
  }

  return {
    uiState,
    handleClick,
    onRefresh
  }
}
