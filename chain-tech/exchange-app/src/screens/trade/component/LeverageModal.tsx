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
import LeverageSlider from "components/trade/LeverageSlider";
import { useTranslation } from "react-i18next";
const LeverageViewModalSliderContainer = styled(View)``;

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

const ModalSelectedImage = styled(Image)`
  width: 28px;
  height: 28px;
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

interface LeverageModalProps {
    visible: boolean
    onCancel: Function
    onFinish: Function

}
const LeverageModal = (props: LeverageModalProps) => {
    const { visible, onCancel, onFinish } = props
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
                    paddingBottom: 30
                }}
            >
                <ModalHeaderContainer>
                    <TouchableOpacity
                        onPress={() => {
                            onCancel();
                        }}
                    >
                        <ModalLeftCancelButton
                            source={require("assets/images/trade/cancel.png")}
                        />
                    </TouchableOpacity>
                    <ModalHedaerTitleText>{t("leverage")}</ModalHedaerTitleText>
                    <ModalEmptyDiv></ModalEmptyDiv>
                </ModalHeaderContainer>

                <LeverageViewModalSliderContainer>
                    <LeverageSlider onFinish={onFinish} />
                </LeverageViewModalSliderContainer>
            </View>
        </Modal>
    )
}

export default LeverageModal