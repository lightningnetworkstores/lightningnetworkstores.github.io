var storesToShow = 4

var sectorList = ['Technology', 'security', 'clothing', 'exchange', 'food', 'games&casino', 'adult', 'art', 
                'drugs&supplements', 'cryptocurrency merchandise', 'other']

var digitalGoodsList = ['yes', 'no, goods shipped', 'no, goods only in-store', undefined]

// ratio of stores accepting lightning, how many days
daysOfRatio = 60

// default parameters for choosing a random store
var excludeSectors = ['adult']
var eligibleDigitalGoods = ['yes']
var randomness = 20
var weightOfTrendingScores = 0.4
var previewChosenStore = false
var hasAskedToVote = true
var redirectTimestamp = 0

var loadedJsons = 0
// gather sites and coinmap data
fetch('/sites.json').then(r => r.json().then(function(a){sites=a; loadedJsons +=1; if (loadedJsons==3){main()}}))
fetch('/coinmap.json').then(r => r.json().then( function(a){coinmap=a; loadedJsons +=1; if (loadedJsons==3){main()}} ))
fetch('/storeScores.json').then(r => r.json().then( function(a){scores=a; loadedJsons +=1; if (loadedJsons==3){main()}} ))

$(window).focus( function(){
    if (!hasAskedToVote){

        var toastBody = document.getElementById('toastBody')
        var initialNodes = toastBody.childNodes
        while (toastBody.childNodes.length > 0){
            console.log('removing child of toast body' + initialNodes[0].nodeName)
            toastBody.removeChild(initialNodes[0])
        }

        var upvoteP = document.createElement('p')
        var upvoteB = document.createElement('button')
        upvoteB.innerHTML = 'Upvote it'
        upvoteB.className = 'btn btn-success'
        upvoteB.onclick = upVoteHandler
        upvoteP.appendChild(upvoteB)

        var downvoteP = document.createElement('p')
        var downvoteB = document.createElement('button')
        downvoteB.className = 'btn btn-danger'
        downvoteB.innerHTML = 'Downvote it'
        downvoteB.onclick = downVoteHandler
        downvoteP.appendChild(downvoteB)

        if (Date.now() - redirectTimestamp > 10000){
            document.getElementById('toastTitle').innerHTML = 'Did you like <u>' + chosenSite.name + '</u>?'
            
            toastBody.appendChild(upvoteP)
            toastBody.appendChild(downvoteP)
        } else {
            document.getElementById('toastTitle').innerHTML = 'Did you dislike <u>' + chosenSite.name + '</u>?'
            
            toastBody.appendChild(downvoteP)
            toastBody.appendChild(upvoteP)
        }

        $('.toast').toast('show')
        hasAskedToVote = true
    }

})

function createSectorCheckboxHandler(sectorOfCheckbox){
    return function(){
        var checkboxID = sectorOfCheckbox + '-checkbox'
        if (document.getElementById(checkboxID).checked){
            console.log('removing ' + sectorOfCheckbox + ' from excluded sector list')
            excludeSectors = excludeSectors.filter(e => e != sectorOfCheckbox)
        } else {
            console.log('adding ' + sectorOfCheckbox + ' to excluded sector list')
            excludeSectors.push(sectorOfCheckbox)
        }
    }
}

function createDigitalGoodsCheckboxHandler(DGofCheckbox){
    return function(){
        var checkboxID = DGofCheckbox + '-checkbox'
        if (document.getElementById(checkboxID).checked){
            console.log('adding ' + DGofCheckbox + ' to eligible DigitalGoods')
            eligibleDigitalGoods.push(DGofCheckbox)
        } else {
            console.log('removing ' + DGofCheckbox + ' from eligible DigitalGoods')
            eligibleDigitalGoods = eligibleDigitalGoods.filter(e => e != DGofCheckbox)
        }
    }
}

function previewChangeHandler(){
    previewChosenStore = document.getElementById('previewCkb').checked
}

