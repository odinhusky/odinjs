import * as React from "react";
import {
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Image
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import { useState, useEffect } from "react";
import { useAppSelector } from "hooks";
import { useTranslation } from "react-i18next";
import { investorService } from "services";
import { FinanceType } from "common/constant";

const Container = styled(ScrollView)`
  display: flex;
  flex-direction: column;
  background-color: #18222d;
  border: none;
  flex:1;
`;

const Header = styled(View) <{ insets: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${props => props.insets}px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 11px;
`;

const HeaderText = styled(Text)`
  font-size: 16px;
  color: white;
  margin-right: 30px;
`;

const IconImg = styled(Image)`
  width: 28px;
  height: 28px;
`;

// Assets Record Style
const AssetsRecordTitleContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const AssetsRecordDetailContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: 5px;
`;

const AssetsRecordTitleText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const AssetsRecordTimeText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.MidGray};
`;

const AssetsRecordAmountText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const AssetsRecordTypeLeverageTextSecondary = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.Secondary};
`;

const AssetsRecordTypeLeverageTextSecondaryLight = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.SecondaryLight};
`;

const AssetsRecordEarnRatePositiveText = styled(Text)`
font-weight: 600;
font-size: 13px;
line-height: 16px;
color: ${props => props.theme.color.Secondary};
`;

const AssetsRecordEarnRateNegativeText = styled(Text)`
font-weight: 600;
font-size: 13px;
line-height: 16px;
color: ${props => props.theme.color.SecondaryLight};
`;

const CardContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 20px;
padding-left: 16px;
padding-right: 16px;
`;

const CardLine = styled(View)`
height: 2px;
background-color: #242D37;
margin-top: 20px;
`;

const HistoryScreen = ({ navigation }: RootStackScreenProps<"History">) => {
    const { token } = useAppSelector((state) => state.user)
    const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([]);
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const getFinanceRecord = () => {
        investorService.getOwnFinanceRecord({
            type: FinanceType.SPOT
        }).then((response) => {
            setFinanceRecords(response.data);
        })
    };

    useEffect(() => {
        if (token) {
            getFinanceRecord();
        }
    }, []);

    return (
        <Container>
            <Header insets={insets.top}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <IconImg
                        source={require("assets/images/global/previous.png")}
                    />
                </TouchableOpacity>
                <HeaderText>{t("fundTransactionHistory")}</HeaderText>
                <View></View>
            </Header>
            {
                financeRecords.map((record, index) => {
                    return (
                        <CardContainer key={record.id}>
                            <AssetsRecordTitleContainer>
                                <AssetsRecordTitleText>
                                    {record.remark === "手續費" && t("orderFee")}
                                    {record.remark === "反佣增加餘額" && t("commisionAdd")}
                                    {record.remark === "建立倉位佔用合約帳戶保證金" && t("positionBuildMargin")}
                                    {record.remark === "加倉佔用合約帳戶保證金" && t("positionAddMargin")}
                                    {record.remark === "倉位實現損益" && t("positionPNL")}
                                    {record.remark === "強平結算" && t("positionLiqudation")}
                                    {record.remark === "內部劃轉" && t("internalTransfer")}
                                    {record.remark === "調整槓桿變更倉位佔用保證金" && t("leverageMargin")}
                                    {record.remark === "保證金為負值" && t("marginNegtive")}
                                    {record.remark === "餘額為負值" && t("balanceNegtive")}
                                    {record.remark === "投資人充值" && t("spotDeposit")}
                                    {record.remark === "委託單成交扣除餘額" && t("orderFee")}
                                    {record.remark === "投資人提現" && t("spotWithdraw")}
                                    {record.remark === "減倉釋放合約帳戶保證金" && t("positionReleaseMargin")}
                                </AssetsRecordTitleText>
                                <AssetsRecordAmountText>{`${record.payment} ${record.coin}`}</AssetsRecordAmountText>
                            </AssetsRecordTitleContainer>
                            <AssetsRecordDetailContainer>
                                <AssetsRecordTimeText>{new Date(record.createdDate).getFullYear()}-{new Date(record.createdDate).getMonth() + 1 < 10 ? "0" + (new Date(record.createdDate).getMonth() + 1) : new Date(record.createdDate).getMonth() + 1}-{new Date(record.createdDate).getDate() < 10 ? "0" + (new Date(record.createdDate).getDate()) : new Date(record.createdDate).getDate()} {new Date(record.createdDate).getHours() < 10 ? "0" + (new Date(record.createdDate).getHours()) : new Date(record.createdDate).getHours()}:{new Date(record.createdDate).getMinutes() < 10 ? "0" + (new Date(record.createdDate).getMinutes()) : new Date(record.createdDate).getMinutes()}</AssetsRecordTimeText>
                            </AssetsRecordDetailContainer>
                            <CardLine></CardLine>
                        </CardContainer>
                    )
                })
            }
        </Container>
    );
};

export default HistoryScreen;
