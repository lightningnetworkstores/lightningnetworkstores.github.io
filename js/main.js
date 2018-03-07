
$(function(){

    function initPage() {
            $.ajax({
                'async': false,
                'global': false,
                'url': "./sites.json",
                'dataType': "json",
                'success': function (data) {
                    displayData(data);
                }
            });
    }

    function displayData(data){
        var main = $('#main-content');
        var soon = $('#soon-content');

        for(var i in data){
            var d = data[i];

            var inject =
                '<div class="panel">' +
                    '<h3> <a href="'+d.href+'">'+d.name+'</a></h3>' +
                    '<p class="text-muted">'+d.description+'</p>' +
                    '<p><strong>URI:</strong> '+d.uri+'</p>' +
                '</div>' +
                '<hr>';
            if(d.flags){
                if(d.flags['hidden'] == 1)
                    continue;

                if(d.flags['coming_soon'] == 1)
                    soon.append(inject);
                continue;

            }

            main.append(inject);
        }
    }

    initPage();
});
