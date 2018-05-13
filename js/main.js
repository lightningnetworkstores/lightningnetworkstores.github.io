var sites;
var selected_sector = "all";
var selected_delivery = "all";
var selected_size = "big";
var selected_new = "all";
// website is considered new if added in less than this number of seconds (one week)
var new_during = 7*24*60*60;

function filtraPorSector( sector,delivery, size, newQ )
{
	
    sector = sector.toLowerCase();
	delivery = delivery.toLowerCase();
	size = size.toLowerCase();
	newQ = newQ.toLowerCase();
	
    var  panels = document.querySelectorAll( '#main-content .panel');
	var  panels_commingSoon = document.querySelectorAll( '#soon-content .panel');
    var nrFlags = 0;

    panels = Array.from( panels );
    panels.reverse();

    sites.forEach ( function(site, idx){
		
        if( site.flags) {
            nrFlags++;
			panels_commingSoon[nrFlags - 1].style.display = "block";
		} else {
			panels[idx - nrFlags ].style.display = "block";
        }
		
        
        
		// default size
		if (!(site.size)) {
			site.size = "big";
		}
		
		// default added time is 1st of March 2018
		if (!(site.added)) {
			site.added = 1519862400;
		}
		elapsed = Date.now()/1000 - site.added
		// check if within time interval
		within = (newQ == 'yes' && elapsed < new_during) || (newQ == 'no' && elapsed > new_during) 
		
        if( ((sector != 'all') && (site.sector != sector)) || ((delivery != 'all') && (site.digital_goods != delivery)) || ((size != 'all') && (site.size != size)) || ((newQ != 'all') && !within) )
        {
			if (site.flags){
				panels_commingSoon[nrFlags-1].style.display = "none";
			} else {
				// hide
				panels[idx - nrFlags].style.display = "none";
			}
        }

    });
	
}

function build_pannel(site){
	var inject = '<div class="panel">' +
				'<h5> <a href="'+site.href+'">'+site.name+'   </a>'
	
	if (!(site.added)) {
			site.added = 1519862400;
		}
	elapsed = Date.now()/1000 - site.added
	if (elapsed < new_during){
		inject = inject + '<span class="badge badge-success">new</span>'
	}
	
	if (site.popular && site.popular == "yes"){
		inject = inject + ' '+'<span class="badge badge-info">popular</span>'
	}
	
	inject = inject + '</h5>' +
				'<p class="text-muted">'+site.description+'</p>' +
				'<p><strong>URI:</strong> '+site.uri+'</p>' +
				'</div>';
	return inject
	
}

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

            var links = document.querySelectorAll('#sectors a');

            links.forEach( function(link){ 
                link.addEventListener('click', clickLinkSectores);
            });
			
			
			var links2 = document.querySelectorAll('#deliveries a');

            links2.forEach( function(link){ 
                link.addEventListener('click', clickLinkDelivery);
            });
			
			var links3 = document.querySelectorAll('#sizes a');

            links3.forEach( function(link){ 
                link.addEventListener('click', clickLinkSizes);
            });
			
			var links4 = document.querySelectorAll('#new a');

            links4.forEach( function(link){ 
                link.addEventListener('click', clickLinkNew);
            });
            
    }

    function displayData(data){

        sites = data;

        var main = $('#main-content');
        var soon = $('#soon-content');
	
        sites.forEach ( function(site){
			// banner: <span class="badge badge-success">new</span>
            var inject = build_pannel(site);
            if(site.flags){
                if(site.flags['hidden'] == 1)
                    return;

                if(site.flags['coming_soon'] == 1)
                    soon.append(inject);
                return;
            }

            main.prepend(inject);

        });    
                    
    }

    initPage();
	filtraPorSector(selected_sector, selected_delivery, selected_size, selected_new );
});

function clickLinkSectores()
{	
	selected_sector = this.textContent;
    document.getElementById('dropdownMenuButton').textContent = "Sector: " + selected_sector;
    filtraPorSector( selected_sector ,selected_delivery, selected_size, selected_new);
}

function clickLinkDelivery()
{
	selected_delivery = this.textContent;
    document.getElementById('DeliveryDropdownButton').textContent = "Digital goods: " + selected_delivery;
    filtraPorSector( selected_sector, selected_delivery, selected_size, selected_new );
}

function clickLinkSizes()
{
	selected_size = this.textContent;
    document.getElementById('SizeDropdownButton').textContent = "Size: " + selected_size;
    filtraPorSector( selected_sector, selected_delivery, selected_size, selected_new );
}

function clickLinkNew()
{
	selected_new = this.textContent;
    document.getElementById('NewDropdownButton').textContent = "New: " + selected_new;
    filtraPorSector( selected_sector, selected_delivery, selected_size, selected_new );
}
