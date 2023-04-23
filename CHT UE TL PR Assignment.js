/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/error','N/record'],

function(search,error,record) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {
    	log.debug('In before submit');
    	
    	var new_record = scriptContext.newRecord;
    	
    	var fieldValue = new_record.getValue('custentity_claim_number_sv');
		
		if(scriptContext.type===scriptContext.UserEventType.DELETE){
 		   log.debug('Record Succesfully Deleted',new_record.id);
 	   }else{
   		 var entitySearchObj = search.create({
   			   type: "entity",
   			   filters:
   			   [
   			      ["custentity_claim_number_sv","is",fieldValue]
   			   ],
   			   columns:
   			   [
   			      search.createColumn({name: "custentity_claim_number_sv", label: "Claim Number SV"})
   			   ]
   			});
   		    var claim_num;
   			var searchResultCount = entitySearchObj.runPaged().count;
   			log.debug("entitySearchObj result count",searchResultCount);
   			entitySearchObj.run().each(function(result){
   			   // .run().each has a limit of 4,000 results
   				claim_num=result.getValue('custentity_claim_number_sv');
   			   return true;
   			});
   		
   		log.debug("jobSearchObj result count",searchResultCount);
   	    if (fieldValue === claim_num){
   	    	throw error.create({
   	    		name:'Error',
   	    		message:'Claim Number is alredy exist in your Record'
   	    	}); 
   	    	
   	    } 
   	   
   	   }
    
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {

    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
