import { PageContainer } from "../../../../components-bs/PageContainer"
import { IInvitePage } from "../.."

export const InvitePage = (props: IInvitePage) => {
  const { children,level1RechargeData } = props
  return <PageContainer className="pt-7">{children}</PageContainer>
}
