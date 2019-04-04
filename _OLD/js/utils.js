function get_site(storeID) {

    for (var i = 0; i < sites.length; i++) {
        if (Number(sites[i].id) == Number(storeID)) { return sites[i] }
    }
}

function get_score(storeID) {
    if (scores[storeID.toString()] == null) { var score = 0 } else { var score = scores[storeID.toString()][0] - scores[storeID.toString()][1] }
    return score
}

function get_trendingScore(storeID) {
    if (scores[storeID.toString()] == null) { var score = 0 } else { var score = scores[storeID.toString()][2] }
    return score
}

function get_timestamp(storeID){
    var site = get_site(storeID)
    if (site != null && site.added){return site.added} else {return 1519419592}
}

function get_controversial_score(storeID) {
    if (scores[storeID.toString()] == null) { var upvotes = 0 } else { var upvotes = scores[storeID.toString()][0] }
    if (scores[storeID.toString()] == null) { var downvotes = 0 } else { var downvotes = scores[storeID.toString()][1] }
    if (downvotes > upvotes) {
        var balance = upvotes / downvotes
    } else if (upvotes > 0) {
        var balance = downvotes / upvotes
    } else {
        balance = 1
    }
    if (scores[storeID.toString()] == null) { var score = 0 } else { var score = (scores[storeID.toString()][0] + scores[storeID.toString()][1]) * balance }
    return score
}

function getMaxMinScores(ids){
    var scores = []
    var trendingScores = []
    for (var i=0; i < ids.length; i++){
        scores.push(get_score(ids[i]))
        trendingScores.push(get_trendingScore(ids[i]))
    }

    var result = [Math.max(scores), Math.min(scores)]
    result.push([Math.max(trendingScores), Math.min(trendingScores)])
    return result
}


