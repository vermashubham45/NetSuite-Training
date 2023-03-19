/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/ui/serverWidget'],
		/**
		 * @param {record} record
		 */
		function(record, serverWidget) {

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
		try{
			log.debug('In BeforeLoad Function');
			if(scriptContext.type == 'view'){
				
				var testBtn = scriptContext.form.addButton({
				    id : 'custpage_test_btn',
				    label : 'Click Here',
				    functionName: ' openCustomcreateButton'
				});
				scriptContext.form.clientScriptModulePath = 'SuiteScripts/CHT_CS_ASSIGNMENT_SV.js';

				
			}
		}catch(e){
			log.error('Error in beforeLoad function: ',e);
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
	function beforeSubmit(scriptContext) {

		
			
		
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
		try{
			log.debug('In AS');			
			

		}catch(e){
			log.error('Error in afterSubmit function:',e);
		}
	}

	return {
		beforeLoad: beforeLoad,
		beforeSubmit: beforeSubmit,
		afterSubmit: afterSubmit
	};

});
