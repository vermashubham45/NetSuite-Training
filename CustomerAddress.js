/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/record','N/search','N/redirect'],

		function(serverWidget, record, search, redirect) {

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

			// Create the form and sublist
			var request=context.request;
			var response=context.response;
			var form = serverWidget.createForm({
				title: 'Customer List'
			});

			if(request.method==='GET'){
				
				var customerName = request.parameters.customerName;
				log.debug('Get - CustomerName:',customerName);
				
				var nameField = form.addField({
					id: 'custname',
					type: serverWidget.FieldType.SELECT,
					label: 'Customer Name',
					source:'CUSTOMER'
				});
				if(customerName){
					nameField.defaultValue = customerName;
				}
				
				var addressSublist = form.addSublist({
					id: 'addresses',
					type: serverWidget.SublistType.INLINEEDITOR,
					label: 'Address'
				});
				addressSublist.addField({
					id: 'addressee',
					type: serverWidget.FieldType.TEXT,
					label: 'Address',
				});
				addressSublist.addField({
					id: 'cust_address',
					type: serverWidget.FieldType.TEXT,
					label: 'Address 1',
				});
				addressSublist.addField({
					id: 'cust_add',
					type: serverWidget.FieldType.TEXT,
					label: 'Address 2',
				});
				addressSublist.addField({
					id: 'cust_coun',
					type: serverWidget.FieldType.TEXT,
					label: 'Country',
				});
				addressSublist.addField({
					id: 'cust_city',
					type: serverWidget.FieldType.TEXT,
					label: 'City',
				});
				addressSublist.addField({
					id: 'cust_postal',
					type: serverWidget.FieldType.TEXT,
					label: 'Postal Code',
				});
				addressSublist.addField({
					id: 'cust_def_shipping',
					type: serverWidget.FieldType.CHECKBOX,
					label: 'Default Shipping Address',
				});
				addressSublist.addField({
					id: 'cust_def_billing',
					type: serverWidget.FieldType.CHECKBOX,
					label: 'Default Billing Address',
				});

				
				if(customerName){
					// Define the customer search
					var customerSearchObj = search.create({
						type: "customer",
						filters:
							[
							 ["internalid","anyof",customerName]
							 ],
							 columns:
								 [
								  search.createColumn({name: "entityid", sort: search.Sort.ASC,label: "Name"   }),
								  search.createColumn({name: "address", label: "Address"}),
								  search.createColumn({name: "address1", label: "Address 1"}),
								  search.createColumn({name: "address2", label: "Address 2"}),
								  search.createColumn({name: "zipcode", label: "Zip Code"}),
								  search.createColumn({name: "country", label: "Country"}),
								  search.createColumn({name: "city", label: "City"}),
								  search.createColumn({name: "isdefaultbilling", label: "Default Billing Address"}),
							      search.createColumn({name: "isdefaultshipping", label: "Default Shipping Address"})
								  ]
					});
					var custAddress='';
					var custCountry='';
					var custZip='';
					var custAdd1='';
					var custAdd2='';
					var custCity='';
					var custShip='';
					var custBill='';

					var searchResultCount = customerSearchObj.runPaged().count;
					log.debug("customerSearchObj result count",searchResultCount);
					customerSearchObj.run().each(function(result){
						custAddress=result.getValue('address');
						custCountry=result.getValue('country');
						custZip=result.getValue('zipcode');
						custAdd1=result.getValue('address1');
						custAdd2=result.getValue('address2');
						custCity=result.getValue('city');
						custShip=result.getValue('isdefaultshipping');
						custBill=result.getValue('isdefaultbilling');
						return true;
					});
					log.debug('custAddress',custAddress);
					log.debug('custCountry',custCountry);
					log.debug('custZip',custZip);
					log.debug('custAdd1',custAdd1);
					log.debug('custAdd2',custAdd2);
					log.debug('custCity',custCity);
					log.debug('custShip',custShip);
					log.debug('custBill',custBill);
					
					
					if(customerName){
						addressSublist.setSublistValue({
							id:'addressee',
							line: 0,
							value:custAddress
						});
						addressSublist.setSublistValue({
							id:'cust_coun',
							line: 0,
							value:custCountry
						});
						addressSublist.setSublistValue({
							id:'cust_postal',
							line: 0,
							value:custZip
						});
						addressSublist.setSublistValue({
							id:'cust_address',
							line: 0,
							value:custAdd1
						});
						addressSublist.setSublistValue({
							id:'cust_add',
							line: 0,
							value:custAdd2
						});
						addressSublist.setSublistValue({
							id:'cust_city',
							line: 0,
							value:custCity
						});
						addressSublist.setSublistValue({
							id:'isdefaultshipping',
							line: 0,
							value:custShip
						});
						addressSublist.setSublistValue({
							id:'isdefaultbilling',
							line: 0,
							value:custBill
						});
					}
				}

				form.clientScriptFileId = 106149;

				form.addSubmitButton({
					label:'Save'
				});


				context.response.writePage(form);
			}else{
				var customerName = request.parameters.custname;
				redirect.toSuitelet({
					scriptId: 'customscript_cht_sl_cust_add_sv',
					deploymentId: 'customdeploy_customer_address_sv',
					parameters:{'customerName':customerName}
				});

			}


		}catch(e){
			log.error("Error in Suitelet",e);
		}
	}

	return {
		onRequest: onRequest
	};

});