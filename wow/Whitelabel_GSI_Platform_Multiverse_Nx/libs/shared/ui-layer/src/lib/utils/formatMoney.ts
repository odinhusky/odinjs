export const formatMoney = (value: string | number | undefined) => {
  const num = Number(value ?? 0)
  if (Number.isNaN(num)) return "0.00"
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
