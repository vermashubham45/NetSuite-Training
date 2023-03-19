/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/ui/serverWidget','N/url','N/record','N/format','N/file'],

function(runtime,serverWidget,url,record,format,file) {
   
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
    		log.debug('Total Governance Units :'+scriptParam.getRemainingUsage());
    		
    		var request = context.request;
    		var responese = context.response;
    		
    		
    		
    		
    		if(request.method ==='GET'){
              var form =  serverWidget.createForm({
				title:'Job Application Form'
			});
              var field = form.addField({
    		    id : 'custpage_name',
    		    type : serverWidget.FieldType.TEXT,
    		    label : 'Name'
    		});
              field.isMandatory = true;
            field.layoutType = serverWidget.FieldLayoutType.NORMAL;
            field.updateBreakType({
                breakType: serverWidget.FieldBreakType.STARTCOL
            });
           
            var Contact = form.addField({
                id: 'custpage_sv_contact',
                type: serverWidget.FieldType.PHONE,
                label: 'Contact No:'
            });
            Contact.isMandatory = true;
            var email=form.addField({
                id: 'custpage_sv_email',
                type: serverWidget.FieldType.EMAIL,
                label: 'Email Id:'
            });
            email.isMandatory = true;
            form.addField({
                id: 'custpage_sv_date',
                type: serverWidget.FieldType.DATE,
                label: 'Date'
            });
         
           var select = form.addField({
                id: 'custpage_sv_apply_for',
                type: serverWidget.FieldType.SELECT,
                label: 'Please Select'
            });
            select.addSelectOption({
                value: '1',
                text: 'Software developer'
            });
            select.addSelectOption({
                value: '2',
                text: 'UI/UX Designer'
            });
            select.addSelectOption({
                value: '3',
                text: 'Full Stack Developer'
            });
            select.addSelectOption({
                value: '4',
                text: 'Frontend Developer'
            });
            var select = form.addField({
                id: 'custpage_experience',
                type: serverWidget.FieldType.SELECT,
                label: 'Select'
            });
            select.addSelectOption({
                value: '1',
                text: '0-1 Years'
            });
            select.addSelectOption({
                value: '2',
                text: '1-3 Years'
            });
            select.addSelectOption({
                value: '3',
                text: '3-5 Years'
            });
            var select = form.addField({
                id: 'custpage_stream_sv',
                type: serverWidget.FieldType.SELECT,
                label: 'Select Here'
            });
            select.addSelectOption({
                value: '1',
                text: 'B.Tech/M.Tech(CSE)'
            });
            
            select.addSelectOption({
                value: '2',
                text: 'BCA/MCA'
            });
            
            form.addField({
                id: 'custpage_resume_upload',
                type: serverWidget.FieldType.FILE,
                label: 'Upload Resume'
            });
            var relocate = form.addField({
                id: 'custpage_relocatesv',
                type: serverWidget.FieldType.INLINEHTML,
                label: ' '
                }).updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.NORMAL
            }).updateBreakType({
                breakType: serverWidget.FieldBreakType.STARTROW
            }).defaultValue = '<p style=\'font-size:14px\'>Are you willing to relocate?</p>';
     		
            form.addField({
                id: 'custpage_sv_relocate',
                type: serverWidget.FieldType.RADIO,
                label: 'Yes',
                source: 'p1'
            }).updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.STARTROW
            });
            form.addField({
                id: 'custpage_sv_relocate',
                type: serverWidget.FieldType.RADIO,
                label: 'No',
                source: 'p2'
            }).updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.MIDROW
            });
            

            form.addSubmitButton({
                label: 'Submit'
            });
    			context.response.writePage(form);
    		}else{
              log.debug('In POST function');
              var request = context.request;
    			
             
            const textField = request.parameters.custpage_name;
            log.debug('textField:',textField);
            const contact = request.parameters.custpage_sv_contact;
            log.debug('contact:',contact);
            const dateField = request.parameters.custpage_sv_date;
            log.debug('dateField:',dateField);
            const emailId = request.parameters.custpage_sv_email;
            log.debug('emailId:',emailId);
            const applyFor = request.parameters.custpage_sv_apply_for;
            log.debug('applyFor:',applyFor);
            const status =request.parameters.custpage_experience;
            log.debug('status:',status);
            const stream = request.parameters.custpage_stream_sv;
            log.debug('stream:',stream);
            const file = request.parameters.custpage_resume_upload;
            log.debug('file:',file);
            
              
               var custRec = record.create({
               type: 'customrecordjob_application_form_sv',
               isDynamic: true
               });
        custRec.setValue({
			    fieldId: 'name',
			    value: textField,
			    ignoreFieldChange: true
			    
			});
        custRec.setValue({
			    fieldId: 'custrecordcontact_no_sv',
			    value: contact,
			    ignoreFieldChange: true
			    
			});
                     custRec.setValue({
			    fieldId: 'custrecordemail_id_sv',
			    value: emailId,
			    ignoreFieldChange: true
			    
			});
                    var formatedDate = format.parse({
                    value: dateField,
                    type: format.Type.DATE
                });
                custRec.setValue('custrecorddate_sv', formatedDate);
         custRec.setValue({
			    fieldId: 'custrecordupload_resume',
			    value: file,
			    ignoreFieldChange: true
			    
			});
                 custRec.setValue({
			    fieldId: 'custrecordapply_for',
			    value: applyFor
			    
			    
			});
                   custRec.setValue({
			    fieldId: 'custrecordexperience_sv',
			    value: status
			    
			    
			});

            
                custRec.setValue({
			    fieldId: 'custrecord_select_stream',
			    value: stream
			 
			    
			});
               var saveRec = custRec.save();

            context.response.write('<body style="color:blue;background-color: grey;text-align: center;">Record Saved Sucessfully.<script>setTimeout("window.close()",5000)</script></body>');

            
    		}
    		log.debug('Remaining Governance units :' +scriptParam.getRemainingUsage());
       	}
      catch(e){
    		log.error('Error in SuiteLet SendEmail Script',e);
    	}
    }

    return {
        onRequest: onRequest
    };
    
});


