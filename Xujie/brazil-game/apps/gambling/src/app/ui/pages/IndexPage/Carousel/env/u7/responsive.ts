import {tailwindVariables} from "../../../../../../../environments/tailwind.variables";

const mobilePoint = parseInt(tailwindVariables.theme.screens.mobile.replace("px", ""));
const tabletPoint = parseInt(tailwindVariables.theme.screens.tablet.replace("px", ""));

export const responsive = {
    desktop: {
        breakpoint: {min: tabletPoint, max: 9999999999},
        items: 3,
        partialVisible: true,
        partialVisibilityGutter: -30
    },
    tablet: {
        breakpoint: {min: mobilePoint, max: tabletPoint},
        items: 1,
        partialVisible: true,
        partialVisibilityGutter: 0
    },
    mobile: {
        breakpoint: {min: 0, max: mobilePoint},
        items: 1,
        partialVisible: false,
        partialVisibilityGutter: 0
    }
};