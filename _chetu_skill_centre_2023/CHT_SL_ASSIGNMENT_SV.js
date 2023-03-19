/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/ui/serverWidget','N/email','N/record', 'N/file'],
		/**
		 * @param {runtime} runtime
		 */
		function(runtime,serverWidget,email,record, file) {

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
			var scriptParam = runtime.getCurrentScript();

			var request = context.request;
			var response = context.responce;
			var form = serverWidget.createForm({
				title: 'Send Email'
			});
			if(request.method === 'GET'){

				var datefield = form.addField({
					id: 'custpage_date',
					type: serverWidget.FieldType.DATE,
					label: 'Date'
				});
				var subject = form.addField({
					id: 'custpage_subject',
					type: serverWidget.FieldType.TEXT,
					label: 'Email Subject'
				});
			        var recipientEmail = form.addField({
					id: 'custpage_email',
					type: serverWidget.FieldType.EMAIL,
					label: 'Recipient email'
				});

			        recipientEmail.isMandatory = true;

				var emailBody = form.addField({
					id: 'custpage_email_body',
					type: serverWidget.FieldType.LONGTEXT,
					label: 'Email Body'
				});
				
              
                 var field = form.addField({
                  id : 'custpage_file',
                  type : serverWidget.FieldType.FILE,
                  label : 'Select File'
                });


				form.addSubmitButton({
					label: 'Send'
				});

				context.response.writePage(form);
				return true;
			}else{
				log.debug('In POST function');
				var request = context.request;
				var currentuser = runtime.getCurrentUser().id;
				log.debug('currentuser:',currentuser);
				
				
				var subject = request.parameters.custpage_subject;
				log.debug('subject:',subject);
				var recipient = request.parameters.custpage_email;
				log.debug('recipient:',recipient);
				var emailBody = request.parameters.custpage_email_body;
				log.debug('emailBody:',emailBody);
				var fileId=request.parameters.custpage_file;
				log.debug('fileId:',fileId);
				
				var fileObj = file.load({
				    id: 93725
				});
				email.send({
					author: currentuser,
					recipients: recipient,
					subject: subject,
					body: emailBody,
					attachments: [fileObj]
				});
				
				context.response.write('<body>Email has been sent Sucessfully.<script>setTimeout("window.close()",5000)</script></body>');


			}
			log.debug("Remaining Governance Units : " + scriptParam.getRemainingUsage());

		}catch(e){
			log.error("Error in onRequest function : " +e);
		}

	}

	return {
		onRequest: onRequest
	};

});