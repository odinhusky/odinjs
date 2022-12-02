import * as React from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { RootStackScreenProps } from "common/types";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import C2cBuyFirst from "components/c2c/buy/C2cBuyFirst";
import C2cBuySecond from "components/c2c/buy/C2cBuySecond";
import C2cBuyLast from "components/c2c/buy/C2cBuyLast";
import CountdownTimer from "components/c2c/CountdownTimer";
import { useAppSelector } from "hooks";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useTranslation } from "react-i18next";
const Container = styled(View) <{ insets: number }>`
  display: flex;
  flex-direction: column;
  padding-top: ${props => props.insets}px;
  background-color: #18222d;
  justify-content: space-between;
`;

const HeaderContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #18222d;
  padding-top: 12px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 10px;
`;

const PreviousIcon = styled(Image)`
  width: 28px;
  height: 28px;
`;

const HeaderTitleText = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.color.White};
`;

const HeaderEmptyContainer = styled(View)`
  width: 28px;
  height: 28px;
`;

const ProgressBarContainer = styled(View)`
  display: flex;
  flex-direction: row;
`;

const ProgressBarElseLine = styled(View)`
  height: 4px;
  background-color: ${props => props.theme.color.DarkGray};
`;

const TopContainer = styled(View)`
  display: flex;
  flex-direction: column;
  background-color: #18222d;
`;

const TopInColumnContainer = styled(View)`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
`;

const TopContainerTitleText = styled(Text)`
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  color: ${props => props.theme.color.White};
`;

const TopContainerTimerContainer = styled(View)`
  display: flex;
  flex-direction: row;
  margin-top: 4px;
`;

const TopContainerDetailText = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.theme.color.LightMidGray};
  margin-top: 4px;
