var sites; // array format, same order as sites.json
var scores; //json format {id:[upvotes, downvotes]}
var selected_sector = "all";
var selected_delivery = "all";
var selected_size = "all";
var selected_sort = "best";
var selected_new = "all";
var selected_trendy = 'all';
// website is considered new if added in less than this number of seconds (one week)
var new_during = 7 * 24 * 60 * 60;
var trendingThreshold = 30;
var sectorList = ['Technology', 'security', 'clothing', 'exchange', 'food', 'games&casino', 'adult', 'art', 
                'drugs&supplements', 'cryptocurrency merchandise', 'other']

function filtraPorSector(sector, delivery, size, newQ, trendyQ) {

    sector = sector.toLowerCase();
    delivery = delivery.toLowerCase();
    size = size.toLowerCase();
    newQ = newQ.toLowerCase();
    trendyQ = trendyQ.toLowerCase();

    var panels = document.querySelectorAll('#main-content .panel');
    var left_panel = document.querySelectorAll('#main-content .float-left');
    var panels_comingSoon = document.querySelectorAll('#soon-content .panel');
    var left_panel_comingSoon = document.querySelectorAll('#soon-content .float-left');
    var nrFlags = 0;

    left_panel = Array.from(left_panel);
    left_panel.reverse();

    panels = Array.from(panels);
    panels.reverse();

    //panels_comingSoon = panels_comingSoon.flat()
    panels = Array.prototype.slice.call(panels)
    panels_comingSoon = Array.prototype.slice.call(panels_comingSoon)
    left_panel = Array.prototype.slice.call(left_panel)
    left_panel_comingSoon = Array.prototype.slice.call(left_panel_comingSoon)

    panels = panels.concat(panels_comingSoon)
    left_panel = left_panel.concat(left_panel_comingSoon)

    for (var idx = 0; idx < panels.length; idx++) {
        id_of_panel = left_panel[idx].querySelector('.fa-arrow-up').getAttribute('data-storeID')
        site = get_site(id_of_panel)

        // default size
        if (!(site.size)) { site.size = "big"; }

        // default added time is 1st of March 2018
        if (!(site.added)) { site.added = 1519862400; }
        elapsed = Date.now() / 1000 - site.added
        // check if within time interval
        within = (newQ == 'yes' && elapsed < new_during) || (newQ == 'no' && elapsed > new_during)

        //check if trending
        trendy = (trendyQ == 'yes' && get_trendingScore(site.id)) >= trendingThreshold  || (trendyQ == 'no' && get_trendingScore(site.id) <= trendingThreshold) 
        
        //console.log('checking ' + site.name)
        panels[idx].style.display = "block";
        left_panel[idx].style.display = "block";
        sectorOrDeliveryFail = (((sector != 'all') && (site.sector != sector)) || ((delivery != 'all') && (site.digital_goods != delivery)) || 
        ((size != 'all') && (site.size != size)))
        newOrTrendyFail = ((newQ != 'all') && !within) || ( (trendyQ != 'all') && !trendy)
        eitherNewOrTrendy = ( get_trendingScore(site.id) >= trendingThreshold || elapsed < new_during )
        
        if (trendyQ == 'or' && newQ == 'or'){
            if (sectorOrDeliveryFail || !eitherNewOrTrendy){
                panels[idx].style.display = "none";
                left_panel[idx].style.display = "none";
            }
            continue
        }


        if ( sectorOrDeliveryFail ||  newOrTrendyFail) {
            // hide
            panels[idx].style.display = "none";
            left_panel[idx].style.display = "none";
        } else {
            //console.log('not blocking ' + site.name)
        }
    };
}

function build_panel(site, score) {
    if (score < 0) { var score_color = 'blue' } else if (score > 0) { var score_color = 'red' } else { var score_color = 'black' }
    if (Math.abs(score) >= 1000000) { score = Math.round(score / 100000) / 10 + 'M' } else if (Math.abs(score) >= 1000) { score = Math.round(score / 100) / 10 + 'k' }

    var inject = '<div class="float-left" id="float-left' + site.id + '"style="font-size: 19px;margin-right: 15px;">' +
        '<i class="fa fa-arrow-up" data-toggle="modal" data-target="#exampleModal"' +
        ' data-direction="Upvote" data-storeID="' + site.id + '"></i><br>' +
        '<font id="store' + site.id + '" color="' + score_color + '">' + score + '</font><br>' +
        '<i class="fa fa-arrow-down"data-toggle="modal" data-target="#exampleModal"' +
        ' data-direction="Downvote" data-storeID="' + site.id + '"></i></div>'


    var inject = inject + '<div class="panel" id="panel' + site.id + '">' +
        '<h5> <a href="' + site.href + '">' + site.name + '   </a>'

    if (get_trendingScore(site.id) > trendingThreshold){
        inject = inject + '<span class="badge badge-info">trending</span> <a>  </a>'
    }

    if (!(site.added)) {
        site.added = 1519862400;
    }
    elapsed = Date.now() / 1000 - site.added
    if (elapsed < new_during) {
        inject = inject + '<span class="badge badge-success">new</span> <a>  </a>'
    }

    inject = inject + '<i class="fas fa-edit" id="edit' + site.id + '"></i> <i class="fas fa-ban" id="ban' + site.id + '"></i>'
    
    inject = inject + '</h5>' +
        '<p class="text-muted" >' + site.description + '</p>' +
        '<p style="font-size:smaller"><strong>URI:</strong> ' + site.uri + '</p>' +
        '</div>';
    return inject

}

