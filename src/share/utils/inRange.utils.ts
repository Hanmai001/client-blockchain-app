export const inRange = (min: number, max: number, check: number) => {
  if (check > min && check < max) return check
  else if (check <= min) return min
  else return max
}
