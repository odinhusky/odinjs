export const maskMiddle4 = (input: string | number): string => {
  const str = input.toString();

  if (str.length !== 10) {
    console.log('!! Input must be exactly 10 characters long');

    return '';
  }

  return str.slice(0, 3) + '****' + str.slice(7);
};

export default maskMiddle4;
