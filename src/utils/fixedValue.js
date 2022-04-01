export const toFixed = (value, num = 5) => {
  if (typeof value !== 'number' && typeof value !== 'string') throw new Error('incorrect type value: ', typeof value);

  const valueMultiplyNum = +value * Math.pow(10, num);
  const valueFloor = Math.floor(valueMultiplyNum);

  return valueFloor / Math.pow(10, num)
}
