$(function(){

    function initPage() {
            $.ajax({
                'async': false,
                'global': false,
                'url': "./services.json",
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
            var inject = "<tr>><th><a href='" + entry.link + "'>" + entry.entity + "</a></th>" + "<th>" + entry.description + "</th>";

            inject = inject + "</tr>";
            main.prepend(inject);
            })
       }

    initPage();

});