function buildOptionsForSampler(){
    for(var i=0; i < sectorList.length; i++){
        var currentSector = sectorList[i].toLowerCase()

        var newSectorLine = document.createElement('p')
        newSectorLine.style = 'margin-bottom:0rem; text-align:right'

        var newCheckBox = document.createElement("input");
        newCheckBox.className = 'form-check-input'
        newCheckBox.type = 'checkbox'
        newCheckBox.id = currentSector + '-checkbox'
        newCheckBox.defaultChecked = !excludeSectors.includes(currentSector)
        newCheckBox.onclick = createSectorCheckboxHandler(currentSector)
        var sectorListCol = document.getElementById('sectorList')

        var newSectorLabel = document.createElement('label')
        newSectorLabel.style = 'padding-right: 2rem'
        newSectorLabel.innerHTML = currentSector[0].toUpperCase() + currentSector.slice(1)

        newSectorLine.appendChild(newSectorLabel)
        newSectorLine.appendChild(newCheckBox)
        
        sectorListCol.appendChild(newSectorLine)
    }


    for(var i=0; i < digitalGoodsList.length; i++){
        if (digitalGoodsList[i] != undefined){
            var currentDG = digitalGoodsList[i].toLowerCase()
        } else {
            var currentDG = 'undefined'
        }

        var newSectorLine = document.createElement('p')
        newSectorLine.style = 'margin-bottom:0rem; text-align:left'

        var newCheckBox = document.createElement("input");
        newCheckBox.className = 'form-check-input'
        newCheckBox.type = 'checkbox'
        newCheckBox.id = currentDG + '-checkbox'
        if (digitalGoodsList[i] != undefined){
            newCheckBox.defaultChecked = eligibleDigitalGoods.includes(currentDG)
            newCheckBox.onclick = createDigitalGoodsCheckboxHandler(currentDG)
        } else {
            newCheckBox.defaultChecked = eligibleDigitalGoods.includes(undefined)
            newCheckBox.onclick = createDigitalGoodsCheckboxHandler(undefined)
        }
        var digitalGoodsListCol = document.getElementById('digitalGoodsList')

        var newSectorLabel = document.createElement('label')
        newSectorLabel.innerHTML = currentDG[0].toUpperCase() + currentDG.slice(1)

        newSectorLine.appendChild(newCheckBox)
        newSectorLine.appendChild(newSectorLabel)
        
        digitalGoodsListCol.appendChild(newSectorLine)
    }

    var randomnessSlider = new Slider("#ex8");

    randomnessSlider.on("slide", function(sliderValue) { randomness = sliderValue
    document.getElementById('randomnessShown').innerHTML = sliderValue})
    
    var trendingSlider = new Slider("#ex9");
    
    trendingSlider.on("slide", function(sliderValue) { weightOfTrendingScores = sliderValue/100
    document.getElementById('trendingShown').innerHTML = sliderValue})

}

function buildTrendingPanel(){
    var trendingCol = document.getElementById('trending')
    var idIsComingAndScores = []
    for (var i=0; i < sites.length; i++){
        var chosenScore;
        site = sites[i]
        if (site.flags !=null){ continue}
        chosenScore = get_trendingScore(site.id)
        idIsComingAndScores.push([site.id,site.flags,chosenScore])
    }

    idIsComingAndScores = idIsComingAndScores.sort(function(a,b){return b[2] - a[2]})

    for (var i=0; i < storesToShow; i++){
        var storeToShowP = document.createElement('p')
        var storeToShowA = document.createElement('a')
        var siteToShow = get_site(idIsComingAndScores[i][0])
        storeToShowA.innerHTML = siteToShow.name
        storeToShowA.href = siteToShow.href

        storeToShowP.appendChild(storeToShowA)
        trendingCol.append(storeToShowP)
    }

}

function buildNewestPanel(){
    var trendingCol = document.getElementById('newest')
    var idIsComingAndScores = []
    for (var i=0; i < sites.length; i++){
        var chosenScore;
        site = sites[i]
        if (site.flags !=null){ continue}
        chosenScore = get_timestamp(site.id)
        idIsComingAndScores.push([site.id,site.flags,chosenScore])
    }

    idIsComingAndScores = idIsComingAndScores.sort(function(a,b){return b[2] - a[2]})

    for (var i=0; i < storesToShow; i++){
        var storeToShowP = document.createElement('p')
        var storeToShowA = document.createElement('a')
        var siteToShow = get_site(idIsComingAndScores[i][0])
        storeToShowA.innerHTML = siteToShow.name
        storeToShowA.href = siteToShow.href

        storeToShowP.appendChild(storeToShowA)
        trendingCol.append(storeToShowP)
    }

}

