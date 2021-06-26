export const summarizeFp = (x, c): number => (x.reduce((acc, tx) => acc + tx[c] / 10 ** 18, 0)).toFixed(4)
