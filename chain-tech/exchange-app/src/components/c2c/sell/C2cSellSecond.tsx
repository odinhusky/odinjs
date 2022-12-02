import * as React from "react";
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert
} from "react-native";
import styled from "styled-components";
import { useEffect, useState } from "react";
// import api from "common/api";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { useAppSelector } from "hooks";
import { otcOrderService } from "services";
import { OtcOrderStatus } from "common/constant";
const Container = styled(ScrollView)`
  display: flex;
  flex-direction: column;
  background-color: #18222d;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 200px;
`;

// First Card Style
const FirstCardContainer = styled(View)`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-right: 16px;
  padding-left: 16px;
  padding-bottom: 20px;
  background-color: #242d37;
  border-radius: 8px;
`;

const FirstCardRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const FirstCardFirstRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;

const FirstCardFirstInRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

const FirstCardTitleText = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.theme.color.MidGray};
`;

const FirstCardPriceText = styled(Text)`
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;
  color: ${props => props.theme.color.SecondaryLight};
  padding-right: 4px;
`;

const FirstCardPriceCurrencyText = styled(Text)`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.color.SecondaryLight};
`;

const FirstCardValueText = styled(Text)`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: ${props => props.theme.color.ExtraLightGray};
`;


const BottomButtonContainer = styled(View)`
display: flex;
flex-direction: row
justify-content: space-between;
margin-top: 37px;
padding-bottom: 200px;
`;

const SubmitButton = styled(TouchableOpacity)`
  padding: 12px;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.color.PrimaryDark};
  border-radius: 4px;
`;

const SubmitButtonText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${props => props.theme.color.White};
`;