function main(){

    buildTrendingPanel()
    buildNewestPanel()


    buildOptionsForSampler()

    // prepare data for graph
    addedTimes=[];
    for(var i = 0; i < sites.length; i++){

        if(sites[i].flags != null){continue}

        if(sites[i].added == null){
            addedTimes.push(1519419592)}
        else{
            addedTimes.push(sites[i].added)
        }
    }

    addedTimes.sort()

    setBannerValues()

    drawWithoutCoinmap()

    var invoice_button = document.getElementById("getinvoicebutton")
        invoice_button.addEventListener('click', getInvoice);

    var check_payment_button = document.getElementById("checkpaymentbutton")
    check_payment_button.addEventListener('click', checkPayment);
    
}

function drawWithCoinmap(){

    var coinmapTimes = []
    for (i in coinmap){
        coinmapTimes.push(coinmap[i][0])
    }
    var coinmapAdvancedIndexes = coinmapTimes.findIndex(function(el){return el>=addedTimes[0]})
    completeTime = coinmapTimes.slice(0,coinmapAdvancedIndexes).concat(addedTimes)

    var storesAfter = [...Array(addedTimes.length).keys()].map(x => x+1)
    LNstoreNumber = Array(coinmapAdvancedIndexes).fill(0).concat(storesAfter)

    var chartDataAll = function(completeTimeA, LNstoreNumberA, coinmapA){
        var data = []
        for (var i=0; i < completeTimeA.length; i++){
            if (i >= coinmap.length){
                data.push([new Date(completeTimeA[i]*1000), LNstoreNumberA[i], null])
            } else {
                data.push([new Date(completeTimeA[i]*1000), LNstoreNumberA[i], coinmapA[i][1]])
            }
        }
        return data
    }(completeTime, LNstoreNumber, coinmap)

    var graphOptions = getGraphOptions()
    graphOptions.colors = ['rgb(255,100,100)', 'rgb(51,204,204)']
    graphOptions.labels = ['Time', 'Lightning merchants', 'All bitcoin merchants (coinmap.org)']

    
    g = new Dygraph(
        document.getElementById("graph"), chartDataAll, graphOptions)
}

function drawWithoutCoinmap(){

    var count=[...Array(addedTimes.length).keys()].map(x => x+1)
    var chartData = count.map(x => [new Date(addedTimes[x-1]*1000),x])
    
    var graphOptions = getGraphOptions()
    graphOptions.colors = ['rgb(255,100,100)']
    graphOptions.labels = ['Time', 'Lightning merchants']

    g = new Dygraph(
        document.getElementById("graph"), chartData, graphOptions)
}

function xTickFormatter(d, gran){
    if (d != null){
        return (1+d.getMonth()) + '/' + (1900+d.getYear())
    } else {
        return d
    }

}

function getGraphOptions(){
    if (typeof g !== 'undefined'){
        var logScaleOption = g.getOption('logscale')
    } else {
        var logScaleOption = false
    }

    var graphOptions =
    {
    legend: 'always',
    labelsDiv: document.getElementById('legend'),
    legendFormatter: legendFormatter,
    animatedZooms: true,
    title: 'Minimum number of merchants',
    showRangeSelector: true,
    logscale: logScaleOption,
    // axes: {x: {axisTickSize: 3, axisLabelFormatter: xTickFormatter}},
    strokeWidth: 3.0,
    drawGrid: true,
    series: {
        'Lightning merchants': { showInRangeSelector: true}
        }
    }
    return graphOptions
}

