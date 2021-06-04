export const state = () => ({
  isDev: null,
  baseURL: "http://localhost:8080",
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
