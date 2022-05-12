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
  getStores(state) {
    return ({ sector, digitalGoods }, sort, search, safeMode = 'false') => {
      //filter
      let isFiltered = true
      let stores = []

      let stateStores = state.stores.slice(0)

      if (
        (!sector || sector == 'undefined') &&
        (!digitalGoods || digitalGoods == 'undefined')
      ) {
        stores = stateStores
        isFiltered = false
      } else if (!digitalGoods || digitalGoods == 'undefined') {
        stores =
          sector !== 'all'
            ? stateStores.filter((store) => store.sector == sector)
            : stateStores
      } else if (!sector || sector == 'undefined') {
        stores =
          digitalGoods !== 'all'
            ? stateStores.filter((store) => store.digital_goods == digitalGoods)
            : stateStores
      } else {
        let filteredBySector =
          sector !== 'all'
            ? stateStores.filter((store) => store.sector == sector)
            : stateStores
        stores =
          digitalGoods !== 'all'
            ? filteredBySector.filter(
                (store) => store.digital_goods == digitalGoods
              )
            : filteredBySector
      }

      if (safeMode === 'true' && stores) {
        let safeStores = stores.filter((store) => {
          return (
            +new Date(store.added * 1000) < Date.now() + -3 * 24 * 3600 * 1000
          )
        })
        stores = safeStores
      }

      if (digitalGoods == 'all' || sector == 'all') {
        isFiltered = false
      }

      isFiltered =
        state.selectedTags.length != 0 ||
        state.excludedTags.length != 0 ||
        state.filterByFavorites

      //Search
      if (search && search !== 'undefined') {
        let fuse = new Fuse(stores, options)
        stores = fuse.search(search)
        return stores;
      } 

      let settingSorting = state.settingCustomSorting
      stores = stores.sort(sortingFunction(sort, settingSorting))

      if (sort == 'trending') {
        stores = stores.filter((store) => store.trending > options.trendingThreshold)
      }
      if (isFiltered || (sort != null && sort != 'best')) { return stores; }

      // Add trendiest store to top
      var mostTrendingStore = stores.slice().sort((a, b) => {
        return b.trending - a.trending
      })[0]

        // Add newest store to top
      var newestStore = stores.slice().sort((a, b) => {
        return b.added - a.added
      })[0]
      stores.splice(stores.indexOf(newestStore), 1)
      stores.splice(1, 0, newestStore)

      // Is above trending threshold?
      if (
        mostTrendingStore &&
        stores.length > 0 &&
        mostTrendingStore.trending >= 10
      ) {
        stores.splice(stores.indexOf(mostTrendingStore), 1)
        stores.splice(1, 0, mostTrendingStore)
      }
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
}

function sortingFunction(method, parameters = {}) {
  console.log('method=' + method)
  switch (method) {
    case 'custom':
      let scoreFunction = customScore(parameters)
      return (a, b) => { return (scoreFunction(b) - scoreFunction(a)) }
    case 'trending':
      return (a, b) => { return b.trending - a.trending }
    case 'newest':
      return (a, b) => { return b.added - a.added }
    case 'lifetime':
      return (a, b) => { return b.lifetime - a.lifetime }
    case 'likes':
      return (a, b) => { return b.likes - a.likes }
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
      return (a, b) => { return b.last_commented - a.last_commented }
    default:
      return (a, b) => { return b.sorting - a.sorting }
  }
}

function customScore(parameters) {
  return (a) => {
    let evaporated = 0
    if (parameters.halflife <= 270) {
      let nineMonthWeight = (parameters.halflife - 30) / (270 - 30)
      evaporated = (a.upvotes - a.downvotes) * nineMonthWeight + a.evaporated90 * (1 - nineMonthWeight)
    } else if (parameters.halflife > 270) {
      evaporated = a.lifetime
    }

    let score = evaporated * parameters.score

    let scoreTrend = a.trending * parameters.trending
    let likeTrend = 0 * parameters.likeTrend // TODO
    let externalTrend = 0 * parameters.externalTrend // TODO
    let novelty = a.added * parameters.novelty

    let likes = a.likes * parameters.satsPerLike


    return score + scoreTrend + novelty + likes + likeTrend + externalTrend
  }
}

export default getters
