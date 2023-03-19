/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define([ 'N/search', 'N/email' ],

function(search, email) {

	/**
	 * Marks the beginning of the Map/Reduce process and generates input data.
	 *
	 * @typedef {Object} ObjectRef
	 * @property {number} id - Internal ID of the record instance
	 * @property {string} type - Record type id
	 *
	 * @return {Array|Object|Search|RecordRef} inputSummary
	 * @since 2015.1
	 */
	function getInputData() {
		try {

			var openInvoicelist = [];
			var invoiceSearchObj = search.create({
				type : "invoice",
				filters : [ [ "type", "anyof", "CustInvc" ], "AND",
						[ "mainline", "is", "T" ], "AND",
						[ "name", "anyof", "25802" ], "AND",
						[ "status", "anyof", "CustInvc:A" ] ],
				columns : [ search.createColumn({
					name : "tranid",
					label : "Document Number"
				}), search.createColumn({
					name : "entity",
					label : "Name"
				}), search.createColumn({
					name : "amountpaid",
					label : "Amount Paid"
				}), search.createColumn({
					name : "amount",
					label : "Amount"
				}), search.createColumn({
					name : "email",
					label : "Email"
				}) ]
			});
			var searchResultCount = invoiceSearchObj.runPaged().count;
			log.debug("invoiceSearchObj result count", searchResultCount);

			var custName;
			var custTrainid;
			var custAmount;
			var custEmail;

			invoiceSearchObj.run().each(function(result) {
				// .run().each has a limit of 4,000 results
				custName = result.getValue('entity');
				log.debug('custName', custName);
				custTrainid = result.getValue('tranid');
				log.debug('custTrainid', custTrainid);
			
				custAmount = result.getValue('amount');
				log.debug('custAmount', custAmount);
				custEmail = result.getValue('email');
				log.debug('custEmail', custEmail);

				// pushing a get value as a array in form of JSON value(key value pair)
				openInvoicelist.push({
					'custName' : custName,
					'custTrainid' : custTrainid,
					'custAmount' : custAmount,
					'custEmail' : custEmail
				});
				return true;
			});
			log.debug('openInvoicelist', openInvoicelist);
			log.debug('getInputData was closed here');
			return openInvoicelist;

		} catch (e) {
			log.error('Error in getInputData : ', e);
		}

	}

	/**
	 * Executes when the map entry point is triggered and applies to each key/value pair.
	 *
	 * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
	 * @since 2015.1
	 */
	function map(context) {
		try {
			log.debug('map function is started  ');

			var invoiceValue = JSON.parse(context.value);
			log.debug('invoiceValue', invoiceValue);

			var m_custName = invoiceValue.custName;
			log.debug('m_custName', m_custName);
			var m_custTrainid = invoiceValue.custTrainid;
			log.debug('m_custTrainid', m_custTrainid);
			var m_custAmount = invoiceValue.custAmount;
			log.debug('m_custAmount', m_custAmount);
			var m_custEmail = invoiceValue.custEmail;
			log.debug('m_custEmail', m_custEmail);

		
			context.write({
				key : m_custTrainid,
				value : {
					'm_custName' : m_custName,
					'm_custTrainid' : m_custTrainid,
					'm_custAmount' : m_custAmount,
					'm_custEmail' : m_custEmail

				}
			});

		} catch (e) {
			log.error('Error in map : ', e);
		}

	}

	/**
	 * Executes when the reduce entry point is triggered and applies to each group.
	 *
	 * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
	 * @since 2015.1
	 */
	function reduce(context) {
		try {
			log.debug('In reduce Stage');
			log.debug('key :', context.key);
			log.debug('value:', context.values);
			log.debug('value Length:', context.values.length);

			// storing value and value length in new variable//			
			var value = context.values;
			var value_Length = context.values.length;

			var r_custName;
			var r_custTrainid;
			var r_custAmount;
			var r_custEmail;
			for (i = 0; i < value_Length; i++) {
				var invoiceValue = JSON.parse(value[i]);
				log.debug('invoiceValue', invoiceValue);

				r_custName = invoiceValue.m_custName;
				log.debug('r_custName', r_custName);
				r_custTrainid = invoiceValue.m_custTrainid;
				log.debug('r_custTrainid', r_custTrainid);
				r_custAmount = invoiceValue.m_custAmount;
				log.debug('r_custAmount', r_custAmount);
				r_custEmail = invoiceValue.m_custEmail;
				log.debug('r_custEmail', r_custEmail);

				var currentUser = 25661;
				log.debug('currentUser', currentUser);

				var emailBody = 'Hello!,' + '\r\n'
						+ 'Please pay your remaining amount before deadline, Your Remaning amount to pay is: ' + r_custAmount
				'please create a full payment to avoid extra charges on you'
						+ '\r\n' + 'Thanks,Admin';
				var emailsubject='Warning mail for your due amount.';

				email.send({
					author : currentUser,
					recipients : r_custEmail,
					subject : emailsubject,
					body : emailBody
				});
				log.debug('Email is sent');

			};

		} catch (e) {
			log.error('Error in reduce : ', e);
		}

	}

	/**
	 * Executes when the summarize entry point is triggered and applies to the result set.
	 *
	 * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
	 * @since 2015.1
	 */
	function summarize(summary) {
		try {

		} catch (e) {
			log.error('Error in summarize : ', e);
		}

	}

	return {
		getInputData : getInputData,
		map : map,
		reduce : reduce,
		summarize : summarize
	};

});
