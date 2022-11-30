import Fuse from 'fuse.js'

import { resolveRelations } from './helpers'

const options = {
  // https://fusejs.io/api/options
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 10000,
  ignoreLocation: false,
  maxPatternLength: 32,
  minMatchCharLength: 4,
  keys: ['name', 'href', 'description', 'tags', 'likely_tags'],
  trendingThreshold: 0,
}

const getters = {
  getStores(state, getters) {
    return (
      { sector, digitalGoods },
      sort,
      search,
      safeMode = 'false',
      section = 'general'
    ) => {
      //filter
      let isFiltered = false
      let stateStores = state.stores.slice(0)
      let stores = stateStores

      if (safeMode === 'true' && stores) {
        let safeStores = stores.filter((store) => {
          return (
            +new Date(store.added * 1000) < Date.now() + -3 * 24 * 3600 * 1000
          )
        })
        stores = safeStores
      }

      isFiltered =
        state.selectedTags.length != 0 ||
        state.excludedTags.length != 0 ||
        state.filterByFavorites

      //Search
      if (search && search !== 'undefined') {
        let fuse = new Fuse(stores, options)
        stores = fuse.search(search)
        return stores
      }

      stores.sort(
        sortingFunction(
          sort,
          ['custom', 'trending'].includes(sort)
            ? state.settingCustomSorting
            : state.defaultSorting
        )
      )

      if (sort == 'trending') {
        stores = stores.filter(
          (store) => store.trending > options.trendingThreshold
        )
      }

      // Deprecated code that moves newest and trendiest store to the top
      return stores
    }
  },

  getScore: (state) => (id) => {
    let score = state.scores[id] || [0, 0, 0]
    let rank = 1
    if (score[0] - score[1] !== 0) {
      for (var element in state.scores) {
        if (state.scores.hasOwnProperty(element)) {
          if (
            state.scores[element][0] - state.scores[element][1] >
            score[0] - score[1]
          ) {
            rank++
          }
        }
      }
      rank = '#' + rank
    } else {
      rank = 'unranked'
    }
    return {
      upvotes: score[0],
      downvotes: score[1],
      trending: score[2],
      lastCommented: score[3],
      rank: rank,
      commentCount: score[4] ? score[4] : 0,
      lifetime: score[5] ? score[5] : 0,
    }
  },
  getActiveStoreDiscussions: (state, getters) => {
    return getters.getListResolvedEntity(
      state.activeStoreDiscussions,
      'stores',
      ['store']
    )
  },

  getEventStores(state, getters) {
    return getters.getListResolvedEntity(state.storeEvents, 'stores', ['store'])
  },

  getListResolvedEntity(state) {
    return (normalizedDataList, collectionName, fields) => {
      return normalizedDataList.map((data) =>
        resolveRelations(data, fields, state[collectionName])
      )
    }
  },
  getStoreContest(state) {
    return state.storeContest
  },
  getQuizContest(state) {
    return state.quizContest
  },
  getSettingCustomSorting(state) {
    return state.settingCustomSorting
  },
}

function sortingFunction(method, parameters = {}) {
  console.log('method=' + method)
  switch (method) {
    case 'custom':
      let scoreFunction = customScore(parameters)
      return (a, b) => {
        return scoreFunction(b) - scoreFunction(a)
      }
    case 'trending':
      let trendingGetter = trendingScore(parameters)
      return (a, b) => {
        return trendingGetter(b) - trendingGetter(a)
      }
    case 'newest':
      return (a, b) => {
        return b.added - a.added
      }
    case 'lifetime':
      return (a, b) => {
        return b.lifetime - a.lifetime
      }
    case 'likes':
      return (a, b) => {
        return b.likes - a.likes
      }
    case 'controversial':
      return (a, b) => {
        let magnitudeB = b.upvotes + b.downvotes
        let controversialB = 0
        if (magnitudeB != 0) {
          controversialB =
            (magnitudeB * Math.min(b.upvotes, b.downvotes)) /
            Math.max(b.upvotes, b.downvotes)
        }

        let magnitudeA = a.upvotes + a.downvotes
        let controversialA = 0
        if (magnitudeA != 0) {
          controversialA =
            (magnitudeA * Math.min(a.upvotes, a.downvotes)) /
            Math.max(a.upvotes, a.downvotes)
        }

        return controversialB - controversialA
      }
    case 'lastcommented':
      return (a, b) => {
        return b.last_commented - a.last_commented
      }
    default:
      let defaultFunction = customScore(parameters)
      return (a, b) => {
        return defaultFunction(b) - defaultFunction(a)
      }
  }
}

function customScore(parameters) {
  // TODO add a.evaporated90
  return (a) => {
    let evaporated = 0
    if (parameters.halflife <= 270) {
      let nineMonthWeight = (parameters.halflife - 30) / (270 - 30)
      evaporated =
        (a.upvotes - a.downvotes) * nineMonthWeight +
        (a.upvotes - a.downvotes) * (1 - nineMonthWeight)
    } else if (parameters.halflife > 270) {
      evaporated = a.lifetime
    }

    let score = evaporated * parameters.score


    let trendingFunction = trendingScore(parameters)
    let trendingScoreResult = trendingFunction(a)

    let novelty = 1000 + (a.added - new Date().getTime() / 1000) / 86400
    novelty = Math.min(1000, Math.max(0, novelty)) * parameters.novelty * 1000

    let likes = a.likes * parameters.satsPerLike * 100000

    return score + novelty + likes + trendingScoreResult * 15000
  }
}

function trendingScore(parameters) {
  const { trending, likeTrend, externalTrend } = parameters
  console.log(
    'trending=' +
      trending +
      ', likeTrend=' +
      likeTrend +
      ', externalTrend=' +
      externalTrend
  )
  return (a) => {
    if (trending + likeTrend + externalTrend == 0) {
      return a.trending
    }
    return (
      (a.trending * trending +
        a.likeTrend * likeTrend +
        a.externalTrend * externalTrend) /
      (trending + likeTrend + externalTrend)
    )
  }
}

export default getters
