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

const PositionViewModalButton = styled(TouchableOpacity)`
  height: 44px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.color.DarkGray};
  margin-top: 24px;
  padding-left: 16px;
  padding-right: 16px;
`;

const PositionViewModalButtonText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${props => props.theme.color.White};
`;

const PositionViewModalDetailText = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.theme.color.LightMidGray};
  margin-top: 8px;
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

const ModalConfirmButton = styled(TouchableOpacity)`
  height: 44px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.color.PrimaryDark};
  margin-top: 32px;
`;

const ModalConfirmButtonText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${props => props.theme.color.White};
`;

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

interface PositionTypeModalProps {
    visible: boolean
    positionType: string
    onCancel: Function
}

const PositionTypeModal = (props: PositionTypeModalProps) => {
    const { visible, positionType, onCancel } = props
    const [positionView, setPositionView] = useState(positionType);
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
                    <ModalHedaerTitleText>{t("marginMode")}</ModalHedaerTitleText>
                    <ModalEmptyDiv></ModalEmptyDiv>
                </ModalHeaderContainer>
                <PositionViewModalButton
                    onPress={() => {
                        setPositionView("Full"), onCancel();
                    }}
                >
                    <PositionViewModalButtonText>
                        {t("crossPosition")}
                    </PositionViewModalButtonText>
                    {positionView === "Full" && (
                        <ModalSelectedImage
                            source={require("assets/images/trade/selected.png")}
                        />
                    )}
                </PositionViewModalButton>
                <PositionViewModalDetailText>
                    {t("crossMsg")}。
                </PositionViewModalDetailText>
                <PositionViewModalButton
                    onPress={() => {
                        setPositionView("Each"), onCancel();
                    }}
                >
                    <PositionViewModalButtonText>
                        {t("isolatedPosition")}
                    </PositionViewModalButtonText>
                    {positionView === "Each" && (
                        <ModalSelectedImage
                            source={require("assets/images/trade/selected.png")}
                        />
                    )}
                </PositionViewModalButton>
                <PositionViewModalDetailText>
                    {t("isolatedMsg")}。
                </PositionViewModalDetailText>
                <ModalConfirmButton>
                    <ModalConfirmButtonText>{t("OK")}</ModalConfirmButtonText>
                </ModalConfirmButton>
            </View>
        </Modal>
    )
}

export default PositionTypeModal