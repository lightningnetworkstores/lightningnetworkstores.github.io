$(function(){

    function initPage() {
            $.ajax({
                'async': false,
                'global': false,
                'url': "./sitesTestnet.json",
                'dataType': "json",
                'success': function (data) {
                    displayData(data);
                }
            });
    }

    function displayData(data){
        var main = $('#mainTestnet-content');

        for(var i in data){
            var d = data[i];

            var inject =
                '<div class="panel">' +
                    '<h3>'+d.name+'</h3>' +
                    '<p class="text-muted">'+d.description+'</p>' +
                    '<p><strong>URI:</strong> '+d.uri+'</p>' +
                    '<a href="'+d.href+'">Click Here to Visit</a>' +
                '</div>' +
                '<hr>';
            if(d.flags){
                if(d.flags['hidden'] == 1)
                    continue;

            }

            main.append(inject);
        }
    }

    initPage();
});