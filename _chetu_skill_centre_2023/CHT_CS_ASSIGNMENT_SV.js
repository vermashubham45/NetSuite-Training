/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/url'],
/**
 * @param {record} record
 * @param {runtime} runtime
 * @param {serverWidget} serverWidget
 */
function(url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

    }
    function openCustomcreateButton() {
      alert("Hello Shubham");
      var output = url.resolveScript({
         scriptId: 'customscriptcht_sv_assignment',
          deploymentId: 'customdeploycht_sv_assignment',
          returnExternalUrl: true
      });
      
      window.open("https://tstdrv1911674.app.netsuite.com/app/site/hosting/scriptlet.nl?script=6368&deploy=1");
      return true;
    }

    
    return {
        pageInit: pageInit,
        openCustomcreateButton:openCustomcreateButton,
    };
    
});
