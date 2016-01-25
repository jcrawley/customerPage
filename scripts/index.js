$(document).ready(function(){
    InvoiceApi = window.generateInvoiceApi();

    var companyName;
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
			companyName = response.customers[0].companyname;
			$('#company-name').text(companyName);
			$('#company-select').append('<option value =\'' + companyName + '\'>' +
				companyName + '</option>');
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
			generateDocumentStats(response.customer_document_stats);
		});

    InvoiceApi.getNotes(custId)
    .then()
    .fail(function(){
			var response = _JSONResponses.getCustomerNotes;
			generateNotes(response.customer_notes);
		});

    $('#customer-notes-body').click(function(event){
    	console.log(event.target.id);
    	if(event.target.classList.contains('delete-icon')){
    		var id = event.target.parentElement.parentNode.parentNode.id;
    		if(event.target.parentElement && event.target.parentElement.parentNode && event.target.parentElement.parentNode.parentNode){
    			$(event.target.parentElement.parentNode.parentNode).css('display', 'none');
    			InvoiceApi.deleteNote(id);
    		}
    	}
    });

    $('#plus-add-note').click(function(){
    	$('#add-note-body').css('display','block');
    	$('#customer-notes-body').css('display','none');
    	var date = new Date();
    	$('#add-note-body .label.timestamp').text(formatTime(date.toISOString()));
    });

    $('#add-note-button').click(function(){
    	if(!$('#add-note-area').val()){
    		alert('Please give your note a body');
    	}
    	else{
    		InvoiceApi.addNote(custId, 1,$('#add-note-area').val())
    		.then()
    		.fail(function(){
    			var response = _JSONResponses.addCustomerNote;
    			var note = createNote(response.customer_note);
    			$('#customer-notes-body').prepend(note);
    			$('#add-note-body').css('display','none');
    			$('#customer-notes-body').css('display','block');
    		})
    	}
    });
    $('#jobs-title').click(function(){
    	$('#jobs-table').css('display', 'block');
    	$('#contact-table').css('display', 'none');
    	$('#contacts-title').toggleClass('label');
    	$('#jobs-title').toggleClass('label');
    });
    $('#contacts-title').click(function(){
    	$('#jobs-table').css('display', 'none');
    	$('#contact-table').css('display', 'block');
    	$('#contacts-title').toggleClass('label');
    	$('#jobs-title').toggleClass('label');
    });
    $('.date-wrapper').click(function(){
    	$(".change-date-display").toggleClass('none');
    });
    $('#change-date').click(function(){
    	var startDiv = $('#start-date-input');
    	var endDiv = $('#end-date-input');
    	if(!startDiv.val() || !endDiv.val()){
    		alert("Please enter a start and end date");
    	}
    	else{
    		var start = new Date(startDiv.val());
    		var end = new Date(endDiv.val());
    		if(end > start){
    			$('#start-date').text(startDiv.val());
    			$('#end-date').text(endDiv.val());
    			InvoiceApi.getCustomerDocumentStats(custId, 
    				{
    					startdate: formatTime(start.toISOString()),
    					enddate: formatTime(end.toISOString())
    				})
    			.then()
    			.fail(function(){
    				var response = _JSONResponses.getCustomerDocumentStats;
					generateDocumentStats(response.customer_document_stats);
					$(".change-date-display").toggleClass('none');
    			});
    		}
    		else{
    			alert('Your start date must be before your end date!');
    		}
    	}


    });
    function formatTime(date){
    	var arr = date.split('T');
    	arr[1] = arr[1].split('.');
    	return arr[0] + ' ' + arr[1][0];
    }

    function createNote(element){
    	var note = $('<div class="note" id="' + element.id + '"></div>');
		var description = $('<div class="description"></div>');
		var date = $('<div class="date"></div>').text(element.modifiedon);
		var info = $('<div class="info"></div>');
		var custNameDiv = $('<div></div>').text('Job/Location ' + element.customer.companyname);
		var createdByDiv = $('<div></div>').text('Created By: ' + element.user.firstname + ' ' + element.user.lastname);
		var invoiceDiv;
		if(element.invoice){
			var invoiceDiv = $('<div></div>').text('Invoice: ' + element.invoice.number);
		}
		var commentDiv = $("<div class='comment'></div>").text(element.note);
		info.append(date, custNameDiv,createdByDiv,invoiceDiv);
		description.append(info, generateNoteIcons());
		note.append(description, commentDiv);
		return note
    }

    function generateNotes(notes){
		notes.forEach(function(element){
			$('#customer-notes-body').append(createNote(element));
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
		setUpJobs(customer);
		setUpContacts(customer);
	}

	function setUpJobs(customer){
		customer.jobs.forEach(function(element){
			var wrapperDiv = $('<div></div>');
			var nameDiv = $('<div class="name">' + element.companyname + '</div>');
			var addressDiv = $('<div class="address">' + getAddress(element.contacts[0].shippingaddress[0]) + '</div>');
			var buttons = generateContactIcons(element.contacts[0].shippingaddress[0].city);
			wrapperDiv.append(buttons, nameDiv, addressDiv);
			$('#jobs-table').append(wrapperDiv);
		});
	}

	function getAddress(addr){
		var keys = Object.keys(addr);
		var line1 = '';
		var line2 = '';
		keys.forEach(function(element){
			if(element.indexOf('addr') > -1){
				line1 += addr[element] + ' ';
			}
			else{
				line2 += addr[element] + ' ';
			}
		});
		return (line1 + '<br>' + line2);
	}

	function setUpContacts(customer){
		customer.contacts.forEach(function(element){
			var wrapperDiv = $('<div></div>');
			var nameDiv = $('<div class="name">' + element.contactname + '</div>');
			var addressDiv = $('<div class="address">' + element.email + '</div>');
			var buttons = generateContactIcons(element.email);
			wrapperDiv.append(buttons, nameDiv, addressDiv);
			$('#contact-table').append(wrapperDiv);
		});
	}

	function generateContactIcons(noEmail){
		if(noEmail){
			return $('<div class="action"><span class="edit-icon icon"></span> <span class="mail-icon icon"></span></div>');
		}
		return $('<div class="action"><span class="edit-icon icon"></span></div>');
	}

	function generateDocumentStats(stats){
		$('#invoices-unpaid').text(parseFloat(stats.sum_balance_due).toLocaleString());
		$('#invoices-paid').text(parseFloat(stats.sum_payments).toLocaleString());
		$('#invoices-paid').css('color', 'green')
		$('#estimates-open').text(parseFloat(stats.sum_open_estimates).toLocaleString());
		$('#estimates-approved').text(parseFloat(stats.sum_approved_estimates).toLocaleString());
		$('#sales-orders').text(parseFloat(stats.sum_sales_orders).toLocaleString());
		$('#sales-receipts').text(parseFloat(stats.sum_sales_receipts).toLocaleString());
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
