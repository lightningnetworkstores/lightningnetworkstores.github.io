export const state = () => ({
  isDev: null,
  baseURL: 'https://bitcoin-stores.com/',
  loading: false,
  donations: [],
  scores: [],
  stores: [],
  store: null,
  wallets: [],
  discussions: [],
  tags: [],
  selectedTags: [],
  faucetStats: {},
  configuration: null,
  replyReviewFee: 50,
  addStoreFee: 1000,
  likedStores: [],
})

export default state
