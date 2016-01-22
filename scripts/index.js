$(document).ready(function(){
    InvoiceApi = window.generateInvoiceApi();

    InvoiceApi.getCustomers(['eb627abe-2735-11e4-ae4f-025ae7f06885'], true)
    .then()
    .fail(function(){
			var response = _JSONResponses.getCustomers;
			setUpCustomer(response.customers[0]);
		});

    InvoiceApi.getNotes('eb627abe-2735-11e4-ae4f-025ae7f06885')
    .then()
    .fail(function(){
			var response = _JSONResponses.getCustomerNotes;
			generateNotes(response.customer_notes);
		});

    function generateNotes(notes){
		notes.forEach(function(element){
			var note = $('<div class="note"></div>');
			var description = $('<div class="description"></div>');
			var info = $('<div class="info"></div>');
			var custNameDiv = $('<div></div>').text('Job/Location ' + element.customer.companyname);
			var createdByDiv = $('<div></div>').text('Created By: ' + element.user.firstname + ' ' + element.user.lastname);
			var invoiceDiv;
			if(element.invoice){
				var invoiceDiv = $('<div></div>').text('Invoice: ' + element.invoice.number);
			}
			var commentDiv = $("<div class='comment'></div>").text(element.note);
			info.append(custNameDiv,createdByDiv,invoiceDiv);
			description.append(info, generateNoteIcons());
			note.append(description, commentDiv);
			$('#customer-notes-body').append(note);
			console.log(custNameDiv);
		});
	}

	function generateNoteIcons(){
		return ($('<div class="note-icons">' + 
		   			'<span class="view-document icon"></span>' + 
		   			'<span class="delete-icon icon"></span>' +
		   			'</div>'));
	}
	function setUpCustomer(customer){
		$('#contact-name').html(customer.contactname);
		$('#customer-phone').html(customer.phone);
		$('#customer-mobile').html(customer.mobile);
		$('#customer-mail').html('<span class="mail-icon icon"></span>' + customer.email);
	}
});