`;

const C2cBuyScreen = ({
    navigation,
    route
}: RootStackScreenProps<"C2cBuyScreen">) => {
    const { from } = route.params
    const insets = useSafeAreaInsets();
    const advertisement = useAppSelector((state) => state.c2c.advertisement)
    const otcOrder = useAppSelector((state) => state.otcOrder.buying)
    // 先用假資料等之後再將Payments Array內容轉成以下
    // const payTypeAccount = true; // 帳戶付款 Boolean
    // const payTypeTouchnGo = true; // TouchnGo付款 Boolean
    // const payTypePpay = true; // Ppay付款 Boolean

    const [payTypeAccount, setPayTypeAccount] = useState(false);
    const [payTypeTouchnGo, setPayTypeTouchnGo] = useState(false);
    const [payTypePpay, setPayTypePpay] = useState(false);

    // 購買流程
    const [swapPage, setSwapPage] = useState(1);

    // 選擇付款方式
    const [choosePayType, setChoosePayType] = useState("");

    // USER INFO
    // const [account, setAccount] = useState("");
    // const [userId, setUserId] = useState("");
    // const [buyFeeRate, setBuyFeeRate] = useState(0);
    // const [sellFeeRate, setSellFeeRate] = useState(0);

    // 付款確認 等待放行
    const [isWaitFinish, setIsWaitFinish] = useState(0);

    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();
    // const getUserInfo = async () => {
    //   userService.getOtcUserInfo(user.account).then((response)=>{
    //     setBuyFeeRate(response.buyFeeRate)
    //     setSellFeeRate(response.sellFeeRate)
    //   })
    // };

    // 判斷付款類型
    const checkPaymentType = () => {
        if (!advertisement.payments) {
            return
        }
        if (
            advertisement.payments.some((x: any) => {
                return x.type == "BANK";
            })
        ) {
            setPayTypeAccount(true);
        }
        if (
            advertisement.payments.some((x: any) => {
                return x.type == "TOUCHNGO";
            })
        ) {
            setPayTypeTouchnGo(true);
        }
        if (
            advertisement.payments.some((x: any) => {
                return x.type == "PPAY";
            })
        ) {
            setPayTypePpay(true);
        }
    };

    useEffect(() => {
        checkPaymentType();
    }, []);

    useEffect(() => {
        if (from === "order") {
            setSwapPage(2);
        }
    }, [from]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container insets={insets.top}>
                {loading && (
                    <Spinner
                        visible={true}
                        textContent={""}
                        color={"#FFFFFF"}
                        textStyle={{ color: "#FFFFFF" }}
                    />
                )}
                <HeaderContainer>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <PreviousIcon
                            source={require("assets/images/global/previous.png")}
                        />
                    </TouchableOpacity>
                    <HeaderTitleText>{t(`fiatBuy`)} {advertisement.cryptoAsset}</HeaderTitleText>
                    <HeaderEmptyContainer></HeaderEmptyContainer>
                </HeaderContainer>
                {swapPage === 1 && (
                    <C2cBuyFirst
                        PayTypeAccount={payTypeAccount}
                        PayTypeTouchnGo={payTypeTouchnGo}
                        PayTypePpay={payTypePpay}
                        onChangeSetSwapPage={setSwapPage}
                        onValueChangeIsWaitFinish={setIsWaitFinish}
                    />
                )}
                {
                    swapPage === 2 && isWaitFinish === 0 && (
                        <TopContainer>
                            <ProgressBarContainer>
                                <LinearGradient
                                    colors={["#A8C2DC", "#6699CC"]}
                                    style={{
                                        height: 4,
                                        width: "33%"
                                    }}
                                ></LinearGradient>
                                <ProgressBarElseLine
                                    style={{ width: "67%" }}
                                ></ProgressBarElseLine>
                            </ProgressBarContainer>
                            <TopInColumnContainer>
                                <TopContainerTitleText>
                                    {t(`otcOrder._status.${otcOrder.status}`)}
                                </TopContainerTitleText>
                                <TopContainerTimerContainer>
                                    <CountdownTimer targetDate={otcOrder.paymentTimeLimit} />
                                </TopContainerTimerContainer>
                            </TopInColumnContainer>
                        </TopContainer>
                    )
                }
                {swapPage === 2 &&
                    isWaitFinish === 1 && (
                        <TopContainer>
                            <ProgressBarContainer>
                                <LinearGradient
                                    colors={["#A8C2DC", "#6699CC"]}
                                    style={{
                                        height: 4,
                                        width: "66%"
                                    }}
                                ></LinearGradient>
                                <ProgressBarElseLine
                                    style={{ width: "34%" }}
                                ></ProgressBarElseLine>
                            </ProgressBarContainer>
                            <TopInColumnContainer>
                                <TopContainerTitleText>{t("waitSellerTransfer")}</TopContainerTitleText>
                                <TopContainerTimerContainer>
                                    <CountdownTimer targetDate={otcOrder.paymentTimeLimit} />
                                </TopContainerTimerContainer>
                            </TopInColumnContainer>
                        </TopContainer>
                    )}
                {swapPage === 3 &&
                    isWaitFinish === 2 && (
                        <TopContainer>
                            <ProgressBarContainer>
                                <LinearGradient
                                    colors={["#A8C2DC", "#6699CC"]}
                                    style={{
                                        height: 4,
                                        width: "100%"
                                    }}
                                ></LinearGradient>
                                <ProgressBarElseLine
                                    style={{ width: "0%" }}
                                ></ProgressBarElseLine>
                            </ProgressBarContainer>
                            <TopInColumnContainer>
                                <TopContainerTitleText>{t("orderFinish")}</TopContainerTitleText>
                                <TopContainerDetailText>
                                    {t("fiatOrderFinishedMsg")}
                                </TopContainerDetailText>
                            </TopInColumnContainer>
                        </TopContainer>
                    )}
                {
                    swapPage === 2 && (
                        <C2cBuySecond
                            PayTypeTouchnGo={payTypeTouchnGo}
                            PayTypePpay={payTypePpay}
                            onChangeSetSwapPage={setSwapPage}
                            onChangeSetChoosePayType={setChoosePayType}
                            onValueChangeIsWaitFinish={setIsWaitFinish}
                        />
                    )
                }
                {
                    swapPage === 3 && isWaitFinish === 2 && <C2cBuyLast ChosenPayType={choosePayType} />
                }
            </Container>
        </TouchableWithoutFeedback>
    );
};
export default C2cBuyScreen;
