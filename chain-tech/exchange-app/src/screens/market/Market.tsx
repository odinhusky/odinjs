import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    Pressable,
} from "react-native";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import * as React from "react";
import { useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import SymbolList from "./component/SymbolList"
import RenderCounter from "components/render-counter"
import _ from "lodash"

const Container = styled(View)`
  display: flex;
  flex-direction: column;
  background: #18222d;
  flex: 1;
`;

const HeaderTitleTextClicked = styled(Text)`
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  color: ${props => props.theme.color.White};
`;

const HeaderTitleText = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.color.Gray};
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

const MarketScreen = ({ navigation }: RootStackScreenProps<"MarketScreen">) => {
    const [condition, setCondition] = useState("");
    const [index, setIndex] = useState(0);
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const TextEl = useRef<TextInput | null>(null);

    return (
        <Container>
            <RenderCounter name="Market" debug={false} />
            <Header insets={insets.top}>
            </Header>
            <View style={{ paddingHorizontal: 16 }}>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                        justifyContent: "space-between"
                    }}
                >
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }} >
                        <TouchableOpacity
                            onPress={() => {
                                setIndex(0);
                            }}
                            style={{ marginRight: 10 }}
                        >
                            {index === 0 ? (
                                <HeaderTitleTextClicked>{t("favoritesList")}</HeaderTitleTextClicked>
                            ) : (
                                <HeaderTitleText>{t("favoritesList")}</HeaderTitleText>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setIndex(1);
                            }}
                        >
                            {index === 1 ? (
                                <HeaderTitleTextClicked>{t("futuresList")}</HeaderTitleTextClicked>
                            ) : (
                                <HeaderTitleText>{t("futuresList")}</HeaderTitleText>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <TextInput
                        ref={TextEl}
                        placeholder={t("search")}
                        value={condition}
                        onChangeText={search => setCondition(search.toUpperCase())}
                        placeholderTextColor={"#8D97A2"}
                        autoCorrect={false}
                        style={{
                            backgroundColor: "#242D37",
                            width: "90%",
                            height: 36,
                            color: "#F4F5F6",
                            borderTopLeftRadius: 4,
                            borderBottomLeftRadius: 4,
                            paddingLeft: 12,
                            marginBottom: 20
                        }}
                    />
                    <Pressable
                        style={{
                            backgroundColor: "#242D37",
                            height: 36,
                            width: "10%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={() => {
                            TextEl.current!.blur();
                            TextEl.current!.clear();
                            setCondition("");
                        }}
                    >
                        {condition.length != 0 && (
                            <Image
                                source={require("assets/images/trade/cancel.png")}
                                style={{ width: 25, height: 25 }}
                            />
                        )}
                    </Pressable>
                </View>
                <SymbolList all={index === 1} condition={condition} />
            </View>
        </Container>
    );
};

export default MarketScreen;
