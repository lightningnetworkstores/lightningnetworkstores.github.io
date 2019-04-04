$(function(){

    function initPage() {
            $.ajax({
                'async': false,
                'global': false,
                'url': "./wallets.json",
                'dataType': "json",
                'success': function (data) {
                    displayData(data);
                }
            });
    }

    function displayData(data){

        sites = data;

        var main = $('#wallet-table');

        sites.forEach (
        function(entry){
            var inject = "<tr>><th><a href='" + entry.page + "'>" + entry.name + "</a></th>";

            if (entry.open_source){
            inject = inject + "<th><a href='" + entry.open_source + " '>" + "yes" + "</a></th>";
            } else {
            inject = inject + "<th>no</th>";
            }

            if (entry.requires_node){
            inject = inject + "<th>" + entry.requires_node + "</th>"
            } else {
            inject = inject + "<th>no</th>";
            }
            
            if (entry.custodial){
                inject = inject + "<th>" + entry.custodial + "</th>"
            } else {
                inject = inject + '<th>false</th>'
            }
            
            if (entry.release){
            inject = inject + "<th>" + entry.release + "</th>"
            } else {
            inject = inject + "<th>coming soon</th>";
            }

            if (entry.web_wallet){
                inject = inject + "<th><a href='" + entry.web_wallet + "'</a>yes</th>"
            } else {
                inject = inject + "<th>no</th>"
            }


            if (entry.android || entry.iOS || entry.android_closed || entry.iOS_closed){
                inject= inject + "<th>"
                if (entry.android){inject = inject + "<a href='" + entry.android + " '>android </a>"}
                if (entry.iOS){inject = inject + "<a href='" + entry.iOS + " '>iOS </a>"}
                if (entry.android_closed){inject = inject + "<a href='" + entry.android_closed + " '>android closed-beta </a>"}
                if (entry.iOS_closed){inject = inject + "<a href='" + entry.iOS_closed + " '>iOS closed-beta</a>"}
                inject = inject + "</th>"
                } else {
                inject = inject + "<th>-</th>";
            }

            if (entry.android_testnet || entry.iOS_testnet || entry.iOS_testnet_closed || entry.iOS_testnet_closed){
            inject = inject + "<th>"
            if (entry.android_testnet){inject = inject + "<a href='" + entry.android_testnet + " '>android </a>"}
            if (entry.iOS_testnet){inject = inject + "<a href='" + entry.iOS_testnet + " '>iOS</a></th>"}
            if (entry.android_testnet_closed){inject = inject + "<a href='" + entry.android_testnet_closed + " '>android closed-beta  </a>"}
            if (entry.iOS_testnet_closed){inject = inject + "<a href='" + entry.iOS_testnet_closed + " '>iOS closed-beta</a>"}
            inject = inject + "</th>"
            } else {
            inject = inject + "<th>-</th>";
            }


            inject = inject + "</tr>";
            main.append(inject);

            })
       }

    initPage();

});
