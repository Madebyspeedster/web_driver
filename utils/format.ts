const toFloat = function(src: string | number, digits: number = 2): number {
  const numWithDecimals = Number(
    `${src}`.trim().replace(/[^0-9.-]/g, '')
  ).toFixed(digits);
  return parseFloat(`${src}`.trim().replace(/[^0-9.-]/g, ''));
};

const toInt = function(src: string | number): number {
  return parseInt(`${src}`.replace(/[^0-9.-]/g, ''), 10);
};

export { toFloat, toInt };
