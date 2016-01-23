
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
	InvoiceApi.deleteNote = function(id){
		return $.post(url, {
			action: 'DeleteCustomerNote',
			id: id
		});
	}
	InvoiceApi.addNote = function(cid, uid, note, invoiceguid){
		return $.post(url, {
			action: 'AddCustomerNote',
			customerguid: cid,
			userguid: uid,
			invoiceguid: invoiceguid,
			note : note
		});
	}
	InvoiceApi.getCustomers = function(customerIds,excludeInactive){
		return $.get(url, {
			action: 'GetCustomers',
			customerguids: customerIds,
			excludeinactive: excludeInactive
		});
	}
	InvoiceApi.getCustomerStats = function(customerId,options){
		return $.get(url, {
			action: 'GetCustomerStats',
			customerguid: customerId,
			startdate: options ? options.startdate : {},
			enddate: options? options.startdate : {}
		});
	}
	InvoiceApi.getCustomerDocumentStats = function(customerId,options){
		return $.get(url, {
			action: 'GetCustomerDocumentStats',
			customerguid: customerId,
			startdate: options ? options.startdate : {},
			enddate: options? options.startdate : {}
		});
	}
	return InvoiceApi;

}