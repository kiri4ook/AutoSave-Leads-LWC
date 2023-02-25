public with sharing class LeadController {

   @AuraEnabled(cacheable=true)
   public static List<Lead> getLeads(){
      return[ 
               SELECT Id, Name, Title, Phone
               FROM Lead
               ORDER BY Name
      ];
   }
}
