import * as React from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { RootStackScreenProps } from "common/types";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import C2cSellFirst from "components/c2c/sell/C2cSellFirst";
import C2cSellSecond from "components/c2c/sell/C2cSellSecond";
import C2cSellLast from "components/c2c/sell/C2cSellLast";
import CountdownTimer from "components/c2c/CountdownTimer";
import { useAppSelector } from "hooks";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useTranslation } from "react-i18next";
import { otcOrderService, userService } from "services";

const Container = styled(View) <{ insets: number }>`
  display: flex;
  flex-direction: column;
  padding-top: ${props => props.insets}px;
  background-color: #18222d;
  justify-content: space-between;
  padding-bottom: 200px;
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

const TopContainerTimerText = styled(Text)`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: #fabd43;
`;

const TopContainerTimerMiddleText = styled(Text)`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.color.LightMidGray};
`;

const TopContainerDetailText = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.theme.color.LightMidGray};
  margin-top: 4px;
`;

const C2cSellScreen = ({
    navigation,
    route
}: RootStackScreenProps<"C2cSellScreen">) => {
    const { from } = route.params
    const { detail: user, token } = useAppSelector((state) => state.user)
    const { advertisement } = useAppSelector((state) => state.c2c)
    const otcOrder = useAppSelector((state) => state.otcOrder.selling)
    const insets = useSafeAreaInsets();


    // 購買流程
    const [swapPage, setSwapPage] = useState(1);

    // 選擇付款方式
    const [choosePayType, setChoosePaytype] = useState("Account");

    // Countdown Timer (Import CountdownTimer)
    const FIVEMINUTES = 15 * 60 * 1000;

    // USER INFO
    const { t } = useTranslation();
    // Payment
    const [paymentList, setPaymentList] = useState<Payment[]>([]);

    // 付款確認 等待放行
    const [isWaitFinish, setIsWaitFinish] = useState(0);
    // Countdown Timer (Import CountdownTimer) ms
    const [payTimeLimit, setPayTimeLimit] = useState(Number);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);

    // 獲取訂單付款資訊
    const getOrderPayments = async () => {
        setLoading(true);
        userService.getPayments().then((response) => {
            setPaymentList(response.data);
        }).finally(() => {
            setLoading(false);
        })
    };

    useEffect(() => {
        const getToken = async () => {

            if (token) {
                getOrderPayments();
            }
        }
        getToken()
    }, []);

    useEffect(() => {
        if (from === "order") {
            setSwapPage(2)
        }
    }, [from])

    useEffect(() => {
        const interval = setInterval(() => {
            otcOrder.id && otcOrderService.get(otcOrder.id).then((order) => {
                setStatus(order.status);
            })
        }, 2000);
        return () => clearInterval(interval);
    }, [otcOrder.id]);

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
                    <HeaderTitleText>{t("fiatSell")} {advertisement.cryptoAsset}</HeaderTitleText>
                    <HeaderEmptyContainer></HeaderEmptyContainer>
                </HeaderContainer>
                {swapPage === 1 && (
                    <C2cSellFirst
                        payments={paymentList}
                        onChangeSetSwapPage={setSwapPage}
                        onValueChangeIsWaitFinish={setIsWaitFinish}
                    />
                )}
                {swapPage === 2 &&
                    isWaitFinish === 0 && (
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
                                <TopContainerTitleText>{t("waitBuyerPay")}</TopContainerTitleText>
                                <TopContainerTimerContainer>
                                    <CountdownTimer targetDate={payTimeLimit} />
                                </TopContainerTimerContainer>
                            </TopInColumnContainer>
                        </TopContainer>
                    )}
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
                                <TopContainerTitleText>
                                    {status === 3 && "等待買方確認交易"}
                                    {status === 0 && "等待買家付款"}
                                    {status === 1 && "買方已付款，請放行"}
                                    {status === 4 && "請確認交易"}
                                </TopContainerTitleText>
                                <TopContainerTimerContainer>

                                    <CountdownTimer targetDate={payTimeLimit} />
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
                                    {t("finishMsg")}
                                </TopContainerDetailText>
                            </TopInColumnContainer>
                        </TopContainer>
                    )}
                {swapPage === 2 && (
                    <C2cSellSecond
                        onChangeSetSwapPage={setSwapPage}
                        onChangeISWaitFinish={setIsWaitFinish}
                    />
                )}
                {swapPage === 3 && (
                    <C2cSellLast />
                )}
            </Container>
        </TouchableWithoutFeedback>
    );
};
export default C2cSellScreen;
