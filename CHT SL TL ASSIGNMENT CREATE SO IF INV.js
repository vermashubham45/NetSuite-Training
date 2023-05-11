/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget','N/file','N/task'],

function(serverWidget,file,task) {
   
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
			var response = context.responce;
			var form = serverWidget.createForm({
				title: 'Upload CSV File'
			});
			if(request.method === 'GET'){
				var file = form.addField({
					id: 'custpage_file',
					type: serverWidget.FieldType.FILE,
					label: 'Upload File'
				});
				form.addSubmitButton({
					label: 'Save'
				});

				context.response.writePage(form);
				}else{
					var fileName=request.files.custpage_file;
					log.debug('fileName',fileName);
					
					fileName.folder=15725;
					var fileId=fileName.save();
					log.debug('file is save',fileId);
				}
			if(fileId){
			var mrTask = task.create({
			    taskType: task.TaskType.MAP_REDUCE,
			    scriptId: 'customscript7346',
			    deploymentId: 'customdeploy1',
			    params: {
			        'custscript_fileid_':fileId
			    }
			    
			});
			mrTask.submit();
    	}
			
    		
    	}catch(e){
    		log.error('error in suitelet',e)
    	}

    }

    return {
        onRequest: onRequest
    };
    
});