$(function () {

    function initPage() {
        $.ajax({
            'async': false,
            'global': false,
            'url': "./sites.json",
            'dataType': "json",
            'success': function (data) {
                newAJAX(data);
            }
        });

        var links = document.querySelectorAll('#sectors a');

        links.forEach(function (link) {
            link.addEventListener('click', clickLinkSectores);
        });

        var links2 = document.querySelectorAll('#deliveries a');

        links2.forEach(function (link) {
            link.addEventListener('click', clickLinkDelivery);
        });

        var links3 = document.querySelectorAll('#sorting a');

        links3.forEach(function (link) {
            link.addEventListener('click', clickLinkSorting);
        });

        var links4 = document.querySelectorAll('#new a');

        links4.forEach(function (link) {
            link.addEventListener('click', clickLinkNew);
        });

        var invoice_button = document.getElementById("getinvoicebutton")
        invoice_button.addEventListener('click', getInvoice);

        var check_payment_button = document.getElementById("checkpaymentbutton")
        check_payment_button.addEventListener('click', checkPayment);

    }

    function newAJAX(allSites) {
        sites = allSites // cant be deleted, only way this information be available inside ajax
        $.ajax({
            'async': false,
            'global': false,
            'url': "./storeScores.json",
            'success': function (data) {
                processAndDisplay(data);
            }
        });
    }

    function processAndDisplay(scoresAJAX) {
        scores = scoresAJAX
        scores = JSON.parse(scores)
        displayData()
    }

    initPage();
    selected_sector = getSectorFromURL()
    document.getElementById('dropdownMenuButton').textContent = "Sector: " + selected_sector;
    filtraPorSector(selected_sector, selected_delivery, selected_size, selected_new, selected_trendy);

    selected_sort = getSortMethodFromURL()
    document.getElementById('SortingDropdownButton').innerHTML = 'Sort: ' + selected_sort
    sortByScore(selected_sort)
});

function displayData() {


    var main = $('#main-content');
    var soon = $('#soon-content');
    main.empty()
    soon.empty()

    sites.forEach(function (site) {
        // banner: <span class="badge badge-success">new</span>
        var score = get_score(site.id)
        var inject = build_panel(site, score);
        if (site.flags) {
            if (site.flags['hidden'] == 1)
                return;

            if (site.flags['coming_soon'] == 1)
                soon.prepend(inject);
            return;
        }

        main.prepend(inject);
    });

}

function getSortMethodFromURL(){
    var urlNow = new URL(document.URL)
    var sortArgument = urlNow.searchParams.get('sort')
    if (sortArgument == null){
        return 'best'
    }

    if (!(sortArgument == 'best' || sortArgument == 'trending' || sortArgument == 'newest' || sortArgument == 'controversial')) {
        return 'best'
    }

    return sortArgument
}

