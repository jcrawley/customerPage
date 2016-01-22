$(document).ready(function(){
    InvoiceApi = window.generateInvoiceApi();

    var custId = 'eb627abe-2735-11e4-ae4f-025ae7f06885';

    /* All my API promises have empty success functions because 
    * it will fail everytime because it is not calling a real API.
    * With a real api, the success function would look the same as
    * the fail just without setting the response to a constant
    */



    InvoiceApi.getCustomers([custId], true)
    .then()
    .fail(function(){
			var response = _JSONResponses.getCustomers;
			setUpCustomer(response.customers[0]);
		});

    InvoiceApi.getCustomerStats(custId)
    .then()
    .fail(function(){
			var response = _JSONResponses.getCustomerStats;
			generateInvoiceTable(response.customer_stats);
		});

    InvoiceApi.getCustomerDocumentStats(custId)
    .then()
    .fail(function(){
			var response = _JSONResponses.getCustomerDocumentStats;
			// generateInvoiceTable(response.customer_stats);
		});

    InvoiceApi.getNotes(custId)
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

		customer.jobs.forEach(function(element){
			var wrapperDiv = $('<div></div>');
			var buttons = $('<div class="action"><span class="edit-icon icon"></span> <span class="mail-icon icon"></span></div>');
			var nameDiv = $('<div class="name">' + element.companyname + '</div>');
			var addressDiv = $('<div class="address">' + element.contactname + '</div>');
			wrapperDiv.append(buttons, nameDiv, addressDiv);
			$('#jobs-table').append(wrapperDiv);
		});
	}

	var statsLib = {
		"current": {
			label: 'Current Invoices',
			background: 'rgba(0,255,0,.4)',
		},
		"past_due_30": {
			label: '0-30 Days Late',
			background: 'rgba(255,255,0,.4)',
		},
		"past_due_60": {
			label: '31-60 Days Late',
			background: 'rgba(255,165,0,.4)',
		},
		"past_due_60_plus": {
			label: '61+ Days Late',
			background: 'rgba(255,0,0,.4)',
		},

	}
	function generateInvoiceTable(stats){
		var keys = Object.keys(stats.aging);
		$('#total-balance').text(
			'$' + parseFloat(stats.balance).toLocaleString('en')
		);
		keys.forEach(function(element){
			var labelDiv = $("<div class ='row-label'>" + statsLib[element].label + "</div>");
			var numSpan = $("<div class ='row-num'>" + stats.aging[element].count + "</div>");
			var balanceSpan = $("<span class ='row-balance'> $" + parseFloat(stats.aging[element].balance).toLocaleString('en') + "</span>");
			numSpan.css('backgroundColor', statsLib[element].background);
			var invoiceRow = $("<div class='invoice-row'></div>").append(labelDiv, numSpan, balanceSpan);
			$("#invoice-table").append(invoiceRow);
		})
	}
});
