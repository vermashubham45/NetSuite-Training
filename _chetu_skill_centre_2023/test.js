/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(
		[ 'N/file', 'N/record', 'N/runtime', 'N/search' ],

		function(file, record, runtime, search) {
   
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
    		
    		var openInvoiceList = [];
    		var invoiceSearchObj = search.create({
    			   type: "invoice",
    			   filters:
    			   [
    			      ["type","anyof","CustInvc"], 
    			      "AND", 
    			      ["name","anyof","25802"], 
    			      "AND", 
    			      ["mainline","is","F"], 
    			      "AND", 
    			      ["status","anyof","CustInvc:A"], 
    			      "AND", 
    			      ["duedate","within","3/10/2023","3/20/2023"], 
    			      "AND", 
    			      ["cogs","is","F"], 
    			      "AND", 
    			      ["taxline","is","F"]
    			   ],
    			   columns:
    			   [
    			      search.createColumn({name: "tranid", label: "Document Number"}),
    			      search.createColumn({name: "entity", label: "Name"}),
    			      search.createColumn({name: "amount", label: "Amount"}),
    			      search.createColumn({name: "amountpaid", label: "Amount Paid"}),
    			      search.createColumn({name: "email", label: "Email"})
    			   ]
    			});
    			var searchResultCount = invoiceSearchObj.runPaged().count;
    			log.debug("invoiceSearchObj result count",searchResultCount);
    			var custEmail;
				var custTranid;
				var amountPaid;
				var custName;
				var invAmount;
    			invoiceSearchObj.run().each(function(result){
    			   // .run().each has a limit of 4,000 results
    				custTranid = result.getValue('tranid');
					log.debug("custTranid", custTranid);
					amountPaid = result.getValue('amountpaid');
					log.debug('amountPaid',amountPaid);
					custName = result.getValue('entity');
					log.debug("custName", custName);
					invAmount = result.getValue('amount');
					log.debug("invAmount", invAmount);
					custEmail = result.getValue('email');
					log.debug("custEmail", custEmail);

					openInvoiceList.push({

						'custTranid' : custTranid,
						'amountPaid' : amountPaid,
						'custName' : custName,
						'invAmount' : invAmount,
						'custEmail' : custEmail

					});

    			   return true;
    			});
    			log.debug('openInvoiceList', openInvoiceList);
				log.debug('End of getInputData');
				return openInvoiceList;


    			/*
    			invoiceSearchObj.id="customsearch1678900444436";
    			invoiceSearchObj.title="CHT Shubham (copy)";
    			var newSearchId = invoiceSearchObj.save();
    			*/
    		
    	}catch(e){
    		log.error("Error in getInputData", e)
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
    		log.debug('In Map Stage', 'In Map Stage');
			var invResults = JSON.parse(context.value);
			log.debug('invResults:', invResults);

			var m_custName = invResults.custName;
			var m_custTranid = invResults.custTranid;
			var m_invAmount = invResults.invAmount;
			var m_amountPaid = invResults.amountPaid;
			var m_custEmail = invResults.custEmail;
			log.debug('m_custName', m_custName);
			log.debug('m_custTranid', m_custTranid);
			log.debug('m_invAmount', m_invAmount);
			log.debug('m_amountPaid', m_amountPaid);
			log.debug('m_custEmail', m_custEmail);

			context.write({
				key : m_custTranid,
				value : {
					'm_custName' : m_custName,
					'm_custTranid' : m_custTranid,
					'm_invAmount':m_invAmount,
					'm_invAmount' : m_invAmount,
					'm_custEmail' : m_custEmail
				}
			});
    	}
    	catch(e){
    		log.error('error in map function');
    	}

    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
    	try{
  		  log.debug('In Reduce Stage');
  		  log.debug('Key',context.key);
  		  log.debug('value',context.values);
  		  log.debug('value Length',context.values.length);
  		
  		  var key = context.key;
  		  var values = context.values;

  		  var csv = '';

  		  for (var i = 0; i < values.length; i++) {
  		    csv += key + ',' + values[i] + '\n';
  		  }

  		  context.write(key, csv);
  		  log.debug('Saved Search Invoice');
  		
  	}catch(e){
  		log.error('Error in Reduce Stage',e);
  	}

    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    	try{
    		
    	}catch(e){
    		log.error('error in summarize function',e);
    	}

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
