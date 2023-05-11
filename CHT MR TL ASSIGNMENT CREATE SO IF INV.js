/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/record', 'N/runtime', 'N/search','N/runtime'],
/**
 * @param {file} file
 * @param {record} record
 * @param {runtime} runtime
 * @param {search} search
 */
function(file, record, runtime, search,runtime) {
   
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
    	try{
    		log.debug('In getInputData','In getInputData');
    		var scriptObj = runtime.getCurrentScript();
    		 var Fileid=scriptObj.getParameter({name: 'custscript_fileid_'});
    		 log.debug('Fileid',Fileid);
    		 var aRray=[];
    		 var fileName='';
			if(Fileid){
		     aRray.push({'Fileid':Fileid,'fileName':fileName});
			}
				    	
  		   log.debug('aRray',aRray);
    		return aRray;
	
    }
   
    catch(e){
    	log.error("Error in getInputData",e);
    }
    }
    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	  try{
    	      	log.debug('In Map Stage','In Map Stage');
    	  		var invResults = JSON.parse(context.value);
    	  		log.debug('invResults:',invResults);

    	  		var m_fileId = invResults.Fileid;
    	  		log.debug('m_fileId',m_fileId);
    	  		
    	  		var fileObj = file.load({
    	  		    id: m_fileId
    	  		});
    	  		var fileContents;
    	  		if (fileObj.size < 10485760){
    	  		fileContents=  fileObj.getContents();
    	  		log.debug('fileContents',fileContents);
    	  		    }
    	  		
    	  		log.debug('Value_length',context.value.length);
    	  		 var csvData = fileContents.split(/\r?\n/).map(function (line) {
    	  		      return line.split(',');
    	  		    });

    	  		
    	  		  var rows = csvData.slice(1); 
    	  	    for (var i = 0; i < rows.length-1; i++) {
    	  	      var m_externalId = rows[i][0];
    	  	      var m_customer = rows[i][1];
    	  	      var m_item = rows[i][2];
    	  	      var m_quantity = rows[i][3];
    	  	      var m_rate = rows[i][4];
    	  	      var m_amount = rows[i][5];
    	  	      var m_location = rows[i][6];
    	  	      var m_taxCode = rows[i][7];

    	  	     
    	  	    context.write({
        	  			key :m_externalId,
        	  			value :{
        	  				'm_fileId':m_fileId,
        	  				'm_customer':m_customer,
        	  				'm_externalId':m_externalId,
        	  				'm_item':m_item,
        	  				'm_quantity':m_quantity,
        	  				'm_rate':m_rate,
        	  				'm_amount':m_amount,
        	  				'm_location':m_location,
        	  				'm_taxCode':m_taxCode
        	  				
        	  			}
        	  		});
    	  			
    	  		}

    	  	}catch(e){
    	  		log.error('Error in map',e);
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
    		log.debug("In reduce Stage");
    		var value = context.values;
    		log.debug('value:',value);
    		var value_Length=context.values.length;
    		log.debug('value_Length:',value_Length);
    		log.debug('Key:',context.key);
    		
    		var r_fileId;
    		var r_customer;
    		var r_externalId;
    		var r_item;
    		var r_quantity;
    		var r_rate;
    		var r_amount;
    		var r_location;
    		var r_taxCode;
    		
    		var invRecord = record.create({
				type : record.Type.SALES_ORDER,
			
			});
    		
    		for(cA = 0; cA < value_Length; cA++){

    			var invResults = JSON.parse(value[cA]);
    			log.debug('invResults cA:',invResults);

    			r_fileId = invResults.m_fileId;
    			log.debug("r_fileId", r_fileId);
    			
    			r_customer = invResults.m_customer;
    			log.debug("r_customer", r_customer);
    			
    			r_externalId = invResults.m_externalId;
    			log.debug("r_externalId", r_externalId);
    			
    			r_item = invResults.m_item;
    			log.debug("r_item", r_item);
    			
    			r_quantity = invResults.m_quantity;
    			log.debug("r_quantity", r_quantity);
    			
    			r_rate = invResults.m_rate;
    			log.debug("r_rate", r_rate);
    			
    			r_amount = invResults.m_amount;
    			log.debug("r_amount", r_amount);
    			
    			r_location = invResults.m_location;
    			log.debug("r_location", r_location);
    			
    			r_taxCode = invResults.m_taxCode;
    			log.debug("r_taxCode", r_taxCode);
    			

    			
    			invRecord.setValue({
    				fieldId : 'entity',
    				value : r_customer
    			});
    			log.debug('Customer selected');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'item',
    			    line: cA,
    			    value: r_item,
    			});
    			log.debug('Item selected');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'quantity',
    			    line: cA,
    			    value:r_quantity
    			});
    			log.debug('Quantity described');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'rate',
    			    line: cA,
    			    value: r_rate
    			});
    			log.debug('Rate described');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'amount',
    			    line: cA,
    			    value: r_amount
    			});
    			log.debug('Amount calculated');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'location',
    			    line: cA,
    			    value: r_location
    			});
    			log.debug('Location filled');
    			
    			invRecord.setSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'taxcode',
    			    line: cA,
    			    value: invResults['m_taxCode']
    			});
    			log.debug('Tax code selected');
    			
    			
    		
    		}
    		var invoiceId = invRecord.save();
			log.debug('Invoice created and Id is', invoiceId);
			var objRecord = record.transform({
			    fromType: record.Type.SALES_ORDER,
			    fromId: invoiceId,
			    toType: record.Type.INVOICE,
			    isDynamic: true,
			});
			objRecord.save();
			var objRecord1 = record.transform({
			    fromType: record.Type.SALES_ORDER,
			    fromId: invoiceId,
			    toType: record.Type.ITEM_FULFILLMENT,
			    isDynamic: true,
			});
			objRecord1.save();
			
    		  }
     catch(e){
    		log.error("Error In Reduce Stage",e)
    	}

    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
