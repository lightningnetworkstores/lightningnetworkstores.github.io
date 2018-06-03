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

            if (entry.release){
            inject = inject + "<th>" + entry.release + "</th>"
            } else {
            inject = inject + "<th>comming soon</th>";
            }

            if (entry.android || entry.iOS){
            if (entry.android){inject = inject + "<th><a href='" + entry.android + " '>android </a></th>"}
            if (entry.iOS){inject = inject + "<th><a href='" + entry.iOS + " '>iOS</a></th>"}
            } else {
            inject = inject + "<th>-</th>";
            }

            if (entry.android_testnet || entry.iOS_testnet || entry.iOS_testnet_closed || entry.iOS_testnet_closed){
            inject = inject + "<th>"
            if (entry.android_testnet){inject = inject + "<a href='" + entry.android_testnet + " '>android </a>"}
            if (entry.iOS_testnet){inject = inject + "<a href='" + entry.iOS_testnet + " '>iOS</a></th>"}
            if (entry.android_testnet_closed){inject = inject + "<a href='" + entry.android_testnet_closed + " '>android closed-beta  </a>"}
            if (entry.iOS_testnet_closed){inject = inject + "<a href='" + entry.iOS_testnet_closed + " '>iOS closed_beta</a>"}
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