import React from "react";

import {
    TouchableOpacity,
    Text,
    Image
} from "react-native";

// ^ Plugins
import { isEmpty, get, cloneDeep } from "lodash"
import { useTranslation } from "react-i18next";

// = styled Element Component
import styled from "styled-components";
import { theme } from "constants/Theme";
import { useNavigation } from '@react-navigation/native';

const LinkBtn = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  background-color: ${theme.DarkGray};
  border-radius: 4px;
  padding: 12px 8px;
  flex: 1
`;

const LinkBtnText = styled(Text)`
  font-size: 14px;
  color: ${theme.White};
  margin-left: 10px;
  font-weight: normal;
`;

const IconImg = styled(Image)`
  width: 30px;
  height: 30px;
`;

// ? Interface
interface LinkButtonWithIconProps {
    naviDetail: object,
    imgSrc: number | string,
    title: string,
    styleObj?: object
}

/**
 * @author odin
 * @level screens/home/LinkButtonWithIcon
 * @component LinkButtonWithIcon
 * @description Link Button With Icon
*/
const LinkButtonWithIcon = (props: LinkButtonWithIconProps) => {
    const navigation = useNavigation();
    // $ init data
    const { naviDetail, imgSrc, title, styleObj } = props;
    const { t } = useTranslation();

    return (
        <LinkBtn
            style={get(styleObj, 'btn', {})}
            onPress={() => {
                navigation.navigate(naviDetail.pathName, !isEmpty(naviDetail.props) ? cloneDeep(naviDetail.props) : {})
            }}
        >
            <IconImg
                style={get(styleObj, 'img', {})}
                source={imgSrc}
            />

            <LinkBtnText
                style={get(styleObj, 'title', {})}
            >
                {t(`${title}`)}
            </LinkBtnText>
        </LinkBtn>
    );
}

export default LinkButtonWithIcon;