import { useState, useEffect } from "react";
import Footer from "../../components/footer/HomeFooter";
import styled from "styled-components";
import Cancel from "../../assets/icon/Deal/backArrow.png";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import copy from "../../assets/icon/profile/copy.png";
import check from "../../assets/icon/profile/check.png";
import nodata from "../../assets/icon/no-item-find.png";
import { CopyToClipboard } from "react-copy-to-clipboard";
import api from "../../common/api";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${COLORS.EXLight_gray};
`;

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  height: 44px;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  position: relative;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  margin-left: 4px;
`;
const HeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
`;

const SelectIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const SetButton = styled.div`
  text-align: center;
  color: ${COLORS.Dark_gray};
  font-weight: 600;
`;

const RecommandCard = styled.div`
  height: 211px;
  margin: 16px;
  background: #fff;
  border-radius: 8px;
`;

const RecommandCardTitleContainer = styled.div`
  height: 86px;
  width: 100%;
  background: ${COLORS.Dark_gray};
  border-radius: 8px 8px 0 0;
  padding: 16px;
`;

const RecommandCardContentContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const RecommandCardTitle = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.EXLight_gray};
`;

const RecommandCardTitleCode = styled.p`
  font-size: 24px;
  font-weight: 700;
  line-height: 30px;
  color: #ff786b;
`;

