export const state = () => ({
  isDev: null,
  baseURL: "https://bitcoin-stores.com",
  loading: false,
  donations: [],
  scores: [],
  stores: [],
  wallets: [],
  discussions: [],
  tags: [],
  selectedTags: [],
  configuration: null,
  replyReviewFee: 50,
  addStoreFee: 1000,
})

export default state;