function legendFormatter(data) {
    if (data.x == null) {
      // This happens when there's no selection and {legend: 'always'} is set.
      return '<br>' + data.series.map(function(series) { return series.dashHTML + ' ' + series.labelHTML }).join('<br>');
    }
  
    var html = this.getLabels()[0] + ': ' + data.xHTML;
    data.series.forEach(function(series) {
      if (!series.isVisible) return;
      var labeledData = series.labelHTML + ': ' + series.yHTML;
      if (series.isHighlighted) {
        labeledData = '<b>' + labeledData + '</b>';
      }
      html += '<br>' + series.dashHTML + ' ' + labeledData;
    });
    return html;
  }

function changeScale(){
    var useLogScale = g.getOption('logscale')
    g.updateOptions({logscale: !useLogScale})
}

function changeCoinmap(){
    var wasUsingCoinmap = g.getOption('labels').length == 3
    if (wasUsingCoinmap){
        drawWithoutCoinmap()
    } else {
        drawWithCoinmap()
    }
}

function setBannerValues(){
    document.getElementById('storeNumberNow').innerHTML = addedTimes.length
    
    lastMonthStart = Math.round( (new Date().getTime() - daysOfRatio*24*60*60*1000)/1000 )
    var LNstoresLastMonth = addedTimes.length - addedTimes.findIndex(function(el){return el > lastMonthStart})
    var coinmapLastMonth = coinmap[coinmap.length - 1][1] - coinmapStoresOneMonthAgo(lastMonthStart)
    
    document.getElementById('ratioNow').innerHTML = Math.round(100*LNstoresLastMonth/coinmapLastMonth, 1) + '%'


}

function coinmapStoresOneMonthAgo(lastMonthStart){

    for(var i=0; i < coinmap.length; i++){
        if (coinmap[i][0] > lastMonthStart){
            return coinmap[i][1]
        }
    }
    return coinmap[i][coinmap.length - 1][1]
}

function chooseRandomStore(){
    eligibleIDs = []
    for(var i=0; i < sites.length; i++){
        if(sites[i].flags != null){continue}
        if (excludeSectors.includes(sites[i].sector)){continue}
        if(!eligibleDigitalGoods.includes(sites[i].digital_goods)){continue}

        eligibleIDs.push(sites[i].id)
    }

    randomness = Math.min(100,Math.max(0.00001, randomness))
    var mmRatio = 10000/(randomness*randomness)
    var maxMinScores = getMaxMinScores(eligibleIDs)

    var scoreFactor = Math.log(mmRatio)/(maxMinScores[0][0] - maxMinScores[0][1])
    var trendingFactor = Math.log(mmRatio)/(maxMinScores[1][0] - maxMinScores[1][1])

    fitness = []
    for (var i=0; i < eligibleIDs.length; i++){
        var eligibleScore = get_score(eligibleIDs[i])
        var eligibleTrendingScore = get_trendingScore(eligibleIDs[i])
        
        var currFitness = Math.exp((1-weightOfTrendingScores)*eligibleScore*scoreFactor + 
                            weightOfTrendingScores*eligibleTrendingScore*trendingFactor)

        fitness.push(currFitness)
    }

    accFitness = [fitness[0]]
    fitness.reduce((a,b,i) => accFitness[i] = a+b)

    var dice = Math.random()
    var chosenID
    var totalFitness = accFitness[accFitness.length - 1]
    for(var i=0; i<accFitness.length; i++){
        if (dice <= accFitness[i]/totalFitness){
            chosenID = eligibleIDs[i]
            break
        }
    }

    console.log(chosenID)
    chosenSite = get_site(chosenID)
    console.log("chosen: " + chosenSite.name)
    
    redirectHandler = createRedirectHandler(chosenSite)
    if (previewChosenStore){
        document.getElementById('previewBtn').innerHTML = 'Go to ' + chosenSite.name + ' &rArr;'
        document.getElementById('previewBtn').style = 'display:initial'
    } else {
        document.getElementById('previewBtn').style = 'display:none'
        redirectHandler()
    }

}

