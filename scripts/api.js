
window.generateInvoiceApi = function(){
	var InvoiceApi = {};
	var accessToken = 'jcrawleyIsAwesome';
	var url = 'http://api.invoiceasap.com?accesstoken=' + accessToken;

	var doneFn = function(res){
		return res;
	}

	InvoiceApi.getNotes = function(customerId,invoiceId){
		return $.get(url, {
			action: 'GetCustomerNotes',
			customerguid: customerId,
			invoiceguid: invoiceId
		});
	}

	InvoiceApi.getCustomers = function(customerIds,excludeInactive){
		return $.get(url, {
			action: 'GetCustomers',
			customerguids: customerIds,
			excludeinactive: excludeInactive
		});
	}
	return InvoiceApi;

}