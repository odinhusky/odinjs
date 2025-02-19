/**
 *  生成唯一數值，最小長度不可低於13
 * @param generateLength
 */
export const generateUniqueNumber = (generateLength: number = 13): string => {
  const minLength = generateLength < 13 ? 13 : generateLength;
  const timestamp = getFormattedCurrentDateTime().replace(/0/g, '1');
  let randomPart = '';
  while (randomPart.length < minLength) {
    const digit = Math.floor(Math.random() * 9) + 1; // Zufällige Ziffer zwischen 1 und 9
    randomPart += digit.toString();
  }
  const result = replaceToDigits(minLength, randomPart, timestamp);
  return result;
};

const getFormattedCurrentDateTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Monate sind 0-basiert, daher +1 und dann mit slice(-2) umformatieren
  const day = ('0' + currentDate.getDate()).slice(-2);
  const hours = ('0' + currentDate.getHours()).slice(-2);
  const minutes = ('0' + currentDate.getMinutes()).slice(-2);
  const seconds = ('0' + currentDate.getSeconds()).slice(-2);
  const milliseconds = ('00' + currentDate.getMilliseconds()).slice(-3);
  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
};

const replaceToDigits = (length: number, randomPart: string, str: string) => {
  let result = 1;
  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i], 10); // Convert character to number
    if (!isNaN(digit)) {
      // Check if it's a valid number
      result *= digit; // Multiply the digits together
    }
  }
  const resultStr = result.toString();
  const defective = length - resultStr.length;
  const randomStartIndex = Math.floor(
    Math.random() * (randomPart.length - defective + 1)
  );
  const prefixNumbers = randomPart.substr(randomStartIndex, defective);
  return prefixNumbers + resultStr;
};

export default generateUniqueNumber;