function createRedirectHandler(chosenSiteArg){
    return function(){
        // store locally when store is open
        hasAskedToVote = false
        redirectTimestamp = Date.now()

        var oReq = new XMLHttpRequest();

        var params = {
            randomness: randomness,
            excludeSectors: excludeSectors,
            eligibleDigitalGoods: eligibleDigitalGoods,
            previewChosenStore: previewChosenStore,
            chosenSiteID: chosenSiteArg.id,
            chosenSiteName: chosenSiteArg.name,
            weightOfTrendingScores: weightOfTrendingScores
        };
        
        var esc = encodeURIComponent;
        var query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
        
        console.log(query)
        oReq.open("POST", "/infoaboutsampler?" + query);
        oReq.send();
        
        window.open(chosenSiteArg.href)
    }

}

function closeToast(){
    $('.toast').toast('hide')
}

function upVoteHandler(){
    console.log('inside upvote handler...')
    openDirection = 'Upvote';
    openStoreID = chosenSite.id
    openPaymentID = ""
    open_paid_invoice_added = false

    var modal = $('#exampleModal');
    modal.find('.modal-title').text(openDirection + ' ' + chosenSite.name);
    document.getElementById("label1").innerHTML = 'Number of ' + openDirection.toLowerCase() + 's (1 vote = 1 satoshi):'
    modal.find('.modal-body input').val(1000);
    modal.find('.modal-body textarea').val("");
    document.getElementById("qrcodediv").innerHTML = ""
    $('#exampleModal').modal('show')
    
}

function downVoteHandler(){
    console.log('inside downvote handler...')

    openDirection = 'Downvote';
    openStoreID = chosenSite.id
    openPaymentID = ""
    open_paid_invoice_added = false

    var modal = $('#exampleModal');
    modal.find('.modal-title').text(openDirection + ' ' + chosenSite.name);
    document.getElementById("label1").innerHTML = 'Number of ' + openDirection.toLowerCase() + 's (1 vote = 1 satoshi):'
    modal.find('.modal-body input').val(1000);
    modal.find('.modal-body textarea').val("");
    document.getElementById("qrcodediv").innerHTML = ""
    $('#exampleModal').modal('show')
}

function getInvoice() {
    open_number_votes = Number(document.getElementById("amountbox").value)
    console.log("getting invoice for storeID=" + openStoreID + " direction=" + openDirection + " amount=" + open_number_votes)
    $.ajax({
        'async': false,
        'global': false,
        'url': './get_invoice?storeID=' + openStoreID + '&direction=' + openDirection + '&amount=' + open_number_votes,
        'success': function (data) {
            showInvoice(data);
        }
    });

}

function checkPayment() {
    if (! open_paid_invoice_added){
    $.ajax({
        'async': false,
        'global': false,
        'url': "./check_payment?id=" + openPaymentID,
        'success': function (data) {
            updateModal(data);
        }
    });
}
}


function showInvoice(data) {
    document.getElementById("")
    console.log(data)
    data = JSON.parse(data)
    document.getElementById("qrcodediv").innerHTML = '<img id="qrcode" src="http://api.qrserver.com/v1/create-qr-code/?color=000000&amp;bgcolor=FFFFFF&amp;data=' + data.payment_request + '&amp;qzone=1&amp;margin=0&amp;size=400x400&amp;ecc=L" alt="qr code" />'
    document.getElementById("invoicearea").value = data.payment_request
    openPaymentID = data.id
}

function updateModal(data) {
    console.log(data)
    if ((data == 'true' || Number(data) == 'true' || data.trim() == 'true') && !open_paid_invoice_added) {
        console.log("payment received")
        document.getElementById("qrcodediv").innerHTML = '<img id="qrcode" src="https://upload.wikimedia.org/wikipedia/commons/8/8c/White_check_mark_in_dark_green_rounded_square.svg" >'
    
        open_paid_invoice_added = true
    } else {
        console.log("payment not received/already accounted for")
    }
}

// try to import as module?
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

function getMaxMinScores(ids){
    var scoresList = []
    var trendingScores = []
    for (var i=0; i < ids.length; i++){
        scoresList.push(get_score(ids[i]))
        trendingScores.push(get_trendingScore(ids[i]))
    }

    var result = [[Math.max(...scoresList), Math.min(...scoresList)]]
    result.push([Math.max(...trendingScores), Math.min(...trendingScores)])
    return result
}

function get_timestamp(storeID){
    var site = get_site(storeID)
    if (site != null && site.added){return site.added} else {return 1519419592}
}