const C2cSellSecond = (props: {
    onChangeSetSwapPage: React.Dispatch<React.SetStateAction<number>>;
    onChangeISWaitFinish: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const {
        onChangeSetSwapPage,
        onChangeISWaitFinish,
    } = props;
    const otcOrder = useAppSelector((state) => state.otcOrder.selling)
    const advertisement = useAppSelector((state) => state.c2c.advertisement)
    const { t } = useTranslation();

    const navigation = useNavigation();

    // 送出訂單，下一步

    const [submitText, setSubmitText] = useState("付款中...");

    const SubmitAlert = () => {

        if (otcOrder.status === OtcOrderStatus.WAIT_FOR_SELLER) {
            otcOrderService.check(otcOrder.id)
        } else {
            Alert.alert(
                "確定放行？",
                "請核對收到的款項無誤，點擊確定後系統將放行您的資金給買方。",
                [
                    {
                        text: "取消",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: "確定",
                        onPress: () => {
                            handleConfirm();
                        }
                    }
                ]
            );
        }

    };

    // 驗證是否已放行 （暫時不驗證）
    const handleConfirm = () => {
        otcOrderService.confirm(otcOrder.id).then(() => {
            onChangeISWaitFinish(2)
            onChangeSetSwapPage(3)
        })
    };

    // Button Style
    const handleButtonDisabled = () => {
        if (submitText === "確認收款並放行" || submitText === "確認交易") {
            return false;
        } else {
            return true;
        }
    };

    const handleSubmitButtonStyle = () => {
        if (submitText === "確認收款並放行" || submitText === "確認交易") {
            return "#3D6A97";
        } else {
            return "rgba(102, 153, 204, 0.3)";
        }
    };

    const handleSubmitButtonTextStyle = () => {
        if (submitText === "確認收款並放行" || submitText === "確認交易") {
            return "#FFFFFF";
        } else {
            return "rgba(255, 255, 255, 0.3)";
        }
    };

    const getPaidStatus = () => {
        onChangeISWaitFinish(1);
        setSubmitText("確認收款並放行");
    };

    useEffect(() => {
        if (submitText === "付款中...") {
            getPaidStatus();
        }
    }, []);

    useEffect(() => {
        if (otcOrder.status === 3) {
            setSubmitText("等待買家確認交易");
        } else if (otcOrder.status === 4) {
            setSubmitText("確認交易");
        } else if (otcOrder.status === 0) {
            setSubmitText("等待買家付款");
        } else if (otcOrder.status === 1) {
            setSubmitText("確認收款並放行");
        }
        if (otcOrder.status === -1) {
            alert(t("fiatOrderCanceled"))
            navigation.goBack()
        }
    }, [otcOrder]);

    return (
        <Container>
            <FirstCardContainer>
                <FirstCardFirstRowContainer>
                    <FirstCardTitleText>{t("fiatTotal")}</FirstCardTitleText>
                    <FirstCardFirstInRowContainer>
                        <FirstCardPriceText>{otcOrder.amount}</FirstCardPriceText>
                        <FirstCardPriceCurrencyText>
                            {advertisement.fiatCurrency}
                        </FirstCardPriceCurrencyText>
                    </FirstCardFirstInRowContainer>
                </FirstCardFirstRowContainer>
                <FirstCardRowContainer>
                    <FirstCardTitleText>{t("amount")}</FirstCardTitleText>
                    <FirstCardValueText>
                        {otcOrder.quantity} {advertisement.cryptoAsset}
                    </FirstCardValueText>
                </FirstCardRowContainer>
                <FirstCardRowContainer>
                    <FirstCardTitleText>{t("unitPrice")}</FirstCardTitleText>
                    <FirstCardValueText>
                        {advertisement.price} {advertisement.fiatCurrency}
                    </FirstCardValueText>
                </FirstCardRowContainer>
                <FirstCardRowContainer>
                    <FirstCardTitleText>{t("fiatOrderNumber")}</FirstCardTitleText>
                    <View style={{ alignItems: "flex-end" }}>
                        <FirstCardValueText>{otcOrder.id.slice(0, 28)}</FirstCardValueText>
                        <FirstCardValueText>{otcOrder.id.slice(28)}</FirstCardValueText>
                    </View>
                </FirstCardRowContainer>
            </FirstCardContainer>
            <BottomButtonContainer>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "確定取消訂單？",
                            "惡意取消訂單若達到 3 次或更多，您帳戶的部分功能將暫時禁用。",
                            [
                                {
                                    text: "取消",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                {
                                    text: "確定", onPress: () => {
                                        otcOrderService.cancel(otcOrder.id).then(() => {
                                            Alert.alert(t("fiatOrderCanceled"));
                                            navigation.goBack()
                                        })
                                    }
                                }
                            ]
                        );

                    }}
                    style={{
                        borderWidth: 1,
                        borderColor: "#6699CC",
                        borderRadius: 4,
                        padding: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        width: "25%"
                    }}
                    disabled={(otcOrder.status === 1 || otcOrder.status === 0) ? true : false}
                >
                    <SubmitButtonText style={{ color: "#6699CC" }}>
                        取消訂單
                    </SubmitButtonText>
                </TouchableOpacity>
                {
                    otcOrder.status === 1 &&
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                t("sureAppeal"),
                                t("appealMsg"),
                                [
                                    {
                                        text: t("cancel"),
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    {
                                        text: t("OK"), onPress: () => otcOrderService.appeal(otcOrder.id)
                                    }
                                ]
                            );
                        }}
                        style={{
                            borderWidth: 1,
                            borderColor: "#FB4C51",
                            borderRadius: 4,
                            padding: 12,
                            justifyContent: "center",
                            alignItems: "center",
                            width: "25%"

                        }}
                    >
                        <SubmitButtonText style={{ color: "#FB4C51" }}>{t("appeal")}</SubmitButtonText>
                    </TouchableOpacity>
                }
                <SubmitButton
                    onPress={() => {
                        SubmitAlert();
                    }}
                    disabled={handleButtonDisabled()}
                    style={{ backgroundColor: handleSubmitButtonStyle() }}
                >
                    <SubmitButtonText style={{ color: handleSubmitButtonTextStyle() }}>
                        {submitText === "等待買家確認交易" ? t("fiatBuyerCheck2") : submitText}
                    </SubmitButtonText>
                </SubmitButton>
            </BottomButtonContainer>
        </Container>
    );
};

export default C2cSellSecond;
