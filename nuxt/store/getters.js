import Fuse from "fuse.js";

const options = {
  shouldSort: true,
  threshold: 0.5,
  trendingThreshold: 0,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: ["name", "rank", "href", "description"],
};


const getters = {
  getStores(
    state
  ) {
    return ({
      sector,
      digitalGoods
    }, sort, search, safeMode = "false") => {

      //filter
      let isFiltered = true;
      let stores = [];

      let stateStores = state.stores.slice(0);

      if ((!sector || sector == "undefined") && (!digitalGoods || digitalGoods == "undefined")) {
        stores = stateStores;
        isFiltered = false;
      } else if (!digitalGoods || digitalGoods == "undefined") {
        stores = sector !== "all" ? stateStores.filter((store) => store.sector == sector) : stateStores;
      } else if (!sector || sector == "undefined") {
        stores = digitalGoods !== "all" ? stateStores.filter((store) => store.digital_goods == digitalGoods) : stateStores;
      } else {
        let filteredBySector = sector !== "all" ? stateStores.filter((store) => store.sector == sector) : stateStores;
        stores = digitalGoods !== "all" ? filteredBySector.filter((store) => store.digital_goods == digitalGoods) : filteredBySector;
      }

      if (safeMode === "true" && stores) {
        let safeStores = stores.filter((store) => {
          return +new Date(store.added * 1000) < Date.now() + -3 * 24 * 3600 * 1000;
        });
        stores = safeStores;
      }

      if (digitalGoods == "all" || sector == "all") {
        isFiltered = false;
      }

      //Search
      if (search && search !== "undefined") {
        let fuse = new Fuse(stores, options);
        stores = fuse.search(search);

      } else {
        // Sort
        switch (sort) {
          case "trending":
            stores = stores
              .filter((store) => store.score > options.trendingThreshold)
              .sort((a, b) => {
                return (b.score || [0, 0, 0])[2] - (a.score || [0, 0, 0])[2];
              });
            break;
          case "newest":
            stores
              .sort((a, b) => {
                return a.added - b.added;
              })
              .reverse();
            break;
          case "lifetime":
            stores.sort((a, b) => {
              return (b.score || [0, 0, 0, 0, 0, 0])[5] - (a.score || [0, 0, 0, 0, 0, 0])[5];
            });
            break;
          case "controversial":
            stores.sort((a, b) => {
              return (b.score || [0, 0])[1] - (a.score || [0, 0])[1];
            });
            break;
          case "lastcommented":
            stores.sort((a, b) => {
              return (b.score || [0, 0, 0, 0])[3] - (a.score || [0, 0, 0, 0])[3];
            });
            break;
          default:
            stores.sort((a, b) => {
              // let scoreB = (b.score || [0])[0] - (b.score || [0, 0])[1];
              // let scoreA = (a.score || [0])[0] - (a.score || [0, 0])[1];
              // return scoreB - scoreA;
              return b.score - a.score;
            });
            // Add most treding tore to top
            if (!isFiltered) {
              var mostTrendingStore = stores.slice().sort((a, b) => {
                return (b.score || [0, 0, 0])[2] - (a.score || [0, 0, 0])[2];
              })[0];

              // Is above trending threshold?
              if (mostTrendingStore && state.scores.length && state.scores[mostTrendingStore.id][2] >= 10) {
                stores.splice(stores.indexOf(mostTrendingStore), 1);
                stores.unshift(mostTrendingStore);
              }
            }
            break;
        }
      }

      return stores;
    }
  },

  getScore: (state) => (id) => {
    let score = state.scores[id] || [0, 0, 0];
    let rank = 1;
    if (score[0] - score[1] !== 0) {
      for (var element in state.scores) {
        if (state.scores.hasOwnProperty(element)) {
          if (state.scores[element][0] - state.scores[element][1] > score[0] - score[1]) {
            rank++;
          }
        }
      }
      rank = "#" + rank;
    } else {
      rank = "unranked";
    }
    return {
      upvotes: score[0],
      downvotes: score[1],
      trending: score[2],
      lastCommented: score[3],
      rank: rank,
      commentCount: score[4] ? score[4] : 0,
      lifetime: score[5] ? score[5] : 0
    };
  },
  getDiscussions: (state) => {
    const formattedDiscussions = state.discussions.map(discussion => {
      const store = {
        id: discussion.id,
        trending: discussion.trending,
        rank: discussion.rank,
        upvotes: discussion.upvotes,
        href: discussion.href,
        name: discussion.name,
        description: discussion.description,
        tags: discussion.tags,
        total_comments: discussion.total_comments,
        added: discussion.added
      };
      return {
        store: store,
        comments: discussion.comments
      }
    });
    return formattedDiscussions;
  }
}

export default getters;
