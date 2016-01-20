$(document).ready(function(){
    InvoiceApi = window.generateInvoiceApi();

    InvoiceApi.getNotes('eb627abe-2735-11e4-ae4f-025ae7f06885')
    .promise().then(function(data){
    	console.log(data);
    })
});