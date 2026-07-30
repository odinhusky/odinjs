import Decimal from "decimal.js"

export function useDecimal() {
  /**
   * 精確加法
   * @params num1: 欲相加的數字
   * @params num2: 欲相加的數字
   */
  function preciseAdd(num1: number, num2: number): number {
    return new Decimal(num1).plus(num2).toNumber()
  }

  /**
   * 精確減法
   * @params num1: 欲被減的數字
   * @params num2: 欲減去的數字
   */
  function preciseSubtract(num1: number, num2: number): number {
    return new Decimal(num1).sub(num2).toNumber()
  }

  /**
   * 精確乘法
   * @params num1: 欲相乘的數字
   * @params num2: 欲相乘的數字
   */
  function preciseMultiply(num1: number, num2: number): number {
    return new Decimal(num1).mul(num2).toNumber()
  }

  /**
   * 精確除法
   * @params num1: 欲被除的數字
   * @params num2: 欲除的數字
   */
  function preciseDivide(num1: number, num2: number): number {
    return new Decimal(num1).div(num2).toNumber()
  }

  return {
    preciseAdd,
    preciseSubtract,
    preciseMultiply,
    preciseDivide
  }
}
