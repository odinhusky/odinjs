import * as React from "react";
import {
    Text,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import { WebView } from "react-native-webview";
import { useTranslation } from "react-i18next";

const Container = styled(View)`
  display: flex;
  flex-direction: column;
  background-color: #131b24;
  border: none;
  flex: 1;
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
  background-color: #18222d;
`;

const HeaderText = styled(Text)`
  font-size: 16px;
  color: white;
  font-weight: 600;
  margin-right: 30;
`;

const IconImg = styled(Image)`
  width: 28px;
  height: 28px;
`;

const Web = ({ navigation, route }: RootStackScreenProps<"Web">) => {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

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
                <HeaderText>{t("googleAuth")}</HeaderText>
                <View></View>
            </Header>
            <WebView source={{ uri: route.params.url }} />
        </Container>
    );
};

export default Web;
