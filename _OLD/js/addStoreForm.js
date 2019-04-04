
document.addEventListener( 'DOMContentLoaded', init );

function init(){
	var form = document.getElementById( 'formTeste');

	form.addEventListener('submit', function(e) {

		e.preventDefault();
        //e.stopImmediatePropagation()

		var formData = new FormData( this );
		queryString = new URLSearchParams(formData).toString();
		console.log( 'Query String:', queryString );

        queryStringSplit = queryString.split('&')
		if (queryStringSplit[queryStringSplit.length - 1].split('=')[1]==""){
		    console.log('captcha not filled')
		    return
		} else {
        //document.getElementById("formAnswer").innerHTML = "Loading..."

//        form = document.getElementById( 'formTeste');
//        form.preventDefault();

		$.ajax({
            'async': false,
            'global': false,
            'url': "/addStore" + "?" + queryString,
            'success': function (data) {
                processCaptchaAnswer(data);
            }
        });

		}

		function processCaptchaAnswer(answer) {
            answer = answer.split('=')
            document.getElementById("formAnswer").innerHTML = answer[0]

            // hack: if answer has an '=' it means it's sending an invoice
            if (answer.length > 1){

                newStorepaymentID = answer[2]
                document.getElementById('invoiceareaForStore').style.display = "block"
                document.getElementById('invoiceareaForStore').innerHTML = answer[1]
                document.getElementById('qrcodeAddStore').src = "http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=" + answer[1] + "&qzone=1&margin=0&size=400x400&ecc=L"
                document.getElementById('qrcodeAddStore').style.display = "block"
                // https://upload.wikimedia.org/wikipedia/commons/8/8c/White_check_mark_in_dark_green_rounded_square.svg

                // create final button
                document.getElementById('finalButtonFormModal').onclick = checkPaymentNewStore;
                document.getElementById('finalButtonFormModal').innerHTML = 'Check payment'
                document.getElementById('finalButtonFormModal').style.display = "block"
        } else if(answer[0].includes('successfully added')){
            // create final button
            document.getElementById('finalButtonFormModal').onclick = redirect;
            document.getElementById('finalButtonFormModal').innerHTML = 'Refresh'
            document.getElementById('finalButtonFormModal').style.display = "block"
        }
	  }

	});
}


function redirect(){
window.location="/"
}

function checkPaymentNewStore() {
    $.ajax({
        'async': false,
        'global': false,
        'url': "./check_payment?id=" + newStorepaymentID,
        'success': function (data) {
            updateModalNewStore(data);
        }
    });
}

function updateModalNewStore(data){
console.log('checking payment...')
    if (data == 'true' || Number(data) == 'true' || data.trim() == 'true'){
        // create final button
        document.getElementById('finalButtonFormModal').onclick = redirect;
        document.getElementById('finalButtonFormModal').innerHTML = 'Refresh'
        document.getElementById('finalButtonFormModal').style.display = "block"
        document.getElementById('qrcodeAddStore').src = 'https://upload.wikimedia.org/wikipedia/commons/8/8c/White_check_mark_in_dark_green_rounded_square.svg'
        document.getElementById("formAnswer").innerHTML = 'Store successfully added. Refresh page and sort by newest to see it'
    }
}