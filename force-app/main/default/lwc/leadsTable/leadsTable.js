import { LightningElement, track, wire } from 'lwc';
import getLeads from '@salesforce/apex/LeadController.getLeads';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
const COLUMNS = [
   { label: 'Name', fieldName:'recordLink', type: 'url', 
   typeAttributes: {label: {fieldName: "LeadName"}, tooltip: "Name", linkify: true} },
   { label: 'Title', fieldName: 'Title', type: 'text', editable: true},
   { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true},
];
export default class LeadsTable extends LightningElement {
   @track columns = COLUMNS;
   @track leads;
   @track leadWireResponse;
   saveDraftValues = [];
   @wire(getLeads)
   wiredLeads(value) {
      const {error, data} = value;
      this.leadWireResponse = value;
      if (data) {
         let leadData = JSON.parse(JSON.stringify(data));  
         leadData.forEach(record => {
            record.recordLink = "/" + record.Id;  
            record.LeadName = record.Name;
         });  
         this.leads = leadData;
      } else if (error) {
         this.error = error;
      }
   }
   handleSave(event) {
      this.saveDraftValues = event.detail.draftValues;
      const recordInputs = this.saveDraftValues.slice().map(draft => {
         const fields = Object.assign({}, draft);
         return { fields };
      });

      const promises = recordInputs.map(recordInput => updateRecord(recordInput));
      Promise.all(promises).then(res => {
         this.ShowToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
         this.saveDraftValues = [];
         return this.refresh();
      }).catch(error => {
         this.ShowToast('Error', 'An Error Occured!!', 'error', 'dismissable');
      }).finally(() => {
         this.saveDraftValues = [];
      });
   }
   ShowToast(title, message, variant, mode){
      const evt = new ShowToastEvent({
         title: title,
         message:message,
         variant: variant,
         mode: mode
      });
      this.dispatchEvent(evt);
   }
   refresh() {
      refreshApex(this.leadWireResponse);
   }
}