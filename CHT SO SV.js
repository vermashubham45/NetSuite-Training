/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search'],
/**
 * @param {record} record
 * @param {runtime} runtime
 * @param {search} search
 */
function(record, runtime, search) {
   
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
    		var array = [];
    		var salesorderSearchObj = search.create({
    			   type: "salesorder",
    			   filters:
    			   [
    			      ["type","anyof","SalesOrd"], 
    			      "AND", 
    			      ["name","anyof","23364"]
    			   ],
    			   columns:
    			   [
    			      search.createColumn({name: "entity", label: "Name"}),
    			      search.createColumn({name: "internalid", label: "Internal ID"}),
    			      search.createColumn({name: "tranid", label: "Document Number"}),
    			      search.createColumn({name: "statusref", label: "Status"}),
    			      search.createColumn({name: "amount", label: "Amount"})
    			   ]
    			});
    			var searchResultCount = salesorderSearchObj.runPaged().count;
    			log.debug("salesorderSearchObj result count",searchResultCount);
    			salesorderSearchObj.run().each(function(result){
    			   // .run().each has a limit of 4,000 results
    				var cust_Name;
    			    var tran_Id;
                    var doc_Num; 
    		    	var amnt;
    		    	var sts;
    		    	
    		    	cust_Name = result.getValue('entity');
    				log.debug("cust_Name",cust_Name);

    				tran_Id = result.getValue('internalid');
    				log.debug("tran_Id",tran_Id);

    				doc_Num =  result.getValue('tranid');
    				log.debug('doc_Num',doc_Num);

    				amnt = result.getValue('amount');
    				log.debug('amnt',amnt);
                    
    				sts = result.getValue('statusref');
    				log.debug('sts',sts);

    				array.push({
    					'cust_Name':cust_Name,
    					'tran_Id':tran_Id,
    					'doc_Num':doc_Num,
    					'sts':sts,
                        'amnt':amnt

    				});
    				
    				
    			   return true;
    			});
    			log.debug('array',array);
				return array;
				 

    			/*
    			salesorderSearchObj.id="customsearch1680199916475";
    			salesorderSearchObj.title="SO Saved Search SV PB (copy)";
    			var newSearchId = salesorderSearchObj.save();
    			*/
    	}catch(e){
    		log.error('Error in getInputData',e);
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
    		log.debug('in map stage','in map stage');
    		var soRes = JSON.parse(context.value);
			log.debug('soRes:',soRes);
          
         
			var m_cust_Name = soRes.cust_Name;
			var m_tran_Id = soRes.tran_Id;
			var m_amnt = soRes.amnt;
			var m_sts = soRes.sts;
            var m_doc_Num = soRes.doc_Num;

			log.debug('m_cust_Name',m_cust_Name);
			log.debug('m_tran_Id',m_tran_Id);
			log.debug('m_amnt',m_amnt);
			log.debug('m_sts',m_sts);
            log.debug('m_doc_Num',m_doc_Num);

			context.write({
				key : m_tran_Id,
				value :{
					'm_cust_Name':m_cust_Name,
					'm_tran_Id':m_tran_Id,
					'm_amnt':m_amnt,
					'm_doc_Num':m_doc_Num,
                    'm_sts':m_sts
                    
				}
			});
    	}catch(e){
    		log.error('error in map stage',e);
    		
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
    		log.debug('in reduce stage','in reduce stage')
    		
    		log.debug('key :', context.key);
			log.debug('value:', context.values);
			log.debug('value Length:', context.values.length);
           // var mykey = context.key;
          
          for(var i = 0; i <context.values.length; i++){
             var parse = JSON.parse(context.values[i]);

			var r_tran_Id = parse.m_tran_Id;
            log.debug('r_tran_Id', r_tran_Id);
          }

       var objRecord= record.transform({
   fromType:'salesorder',
   fromId: r_tran_Id,
   toType: 'invoice',
   defaultValues: {
   billdate: '01/01/2019'} 
       
       });
       log.debug('Invoice Created Successfully');
    		
    	}catch(e){
    		log.error('error in reduce',e)
    		
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
			log.error('Error in summarize',e);
		}

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
