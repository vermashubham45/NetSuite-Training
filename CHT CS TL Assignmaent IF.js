/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([ 'N/search', 'N/record', 'N/currentRecord' ],

		function(search, record, currentRecord) {

			/**
			 * Function to be executed after page is initialized.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.mode - The mode in which the record is
			 *            being accessed (create, copy, or edit)
			 * 
			 * @since 2015.2
			 */
			function pageInit(scriptContext) {
				try {
					// alert('in pageint');

					var currentRecord = scriptContext.currentRecord;

					var salesId = currentRecord.getValue({   //Here i am getting the id of the sales order to generate the invoice.
						fieldId : 'createdfrom',
					});

					// alert('salesId:' + salesId);

					if (salesId) {

						var salesOrd = record.load({		// Here i am loading the sales order.
							type : record.Type.SALES_ORDER,
							id : salesId
						});
						var lineCount = currentRecord.getLineCount({	//Getting sublist line count.
							sublistId : 'item'
						});
						alert('lineCount' + lineCount);

						var i = 0;
						while (i < lineCount) {

							var Field = currentRecord.getSublistValue({		//Here i am getting the item of the sublist line.
								sublistId : 'item',
								fieldId : 'item',
								line : i
							});
							// alert('field'+Field);

							var itemfulfillmentSearchObj = search.create({		//Creating saved search for item fulfillment.
								type : "itemfulfillment",
								filters : [ [ "type", "anyof", "ItemShip" ],
										"AND",
										[ "createdfrom", "anyof", salesId ],
										"AND", [ "item", "anyof", Field ] ],
								columns : [ search.createColumn({
									name : "internalid",
									label : "Internal ID"
								}), search.createColumn({
									name : "createdfrom",
									label : "Created From"
								}), search.createColumn({
									name : "tranid"
								}) ]
							});
							var item = '';
							var searchResultCount = itemfulfillmentSearchObj.runPaged().count;	
							alert("itemfulfillmentSearchObj result count"+ searchResultCount);
							itemfulfillmentSearchObj.run().each(
									function(result) {
										item += result.getValue({		//Getting item fulfillment number.
											name : "tranid"
										}) + '/';

										alert('item:' + item);

										currentRecord.selectLine({		
											sublistId : 'item',
											line : i
										});
										currentRecord.setCurrentSublistValue({	//set the item fulfillment number on line label field in invoice which is created by me.
											sublistId : 'item',
											fieldId : 'custcol_if_number_sv',
											value : item
										});

										currentRecord.commitLine({
											sublistId : 'item',
										});

										return true;
									});

							i = i + 1;
							// alert('i' + i);
						}
					}
				} catch (e) {
					alert('error in pagint' + e);
				}

			}

			function saveRecord(scriptContext) {

			}

			return {
				pageInit : pageInit,
				// fieldChanged: fieldChanged,
				// postSourcing: postSourcing,
				// sublistChanged: sublistChanged,
				// lineInit: lineInit,
				// validateField: validateField,
				// validateLine: validateLine,
				// validateInsert: validateInsert,
				// validateDelete: validateDelete,
				saveRecord : saveRecord
			};

		});
