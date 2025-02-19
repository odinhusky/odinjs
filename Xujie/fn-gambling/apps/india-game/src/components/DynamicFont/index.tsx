export const DynamicFont = () => {
  const { VITE_GLOBAL_FONT_FAMILY } = import.meta.env;

  return VITE_GLOBAL_FONT_FAMILY ? (
    <link rel="stylesheet" href={`${VITE_GLOBAL_FONT_FAMILY}`} />
  ) : null;
};
