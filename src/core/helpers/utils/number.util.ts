export const round = (value: number, roundValue = 2): number =>
  Number(value.toFixed(roundValue));

export const toPercentage = (value: number, percentage: number): number =>
  round(value * (percentage / 100));

