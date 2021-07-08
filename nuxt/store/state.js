export const state = () => ({
  addStoreFee: 1000,
  announcements: [],
  baseURL: process.env.BASE_URL,
  configuration: { max_comment_size: 250 },
  discussions: [],
  lastDiscussions: [],
  activeStoreDiscussions: [],
  donations: [],
  excludedTags: [],
  faucetStats: {},
  filterByFavorites: false,
  filteredStores: [],
  filteredTags: [],
  isDev: null,
  likedStores: {},
  loading: false,
  replyReviewFee: 50,
  scores: [],
  scrolledStores: 0,
  selectedStore: { logged: false }, // makes components reactive to selectedStore.logged
  selectedTags: [],
  stores: [],
  storeSummary: [],
  tags: [],
  wallets: [],
})

export default state
