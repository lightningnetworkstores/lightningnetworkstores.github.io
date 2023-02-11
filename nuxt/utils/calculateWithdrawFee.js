const FEE_PERCENTAGE = 0.01;

export const calculateWithdrawFee = (amount) => {
  return Math.ceil(amount * FEE_PERCENTAGE)
}