function getSectorFromURL(){
    var urlNow = new URL(document.URL)
    var sectorArgument = urlNow.searchParams.get('sector')
    if (sectorArgument == null){
        return 'all'
    }

    if (!(sectorList.includes(sectorArgument) )) {
        return 'all'
    }

    return sectorArgument
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

function clickLinkSectores() {
    selected_sector = this.textContent;
    document.getElementById('dropdownMenuButton').textContent = "Sector: " + selected_sector;
    filtraPorSector(selected_sector, selected_delivery, selected_size, selected_new, selected_trendy);
}

function clickLinkDelivery() {
    selected_delivery = this.textContent;
    document.getElementById('DeliveryDropdownButton').textContent = "Digital goods: " + selected_delivery;
    filtraPorSector(selected_sector, selected_delivery, selected_size, selected_new, selected_trendy);
}

function clickLinkSorting() {
    selected_sort = this.textContent;
    document.getElementById('SortingDropdownButton').textContent = "Sort: " + selected_sort;
    if (selected_sort == 'best' || selected_sort == 'worst' || selected_sort == 'controversial' || selected_sort == 'newest' || selected_sort == 'trending') {
        //var t0 = performance.now();
        sortByScore(selected_sort)
        //var t1 = performance.now();
        //console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    } else {
        console.log('running sort by newest script')
        displayData()
        filtraPorSector(selected_sector, selected_delivery, selected_size, selected_new, selected_trendy)
    }
    //filtraPorSector( selected_sector, selected_delivery, selected_size, selected_new );
}

function clickLinkNew() {
    selected_newTrendy = this.textContent;
    document.getElementById('NewDropdownButton').textContent = "New: " + selected_newTrendy;
    if (selected_newTrendy.includes('new')){
        selected_new = 'yes'
    } else {
        selected_new = 'all'
    }
    
    if (selected_newTrendy.includes('trendy')){
        selected_trendy = 'yes'
    } else {
        selected_trendy = 'all'
    }

    if (selected_newTrendy == 'new or trendy'){
        selected_new = 'or'
        selected_trendy = 'or'
    }

    filtraPorSector(selected_sector, selected_delivery, selected_size, selected_new, selected_trendy);
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

function updateModal(data) {
    console.log(data)
    if ((data == 'true' || Number(data) == 'true' || data.trim() == 'true') && !open_paid_invoice_added) {
        console.log("payment received")
        document.getElementById("qrcodediv").innerHTML = '<img id="qrcode" src="https://upload.wikimedia.org/wikipedia/commons/8/8c/White_check_mark_in_dark_green_rounded_square.svg" >'
        
        if (scores[openStoreID.toString()] == null) { var upvotes = 0 } else { var upvotes = scores[openStoreID.toString()][0] }
        if (scores[openStoreID.toString()] == null) { var downvotes = 0 } else { var downvotes = scores[openStoreID.toString()][1] }
        if (openDirection == 'Upvote') {
            upvotes = upvotes + open_number_votes
        } else {
            downvotes = downvotes + open_number_votes
        }
        scores[openStoreID.toString()] = [upvotes, downvotes, Number(get_trendingScore(openStoreID))]
        //scores[openStoreID.toString()][1] = downvotes

        new_score = get_score(openStoreID)
        
        if (new_score < 0) { var score_color = 'blue' } else if (new_score > 0) { var score_color = 'red' } else { var score_color = 'black' }
        if (Math.abs(new_score) >= 1000000) { new_score = Math.round(new_score / 100000) / 10 + 'M' } else if (Math.abs(new_score) >= 1000) { new_score = Math.round(new_score / 100) / 10 + 'k' }
        document.getElementById('store' + openStoreID).innerHTML = new_score
        document.getElementById('store' + openStoreID).style.color = score_color

        
        query = "#store" + openStoreID.toString()
        var element = $(query)
        $(query).popover('dispose')
        $(query).popover(makeScoresPopover(upvotes, downvotes));

        open_paid_invoice_added = true
    } else {
        console.log("payment not received/already accounted for")
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

$(document).on('show.bs.modal', '#exampleModal', function (event) {
    var arrow = $(event.relatedTarget); // Button that triggered the modal
    openDirection = arrow.data('direction'); // Extract info from data-* attributes
    openStoreID = arrow.data('storeid')
    openPaymentID = ""
    open_paid_invoice_added = false
    openStoreName = get_site(openStoreID.toString()).name
    var modal = $(this);
    modal.find('.modal-title').text(openDirection + ' ' + openStoreName);
    document.getElementById("label1").innerHTML = 'Number of ' + openDirection.toLowerCase() + 's (1 vote = 1 satoshi):'
    modal.find('.modal-body input').val(1000);
    modal.find('.modal-body textarea').val("");
    document.getElementById("qrcodediv").innerHTML = ""
    //document.getElementById("qrcodediv").innerHTML = '<img id="qrcode" src="http://api.qrserver.com/v1/create-qr-code/?color=000000&amp;bgcolor=FFFFFF&amp;data=asd&amp;qzone=1&amp;margin=0&amp;size=400x400&amp;ecc=L" alt="qr code" />'
});

function sortByScore(method){
    var idIsComingAndScores = []


    for (var i=0; i < sites.length; i++){
        var chosenScore;
        site = sites[i]
        if (method == 'best'){
            chosenScore = get_score(site.id)
        } else if (method == 'controversial'){
            chosenScore = get_controversial_score(site.id)
        } else if (method == 'newest'){
            chosenScore = get_timestamp(site.id)
        } else if (method == 'trending'){
            chosenScore = get_trendingScore(site.id)
        }
        idIsComingAndScores.push([site.id,site.flags,chosenScore])
    }

    idIsComingAndScores = idIsComingAndScores.sort(function(a,b){return b[2] - a[2]})

    for (var i=0; i < idIsComingAndScores.length; i++){
        idIsComingAndScore = idIsComingAndScores[i]
        if (idIsComingAndScore[1] == null || idIsComingAndScore[1].size == 0){
            panel = document.getElementById('panel' + idIsComingAndScore[0])
            left_panel = document.getElementById('float-left' + idIsComingAndScore[0])
            document.getElementById('main-content').append(left_panel)
            document.getElementById('main-content').append(panel)
        } else {
            panel = document.getElementById('panel' + idIsComingAndScore[0])
            left_panel = document.getElementById('float-left' + idIsComingAndScore[0])
            document.getElementById('soon-content').append(left_panel)
            document.getElementById('soon-content').append(panel)
        }
    }
}


function get_site(storeID) {

    for (var i = 0; i < sites.length; i++) {
        if (Number(sites[i].id) == Number(storeID)) { return sites[i] }
    }
}

//$(document).on('hide.bs.modal', '#exampleModal', function (event) {
//console.log("closed modal of store " + openStoreID + "and direction " + openDirection)
//});


function makeScoresPopover(upvotes, downvotes, trendingScore) {
    document.getElementById("upvote-number").innerHTML = upvotes
    //document.getElementById("green_bar").innerHTML = upvotes

    if (upvotes+downvotes == 0) {
        width = 1
    } else {
        width = Math.max(1, Math.round(100*upvotes/(upvotes+downvotes)) )
    }
    document.getElementById("green_bar").setAttribute('style', "width:" + width + "%")
    //document.getElementById("red_bar").innerHTML = downvotes

    document.getElementById("downvote-number").innerHTML = downvotes
    if (upvotes+downvotes == 0) {
    width = 1
    } else {
    width = Math.max(1, Math.round(100*downvotes/(upvotes+downvotes)) )
    }
    document.getElementById("red_bar").setAttribute('style', "width:" + width + "%")

    document.getElementById("trending").innerHTML = trendingScore
    document.getElementById("blue_bar").setAttribute('style', "width:" + Math.max(1, Math.min(100, trendingScore)) + "%")
    var popover_content = $("#progress_bars").html()
    var settings = {
    placement: 'bottom',
    container: 'body',
    html: true,
    content: popover_content
    }
    return settings
}

function makeEditPopover(storeID){
    site = get_site(storeID)
    popover_content = '<div class="form-group"><label for="exampleFormControlTextarea1">Suggest an edit for ' + site.name + 
    ':</label> <textarea class="form-control" id="editForm' + storeID + '" rows="8" >What to change (Name, URL, ...): \nReason:</textarea></div>' + 
    '<button onclick=sendEditMail(' + storeID + ')>Send</button>'

    var settings = {
        placement: 'bottom',
        container: 'body',
        html: true,
        content: popover_content
        }
        return settings
}

function sendEditMail(storeID){
    var extractedMessage = document.getElementById("editForm" + storeID).value
    site = get_site(storeID)

    $.ajax({
        'async': false,
        'global': false,
        'url': "./suggestEdit?id=" + site.id + "&name=" + site.name + "&message=" + extractedMessage,
        'success': function () {
            $("#edit" + site.id).popover('hide')
        }
    });
}

function makeBanPopover(storeID){
    site = get_site(storeID)
    popover_content = '<div class="form-group"><label for="exampleFormControlTextarea1">Suggest to ban ' + site.name + 
    ':</label> <textarea class="form-control" id="banForm' + storeID + '" rows="8">Reason:</textarea></div>' + 
    '<button onclick=sendBanMail(' + storeID + ')>Send</button>'

    var settings = {
        placement: 'bottom',
        container: 'body',
        html: true,
        content: popover_content
        }
        return settings
}

function sendBanMail(storeID){
    var extractedMessage = document.getElementById("banForm" + storeID).value
    site = get_site(storeID)

    $.ajax({
        'async': false,
        'global': false,
        'url': "./suggestBan?id=" + site.id + "&name=" + site.name + "&message=" + extractedMessage,
        'success': function () {
            $("#ban" + site.id).popover('hide')
        }
    });
}

$(document).ready(function(){

    // build popover with additional score information
    for (var i = 0; i < sites.length; i++){
        storeId = sites[i].id
        query = "#store" + storeId
        if (scores[storeId] == null) { var upvotes = 0 } else { var upvotes = scores[storeId][0] }
        if (scores[storeId] == null) { var downvotes = 0 } else { var downvotes = scores[storeId][1] }
        if (scores[storeId] == null) { var trendingScore = 0 } else { var trendingScore = scores[storeId][2] }
        
        $(query).popover(makeScoresPopover(upvotes, downvotes, trendingScore));
    }
    //add event listners to suggest an edit
    for (var i = 0; i < sites.length; i++){
        storeId = sites[i].id
        query = "#edit" + storeId

        $(query).popover(makeEditPopover(storeId));
    }


    //add event listners to report a store
    for (var i = 0; i < sites.length; i++){
        storeId = sites[i].id
        query = "#ban" + storeId

        $(query).popover(makeBanPopover(storeId));
    }


})
