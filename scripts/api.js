
window.generateInvoiceApi = function(){
	var InvoiceApi = {};
	var accessToken = 'jcrawleyIsAwesome';
	var url = 'http://api.invoiceasap.com'

	var doneFn = function(res){
		return res;
	}

	InvoiceApi.getNotes = function(customerId,invoiceId){
		return $.get(url, {
			action: 'GetCustomerNotes',
			customerguid: customerId,
			invoiceguid: invoiceId
		}).done(doneFn)
		.fail(function(){
			return _JSONResponses.getCustomerNotes;
		});
	}
	return InvoiceApi;

}