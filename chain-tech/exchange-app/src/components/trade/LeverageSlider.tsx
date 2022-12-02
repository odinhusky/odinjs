import React, { useState } from "react";
import { Text, TouchableOpacity, View, Image, Alert } from "react-native"
// import { Slider } from '@miblanchard/react-native-slider';
import styled from "styled-components"
import { useTranslation } from "react-i18next";
import Slider from '@react-native-community/slider';
import { useAppSelector } from 'hooks';

const Container = styled(View)`
display: flex;
flex-direction: column;
`;

//Slider 
const LeverageText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.LightMidGray};
`;

const LeverageViewModalRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
padding: 12px 10px 12px 10px;
margin-bottom: 24px;
`;

const LeverageViewModalRemoveImage = styled(Image)`
width: 24px;
height: 24px;
`;

const LeverageViewModalAddImage = styled(Image)`
width: 24px;
height: 24px;
`;

const LeverageViewModalLeverageText = styled(Text)`
font-weight: 600;
font-size: 14px;
line-height: 18px;
color: ${props => props.theme.color.White};
`;

const LeverageViewModalNotificationImage = styled(Image)`
width: 24px;
height: 24px;
`;

const LeverageViewModalNotificationText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.SecondaryLight};
`;

const LeverageViewModalDetailRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const LeverageViewModalDetailText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.LightMidGray};
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
interface LeverageSliderProps {
    onFinish: Function
}
const LeverageSlider = (props: LeverageSliderProps) => {
    const { onFinish } = props
    const [trackMarks, _] = useState([1, 25, 50, 75, 100, 125])
    const { leverage } = useAppSelector((state)=>state.trading.information)
    const [value, setValue] = React.useState(leverage);
    // let renderTrackMarkComponent: React.ReactNode;
    
    // if (trackMarks?.length && (!Array.isArray(value) || value?.length === 1)) {
    //     renderTrackMarkComponent = (index: number) => {
    //         const currentMarkValue = trackMarks[index];
    //         const currentSliderValue =
    //             value || (Array.isArray(value) && value[0]) || 0;
    //         const style =
    //             currentMarkValue > Math.max(currentSliderValue)
    //                 ? { width: 8, height: 12, backgroundColor: '#333C47' }
    //                 : { width: 8, height: 12, backgroundColor: '#DEDDE3' }
    //         return (
    //             <View style={style} />
    //         );
    //     };
    // }

    let num = parseInt(value.toString());

    const { t } = useTranslation();
    
    return (
        <Container>
            <LeverageViewModalRowContainer style={{ backgroundColor: '#333C47', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => { value > 1 ? setValue(num - 1) : setValue(1)}}>
                    <LeverageViewModalRemoveImage source={require(`assets/images/trade/remove.png`)} />
                </TouchableOpacity>
                <LeverageViewModalLeverageText>{value}X</LeverageViewModalLeverageText>
                <TouchableOpacity onPress={() => { value < 125 ? setValue(num + 1) : setValue(125)}}>
                    <LeverageViewModalAddImage source={require("assets/images/trade/add.png")} />
                </TouchableOpacity>
            </LeverageViewModalRowContainer>
            <Slider
                minimumValue={1}
                maximumValue={125}
                step={1}
                minimumTrackTintColor="#F4F5F6"
                maximumTrackTintColor="#333C47"
                thumbImage={require("assets/images/trade/indicator2.png")}
                onValueChange={(x)=>{
                    setValue(x)
                    // setFlag(true)
                    // setNewInputNum(positionString) 
                }}
                value={value}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {
                    trackMarks.map((markNumber)=>{
                        return <LeverageText key={markNumber}>{`${markNumber}X`}</LeverageText>
                    })
                }
            </View>
            <LeverageViewModalDetailRowContainer style={{ paddingTop: 26 }}>
                <LeverageViewModalNotificationImage source={require("assets/images/trade/notification.png")} />
                <LeverageViewModalNotificationText style={{ paddingLeft: 8 }}>{t("leverageMsg")}</LeverageViewModalNotificationText>
            </LeverageViewModalDetailRowContainer>
            <ModalConfirmButton onPress={() => {  
                onFinish(value)
            }}>
                <ModalConfirmButtonText>確認</ModalConfirmButtonText> 
                {/* // translate */}
            </ModalConfirmButton>
        </Container>
    );
};

export default LeverageSlider