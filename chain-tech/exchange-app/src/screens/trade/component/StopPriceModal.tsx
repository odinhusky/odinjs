import React, { useState } from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    Alert,
    StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

// Commit Stop Button Modal 當前委託止盈/止損價
const CommitStopModalCardContainer = styled(View)`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const CommitStopModalCardTitleRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CommitStopModalCardTitleColumnContainer = styled(View)`
  display: flex;
  flex-direction: column;
`;

const CommitStopModalCardDetailContainer = styled(View)`
  display: flex;
  flex-direction: row;
  margin-top: 13px;
`;

const CommitStopModalCardDetailColumnContainer = styled(View)`
  display: flex;
  flex-direction: column;
  width: 38%;
`;

const CommitStopModalCardTitleStopEarnText = styled(Text)`
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  color: ${props => props.theme.color.SecondaryLight};
`;

const CommitStopModalCardTitleStopLostText = styled(Text)`
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  color: ${props => props.theme.color.Secondary};
`;

const CommitStopModalCardTitleTimeText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${props => props.theme.color.ExtraLightGray};
  padding-top: 1px;
`;

const CommitStopModalCardTitleProgressText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.MidGray};
`;

const CommitStopModalCardDetailTitleText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.MidGray};
`;

const CommitStopModalCardDetailValueText = styled(Text)`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: ${props => props.theme.color.ExtraLightGray};
  padding-top: 2px;
`;

const CommitStopModalLine = styled(View)`
  height: 1px;
  background-color: ${props => props.theme.color.DarkGray};
  margin-top: 24px;
`;

const ModalHeaderContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 26px;
`;

const ModalHedaerTitleText = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.color.White};
`;


const ModalLeftCancelButton = styled(Image)`
  width: 28px;
  height: 28px;
`;

const ModalEmptyDiv = styled(View)`
  width: 28px;
  height: 28px;
`;

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const CommitStopPositionArray = [
    {
        type: "StopEarn",
        progress: 0,
        time: "2021-10-16 20:55:10",
        condition: ">=20,000.0",
        volumnNum: "0.075",
        volumnPrice: "17,980.0"
    },
    {
        type: "StopLost",
        progress: 0,
        time: "2021-10-16 20:55:10",
        condition: "<=16,000.0",
        volumnNum: "0.075",
        volumnPrice: "16,780.0"
    }
];

interface StopPriceModalProps {
    visible: boolean
    positionType: string
    onCancel: Function
}

const StopPriceModal = (props: StopPriceModalProps) => {
    const { visible, onCancel } = props
    const { t } = useTranslation();

    return (

        <Modal
            isVisible={visible}
            deviceHeight={windowHeight}
            deviceWidth={windowWidth}
            animationInTiming={500}
            animationOutTiming={700}
            backdropOpacity={0.7}
            onBackdropPress={() => onCancel()}
            onSwipeComplete={() => onCancel()}
            swipeDirection={["down"]}
            style={{ justifyContent: "flex-end", margin: 0 }}
            hideModalContentWhileAnimating={true}
        >
            <View
                style={{
                    backgroundColor: "#242D37",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingBottom: 50
                }}
            >
                <ModalHeaderContainer style={{ paddingBottom: 0 }}>
                    <TouchableOpacity
                        onPress={() => {
                            onCancel();
                        }}
                    >
                        <ModalLeftCancelButton
                            source={require("assets/images/trade/cancel.png")}
                        />
                    </TouchableOpacity>
                    <ModalHedaerTitleText>{t("stopProfitLoss")}</ModalHedaerTitleText>
                    <ModalEmptyDiv></ModalEmptyDiv>
                </ModalHeaderContainer>
                {CommitStopPositionArray.map((x, i) => {
                    return (
                        <CommitStopModalCardContainer>
                            <CommitStopModalCardTitleColumnContainer>
                                <CommitStopModalCardTitleRowContainer>
                                    {x.type === "StopEarn" ? (
                                        <CommitStopModalCardTitleStopEarnText>
                                            止盈平多
                                        </CommitStopModalCardTitleStopEarnText>
                                    ) : (
                                        <CommitStopModalCardTitleStopLostText>
                                            止損平多
                                        </CommitStopModalCardTitleStopLostText>
                                    )}
                                    {x.progress === 0 ? (
                                        <CommitStopModalCardTitleProgressText>
                                            未生效
                                        </CommitStopModalCardTitleProgressText>
                                    ) : (
                                        <CommitStopModalCardTitleProgressText>
                                            已生效
                                        </CommitStopModalCardTitleProgressText>
                                    )}
                                </CommitStopModalCardTitleRowContainer>
                                <CommitStopModalCardTitleTimeText>
                                    {x.time}
                                </CommitStopModalCardTitleTimeText>
                            </CommitStopModalCardTitleColumnContainer>
                            <CommitStopModalCardDetailContainer>
                                <CommitStopModalCardDetailColumnContainer>
                                    <CommitStopModalCardDetailTitleText>
                                        觸發條件
                                    </CommitStopModalCardDetailTitleText>
                                    <CommitStopModalCardDetailValueText>
                                        {x.condition}
                                    </CommitStopModalCardDetailValueText>
                                </CommitStopModalCardDetailColumnContainer>
                                <CommitStopModalCardDetailColumnContainer>
                                    <CommitStopModalCardDetailTitleText>
                                        {t("orderSize")}
                                    </CommitStopModalCardDetailTitleText>
                                    <CommitStopModalCardDetailValueText>
                                        {x.volumnNum}
                                    </CommitStopModalCardDetailValueText>
                                </CommitStopModalCardDetailColumnContainer>
                                <CommitStopModalCardDetailColumnContainer>
                                    <CommitStopModalCardDetailTitleText>
                                        {t("orderPrice")}
                                    </CommitStopModalCardDetailTitleText>
                                    <CommitStopModalCardDetailValueText>
                                        {x.volumnPrice}
                                    </CommitStopModalCardDetailValueText>
                                </CommitStopModalCardDetailColumnContainer>
                            </CommitStopModalCardDetailContainer>
                            {i !== CommitStopPositionArray.length - 1 && (
                                <CommitStopModalLine></CommitStopModalLine>
                            )}
                        </CommitStopModalCardContainer>
                    );
                })}
            </View>
        </Modal>
    )
}

export default StopPriceModal