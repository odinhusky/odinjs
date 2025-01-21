export const colors: string[] = [
  '#00FFD0',
  '#FF8A22',
  '#FFFC28',
  '#FF6B5C',
  '#FFA24F',
  '#AAFFA8',
];

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
