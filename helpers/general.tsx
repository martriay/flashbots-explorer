export const timeNow = () => {
  return randomMaxMin(Date.now(), Date.now() * 10000)
}

export const randomMaxMin = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