const RecommandCardCodeCopy = styled.img`
  width: 28px;
  height: 28px;
`;
const RecommandCardstatusContainer = styled.div`
  width: 100%;
  height: 125px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ModalCover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(100, 100, 100, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalPopOut = styled.div`
  width: 91px;
  height: 91px;
  background: rgba(56, 55, 67, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ModalCheckIcon = styled.img`
  width: 33px;
  height: 33px;
`;
const ModalCheckContent = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.4px;
  color: #ffffff;
  margin-top: 9px;
`;

const RecommandCardItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const RecommandCardItemTitle = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Mid_gray};
`;
const RecommandCardItemUnit = styled.div`
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.004em;
  color: ${COLORS.Gray};
  display: flex;
  align-items: center;
`;
const RecommandContainerList = styled.div`
  width: 100%;
  padding: 16px;
  background: #fff;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const RecommandButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const RecommandButton = styled.button<{ status: string; select: string }>`
  border: none;
  background: ${props =>
        props.status === props.select ? COLORS.Gray : "#fff"};
  padding: 5px 12px;
  border-radius: 16px;
  margin-right: 8px;
`;
const RecommandButtonText = styled.p<{ status: string; select: string }>`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.012em;
  color: ${props =>
        props.status === props.select ? "#fff" : COLORS.Mid_gray};
`;
const RecommandListItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
`;

const ListItemContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItemUnit = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.004em;
  color: ${COLORS.Dark_gray};
`;
const ItemNameID = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: 0.004em;
  color: ${COLORS.Dark_gray};
`;
const ItemDate = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.004em;
  color: ${COLORS.Mid_gray};
`;
const NoitemFindIcon = styled.img`
  width: 135px;
  height: 135px;
  margin: 60px auto 24px auto;
`;

const NoitemFindContent = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Light_gray};
  margin-bottom: 30%;
`;

const Rebate = () => {
    const [isCopy, setIsCopy] = useState(false);
    const [optionSelect, setOptionSelect] = useState("rebate");
    const [memberNumber, setMemberNumber] = useState(0);
    const [records, setRecord] = useState([]);
    const [tradeMembers, setTradeMembers] = useState([]);
    const [sum, setSum] = useState(0);
    const [code, setCode] = useState("");
    const navigation = useNavigate();
    const { t } = useTranslation();
    useEffect(() => {
        api.get("/investor/commission").then(x => {
            // console.log(x.data)
            let sum = 0;
            setMemberNumber(x.data.memberNumber);
            setRecord(x.data.records.reverse());
            setTradeMembers(x.data.tradeMembers);
            for (let i = 0; i < x.data.records.length; i++) {
                sum = sum + x.data.records[i].amount;
            }
            setSum(sum);
        });
        api.get("/investor/invite-code").then(x => {
            setCode(x.data);
        });
    }, []);
    return (
        <PageContainer>
            <HeaderContainer>
                <HeaderLeft>
                    <SelectIcon
                        src={Cancel}
                        alt="cancel"
                        onClick={() => {
                            navigation("/member");
                        }}
                    />
                </HeaderLeft>
                <HeaderRight>
                    <SetButton>{t("referralManage")}</SetButton>
                </HeaderRight>
            </HeaderContainer>
            <RecommandCard>
                <RecommandCardTitleContainer>
                    <RecommandCardTitle>{t("myReferralCode")}</RecommandCardTitle>
                    <RecommandCardContentContainer>
                        <RecommandCardTitleCode>{code}</RecommandCardTitleCode>
                        <CopyToClipboard text={code}>
                            <RecommandCardCodeCopy
                                src={copy}
                                alt="copy"
                                onClick={() => {
                                    setIsCopy(v => !v);
                                    setTimeout(() => {
                                        setIsCopy(v => !v);
                                    }, 800);
                                }}
                            />
                        </CopyToClipboard>
                    </RecommandCardContentContainer>
                </RecommandCardTitleContainer>
                <RecommandCardstatusContainer>
                    <RecommandCardItem>
                        <RecommandCardItemTitle>
                            {t("referralIncome")}
                        </RecommandCardItemTitle>
                        <RecommandCardItemUnit>
                            <p
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    lineHeight: "20px",
                                    letterSpacing: "0.004em",
                                    color: "#383743",
                                    marginRight: 4
                                }}
                            >
                                {sum.toFixed(6)}
                            </p>
                            USDT
                        </RecommandCardItemUnit>
                    </RecommandCardItem>
                    <RecommandCardItem>
                        <RecommandCardItemTitle>
                            {t("referralActiveMember")}
                        </RecommandCardItemTitle>
                        <RecommandCardItemUnit>
                            <p
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    lineHeight: "20px",
                                    letterSpacing: "0.004em",
                                    color: "#383743",
                                    marginRight: 4
                                }}
                            >
                                {tradeMembers.length}
                            </p>
                            {t("people")}
                        </RecommandCardItemUnit>
                    </RecommandCardItem>
                    <RecommandCardItem>
                        <RecommandCardItemTitle>
                            {t("referralAllMember")}
                        </RecommandCardItemTitle>
                        <RecommandCardItemUnit>
                            <p
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    lineHeight: "20px",
                                    letterSpacing: "0.004em",
                                    color: "#383743",
                                    marginRight: 4
                                }}
                            >
                                {memberNumber}
                            </p>
                            {t("people")}
                        </RecommandCardItemUnit>
                    </RecommandCardItem>
                </RecommandCardstatusContainer>
            </RecommandCard>
            <RecommandContainerList>
                <RecommandButtonContainer>
                    <RecommandButton
                        status={"rebate"}
                        select={optionSelect}
                        onClick={() => setOptionSelect("rebate")}
                    >
                        <RecommandButtonText status={"rebate"} select={optionSelect}>
                            {t("commissionHistory")}
                        </RecommandButtonText>
                    </RecommandButton>
                    <RecommandButton
                        status={"recommand"}
                        select={optionSelect}
                        onClick={() => setOptionSelect("recommand")}
                    >
                        <RecommandButtonText status={"recommand"} select={optionSelect}>
                            {t("referralAllMember")}
                        </RecommandButtonText>
                    </RecommandButton>
                </RecommandButtonContainer>
                {optionSelect === "rebate" ? (
                    <>
                        {records.map((x: any) => {
                            return (
                                <RecommandListItem>
                                    <ListItemContainer>
                                        <ItemNameID>ID {x.childAccount}</ItemNameID>
                                        <ItemDate>
                                            {new Date(x.createdDate).toISOString().split("T")[0]}{" "}
                                            {
                                                new Date(x.createdDate)
                                                    .toISOString()
                                                    .split("T")[1]
                                                    .split(".")[0]
                                            }
                                        </ItemDate>
                                    </ListItemContainer>
                                    <ListItemUnit>{x.amount} USDT</ListItemUnit>
                                </RecommandListItem>
                            );
                        })}
                        {records.length === 0 && (
                            <>
                                <NoitemFindIcon src={nodata} alt="no item" />
                                <NoitemFindContent>
                                    尚無{t("commissionHistory")}
                                </NoitemFindContent>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {tradeMembers.map((x: any) => {
                            return (
                                <RecommandListItem>
                                    <ListItemContainer>
                                        <ItemNameID>ID {x}</ItemNameID>
                                        {/* <ItemDate>{new Date(x.createdDate).toISOString().split("T")[0]} {new Date(x.createdDate).toISOString().split("T")[1].split(".")[0]}</ItemDate> */}
                                    </ListItemContainer>
                                    <ListItemUnit>已交易</ListItemUnit>
                                </RecommandListItem>
                            );
                        })}
                        {tradeMembers.length === 0 && (
                            <>
                                <NoitemFindIcon src={nodata} alt="no item" />
                                <NoitemFindContent>尚無推薦用戶</NoitemFindContent>
                            </>
                        )}
                    </>
                )}
            </RecommandContainerList>
            {isCopy && (
                <ModalCover>
                    <ModalPopOut>
                        <ModalCheckIcon src={check} alt="check" />
                        <ModalCheckContent>複製成功</ModalCheckContent>
                    </ModalPopOut>
                </ModalCover>
            )}
            <Footer locationPage={"/profile"} />
        </PageContainer>
    );
};

export default Rebate;
