/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define([ 'N/ui/serverWidget', 'N/runtime', 'N/redirect', 'N/url',
		'N/record' ],

function(serverWidget, runtime, redirect, url, record) {

	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(context) {
      
		var scriptParam = runtime.getCurrentScript();

		var request = context.request;
		var response = context.responce;

		if (request.method == "GET") {

			log.debug("Total Governance Units : "
					+ scriptParam.getRemainingUsage());

			var form = serverWidget.createForm({
				title : 'Enter Sales Order'
			});

			var so = form.addField({
				id : 'cust_so',
				type : serverWidget.FieldType.TEXT,
				label : 'Sales Order',

			});
          

			form.addSubmitButton({
				label : 'Save',
			});
          form.clientScriptModulePath='SuiteScripts/CHT CS Sales Order SV.js';

			context.response.writePage(form);
			return true;

		} else {
			if (request.method == "POST") {
				log.debug("in post function");

				var request = context.request;
				var currentuser = runtime.getCurrentUser().id;
				log.debug("currentuser", currentuser);

				var salesOrder = request.parameters.cust_so;
				log.debug('salesOrder', salesOrder);
              

   
              redirect.toRecord({
    type: record.Type.SALES_ORDER,
    id: salesOrder
   
});

 


			

			}
		}
	}

	return {
		onRequest : onRequest
	};

});
