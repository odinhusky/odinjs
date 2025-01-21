export const DynamicTheme = () => {
  const { VITE_FN_SETTING, VITE_COUNTRY_CODE, VITE_V_VERSION } = import.meta
    .env;
  const themeUrl = import.meta.env.DEV
    ? `/src/setting/dev/${VITE_V_VERSION}/theme.css`
    : `${VITE_FN_SETTING}/${VITE_COUNTRY_CODE.toLowerCase()}/${VITE_V_VERSION}/theme.css`;
  return <link rel="stylesheet" href={`${themeUrl}`} />;
};
