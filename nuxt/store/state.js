export const state = () => ({
  isDev: null,
  baseURL: process.env.BASE_URL,
  loading: false,
  donations: [],
  scores: [],
  stores: [],
  store: null,
  selectedStore: null,
  wallets: [],
  discussions: [],
  tags: [],
  selectedTags: [],
  excludedTags: [],
  faucetStats: {},
  configuration: null,
  replyReviewFee: 50,
  addStoreFee: 1000,
  likedStores: {},
  filteredTags: [],
  filteredStores: [],
})

export default state
