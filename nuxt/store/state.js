export const state = () => {
  // Warning: no changes these elements, reorder with caution
  const defaultSorting = {
    score: 100,
    novelty: 0,
    halflife: 270,
    newontop: 1,
    trending: 0,
    likeTrend: 0,
    satsPerLike: 1,
    externalTrend: 0,
  }

  const result = {
    announcements: {
      configuration: {},
      items: [],
    },
    baseURL: process.env.BASE_URL,
    browserFingerprint: '',
    configuration: {
      max_comment_size: 250,
      min_post: 100,
      min_reply: 100,
      listing_fee: 1000,
      min_skip_captcha: 1000,
      minimum_donation: 1000,
      maximum_donation_timeout_days: 70,
      version: 0,
    },
    activeStoreDiscussions: [],
    deviceFingerprint: '',
    deviceResolution: {},
    discussions: [],
    donations: [],
    excludedTags: [],
    faucetDonors: [],
    faucetStats: {},
    filterByFavorites: false,
    filteredStores: [],
    filteredTags: [],
    isDev: null,
    lastActivity: 0,
    lastCommentSeenTimestamp: 0,
    lastDiscussions: [],
    likedStores: {},
    loading: false,
    loginStatus: {},
    popularSearches: [],
    quizContest: {},
    nameQuizContest: '',
    scores: [],
    scrolledStores: 0,
    selectedStore: { logged: false }, // makes components reactive to selectedStore.logged
    selectedStoreSettings: {},
    selectedTags: [],
    statistics: {},
    storeContest: {},
    nameStoreContest: '',
    storeEvents: [],
    storePages: 0,
    stores: [],
    storeSummary: [],
    tags: [],
    wallets: [],
    externallyTrending: [],
    settingCustomSorting: {
      score: 100,
      novelty: 0,
      halflife: 270,
      newontop: 1,
      trending: 0,
      likeTrend: 0,
      satsPerLike: 1,
      externalTrend: 0,
      default: false,
    },
    defaultSorting,
    // Warning: unfortunately, the API is dependent on the order of these elements, reorder with caution
    sliderCustomSorting: [
      {
        id: 'scs01',
        name: '',
        slide: [
          {
            id: 'score',
            label: 'Promotion weight',
            value: defaultSorting.score,
            step: 1,
            min: 0,
            max: 100,
            ticks: false,
            ts: 4,
            explainer:
              'Weight of bitcoin spent on upvoting and upvoting this store. This is how projects are traditionally sorted.',
          },
          {
            id: 'satsPerLike',
            label: 'Like weight',
            value: defaultSorting.satsPerLike,
            step: 1,
            min: 0,
            max: 100,
            ticks: false,
            ts: 4,
            explainer: 'Adjusts the weight of each like.',
          },
        ],
      },
      {
        id: 'scs02',
        name: 'Trending score',
        slide: [
          {
            id: 'trending',
            label: 'Promotion',
            value: defaultSorting.trending,
            step: 1,
            min: 0,
            max: 100,
            ticks: false,
            ts: 4,
            explainer:
              'Adjusts the weight of the trending score derived from bitcoin spent in upvotes/downvotes.',
          },
          {
            id: 'likeTrend',
            label: 'Likes',
            value: defaultSorting.likeTrend,
            step: 1,
            min: 0,
            max: 100,
            ticks: false,
            ts: 4,
            explainer:
              'Adjusts the weight of the trending score derived from likes.',
          },
          {
            id: 'externalTrend',
            label: 'Social media',
            value: defaultSorting.externalTrend,
            step: 1,
            min: 0,
            max: 100,
            ticks: false,
            ts: 4,
            explainer:
              'Adjusts the weight of the trending score derived from traffic and social media activity. We use data provided by third-parties like Twitter.',
          },
        ],
      },
      {
        id: 'scs03',
        name: 'Novelty',
        slide: [
          {
            id: 'novelty',
            label: 'Novelty score',
            value: defaultSorting.novelty,
            step: 1,
            min: 0,
            max: 100,
            ticks: false,
            ts: 4,
            explainer:
              'Adjusts the weight of the age of each project. A high value will favor new stores listed on the website.',
          },
          {
            id: 'newontop',
            label: 'Move newest stores on top',
            value: defaultSorting.newontop,
            step: 1,
            min: 0,
            max: 5,
            ticks: false,
            ts: 4,
            explainer:
              'Moves the chosen amount of newest stores to the top of the list.',
          },
        ],
      },
    ],
    customSortingAdvanced: [
      {
        id: 'halflife',
        label: 'Evaporation half-life',
        value: defaultSorting.halflife,
        step: 1,
        min: 0,
        max: 100,
        ticks: false,
        ts: 4,
        explainer:
          'Adjusts how fast the bitcoin spent on upvoting and upvoting loses value over time. Default is set to 9 months.',
      },
    ],
  }

  return result
}

export default state
