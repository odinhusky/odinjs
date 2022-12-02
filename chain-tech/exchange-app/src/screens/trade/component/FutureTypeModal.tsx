import React, { useState } from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from 'hooks';
import { tradingActions } from 'store/slice';
import { ContractType } from 'common/types';
const BuyTypeTitleContainer = styled(View)`
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const BuyTypeModalTitleText = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.color.White};
`;

const BuyTypeModalPickerButton = styled(TouchableOpacity)`
  height: 55px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const BuyTypeModalPickerButtonText = styled(Text)`
  font-weight: 300;
  font-size: 20px;
  color: ${props => props.theme.color.ExtraLightGray};
`;

const BuyTypeModalLineText = styled(Text)`
  background-color: #242d37;
  height: 2px;
`;


const ModalSelectedImage = styled(Image)`
  width: 28px;
  height: 28px;
`;

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

interface FutureTypeModalProps {
    visible: boolean
    onCancel: Function
}

const FutureTypeModal = (props: FutureTypeModalProps) => {
    const { visible, onCancel } = props
    const request = useAppSelector((state) => state.trading.request)
    const dispatch = useAppDispatch()
    const { t } = useTranslation();

    const selectType = (type: ContractType) => {
        dispatch(tradingActions.setRequestType(type))
        onCancel()
    }

    return (
        <Modal
            isVisible={visible}
            deviceHeight={windowHeight}
            deviceWidth={windowWidth}
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
                <BuyTypeTitleContainer>
                    <BuyTypeModalTitleText>{t("orderType")}</BuyTypeModalTitleText>
                </BuyTypeTitleContainer>
                <BuyTypeModalPickerButton
                    onPress={() => {
                        selectType("LIMIT");
                    }}
                >
                    <BuyTypeModalPickerButtonText>
                        {t("limitedOrder")}
                    </BuyTypeModalPickerButtonText>
                    {request.type === "LIMIT" && (
                        <ModalSelectedImage
                            source={require("assets/images/trade/selected.png")}
                        />
                    )}
                </BuyTypeModalPickerButton>
                <BuyTypeModalLineText></BuyTypeModalLineText>
                <BuyTypeModalPickerButton
                    onPress={() => {
                        selectType("MARKET");
                    }}
                >
                    <BuyTypeModalPickerButtonText>
                        {t("marketOrder")}
                    </BuyTypeModalPickerButtonText>
                    {request.type === "MARKET" && (
                        <ModalSelectedImage
                            source={require("assets/images/trade/selected.png")}
                        />
                    )}
                </BuyTypeModalPickerButton>
                <BuyTypeModalLineText></BuyTypeModalLineText>
                <BuyTypeModalPickerButton
                    onPress={() => {
                        selectType("STOP_LIMIT");
                    }}
                >
                    <BuyTypeModalPickerButtonText>
                        {t("stopLimitOrder")}
                    </BuyTypeModalPickerButtonText>
                    {request.type === "STOP_LIMIT" && (
                        <ModalSelectedImage
                            source={require("assets/images/trade/selected.png")}
                        />
                    )}
                </BuyTypeModalPickerButton>
                <BuyTypeModalLineText></BuyTypeModalLineText>
                <BuyTypeModalPickerButton
                    onPress={() => {
                        selectType("STOP_MARKET");
                    }}
                >
                    <BuyTypeModalPickerButtonText>
                        {t("stopMarketOrder")}
                    </BuyTypeModalPickerButtonText>
                    {request.type === "STOP_MARKET" && (
                        <ModalSelectedImage
                            source={require("assets/images/trade/selected.png")}
                        />
                    )}
                </BuyTypeModalPickerButton>
            </View>
        </Modal>
    )
}

export default FutureTypeModal