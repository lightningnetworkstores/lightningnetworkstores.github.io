export const state = () => ({
  isDev: null,
  baseURL: "http://localhost:8080",
  loading: false,
  donations: [],
  scores: [],
  stores: [],
  tags: [],
  selectedTags: [],
  configuration: null,
  replyReviewFee: 500,
})

export default state;
