/**
 * new
 * 
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(
		[ 'N/file', 'N/record', 'N/runtime', 'N/search' ],

		function(file, record, runtime, search) {

			/**
			 * Marks the beginning of the Map/Reduce process and generates input
			 * data.
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
					var openInvList = [];
					var invoiceSearchObj = search.create({
						type : "invoice",
						filters :  [
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
						columns : [ search.createColumn({name: "tranid", label: "Document Number"}),
				    			      search.createColumn({name: "entity", label: "Name"}),
				    			      search.createColumn({name: "amount", label: "Amount"}),
				    			      search.createColumn({name: "amountpaid", label: "Amount Paid"}),
				    			      search.createColumn({name: "email", label: "Email"})
						 ]
					});
					var searchResultCount = invoiceSearchObj.runPaged().count;
					log.debug("invoiceSearchObj result count",
							searchResultCount);
					var custEmail;
					var custTranid;
					var amountPaid;
					var custName;
					var invAmount;
					invoiceSearchObj.run().each(function(result) {

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
						openInvList.push({

							'custTranid' : custTranid,
							'amountPaid' : amountPaid,
							'custName' : custName,
							'invAmount' : invAmount,
							'custEmail' : custEmail
						});

						return true;
					});
					log.debug('openInvList', openInvList);
					log.debug('End of getInputData');
					return openInvList;

					/*
	    			invoiceSearchObj.id="customsearch1678900444436";
	    			invoiceSearchObj.title="CHT Shubham (copy)";
	    			var newSearchId = invoiceSearchObj.save();
	    			*/
				} catch (e) {
					log.error("Error in getInputData", e)
				}

			}

			/**
			 * Executes when the map entry point is triggered and applies to
			 * each key/value pair.
			 * 
			 * @param {MapSummary}
			 *            context - Data collection containing the key/value
			 *            pairs to process through the map stage
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
						key : m_invAmount,
						value : {
							'm_custName' : m_custName,
							'm_custTranid' : m_custTranid,
							'm_invAmount':m_invAmount,
							'm_amountPaid' : m_amountPaid,
							'm_custEmail' : m_custEmail
						}
					});

				} catch (e) {
					log.error('Error in map', e);
				}

			}

			/**
			 * Executes when the reduce entry point is triggered and applies to
			 * each group.
			 * 
			 * @param {ReduceSummary}
			 *            context - Data collection containing the groups to
			 *            process through the reduce stage
			 * @since 2015.1
			 */
			function reduce(context) {

				try {
					var value = context.values;
					var value_Length = context.values.length;

					log.debug('In Reduce Stage');
			  		  log.debug('Key',context.key);
			  		  log.debug('value',context.values);
			  		  log.debug('value Length',context.values.length);
			  		  
			  		var r_custName;
					var r_custTranid;
					var r_invAmount;
					var r_amountPaid;
					var r_custEmail;
					
					
					
					var csvData = " ";
					csvData = "Customer ID,Document Number,Amount,Amount Paid,Customer Email\n' + row + '\n";
					
					
					   var mySearch = search.load({
						      id: 'customsearch_saved_search_sv'
						    });

						    // Run the search and get the results
						    var searchResults = mySearch.run().getRange({
						      start: 0,
						      end: 1000
						    });
						    var csvFile = file.create({
								name : 'Invoice.csv',
								contents : csvData,
								folder : 13603,
								fileType : 'CSV'
							});
						    
						    for (var i = 0; i < searchResults.length; i++) {
						        var r_custName = searchResults[i].getValue({
						          name: 'entity'
						        });
						        log.debug('r_custName:',r_custName);
						        var r_custTranid = searchResults[i].getValue({
						          name: 'tranid'
						        });
						        log.debug('r_custTranid:',r_custTranid);
						        var r_invAmount = searchResults[i].getValue({
							          name: 'amount'
							        });
						        var r_amountPaid = searchResults[i].getValue({
							          name: 'amountpaid'
							        });
						        var r_custEmail = searchResults[i].getValue({
							          name: 'email'
							        });
						        var line =  r_custName + ',' + r_custTranid + ',' + r_invAmount + ',' + r_amountPaid + ',' + r_custEmail+'\n';
						        csvFile.appendLine({
						          value: line
						        });
						      }
						    
							 var csvFileId = csvFile.save();
								log.debug("file created succesfully");
					
					
								/*var csvData = " ";
					csvData = "Customer Name,Customer Transaction ID,Invoice Amount,Customer Email\n";
					
					
					   var mySearch = search.load({
						      id: 'customsearch_cht_invoice_open_sr'
						    });
					   var csvFile = file.create({
							name : 'data.csv',
							contents : csvData,
							folder : 13599,
							fileType : 'CSV'
						});
						    
					for (cA = 0; cA < value_Length; cA++) {

						var invResults = JSON.parse(value[cA]);
						log.debug('invResults cA:', invResults);
						

					/*for ( var prop in invResults) {
						if (invResults.hasOwnProperty(prop)) {
						csvString += invResults[prop] + ",";
					}
					}
					
						 
						 
						
						 r_custName = invResults.m_custName;
						 log.debug("r_custName", r_custName);
						 
						 r_custTranid = invResults.m_custTranid;
						 log.debug("r_custTranid", r_custTranid);
						  
						 r_invAmount = invResults.m_invAmount;
						 log.debug("r_invAmount", r_invAmount);
						 
						 r_custEmail = invResults.m_custEmail;
						 log.debug("r_custEmail", r_custEmail);
						 
					        var line =  r_custName + ',' + r_custTranid + ',' + r_invAmount + ',' + r_custEmail+'\n';
					        csvFile.appendLine({
					          value: line
					        });	
						
						/* csvData += r_custName + ',' + r_custTranid + ',' + r_invAmount + ',' + r_custEmail+ '\n';
						 log.debug("csvData cA", csvData[invResults]); 
						 
						
						// Save the file
					}
					
					 
					var csvFileId = csvFile.save();
					log.debug("file created succesfully");*/

				} catch (e) {
					log.error('Error in reduce', e);
				}

			}

			/**
			 * Executes when the summarize entry point is triggered and applies
			 * to the result set.
			 * 
			 * @param {Summary}
			 *            summary - Holds statistics regarding the execution of
			 *            a map/reduce script
			 * @since 2015.1
			 */
			function summarize(summary) {

			}

			return {
				getInputData : getInputData,
				map : map,
				reduce : reduce,
				summarize : summarize
			};

		});
