import { LUCKY_WHEEL_DENOMINATOR } from "../pages/ActivityPage/LuckyWheel/LuckyWheelConst";

export const formatLocaleMoney = (money: number, digit = 2) => money.toLocaleString('pt-BR', {
    minimumFractionDigits: digit,
    maximumFractionDigits: digit
})

export const formatIntLocaleMoney = (money: number) => formatLocaleMoney(money, 0);
export const formatDenominatorValue = (v: number) => formatLocaleMoney((v / LUCKY_WHEEL_DENOMINATOR));

export const formatLocaleMoneyWithAbbr = (money: number): string => {
  const abbr = [
    {unit: 'B', amount: 1000000000},
    {unit: 'M', amount: 1000000},
    {unit: 'K', amount: 1000},
  ];

  const absMoney = Math.abs(money);
  const unitObj = abbr.find(item => absMoney >= item.amount);
  const unit = unitObj?.unit ? unitObj?.unit : '';
  const moneyTarget = unitObj?.amount ? (money / unitObj?.amount) : money;
  const moneyString = moneyTarget.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return `${moneyString}${unit}`;
};

export const clampNumber = (value: number, min: number, max: number) => value > max ? max : value < min ? min : value;


export const toSnakeCase = (input: string) => {
    let snakeCase = '';
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char === char.toUpperCase()) {
            if (i !== 0) {
                snakeCase += '_';
            }
            snakeCase += char.toLowerCase();
        } else {
            snakeCase += char;
        }
    }
    console.log("===>toSnakeCase: ", input, snakeCase);
    return snakeCase;
}
