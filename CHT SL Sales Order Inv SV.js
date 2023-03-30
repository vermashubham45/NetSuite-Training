/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search','N/ui/serverWidget'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search,serverWidget) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	try{
			var request = context.request;
			var response = context.response;
			var array = [];
			
			if (request.method === 'GET') {
				
				var form = serverWidget.createForm({
					title : 'Invoice List'
				});
				
				var invoice = form.addSublist({
					id : 'cust_inv',
					type : serverWidget.SublistType.INLINEEDITOR,
					label : 'INVOICE'
				});
				invoice.addField({
					id : 'cust_int',
					type : serverWidget.FieldType.TEXT,
					label : 'Internal ID',
				});
				invoice.addField({
					id : 'cust_doc',
					type : serverWidget.FieldType.TEXT,
					label : 'Document Number',
				});
				invoice.addField({
					id : 'cust_sts',
					type : serverWidget.FieldType.TEXT,
					label : 'Status',
				});
				invoice.addField({
					id : 'cust_amnt',
					type : serverWidget.FieldType.TEXT,
					label : 'Amount',
				});
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
	     			      
	     			      search.createColumn({name: "internalid", label: "Internal ID"}),
	     			      search.createColumn({name: "tranid", label: "Document Number"}),
	     			      search.createColumn({name: "statusref", label: "Status"}),
	     			      search.createColumn({name: "amount", label: "Amount"})
	     			   ]
	     			});
				var Int_Id;
                var docNum; 
		    	var Amount;
		    	var Status;
		    	var searchResultCount = salesorderSearchObj.runPaged().count;
    			log.debug("salesorderSearchObj result count",searchResultCount);
    			salesorderSearchObj.run().each(function(result){
    				Int_Id = result.getValue('internalid');
						log.debug("Int_Id",Int_Id);

						docNum =  result.getValue('tranid');
						log.debug('docNum',docNum);

						Amount = result.getValue('amount');
						log.debug('Amount',Amount);
		                
						Status = result.getValue('statusref');
						log.debug('Status',Status);
						
						array.push({

							'Int_Id' : Int_Id,
							'docNum' : docNum,
							'Amount' : Amount,
							'Status' : Status
							});
						log.debug('openInvoiceList', array);
                  
						return true;
				});
			
				 }
          log.debug('openInvoiceList.length',array.length)
          	if(Int_Id){
					
					
					for(i=0;i<array.length;i++){
					invoice.setSublistValue({
						id:'cust_int',
						line: i,
						value:array[i].Int_Id
					});
					invoice.setSublistValue({
						id:'cust_doc',
						line: i,
						value:array[i].docNum
					});
					invoice.setSublistValue({
						id:'cust_amnt',
						line: i,
						value:array[i].Amount
					});
					invoice.setSublistValue({
						id:'cust_sts',
						line: i,
						value:array[i].Status
					});
					
				
					 }
			}
			context.response.writePage(form);
			return true;
    	}
    	catch(e){
    		log.error('Error in onrequest', e);
    	}

    }

    return {
        onRequest: onRequest
    };
    
});
