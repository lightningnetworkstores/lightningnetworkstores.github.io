export const state = () => ({
  isDev: null,
  baseURL: "http://localhost:8080",
  loading: false,
  donations: [],
  scores: [],
  stores: [],
  wallets: [],
  tags: [],
  selectedTags: [],
  configuration: null,
  replyReviewFee: 500,
  addStoreFee: 2000,
})

export default state;
