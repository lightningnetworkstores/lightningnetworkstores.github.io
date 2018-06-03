$(function(){

    function initPage() {
            $.ajax({
                'async': false,
                'global': false,
                'url': "./donationAdresses.json",
                'dataType': "json",
                'success': function (data) {
                    displayData(data);
                }
            });
    }

    function displayData(data){

        sites = data;

        var main = $('#donation-table');

        sites.forEach (
        function(entry){
            var inject = "<tr>><th>" + entry.entity + "</th>" + "<th>" + entry.contributions + "</th>";
            if (entry.lightning){
            inject = inject + "<th><a href='" + entry.lightning + " '>" + "link" + "</a></th>";
            } else {
            inject = inject + "<th>-</th>";
            }

            if (entry.address){
            inject = inject + "<th><a href='" + 'https://www.smartbit.com.au/address/' + entry.address + " '>" + entry.address + "</a>" + " - (" +
             "<a href='" + entry.address_proof + "'>proof</a>" + ")" + "</th>"
            } else {
            inject = inject + "<th>-</th>";
            }

            if (entry.reddit){
            inject = inject + "<th><a href='" + 'https://www.reddit.com/user/' + entry.reddit + " '>" + entry.reddit + "</a></th>"
            } else {
            inject = inject + "<th>-</th>";
            }

            if (entry.twitter){
            inject = inject + "<th><a href='" + 'https://twitter.com/' + entry.twitter + " '>" + entry.twitter + "</a></th>"
            } else {
            inject = inject + "<th>-</th>";
            }

            inject = inject + "</tr>";
            main.prepend(inject);
            })
       }

    initPage();

});