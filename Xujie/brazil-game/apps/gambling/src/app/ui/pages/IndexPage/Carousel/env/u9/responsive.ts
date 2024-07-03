import { tailwindVariables } from '../../../../../../../environments/tailwind.variables';

const mobilePoint = parseInt(
  tailwindVariables.theme.screens.mobile.replace('px', '')
);
const tabletPoint = parseInt(
  tailwindVariables.theme.screens.tablet.replace('px', '')
);

export const responsive = {
  desktop: {
    breakpoint: { min: tabletPoint, max: 9999999999 },
    items: 2,
    partialVisible: true,
    partialVisibilityGutter: -1,
  },
  tablet: {
    breakpoint: { min: mobilePoint, max: tabletPoint },
    items: 2,
    partialVisible: true,
    partialVisibilityGutter: 16,
  },
  mobile: {
    breakpoint: { min: 0, max: mobilePoint },
    items: 1,
    partialVisible: false,
    partialVisibilityGutter: 0,
  },
};
