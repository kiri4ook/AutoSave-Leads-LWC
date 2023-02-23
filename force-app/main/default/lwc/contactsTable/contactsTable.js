import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
export default class ContactsTable extends LightningElement {
   @track columns = [
      { label: 'Name', fieldName:'recordLink', type: 'url', 
      typeAttributes: {label: {fieldName: "ContactName"}, tooltip: "Name", linkify: true} },
   ];
   @track contacts;
   @track names;
   @track ids;
   @wire(getContacts)
   wiredContacts(value) {
      const {error, data} = value;
      if (data) {
         let contactData = JSON.parse(JSON.stringify(data));  
         contactData.forEach(record => {
            record.recordLink = "/" + record.Id;  
            record.ContactName = record.Name;
         });
         this.contacts = contactData;
         this.concatenateCols(contactData);
      } else if (error) {
         this.error = error;
      }
   }
   concatenateCols(data) {
      this.columns = [...this.columns, { label: 'idName', fieldName: 'idName' }];
      this.contacts = data.map(item => {
         return {idName: `${item.Id}${item.Name}`, ...item };
      });
   }
}